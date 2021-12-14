/*
Have th user input the key provided by company
*/

function licenseWrite(e) {
  var userProperties = PropertiesService.getUserProperties();
  var license = e.formInput.license;
  userProperties.setProperties({ "license": license });
}

/* Check the stored license key against the getActiveUser MD5 Hash
*/

function licenseRead() {
  var licenseCheck = false;
  var userProperties = PropertiesService.getUserProperties();
  var licenseNum = userProperties.getProperty("license")
    .replace(/[\[\]"]/g, '');
  var userHash = MD5(String(Session.getActiveUser()), false);
  if (licenseNum === userHash) {
    licenseCheck = true
  };
  Logger.log(`${user} - licenseRead returning ${licenseCheck}`)
  return licenseCheck
}

/**
* Initilize the License Key Property Store for unlicense product
*/

function initLicense() {
  if (userProperties.getProperty("license") === null) {
    userProperties.setProperties({ "license": "" })
  }
}

/**
* Store the License Key Property Store
*/
function setLicense(e) {
  Logger.log(e)
  const number = e.formInput.number
  userProperties.setProperties({ "license": number });
  return notify(`License key saved as ${number}`, onHomepage());
}