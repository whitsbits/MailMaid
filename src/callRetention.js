/**
 * Get each of the rules and attributes from getUserPropsArr()
 * Find messages pertaining to the search
 * step through each thread batch set by 'inc' (default 500)
 * process them according to the action 
 * based on number of days between message date and action date based on num 'days' from today
 * Check that timer hasnt reach near 5 min Google time limit
 * 
 */

function callRetention() {
  const inc = 500; // InBox Iteration Increment
  var rules = getRulesArr();
  const scriptStart = new Date();
  let rulesCached = cache.get('ruleLoopCache');
  let threadsCached = cache.get('threadLoopCache');
  Logger.log (`The cached rule count i = ${rulesCached}`);
  Logger.log (`The cached thread count countStart = ${threadsCached}`);
  if (rulesCached === null) {
    // check to see if the value has not been cached and use zero if it has
    rulesCached = 0;
  }
for (let i = rulesCached; i < rules.length; i++) {
  let counter = 0;
  let countStart = getInboxCount(inc);
    if (countStart > threadsCached && threadsCached > 0){
      countStart = threadsCached;
    }
  var action = rules[i][0];
  var searchString = rules[i][1];
  var days = rules[i][2];
  const actionDate = new Date();
      actionDate.setDate(actionDate.getDate() - days);
      
    Logger.log (`Processing inbox with rule set: ${action}, ${searchString}, ${days}`);

    do {
      if (isTimeUp_(scriptStart, 240000)) {
        /** * When script runs close to the 5 min timeout limit take the count, 
         * cache it and set a trigger to researt after 2 mins */
        Logger.log(
          'Inbox loop time limit exceeded. Setting a trigger to call the purgeMore function.'
        );
        cache.put('ruleLoopCache', i, 3660); // cache the rule loop location for 61 minutes
        cache.put('threadLoopCache', countStart, 3660); // cache the thread loop location for 61 minutes
        setPurgeMoreTrigger();
        i = rules.length; // Break the FOR loop
        break;  // Break the DO loop
      }
  
      const threads = GmailApp.search(searchString, countStart, inc);
    
      for (let j = 0; j < threads.length; j++) {
        const msgDate = threads[j].getLastMessageDate();
  
        if (action === 'archive') {
                    
          if (msgDate < actionDate) {
            threads[j].moveToArchive();
            ++counter;
          }
        }
          if (action === 'purge') {
          if (msgDate < actionDate) {
            threads[j].moveToTrash();
            ++counter;
          }
        }
      };
  
      countStart -= inc; // work backwarads through the inbox in incremental chunks
      
    } while (countStart > 0);

    if (action == 'archive'){
      Logger.log(`${counter} total threads archived`);
    };
    if (action == 'purge'){
      Logger.log(`${counter} total threads deleted`);
    };
  
    Logger.log(`Finished processing from Inbox from index ${countStart}`);

  }

  };



