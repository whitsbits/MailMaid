/**
 * Controller fucntions to help run scrips for debugging and operations.
 */

function RunNow() {
  removePurgeMoreTriggers();
  makeCache(35000);
  inBoxLooper ('purge','from:contact@email.cbssports.com',10)
  //callRetention();
}

function setCache() {
  makeCache(35000);
}

function loadProperties() {
  var userProperties = PropertiesService.getUserProperties();
  var search = 'foo';
  var days = 31;
  var action = 'purge'; //TODO: HARDCODED Make this a choice in the UI
  var rule = [action, search, days];
  var keys = userProperties.getKeys();
  var ruleNumber = keys.length;
  var newKey = ('rule ' + ruleNumber);
  var jarray = JSON.stringify(rule);
var userProperties = PropertiesService.getUserProperties();
userProperties.setProperties({[newKey] : jarray});
}

function RunCleanNow() {
    removePurgeMoreTriggers();
    callRetention();
  }

function clearProperties() {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.deleteAllProperties();
  }

function clearCache() {
    cache.remove('inBoxCache');
  }

function getUserProps() {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  Logger.log (retentionSchedule)
        for (var key in retentionSchedule) {
            Logger.log('Key: %s, Value: %s', key, retentionSchedule[key]);
        }
  }