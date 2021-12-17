/*
https://stackoverflow.com/questions/59216693/count-number-of-gmail-emails-per-sender
*/

function countSenders() {
  const scriptStart = new Date();
  let loopBreak = 0;

  /**  
* check to see if the app is woken from sleep and get last count value  
* and if count has been cached use value to resume count of the process
*/

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
  do {
    let threadsCached = cache.getNumber('senderThreadsCache');
    let threadsCount = 0;
    if (threadsCached !== null) {
      threadsCount = threadsCached;
    };

    var threads = GmailApp.search('-in:spam', searchBatchStart, inc);
    let batch = (`${searchBatchStart} to ${searchBatchStart + threads.length}`);
    Logger.log(`${user} - Processing batch ${batch} starting at thread ${threadsCount}.`);
    if (threads.length === 0) {
      break searchloop;
    }

    for (var i = threadsCount; i < threads.length; i++) {
      var message = threads[i].getMessages();
      var sender = message[0].getFrom();
      if (uA.indexOf(sender) == -1) {
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
    if (searchBatchStart = 19500) { //Limit to less than max GMail quota of read/writes at 20k per day
      inc = 499; // reduce the increment to go to 19,999
    }else if ( searchBatchStart = 19999) { //then kill the loop
      loopBreak = 1;
      break searchloop;
    };
  } while (threads.length > 0);

  if (loopBreak != 1) {
    emailSendersCount(sender_array, cObj);
    writeToSheet(sender_array, cObj)
    clearCache('sendersCache');
    clearCache('senderArr');
    clearCache('senderuA');
    clearCache('sendercObj');
  }
}

function emailSendersCount(sender_array, cObj) {
  sender_array.forEach(function (r) {
    r.splice(1, 0, cObj[r[0]]);
  });

  var topValues = sender_array.sort(decendingSort).slice(0, 5);

  console.log(topValues);

  sendReportEmail('src/senders-email.html', topValues);
}

function writeToSheet(sender_array, cObj) {
  sender_array.forEach(function (r) {
    r.splice(1, 0, cObj[r[0]]);
  });

  var ss = SpreadsheetApp.openById('1QNm63pG8fe9ezMfOnvv4_Im-GgrHQyeMVLFxm-k8v-Y')
  var sh = ss.getActiveSheet()
  sh.clear();
  sh.appendRow(['Email Address', 'Count']);
  sh.getRange(2, 1, sender_array.length, 2).setValues(sender_array).sort({ column: 2, decending: true });
}

function decendingSort(a, b) {
  if (b[1] === a[1]) {
    return 0;
  }
  else {
    return (b[1] < a[1]) ? -1 : 1;
  }
}
