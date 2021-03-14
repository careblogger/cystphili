function YotoAppStorageManager(t,o){if(this.driver=t||"localStorage",this.prefix=o||"yoto-sm",this.storage=window[this.driver],this.active=!1,this.storage){var e=t+"_test";try{this.storage.setItem(e,e+e+e),this.storage.removeItem(e),this.active=!0}catch(n){try{"QUOTA_EXCEEDED_ERR"!=n.name&&"NS_ERROR_DOM_QUOTA_REACHED"!=n.name&&"W3CException_DOM_QUOTA_EXCEEDED_ERR"!=n.name&&"QuotaExceededError"!=n.name||(this.storage.purge(),this.storage.setItem(e,e+e+e),this.storage.removeItem(e),this.active=!0)}catch(n){}}this.active&&this.setFromHash()}}YotoAppStorageManager.prototype.get=function(t,o){if(this.active){t=this.normalizeKey(t);try{var e=this.storage.getItem(t),n=null!==e&&JSON.parse(e);if(n)return o>0&&this.hasExpired(n,o)?(this.storage.removeItem(t),!1):n.data}catch(r){}}return null},YotoAppStorageManager.prototype.set=function(t,o){if(this.active){t=this.normalizeKey(t);var e={data:o,timestamp:(new Date).getTime()};try{this.storage.setItem(t,JSON.stringify(e))}catch(n){if("QUOTA_EXCEEDED_ERR"==n.name||"NS_ERROR_DOM_QUOTA_REACHED"==n.name||"W3CException_DOM_QUOTA_EXCEEDED_ERR"==n.name||"QuotaExceededError"==n.name)try{this.clear(),this.storage.setItem(t,JSON.stringify(e))}catch(n){try{this.purge(),this.storage.setItem(t,JSON.stringify(e))}catch(n){}}}}},YotoAppStorageManager.prototype.remove=function(t){this.active&&(t=this.normalizeKey(t),this.storage.removeItem(t))},YotoAppStorageManager.prototype.clear=function(t){if(this.active){var o=this.storage.length;for(t||(t=""),t=this.normalizeKey(t);o--;){var e=this.storage.key(o),n=new RegExp(t);n.test(e)&&this.storage.removeItem(e)}}},YotoAppStorageManager.prototype.purge=function(){this.active&&this.storage.clear()},YotoAppStorageManager.prototype.normalizeKey=function(t){var o=this.prefix+":";return t.slice(0,o.length)===o?t:o+t},YotoAppStorageManager.prototype.hasExpired=function(t,o){if("undefined"!=typeof t&&t.hasOwnProperty("timestamp")){var e=(new Date).getTime(),n=e-t.timestamp,r=6e4;return n>=r*o}return!1},YotoAppStorageManager.prototype.setFromHash=function(){var t="sessionStorage"==this.driver?"ss":"ls";try{if(yotoApp.hash[t]){var o=JSON.parse(atob(yotoApp.hash[t]));for(var e in o)e&&o.hasOwnProperty(e)&&this.set(e,o[e])}}catch(n){}},window.yotoApp=window.yotoApp||{},yotoApp.sessionStorage=new YotoAppStorageManager("sessionStorage"),yotoApp.localStorage=new YotoAppStorageManager("localStorage"),yotoApp.fillArray=function(t,o,e,n){if(n=_.extend({append:"bottom"},n),t.length>=o)return t;if("bottom"===n.append)for(var r=0;r<o;r++)"undefined"==typeof t[r]&&(t[r]=e);else{for(var i=[],a=o-1;a>=0;a--)"undefined"==typeof t[a]?i.push(e):i.push(t[a]);t=i}return t},yotoApp.createDiv=function(t,o,e){var n=document.createElement("div");if(t&&(n.id=t),o&&(n.className=o),e)for(var r in e)n.setAttribute(r,e[r]);return n},yotoApp.createDivClass=function(t,o){return yotoApp.createDiv(null,t,o)},yotoApp.createDivId=function(t,o){return yotoApp.createDiv(t,void 0,o)},yotoApp.abAllocateNow=Date.now(),yotoApp.abAllocate=function(t,o){return o?Date.now()%100<t:yotoApp.abAllocateNow%100<t},yotoApp.defer=function(){return $.Deferred()},yotoApp.isAppUrl=function(t){if(!t||"javascript:void(0)"==t||t.startsWith("#"))return!1;var o=yotoApp.domain,e="^https?://(?:[^/@:]*:[^/@]*@)?(?:[^/:]+.)?"+o+"(?=[/:]|$)",n=/^https?:\/\//i,r=new RegExp(e,"i");return r.test(t)||!n.test(t)},yotoApp.addCurrentUtmToUrl=function(t){var o=yotoApp.getUtm();return o.source&&(t=yotoUtils.addParamToUrl(t,"utm_source",encodeURIComponent(o.source))),o.medium&&(t=yotoUtils.addParamToUrl(t,"utm_medium",encodeURIComponent(o.medium))),o.campaign&&(t=yotoUtils.addParamToUrl(t,"utm_campaign",encodeURIComponent(o.campaign))),o.term&&(t=yotoUtils.addParamToUrl(t,"utm_term",encodeURIComponent(o.term))),o.content&&(t=yotoUtils.addParamToUrl(t,"utm_content",encodeURIComponent(o.content))),o.mbid&&(t=yotoUtils.addParamToUrl(t,"mbid",encodeURIComponent(o.mbid))),o.kvr&&(t=yotoUtils.addParamToUrl(t,"kvr",encodeURIComponent(o.kvr))),t},yotoApp.addAppParamsToUrl=function(t){var o=["api_token","country_override","force_test","ly","theme","yoto_debug","safe","mbid","sd","abtv","ajax","debug_wh","nnlv","forensiq","dsbr","content_domain"];if(yotoApp.isAppUrl(t)){for(var e=0;e<o.length;e++){var n=o[e];n&&yotoApp.qs[n]&&(t=yotoUtils.addParamToUrl(t,n,yotoApp.qs[n]))}if(t=yotoApp.addCurrentUtmToUrl(t),yotoApp.sdr>0&&yotoApp.pagesSeen>=yotoApp.sdr){var r=yotoApp.locale+"."+yotoApp.domain,i="r-"+r;"prv-"===window.location.host.substring(0,4)&&(i="prv-"+i),i!==window.location.host&&t.indexOf(i)===-1&&(t=0===t.indexOf("/")?window.location.protocol+"//"+i+t:t.replace(r,i),t=yotoApp.addStorageAppParamsToHash(t))}}return t},yotoApp.addStorageAppParamsToHash=function(t){var o="";t.indexOf("#")>0&&(o=t.substring(t.indexOf("#")+1,t.length),o?o+="&":o="");var e=["uid"],n=["sid","pages_seen","sessionCpm","utm","fbc","fbp"],r={},i={};try{_.forEach(e,function(t){var o=yotoApp.localStorage.get(t);null!==o&&(r[t]=o)}),_.forEach(n,function(t){var o=yotoApp.sessionStorage.get(t);null!==o&&(i[t]=o)}),o+="ls="+encodeURIComponent(btoa(JSON.stringify(r))),o+="&ss="+encodeURIComponent(btoa(JSON.stringify(i)))}catch(a){}return o?t+"#"+o:t},yotoApp.addKvrParamsToUrl=function(t,o,e){var n="";if(e)n=o;else for(var r in o)o.hasOwnProperty(r)&&(n&&(n+=";"),n+=r+":"+o[r]);return yotoUtils.addParamToUrl(t,"kvr",n)},yotoApp.catchAnchors=function(){var t=function(){var t=$(this);if(!t.is("[data-url-processed]")){var o=t.attr("href"),e=yotoApp.addAppParamsToUrl(o);if(yotoApp.externalTrack&&t.is("[data-x-track]")){var n=yotoApp.getUtm(),r=yotoApp.gpt.getMediaBuyingKeyValueTargeting(n),i=n.kvr,a=n.mbid;if(r&&r.length>0){var p=[];r.forEach(function(t){p[t.key]=t.value}),e=yotoApp.addKvrParamsToUrl(e,p)}else i&&(e=yotoApp.addKvrParamsToUrl(e,i,!0));if(a&&(e=yotoUtils.addParamToUrl(e,"mbid",a)),n.campaign)e=yotoUtils.addParamToUrl(e,"utm_campaign",n.campaign);else if(n.source&&n.medium){var s=n.source+"_"+n.medium;e=yotoUtils.addParamToUrl(e,"utm_campaign",s)}e=yotoUtils.addParamToUrl(e,"sd",yotoApp.qs.sd||window.location.hostname)}o!==e&&(t.attr("href",e),t.attr("data-url-processed",""))}};$(document).on("mousedown","a",t);try{$(document).on("touchstart","a",t)}catch(o){}},yotoApp.imageToBase64=function(t){var o=yotoApp.defer(),e=new Image,n=document.createElement("canvas"),r=!(!n.getContext||!n.getContext("2d"));return r?(e.onload=function(){try{n.width=this.naturalWidth,n.height=this.naturalHeight,n.getContext("2d").drawImage(this,0,0);var t=n.toDataURL("image/png");o.resolve(t)}catch(e){o.reject()}},e.onerror=function(){o.reject()},e.setAttribute("crossOrigin","anonymous"),e.src=t):o.reject(),o.promise()},yotoApp.stringifyArray=function(t){return _.map(t,function(t,o){if($.isArray(t)){var e="";$.each(t,function(t,o){e=e+_.map(o,function(t,o){return t})+","}),t=e}return o+"="+t})},yotoApp.ajaxSetup=function(){$(document).ajaxSend(function(t,o,e){if(e&&e.url&&yotoApp.isAppUrl(e.url)){if(e&&e.type&&!/^(GET|HEAD|OPTIONS|TRACE)$/.test(e.type)){var n=yotoUtils.getCookie("XSRF-TOKEN");n?o.setRequestHeader("X-XSRF-TOKEN",n):(o.sessionMissing=!0,o.abort())}yotoApp.qs.api_token&&o.setRequestHeader("X-API-TOKEN",yotoApp.qs.api_token)}})},yotoApp.isNumeric=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},yotoApp.viewportDetector=function(t){return yotoApp.verticalProximityDetector($(window).scrollTop(),$(window),t||1e3)},yotoApp.verticalProximityDetector=function(t,o,e){var n,r,i=t,a=i+o.height();return"object"==typeof e?(n=i-(e.top||0),r=a+(e.bottom||0)):(e=e||1e3,n=i-e,r=a+e),{detect:function(t){return 0===this.relativeLocation(t)},relativeLocation:function(t){var o=t.height(),e=t.width();if(o+e<1)return!1;var i=t.offset().top;if(i>=r)return 1;var a=i+o;return a<=n?-1:0}}},yotoApp.mostlyVisible=function(t){var o=$(window).scrollTop(),e=$(window).height(),n=$(t).offset().top,r=$(t).height(),i=n+r;return i-.25*r>o&&n<o+.5*e},function(){function t(t){var o=t.x||0,e=t.y||0,n=t.height||0,r=t.width||0;return 0===Math.min(o,e,n,r)&&0===Math.max(o,e,n,r)}yotoApp.domRectsOverlapping=function(o,e){return!t(o)&&!t(e)&&!(o.top+o.height<e.top||o.top>e.top+e.height||o.left+o.width<e.left||o.left>e.left+e.width)},yotoApp.domElementsOverlapping=function(t,o){var e=yotoUtils.getBoundingClientRect(t),n=yotoUtils.getBoundingClientRect(o);return yotoApp.domRectsOverlapping(e,n)}}(),function(){var t=!1,o=["fai","gai","tai","yai","rai","oai","snai"],e=null;yotoApp.getUtm=function(){if(t||yotoApp.saveUtm(),!e){var n={source:yotoApp.qs.utm_source,medium:yotoApp.qs.utm_medium,term:yotoApp.qs.utm_term,content:yotoApp.qs.utm_content,campaign:yotoApp.qs.utm_campaign,mbid:yotoApp.qs.mbid,kvr:yotoApp.qs.kvr};if(!n.mbid)for(var r=0;r<o.length;r++){var i=o[r];if(yotoApp.qs[i]){n.mbid=yotoApp.qs[i];break}}if(!n.source||!n.medium){var a=yotoApp.sessionStorage.get("utm");a&&a.source&&a.medium&&(n.source=a.source,n.medium=a.medium,n.campaign=a.campaign,n.term=a.term,n.content=a.content,a.mbid&&(n.mbid=a.mbid),a.kvr&&(n.kvr=a.kvr))}"string"==typeof n.source&&(n.source=n.source.toLowerCase()),"string"==typeof n.medium&&(n.medium=n.medium.toLowerCase()),"string"==typeof n.term&&(n.term=n.term.toLowerCase()),"string"==typeof n.content&&(n.content=n.content.toLowerCase()),"string"==typeof n.campaign&&(n.campaign=n.campaign.toLowerCase()),e=n}return"unknown"!==e.medium||"facebook"!==e.source&&"pinterest"!==e.source||(yotoApp.layout="native_one"),e},yotoApp.saveUtm=function(){t=!0;var e=yotoApp.qs.utm_source,n=yotoApp.qs.utm_medium,r=yotoApp.qs.utm_term,i=yotoApp.qs.utm_content,a=yotoApp.qs.utm_campaign,p=yotoApp.qs.kvr,s=yotoApp.qs.mbid;if(!s)for(var c=0;c<o.length;c++){var u=o[c];if(yotoApp.qs[u]){s=yotoApp.qs[u];break}}var y=document.referrer&&document.referrer.indexOf("www.google.")>-1,d=document.referrer&&(document.referrer.indexOf(".facebook.com")>-1||document.referrer.indexOf("fbclid")>-1),m=document.referrer&&(document.referrer.indexOf("pinterest")>-1||document.referrer.indexOf("/pin/")>-1),f=document.referrer&&document.referrer.indexOf("instagram.")>-1;if(e||n||(y?(e="google",n="organic",a="search"):d?(e="facebook",n="unknown",a="none"):m?(e="pinterest",n="unknown",a="none"):f&&(e="instagram",n="unknown",a="none")),e&&n){var l={source:"string"==typeof e?e.toLowerCase():e,medium:"string"==typeof n?n.toLowerCase():n,campaign:"string"==typeof a?a.toLowerCase():a,term:"string"==typeof r?r.toLowerCase():r,content:"string"==typeof i?i.toLowerCase():i,kvr:p?p:null,mbid:s?s:null};yotoApp.sessionStorage.set("utm",l)}}}(),yotoApp.openWindow=function(t,o,e,n,r){n=n||650,r=r||450;var i=$(window),a=(i.width()-n)/2,p=(i.height()-r)/2,s="status=1,width="+n+",height="+r+",top="+p+",left="+a;if(window[o]=window.open(t,o,s),!window[o])return!1;if(_.isFunction(e))var c=window.setInterval(function(){window[o]&&window[o].closed===!1||(window.clearInterval(c),e())},100);return!0},yotoApp.onScroll=function(t){if(!this.events){this.events=[];var o=this.events;$(window).scroll(_.debounce(function(){_.forEach(o,function(t){t()})},100,{maxWait:500}))}this.events.push(t)},window.getMediaBuyingId=function(){var t=yotoApp.getUtm();return t.mbid?t.mbid:void 0},yotoApp.isTabFocused=!0,$(document).ready(function(){$(window).focus(function(){yotoApp.isTabFocused=!0}),$(window).blur(function(){yotoApp.isTabFocused=!1})}),yotoApp.lazyListenerRunning=!1,yotoApp.lazyCallbacks=[],yotoApp.initLazyListener=function(t){yotoApp.lazyCallbacks.push(t),yotoApp.lazyListenerRunning||(yotoApp.lazyListenerRunning=!0,$(document).ready(function(){$(window).on("DOMContentLoaded load resize scroll",function(){yotoApp.lazyDirty=!0,yotoApp.isTabFocused=!0})}),setInterval(yotoApp.lazyHandler,250))},yotoApp.lazyDirty=!0,yotoApp.lazyBusy=!1,yotoApp.lazyHandler=function(){yotoApp.lazyBusy||yotoApp.lazyDirty&&(yotoApp.lazyBusy=!0,yotoApp.lazyDirty=!1,yotoApp.lazyCallbacks.forEach(function(t){try{t()}catch(o){}}),yotoApp.lazyBusy=!1)},function(){yotoApp.GtmEvent={PAGELOAD:"js_init",PAGEVIEW:"pageview",GALLERY_FINISH:"gallery_finish",GALLERY_INTERACT:"gallery_interact",END_OF_ARTICLE_CONTINUATION:"end_of_article_continuation",ADB_DETECTED:"adb_detected",QUIZ_INTERACT:"quiz_interact",QUIZ_ANSWER:"quiz_answer",QUIZ_CORRECT_ANSWER:"quiz_correct_answer",QUIZ_FINISH:"quiz_finish",QUIZ_SHARE:"quiz_share",GALLERY_SHARE:"gallery_share",HB_BIDS:"hb_bids",HB_BIDS_ONE:"hb_bids_one",COUNTRY_LOADED:"country_loaded"};var t={};yotoApp.gtmEvent=function(o,e){e=e||{};var n=JSON.parse(JSON.stringify(e));n.event=o,yotoApp.debug,t[o]&&t[o].length>0&&t[o].forEach(function(t){try{t(e)}catch(o){}})},yotoApp.onGtmEventTrigger=function(o,e){t[o]=t[o]||[],t[o].push(e)}}(),function(){var t={},o={};yotoApp.resolvePromise=function(e){o[e]=!0,t[e]&&t[e]()},yotoApp.onPromiseResolve=function(e,n){o[e]===!0?n():t[e]=n}}(),yotoApp.userLanguage=function(){var t,o,e=window.navigator,n=["language","browserLanguage","systemLanguage","userLanguage"];if(e.languages&&e.languages.length)for(t=0;t<e.languages.length;t++)if(o=e.languages[t],o&&o.length)return o;for(t=0;t<n.length;t++)if(o=e[n[t]],o&&o.length)return o;return"en"}(),function(){function t(t,o){try{return t+"="+o()}catch(e){return t+"=err"}}var o,e=function(t,o,e,n){var r=o?JSON.stringify(o):null;if(e)navigator.sendBeacon(t,r);else if(o){var i=new XMLHttpRequest;i.open("POST",t,!0),i.setRequestHeader("Content-Type","application/json;charset=UTF-8"),i.send(r)}else if(n){var a=new XMLHttpRequest;"function"==typeof n&&(a.onerror=function(){n(a.status)},a.ontimeout=function(){n(408)},a.onload=function(){a.readyState===a.DONE&&n(a.status,a.response)}),a.open("GET",t,!0),a.timeout=1e4,a.send(null)}else(new Image).src=t};yotoApp.trackEventWithErrorHandler=function(n,r,i,a,p){if(!yotoApp.isbt||"isbt"===i.type){var s=yotoApp.getUtm();if(!o){o=["h="+encodeURIComponent(yotoApp.domain||""),"lo="+encodeURIComponent(yotoApp.locale||""),"lg="+encodeURIComponent(yotoApp.userLanguage||""),"cc="+encodeURIComponent(yotoApp.country||""),"utmc="+encodeURIComponent(s.campaign||""),"utmco="+encodeURIComponent(s.content||""),"utmm="+encodeURIComponent(s.medium||""),"utms="+encodeURIComponent(s.source||""),"utmt="+encodeURIComponent(s.term||""),"ly="+encodeURIComponent(yotoApp.layout||""),"abtv="+encodeURIComponent(yotoApp.abTestV||""),"mbid="+encodeURIComponent(s.mbid||""),"uid="+encodeURIComponent(yotoApp.userId||""),"sid="+encodeURIComponent(yotoApp.sessionId||""),"pvi="+encodeURIComponent(yotoApp.pageviewId||""),"yv="+encodeURIComponent(yotoApp.version||"")];var c=yotoApp.parseUserAgent();o.push(t("b",function(){return encodeURIComponent(c.browser.name||"")}),t("bv",function(){return encodeURIComponent(c.browser.version||"")}),t("dev",function(){return encodeURIComponent(((c.device.vendor||"")+" "+(c.device.model||"")).trim())}),t("os",function(){return encodeURIComponent(((c.os.name||"")+" "+(c.os.version||"")).trim())}),t("p",function(){return encodeURIComponent(c.device.type||"")})),o=o.join("&")}var u=[o,"pn="+encodeURIComponent(yotoApp.pageNumber||"0"),"pd="+encodeURIComponent(yotoApp.pagesSeen||"0"),"pid="+encodeURIComponent(yotoApp.postId||""),"ciid="+encodeURIComponent(yotoApp.coverImageId||""),"_="+Date.now(),t("uri",function(){return encodeURIComponent(location.pathname||"")}),t("furl",function(){return encodeURIComponent(location.href||"")}),t("wh",function(){return yotoApp.windowWidth+"x"+yotoApp.windowHeight}),t("sr",function(){return window.screen.width+"x"+window.screen.height})];for(var y in i)u.push(y+"="+encodeURIComponent(i[y]));if(yotoApp.trackers)if(n){e(["https://",yotoApp.trackers[0],"/",r,"?",u.join("&")].join(""),a,p,n);for(var d=1;d<yotoApp.trackers.length;d++)e(["https://",yotoApp.trackers[d],"/",r,"?",u.join("&")].join(""),a,p,function(){})}else for(var d=0;d<yotoApp.trackers.length;d++)e(["https://",yotoApp.trackers[d],"/",r,"?",u.join("&")].join(""),a,p,n);else e(["https://g",yotoApp.trackingDomain,"/",r,"?",u.join("&")].join(""),a,p,n)}}}(),yotoApp.trackEvent=function(t,o,e,n){yotoApp.trackEventWithErrorHandler(null,t,o||{},e,n)},yotoApp.trackDynamicEvent=function(t,o,e){e="object"==typeof e?e:{},e.type=t,o&&(e.info=o),yotoApp.trackEvent("dye",e)},yotoApp.trackError=function(t){yotoApp.trackDynamicEvent("client_error",t)},yotoApp.trackClientBid=function(t,o){o=parseFloat(o),yotoApp.trackEvent("cbid",yotoApp.withRoasIds({aid:t,v:o}))},yotoApp.withRoasIds=function(t){var o,e,n=yotoApp.gpt.getMediaBuyingVendor();if(n&&"facebook"===n.name){try{if(e=yotoUtils.getCookie("_fbc"),!e&&yotoApp.qs.fbclid){e=["fb.1",Date.now(),yotoApp.qs.fbclid].join(".");try{yotoUtils.setCookie("_fbc",e,1)}catch(r){}}}catch(r){}try{o=yotoUtils.getCookie("_fbp")}catch(r){}}return e&&(t.fbc=e),o&&(t.fbp=o),t},yotoApp.userId=function(){var t;try{t=yotoApp.localStorage.get("uid"),t||(t=yotoUtils.getCookie("yoto_uid"))}catch(o){}return t||(t=yotoUtils.random64BitHexString(),yotoApp.localStorage.set("uid",t),setTimeout(function(){yotoApp.trackDynamicEvent("user_init")},1),yotoUtils.setCookie("yoto_uid",t,365)),t}(),yotoApp.sessionId=function(){var t=yotoApp.sessionStorage.get("sid");return t||(t=yotoUtils.random64BitHexString(),yotoApp.sessionStorage.set("sid",t),setTimeout(function(){yotoApp.trackDynamicEvent("session_init")},1)),t}(),yotoApp.pageviewId=yotoUtils.random64BitHexString();var blSessions={f334e6c6de89bac4:!0,de89bac457c6ecfa:!0};blSessions[yotoApp.sessionId]&&(yotoApp.isbt=!0),yotoApp.isbt&&yotoApp.trackDynamicEvent("isbt"),yotoApp.trackDynamicEvent("pv"),yotoApp.forensiqEnabled?yotoApp.onPromiseResolve("forensiqPromise",function(){yotoApp.detectTrafficRisk().then(function(t){yotoApp.forensiqValue=t?"true":"false",yotoApp.resolvePromise("yotoApp.gpt.initBidder")})}):yotoApp.resolvePromise("yotoApp.gpt.initBidder");try{var utm=yotoApp.getUtm(),info=JSON.stringify({href:""+location.href,ref:document.referrer||""});utm.source||utm.medium?"facebook"==utm.source&&"unknown"==utm.medium&&yotoApp.trackDynamicEvent("fb_unknown",info):utm.mbid?yotoApp.trackDynamicEvent("mbid_without_utm",info):yotoApp.trackDynamicEvent("empty_utm",info)}catch(e){}try{var parseUserAgent=yotoApp.parseUserAgent();isMobile.phone&&"mobile"!==parseUserAgent.device.type?yotoApp.trackDynamicEvent("ua-conflict:phone",navigator.userAgent):isMobile.tablet&&"tablet"!==parseUserAgent.device.type?yotoApp.trackDynamicEvent("ua-conflict:tablet",navigator.userAgent):!isMobile.mobile&&!isMobile.tablet||parseUserAgent.device.type||yotoApp.trackDynamicEvent("ua-conflict:not_desktop",navigator.userAgent)}catch(e){}