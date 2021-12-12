/*
https://stackoverflow.com/questions/59216693/count-number-of-gmail-emails-per-sender
*/

function countSenders() {
  const scriptStart = new Date();
  let loopBreak = 0;

      /**  
    * check to see if the app is worken from sleep and get last count value  
    * and if count has been cached use value to resume count of the process
    */

  var total = cache.getNumber('sendersCache');
  if (total === null){
    total = 0;
  };

  Logger.log (`${user} - Starting Sender count from ${total}`);

  let sender_array = cache.getObject('senderArr');
    if (sender_array === null){
      sender_array = [];
    };  
  let uA = cache.getObject('senderuA')
  if (uA === null){
    uA = [];
  };
  let cObj = cache.getObject('sendercObj');
  if (cObj === null){
    cObj = {};
  };

searchloop:
  do{
    let threadsCached = cache.getNumber('senderThreadsCache');
      let threadsCount = 0;
      if (threadsCached !== null) {
        threadsCount = threadsCached;
      };

    var threads=GmailApp.search('-in:spam', total, inc);
    let batch = (`${total} to ${total + threads.length}`);
      Logger.log (`${user} - Processing batch ${batch} starting at thread ${threadsCount}.`);
    if (threads.length === 0) {
          break searchloop;
      }

    for(var i=threadsCount;i<threads.length;i++) {
      var message=threads[i].getMessages();
      for(var x=0;x<message.length; x++) {
        var sender=message[x].getFrom();  
        if(uA.indexOf(sender)==-1) {
          uA.push(sender);
          sender_array.push([sender]);
          cObj[sender]=1;
        }else{
          cObj[sender]+=1;
        }
        if (isTimeUp_(scriptStart, timeOutLimit)) {
          /** * When script runs close to the 5 min timeout limit take the count, 
           * cache it and set a trigger to researt after 2 mins */
          Logger.log(`${user} - Setting Trigger to resume counting Senders at ${total}`)
          cache.putNumber('sendersCache', total, ttl); // cache for 23 hours
          cache.putNumber('senderThreadsCache', i, ttl);
          cache.putNumber('senderArr', sender_array, ttl); // cache for 23 hours
          cache.putObject('senderuA', uA, ttl)
          cache.putObject('sendercObj', cObj, ttl) 
          setMoreTrigger('countMoreSenders'); //set trigger to restart script
          loopBreak = 1;
          break searchloop;
        }
      }
    }

    total += inc;
  }while (threads.length > 0);

if (loopBreak != 1){  
  sender_array.forEach(function(r){
    r.splice(1,0,cObj[r[0]]);
  });

  var topValues = sender_array.sort(decendingSort).slice(0,5);

  clearCache('sendersCache');
  clearCache('senderArr');
  clearCache('senderuA');
  clearCache('sendercObj');

  console.log(topValues);

  sendReportEmail('src/senders-email.html', topValues);
  }
}


function decendingSort(a, b) {
    if (b[1] === a[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}
  