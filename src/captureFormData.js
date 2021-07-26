/* captureFormData.js */
import { writeData } from './writeData.mjs';
 
const buttonElement = document.getElementById("save-settings");
const input = document.getElementById("action") +", " + document.getElementById("searchString")+", " +document.getElementById("days");
 
buttonElement.addEventListener('click', () => {
  writeData(input);
});