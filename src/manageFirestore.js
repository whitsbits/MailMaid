/**
 * @file Relevant scripts for managing database
 */

 
  /**
 * Function to set up any SQL dB call
 * Offline file .ENV.js must be run from AppScript ProjectUI
 * to initialize scriptProperties if dB config has changed
 * @returns JDBC Connection and Statement
 */
   const _user = scriptProperties.getProperty("user")
    const _password = scriptProperties.getProperty("password")
    const _url = scriptProperties.getProperty("dburl")
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
  let docRef = `users/${email}` 
  const results = firestore.getDocument(docRef)
  return (results !== null);
  }


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
    var result = Object.values(results.fields.license);
    Logger.log (`${user} - checkLicesnseInDB returned ${result}`)
    return result;
  }
  catch (e) { // if the user has not updated scopes send an email asking them to log into the UI
    Logger.log(`${user} - ${e.toString()} from checkLicesnseInDB`);
    return 'ERROR'
  }
};

