
function buildSearchURL (searchString) {
  var baseURL = `https://mail.google.com/mail/u/0/#search/`
  let encoded = encodeURIComponent(searchString);
  let url = baseURL + encoded;
  Logger.log (url);
  return url;
}

