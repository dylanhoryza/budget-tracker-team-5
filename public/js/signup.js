document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
        console.log("*** signup.js")
    document.getElementById('signup-section').addEventListener('submit', function (event) {
        console.log("*** signup-section")
        event.preventDefault();

        // Get user inputs
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;


        // Perform basic validation
        if (!email || !password || !name) {
            alert('Please don\'t leave any fields blank');
            return;
        }

        //  send the login data to the server for validation
        fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, name: name })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('sign up failed. Please contact admin');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login
            alert('signup successful! Redirecting...');
            window.location.href = '/dashboard';  
        })
        .catch(error => {
            //  login error (display an error message, clear inputs, etc.)
            alert(error.message);
        });
    });
});