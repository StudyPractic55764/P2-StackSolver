import { loguearUsuario, obtenerUsuarioActivo } from './almacenaje.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const mensajeDiv = document.getElementById('mensaje');
    const userLoggedInSpan = document.getElementById('userLoggedIn');

    // 1. Comprobamos si hay un usuario logueado cuando se carga la página
    const usuarioGuardado = obtenerUsuarioActivo();
    if (usuarioGuardado && userLoggedInSpan) {
        userLoggedInSpan.textContent = usuarioGuardado.nombre;
    }

    // 2. Manejamos el envío del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value;

            const resultado = loguearUsuario(emailInput, passwordInput);

            if (resultado.exito) {
                mensajeDiv.innerHTML = '<span class="text-success fw-bold">Inicio de sesión exitoso</span>';

                // CORREGIDO: Cerramos la llave del if
                if (userLoggedInSpan) {
                    userLoggedInSpan.textContent = resultado.usuario.nombre;
                }

                // CORREGIDO: Usamos comillas invertidas (backticks) para que funcione el ${}
                alert(`Inicio de sesión exitoso. Bienvenido/a ${resultado.usuario.nombre}`);
                
                window.location.href = 'index.html';

            } else {
                mensajeDiv.innerHTML = '<span class="text-danger fw-bold">Credenciales incorrectas.</span>';

                if (userLoggedInSpan) {
                    userLoggedInSpan.textContent = '-no login-';
                }

                localStorage.removeItem('usuarioLogueado');
            }
        }); // <-- Cierre del addEventListener
    }       // <-- Cierre del if (loginForm)
});         // <-- Cierre del DOMContentLoaded