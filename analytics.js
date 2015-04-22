(function(window, undefined){

  window.analytics = (function(){
    initAll();
    return {
      pageTrack: pageTracking,
      eventTrack: eventTracking
    };
  })();
  
  function initAll() {
    addEventListener(window, "load", bindEventTrack);
  }
  
  function bindEventTrack(event) {
    var links = document.getElementsByTagName("a");
    for (var i = 0, len = links.length; i < len; i++) {
      (function(thisLink) {
        addEventListener(thisLink, "click", function(event){
          var gather = this.getAttribute("gather") || this.getAttribute("gather_new") || "";
          var obj = eval("("+gather+")");
          eventTracking(obj);
          return false;
        });
      })(links[i]);
    }
    return false;
  }
  
  // A String.trim() method for ECMAScript 3 
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }
  
  function pageTracking(params) {
    var args = urlArgs();
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
      "source": args.source || "", 
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
  
  /**
   * Get operating system name
   *
   * @return {String} [other | Android | iOS | WPhone | BlackBerry | SymbianOS | windows | MacOSX | Linux | Unix]
   */
  function getOS() {
    var result = "other";
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
   * @return {String} [other | baidu | UCWEB | qq | 360SE | sogou | Opera | Firefox | Chrome | android | Safari | IE]
   */
  function getBrowser() {
    var result = "other";
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
    
    for (var i = 0, len = regExpArr.length; i < len; i++) {
      var thisPattern = regExpArr[i];
      if (ua.match(thisPattern["regExp"])) {
        result = thisPattern["name"];
        break;
      }
    }
    return result;
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
  
  function addEventListener(dom, eventName, callback) {
    if (window.jQuery || window.Zepto) {
      $(dom).on(eventName, callback);
    } else if (dom.addEventListener) {
      dom.addEventListener(eventName, callback, false);
    } else if (dom.attachEvent) {
      dom.attachEvent("on" + eventName, callback);
    }
  }
  
})(window, undefined);
