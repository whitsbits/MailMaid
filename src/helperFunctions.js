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
  var data = userProperties.getProperties();
  var dataSorted = Object.keys(data)
    .sort()
    .reduce(function (result, key){
      result[key] = data[key];
      return result;
    },
    {});
  var properties =[];
  for (var property in dataSorted){
      var propertyArray = dataSorted[property]
      .replace(/[\[\]"]/g,'')
      .split(',');
      properties.push(propertyArray)
  }
  return properties;
};

/**
 * Returns userProperties in the PropertyService 
 * as text for reporting in UI
 *  * @return {text} a text blob of current userProperties rules
 */

  function reportRules () {
    var properties = getUserPropsArr();
    var text = ''
    var keys = userProperties.getKeys();
    for (let i = 0; i < properties.length; i++) {
      if (keys.startsWith('Rule')){
        var action = properties[i][0];
        var search = properties[i][1];
        var days = properties[i][2];
        text += `Rule ${i + 1}: \n   Action: ${action} \n   Search: ${search} \n   Days: ${days} \n\n`
    }
  }
    Logger.log (`Returning ruleset: \n ${text}`)
    return text
  };

  function reportSchedule () {
    var properties = getUserPropsArr();
    var keys = userProperties.getKeys();
    var text = ''
    for (let i = 0; i < properties.length; i++) {
      if (keys==='Schedule'){
        var everyDays = properties[i][0];
        var atHour = properties[i][1];
        var amPM = properties[i][2];
        text += `You are currentl running the shedule every ${everyDays} days at ${atHour} ${amPM} \n\n`
      }
    }
    Logger.log (`Returning schedule: \n ${text}`)
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