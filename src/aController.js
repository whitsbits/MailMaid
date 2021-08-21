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

function getUserPropsArr() {
      var userProperties = PropertiesService.getUserProperties();
      var retentionSchedule = userProperties.getProperties();
      var rules =[];
      for (var rule in retentionSchedule){
          var ruleArray = retentionSchedule[rule]
          .replace(/[\[\]]/g,'')
          .split(',');
          rules.push(ruleArray)
      }
      return rules;
  };

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
        text += `Rule ${i}: \n   Action:${action} \n   Search:${search} \n   Days:${days} \n\n`
    }
    return text
  };


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