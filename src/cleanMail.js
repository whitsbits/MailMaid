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
  let rulesCached = cache.get('ruleLoopCache');
 
  let loopBreak = 0;
  
  if (rulesCached === null) {
    // check to see if the value has not been cached and use zero if it has
    rulesCached = 0;
  }
for (let i = rulesCached; i < rules.length; i++) {
  let counter = 0;
  let countStart = getCountStart();
  listCache();
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


        if (isTimeUp_(scriptStart, 299000)) {
        /** * When script runs close to the 5 min timeout limit take the count, 
         * cache it and set a trigger to researt after 2 mins */
        Logger.log(`${user} - Inbox loop time limit exceeded.`);
        if (action === 'Archive'){
          Logger.log(`${user} - ${counter} total threads archived`);
        };
        if (action === 'Purge'){
          Logger.log(`${user} - ${counter} total threads deleted`);
        };
        makeCache('ruleLoopCache', i); // cache the rule loop location
        makeCache('threadLoopCache', countStart); // cache the thread loop location
        if(triggerActive('cleanMore') === false){
          Logger.log (`${user} - Setting a trigger to call the cleanMore function.`)
          setCleanMoreTrigger();
        }else{
          Logger.log (`${user} - cleanMore already Set`)
        }
        
        loopBreak = 1; // Break the FOR (i & j) loop(s)
        break;  // Break the DO loop
      }
      
      
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
        if (loopBreak === 1) {
        break; //Break to For (j) loop if there was a TimeOut
        }
      };
      countStart -= inc; // work backwarads through the inbox in incremental chunks
      
    } while (countStart > -1);
    
      if (loopBreak === 1) {
        break; //Break to For (i) loop if there was a TimeOut
   };


  if (action === 'Archive'){
    var archiveReport = `\n${counter} total threads archived from rule set: ${action}, ${searchString}, ${days}`
    Logger.log(`${user} - ${counter} total threads archived`);
    reportArr.push(archiveReport);
  };
  if (action === 'Purge'){
    var purgeReport = `\n${counter} total threads purged from rule set: ${action}, ${searchString}, ${days}`
    Logger.log(`${user} - ${counter} total threads deleted`);
    reportArr.push(purgeReport);
  };
  if (countStart < 0){
    countStart = 0;
  }
  Logger.log(`${user} - Finished processing Inbox from index ${countStart}`);
  threadsCached = null;
  clearCache('threadLoopCache');
}
  if (loopBreak != 1) { //If the loop didnt break, end the processing of the script
    clearCache('ruleLoopCache');
    removeTriggers('cleanMore')
    Logger.log(`${user} - Final tally: \n ${reportArr}`);
    sendLogEmail(true);
  }
};



