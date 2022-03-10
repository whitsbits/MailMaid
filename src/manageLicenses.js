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
  if (licenseCheck === null){
    initLicense();
  };
  Logger.log(`${user} - licenseRead returning ${licenseCheck}`)
  return licenseCheck
}

/**
* Check dB and Initilize the License Property Store
*/

function initLicense() {
  let email = '' + Session.getActiveUser();
    if (checkLicesnseInDB(email) === 'TRIAL'){
      userProperties.setProperties({ "license": false })
    } else {
      userProperties.setProperties({ "license": true })
    };
};

function refreshLicense() {
  initLicense()
  return notify("Refreshing License", onHomepage())
}
