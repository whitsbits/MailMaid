/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

  /**
 * Run a debug with fresh values for triggers and caches
 */
function runDebugNow() {
  removeTriggers('purgeMore');
  clearAllCache();
  makeCache('inBoxCache', 15000);
  makeCache('ruleLoopCache', 2)
  makeCache('threadLoopCache', 9000)
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
  Logger.log ("editRuleNum: " + cache.get('editRuleNum'));
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
 * Returns userProperties in the PropertyService
 * sorts the objects and converts the object to an array 
 *  * @return {userProperties} an 2D array
 */

 function getUserPropsArr() {
  var data = userProperties.getProperties();
  keys = Object.keys(data),
  i, len = keys.length;
  keys.sort();

  var properties =[];
  for (var i = 0; i < len; i++) {
    k = keys[i];
      var propertyValue = data[k]
      //.replace(/[\[\]"]/g,'')
      .split(',');
      properties.push(propertyValue)
  }
  Logger.log (`Returning userPropertiesArr ${properties}`)
  return properties;
};

  /**
 * Clears the PropertyService of any stored userProperties
 */
   function clearProperties() {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.deleteAllProperties();
  }

  function listProperties() {
    var properties = userProperties.getProperties();
    Logger.log(properties);
  }

  function clearRuleZero() {
    userProperties.deleteProperty(`rule2`);
  }

/**
 * Debugging to synthetically load the PropertiesService
 */
function mockFormCapture() {
  var userProperties = PropertiesService.getUserProperties();
  var search = 'foo';
  var days = 31;
  var action = 'Purge';
  var rule = [action, search, days];
  var keys = userProperties.getKeys();
  var ruleNumber = keys.length;
  var newKey = ('rule' + ruleNumber);
  var jarray = JSON.stringify(rule);
var userProperties = PropertiesService.getUserProperties();
userProperties.setProperties({[newKey] : jarray});
}

function loadRules() {
  clearAllRules();
    userProperties.setProperties({rule1 : JSON.stringify(['Purge','category:purchase','7'])});
    userProperties.setProperties({rule2 : JSON.stringify(['Purge','category:social','7'])});
    userProperties.setProperties({rule3 : JSON.stringify(["Archive","category:updates","30"])});
    userProperties.setProperties({rule4 : JSON.stringify(["Purge","category:updates -category:purchases","180"])});
    userProperties.setProperties({rule6 : JSON.stringify(["Purge","from:calendar-notification@google.com","7"])});
    userProperties.setProperties({rule5 : JSON.stringify(["Purge","label:goodsync","7"])});
    userProperties.setProperties({rule7 : JSON.stringify(["Purge","from:Notification@leagueathletics.com","14"])});
    getRulesArr();
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