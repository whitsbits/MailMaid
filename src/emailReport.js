    function callSendEmail () {
      sendReportEmail(true);
    }
    
    
    /**
     *  Generate a log, then email it to the person who ran the script.
     * Not currently used
     * TODO figure out a way to do this in a more user friendly manner.
    */

    function sendReportEmail(bool) {
      var templ = HtmlService
      .createTemplateFromFile('report-email');
  
      var results = formatTable();
      var recipient = Session.getActiveUser().getEmail();
      var subject = 'MailMaid Results';
       if (bool === true){
        //templ.results = results;
        var message = templ.evaluate().getContent();
      }else{
          var message = `MailMaid had no rules to process your Inbox. \n\n Please set your rules in the app`;
        };

      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        htmlBody: message
      });
    }


function formatTable() {

    var data = ["doge", "cate", "birb", "doggo", "moon moon", "awkward seal"];//reportArr;

    var myTable = "<table class=\"wp-table\"><tr>";
    
    var perrow = 1; 
    data.forEach((value, i) => {

      myTable += `<td>${value}</td>`;

      var next = i + 1;
      if (next%perrow==0 && next!=data.length) { myTable += "</tr><tr>"; }
    });

    myTable += "</tr></table>";
     
return myTable
}