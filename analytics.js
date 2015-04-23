(function(window, undefined){

  window.analytics = (function(){
    initAll();
    return {
      pageTrack: pageTracking,
      eventTrack: eventTracking
    };
  })();
  
  function initAll() {
    window.addEventListener("load", function(){
      pageTracking();
      bindEventTrack();
    }, false);
  }
  
  function bindEventTrack() {
    var allowedTags = ["a", "button", "input"];
    document.body.addEventListener("click", function(event){
      var thisElement = event.target,
          thisTag = thisElement.tagName.toLowerCase();
          gatherStr = thisElement.getAttribute("gather_new") || thisElement.getAttribute("gather") || "";
      if (allowedTags.indexOf(thisTag) === -1 || gatherStr === "") { return false; }
      var gatherParamObj = undefined;
      try{
        gatherParamObj = eval("(" + gatherStr + ")");
      } catch(e) {}
      if (typeof gatherParamObj !== "object") { return ;}
      eventTracking(gatherParamObj);
    }, false);
  }
  
  function pageTracking(params) {
    var paramObj = {
      "uid": (typeof uid === "string") ? uid.trim() : "",
      "host": document.domain,
      "url": window.location.href,
      "referer_url": document.referrer,
      "referrer_url": document.referrer, // We hope server side script can recognise this argument.
      "screen_height": window.screen.height,
      "screen_width": window.screen.width,
      "brower": getBrowser(),
      "browser": getBrowser(), // We hope server side script can recognise this argument.
      "user_agent": window.navigator.userAgent,
      "city": (typeof city === "string") ? city.trim() : "",
      "source": urlArgs("source") || "", 
      "os": getOS(),
      "spider_type": getSpider(),
      "lon": (typeof lon === "undefined" || isNaN(lon)) ? "" : lon,
      "lat": (typeof lat === "undefined" || isNaN(lat)) ? "" : lat,
      "location_city": (typeof location_city === "string") ? location_city.trim() : "",
      "level1_page": (typeof level1_page === "string") ? level1_page.trim() : "",
      "level2_page": (typeof level2_page === "string") ? level2_page.trim() : "",
      "custom_id": (typeof custom_id === "string") ? custom_id.trim() : "",
      "webtype": getWebtype(),
      "is_register": getCookie("mid") ? '1' : '0',
      "uuid": getCookie("uuid") || ""
    };
    request(paramObj, params);
  }
  
  function eventTracking(params) {
    var paramObj = {
      'event':'',
      'event_name':'',
      'city':'',
      'weixin_house_id':'',
      'level1_page':'',
      'level2_page':'',
      'source': getCookie("source_name") || "",
      'param1':'',
      'param2':'',
      'param3':'',
      'param4':'',
      'webtype':getWebtype()
    };
    request(paramObj, params);
  }
  
  function request(paramObj, params) {
    var url = getRequestUrl(paramObj, params);
    var img = new Image();
    img.src = url;
    img.style.display = "none";
  }
  
  function getRequestUrl(paramObj, params) {
    // TODO
    var actionName = (params && params.act) ? params.act : (params && params.event ? "event" : "general");
    var host = "//tongji.leju.com/?site=gather&ctl=gather&act=" + actionName;
    var serializedPramString = getSerializedPrams(paramObj, params);
    return host + serializedPramString;
  }
  
  function getSerializedPrams(paramObj, args) {
    var result = "";
    var serializedObject = mergeObject(paramObj, args);
    for (var prop in serializedObject) {
      if (serializedObject[prop] === "") {continue;}
      var thisPramStr = prop + "=" + encodeURIComponent(serializedObject[prop]);
      result += "&" + thisPramStr;
    }
    return result;
  }
  
  function mergeObject(defaultObject, secondObject) {
    var result = Object.create(defaultObject);
    for (var prop in secondObject) {
      if (typeof result[prop] !== "undefined") {
        result[prop] = secondObject[prop];
      }
    }
    return result;
  }
  
  /**
   * Get operating system name
   *
   * @return {String} [other | Android | iOS | WPhone | BlackBerry | SymbianOS | windows | MacOSX | Linux | Unix]
   */
  function getOS() {
    var ua = navigator.userAgent;
    var regExpArr = [
      {regExp: /Android|Silk\//i, name: "Android"},
      {regExp: /iPhone|iPad|iPod/i, name: "iOS"},
      {regExp: /IEMobile/i, name: "WPhone"},
      {regExp: /BlackBerry|BB10|PlayBook/i, name: "BlackBerry"},
      {regExp: /SymbianOS/i, name: "SymbianOS"},
      {regExp: /Win/, name: "windows"},
      {regExp: /MacOS/, name: "MacOSX"},
      {regExp: /Linux/, name: "Linux"},
      {regExp: /X11/, name: "Unix"}
    ];
    return regExpQuery(regExpArr, ua, "other");
  }
  
  /**
   * Get browser name.
   * @return {String} [other | baidu | UCWEB | qq | 360SE | sogou | Opera | Firefox | Chrome | android | Safari | IE]
   */
  function getBrowser() {
    var ua = navigator.userAgent;
    var regExpArr = [
      {regExp: /baidubrowser|baiduboxapp/i, name: "baidu"},
      {regExp: /UCWEB|UCBrowser/i, name: "UCWEB"},
      {regExp: /MQQBrowser/i, name: "qq"},
      {regExp: /360SE/i, name: "360SE"},
      {regExp: /MetaSr/i, name: "sogou"},
      {regExp: /Opera|OPR\//i, name: "Opera"},
      {regExp: /Firefox/i, name: "Firefox"},
      {regExp: /Chrome/i, name: "Chrome"},
      {regExp: /Android|Silk\//i, name: "android"},
      {regExp: /Safari/i, name: "Safari"},
      {regExp: /MSIE|Trident/, name: "IE"},
    ];
    return regExpQuery(regExpArr, ua, "other");
  }
  
  function getSpider() {
    var ua=navigator.userAgent;
    var regExpArr = [
      {regExp: /Baiduspider/i, name: "Baidu"},
      {regExp: /sogou.+spider/i, name: "Sogou"},
      {regExp: /Googlebot/i, name: "Google"},
      {regExp: /spider|bot/i, name: "other"}
    ];
    return regExpQuery(regExpArr, ua);
  }
  
  function getWebtype(){
    var url = document.location.href;
    var regExpArr = [
      {regExp: /\/wap\/|site=wap/, name: "wap"},
      {regExp: /\/weixin\/|site=weixin|\/pay\//, name: "weixin"},
      {regExp: /\/weibo\/|site=weibo/, name: "weibo"},
      {regExp: /shihui/, name: "shihui"}
    ];
    return regExpQuery(regExpArr, url, "touch");
  }
  
  function urlArgs(name) {
    var regExp = new RegExp("(" + window.encodeURIComponent(name) + "=)([^&=]*)");
    var matches = location.search.substring(1).match(regExp);
    return matches ? window.decodeURIComponent(matches[2]) : null;
  }
  
  /**
   * Get cookie value by a specific name.
   * http://stackoverflow.com/a/15724300
   */
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      return parts.pop().split(";").shift();
    } else {
      return null;
    }
  }
  
  function regExpQuery(regExpArr, str, defaultValue) {
    var result = defaultValue || "";
    for (var i = 0, len = regExpArr.length; i < len; i++) {
      var thisPattern = regExpArr[i];
      if (str.match(thisPattern["regExp"])) {
        result = thisPattern["name"];
        break;
      }
    }
    return result;
  }
  
})(window, undefined);
