(function(window, undefined){

  window.analytics = {
    getOS: getOS
  };
  
  /* Get operating system name */
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
      {regExp: /X11/, name: "Unix"},
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
  
  function getBrowser() {
  
  }
  
  function getHost() {
  
  }
  
  function getReferer() {
  
  }
  
  function getUserAgent() {
  
  }
  
  function getScreenWidth() {
  
  }
  
  function getScreenHeight() {
  
  }
  
  function getPageUrl() {
  
  }
  
  function getCity() {
  
  }
  
  function getWebType() {
  
  }
  
  function getUUID() {
  
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