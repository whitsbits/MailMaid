/**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * {{[newKey] : jarray}} Rule Array saved to PropertiesService
 * @param {Object} e - Event from add-on server
 * @return {notify with Card to be built}
 */

function captureRuleFormData(e) {

  var search = e.formInput.search;
  var days = e.formInput.days;
  var action = e.formInput.action;

  if (search === undefined) {
    return notify(`Please tell MailMaid which messages need to be removed by adding a search term`, rulesManagerCard())
  } else if (days === undefined) {
    return notify(`Please enter a number of days before MailMaid cleans the messages`, rulesManagerCard())
  } else if (isNaN(days)) {
    return notify(`Please enter a number only for days`, rulesManagerCard())
  }

  if (e.parameters.ruleNum === undefined) {
    var key = null;
    var ruleNum = (countRules() + 1);
  } else {
    var key = e.parameters.ruleNum.toString();
    var ruleNum = key.substring(4);
  }

  var rule = [action, search, days, ruleNum];
  if (key === 'rule0') {
    return notify("Select a rule from above to Replace, otherwise Save As a New Rule", rulesManagerCard())
  }
  if (key === null) {
    key = ('rule' + ruleNum);
  }
  var jarray = JSON.stringify(rule);
  Logger.log(`${user} - Key set as ${key}`);
  try {
    userProperties.setProperties({ [key]: jarray });
  }
  catch (e) {
    Logger.log(`${user} - Error: ${e.toString()}`);
    return `Error: ${e.toString()}`;
  }
  Logger.log(`${user} - Rule Saved as ${key}`);
  return notify(`Rule Saved as ${key}`, rulesManagerCard());
};


/**
* Build InBox Processing rule into Array and save user inputs to PropertiesService.
* Cleaner shchedule set to Triggers
* @param {Object} e - Event from add-on server
@return {notify with Card to be built}
*/

function captureScheduleFormData(e) {
  var everyDays = parseInt(e.formInput.everyDays, 10);
  var atHour = parseInt(e.formInput.atHour, 10);

  if (everyDays === undefined) {
    return notify(`Please enter the number of days for how often you want MailMaid to clean`, scheduleCard())
  } else if (isNaN(everyDays)) {
    return notify(`Please enter a number only for how often you want MailMaid to clean`, scheduleCard())
  }

  if (atHour === undefined) {
    return notify(`Please enter the the time of day you want MailMaid to clean`, scheduleCard())
  } else if (isNaN(atHour)) {
    return notify(`Please enter a number only for time of day you want MailMaid to clean`, scheduleCard())
  }

  var schedule = [everyDays, atHour];
  var jarray = JSON.stringify(schedule);

  try {
    var data = userProperties.getProperty('schedule');
    if (data == null) {
      userProperties.setProperties({ 'schedule': jarray });
      removeTriggers('MailMaid');
      setTrigger('MailMaid', atHour, everyDays);
    }
    userProperties.deleteProperty('schedule')
    userProperties.setProperties({ 'schedule': jarray });
    removeTriggers('MailMaid');
    setTrigger('MailMaid', atHour, everyDays);
  }
  catch (e) {
    Logger.log(`${user} - Error: ${e.toString()}`);
    return `Error: ${e.toString()}`;
  }
  Logger.log(`${user} - MailMaid schedule saved to run every ${everyDays} day(s) at ${atHour}`);
  return notify(`MailMaid schedule saved to run every ${everyDays} day(s) at ${atHour}`, scheduleCard());

}


/**
* Build InBox Processing rule into Array and save user inputs to PropertiesService.
* Cleaner shchedule set to Triggers
* @param {Object} e - Event from add-on server
* @return {notify with Card to be built}
*/

function captureSuggestionFormData(e) {
  var beforeDate = Number(e.formInput.beforeDate.msSinceEpoch).toFixed(0);
  var afterDate = Number(e.formInput.afterDate.msSinceEpoch).toFixed(0);
  var numResults = parseInt(e.formInput.numResults, 10);
  var suggestionResultChoice = e.formInput.suggestionResultChoice

  if (beforeDate === undefined || afterDate === undefined) {
    return notify(`Please enter a before and after date for the suggestion search`, suggestionCard())
  } else if (isValidTimestamp(beforeDate) || isValidTimestamp(afterDate)) {
    return notify(`Please enter only date value for the start and end of the suggestion search`, suggestionCard())
  }

  if (numResults === undefined || (isNaN(numResults))) {
    return notify(`Please enter a number for how many suggestions you want MailMaid to make.`, suggestionCard())
  } else if (numResults < 5 || numResults > 100) {
    return notify(`Please enter a number greater than 5 or less than 100.`, suggestionCard());
  };

  let bDate = searchDateConverter(beforeDate);
  let aDate = searchDateConverter(afterDate);
  Logger.log(`${user} - SenderSuggestions for ${bDate} to ${aDate} for ${suggestionResultChoice} with ${numResults} results`);

  try {
    countSenders(aDate, bDate, numResults, suggestionResultChoice);
  }
  catch (e) {
    Logger.log(`${user} - Error: ${e.toString()}`);
    return `Error: ${e.toString()}`;
  }
  return notify(`SenderSuggestions for ${bDate} to ${aDate} for ${suggestionResultChoice} with ${numResults} results`, suggestionCard());
}