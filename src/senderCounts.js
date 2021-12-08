/*
https://stackoverflow.com/questions/59216693/count-number-of-gmail-emails-per-sender
*/

function sendSenderEmail () {
  sendReportEmail('src/senders-email.html', sender_list());
}


function sender_list() {
  const scriptStart = new Date();
  var total = 0;

  let sender_array = cache.get('senderArr');
      if (sender_array === null){
        sender_array = []
        Logger.log (`${user} - Starting Sender count from 0`);
      }

searchloop:
  do{
    var inbox_threads=GmailApp.search('-in:spam',total,inc);
    if (inbox_threads.length === 0) {
          break searchloop;
      }

    var uA=[];
    var cObj={};
    if (isTimeUp_(scriptStart, timeOutLimit)) {
      /** * When script runs close to the 5 min timeout limit take the count, 
       * cache it and set a trigger to researt after 2 mins */
      Logger.log(`${user} - Setting Trigger to resume counting Senders at ${total}`)
      makeCache('sendersCache', total); // cache for 23 hours
      makeCache('senderArr', sender_array); // cache for 23 hours
      setMoreTrigger('countMoreSenders'); //set trigger to restart script
    }

    for(var i=0;i<inbox_threads.length;i++) {
      var message=inbox_threads[i].getMessages();
      for(var x=0;x<message.length; x++) {
        var sender=message[x].getFrom();  
        if(uA.indexOf(sender)==-1) {
          uA.push(sender);
          sender_array.push([sender]);
          cObj[sender]=1;
        }else{
          cObj[sender]+=1;
        }
      }
    }
    
    sender_array.forEach(function(r){
      r.splice(1,0,cObj[r[0]]);
    });

    total -= inbox_threads.length;
  }while (total > 0);

/**
  var ss=SpreadsheetApp.openById('1QNm63pG8fe9ezMfOnvv4_Im-GgrHQyeMVLFxm-k8v-Y')
  var sh=ss.getActiveSheet()
  sh.clear();
  sh.appendRow(['Email Address']);
  sh.getRange(2, 1,sender_array.length,2).setValues(sender_array).sort({column:2,decending:true});
*/

var topValues = sender_array.sort(decendingSort).slice(0,5);
console.log(topValues);

  return topValues;

  }


function decendingSort(a, b) {
    if (b[1] === a[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}
  