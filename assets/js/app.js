"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function setInputSelection(e,t,o){if(e.focus(),"undefined"!=typeof e.selectionStart)e.selectionStart=t,e.selectionEnd=o;else if(document.selection&&document.selection.createRange){e.select();var a=document.selection.createRange();a.collapse(!0),a.moveEnd("character",o),a.moveStart("character",t),a.select()}}function makeSafePath(e){var t=_.split(_.trim(e),"/");return t=_.map(t,function(e){return _.kebabCase(_.deburr(_.trim(e)))}),_.join(_.filter(t,function(e){return!_.isEmpty(e)}),"/")}var _createClass=function(){function e(e,t){for(var o=0;o<t.length;o++){var a=t[o];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,o,a){return o&&e(t.prototype,o),a&&e(t,a),t}}();jQuery(document).ready(function(e){e("a").smoothScroll({speed:400,offset:-70});new Sticky(".stickyscroll");e(window).bind("beforeunload",function(){e("#notifload").addClass("active")}),e(document).ajaxSend(function(){e("#notifload").addClass("active")}).ajaxComplete(function(){e("#notifload").removeClass("active")});var t=new Alerts;alertsData&&_.forEach(alertsData,function(e){t.push(e)});var o=io(ioHost);if(e("#search-input").length){e("#search-input").focus(),e(".searchresults").css("display","block");var a=new Vue({el:"#header-container",data:{searchq:"",searchres:[],searchsuggest:[],searchload:0,searchactive:!1,searchmoveidx:0,searchmovekey:"",searchmovearr:[]},watch:{searchq:function(e,t){a.searchmoveidx=0,e.length>=3?(a.searchactive=!0,a.searchload++,o.emit("search",{terms:e},function(e){a.searchres=e.match,a.searchsuggest=e.suggest,a.searchmovearr=_.concat([],a.searchres,a.searchsuggest),a.searchload>0&&a.searchload--})):(a.searchactive=!1,a.searchres=[],a.searchsuggest=[],a.searchmovearr=[],a.searchload=0)},searchmoveidx:function(e,t){e>0?a.searchmovekey=a.searchmovearr[e-1]?"res."+a.searchmovearr[e-1]._id:"sug."+a.searchmovearr[e-1]:a.searchmovekey=""}},methods:{useSuggestion:function(e){a.searchq=e},closeSearch:function(){a.searchq=""},moveSelectSearch:function(){if(!(a.searchmoveidx<1)){var e=a.searchmoveidx-1;a.searchmovearr[e]?window.location.assign("/"+a.searchmovearr[e]._id):a.searchq=a.searchmovearr[e]}},moveDownSearch:function(){a.searchmoveidx<a.searchmovearr.length&&a.searchmoveidx++},moveUpSearch:function(){a.searchmoveidx>0&&a.searchmoveidx--}}});e("main").on("click",a.closeSearch)}if(e("#page-type-view").length&&!function(){var o="home"!==e("#page-type-view").data("entrypath")?e("#page-type-view").data("entrypath"):"",a=o+"/new-page";e(".btn-create-prompt").on("click",function(t){e("#txt-create-prompt").val(a),e("#modal-create-prompt").toggleClass("is-active"),setInputSelection(e("#txt-create-prompt").get(0),o.length+1,a.length),e("#txt-create-prompt").removeClass("is-danger").next().addClass("is-hidden")}),e("#txt-create-prompt").on("keypress",function(t){13===t.which&&e(".btn-create-go").trigger("click")}),e(".btn-create-go").on("click",function(t){var o=makeSafePath(e("#txt-create-prompt").val());_.isEmpty(o)?e("#txt-create-prompt").addClass("is-danger").next().removeClass("is-hidden"):(e("#txt-create-prompt").parent().addClass("is-loading"),window.location.assign("/create/"+o))}),""!==o&&e(".btn-move-prompt").removeClass("is-hidden");var n=_.lastIndexOf(o,"/")+1;e(".btn-move-prompt").on("click",function(t){e("#txt-move-prompt").val(o),e("#modal-move-prompt").toggleClass("is-active"),setInputSelection(e("#txt-move-prompt").get(0),n,o.length),e("#txt-move-prompt").removeClass("is-danger").next().addClass("is-hidden")}),e("#txt-move-prompt").on("keypress",function(t){13===t.which&&e(".btn-move-go").trigger("click")}),e(".btn-move-go").on("click",function(a){var n=makeSafePath(e("#txt-move-prompt").val());_.isEmpty(n)||n===o||"home"===n?e("#txt-move-prompt").addClass("is-danger").next().removeClass("is-hidden"):(e("#txt-move-prompt").parent().addClass("is-loading"),e.ajax(window.location.href,{data:{move:n},dataType:"json",method:"PUT"}).then(function(e,o,a){e.ok?window.location.assign("/"+n):t.pushError("Something went wrong",e.error)},function(e,o,a){t.pushError("Something went wrong","Save operation failed.")}))})}(),e("#page-type-create").length){var n;!function(){var a=e("#page-type-create").data("entrypath");e(".btn-create-discard").on("click",function(t){e("#modal-create-discard").toggleClass("is-active")}),1===e("#mk-editor").length&&!function(){var a=!1;Vue.filter("filesize",function(e){return _.toUpper(filesize(e))});var i=new Vue({el:"#modal-editor-image",data:{isLoading:!1,isLoadingText:"",newFolderName:"",newFolderShow:!1,newFolderError:!1,fetchFromUrlURL:"",fetchFromUrlShow:!1,folders:[],currentFolder:"",currentImage:"",currentAlign:"left",images:[],uploadSucceeded:!1,postUploadChecks:0,deleteImageShow:!1,deleteImageId:0,deleteImageFilename:""},methods:{open:function(){a=!0,e("#modal-editor-image").slideDown(),i.refreshFolders()},cancel:function(t){a=!1,e("#modal-editor-image").slideUp()},insertImage:function(e){n.codemirror.doc.somethingSelected()&&n.codemirror.execCommand("singleSelection");var t=_.find(i.images,["_id",i.currentImage]);t.normalizedPath="f:"===t.folder?t.filename:t.folder.slice(2)+"/"+t.filename,t.titleGuess=_.startCase(t.basename);var o="!["+t.titleGuess+"](/uploads/"+t.normalizedPath+' "'+t.titleGuess+'")';switch(i.currentAlign){case"center":o+="{.align-center}";break;case"right":o+="{.align-right}";break;case"logo":o+="{.pagelogo}"}n.codemirror.doc.replaceSelection(o),i.cancel()},newFolder:function(t){i.newFolderName="",i.newFolderError=!1,i.newFolderShow=!0,_.delay(function(){e("#txt-editor-newfoldername").focus()},400)},newFolderDiscard:function(e){i.newFolderShow=!1},newFolderCreate:function(e){var t=new RegExp("^[a-z0-9][a-z0-9-]*[a-z0-9]$");return i.newFolderName=_.kebabCase(_.trim(i.newFolderName)),_.isEmpty(i.newFolderName)||!t.test(i.newFolderName)?void(i.newFolderError=!0):(i.newFolderDiscard(),i.isLoading=!0,i.isLoadingText="Creating new folder...",void Vue.nextTick(function(){o.emit("uploadsCreateFolder",{foldername:i.newFolderName},function(e){i.folders=e,i.currentFolder=i.newFolderName,i.images=[],i.isLoading=!1})}))},fetchFromUrl:function(e){i.fetchFromUrlShow=!0},fetchFromUrlDiscard:function(e){i.fetchFromUrlShow=!1},fetchFromUrlFetch:function(e){},selectFolder:function(e){i.currentFolder=e,i.loadImages()},refreshFolders:function(){i.isLoading=!0,i.isLoadingText="Fetching folders list...",i.currentFolder="",i.currentImage="",Vue.nextTick(function(){o.emit("uploadsGetFolders",{},function(e){i.folders=e,i.loadImages()})})},loadImages:function(e){e||(i.isLoading=!0,i.isLoadingText="Fetching images..."),Vue.nextTick(function(){o.emit("uploadsGetImages",{folder:i.currentFolder},function(t){i.images=t,e||(i.isLoading=!1),i.attachContextMenus()})})},selectImage:function(e){i.currentImage=e},selectAlignment:function(e){i.currentAlign=e},attachContextMenus:function(){var t=_.map(i.folders,function(e){return{name:""!==e?e:"/ (root)",icon:"fa-folder"}});e.contextMenu("destroy",".editor-modal-imagechoices > figure"),e.contextMenu({selector:".editor-modal-imagechoices > figure",appendTo:".editor-modal-imagechoices",position:function(t,o,a){e(t.$trigger).addClass("is-contextopen");var n=e(t.$trigger).position(),i={w:e(t.$trigger).width()/2,h:e(t.$trigger).height()/2};t.$menu.css({top:n.top+i.h,left:n.left+i.w})},events:{hide:function(t){e(t.$trigger).removeClass("is-contextopen")}},items:{rename:{name:"Rename",icon:"fa-edit",callback:function(e,t){alert("Clicked on "+e)}},move:{name:"Move to...",icon:"fa-folder-open-o",items:t},delete:{name:"Delete",icon:"fa-trash",callback:function(t,o){i.deleteImageId=_.toString(e(o.$trigger).data("uid")),i.deleteImageWarn(!0)}}}})},deleteImageWarn:function(e){e&&(i.deleteImageFilename=_.find(i.images,["_id",i.deleteImageId]).filename),i.deleteImageShow=e},deleteImageGo:function(){i.deleteImageWarn(!1),i.isLoadingText="Deleting image...",i.isLoading=!0,Vue.nextTick(function(){o.emit("uploadsDeleteFile",{uid:i.deleteImageId},function(e){i.loadImages()})})},waitUploadComplete:function(){i.postUploadChecks++,i.isLoadingText="Processing...";var e=i.images.length;i.loadImages(!0),Vue.nextTick(function(){_.delay(function(){e!==i.images.length?(i.postUploadChecks=0,i.isLoading=!1):i.postUploadChecks>5?(i.postUploadChecks=0,i.isLoading=!1,t.pushError("Unable to fetch new listing","Try again later")):i.waitUploadComplete()},2e3)})}}});e("#btn-editor-uploadimage input").on("change",function(o){e(o.currentTarget).simpleUpload("/uploads/img",{name:"imgfile",data:{folder:i.currentFolder},limit:20,expect:"json",allowedExts:["jpg","jpeg","gif","png","webp"],allowedTypes:["image/png","image/jpeg","image/gif","image/webp"],maxFileSize:3145728,init:function(e){i.uploadSucceeded=!1,i.isLoading=!0,i.isLoadingText="Preparing to upload..."},progress:function(e){i.isLoadingText="Uploading..."+Math.round(e)+"%"},success:function(e){if(e.ok){var o=_.filter(e.results,["ok",!1]);o.length?(_.forEach(o,function(e){t.pushError("Upload error",e.msg)}),o.length<e.results.length&&(t.push({title:"Some uploads succeeded",message:"Files that are not mentionned in the errors above were uploaded successfully."}),i.uploadSucceeded=!0)):i.uploadSucceeded=!0}else t.pushError("Upload error",e.msg)},error:function(e){t.pushError(e.message,this.upload.file.name)},finish:function(){i.uploadSucceeded?i.waitUploadComplete():i.isLoading=!1}})});var r=ace.edit("codeblock-editor");r.setTheme("ace/theme/tomorrow_night"),r.getSession().setMode("ace/mode/markdown"),r.setOption("fontSize","14px"),r.setOption("hScrollBarAlwaysVisible",!1),r.setOption("wrap",!0);var l=ace.require("ace/ext/modelist"),c=new Vue({el:"#modal-editor-codeblock",data:{modes:l.modesByName,modeSelected:"text"},watch:{modeSelected:function(e,t){d(e).done(function(){ace.require("ace/mode/"+e),r.getSession().setMode("ace/mode/"+e)})}},methods:{cancel:function(t){a=!1,e("#modal-editor-codeblock").slideUp()},insertCode:function(e){n.codemirror.doc.somethingSelected()&&n.codemirror.execCommand("singleSelection");var t="\n```"+c.modeSelected+"\n"+r.getValue()+"\n```\n";n.codemirror.doc.replaceSelection(t),c.cancel()}}}),s=[],d=function(t){return e.ajax({url:"/js/ace/mode-"+t+".js",dataType:"script",cache:!0,beforeSend:function(){if(_.includes(s,t))return!1},success:function(){s.push(t)}})};n=new SimpleMDE({autofocus:!0,autoDownloadFontAwesome:!1,element:e("#mk-editor").get(0),placeholder:"Enter Markdown formatted content here...",spellChecker:!1,status:!1,toolbar:[{name:"bold",action:SimpleMDE.toggleBold,className:"fa fa-bold",title:"Bold"},{name:"italic",action:SimpleMDE.toggleItalic,className:"fa fa-italic",title:"Italic"},{name:"strikethrough",action:SimpleMDE.toggleStrikethrough,className:"fa fa-strikethrough",title:"Strikethrough"},"|",{name:"heading-1",action:SimpleMDE.toggleHeading1,className:"fa fa-header fa-header-x fa-header-1",title:"Big Heading"},{name:"heading-2",action:SimpleMDE.toggleHeading2,className:"fa fa-header fa-header-x fa-header-2",title:"Medium Heading"},{name:"heading-3",action:SimpleMDE.toggleHeading3,className:"fa fa-header fa-header-x fa-header-3",title:"Small Heading"},{name:"quote",action:SimpleMDE.toggleBlockquote,className:"fa fa-quote-left",title:"Quote"},"|",{name:"unordered-list",action:SimpleMDE.toggleUnorderedList,className:"fa fa-list-ul",title:"Bullet List"},{name:"ordered-list",action:SimpleMDE.toggleOrderedList,className:"fa fa-list-ol",title:"Numbered List"},"|",{name:"link",action:function(t){a||(a=!0,e("#modal-editor-link").slideToggle())},className:"fa fa-link",title:"Insert Link"},{name:"image",action:function(e){a||i.open()},className:"fa fa-image",title:"Insert Image"},{name:"file",action:function(e){},className:"fa fa-file-text-o",title:"Insert File"},"|",{name:"inline-code",action:function(e){if(!e.codemirror.doc.somethingSelected())return t.pushError("Invalid selection","You must select at least 1 character first.");var o=e.codemirror.doc.getSelections();o=_.map(o,function(e){return"`"+e+"`"}),e.codemirror.doc.replaceSelections(o)},className:"fa fa-terminal",title:"Inline Code"},{name:"code-block",action:function(t){a||(a=!0,n.codemirror.doc.somethingSelected()?r.setValue(n.codemirror.doc.getSelection()):r.setValue(""),e("#modal-editor-codeblock").slideDown(400,function(){r.resize(),r.focus()}))},className:"fa fa-code",title:"Code Block"},"|",{name:"table",action:function(e){},className:"fa fa-table",title:"Insert Table"},{name:"horizontal-rule",action:SimpleMDE.drawHorizontalRule,className:"fa fa-minus",title:"Horizontal Rule"}],shortcuts:{toggleBlockquote:null,toggleFullScreen:null}})}(),e(".btn-edit-save, .btn-create-save").on("click",function(o){e.ajax(window.location.href,{data:{markdown:n.value()},dataType:"json",method:"PUT"}).then(function(e,o,n){e.ok?window.location.assign("/"+a):t.pushError("Something went wrong",e.error)},function(e,o,a){t.pushError("Something went wrong","Save operation failed.")})})}()}if(e("#page-type-edit").length){var n;!function(){var a=e("#page-type-edit").data("entrypath");e(".btn-edit-discard").on("click",function(t){e("#modal-edit-discard").toggleClass("is-active")}),1===e("#mk-editor").length&&!function(){var a=!1;Vue.filter("filesize",function(e){return _.toUpper(filesize(e))});var i=new Vue({el:"#modal-editor-image",data:{isLoading:!1,isLoadingText:"",newFolderName:"",newFolderShow:!1,newFolderError:!1,fetchFromUrlURL:"",fetchFromUrlShow:!1,folders:[],currentFolder:"",currentImage:"",currentAlign:"left",images:[],uploadSucceeded:!1,postUploadChecks:0,deleteImageShow:!1,deleteImageId:0,deleteImageFilename:""},methods:{open:function(){a=!0,e("#modal-editor-image").slideDown(),i.refreshFolders()},cancel:function(t){a=!1,e("#modal-editor-image").slideUp()},insertImage:function(e){n.codemirror.doc.somethingSelected()&&n.codemirror.execCommand("singleSelection");var t=_.find(i.images,["_id",i.currentImage]);t.normalizedPath="f:"===t.folder?t.filename:t.folder.slice(2)+"/"+t.filename,t.titleGuess=_.startCase(t.basename);var o="!["+t.titleGuess+"](/uploads/"+t.normalizedPath+' "'+t.titleGuess+'")';switch(i.currentAlign){case"center":o+="{.align-center}";break;case"right":o+="{.align-right}";break;case"logo":o+="{.pagelogo}"}n.codemirror.doc.replaceSelection(o),i.cancel()},newFolder:function(t){i.newFolderName="",i.newFolderError=!1,i.newFolderShow=!0,_.delay(function(){e("#txt-editor-newfoldername").focus()},400)},newFolderDiscard:function(e){i.newFolderShow=!1},newFolderCreate:function(e){var t=new RegExp("^[a-z0-9][a-z0-9-]*[a-z0-9]$");return i.newFolderName=_.kebabCase(_.trim(i.newFolderName)),_.isEmpty(i.newFolderName)||!t.test(i.newFolderName)?void(i.newFolderError=!0):(i.newFolderDiscard(),i.isLoading=!0,i.isLoadingText="Creating new folder...",void Vue.nextTick(function(){o.emit("uploadsCreateFolder",{foldername:i.newFolderName},function(e){i.folders=e,i.currentFolder=i.newFolderName,i.images=[],i.isLoading=!1})}))},fetchFromUrl:function(e){i.fetchFromUrlShow=!0},fetchFromUrlDiscard:function(e){i.fetchFromUrlShow=!1},fetchFromUrlFetch:function(e){},selectFolder:function(e){i.currentFolder=e,i.loadImages()},refreshFolders:function(){i.isLoading=!0,i.isLoadingText="Fetching folders list...",i.currentFolder="",i.currentImage="",Vue.nextTick(function(){o.emit("uploadsGetFolders",{},function(e){i.folders=e,i.loadImages()})})},loadImages:function(e){e||(i.isLoading=!0,i.isLoadingText="Fetching images..."),Vue.nextTick(function(){o.emit("uploadsGetImages",{folder:i.currentFolder},function(t){i.images=t,e||(i.isLoading=!1),i.attachContextMenus()})})},selectImage:function(e){i.currentImage=e},selectAlignment:function(e){i.currentAlign=e},attachContextMenus:function(){var t=_.map(i.folders,function(e){return{name:""!==e?e:"/ (root)",icon:"fa-folder"}});e.contextMenu("destroy",".editor-modal-imagechoices > figure"),e.contextMenu({selector:".editor-modal-imagechoices > figure",appendTo:".editor-modal-imagechoices",position:function(t,o,a){e(t.$trigger).addClass("is-contextopen");var n=e(t.$trigger).position(),i={w:e(t.$trigger).width()/2,h:e(t.$trigger).height()/2};t.$menu.css({top:n.top+i.h,left:n.left+i.w})},events:{hide:function(t){e(t.$trigger).removeClass("is-contextopen")}},items:{rename:{name:"Rename",icon:"fa-edit",callback:function(e,t){alert("Clicked on "+e)}},move:{name:"Move to...",icon:"fa-folder-open-o",items:t},delete:{name:"Delete",icon:"fa-trash",callback:function(t,o){i.deleteImageId=_.toString(e(o.$trigger).data("uid")),i.deleteImageWarn(!0)}}}})},deleteImageWarn:function(e){e&&(i.deleteImageFilename=_.find(i.images,["_id",i.deleteImageId]).filename),i.deleteImageShow=e},deleteImageGo:function(){i.deleteImageWarn(!1),i.isLoadingText="Deleting image...",i.isLoading=!0,Vue.nextTick(function(){o.emit("uploadsDeleteFile",{uid:i.deleteImageId},function(e){i.loadImages()})})},waitUploadComplete:function(){i.postUploadChecks++,i.isLoadingText="Processing...";var e=i.images.length;i.loadImages(!0),Vue.nextTick(function(){_.delay(function(){e!==i.images.length?(i.postUploadChecks=0,i.isLoading=!1):i.postUploadChecks>5?(i.postUploadChecks=0,i.isLoading=!1,t.pushError("Unable to fetch new listing","Try again later")):i.waitUploadComplete()},2e3)})}}});e("#btn-editor-uploadimage input").on("change",function(o){e(o.currentTarget).simpleUpload("/uploads/img",{name:"imgfile",data:{folder:i.currentFolder},limit:20,expect:"json",allowedExts:["jpg","jpeg","gif","png","webp"],allowedTypes:["image/png","image/jpeg","image/gif","image/webp"],maxFileSize:3145728,init:function(e){i.uploadSucceeded=!1,i.isLoading=!0,i.isLoadingText="Preparing to upload..."},progress:function(e){i.isLoadingText="Uploading..."+Math.round(e)+"%"},success:function(e){if(e.ok){var o=_.filter(e.results,["ok",!1]);o.length?(_.forEach(o,function(e){t.pushError("Upload error",e.msg)}),o.length<e.results.length&&(t.push({title:"Some uploads succeeded",message:"Files that are not mentionned in the errors above were uploaded successfully."}),i.uploadSucceeded=!0)):i.uploadSucceeded=!0}else t.pushError("Upload error",e.msg)},error:function(e){t.pushError(e.message,this.upload.file.name)},finish:function(){i.uploadSucceeded?i.waitUploadComplete():i.isLoading=!1}})});var r=ace.edit("codeblock-editor");r.setTheme("ace/theme/tomorrow_night"),r.getSession().setMode("ace/mode/markdown"),r.setOption("fontSize","14px"),r.setOption("hScrollBarAlwaysVisible",!1),r.setOption("wrap",!0);var l=ace.require("ace/ext/modelist"),c=new Vue({el:"#modal-editor-codeblock",data:{modes:l.modesByName,modeSelected:"text"},watch:{modeSelected:function(e,t){d(e).done(function(){ace.require("ace/mode/"+e),r.getSession().setMode("ace/mode/"+e)})}},methods:{cancel:function(t){a=!1,e("#modal-editor-codeblock").slideUp()},insertCode:function(e){n.codemirror.doc.somethingSelected()&&n.codemirror.execCommand("singleSelection");var t="\n```"+c.modeSelected+"\n"+r.getValue()+"\n```\n";n.codemirror.doc.replaceSelection(t),c.cancel()}}}),s=[],d=function(t){return e.ajax({url:"/js/ace/mode-"+t+".js",dataType:"script",cache:!0,beforeSend:function(){if(_.includes(s,t))return!1},success:function(){s.push(t)}})};n=new SimpleMDE({autofocus:!0,autoDownloadFontAwesome:!1,element:e("#mk-editor").get(0),placeholder:"Enter Markdown formatted content here...",spellChecker:!1,status:!1,toolbar:[{name:"bold",action:SimpleMDE.toggleBold,className:"fa fa-bold",title:"Bold"},{name:"italic",action:SimpleMDE.toggleItalic,className:"fa fa-italic",title:"Italic"},{name:"strikethrough",action:SimpleMDE.toggleStrikethrough,className:"fa fa-strikethrough",title:"Strikethrough"},"|",{name:"heading-1",action:SimpleMDE.toggleHeading1,className:"fa fa-header fa-header-x fa-header-1",title:"Big Heading"},{name:"heading-2",action:SimpleMDE.toggleHeading2,className:"fa fa-header fa-header-x fa-header-2",title:"Medium Heading"},{name:"heading-3",action:SimpleMDE.toggleHeading3,className:"fa fa-header fa-header-x fa-header-3",title:"Small Heading"},{name:"quote",action:SimpleMDE.toggleBlockquote,className:"fa fa-quote-left",title:"Quote"},"|",{name:"unordered-list",action:SimpleMDE.toggleUnorderedList,className:"fa fa-list-ul",title:"Bullet List"},{name:"ordered-list",action:SimpleMDE.toggleOrderedList,className:"fa fa-list-ol",title:"Numbered List"},"|",{name:"link",action:function(t){a||(a=!0,e("#modal-editor-link").slideToggle())},className:"fa fa-link",title:"Insert Link"},{name:"image",action:function(e){a||i.open()},className:"fa fa-image",title:"Insert Image"},{name:"file",action:function(e){},className:"fa fa-file-text-o",title:"Insert File"},"|",{name:"inline-code",action:function(e){if(!e.codemirror.doc.somethingSelected())return t.pushError("Invalid selection","You must select at least 1 character first.");var o=e.codemirror.doc.getSelections();o=_.map(o,function(e){return"`"+e+"`"}),e.codemirror.doc.replaceSelections(o)},className:"fa fa-terminal",title:"Inline Code"},{name:"code-block",action:function(t){a||(a=!0,n.codemirror.doc.somethingSelected()?r.setValue(n.codemirror.doc.getSelection()):r.setValue(""),e("#modal-editor-codeblock").slideDown(400,function(){r.resize(),r.focus()}))},className:"fa fa-code",title:"Code Block"},"|",{name:"table",action:function(e){},className:"fa fa-table",title:"Insert Table"},{name:"horizontal-rule",action:SimpleMDE.drawHorizontalRule,className:"fa fa-minus",title:"Horizontal Rule"}],shortcuts:{toggleBlockquote:null,toggleFullScreen:null}})}(),e(".btn-edit-save, .btn-create-save").on("click",function(o){e.ajax(window.location.href,{data:{markdown:n.value()},dataType:"json",method:"PUT"}).then(function(e,o,n){e.ok?window.location.assign("/"+a):t.pushError("Something went wrong",e.error)},function(e,o,a){t.pushError("Something went wrong","Save operation failed.")})})}()}if(e("#page-type-source").length){var i;!function(){i=ace.edit("source-display"),i.setTheme("ace/theme/tomorrow_night"),i.getSession().setMode("ace/mode/markdown"),i.setReadOnly(!0),i.renderer.updateFull();var o="home"!==e("#page-type-source").data("entrypath")?e("#page-type-source").data("entrypath"):"",a=o+"/new-page";e(".btn-create-prompt").on("click",function(t){e("#txt-create-prompt").val(a),e("#modal-create-prompt").toggleClass("is-active"),setInputSelection(e("#txt-create-prompt").get(0),o.length+1,a.length),e("#txt-create-prompt").removeClass("is-danger").next().addClass("is-hidden")}),e("#txt-create-prompt").on("keypress",function(t){13===t.which&&e(".btn-create-go").trigger("click")}),e(".btn-create-go").on("click",function(t){var o=makeSafePath(e("#txt-create-prompt").val());_.isEmpty(o)?e("#txt-create-prompt").addClass("is-danger").next().removeClass("is-hidden"):(e("#txt-create-prompt").parent().addClass("is-loading"),window.location.assign("/create/"+o))}),""!==o&&e(".btn-move-prompt").removeClass("is-hidden");var n=_.lastIndexOf(o,"/")+1;e(".btn-move-prompt").on("click",function(t){e("#txt-move-prompt").val(o),e("#modal-move-prompt").toggleClass("is-active"),setInputSelection(e("#txt-move-prompt").get(0),n,o.length),e("#txt-move-prompt").removeClass("is-danger").next().addClass("is-hidden")}),e("#txt-move-prompt").on("keypress",function(t){13===t.which&&e(".btn-move-go").trigger("click")}),e(".btn-move-go").on("click",function(a){var n=makeSafePath(e("#txt-move-prompt").val());_.isEmpty(n)||n===o||"home"===n?e("#txt-move-prompt").addClass("is-danger").next().removeClass("is-hidden"):(e("#txt-move-prompt").parent().addClass("is-loading"),e.ajax(window.location.href,{data:{move:n},dataType:"json",method:"PUT"}).then(function(e,o,a){e.ok?window.location.assign("/"+n):t.pushError("Something went wrong",e.error)},function(e,o,a){t.pushError("Something went wrong","Save operation failed.")}))})}()}});var Alerts=function(){function e(){_classCallCheck(this,e);var t=this;t.mdl=new Vue({el:"#alerts",data:{children:[]},methods:{acknowledge:function(e){t.close(e)}}}),t.uidNext=1}return _createClass(e,[{key:"push",value:function(e){var t=this,o=_.defaults(e,{_uid:t.uidNext,class:"is-info",message:"---",sticky:!1,title:"---"});t.mdl.children.push(o),o.sticky||_.delay(function(){t.close(o._uid)},5e3),t.uidNext++}},{key:"pushError",value:function(e,t){this.push({class:"is-danger",message:t,sticky:!1,title:e})}},{key:"pushSuccess",value:function(e,t){this.push({class:"is-success",message:t,sticky:!1,title:e})}},{key:"close",value:function(e){var t=this,o=_.findIndex(t.mdl.children,["_uid",e]),a=_.nth(t.mdl.children,o);o>=0&&a&&(a.class+=" exit",Vue.set(t.mdl.children,o,a),_.delay(function(){t.mdl.children.splice(o,1)},500))}}]),e}();