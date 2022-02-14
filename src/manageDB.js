/**
 * @file Relevant scripts for managing database
 */

/**
 * save user's email and license status in first loading.
 */
function saveUserInfo() {
  const stored = userProperties.getProperty('stored');
  if (stored !== 'true') {
    try {
      var conn = Jdbc.getConnection('jdbc:mysql://34.72.191.212:3306/db_mailmaid',
                              {user: 'root', password: 'CbE4tkxG1pNbzyIf'});
      let stmt = conn.createStatement()
      let email = '' + Session.getActiveUser();

      if (!checkUserInfoInDB(stmt, email)) {
        const query="insert into users(id, email, license) values('"+MD5(email, false)+"','"+email+"','TRIAL')";
        stmt.execute(query);

        stmt.close();
        conn.close();

        Logger.log (`${user} - User successfully sent to database`);
      } else {
        Logger.log (`${user} - User already sent to database`);
      }
      
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
 * @param stmt sql statement object
 * @param email user's info
 * 
 * @return boolean true if arleady stored in DB
 */
 function checkUserInfoInDB(stmt, email) {
    const query = `select * from users where email='${email}'`;
  
    var results = stmt.executeQuery(query);
    
    return !!results.next();
  }