(function(window, undefined){

  window.analytics = {
    pageTrack: pageTracking,
    eventTrack: eventTracking
  };
  
  // A String.trim() method for ECMAScript 3 
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }
  
  function pageTracking(params) {
    var args = urlArgs();
    var paramObj = {
      "uid": getUid(),
      "host": getHost(),
      "url": getPageUrl(),
      "referer_url": getReferer(),
      "screen_height": getScreenHeight(),
      "screen_width": getScreenWidth(),
      "brower": getBrowser().name,
      "browser": getBrowser().name, // We hope server side script can recognise this argument.
      "user_agent": getUserAgent(),
      "city": getCity(),
      "source": args.source || "", 
      "os": getOS(),
      "spider_type": getSpider(),
      "lon": getLongitude(),
      "lat": getLatitude(),
      "location_city": getLocationCity(),
      "level1_page": getLevel1Page(),
      "level2_page": getLevel2Page(),
      "custom_id": getCustomId(),
      "webtype": getWebtype()
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
      'source':'',
      'param1':'',
      'param2':'',
      'param3':'',
      'param4':'',
      'webtype':''
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
    var host = "http://tongji.leju.com/?site=gather&ctl=gather&act=general";
    var serializedPramString = getSerializedPrams(paramObj, params);
    return host + serializedPramString;
  }
  
  function getSerializedPrams(paramObj, args) {
    var result = "";
    var serializedObject = mergeObject(paramObj, args);
    for (var prop in serializedObject) {
      var thisPramStr = prop + "=" + encodeURIComponent(serializedObject[prop]);
      result += "&" + thisPramStr;
    }
    return result;
  }
  
  function mergeObject(defaultObject, secondObject) {
    if (window.jQuery || window.Zepto) {
      return $.extend({}, defaultObject, secondObject);
    } else {
      var result = {};
      for (var prop in defaultObject) {
        result[prop] = defaultObject[prop];
      }
      for (var prop in secondObject) {
        if (result.hasOwnProperty(prop)) {
          result[prop] = secondObject[prop];
        }
      }
      return result;
    }
  }
  
  function getUid() {
    return (typeof uid == "string") ? uid.trim() : "";
  }
  /**
   * Get operating system name
   *
   * @return {String} [unknown | Android | iOS | WindowsPhone | BlackBerry | Symbian | Windows | MacOSX | Linux | Unix]
   */
  function getOS() {
    var result = "unknown";
    var ua = navigator.userAgent;
    var regExpArr = [
      {regExp: /Android|Silk\//i, name: "Android"},
      {regExp: /iPhone|iPad|iPod/i, name: "iOS"},
      {regExp: /IEMobile/i, name: "WindowsPhone"},
      {regExp: /BlackBerry|BB10|PlayBook/i, name: "BlackBerry"},
      {regExp: /SymbianOS/i, name: "Symbian"},
      {regExp: /Win/, name: "Windows"},
      {regExp: /MacOS/, name: "MacOSX"},
      {regExp: /Linux/, name: "Linux"},
      {regExp: /X11/, name: "Unix"}
    ];
    
    for (var i = 0, len = regExpArr.length; i < len; i++) {
      var thisPattern = regExpArr[i];
      if (ua.match(thisPattern["regExp"])) {
        result = thisPattern["name"];
        break;
      }
    }
    return result;
  }
  
  /**
   * Get browser name.
   * TODO
   * @return {String} [unkown | Safari | Chrome | Android Browser | Opera | IE Mobile | IE | Firefox | UC]
   */
  function getBrowser() {
    var s = navigator.userAgent.toLowerCase();
    var match = /(webkit)[ \/]([\w.]+)/.exec(s) ||
        /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(s) ||
        /(msie) ([\w.]+)/.exec(s) ||
        !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
        [];
    return { name: match[1] || "", version: match[2] || "0" };
  }
  
  function getHost() {
    return window.location.host;
  }
  
  function getReferer() {
    return document.referrer;
  }
  
  function getUserAgent() {
    return window.navigator.userAgent;
  }
  
  function getScreenWidth() {
    return window.screen.width;
  }
  
  function getScreenHeight() {
    return window.screen.height;
  }
  
  function getPageUrl() {
    return window.location.href;
  }
  
  function getCity() {
    return (typeof city == "string") ? city.trim() : "";
  }
  
  function getLocationCity() {
    return (typeof location_city == "string") ? location_city.trim() : "";
  }
  
  function getLevel1Page() {
    return (typeof level1_page == "string") ? level1_page.trim() : "";
  }
  
  function getLevel2Page() {
    return (typeof level2_page == "string") ? level2_page.trim() : "";
  }
  
  function getCustomId() {
    return (typeof custom_id == "string") ? custom_id.trim() : "";
  }
  
  /**
   * Create GUID / UUID
   * http://stackoverflow.com/a/8809472
   * @return {String} 
   */
  function getUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  }
  
  function getSpider() {
    var useragent=navigator.userAgent.toLowerCase();
    if(useragent.indexOf('spider') > 0 || useragent.indexOf('bot') > 0) {
      if(useragent.indexOf('baidu') > 0) {
        return 'Baidu';
      } else if(useragent.indexOf('sogou') > 0) {
        return 'Sogou';
      } else if(useragent.indexOf('google') > 0) {
        return 'Google';
      } else {
        return 'other';
      }
    } else {
      return '';
    }
  }
  
  function getWebtype(){
    var url = document.location.href;
    if(url.indexOf('/wap/') > 0 || url.indexOf('site=wap') > 0) {
      return 'wap';
    } if(url.indexOf('/weixin/') > 0 || url.indexOf('site=weixin') > 0) {
      return 'weixin';
    } if(url.indexOf('/pay/') > 0) {
      return 'weixin';
    } if(url.indexOf('/weibo/') > 0 || url.indexOf('site=weibo') > 0) {
      return 'weibo';
    } if(url.indexOf('shihui') > 0) {
      return 'shihui';
    }
    return 'touch';
  }
  
  function getLongitude() {
    if (typeof lon == "undefined") {
      return "";
    }
    return isNaN(lon) ? "" : lon;
  }
  
  function getLatitude() {
    if (typeof lat == "undefined") {
      return "";
    }
    return isNaN(lat) ? "" : lat;
  }
  
  /*
   * This function parses ampersand-separated name=value argument pairs from
   * the query string of the URL. It stores the name=value pairs in
   * properties of an object and returns that object. Use it like this:
   *
   * var args = urlArgs();  // Parse args from URL
   * var q = args.q || "";  // Use argument, if defined, or a default value
   * var n = args.n ? parseInt(args.n) : 10;
   */
  function urlArgs() {
    var args = {};                             // Start with an empty object
    var query = location.search.substring(1);  // Get query string, minus '?'
    var pairs = query.split("&");              // Split at ampersands
    for(var i = 0; i < pairs.length; i++) {    // For each fragment
      var pos = pairs[i].indexOf('=');       // Look for "name=value"
      if (pos == -1) continue;               // If not found, skip it
      var name = pairs[i].substring(0,pos);  // Extract the name
      var value = pairs[i].substring(pos+1); // Extract the value
      value = decodeURIComponent(value);     // Decode the value
      args[name] = value;                    // Store as a property
    }
    return args;                               // Return the parsed arguments
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
  
})(window, undefined);