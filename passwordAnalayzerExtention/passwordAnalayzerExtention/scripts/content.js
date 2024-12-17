// Debounce function to delay feedback message
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

async function showFeedbackCircle(passwordField, strengthClass) {
    let feedbackCircle = document.querySelector('.password-feedback-circle');
    let feedbackMessageBox = document.querySelector('.password-feedback-message');

    if (!feedbackCircle) {
        // Create feedback circle
        feedbackCircle = document.createElement('div');
        feedbackCircle.className = 'password-feedback-circle';
        feedbackCircle.style.position = 'absolute';
        feedbackCircle.style.borderRadius = '50%';
        feedbackCircle.style.width = '15px';
        feedbackCircle.style.height = '15px';
        feedbackCircle.style.cursor = 'pointer';
        feedbackCircle.style.zIndex = '9999';

        // Add click listener to the circle
        feedbackCircle.addEventListener('click', () => {
            chrome.runtime.sendMessage({
                action: 'openPopupWithPassword',
                password: passwordField.value,
            });
        });

        document.body.appendChild(feedbackCircle);
    }

    if (!feedbackMessageBox) {
        // Create feedback message box
        feedbackMessageBox = document.createElement('div');
        feedbackMessageBox.className = 'password-feedback-message';
        feedbackMessageBox.style.position = 'absolute';
        feedbackMessageBox.style.padding = '5px 10px';
        feedbackMessageBox.style.borderRadius = '8px';
        feedbackMessageBox.style.fontSize = '12px';
        feedbackMessageBox.style.zIndex = '9998';
        feedbackMessageBox.style.transition = 'opacity 1s ease, transform 1s ease';
        feedbackMessageBox.style.opacity = '1';
        document.body.appendChild(feedbackMessageBox);
    }

    // Update positions
    const rect = passwordField.getBoundingClientRect();
    feedbackCircle.style.left = `${rect.right + 10}px`;
    feedbackCircle.style.top = `${rect.top + window.scrollY}px`;

    feedbackMessageBox.style.left = `${rect.right + 30}px`;
    feedbackMessageBox.style.top = `${rect.top + window.scrollY - 7}px`;

    // Determine feedback details
    const feedbackDetails = await getPasswordFeedback(passwordField.value);
    
    // Set circle color instantly
    feedbackCircle.style.backgroundColor = getFeedbackColor(feedbackDetails.strengthClass);
}

// Debounced function to show feedback message
const debouncedShowFeedbackMessage = debounce(async (passwordField) => {
    const feedbackMessageBox = document.querySelector('.password-feedback-message');
    const feedbackDetails = await getPasswordFeedback(passwordField.value);

    if (feedbackMessageBox) {
        // Set message box styles
        feedbackMessageBox.style.backgroundColor = getMessageBackgroundColor(feedbackDetails.strengthClass);
        feedbackMessageBox.style.color = getMessageTextColor(feedbackDetails.strengthClass);
        
        // Simplified short messages
        const shortMessages = {
            'leaked': 'Leaked Password',
            'weak': 'Weak Password',
            'moderate': 'Moderate Password',
            'strong': 'Strong Password'
        };

        feedbackMessageBox.textContent = shortMessages[feedbackDetails.strengthClass];

        // Fade out and move the message box into the circle
        setTimeout(() => {
            feedbackMessageBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            feedbackMessageBox.style.opacity = '0';
            feedbackMessageBox.style.transform = 'translateX(15px)';
            setTimeout(() => feedbackMessageBox.remove(), 500);
        }, 1000);
    }
}, 1000);

// Helper functions remain the same as in the previous version
function getFeedbackColor(strengthClass) {
    switch(strengthClass) {
        case 'leaked': return 'red';
        case 'weak': return 'red';
        case 'moderate': return 'orange';
        case 'strong': return 'green';
        default: return 'gray';
    }
}

function getMessageBackgroundColor(strengthClass) {
    switch(strengthClass) {
        case 'leaked': return '#f8d7da';
        case 'weak': return '#f8d7da';
        case 'moderate': return '#ffb57d';
        case 'strong': return '#a7c957';
        default: return '#e2e3e5';
    }
}

function getMessageTextColor(strengthClass) {
    switch(strengthClass) {
        case 'leaked': return '#721c24';
        case 'weak': return '#721c24';
        case 'moderate': return '#856404';
        case 'strong': return '#155724';
        default: return '#383d41';
    }
}

// Async function to get comprehensive password feedback
async function getPasswordFeedback(password) {
    // First, check if password is leaked
    const isLeaked = await checkPasswordAgainstPwnedDatabase(password);
    
    if (isLeaked) {
        return {
            strengthClass: 'leaked'
        };
    }

    // If not leaked, check password strength
    if (password.length < 8) {
        return {
            strengthClass: 'weak'
        };
    }

    // Check for character types
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return {
            strengthClass: 'moderate'
        };
    }

    if (!hasSpecialChars) {
        return {
            strengthClass: 'moderate'
        };
    }

    return {
        strengthClass: 'strong'
    };
}

// Check password against Pwned Passwords API
async function checkPasswordAgainstPwnedDatabase(password) {
    if (password.length < 3) return false; // Avoid API call for very short passwords

    // Generate SHA-1 hash of the password
    const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Take first 5 characters of the hash
    const hashPrefix = hashHex.slice(0, 5);
    const hashSuffix = hashHex.slice(5);

    try {
        // Fetch from the Pwned Passwords API
        const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        
        // Check if the full hash suffix exists in the returned list
        const hashLines = data.split('\n');
        return hashLines.some(line => line.startsWith(hashSuffix));
    } catch (error) {
        console.error('Error checking password:', error);
        return false;
    }
}

// Event listener for password input
document.addEventListener('input', (event) => {
    if (event.target.type === 'password') {
        // Show circle immediately
        showFeedbackCircle(event.target);
        
        // Debounce feedback message
        debouncedShowFeedbackMessage(event.target);
    }
});