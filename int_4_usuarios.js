import { altaUsuario, borrarUsuario, obtenerUsuarioActivo, cerrarSesion, obtenerUsuarios } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
    //Actualizamos el nombre en la barra superior
    const usuarioActivo = obtenerUsuarioActivo();
    const spanUsuario = document.getElementById('usuarioActivo');
    if (usuarioActivo && spanUsuario) {
        spanUsuario.textContent = usuarioActivo.nombre;
    }

    const listadoUsuarios = document.getElementById("listado-usuarios");
    const formulario = document.getElementById("form-usuario");
    
    
    if (!listadoUsuarios) {
        console.error("No se encontró el elemento con id 'listado-usuarios'");
        return;
    }


    //PRINTAMOS TODOS LOS USUARIOS REGISTRADOS

    function printarUsuarios() {    
        const usuarios = obtenerUsuarios();
        listadoUsuarios.replaceChildren();

        if (usuarios.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 4;
            celda.textContent = "No hay usuarios registrados.";
            fila.append(celda);
            listadoUsuarios.append(fila);
            return;
        }

        usuarios.forEach((usuario) => {
            const fila = document.createElement("tr");
            const valores = [usuario.nombre, usuario.email, "••••••"];

            valores.forEach((valor) => {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.append(celda);
            });

            const acciones = document.createElement("td");
            const boton = document.createElement("button");

            boton.type = "button";
            boton.className = "btn btn-danger btn-sm btn-baja";
            boton.dataset.id = usuario.id;
            boton.textContent = "Dar de baja";

            acciones.append(boton);
            fila.append(acciones);
            listadoUsuarios.append(fila);
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
                    borrarUsuario(idUsuario);
                    //Comprobamos si el usuario que vamos a borrar es el que está logueado
                    const usuarioActivo = obtenerUsuarioActivo();
                    if (usuarioActivo && usuarioActivo.id === idUsuario) {
                        cerrarSesion();
                        alert ("Has dado de baja tu propia cuenta. Se cerrará la sesión.");
                        window.location.href = 'login.html';
                        return;
                    }

                    printarUsuarios();
                }
            }
        });
    }
});