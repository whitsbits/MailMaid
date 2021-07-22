function writeData(data){
const fs = require('fs');

const jsonString = JSON.stringify(data);
fs.writeFile('./data/data.json', jsonString, err => {
  if (err) {
    console.log('Error writing file', err)
  } else {
    console.log('Successfully wrote file')
  }
})
};
