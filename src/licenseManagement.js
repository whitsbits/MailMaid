/*
Have th user input the key provided by company
*/

function licenseWrite(e) {
    var userProperties = PropertiesService.getUserProperties();
    var license = e.formInput.license;
    userProperties.setProperties({"license" : license});
}

/* Check the stored license key against the getAvtiveUser MD5 Hash
*/

function licenseRead() {
    var licenseCheck = false;
    var userProperties = PropertiesService.getUserProperties();
    var licenseNum = userProperties.getProperty("license")
    .replace(/[\[\]"]/g,'');
    var userHash = MD5( String(Session.getActiveUser()), false );
    Logger.log(licenseNum)
    Logger.log (userHash)
    if(licenseNum === userHash){
        licenseCheck = true
    };
    Logger.log (`licenseRead returning ${licenseCheck}`)
    return licenseCheck
}