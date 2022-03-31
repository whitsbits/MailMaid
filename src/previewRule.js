
function buildSearchURL(e) {
  var search = e.formInput.search;
  var formDays = e.formInput.days
  var days = ` older_than:${e.formInput.days}d`;
  if (search === undefined || formDays === undefined){
    return notify ("You must enter serarch criteria and numer of days in your inbox before you can preview the rule", rulesManagerCard(e))
  }
  var baseURL = `https://mail.google.com/mail/u/0/#search/`
  let encoded = encodeURIComponent(search + days);
  let url = baseURL + encoded;
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.OVERLAY))
    .build();
}

function buildDownloadURL(e) {
  var search = e.formInput.search;
  if (search === undefined){
    return notify ("You must enter serarch criteria before you can preview the rule", downloadManagerCard(e))
  }
  var baseURL = `https://mail.google.com/mail/u/0/#search/`
  let encoded = encodeURIComponent(search);
  let url = baseURL + encoded;
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.OVERLAY))
    .build();
}