'use strict';

function writeData(data) {
  var fs = require('fs');

  var jsonString = JSON.stringify(data);
  fs.writeFile('./data/data.json', jsonString, function (err) {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  });
};

export { writeData };