/*
https://stackoverflow.com/questions/59216693/count-number-of-gmail-emails-per-sender
*/

  function sender_list_paged(token) {
    const scriptStart = new Date();
    let loopBreak = 0;
    var token=token||null;
    const query="-in:spam"; 
    let sender_array = []
    let uA=[];
    let cObj={}; //Count of messages

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

      token=threads.nextPageToken

      cache.putString('lastPageToken',token);
      if (token !== (null || undefined)) {
        cache.getString("lastPageToken", token);
        Logger.log (`LastToken Saved as ${token}`);

        if (isTimeUp_(scriptStart, timeOutLimit)) {
          Logger.log(`${user} - Inbox senders loop time limit exceeded.`);
          cache.putObject("senderArr", sender_array);
          setMoreTrigger('countMoreSendersAPI'); //set trigger to restart script
          loopBreak = 1;
          break searchloop;
        };

        sender_list_paged(getLastPageToken());
      }else{
        Logger.log (`Last page reached`);
        break searchloop;
      };

      }

    }while(token);

    Logger.log (`${user} - Total number of senders counted ${sender_array.length}`) 
    
    if (loopBreak !== 1) {
      emailSendersCount(sender_array, cObj);
      writeToSheet(sender_array, cObj);
    }
  }

  function findMoreSenders() {
    sender_list_paged(getLastPageToken());
  }

  function getLastPageToken() {
    return cache.getString("lastPageToken")
  }

