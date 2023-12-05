// darkmode-init.js
import Darkmode from 'darkmode-js';

// Function to initialize Darkmode
function initializeDarkMode() {
  const darkmode = new Darkmode();
  darkmode.showWidget();
  console.log('Darkmode initialized'); // Add this line
}

document.addEventListener("DOMContentLoaded", function () {
  initializeDarkMode();
});




//THIS CODE DOES NOT DO ANYTHING WILL DELETE LATER