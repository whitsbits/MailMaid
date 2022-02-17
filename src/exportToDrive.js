/**
 * TODO: eml format can only do message, can't do thread or file. Disable those choices in UI
 * TODO: Add Reply parsing to html format
 * TODO: Add delete function for Downlaod & Purge
 * TODO: Add choice for parsing reply out
 * TODO: Add ability to just choose last email in thread?
 */



function exportToDrive(search, downloadAction, saveFile, fileTypeAction) {
  var search = "jessica_Zimmerman@ryecountryday.org"
  var downloadAction = "Download"
  var saveFile = "threadFile"
  var fileTypeAction = "html"
  
  Logger.log (`${user} - Processing ${downloadAction} with ${search} as type ${fileTypeAction} to ${saveFile}.`)
  var threads = GmailApp.search(search, 0, 500);
  var slug = printSlug();
  var foldeName = "MailMaid Download" + "_" + search + "_" + JSON.stringify(Date.now());
  var newFolder = DriveApp.createFolder(foldeName).getId();
  var thread = '';
  var file = '';
  
  for (var i=0; i< threads.length; i++) {
    var messages = threads[i].getMessages();

      for (var j=0; j< messages.length; j++) {

        var msgID = messages[j].getId();
        var filename = GmailApp.getMessageById(msgID).getSubject();
        var msg = GmailApp.getMessageById(msgID);
        
        if (fileTypeAction === 'html'){
          var msgRaw = EmailReplyParser.parse_reply(msg.getBody());
        }else if (fileTypeAction === "eml"){
           var msgRaw = msg.getRawContent();
        }else{  //defaul to PlainBody and .txt
          var msgRaw = EmailReplyParser.parse_reply(msg.getPlainBody());
        };

        if (saveFile === 'messageFile'){
          saveToFile(fileTypeAction, msgRaw, filename, newFolder);
        }
          thread += (`${msgRaw} \n ${slug} \n`);
    }
    if (saveFile === 'threadFile'){
      saveToFile(fileTypeAction, thread, filename, newFolder);
    }else if (saveFile === 'oneFile'){
      file += thread;
    } 
  }
  if (saveFile === 'oneFile'){
    saveToFile(fileTypeAction, file, filename, newFolder);
  }
  return
}


function saveToFile(fileTypeAction, file, filename, folder) {
  if (fileTypeAction === 'html'){
    var msgBlob = Utilities.newBlob(file, 'text/html', 'message.html');
    var file = DriveApp.getFolderById(folder).createFile(msgBlob);
    file.setName(filename + ".html"); 
  }else if (fileTypeAction === "eml"){
    var msgBlob = Utilities.newBlob(file, 'message/rfc822', 'message.eml');
    var file = DriveApp.getFolderById(folder).createFile(msgBlob);
    file.setName(filename + ".eml");
  }else{
    var msgBlob = Utilities.newBlob(file, 'text/plain', 'message.txt');
    var file = DriveApp.getFolderById(folder).createFile(msgBlob);
    file.setName(filename + ".txt");
  }
  return
}

function printSlug() {
  let slug = "-="
  for(let a = 0; a < 5; a++){
    slug += slug;
  };
  return slug;
}