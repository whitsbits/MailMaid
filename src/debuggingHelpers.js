/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

function RunNow() {
  removePurgeMoreTriggers();
  makeCache(35000);
  inBoxLooper ('purge','from:contact@email.cbssports.com',10)
  //callRetention();
}

/**
 * Sets the cache as a syntetic value to skip the Inbox count
 */
function setCache() {
  makeCache(35000);
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