import { intercambios } from "./datos.js";
import { usuarios } from './datos.js';

const listado = document.querySelector("#listado-intercambios");

function mostrarIntercambios() {
    listado.replaceChildren();

    if (intercambios.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "col-12 text-muted";
        mensaje.textContent = "Todavía no hay intercambios publicados.";

        listado.append(mensaje);
        return;
    }

    intercambios.forEach((intercambio) => {
        const esOferta = intercambio.tipo === "oferta";

        const columna = document.createElement("div");
        columna.className = "col-12 col-md-6";

        const tarjeta = document.createElement("article");
        tarjeta.className = esOferta
            ? "card h-100 border-success"
            : "card h-100 border-primary";

        const cuerpo = document.createElement("div");
        cuerpo.className = "card-body";

        const etiqueta = document.createElement("span");
        etiqueta.className = esOferta
            ? "badge text-bg-success mb-2"
            : "badge text-bg-primary mb-2";
        etiqueta.textContent = esOferta ? "Oferta" : "Petición";

        const titulo = document.createElement("h3");
        titulo.className = "h5";
        titulo.textContent = intercambio.titulo;

        const idioma = document.createElement("p");
        idioma.className = "fw-bold";
        idioma.textContent = `Idioma: ${intercambio.idioma}`;

        const descripcion = document.createElement("p");
        descripcion.className = "card-text";
        descripcion.textContent = intercambio.descripcion;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-outline-danger";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            const confirmar = confirm(
                `¿Quieres eliminar el intercambio "${intercambio.titulo}"?`
            );

            if (!confirmar) {
                return;
            }

            const posicion = intercambios.findIndex((elemento) => {
                return elemento.id === intercambio.id;
            });

            if (posicion !== -1) {
                intercambios.splice(posicion, 1);
                mostrarIntercambios();
            }
        });

        cuerpo.append(etiqueta, titulo, idioma, descripcion, botonEliminar);
        tarjeta.append(cuerpo);
        columna.append(tarjeta);
        listado.append(columna);
    });
}

mostrarIntercambios();

const formulario = document.querySelector("#form-intercambio");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const tipo = formulario.elements.namedItem("tipo").value;
    const titulo = formulario.elements.namedItem("titulo").value.trim();
    const idioma = formulario.elements.namedItem("idioma").value.trim();
    const descripcion = formulario.elements.namedItem("descripcion").value.trim();

    if (!titulo || !idioma || !descripcion) {
        alert("Completa los campos con texto, no solo con espacios.");
        return;
    }

    const nuevoId = intercambios.reduce((maximo, intercambio) => {
        return Math.max(maximo, intercambio.id);
    }, 0) + 1;

    const nuevoIntercambio = {
        id: nuevoId,
        tipo: tipo,
        titulo: titulo,
        idioma: idioma,
        descripcion: descripcion,
        usuarioId: 1
    };

    intercambios.push(nuevoIntercambio);

    mostrarIntercambios();
    formulario.reset();
});