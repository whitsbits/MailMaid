/*
https://stackoverflow.com/questions/59216693/count-number-of-gmail-emails-per-sender
*/

function callSenderListPaged() {
  cache.remove('senderArr')
  sender_list_paged();
}

  function sender_list_paged(token) {
    var token=token||null;
    var query="-in:spam"; 
    let sender_array = cache.getObject('senderArr');
      if (sender_array === null){
        sender_array = []
        Logger.log (`${user} - Starting Sender count from 0`);
      }else{
        Logger.log (`${user} - Starting Sender count from ${sender_array.length}`);
      }

    var uA=[];
    var cObj={}; //Count of messages

    do{
      var inbox_threads=Gmail.Users.Messages.list('me', {maxResults:100,pageToken:token,q:query});
      Logger.log (inbox_threads.messages.length);
      for(var i = 0; i < inbox_threads.messages.length; i++) {
      var message = inbox_threads.messages[i].getMessages();
      for(var j = 0;j < message.length; j++) {
        var sender = message[x].getFrom();  
        if(uA.indexOf(sender)==-1) {
          uA.push(sender);
          sender_array.push([sender]);
          cObj[sender]=1;
        }else{
          cObj[sender]+=1;
        }
      }
    }
      token=inbox_threads.nextPageToken

      if (token !== (null || undefined)) {
        cache.getNumber("lastpagetoken", token);
        cache.putObject("senderArr", sender_array);
        //Logger.log (`Putting ${sender_array} to cache`)
        Logger.log (`LastToken Saved as ${token}`);
        sender_list_paged(getLastPageToken());
      }else{
        Logger.log (`Last page reached`)
      }
      
    }while(token);

    Logger.log (`Total number of senders ${sender_array.length}`) 

    sender_array.forEach(function(r){
      r.splice(1,0,cObj[r[0]]);
    });

    var ss=SpreadsheetApp.openById('1QNm63pG8fe9ezMfOnvv4_Im-GgrHQyeMVLFxm-k8v-Y')
    var sh=ss.getActiveSheet()
    sh.clear();
    sh.appendRow(['Email Address','Count']);
    sh.getRange(2, 1,sender_array.length,2).setValues(sender_array).sort({column:2,decending:true});
  }

  function findMoreSenders() {
    sender_list_paged(getLastPageToken());
  }

  function getLastPageToken() {
    return cache.getNumber("lastpagetoken")
  }