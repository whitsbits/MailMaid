/**
 *
 * @file all license management functions
 *
 */

/** Check the cached value is TRIAL and return bool
 * @returns {Boolean} - License valid
 */

function licenseRead() {
  var licenseCheck = userProperties.getProperty("license");
  if (licenseCheck === null || licenseCheck.length > 5) {
    // check if userProperty is legacy MD5 ID or "false" or "true"
    Logger.log(
      `${user} - reinitializing license from MD5 legacy ${licenseCheck}`
    );
    initLicense();
  }
  Logger.log(`${user} - licenseRead returning ${licenseCheck}`);
  return licenseCheck;
}

/**
 * Check dB and Initilize the License Property Store
 */

function initLicense() {
  //let email = '' + Session.getActiveUser();
  userProperties.setProperties({ license: true });
  /*
  let license = checkLicesnseInDB(email);
    if (license === 'TRIAL' || license === 'ERROR' ){
      userProperties.setProperties({ "license": false })
    } else {
      userProperties.setProperties({ "license": true })
    };
    */
}

function refreshLicense() {
  initLicense();
  return notify("License Refreshed", onHomepage());
}
