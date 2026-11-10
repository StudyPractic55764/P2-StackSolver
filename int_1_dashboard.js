import {
    obtenerIntercambios,
    obtenerUsuarios,
    obtenerUsuarioActivo,
    obtenerSeleccion,
    guardarSeleccion,
    quitarDeSeleccion
} from "./almacenaje.js";

document.addEventListener('DOMContentLoaded', async () => {
    //Actualizamos el nombre en la barra superior
    const usuarioActivo = obtenerUsuarioActivo();
    const claveSeleccion = usuarioActivo?.email.toLowerCase() ?? "invitado";
    const spanUsuario = document.getElementById('usuarioActivo');
    if (usuarioActivo && spanUsuario) {
        spanUsuario.textContent = usuarioActivo.nombre;
    }
    
    
    const listado = document.querySelector("#listado-dashboard");
    if (!listado) return;

    const seleccion = document.getElementById("seleccion-intercambios");

    seleccion.addEventListener("dragover", (evento) => {
        evento.preventDefault();
    });

    seleccion.addEventListener("drop", async (evento) => {
        evento.preventDefault();

        const idTarjeta = evento.dataTransfer.getData("text/plain");
        const tarjeta = document.getElementById(idTarjeta);

        if (!tarjeta || tarjeta.parentElement !== listado) return;

        const intercambioId = Number(tarjeta.dataset.intercambioId);

        try {
            await guardarSeleccion(claveSeleccion, intercambioId);
            seleccion.append(tarjeta);
        } catch (error) {
            console.error("Error al guardar la selección:", error);
            alert("No se ha podido guardar la selección.");
        }
    });

    listado.addEventListener("dragover", (evento) => {
    evento.preventDefault();
    });

    listado.addEventListener("drop", async (evento) => {
        evento.preventDefault();

        const idTarjeta = evento.dataTransfer.getData("text/plain");
        const tarjeta = document.getElementById(idTarjeta);

        if (!tarjeta || tarjeta.parentElement !== seleccion) return;

        const intercambioId = Number(tarjeta.dataset.intercambioId);

        try {
            await quitarDeSeleccion(claveSeleccion, intercambioId);
            listado.append(tarjeta);
        } catch (error) {
            console.error("Error al quitar la selección:", error);
            alert("No se ha podido devolver la tarjeta al listado.");
        }
    });

    //1.Obtenemos los datos almacenados en arrays
    let intercambios = [];
    let usuarios = [];
    let idsSeleccionados = [];

    try {
        intercambios = await obtenerIntercambios();
        idsSeleccionados = await obtenerSeleccion(claveSeleccion);
        usuarios = await obtenerUsuarios();
    } catch (error) {
        console.log("Error al cargar datos de la base de datos.");
    }

    //2.Si no hay intercambios se muestra un mensaje
    if (!intercambios || intercambios.length === 0) {
        listado.innerHTML = '<p class="text-center text-muted mt-4">No hay intercambios disponibles.</p>';
        return;
    }

    //3.Si hay intercambios se muestran las tarjetas en el dashboard

    intercambios.forEach((intercambio) => {
    const esOferta = intercambio.tipo === "oferta";

    const tarjeta = document.createElement("article");
    tarjeta.id = `intercambio-${intercambio.id}`;
    tarjeta.dataset.intercambioId = intercambio.id;
    tarjeta.draggable = true;

    tarjeta.addEventListener("dragstart", (evento) => {
        evento.dataTransfer.setData("text/plain", tarjeta.id);
    });
    tarjeta.className = esOferta
        ? "tarjeta tarjeta-verde"
        : "tarjeta tarjeta-azul";

    const contenido = document.createElement("div");
    contenido.className = "tarjeta-contenido";

    const tipo = document.createElement("p");
    tipo.className = "fw-bold";
    tipo.textContent = esOferta ? "Oferta" : "Petición";

    const titulo = document.createElement("h2");
    titulo.className = "h5";
    titulo.textContent = intercambio.titulo;

    const fecha = document.createElement("p");
    fecha.textContent = intercambio.fecha
        ? `Fecha: ${intercambio.fecha}`
        : "Fecha no indicada";

    const descripcion = document.createElement("p");
    descripcion.className = "tarjeta-descripcion";
    descripcion.textContent = intercambio.descripcion.length > 120
        ? `${intercambio.descripcion.slice(0, 120)}…`
        : intercambio.descripcion;

    const autor = usuarios.find(u => u.id === intercambio.usuarioId);

    const pie = document.createElement("div");
    pie.className = "tarjeta-footer";
    pie.textContent = `Publicado por: ${autor ? autor.nombre : "Usuario no disponible"}`;

    contenido.append(tipo, titulo, fecha, descripcion);
    tarjeta.append(contenido, pie);
    if (idsSeleccionados.includes(intercambio.id)) {
        seleccion.append(tarjeta);
    } else {
        listado.append(tarjeta);
    }
    });

});

