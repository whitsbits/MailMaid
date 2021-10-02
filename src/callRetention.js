/**
 * Get each of the rules and attributes from getUserPropsArr()
 * Find messages pertaining to the search
 * step through each thread batch set by 'inc' (default Global var set to 500)
 * process them according to the action 
 * based on number of days between message date and action date based on num 'days' from today
 * Check that timer hasnt reach near 5 min Google time limit
 * If time-out save the sate of the loop to the cache and set a trigger to restart in 60 min
 */

function callRetention() {
  
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
  var action = rules[i][0];
  var searchString = rules[i][1];
  var days = rules[i][2];
  const actionDate = new Date();
      actionDate.setDate(actionDate.getDate() - days);
      
    Logger.log (`Processing inbox with rule set: ${action}, ${searchString}, ${days}`);

    do {
      if (isTimeUp_(scriptStart, 250000)) {
        /** * When script runs close to the 5 min timeout limit take the count, 
         * cache it and set a trigger to researt after 2 mins */
        Logger.log(
          'Inbox loop time limit exceeded.' 
        );
        if (action === 'Archive'){
          Logger.log(`${counter} total threads archived`);
        };
        if (action === 'Purge'){
          Logger.log(`${counter} total threads deleted`);
        };
        makeCache('ruleLoopCache', i); // cache the rule loop location
        makeCache('threadLoopCache', countStart); // cache the thread loop location
        if(triggerActive('purgeMore') === false){
          Logger.log ('Setting a trigger to call the purgeMore function.')
          setPurgeMoreTrigger();
        }else{
          Logger.log ('PurgeMore already Set')
        }
        
        loopBreak = 1; // Break the FOR (i) loop
        break;  // Break the DO loop
      }
      //Use for debugging when Google limits number of daily search calls
      
      /*
      for (let j = 0; j < inc; j++) {
      Utilities.sleep(10);
      };
      */
      
      const threads = GmailApp.search(searchString, countStart, inc);
    
      for (let j = 0; j < threads.length; j++) {
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
      };
    
      
      //Logger.log (`Finished batch of ${inc} from: ${countStart}`)
      countStart -= inc; // work backwarads through the inbox in incremental chunks
      
    } while (countStart > 0);
    
    if (loopBreak === 1) {
      break; //Break to For (i) loop if there was a TimeOut
   };


  if (action === 'Archive'){
    Logger.log(`${counter} total threads archived`);
  };
  if (action === 'Purge'){
    Logger.log(`${counter} total threads deleted`);
  };
  Logger.log(`Finished processing from Inbox from index ${countStart}`);
  threadsCached = null;
  clearCache('threadLoopCache');
}
  if (loopBreak != 1) { //If the loop didnt break, end the processing of the script
    clearCache('ruleLoopCache');
    removeTriggers('purgeMore')
    Logger.log ("FIN")
  }
};



