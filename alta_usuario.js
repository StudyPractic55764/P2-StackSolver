import { altaUsuario, borrarUsuario, obtenerUsuarioActivo, cerrarSesion, obtenerUsuarios } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {

    const listadoUsuarios = document.getElementById("listado-usuarios");
    const formulario = document.getElementById("form-usuario");
    
    
    if (!listadoUsuarios) {
        console.error("No se encontró el elemento con id 'listado-usuarios'");
        return;
    }


    //PRINTAMOS TODOS LOS USUARIOS REGISTRADOS

    function printarUsuarios() {
        if (!listadoUsuarios) return;

        listadoUsuarios.innerHTML = ''; //Limpiamos el contenedor para obtener los usuarios de localStorage
        const usuarios = obtenerUsuarios();

        if (usuarios.length === 0) {
            listadoUsuarios.innerHTML = `
                <div class="col-12">    
                    <p>No hay usuarios registrados.</p>
                </div>
            `;
            return;
        }

        usuarios.forEach(usuario => {
            listadoUsuarios.innerHTML += `
                <div class="col-12">
                    <div class="tarjeta-usuario p-3 border rounded bg-light d-flex justify-content-between align-items-center">
                        <div class="info-usuario">
                            <strong>Nombre:</strong> ${usuario.nombre}<br>
                            <strong>Email:</strong> ${usuario.email}
                        </div>
                        <button class="btn btn-danger btn-sm btn-baja" data-id="${usuario.id}"> Dar de baja </button>
                    </div>
                </div>
            `;
        });
    }

    //Printamos los usuarios al cargar la página
    printarUsuarios();
    
    
    
   

    //EVENTO PARA AÑADIR NUEVOS USUARIOS

    if(formulario) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            const resultado = altaUsuario(nombre, email, password);

            if (resultado.exito) {
                formulario.reset();
                printarUsuarios();
                alert("Usuario registrado correctamente");
            } else {
                alert(resultado.mensaje);
            }
        });
    } else {
        console.log("No se encontró el forumlario con id 'form-usuario'");
    }
    

    //EVENTO PARA DAR DE BAJA
    if (listadoUsuarios) {
        listadoUsuarios.addEventListener("click", (evento) => {
            if (evento.target.classList.contains("btn-baja")) {
                const idUsuario = parseInt(evento.target.dataset.id);

                if (confirm("¡Estás seguro de que desea dar de baja a este usuario?")) {

                    //Comprobamos si el usuario que vamos a borrar es el que está logueado
                    const usuarioActivo = obtenerUsuarioActivo();
                    if (usuarioActivo && usuarioActivo.id === idUsuario) {
                        cerrarSesion();
                        alert ("Has dado de baja tu propia cuenta. Se cerrará la sesión.");
                        window.location.href = 'login.html';
                        return;
                    }

                    borrarUsuario(idUsuario);
                    printarUsuarios();
                }
            }
        });
    }
});