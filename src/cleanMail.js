/**
 * Get each of the rules and attributes from getRulesArr()
 * Find messages pertaining to the search
 * step through each thread batch set by 'inc' (default Global var set to 500)
 * process them according to the action 
 * based on number of days between message date and action date based on num 'days' from today
 * Check that timer hasnt reach near 5 min Google time limit
 * If time-out save the sate of the loop to the cache and set a trigger to restart in 60 min
 */

function cleanMail() {
  var rules = getRulesArr();
  let resultsArr = [];
  const scriptStart = new Date();
  let loopBreak = 0;

  let rulesCached = cache.getNumber('ruleLoopCache'); //get value from cache if app is woken from timout
  let countStart = cache.getNumber('threadLoopCache'); 
  let counterCached = cache.getNumber('counterCache'); 
  let resultsCached = cache.getObject('results');
  
  if (rulesCached === null) {
    // check to see if the value has not been cached and use zero to start from begining if it hasn't
    rulesCached = 0;
  }
  if (resultsCached !== null) {
    // check to see if the value has not been cached and use zero to start from begining if it hasn't
    resultsArr = resultsCached;
  }

rulesloop:
for (let i = rulesCached; i < rules.length; i++) {
  let counter = 0;
  if (rulesCached !== null && counterCached !== null) {
    // check to see if the app is worken from sleep and get last count value  
    // and if count has been cached use value to resume count of the process
    counter = counterCached;
  };

  if (Array.isArray(rules)) {
      var action = rules[i][0];
      var searchString = rules[i][1];
      var days = rules[i][2];
  }else{
    Logger.log (`${user} - No rules set for processing`)
    sendReportEmail(["MailMaid had no rules to process your Inbox","Please set up your rules in the app."]);
    break rulesloop;
  }

  const actionDate = new Date();
      actionDate.setDate(actionDate.getDate() - days);
      
    Logger.log (`${user} - Processing inbox with rule set: ${action}, ${searchString}, ${days}`);
  
    if (countStart === null) {
      // check to see if the value has not been cached and use zero to start from begining if it hasn't
      countStart = 0;
    }

    searchloop:
    while (loopBreak = 0) {
      const threads = GmailApp.search(searchString, countStart, inc);  // find a block of messages
      if (threads.length === 0) {
          break searchloop;
      }

      for (let j = 0; j < threads.length; j++) {  //Start looping the messages in threads

        const msgDate = threads[j].getLastMessageDate();
  
        if (action === 'Archive') {
                    
          if (msgDate < actionDate) {
            threads[j].moveToArchive();
            ++counter;
          }
        }
          if (action === 'Purge') {
          if (msgDate < actionDate) {
            threads[j].moveToTrash();
            ++counter;
          }
        }

        if (isTimeUp_(scriptStart, timeOutLimit)) {
          /** * When script runs close to the 5 min timeout limit take the count, 
           * cache it and set a trigger to researt after an hour */
          Logger.log(`${user} - Inbox rules loop time limit exceeded.`);
          if (action === 'Archive'){
            Logger.log(`${user} - ${counter} total threads archived`);
          };
          if (action === 'Purge'){
            Logger.log(`${user} - ${counter} total threads deleted`);
          };
          cache.putNumber('counterCache', counter, ttl) // cache the count
          cache.putNumber('ruleLoopCache', i, ttl); // cache the rule loop location
          cache.putNumber('threadLoopCache', j, ttl); // cache the thread loop location
          Logger.log(`${user} - Timed out at partial count of ${counter} in Rule ${i} and Thread ${j}. Values put in cache`);
          if(triggerActive('cleanMore') === false){
            Logger.log (`${user} - Setting a trigger to call the cleanMore function.`)
            setMoreTrigger('cleanMore');
          }else{
            Logger.log (`${user} - Next trigger already Set`)
          }
          loopBreak = 1;
          break rulesloop;
         }
      };
    
    countStart += inc; // work through the inbox in incremental chunks
    };

      Logger.log(`${user} - ${counter} total threads ${action}d`);
      resultsArr.push ([{ id:i, counter:counter, action:action, searchString:searchString, days:days }])
      cache.putObject(`result`, resultsArr);
      Logger.log(`${user} - Finished processing rule set: ${action}, ${searchString}, ${days} from index ${countStart}`);
      clearCache('threadLoopCache');
      clearCache('counterCache');
}

//If the loop didnt break, end the processing of the script
  if (loopBreak != 1) {
    clearCache('ruleLoopCache');
    removeTriggers('cleanMore')
    Logger.log(`${user} - Final tally: \n ${resultsArr}`);
    var lastRun = JSON.stringify(Date.now());
    userProperties.deleteProperty('lastRunEpoch')
    userProperties.setProperties({'lastRunEpoch': lastRun})
    Logger.log (`${user} - Setting last run data as ${lastRun}`)
    sendReportEmail(resultsArr);
  }
};



