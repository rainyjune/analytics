(function(window, undefined){

  window.analytics = {
    getOS: getOS,
    getBrowser: getBrowser
  };
  
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
    return "unknown";
  }
  
  /** 
   * TODO
   */
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
  
  }
  
  function getWebType() {
  
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
  
  function getLongitude() {
  
  }
  
  function getLatitude() {
    
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
  
})(window, undefined);