// Contact page functionality
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", submitContactForm);
    } else {
        console.error("Contact form not found!");
    }
});

// Handle contact form submission
function submitContactForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const errors = validateForm(formData);

    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }

    // Debugging: Check FormData values
    console.log("FormData values:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Send data to the server
    fetch('php/save_contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from server:", data); // Debugging
        if (data.success) {
            showNotification('Message sent!', 'success');
            event.target.reset();
        } else {
            showNotification('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        showNotification('Something went wrong. Try again!', 'error');
    });
}

// Form validation function
function validateForm(formData) {
    let errors = [];

    const name = formData.get('name')?.trim() || "";
    const email = formData.get('email')?.trim() || "";
    const subject = formData.get('subject')?.trim() || "";
    const message = formData.get('message')?.trim() || "";

    if (name === '') errors.push("Name is required.");
    if (email === '') {
        errors.push("Email is required.");
    } else if (!validateEmail(email)) {
        errors.push("Invalid email format.");
    }
    if (subject === '') errors.push("Subject is required.");
    if (message === '') errors.push("Message cannot be empty.");

    return errors;
}

// Email validation function
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Apply styles to center it on the screen
    notification.style.position = "fixed";
    notification.style.top = "50%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.padding = "15px 20px";
    notification.style.background = type === "success" ? "green" : "red";
    notification.style.color = "white";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    notification.style.fontSize = "16px";
    notification.style.zIndex = "1000";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

