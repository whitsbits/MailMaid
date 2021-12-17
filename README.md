#Gmail Retention Manager

Allows you to set Gmail serach criteria and days from now and this app will purge or archive all email threads meeting that criteria.

https://support.google.com/mail/answer/7190?hl=en

Created by Stewart L Whitman
Copyright 2021

https://workspace.google.com/marketplace/app/mailmaid/767612186965

TODO LIST:

Investigate moving onHour from integer to time
Fix presentation of escape characters in UI
Get full presentation of rule structure to item selection list
Warn before Delete All
Compress dupe Rule input code
Investigate Suggestion Picker
default rule for "Purge, subject:(MailMaid Results), 3 days"
investigate adding rule preview rule to UI
investigate https://gist.github.com/isiahmeadows/63716b78c58b116c8eb7#file-gmail-filter-by-search-query-md
Send email from MailMaid vs self to reduce scopes
    var alias=GmailApp.getAliases();//This gets array of Aliases set up in gmail.
    GmailApp.sendEmail(email , "Subj.. ", "body....", {from: alias[0]}); //Uses first alias
Rule and Schedule Matrix
UI Identifier for rule being edited
Export emails to drive
Preview of Rule results in UI or in App.

