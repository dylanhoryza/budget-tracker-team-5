//logout.js

const { response } = require("express")


document.addEventListener('DOMContentLoaded', function () {
    //handle logout 
    document.getElementById('logout-link').addEventListener('click', function () {
        //send a request to the server to clear the user session
        fetch('api/users/logout', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Logout failed. Please try again.');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful logout
                alert('Logout successful! Redirecting to homepage...');
                window.location.href = '/'; // Redirect to the homepage
            })
            .catch(error => {
                // Handle logout error (display an error message, etc.)
                alert(error.message);
            });
    })
})