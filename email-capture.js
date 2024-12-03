// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to send data to webhook
function sendToWebhook(email) {
    const webhookUrl = 'https://hook.us1.make.com/00s7hvkmlkyz5bs3ynfsvk2dazll92dz'; // Replace with your webhook URL
    
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Main function to handle email capture
document.addEventListener('DOMContentLoaded', function() {
    // Replace 'your-form-id' with your actual form ID
    const form = document.getElementById('capture-email');
    // Replace 'email-input' with your actual email input field ID
    const emailInput = document.getElementById('qIrbGQT9voND_46dd511113963785fccc');
    
    let emailCaptured = false;

    // Listen for input changes on email field
    emailInput.addEventListener('input', function() {
        const email = this.value;
        
        if (isValidEmail(email) && !emailCaptured) {
            sendToWebhook(email);
            emailCaptured = true;
        }
    });

    // Reset the emailCaptured flag when the form is submitted
    form.addEventListener('submit', function(e) {
        emailCaptured = false;
    });
});
