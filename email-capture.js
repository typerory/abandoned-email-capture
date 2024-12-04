// Function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to send data to webhook
function sendToWebhook(email, eventType, sessionId) {
    const webhookUrl = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your webhook URL
    
    const payload = {
        email: email,
        timestamp: new Date().toISOString(),
        captureType: eventType,
        sessionId: sessionId,
        sequence: Date.now()
    };

    console.log('Sending webhook with payload:', payload);
    
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Webhook sent successfully:', payload);
    })
    .catch((error) => {
        console.error('Error sending webhook:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('your-form-id');
    const emailInput = document.getElementById('email-input');
    
    // Generate session ID when page loads and store it
    const currentSessionId = generateUUID();
    console.log('New session started:', currentSessionId);
    
    let lastCapturedEmail = '';
    let delayTimer = null;

    // Function to handle delayed send
    function handleDelayedSend(email) {
        if (isValidEmail(email)) {
            sendToWebhook(email, 'delay', currentSessionId);
            lastCapturedEmail = email;
            console.log('Delayed send complete for:', email);
        }
    }

    // Track email changes and handle delay
    emailInput.addEventListener('input', function() {
        const email = this.value;
        
        // If there's an existing timer, clear it
        if (delayTimer) {
            console.log('Clearing existing timer for:', lastCapturedEmail);
            clearTimeout(delayTimer);
            delayTimer = null;
        }

        // If it's a valid email and different from last captured
        if (isValidEmail(email) && email !== lastCapturedEmail) {
            console.log('Starting new 10s timer for:', email);
            delayTimer = setTimeout(() => handleDelayedSend(email), 10000);
        }
    });

    // Listen for form submission
    form.addEventListener('submit', function(e) {
        const email = emailInput.value;
        
        // Clear any pending delayed send
        if (delayTimer) {
            console.log('Clearing timer due to form submission');
            clearTimeout(delayTimer);
            delayTimer = null;
        }

        // Only send if valid and different from last captured
        if (isValidEmail(email) && email !== lastCapturedEmail) {
            sendToWebhook(email, 'submit', currentSessionId);
            lastCapturedEmail = email;
            console.log('Form submitted with:', email);
        } else {
            console.log('Form submitted but email not sent - either invalid or duplicate:', email);
        }
    });
});
