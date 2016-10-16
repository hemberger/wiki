"use strict";
// ===========================================
// REQUARKS WIKI
// 1.0.0
// Licensed under AGPLv3
// ===========================================

global.ROOTPATH = __dirname;
global.PROCNAME = 'SERVER';

// ----------------------------------------
// Load Winston
// ----------------------------------------

const _isDebug = process.env.NODE_ENV === 'development';
global.winston = require('./libs/winston')(_isDebug);
winston.info('[SERVER] Requarks Wiki is initializing...');

// ----------------------------------------
// Load global modules
// ----------------------------------------

var appconfig = require('./libs/config')('./config.yml');
global.lcdata = require('./libs/local').init(appconfig);
global.db = require('./libs/mongo').init(appconfig);
global.entries = require('./libs/entries').init(appconfig);
global.git = require('./libs/git').init(appconfig, false);
global.lang = require('i18next');
global.mark = require('./libs/markdown');
global.upl = require('./libs/uploads').init(appconfig);

// ----------------------------------------
// Load modules
// ----------------------------------------

const _ = require('lodash');
const autoload = require('auto-load');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const fork = require('child_process').fork;
const http = require('http');
const i18next_backend = require('i18next-node-fs-backend');
const i18next_mw = require('i18next-express-middleware');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const sessionMongoStore = require('connect-mongo')(session);
const socketio = require('socket.io');

var mw = autoload(path.join(ROOTPATH, '/middlewares'));
var ctrl = autoload(path.join(ROOTPATH, '/controllers'));
var libInternalAuth = require('./libs/internalAuth');

global.WSInternalKey = libInternalAuth.generateKey();

// ----------------------------------------
// Define Express App
// ----------------------------------------

global.app = express();
app.use(compression());

// ----------------------------------------
// Security
// ----------------------------------------

app.use(mw.security);

// ----------------------------------------
// Public Assets
// ----------------------------------------

app.use(favicon(path.join(ROOTPATH, 'assets', 'favicon.ico')));
app.use(express.static(path.join(ROOTPATH, 'assets')));

// ----------------------------------------
// Session
// ----------------------------------------

var strategy = require('./libs/auth')(passport, appconfig);

app.use(cookieParser());
app.use(session({
  name: 'requarkswiki.sid',
  store: new sessionMongoStore({
    mongooseConnection: db.connection,
    touchAfter: 15
  }),
  secret: appconfig.sessionSecret,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------
// Localization Engine
// ----------------------------------------

lang
  .use(i18next_backend)
  .use(i18next_mw.LanguageDetector)
  .init({
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
    saveMissing: false,
    supportedLngs: ['en', 'fr'],
    preload: ['en', 'fr'],
    fallbackLng : 'en',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  });

// ----------------------------------------
// View Engine Setup
// ----------------------------------------

app.use(i18next_mw.handle(lang));
app.set('views', path.join(ROOTPATH, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------
// View accessible data
// ----------------------------------------

app.locals._ = require('lodash');
app.locals.moment = require('moment');
app.locals.appconfig = appconfig;
app.use(mw.flash);

// ----------------------------------------
// Controllers
// ----------------------------------------

app.use('/', ctrl.auth);

app.use('/uploads', ctrl.uploads);
app.use('/admin', mw.auth, ctrl.admin);
app.use('/', ctrl.pages);

// ----------------------------------------
// Error handling
// ----------------------------------------

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: _isDebug ? err : {}
  });
});

// ----------------------------------------
// Start HTTP server
// ----------------------------------------

winston.info('[SERVER] Starting HTTP/WS server on port ' + appconfig.port + '...');

app.set('port', appconfig.port);
var server = http.createServer(app);
var io = socketio(server);

server.listen(appconfig.port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Listening on port ' + appconfig.port + ' requires elevated privileges!');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port ' + appconfig.port + ' is already in use!');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  winston.info('[SERVER] HTTP/WS server started successfully! [RUNNING]');
});

// ----------------------------------------
// WebSocket handlers
// ----------------------------------------

io.on('connection', ctrl.ws);

// ----------------------------------------
// Start child processes
// ----------------------------------------

var bgAgent = fork('agent.js', [WSInternalKey]);

process.on('exit', (code) => {
  bgAgent.disconnect();
});