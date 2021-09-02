/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

function runDebugNow() {
  removeTriggers('purgeMore');
  makeCache(15000);
  callRetention();
}

/**
 * Sets the cache as a syntetic value to skip the Inbox count
 */
function setCache() {
  makeCache(15000);
}

/**
 * Make synthetic InBox count to put in cache
 */

 function makeCache (total) {
  cache.put('inBoxCache', total, 1800)
}

/**
 * Debugging to synthetically load the PropertiesService
 */
function loadProperties() {
  var userProperties = PropertiesService.getUserProperties();
  var search = 'foo';
  var days = 31;
  var action = 'purge';
  var rule = [action, search, days];
  var keys = userProperties.getKeys();
  var ruleNumber = keys.length;
  var newKey = ('rule ' + ruleNumber);
  var jarray = JSON.stringify(rule);
var userProperties = PropertiesService.getUserProperties();
userProperties.setProperties({[newKey] : jarray});
}