/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */


function runDebugNow() {
  removeTriggers('purgeMore');
  makeCache(15000);
  callRetention();
}

function clearTriggers() {
  removeTriggers('GMailRetention');
  removeTriggers('purgeMore');
}

/**
 * Sets the cache as a syntetic value to skip the Inbox count
 */
function setCache() {
  makeCache(15000);
}

function listCache() {
  Logger.log ("inboxNum: " + cache.get('inBoxCache'));
  Logger.log ("ruleNum: " + cache.get('ruleLoopCache'));
  Logger.log ("threadNum: " + cache.get('threadLoopCache'));
}

  /**
 * Clears the InBox count cache
 */

   function clearAllCache() {
    cache.remove('inBoxCache');
    cache.remove('ruleLoopCache');
    cache.remove('threadLoopCache');
  }

  function clearInBoxCache() {
    cache.remove('inBoxCache');
  }

  function clearLoopCache() {
    cache.remove('ruleLoopCache');
  }

/**
 * Make synthetic InBox count to put in cache
 */

 function makeCache (total) {
  cache.put('inBoxCache', total, 1800)
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