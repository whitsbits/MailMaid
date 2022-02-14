function exportToDrive(threads) {
  
  var threads = GmailApp.search("from:Jessica_Zimmerman@ryecountryday.org", 0, 500);

  var newFolder = DriveApp.createFolder("MailMaidDownload").getId();
  var slug = printSlug();


  for (var i=0; i< threads.length; i++) {
    var messages = threads[i].getMessages();
      var thread = '';
      for (var j=0; j< messages.length; j++) {

        var msgID = messages[j].getId();
        var msg = GmailApp.getMessageById(msgID);
        var msgRaw = EmailReplyParser.parse_reply(msg.getPlainBody());


        thread += (`${msgRaw} \n ${slug} \n`);
      }
  var msgBlob = Utilities.newBlob(thread, 'message/rfc822', 'message.eml');
  var file = DriveApp.getFolderById(newFolder).createFile(msgBlob);
  var filename = GmailApp.getMessageById(msgID).getSubject();
  file.setName(filename);
   }
}

function printSlug() {
  let slug = "-="
  for(let a = 0; a < 5; a++){
    slug += slug;
  };
  return slug;
}