    function testSendEmail () {
      sendReportEmail(cache.getObject('result'))
        /*[
        { id:1, counter:10, action:"Purge", searchString:"category:promotions", days:7 },
        { id:2, counter:100, action:"Purge", searchString:"category:social", days:14 }]);
      //(["akward seal","baby shark","cate","doggo","E","face palm"]);
      **/
    }
    
    /**
     *  Generate a log, then email it to the person who ran the script.
     * @param {Object} results - Array for the message to be sent in the email.
     *                           one line per array element
    */

    function sendReportEmail(results) {
      
      var recipient = Session.getActiveUser().getEmail();
      var subject = 'MailMaid Results';     
      var message = getEmailHTML(results)

      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        htmlBody: message
      });
      Logger.log (`${user} - Email sent to ${recipient}`)
    }


function getEmailHTML(results) {
  var templ = HtmlService.createTemplateFromFile('src/report-email.html');
  templ.results = results;
  var htmlBody = templ.evaluate().getContent();
  return htmlBody
}