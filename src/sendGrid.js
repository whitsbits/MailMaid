function sendGrid(recipient, subject, body) {
var SENDGRID_KEY ='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';

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
    "email": "support@mailmaid.co"
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


 var response = UrlFetchApp.fetch("https://api.sendgrid.com/v3/mail/send",options);

 Logger.log(`${user} - sendGrid message process with response: ${response}`); 
 }