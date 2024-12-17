document.getElementById('checkPassword').addEventListener('click', () => {
    const userPassword = document.getElementById('userPassword').value;

    if (userPassword === '') {
        alert('Please enter a password.');
        return;
    }

    // Analyze password
    const result = analyzePasswordStrength(userPassword);
    const feedback = document.getElementById('feedbackMessage');
    feedback.textContent = result.message;
    feedback.style.color = result.strengthClass === 'weak' ? 'red' : result.strengthClass === 'moderate' ? 'orange' : 'green';

    // Suggest a stronger password if needed
    const suggestedPasswordField = document.getElementById('suggestedPassword');
    if (result.strengthClass !== 'strong') {
        suggestedPasswordField.value = generateStrongPassword();
    } else {
        suggestedPasswordField.value = '';
    }
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



// Password strength analysis
function analyzePasswordStrength(password, found) {
    let message = '';
    let strengthClass = '';

    if (password.length < 8) {
        message = 'Weak: Password is too short.';
        strengthClass = 'weak';
    } else if (!/[A-Z]/.test(password)) {
        message = 'Weak: Add uppercase letters.';
        strengthClass = 'weak';
    } else if (!/[a-z]/.test(password)) {
        message = 'Weak: Add lowercase letters.';
        strengthClass = 'weak';
    } else if (!/[0-9]/.test(password)) {
        message = 'Moderate: Add numbers.';
        strengthClass = 'moderate';
    } else if (!/[!@#$%^&*]/.test(password)) {
        message = 'Moderate: Add special characters.';
        strengthClass = 'moderate';
    } else {
        message = 'Strong: Password is secure.';
        strengthClass = 'strong';
    }

    return { message, strengthClass };
}

// Generate a strong password suggestion
function generateStrongPassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*';
    const allChars = upper + lower + digits + special;

    let password = '';
    const randomChar = (chars) => chars.charAt(Math.floor(Math.random() * chars.length));

    password += randomChar(upper);
    password += randomChar(lower);
    password += randomChar(digits);
    password += randomChar(special);

    for (let i = 4; i < 12; i++) {
        password += randomChar(allChars);
    }

    return password;
}

