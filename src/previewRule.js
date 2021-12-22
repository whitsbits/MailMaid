
function buildSearchURL(e) {
  var search = e.formInput.search;
  var days = ` older_than:${e.formInput.days}d`;
  var baseURL = `https://mail.google.com/mail/u/0/#search/`
  let encoded = encodeURIComponent(search + days);
  let url = baseURL + encoded;
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.OVERLAY))
    .build();
}