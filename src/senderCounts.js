<<<<<<< HEAD
function callCountSenders() {
  countSenders(searchDateConverter(1640031285000), searchDateConverter(Date.now()), 10, 'Top');
  Async.call('countSenders', searchDateConverter(1640031285000), searchDateConverter(Date.now()), 10, 'Top');
}
=======
/**
 * Find messages pertaining to the search
 * step through each thread batch set by 'inc' (default Global var set to 500)
 * add the found threads to an array
 * process the array into a count of messages from each uniqe email address
 * format the array into a number of top numResults values by count or by messgaes greater than numResults
 * Check that timer hasnt reach near 5 min Google time limit
 * If time-out save the sate of the loop to the cache and set a trigger to restart in 60 min
 * send the topResults array to emailReport()
 * @param {Date} afterDate - msSinceEPOCH earliest date for search range
 * @param {Date} beforeDate - msSinceEPOCH latest date for search range
 * @param {Number} numResults - integer for results to be returned,
 * @param {String} suggestionResultChoice - Pick list 'Top' for Top Count of numResults, or 'Greater Than' for greater than numResults
 * 
 */
>>>>>>> 90140988478d2dbcb1e1138f9b08b9e3b9695f1d

function countSenders(afterDate, beforeDate, numResults, suggestionResultChoice) {
  const scriptStart = new Date();
  let loopBreak = 0;
<<<<<<< HEAD
  const query = suggestionSearchQueryBuilder(afterDate, beforeDate);
=======
  var tallyCount = 0;
  var maxMet = false;

>>>>>>> 90140988478d2dbcb1e1138f9b08b9e3b9695f1d
  /**  
* check to see if the app is woken from sleep and get last count value  
* and if count has been cached use value to resume count of the process
*/

  var query = cache.getString('senderQueryCache');
  if (query === null) {
    query = suggestionSearchQueryBuilder(afterDate, beforeDate);
  };

  var num = cache.getNumber('senderNumResult');
  if (num !== null) {
    numResults = num;
  };

  var choice = cache.getString('senderChoiceCache');
  if (choice !== null) {
    suggestionResultChoice = choice;
  };

  var searchBatchStart = cache.getNumber('sendersCache');
  if (searchBatchStart === null) {
    searchBatchStart = 0;
  };

  let sender_array = cache.getObject('senderArr');
  if (sender_array === null) {
    sender_array = [];
  };
  let uA = cache.getObject('senderuA')
  if (uA === null) {
    uA = [];
  };
  let cObj = cache.getObject('sendercObj');
  if (cObj === null) {
    cObj = {};
  };

  searchloop:
  try {
  do {
    let threadsCached = cache.getNumber('senderThreadsCache');
    let threadsCount = 0;
    if (threadsCached !== null) {
      threadsCount = threadsCached;
    };

      var threads = GmailApp.search(query, searchBatchStart, inc);

    if (threads.length === 0) {
      break searchloop;
    }

    tallyCount += threads.length;
    let batch = (`${searchBatchStart} to ${searchBatchStart + threads.length}`);
    Logger.log(`${user} - Processing batch ${batch} starting at thread ${threadsCount}.`);
    if (threads.length === 0) {
      break searchloop;
    }

    for (var i = threadsCount; i < threads.length; i++) {
      var message = threads[i].getMessages();
      var sender = message[0].getFrom();
      if (sender === Session.getActiveUser().getEmail()) {
        //skip the  current user as a suggestion target
        continue;
      } else if (uA.indexOf(sender) == -1) {
        uA.push(sender);
        sender_array.push([sender]);
        cObj[sender] = 1;
      } else {
        cObj[sender] += 1;
      }
      if (isTimeUp_(scriptStart, timeOutLimit)) {
        /** * When script runs close to the 5 min timeout limit take the count, 
         * cache it and set a trigger to researt after 2 mins */
        Logger.log(`${user} - Timed out in Thread ${i}, Batch start ${searchBatchStart}. Values put in cache`);
        cache.putString('senderQueryCache', query, ttl);
        cache.putNumber('senderNumResult', numResults, ttl);
        cache.putString('senderChoiceCache', suggestionResultChoice, ttl);
        cache.putNumber('sendersCache', searchBatchStart, ttl); // cache for 23 hours
        cache.putNumber('senderThreadsCache', i, ttl);
        cache.putObject('senderArr', sender_array, ttl); // cache for 23 hours
        cache.putObject('senderuA', uA, ttl)
        cache.putObject('sendercObj', cObj, ttl)
        setMoreTrigger('countMoreSenders'); //set trigger to restart script
        loopBreak = 1;
        break searchloop;
      }

    }
    clearCache('senderThreadsCache');
    searchBatchStart += inc;
<<<<<<< HEAD
    if (searchBatchStart === 19500) { //Limit to less than max GMail quota of read/writes at 20k per day
      inc = 499; // reduce the increment to go to 19,999
    } else if (searchBatchStart === 19999) { //then kill the loop
      loopBreak = 1;
      break searchloop;
    };
=======
>>>>>>> 90140988478d2dbcb1e1138f9b08b9e3b9695f1d
  } while (threads.length > 0);
}
catch (e) {
  Logger.log(`${user} - Error: ${e.toString()}`);
  maxMet = true; // notify user that maximum quota was reached
  // get a final tally of num of messages proccessed before quota for reporting to user
}

  if (loopBreak !== 1) {

    sender_array.forEach(function (r) { // add the message counts to each sender in the the sender_array
      r.splice(1, 0, cObj[r[0]]);
    });

<<<<<<< HEAD
    const index = sender_array.findIndex(element => JSON.stringify(element.includes(Session.getActiveUser().getEmail()))); //remove the  current user as a suggestion target
    if (index > -1) {
      sender_array.splice(index, 1);
    }

=======
>>>>>>> 90140988478d2dbcb1e1138f9b08b9e3b9695f1d
    sender_array.sort(decendingSort);

    var topValues = []; // set an array for the top values to send the user
    if (suggestionResultChoice === 'Top') {
      topValues = sender_array.slice(0, numResults);
    } else if (suggestionResultChoice === 'Greater Than') {
      sender_array.forEach(function (r) {
        if (r[1] >= numResults) {
          topValues.push([r[0], r[1]]);
        }
      })
    }

    for (var i = 0; i < topValues.length; i++) { // stamp out the actual search string the user will paste into the UI
      var string = topValues[i][0];
      var regex = /<(.*)>/g; // regex to parse the email
      var matches = regex.exec(string);
      if (matches !== null){
        var text = `from:${matches[1]}`
      }else{
        var text = `from:${string}`;
      }  
      topValues[i].push(text);
    }

    Logger.log(`${user} - Returning top values of: ${topValues}`);
    sendReportEmail('MailMaid Suggestions','src/senders-email.html', maxMet, tallyCount, topValues);
    clearCache('sendersCache');
    //clearCache('senderArr');
    clearCache('senderuA');
    clearCache('sendercObj');
  }
}


function suggestionSearchQueryBuilder(afterDate, beforeDate) {
  let query = '';
  query = ('-in:spam' + " " + "after:" + afterDate + " before:" + beforeDate);
  Logger.log(`${user} - Returning suggestion search query of: ${query}`)
  return query
};