/**
 * TODO: Add option for attachment download
 * TODO: Add option for parsing reply out
 * TODO: Loop & timeout for large search results
 */

function downloadToDrive(search, downloadAction, saveFile, fileTypeAction) {
    var search = "subject:(Welcome to Rye Country Day School!)"
    var downloadAction = "Download"
    var saveFile = "threadFile"
    var fileTypeAction = "text"

  Logger.log(`${user} - Processing ${downloadAction} with ${search} as type ${fileTypeAction} to ${saveFile}.`)
  var threads = GmailApp.search(search, 0, inc);
  var slug = printSlug();
  var foldeName = "MailMaid Download" + "_" + search + "_" + searchDateConverter(Date.now());
  var newFolder = DriveApp.createFolder(foldeName).getId();

  var file = '';

  if (licenseRead() === false) {
    i, threads.length = 1
  }

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    var thread = '';
    for (var j = 0; j < messages.length; j++) {
      var filename = GmailApp.getMessageById(messages[0].getId()).getSubject();
      var msgID = messages[j].getId();

      var msg = GmailApp.getMessageById(msgID);


      if (fileTypeAction === 'html') {
        var msgRaw = EmailReplyParser.parse_reply(msg.getBody());
        var header = `<div class="gmail_default">Date: ${msg.getDate()} <br>From: ${msg.getFrom()} <br>To: ${msg.getTo()} <br>\
 Cc: ${msg.getCc()}<br><br></div>`;
          if (header.length > 80){
            header = fold(80, ',','<br>',header);
          }
      } else if (fileTypeAction === "eml") {
        var msgRaw = msg.getRawContent();
      } else {  //defaul to PlainBody and .txt
        var msgRaw = EmailReplyParser.parse_reply(msg.getPlainBody());
        var header = `Date: ${msg.getDate()} \nFrom: ${msg.getFrom()} \n To: ${msg.getTo()} \n \
Cc: ${msg.getCc()} \n\n`;
        if (header.length > 80){
          header = fold(80,',','\n', header);
        }
      };

      if (saveFile === 'messageFile') {
        saveToFile(fileTypeAction, msgRaw, filename, newFolder);
      }


      thread += (`${header}\n${msgRaw}\n${slug}\n`);
    }
    if (saveFile === 'threadFile') {
      saveToFile(fileTypeAction, thread, filename, newFolder);
    } else if (saveFile === 'oneFile') {
      file += thread;
    }
  }
  if (saveFile === 'oneFile') {
    saveToFile(fileTypeAction, file, filename, newFolder);
  }

  if (downloadAction === "DownloadPurge") {
    for (var k = 0; k < threads.length; k++) {
      threads[k].moveToTrash();
    }
  }
  let folderlink = `https://drive.google.com/drive/folders/${newFolder}`
  sendReportEmail('MailMaid Download Complete', 'src/download-email.html', false, licenseRead(), messages.length,
    [`The files from the search of: ${search}`, `Have been downloaded into Drive folder: ${folderlink}`]);
}


function saveToFile(fileTypeAction, file, filename, folder) {
  if (fileTypeAction === 'html') {
    var msgBlob = Utilities.newBlob(file, 'text/html', 'message.html');
    var file = DriveApp.getFolderById(folder).createFile(msgBlob);
    file.setName(filename + ".html");
  } else if (fileTypeAction === "eml") {
    var msgBlob = Utilities.newBlob(file, 'message/rfc822', 'message.eml');
    var file = DriveApp.getFolderById(folder).createFile(msgBlob);
    file.setName(filename + ".eml");
  } else {
    var msgBlob = Utilities.newBlob(file, 'text/plain', 'message.txt');
    var file = DriveApp.getFolderById(folder).createFile(msgBlob);
    file.setName(filename + ".txt");
  }
  return
}

function printSlug() {
  let chars = "-="
  let slug = '';
  for (let a = 0; a < 40; a++) {
    slug += chars;
  };
  return slug;
};

function fold(limit, charBreak, lineBreak, str) {
  let brokenString = '';
   for(let i = 0, count = 0; i < str.length; i++){
      if(count >= limit && str[i] === charBreak){
         count = 0;
         brokenString += lineBreak;
      }else{
         count++;
         brokenString += str[i];
      }
   }
   return brokenString;
}