function exportToDrive(search, downloadAction, saveFile, fileTypeAction) {
  var search = "jessica_Zimmerman@ryecountryday.org"
  var downloadAction = "Download"
  var saveFile = "threadFile"
  var fileTypeAction = "html"
  
  var threads = GmailApp.search(search, 0, 500);
  var slug = printSlug();
  var foldeName = "MailMaid Download" + "_" + search + "_" + JSON.stringify(Date.now());
  var newFolder = DriveApp.createFolder(foldeName).getId();

  for (var i=0; i< threads.length; i++) {
    var messages = threads[i].getMessages();
      var thread = '';
      var file = '';
      for (var j=0; j< messages.length; j++) {

        var msgID = messages[j].getId();
        var filename = GmailApp.getMessageById(msgID).getSubject();
        var msg = GmailApp.getMessageById(msgID);
        if (fileTypeAction === 'html'){
          var msgRaw = EmailReplyParser.parse_reply(msg.getBody());  
        }else{
          var msgRaw = EmailReplyParser.parse_reply(msg.getPlainBody());
        }
        if (saveFile === 'messageFile'){
          saveToFile(msgRaw,filename, newFolder);
        }else if (saveFile === 'threadFile'){  
          thread += (`${msgRaw} \n ${slug} \n`);
        }
    }
    if (saveFile === 'threadFile'){
      saveToFile(thread, filename, newFolder);
    }else if (saveFile === 'oneFile'){
      file += thread;
    } 
  }
  if (saveFile === 'oneFile'){
    saveToFile(file, filename, newFolder);
  }
  
}


function saveToFile(file, filename, folder) {
  //var msgBlob = Utilities.newBlob(file, 'message/rfc822', 'message.eml');
  //var msgBlob = Utilities.newBlob(file, 'text/html', 'message.html');
  var msgBlob = Utilities.newBlob(file, 'text/plain', 'message.txt');
  var file = DriveApp.getFolderById(folder).createFile(msgBlob);
  file.setName(filename + ".txt");
  return
}

function printSlug() {
  let slug = "-="
  for(let a = 0; a < 5; a++){
    slug += slug;
  };
  return slug;
}