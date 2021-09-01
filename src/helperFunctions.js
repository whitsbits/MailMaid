/**
 * Helper fucntions to help run scrips.
 */

/**
 * Sets the environmental variable to baseline before running the main process
 */

function RunCleanNow() {
    removeTriggers('purgeMore');
    callRetention();
  }

  /**
 * Wrapper for the purge function called by timeOut trigger
 */
 function purgeMore() {
  callRetention();
}

/**
 * Deletes all triggers that call the purgeMore function.
 */
 function removeTriggers(triggerName) {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.getHandlerFunction() === triggerName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  Logger.log(`Trigger ${triggerName} removed`);
}

  /**
 * Clears the PropertyService of any stored userProperties
 */
function clearProperties() {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.deleteAllProperties();
    gotoRootCard();
  }

  /**
 * Clears the InBox count cache
 */

  function clearCache() {
    cache.remove('inBoxCache');
  }

/**
 * Returns userProperties in the PropertyService
 * and converts the object to an array 
 *  * @return {rules} an 2D array with [ruleNum][rule atribute]
 */

 function getUserPropsArr() {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  var retentionScheduleSorted = Object.keys(retentionSchedule)
    .sort()
    .reduce(function (result, key){
      result[key] = retentionSchedule[key];
      return result;
    },
    {});
  var rules =[];
  for (var rule in retentionScheduleSorted){
      var ruleArray = retentionScheduleSorted[rule]
      .replace(/[\[\]"]/g,'')
      .split(',');
      rules.push(ruleArray)
  }
  return rules;
};

/**
 * Returns userProperties in the PropertyService 
 * as text for reporting in UI
 *  * @return {text} a text blob of current userProperties rules
 */

  function reportRules () {
    var rules = getUserPropsArr();
    var text = ''
    for (let i = 0; i < rules.length; i++) {
        var action = rules[i][0];
        var search = rules[i][1];
        var days = rules[i][2];
        Logger.log (action)
        Logger.log (search)
        Logger.log (days)
        text += `Rule ${i + 1}: \n   Action: ${action} \n   Search: ${search} \n   Days: ${days} \n\n`
    }
    Logger.log (`Returning ruleset: \n ${text}`)
    return text
  };

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