document.addEventListener('DOMContentLoaded', () => {
    // Create a connection port to track popup lifecycle
    chrome.runtime.connect({ name: 'popup' });

    chrome.storage.local.get(['userPassword'], (data) => {
        if (data.userPassword) {
            const passwordField = document.getElementById('userPassword');
            passwordField.value = data.userPassword;

            // Analyze the password automatically
            analyzePassword(data.userPassword);
        }
    });

    // Add keydown listener for Enter key
    document.getElementById('userPassword').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const userPassword = event.target.value;
            analyzePassword(userPassword);
        }
    });

    // Clear input when user starts typing
    document.getElementById('userPassword').addEventListener('input', (event) => {
        // Clear any previously suggested password when user starts typing
        document.getElementById('suggestedPassword').value = '';
    });
});

document.getElementById('checkPassword').addEventListener('click', () => {
    const userPassword = document.getElementById('userPassword').value;
    analyzePassword(userPassword);
});

document.getElementById('passwordToggle').addEventListener('click', () => {
    const passwordField = document.getElementById('userPassword');
    const toggleIcon = document.getElementById('toggleEye');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.src = './assets/eye-icon-open.svg';
    } else {
        passwordField.type = 'password';
        toggleIcon.src = './assets/eye-icon.svg';
    }
});

document.getElementById('copyPassword').addEventListener('click', () => {
    const suggestedPassword = document.getElementById('suggestedPassword').value;
    if (suggestedPassword) {
        navigator.clipboard.writeText(suggestedPassword);
        alert('Suggested password copied to clipboard!');
    } else {
        alert('No suggested password to copy.');
    }
});

window.addEventListener('beforeunload', () => {
    document.getElementById('userPassword').value = '';
    chrome.storage.local.remove('userPassword');
});

async function analyzePassword(password) {
    const feedback = document.getElementById('feedbackMessage');
    const suggestedPasswordField = document.getElementById('suggestedPassword');

    try {
        // First, check if the password is leaked
        const isLeaked = await checkPasswordAgainstPwnedDatabase(password);
        
        if (isLeaked) {
            feedback.textContent = 'Leaked: This password has been exposed in data breaches!';
            feedback.style.color = 'red';
            suggestedPasswordField.value = generateStrongPassword();
            return;
        }

        // If not leaked, proceed with normal strength analysis
        const result = analyzePasswordStrength(password);
        feedback.textContent = result.message;
        feedback.style.color = result.strengthClass === 'weak' ? 'red' : result.strengthClass === 'moderate' ? 'orange' : 'green';

        // Suggest a strong password if needed
        if (result.strengthClass !== 'strong') {
            suggestedPasswordField.value = generateStrongPassword();
        } else {
            suggestedPasswordField.value = '';
        }
    } catch (error) {
        feedback.textContent = 'Error checking password. Please try again.';
        feedback.style.color = 'red';
        console.error('Password check error:', error);
    }
}

// Check password against Pwned Passwords API
async function checkPasswordAgainstPwnedDatabase(password) {
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

function analyzePasswordStrength(password) {
    if (password.length < 8) {
        return { strengthClass: 'weak', message: 'Weak: Too short.' };
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return { strengthClass: 'moderate', message: 'Moderate: Add uppercase, lowercase, or numbers.' };
    }
    if (!/[!@#$%^&*]/.test(password)) {
        return { strengthClass: 'moderate', message: 'Moderate: Add special characters.' };
    }
    return { strengthClass: 'strong', message: 'Strong: Secure password!' };
}

function generateStrongPassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*';
    const allChars = upper + lower + digits + special;

    let password = '';
    const randomChar = (chars) => chars.charAt(Math.floor(Math.random() * chars.length));

    // Ensure at least one character from each category
    password += randomChar(upper);
    password += randomChar(lower);
    password += randomChar(digits);
    password += randomChar(special);

    // Fill the rest to reach a 12-character length
    for (let i = 4; i < 12; i++) {
        password += randomChar(allChars);
    }

    return shufflePassword(password);
}

function shufflePassword(password) {
    const array = password.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}