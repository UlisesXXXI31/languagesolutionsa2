// Archivo de entrada para el login
const API_BASE_URL = 'https://ls-api-nine.vercel.app'; 
const dominioPermitido = '@europaschool.org';

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const statusMessage = document.getElementById('status-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = inputEmail.value.trim();
            const password = inputPassword.value;

            // Validación de dominio
            if (!email.endsWith(dominioPermitido)) {
                if (statusMessage) {
                    statusMessage.textContent = `Correo incorrecto: debe terminar en ${dominioPermitido}`;
                    statusMessage.style.color = 'red';
                }
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error en el inicio de sesión');
                }

                // Guardar datos en localStorage y redirigir
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('userData', JSON.stringify(data.user));

                if (data.user.role === 'profesor') {
                    window.location.href = 'teacher.html';
                } else if (data.user.role === 'alumno') {
                    window.location.href = 'index.html';
                }

            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                if (statusMessage) {
                    statusMessage.textContent = error.message;
                    statusMessage.style.color = 'red';
                }
            }
        });
    }
});
