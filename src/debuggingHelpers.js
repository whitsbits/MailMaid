/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

function runDebugNow() {
  removePurgeMoreTriggers();
  makeCache(35000);
  callRetention();
}

/**
 * Sets the cache as a syntetic value to skip the Inbox count
 */
function setCache() {
  makeCache(35000);
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


function testLoadProperties() {
  const userProperties = PropertiesService.getUserProperties();
          const rule = new Object();
          rule.searchString = 'bar';
          rule.days = 35;
          rule.action = 'purge';
          var keys = userProperties.getKeys();
          var ruleNumber = keys.length;
          var newKey = ('Rule' + ruleNumber);
          Logger.log (rule)
          Logger.log (rule.days);
          userProperties.setProperties({[newKey] : (rule)});
  }

/**
 * Testing the format of various methods
 */

 function testUserProps() {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  var handMade = {rule1:{searchString:'foo', action:'purge', days:35}}
  Logger.log(whatAmI (retentionSchedule));
  Logger.log(whatAmI (handMade));
  Logger.log ('+_+_+_+_+_+_+_+_')
  Logger.log (retentionSchedule)
  Logger.log (retentionSchedule.rule0);
  Logger.log (retentionSchedule.rule0.days);
  Logger.log ('+_+_+_+_+_+_+_+_')
  Logger.log (handMade);
  Logger.log (handMade.rule1);
  Logger.log (handMade.rule1.days);
  }