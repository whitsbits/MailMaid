/**
 * @file Relevant scripts for managing database
 */

 
  /**
 * Function to set up any SQL dB call
 * Offline file .ENV.js must be run from AppScript ProjectUI
 * to initialize scriptProperties if dB config has changed
 * @returns JDBC Connection and Statement
 */

  /**const _user = scriptProperties.getProperty("user")
    const _password = scriptProperties.getProperty("password")
    const _url = scriptProperties.getProperty("dburl")
    const firestore = FirestoreApp.getFirestore(_user, _password, _url);
 */
    const _user = 'sa-firestore@mailamidweb.iam.gserviceaccount.com'
    const _password = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDlXhM2Csfau+lM\nm0X2nJclwUvPfKJyFwd7ol1vEChCnACBtcYTn6ndhjiwV5njJnkPNPTh8yyOJhKn\nmBbcp25Ye3J9IQhFN7tPV9xANupqk3njFN/qJN0ZrePOnnDhRyd9F8HLzJhhMFua\niRdpgM0OYAgfTKrxKHtL0p1RynjUXo1ExPwRva2dQuzFqvKZDGSrIq9xDUe/jHzn\nN2ZVRJXxSfa3WDts4fyHAGHfC1Ef2N+yj5o60qGZ1I8WwBCu3gNwVe2+Jjoms/ZX\nDtkwnyXPV4gO2R1I7OMhd4xD+amgGpC0mte0hSZbh2qz4SkkTu4Y0zJkMOSxbb79\n0DXvhpevAgMBAAECggEAWfPJCPq1Yl0ro7WJfKvwwwfJmXfBpYjOkHgeuH3XrDfO\nIxCMvAlz7sLC3LWeTm06MPKNz0c1BBJ+YmfNH4AyUFUpk1UvDyZKOVW1tSFUUbPA\nq4P2RLdsVrPRkailkFP9cpusjyaP5B247yQwoFm5EZgr10qUB7vejt/sfrUvKemk\nvvcqthZLB86HcQLSfXg1t6SFtjGkEpVjtX22g7ARiSUkMuyFrNvuwMt+6+8XWwa/\n7dNd2dXY2+XbGiMw/XY+ltUBaXrQ8rXacuEJYzXvXswBiFbjaDYQQfqLCtx95tGd\n/5eAZbUm32tvOB5C9ObaP89BbUCbIkrFw78RER1UoQKBgQD7hcjK08GRzD66g+ak\nmmAY/OKjDSot/HCAEMRMRuS5P5/Xdm/TWyqxb0mfu4Uwhtua0QezH9Hml48mOBgs\nqH2ntMGsGNHRRJ7iLYLP21Xd4Z0mNelWlPko4LB4GuqPOkT8pJYhykh6PBpSWUXv\nMmQD93h01dHFz3JepL+o7fkjqQKBgQDpc1PTkBZuvrvP7uoPKYkGOAnuNAtRVqWY\nsBuwpGQStOekvbQRrfowz2Euodcr6U7qCYTCLjqxT2Bzr8yxXDjV1eDeZXtZqyId\nf24Su7R31Jgs2ueSR+NO65bNB53tKjd1z563k4bpJ2QvKuG2+aYTzDLd8Sha3+5Z\nAw8bwWd3lwKBgF2QP8hLi1csDi2dwV972cGR2NDkpcsje8n38r2ZJZ5Pr6sb8K9D\n25bTmiSkQgByOiDWHzIf5RoNSP/joAKEzvFiySS2ut5I0325hk7B/agjNC0xotJF\naoYtRxf2k0iiWWVN6Fc7g0iNMRFvChfXu+LJ3PJBU95ss9PHH1C87Y+5AoGBAJGA\ndvvCr6igqpBj+XAv1B6TKOVVfMRae+XZxbhoDZN3O3V7Y1Mtm2V2q7yT1Hei97N4\n8UzR4XUH4zbXmH3m2+mzX29d0u7FcgLunJ2Cbm3NjHdQjMqoka1rutbZa34ZNO3x\n1JvYkFqbWZ7oXDxeBzwJpp6cIynYrka+WFlVRvbLAoGBAPnlQbys2wSDl6y7gFAU\ni3KR7Ke4hPTeBvcwPE+AeFU2eKYey4c4kZP3KRRC2xOdHB3urgqhDYnWOZbWFEfl\nE7COvBaegG8BCzlDtc+Rwjon4uvDbNb2V6eL5VSzmKqNMGyO7fLjP0z/UovDRsA/\nYfGfvEPyK6AGO+Wh6ta8Xh6V\n-----END PRIVATE KEY-----\n'
    const _url = 'mailamidweb'
    const firestore = FirestoreApp.getFirestore(_user, _password, _url);
   


/**
 * save user's email and license status in first loading.
 */
 function saveUserInfo() {
  let email = '' + Session.getActiveUser();
  let id = MD5(email, false);
  const stored = userProperties.getProperty('stored');
  if (stored !== 'true' || stored === null ) {
 try{
  if (checkUserInfoInDB(email) === true) {
    userProperties.setProperties({ 'stored': true });
    Logger.log (`${user} - User already stored in database`);
  }else{
   const data = {
     "id": id,
     "license":"TRIAL"
   }
     firestore.createDocument(`users/${email}`,data);

       Logger.log (`${user} - User successfully sent to database`);
  }
   } catch(e) {
     Logger.log(`${user} - Storing info in database failed: ${e.message}`);
   }
  }
};

/**
 * Return if user info already stored in DB.
 * 
 * @param email user's info
 * 
 * @return boolean true if arleady stored in DB
 */
 function checkUserInfoInDB(email) {
  try{
    let docRef = `users/${email}` 
    let results = firestore.getDocument(docRef)
    Logger.log (`${user} - checkUserInfoInDB returned ${result}`)
    return (results !== null);
  } catch{
     Logger.log (`${user} - checkUserInfoInDB returned null`)
      return null
    }
  };


/**
 * Return license value from DB.
 * 
 * @param email user's info
 * 
 * @return licesense data for user
 */

 function checkLicesnseInDB(email) {
  try {
    let docRef = `users/${email}` 
    const results = firestore.getDocument(docRef)
    if (results instanceof Error){
      var result = 'ERROR'
    }else{
    var result = Object.values(results.fields.license);
    }
    Logger.log (`${user} - checkLicesnseInDB returned ${result}`)
    return result[0];
  }
  catch (e) { // if the user has not updated scopes send an email asking them to log into the UI
    Logger.log(`${user} - ${e.toString()} from checkLicesnseInDB`);
    return 'ERROR'
  }
};

