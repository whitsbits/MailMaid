function exportToDrive(threads) {
  var threads = GmailApp.search("from:Jessica_Zimmerman@ryecountryday.org", 0, 500);

  var newFolder = DriveApp.createFolder("MailMaidDownload").getId();

  for (var i=0; i< threads.length; i++) {
    var messages = threads[i].getMessages();

      for (var j=0; j< messages.length; j++) {

        var msgID = messages[j].getId();
        var msg = GmailApp.getMessageById(msgID);
        var msgRaw = msg.getRawContent();

        var msgBlob = Utilities.newBlob(msgRaw, 'message/rfc822', 'message.eml');
        
        var file = DriveApp.getFolderById(newFolder).createFile(msgBlob);
        var filename = GmailApp.getMessageById(msgID).getSubject();
        
        file.setName(filename);
      }
  }
}