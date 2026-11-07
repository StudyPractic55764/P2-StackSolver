import { usuarios } from './datos.js';


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const mensajeDiv = document.getElementById('mensaje');
    const userLoggedInSpan = document.getElementById('userLoggedIn');

    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        userLoggedInSpan.textContent = usuario.email;
    }

    loginForm.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const emailInput = document.getElementById('email').value.trim();
        const passwordInput = document.getElementById('password').value;

        const usuarioEncontrado = usuarios.find(
            usuario => usuario.email === emailInput && usuario.password === passwordInput
        );

        if (usuarioEncontrado) {
            mensajeDiv.innerHTML = `<span class="text-success fw-bold">Inicio de sesión exitoso</span>`;
            userLoggedInSpan.textContent = usuarioEncontrado.email;
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
            alert(`Inicio de sesión exitoso. Bienvenido/a ${usuarioEncontrado.nombre}`);
        } else {
            mensajeDiv.innerHTML = `<span class="text-danger fw-bold">Credenciales incorrectas.</span>`;
            userLoggedInSpan.textContent = '-no login-';
            localStorage.removeItem('usuarioLogueado');
        }
    });
});
