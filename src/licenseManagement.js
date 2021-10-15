/*
Have th user input the key provided by company
*/

function licenseWrite(e) {
    var userProperties = PropertiesService.getUserProperties();
    var license = e.formInput.license;
    userProperties.setProperties({"license" : license});
}

/* Check the stored license key against the getActiveUser MD5 Hash
*/

function licenseRead() {
    var licenseCheck = false;
    var userProperties = PropertiesService.getUserProperties();
    var licenseNum = userProperties.getProperty("license")
    .replace(/[\[\]"]/g,'');
    var userHash = MD5( String(Session.getActiveUser()), false );
    if(licenseNum === userHash){
        licenseCheck = true
    };
    Logger.log (`licenseRead returning ${licenseCheck}`)
    return licenseCheck
}