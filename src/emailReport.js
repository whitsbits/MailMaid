function testSendEmail() {
  sendReportEmail("MailMaid Needs your attention, please", "src/basic-email.html", false, licenseRead(), null,
       ["For MailMaid to continue to work, you need to launch the app from the right sidebar in your Gmail application and click AUTHORIZE ACCESS",
       "If you no longer wish to use the application in Trial mode, click the three dots in the upper right of the app, select Manage add-on and then three dots again to Uninstall"])
    
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
 * @param {String} subject - Subject for the message to be sent in the email.
 * @param {Object} template - html file for the template of the email.
 * @param {Boolean} maxMet - Bool as to if the Max Google Quota was hit
 * @param {Boolean} licensed - Bool as to if the product is licensed
 * @param {Number} tally - total number of message that were processed.
 * @param {Object} results - Array for the results message to be sent in the email.
 *                           one line per array element
 * 
*/

function sendReportEmail(subject, template, maxMet, licensed, tally, results) {

  var recipient = Session.getActiveUser().getEmail();
  var subject = subject;
  var message = getEmailHTML(template, maxMet, licensed, tally, results)

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: message
  });
  Logger.log(`${user} - Email ${subject} sent to ${recipient}`)
}

/**
 *  Get the template and process the server side scripts to build the html for the email  
 * @param {Object} template - html file for the template of the email.
 * @param {Boolean} maxMet - Bool as to if the Max Google Quota was hit
 * @param {Number} tally - total number of message that were processed.
 * @param {Object} results - Array for the results message to be sent in the email.
 *                           one line per array element
 * @param {Boolean} licensed - Bool as to if the product is licensed.
*/

function getEmailHTML(template, maxMet, licensed, tally, results) {
  var templ = HtmlService.createTemplateFromFile(template);
  templ.results = results;
  templ.tally = tally;
  templ.maxMet = maxMet;
  templ.licensed = licensed;
  var htmlBody = templ.evaluate().getContent();
  return htmlBody
}