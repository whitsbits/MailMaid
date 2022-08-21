function sendGrid(recipient, subject, body) {

const SENDGRID_KEY = scriptProperties.getProperty("emailService");

  var headers = {
    "Authorization" : "Bearer " + SENDGRID_KEY, 
    "Content-Type": "application/json" 
  }

  var body =
  {
  "personalizations": [
    {
      "to": [
        {
          "email": recipient
        }
      ],
      "subject": subject
    }
  ],
  "from": {
    "email": "support@mailmaid.co",
    "name": "MailMaid Results"
  },
  "content": [
    {
      "type": "text/html",
      "value": body
    }
  ]
}

  var options = {

    'method':'post',
    'headers':headers,
    'payload':JSON.stringify(body)


  }


 var response = UrlFetchApp.fetch("https://api.sendgrid.com/v3/mail/send", options);
 if (!response.toString()){
  response = '200 - Success';
 }
 
 Logger.log(`${user} - sendGrid message process with response: ${response.toString()}`); 
 }