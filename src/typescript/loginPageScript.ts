// Login page script

function togglePassword(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const toggleBtn = document.querySelector('.toggle-btn') as HTMLButtonElement;
    
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

document.getElementById('loginForm')!.addEventListener('submit', async function(e: Event) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage')!;
    const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
    const loading = document.getElementById('loading')!;
    
    // Hide previous errors
    errorMessage.classList.remove('show');
    
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const remember = (document.getElementById('remember') as HTMLInputElement).checked;
    
    // Show loading state
    loginBtn.disabled = true;
    loading.classList.add('show');
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember: remember
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Store user session
            if (remember) {
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('isAdmin', result.isAdmin ? 'true' : 'false');
            } else {
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userId', result.userId);
                sessionStorage.setItem('isAdmin', result.isAdmin ? 'true' : 'false');
            }
            
            // Redirect based on admin status
            if (result.isAdmin) {
                window.location.href = 'staffPage.html';
            } else {
                window.location.href = 'mainPage.html';
            }
        } else {
            // Show error message
            errorMessage.textContent = result.error || 'Invalid email or password';
            errorMessage.classList.add('show');
            loginBtn.disabled = false;
            loading.classList.remove('show');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Network error. Please ensure the backend server is running.';
        errorMessage.classList.add('show');
        loginBtn.disabled = false;
        loading.classList.remove('show');
    }
});

// Auto-fill email if remembered
window.addEventListener('DOMContentLoaded', function() {
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
        (document.getElementById('email') as HTMLInputElement).value = rememberedEmail;
        (document.getElementById('remember') as HTMLInputElement).checked = true;
    }
});

export {};
