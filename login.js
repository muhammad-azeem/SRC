// DOM Elements
const loginForm = document.getElementById('admin-login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('login-error');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Prepare data to send in the request
    const requestData = {
        email: email,
        password: password
    };

    // Send POST request to login.php
    fetch("http://localhost/project/php/login.php", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())  // Expect JSON response
    .then(data => {
        if (data.success) {
            // Clear the email and password fields before redirecting
            emailInput.value = '';
            passwordInput.value = '';

            localStorage.setItem('adminAuth', 'true');
            window.location.href = 'dashboard.html';  // Redirect to dashboard on successful login
        } else {
            errorMessage.textContent = data.message;  // Show error message
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        errorMessage.textContent = "Something went wrong, please try again.";
    });
});
