function testSendEmail() {
  sendReportEmail('src/report-email.html', ["MailMaid had no rules to process your Inbox", "Please set up your rules in the app."]);
  /*
  cache.getObject('result')
  [
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

function sendReportEmail(template, results) {

  var recipient = Session.getActiveUser().getEmail();
  var subject = 'MailMaid Results';
  var message = getEmailHTML(template, results)

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: message
  });
  Logger.log(`${user} - Email sent to ${recipient}`)
}


function getEmailHTML(template, results) {
  var templ = HtmlService.createTemplateFromFile(template);
  templ.results = results;
  var htmlBody = templ.evaluate().getContent();
  return htmlBody
}