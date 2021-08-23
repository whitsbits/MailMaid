  function callRetention () {
  var rules = getUserPropsArr();
  for (let i = 0; i < rules.length; i++) {
      var action = rules[i][0];
      var search = rules[i][1];
      var days = rules[i][2];

      Logger.log (`Processing inbox with rule set: ${action}, ${search}, ${days}`);
      inBoxLooper (action, search, days);
      Logger.log (`Completed processing retention schedule ${rule}`)
  }
};