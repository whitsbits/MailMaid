/**
 * @file Relevant scripts for managing database
 */

 
  /**
 * Function to set up any SQL dB call
 * Offline file .ENV.js must be run from AppScript ProjectUI
 * to initialize scriptProperties if dB config has changed
 * @returns JDBC Connection and Statement
 */
   const dbemail = 'dbconnect@helloworld-d2767.iam.gserviceaccount.com';
   const key = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDWXQjg1RxezN88\n3l2DlPHmCuWs1SszvMKBmovoyGEus+L5pzupkpC+5fpW394PtFxiwdbSXBkq6Cvf\nlZrSQqKWYQu+rBLUryKYcnnahkWNu6OJp+9fbtkreu+SR1ZhAWw1S+utTlnrZfxt\nn+1FhHA1r2u4kWghqagokloa7KFt5Zf8UbW7P+g4soMw5xk9+FaOuBGhruaXpzI7\nM1dD9fX4Eqcp3InqHyxhkHYJrSBY6v8KHm1J0oYuxu1M6X4OON2ZiMWp3rv/hg1v\nqDWZowTIYKgZooCZxmG7bbRfXVPbzQ+ST+T79wclhc0wB/RaTSTnf6sbubcT1T3s\nI4NOdktrAgMBAAECggEAEaG0Xb3ZqAiE4h5OJckF/oxt6MHd3FMN0pgyItL8f1ln\ndW5mb2OxSSpkZWnje3oz0SGteD8ACPHwzeKhyeKWOfVAgI3pvJmtKEneMPWzWd2R\nrXxlKX3WGgfyFZ+NgMwbqOSWPXqA1eZdFW0+mGW0zw2fOB6pqH8qaC/lfmpxOrct\nuAprW1EzFZLrc1JNzK4+G1MaBjNx6iXYMJzsQ+Gqivt+5nIQWR+DXnZRyVnUN4u9\nEx2+Um734gCMk/ut/yYkU42feZ7kkvQU4W1FRrg1Sq76I0S3wQPd6NvSSNwadwaS\nvvoF3YnBWgU/XKmWLaVxteS448j2hMVC4hJOoPOD/QKBgQDru5V94+FT1RHbdT7Q\nB6zZUXfXR+CsEXVH78zDpDzHku7KVIW02Jyf5hSCgEuoanRqSobb1+S1INMzWjvn\nzO1KK7ibswMHfvDvkz0sVDnsnrujz+nm84mN5Pb6Lvh/fINz+eb4suT9ZwH8VOOu\nrrfOqlMiVaevWbro95tMQRb8VQKBgQDoyx4H1ycvpdp/fypht9kkHonASOBjbul/\nzE89mnSDTUYoG/vTX6OgZ+7Fy3V7kgxETj1iwMYfdqYreTtA39xmlpYnAh6ujKlb\nDX4qWVuC7W/iAvdn6k9maGqQFGc8d10XBaBUJS9wsQXT8nxmMMQTJFbh/DGAlJJb\norhKRhfovwKBgQCsPGbBkJq2MdvWSRgXz0PPlOLG/NF/Z1IVuXQXDg0KlKS8WH1I\n4WuuuOELaMnex8k/UCywvFFytgUaZDeY6fYGV2OO/4CbHXjU0vPDS9b2uBPJYMQ5\n5n7+meiKa39NRqCVQGYuGCePro+Y2j1xCF9sNK6BS6w1Ro52YVOqp3Qv8QKBgQCT\n5ujPhmzJIxCtTHf62bnF7vkKB8M4qXEE1yPJOeaovWHDffQDGZJ2CVJ0rI2Z0vKk\nOylZIq09tD5jBIUW9KOtMiN36SrhL1EyHmJ4OYmgp4YcDFJv3ThREioSHERy8Ete\nox54F6AKcw4G2NscegM5Pi9NKNOyo7JRMhLwbZQnNQKBgHM4s89xZzE7sqpwVpnW\nRDT7wvp0zgPCpNmZUBDZMSpQ2oXPYvl8qSmVXocU/JpFwLnJswWBMfxyt5n98YxM\nu4YUCJ1ktFsJgmDqU+acxA4Vath6itTsFlmHLKCN0VFHIPr+wdDZh1VXHrOMlwEq\nfG8OGqOTy6D5vc4tVJtHLocv\n-----END PRIVATE KEY-----\n';
   const projectId = 'helloworld-d2767'
   const firestore = FirestoreApp.getFirestore(dbemail,key,projectId);

   /** const _user = scriptProperties.getProperty("user")
    const _password = scriptProperties.getProperty("password")
    const _url = scriptProperties.getProperty("dburl")
    const firestore = FirestoreApp.getFirestore(_user, _password, _url);
     */



/**
 * save user's email and license status in first loading.
 */
 function saveFireUserInfo() {
  let email = '' + Session.getActiveUser();
  let id = MD5(email, false);

 try{
   const data = {
     "email": email,
     "license":"TRIAL"
   }
     firestore.createDocument(`users/${id}`,data);

       Logger.log (`${user} - User successfully sent to database`);
   } catch(e) {
     Logger.log(`${user} - Storing info in database failed: ${e.message}`);
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
  const results = firestore.query("users").Where("email", "==", email).Execute();
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
    const results = firestore.query("users").Where("email", "==", email).Execute();
    var result = Object.values(results[0].fields.license);
    Logger.log (`${user} - checkLicenseFire returned ${result}`)
    return result;
  }
  catch (e) { // if the user has not updated scopes send an email asking them to log into the UI
    Logger.log(`${user} - ${e.toString()} from checkLicesnseInDB`);
    return 'ERROR'
  }
};