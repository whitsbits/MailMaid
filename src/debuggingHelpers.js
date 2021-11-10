/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

  /**
 * Run a debug with fresh values for triggers and caches
 */
function runDebugNow() {
  removeTriggers('cleanMore');
  clearAllCache();
  makeCache('inBoxCache', 1500);
  //makeCache('ruleLoopCache', 4)
  //makeCache('threadLoopCache', 1000)
  cleanMail();
}

function getHash() {
  const user = "kplachhwani@gmail.com"
  const userString = String(user)
  const userhash = MD5( userString, false );
  Logger.log (userhash)
}

function zeroLicense() {
  userProperties.setProperties({"license" : ""})
}

  /**
 * Clean up on aisle cleanMore trigger
 */
function clearMoreTriggers() {
  removeTriggers('cleanMore');
}

  /**
 * Clean up on aisle All triggers
 */

function clearAllTriggers() {
  removeTriggers('MailMaid');
  removeTriggers('cleanMore');
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

  function makeSchedule() {
    var schedule = JSON.stringify([1,1])
      userProperties.deleteProperty('schedule')
      userProperties.setProperties({'schedule' : schedule});
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
  makeCache('editRuleNum', 'rule0');
    userProperties.setProperties({rule1 : JSON.stringify(['Purge','category:promotions','7'])});
    userProperties.setProperties({rule2 : JSON.stringify(['Purge','category:social','7'])});
    userProperties.setProperties({rule3 : JSON.stringify(["Archive","category:updates","30"])});
    userProperties.setProperties({rule4 : JSON.stringify(["Purge","category:updates -category:purchases","180"])});
    userProperties.setProperties({rule6 : JSON.stringify(["Purge","from:calendar-notification@google.com","7"])});
    userProperties.setProperties({rule5 : JSON.stringify(["Purge","subject:MailMaid Results","3"])});
    userProperties.setProperties({rule7 : JSON.stringify(["Purge","category:forums","14"])});
    userProperties.setProperties({rule8 : JSON.stringify(["Purge","label:GoodSync","5"])});
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