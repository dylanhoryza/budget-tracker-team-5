// login.js

document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Get user inputs
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Perform basic validation
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        //  send the login data to the server for validation
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed. Please check your email and password.');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login
            alert('Login successful! Redirecting...');
            window.location.href = '/dashboard';  // is /dashboard good? or do we need to be putting the path?
        })
        .catch(error => {
            //  login error (display an error message, clear inputs, etc.)
            alert(error.message);
        });
    });
});
