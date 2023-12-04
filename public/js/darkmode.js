function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
  }


    // Attach the functions to global scope
    window.toggleDarkMode = toggleDarkMode;
    window.logout = logout;