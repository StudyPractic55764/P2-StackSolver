import { loguearUsuario, obtenerUsuarioActivo } from './almacenaje.js';


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const mensajeDiv = document.getElementById('mensaje');
    const userLoggedInSpan = document.getElementById('userLoggedIn');

    //1. Comprobamos si hay un usuario logueado cuando se carga la página y mostramos su nombre
    const usuarioGuardado = obtenerUsuarioActivo();
    if (usuarioGuardado && userLoggedInSpan) {
        userLoggedInSpan.textContent = usuarioGuardado.nombre;
    }

    //2.Manejamos el envío del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value;

            //Llamamos a la función del archivo almacenaje.js
            const resultado = loguearUsuario(emailInput, passwordInput);

            if (resultado.exito) {
                mensajeDiv.innerHTML = '<span class="text-success fw-bold">Inicio de sesión exitoso</span>';

                if (userLoggedInSpan) {
                    userLoggedInSpan.textContent = resultado.usuario.nombre;

                    alert('Inicio de sesión exitoso. Bienvenido/a ${resultado.usuario.nombre}');

                    //Redirigimos al index.html después del login
                    window.location.href='index.html';
                } else {
                    mensajeDiv.innerHTML = '<span class="text-danger fw-bold">Credenciales incorrectas.</span>';

                    if (userLoggedInSpan) {
                        userLoggedInSpan.textContent = '-no login-';
                    }

                    //Limpiamos cualquier sesión previa si fallase el logueo
                    localStorage.removeItem('usuarioLogueado');
                }
            }
        })
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
