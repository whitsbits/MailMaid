/*
https://stackoverflow.com/questions/59216693/count-number-of-gmail-emails-per-sender
*/

  function sender_list_paged(token) {
    const scriptStart = new Date();
    var token=token||null;
    var query="-in:spam"; 
    let sender_array = []
    var uA=[];
    var cObj={}; //Count of messages

    searchloop:
    do{
      var threads=Gmail.Users.Messages.list('me', {maxResults:inc, pageToken:token, q:query});
      Logger.log (`${user} - Processing page: ${token}.`);
      if (threads.length === 0) {
        break searchloop;
      }
      threadloop:
      for(var i=0;i<threads.messages.length;i++) {
        var sender=GmailApp.getMessageById(threads.messages[i].id).getFrom();
        if (sender === Session.getActiveUser().getEmail()){
          break threadloop;
        }
        if(uA.indexOf(sender)==-1) {
          uA.push(sender);
          sender_array.push([sender]);
          cObj[sender]=1;
        }else{
          cObj[sender]+=1;
        }
        if (isTimeUp_(scriptStart, timeOutLimit)) {
          cache.putObject("senderArr", sender_array);
          setMoreTrigger('countMoreSendersAPI'); //set trigger to restart script
        };
      }

      token=threads.nextPageToken
      cache.putString('lastPageToken',token)
      if (token !== (null || undefined)) {
        cache.getString("lastPageToken", token);
        Logger.log (`LastToken Saved as ${token}`);
        sender_list_paged(getLastPageToken());
      }else{
        Logger.log (`Last page reached`)
        break searchloop;
      };

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
    return cache.getString("lastPageToken")
  }