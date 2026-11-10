import {
    loguearUsuario as autenticarUsuario,
    obtenerUsuarioActivo,
    cerrarSesion
} from "./almacenaje.js";

function mostrarUsuarioActivo() {
    const indicador = document.getElementById("usuarioActivo");
    const usuario = obtenerUsuarioActivo();

    indicador.textContent = usuario?.nombre ?? "-no login-";
}

function loguearUsuario(email, password) {
    const resultado = autenticarUsuario(email, password);
    const mensaje = document.getElementById("mensaje");

    if (!resultado.exito) {
        cerrarSesion();
        mostrarUsuarioActivo();

        mensaje.className = "mt-3 text-center text-danger fw-bold";
        mensaje.textContent = resultado.mensaje;
        alert(resultado.mensaje);
        return;
    }

    mostrarUsuarioActivo();
    alert(`Inicio de sesión exitoso. Bienvenido/a ${resultado.usuario.nombre}`);
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("loginForm");

    mostrarUsuarioActivo();

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        loguearUsuario(email, password);
    });
});