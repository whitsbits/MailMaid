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
  Logger.log(`${user} - Running cleanMail`)

  const scriptStart = new Date();
  var rules = getRulesArr();
  let loopBreak = 0;
  let tallyCount = 0;
  let maxMet = false; 


  /**  
  * check to see if the app is worken from sleep and get last count value  
  * and if count has been cached use value to resume count of the process
  */
  let rulesCached = cache.getNumber('rulesCache');
  if (rulesCached === null) {
    rulesCached = 0;
  };

  if (licenseRead() === false) { // when the backend trigger runs, check that the license is still valid
    i, rules.length = 1
  }

 
  rulesloop:
  for (let i = rulesCached; i < rules.length; i++) {

    if (!checkAuth()){
      loopBreak = 1;
      break rulesloop;
    };


    /**
    * Set the init for the start value or the cached value
    */
    let searchBatchStartCached = cache.getNumber('searchBatchStartCache');
    let searchBatchStart = 0;
    if (searchBatchStartCached !== null) {
      searchBatchStart = searchBatchStartCached;
    };

    let counter = 0
    if (Array.isArray(rules)) {
      var action = rules[i][0];
      var searchString = rules[i][1];
      var days = rules[i][2];
    } else {
      Logger.log(`${user} - No rules set for processing`)
      sendReportEmail('MailMaid Results', 'src/report-email.html', false, licenseRead(), null, ["MailMaid had no rules to process your Inbox", "Please set up your rules in the app."]);
      loopBreak = 1;
      lastRun();
      break rulesloop;
    }
    searchString = searchQueryBuilder(action, unescapeHtml(searchString), days);

    try{
    searchloop:
    while (loopBreak === 0) {
      let threadsCached = cache.getNumber('threadsCache');
      let threadsCount = 0;
      if (threadsCached !== null) {
        threadsCount = threadsCached;
      };
      let counterCached = cache.getNumber('counterCache');
      if (counterCached !== null) {
        counter = counterCached;
      };
      const threads = GmailApp.search(searchString, searchBatchStart, inc);  // find a block of messages
      if (threads.length === 0) {
        break searchloop;
      }
      let batch = (`${searchBatchStart} to ${searchBatchStart + threads.length}`);
      Logger.log(`${user} - Processing batch ${batch} with rule set: ${action}, ${searchString}, starting at thread ${threadsCount}.`);

      tallyCount += threads.length;
      for (let j = threadsCount; j < threads.length; j++) {  //Start looping the messages in threads

        if (action === 'Archive') {
          threads[j].moveToArchive();
          ++counter;
        }
        if (action === 'Purge') {
          threads[j].moveToTrash();
          ++counter;
        }
        /** 
       * When script runs close to the 5 min timeout limit take the count, 
       * cache it and set a trigger to researt after an hour
       */
        if (isTimeUp_(scriptStart, timeOutLimit)) {
          Logger.log(`${user} - Inbox rules loop time limit exceeded.`);
          /**
           * Cache all the placeholders to resume at exact spot after timout ends
           */
          cache.putNumber('rulesCache', i, ttl); // cache the rule loop location
          cache.putNumber('searchBatchStartCache', searchBatchStart, ttl) // cache the count
          cache.putNumber('threadsCache', j, ttl) // cache the count
          cache.putNumber('counterCache', counter, ttl) // cache the count
          Logger.log(`${user} - Timed out in Rule ${i}, Batch start ${searchBatchStart} and Thread ${j} with partial count of ${counter}. Values put in cache`);

          /**
           * Set the trigger to resume after timeout ends (60min for Add-ons)
           */
          if (triggerActive('cleanMore') === false) {
            Logger.log(`${user} - Setting a trigger to call the cleanMore function.`)
            setMoreTrigger('cleanMore');
          } else {
            Logger.log(`${user} - Next trigger already Set`)
          }
          loopBreak = 1;
          break rulesloop;
        }
         
      } // End Threads loop (j)

      searchBatchStart += inc; // work through the inbox in incremental chunks
       
      clearCache('threadsCache');
    }; // END While Loop
  }
  catch (e) {
    Logger.log(`${user} - ${e.toString()} from cleanMail`);
    if (e.message.includes("Mail service not enabled")){ //kill deadhead for non addon enabled accounts
      Logger.log (`${user} - Removing triggers for dead head account`)
      removeTriggers('MailMaid');
      removeTriggers('checkTrigger');
    }else if (e.message.includes("Service invoked too many times for one day")){
      Logger.log (`${user} - Maximum daily count met`)
      maxMet = true; // notify user that maximum quota was reached
      // get a final tally of num of messages proccessed before quota for reporting to user
    }
    break rulesloop;
  };
  
      /**
       * Take the results and build the array needed for the report
       * Store the array in the cache
       * clean up the loop placeholder caches
       */
      let resultsCached = cache.getObject('result');
      let resultsArr = resultsCached
      if (resultsCached === null) {
        resultsArr = [];
      };
      resultsArr.push({ id: (i + 1), counter: counter, action: action, searchString: searchString, days: days })
      cache.putObject('result', resultsArr);
      Logger.log(`${user} - Finished processing rule set: ${action}, ${searchString}, ${days}.\n ${counter} total threads ${action}d`);
      clearCache('rulesCache');
      clearCache('searchBatchStartCache');
      clearCache('threadsCache');
      clearCache('counterCache');
  } // End Rules loop (i)


  //If the loop didnt break, end the processing of the script
  if (loopBreak != 1) {
    clearCache('ruleLoopCache');
    removeTriggers('cleanMore')
    var results = cache.getObject('result');
    Logger.log(`${user} - Final tally: \n ${results}`);
    lastRun();
    sendReportEmail('MailMaid Results', 'src/report-email.html', maxMet, licenseRead(), tallyCount, results);
  }
};

function lastRun(){
  var lastRun = JSON.stringify(Date.now());
    userProperties.deleteProperty('lastRunEpoch')
    userProperties.setProperties({ 'lastRunEpoch': lastRun })
    Logger.log(`${user} - Setting last run data as ${lastRun}`)
}

function searchQueryBuilder(action, searchString, days) {
  let query = '';
  if (action === "Archive") {
    query = (searchString + " " + "in:inbox" + " " + "older_than:" + days + "d");
  } else if (action === "Purge") {
    query = (searchString + " " + "older_than:" + days + "d");
  }
  return query
};