/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

  /**
 * Run a debug with fresh values for triggers and caches
 */
function runDebugNow() {
  removeTriggers('purgeMore');
  clearAllCache();
  makeCache('inBoxCache', 1500);
  callRetention();
}

  /**
 * Clean up on aisle purgeMore trigger
 */
function clearMoreTriggers() {
  removeTriggers('purgeMore');
}

  /**
 * Clean up on aisle All triggers
 */

function clearAllTriggers() {
  removeTriggers('GMailRetention');
  removeTriggers('purgeMore');
}

  /**
 * list the cache(s) values
 */
function listCache() {
  Logger.log ("inboxNum: " + cache.get('inBoxCache'));
  Logger.log ("ruleNum: " + cache.get('ruleLoopCache'));
  Logger.log ("threadNum: " + cache.get('threadLoopCache'));
}

  /**
 * Clears the cache(s)
 */

   function clearAllCache() {
    cache.remove('inBoxCache');
    cache.remove('ruleLoopCache');
    cache.remove('threadLoopCache');
    Logger.log (`All Caches Cleared`)
  }

  function clearInBoxCache() {
    cache.remove('inBoxCache');
  }

  function clearLoopCache() {
    cache.remove('ruleLoopCache');
  }

  /**
 * Clears the PropertyService of any stored userProperties
 */
   function clearProperties() {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.deleteAllProperties();
  }


  function listProperties() {
    var userProperties = PropertiesService.getUserProperties();
    Logger.log (userProperties.getProperties());
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
  var newKey = ('rule' + ruleNumber);
  var jarray = JSON.stringify(rule);
var userProperties = PropertiesService.getUserProperties();
userProperties.setProperties({[newKey] : jarray});
}

/**
 * Not currently used
 * Returns values from 2D array as string
 *  * @return {str} a string
  */

 function arrToString (arr) {
  let str = '';
    for(let i = 0; i < arr.length; i++){
      if(Array.isArray(arr[i])){
          str += `${arrayToString(arr[i])} `;
      }else{
          str += `${arr[i]} `;
      };
    };
    Logger.log (str)
    return str;
  };