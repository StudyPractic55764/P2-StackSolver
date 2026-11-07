import { usuarios } from "./datos.js";

document.addEventListener("DOMContentLoaded", function() {

    const listadoUsuarios = document.getElementById("listado-usuarios");
    const formulario = document.getElementById("form-usuario");
    
    
    if (!listadoUsuarios) {
        console.error("No se encontró el elemento con id 'listado-usuarios'");
        return;
    }


    //PRINTAMOS TODOS LOS USUARIOS REGISTRADOS

    function printarUsuarios(lista) {
        listadoUsuarios.innerHTML = "";

        if (lista.length === 0) {
            listadoUsuarios.innerHTML = `
                <div class="col-12">    
                    <p>No hay usuarios registrados.</p>
                </div>
            `;
            return;
        }

        lista.forEach(usuario => {
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

    printarUsuarios(usuarios);
    
    
    listadoUsuarios.addEventListener("click", function(evento) {
        if (evento.target.classList.contains("btn-baja")) {

            const idUsuario = parseInt(evento.target.dataset.id);
            const confirmar = confirm("¿Está seguro que desea dar de baja al usuario?");

            if (confirmar) {

                const indice = usuarios.findIndex(u => u.id === idUsuario);

                if (indice !== -1) {
                    usuarios.splice(indice, 1);
                    printarUsuarios(usuarios);
                }
            }
        }
    });
   

    //FUNCIONES PARA AÑADIR NUEVOS USUARIOS

    if(formulario) {
        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            const emailExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());

            if (emailExiste) {
                alert("ERROR: Ya existe un usuario con ese email");
                return;
            }

            const nuevoID = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

            const nuevoUsuario = {
                id: nuevoID,
                nombre: nombre,
                email: email,
                password: password
            };

            usuarios.push(nuevoUsuario);

            printarUsuarios(usuarios);
            formulario.reset();

            alert(`Usuario ${nombre} registrado con éxito!`);
        });
    } else {
        console.error("No se encontró el formulario con id 'form-usuario'");   
    };
});