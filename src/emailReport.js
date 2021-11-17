    function callSendEmail () {
      sendReportEmail(true);
    }
    
    /**
     *  Generate a log, then email it to the person who ran the script.
     * Not currently used
     * TODO figure out a way to do this in a more user friendly manner.
    */

    function sendReportEmail(bool) {
      var results = reportArr; //["akward seal","baby shark","cate","doggo","E","face palm"];
      var recipient = Session.getActiveUser().getEmail();
      var subject = 'MailMaid Results';
       if (bool === true){        
        var message = getEmailHTML(results)
      }else{
          var message = `MailMaid had no rules to process your Inbox. \n\n Please set your rules in the app`;
        };

      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        htmlBody: message
      });
    }


function getEmailHTML(results) {
  var templ = HtmlService.createTemplateFromFile('src/report-email.html');
  templ.results = results;
  var htmlBody = templ.evaluate().getContent();
  return htmlBody
}