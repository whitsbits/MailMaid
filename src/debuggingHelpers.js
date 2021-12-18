/**
 * Debugging scripts to force a run any bypass InBoxCount and PropertiesService calls
 */

  /**
 * Run a debug with fresh values for triggers and caches
 */
function runDebugNow() {
  timeOutLimit = 3000;  
  clearAllCache();
  removeTriggers('cleanMore');
  //cache.putNumber('ruleLoopCache', 2)
  //cache.putNumber('searchBatchStartCache', 500)
  //cache.putNumber('threadLoopCache', 299)
  //cache.putNumber('counterCache', 31)
  cleanMail();
}

 /**
 * Wrapper for the purge function called by timeOut trigger
 */
 function runDebugCleanMore() {
  timeOutLimit = 100000;
  removeTriggers('cleanMore');
  cleanMail();
}

function testThreadsEnd() {
  let increment = 10
  let countStart = 0
  do{
  var threads = GmailApp.search('from:stewart.l.whitman@gmail.com', countStart, increment);
  Logger.log (threads.length);
  let batch = (`${countStart} to ${countStart + increment}`);
  for (let j = 0; j < threads.length; j++){
    let id = threads[j].getFirstMessageSubject();
      Logger.log ("Batch: " + batch + " - " + id)
    }
    countStart += increment
  } while (threads.length > 0);
}

function testCache() {
var test = cache.getObject('rule5')
Logger.log (test)
}

function getHash() {
  const user = "stew@pasighudson.com"
  const userString = String(user)
  const userhash = MD5( userString, false );
  Logger.log (userhash)
}

function zeroLicense() {
  userProperties.setProperties({"license" : ""})
}

/**
 * Deletes a trigger.
 * @param {string} triggerId The Trigger ID.
 */
function deleteTrigger(triggerId) {
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[i].getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}

/**
 * Deletes a trigger.
 * @param {string} triggerId The Trigger ID.
 */
function listTriggers() {
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // If the current trigger is the correct one, delete it.
    var currTrigger = allTriggers[i].getUniqueId()
      Logger.log(currTrigger);
    }
  }

  /**
 * Clean up on aisle More trigger
 */
function clearMoreTriggers() {
  removeTriggers('cleanMore');
  removeTriggers('countMore');
}

  /**
 * Clean up on aisle All triggers
 */

function clearAllTriggers() {
  removeTriggers('MailMaid');
  removeTriggers('cleanMore');
  removeTriggers('countMore');
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
  cache.putString('editRuleNum', 'rule0');
  userProperties.setProperties({rule1 : JSON.stringify(['Purge', 'category:promotions', '7', '1'])});
  userProperties.setProperties({rule2 : JSON.stringify(['Purge', 'subject:MailMaid Results', '3', '2'])});
  userProperties.setProperties({rule3 : JSON.stringify(['Purge', 'from:calendar-notification@google.com', '7', '3'])});
  userProperties.setProperties({rule4 : JSON.stringify(['Purge', 'category:forums', '14', '4'])});
  userProperties.setProperties({rule5 : JSON.stringify(['Archive', 'category:updates -category:purchases', '30', '5'])});
  userProperties.setProperties({rule6 : JSON.stringify(['Archive', 'category:purchases', '30', '6'])});
  userProperties.setProperties({rule7 : JSON.stringify(['Purge', 'from:bobby.sentinelgoalie@gmail.com', '30', '7'])});
  userProperties.setProperties({rule8 : JSON.stringify(['Purge', 'from:shipment-tracking@amazon.com', '180', '8'])});
  userProperties.setProperties({rule9 : JSON.stringify(['Purge', 'from:auto-confirm@amazon.com', '180', '9'])});
  userProperties.setProperties({rule10 : JSON.stringify(['Purge', 'from:newsletters@bostonglobe.com', '14', '10'])});
  userProperties.setProperties({rule11 : JSON.stringify(['Purge', 'from:no-reply@accounts.google.com', '30', '11'])});
  userProperties.setProperties({rule12 : JSON.stringify(['Purge', 'category:social', '7', '12'])});
  userProperties.setProperties({rule13 : JSON.stringify(['Purge', 'label:GoodSync', '5', '13'])});
  userProperties.setProperties({rule14 : JSON.stringify(['Purge', 'category:updates -category:purchases', '90', '14'])});
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