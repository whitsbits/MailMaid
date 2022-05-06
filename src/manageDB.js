/**
 * @file Relevant scripts for managing database
 */


  /**
 * Function to set up any SQL dB call
 * Offline file .ENV.js must be run from AppScript ProjectUI
 * to initialize scriptProperties if dB config has changed
 * @returns JDBC Connection and Statement
 */
   function getStmt() {
    var _user = scriptProperties.getProperty("user")
    var _password = scriptProperties.getProperty("password")
    var _url = scriptProperties.getProperty("dburl")
    var conn = Jdbc.getConnection(_url,
      {user: _user,
      password: _password});
    let stmt = conn.createStatement()
    return stmt
  }


/**
 * save user's email and license status in first loading.
 */
function saveUserInfo() {
  const stored = userProperties.getProperty('stored');
  if (stored !== 'true' || stored === null ) {
    try {
      let stmt = getStmt();
      let email = '' + Session.getActiveUser();

      if (!checkUserInfoInDB(stmt, email)) {
        const query="insert into users(id, email, license) values('"+MD5(email, false)+"','"+email+"','TRIAL')";
        stmt.execute(query);

        stmt.close();

        Logger.log (`${user} - User successfully sent to database`);
      };
      
      userProperties.setProperties({ 'stored': true });
    } catch(e) {
      Logger.log(`${user} - Storing info in database failed: ${e.message}`);
    }
  }else{
    Logger.log (`${user} - User already stored in database`);
  };
}

/**
 * Return if user info already stored in DB.
 * 
 * @param email user's info
 * 
 * @return boolean true if arleady stored in DB
 */
 function checkUserInfoInDB(email) {
    const query = `select * from users where email='${email}'`;
    let stmt = getStmt();
    var results = stmt.executeQuery(query);
    return !!results.next();
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
    const query = `select license from users where email='${email}'`;
    let stmt = getStmt();
    var results = stmt.executeQuery(query)
    if(results.next()){
    var result = results.getString(1);
    };
    stmt.close();
    Logger.log (`${user} - checkLicense returned ${result}`)
    return result;
  }
  catch (e) { // if the user has not updated scopes send an email asking them to log into the UI
    Logger.log(`${user} - ${e.toString()} from manageDB`);
    return 'ERROR'
  }
};