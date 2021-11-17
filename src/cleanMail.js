/**
 * Get each of the rules and attributes from getUserPropsArr()
 * Find messages pertaining to the search
 * step through each thread batch set by 'inc' (default Global var set to 500)
 * process them according to the action 
 * based on number of days between message date and action date based on num 'days' from today
 * Check that timer hasnt reach near 5 min Google time limit
 * If time-out save the sate of the loop to the cache and set a trigger to restart in 60 min
 */

function cleanMail() {
  
  var rules = getRulesArr();
  const scriptStart = new Date();
  let rulesCached = cache.getNumber('ruleLoopCache');
  let counter = cache.getNumber('counterCache');
  let loopBreak = 0;
  
  if (rulesCached === null) {
    // check to see if the value has not been cached and use zero if it has
    rulesCached = 0;
  }
for (let i = rulesCached; i < rules.length; i++) {
  if (counter === null) {
    // check to see if the value has not been cached and use zero if it has
    counter = 0;
  }
  let countStart = getCountStart();

  if (Array.isArray(rules)) {
      var action = rules[i][0];
      var searchString = rules[i][1];
      var days = rules[i][2];
  }else{
    Logger.log (`${user} - No rules set for processing`)
    sendLogEmail(false);
    loopBreak = 1;
  }
  const actionDate = new Date();
      actionDate.setDate(actionDate.getDate() - days);
      
    Logger.log (`${user} - Processing inbox with rule set: ${action}, ${searchString}, ${days}`);

    do {
   
      //Use for debugging when Google limits number of daily search calls
      
      /*
      for (let j = 0; j < inc; j++) {
      Utilities.sleep(10);
      };
      */
      
      const threads = GmailApp.search(searchString, countStart, inc);  // find a block of messages
    
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
          cache.putNumber('counterCache', counter) // cache the count
          cache.putNumber('ruleLoopCache', i); // cache the rule loop location
          cache.putNumber('threadLoopCache', countStart); // cache the thread loop location
          listCache();
          if(triggerActive('cleanMore') === false && triggerActive('countMore') === false){
            Logger.log (`${user} - Setting a trigger to call the cleanMore function.`)
            setMoreTrigger('cleanMore');
          }else{
            Logger.log (`${user} - Next trigger already Set`)
          }
          
          loopBreak = 1; // Break the FOR (DO & i) loop(s)
          break;  // Break the j loop
      }
      


      };
        countStart -= inc; // work backwarads through the inbox in incremental chunks
        if (loopBreak === 1) {
          break; //Break for DO loop if there was a TimeOut
        }
    } while (countStart > -1);
    
      if (loopBreak === 1) {
        break; //Break to For (i) loop if there was a TimeOut
   };

    if (countStart < 0){
      Logger.log(`${user} - ${counter} total threads ${action}d`);
      cache.putObject(`rule ${i}`,{ counter: counter, action: action, searchString:searchString, days:days });
      countStart = 0;
    }

  Logger.log(`${user} - Finished processing rule set: ${action}, ${searchString}, ${days} from index ${countStart}`);
  threadsCached = null;
  clearCache('threadLoopCache');
  clearCache('counterCache');
}
  if (loopBreak != 1) { //If the loop didnt break, end the processing of the script
    clearCache('ruleLoopCache');
    removeTriggers('cleanMore')
    Logger.log(`${user} - Final tally: \n ${reportArr}`);
    sendReportEmail(true);
  }
};



