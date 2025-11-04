// Registration page script

function togglePassword(fieldId: string): void {
    const passwordInput = document.getElementById(fieldId) as HTMLInputElement;
    const toggleBtn = passwordInput.parentElement!.querySelector('.toggle-btn') as HTMLButtonElement;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'Show';
    }
}

// Make togglePassword available globally
(window as any).togglePassword = togglePassword;

document.getElementById('registrationForm')!.addEventListener('submit', async function(e: Event) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage')!;
    const successMessage = document.getElementById('successMessage')!;
    const loading = document.getElementById('loading')!;
    
    // Hide previous messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
    const terms = (document.getElementById('terms') as HTMLInputElement).checked;
    
    // Validation
    if (!terms) {
        errorMessage.textContent = 'You must agree to the Terms of Service and Privacy Policy';
        errorMessage.classList.add('show');
        return;
    }
    
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long';
        errorMessage.classList.add('show');
        return;
    }
    
    // Show loading state
    const registerBtn = document.getElementById('registerBtn') as HTMLButtonElement;
    registerBtn.disabled = true;
    loading.classList.add('show');
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success message
            successMessage.textContent = 'Account created successfully! Redirecting to login...';
            successMessage.classList.add('show');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'LogIn.html';
            }, 2000);
        } else {
            // Show error message
            errorMessage.textContent = result.error || 'Registration failed. Please try again.';
            errorMessage.classList.add('show');
            registerBtn.disabled = false;
            loading.classList.remove('show');
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = 'Network error. Please ensure the backend server is running.';
        errorMessage.classList.add('show');
        registerBtn.disabled = false;
        loading.classList.remove('show');
    }
});

export {};
