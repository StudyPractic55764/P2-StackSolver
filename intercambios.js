import { guardarIntercambio, obtenerIntercambios, borrarIntercambio } from "./almacenaje.js";

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector("#form-intercambio");
    const listado = document.querySelector("#listado-intercambios");

    //FUNCIÓN PARA PRINTAR LOS INTERCAMBIOS
    async function mostrarIntercambios() {
        if (!listado) return;

        listado.innerHTML = '<p class="text-muted">Cargando intercambios...</p>';

        try {
            //Obtenemos los datos de IndexedDB
            const intercambios = await obtenerIntercambios();
            listado.innerHTML = ''; //Limpiamos el mensaje de "cargando..."

            if (intercambios.length === 0) {
                listado.innerHTML = '<p class="col-12 text-muted">Todavía no hay intercambios publicados.</p>';
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

                botonEliminar.addEventListener("click", async () => {
                    if (confirm(`¿Quieres eliminar el intercambio "${intercambio.titulo}"?`)) {
                        await borrarIntercambio(intercambio.id);
                        mostrarIntercambios();
                    }
                });

                cuerpo.append(etiqueta, titulo, idioma, descripcion, botonEliminar);
                tarjeta.append(cuerpo);
                columna.append(tarjeta);
                listado.append(columna);
            });

        } catch (error) {
            console.log("Error al cargar los intercambios:", error);
            listado.innerHTML = '<p class="text-danger">Error al cargar los datos</p>';
        }
    }
    
    //Printamos los intercambios al cargar la página
    mostrarIntercambios();

    //EVENTO PARA GUARDAR UN NUEVO INTERCAMBIO
    if (formulario) {
        formulario.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const tipo = formulario.elements.namedItem("tipo").value;
            const titulo = formulario.elements.namedItem("titulo").value.trim();
            const idioma = formulario.elements.namedItem("idioma").value.trim();
            const descripcion = formulario.elements.namedItem("descripcion").value.trim();

            if (!titulo || !idioma || !descripcion) {
                alert("Completa los campos con texto, no solo con espacios.");
                return;
            }

            const nuevoIntercambio = {
                tipo: tipo,
                titulo: titulo,
                idioma: idioma,
                descripcion: descripcion,
                usuarioId: 1 //De momento asignaremos un ID fijo
            };

            try {
                await guardarIntercambio(nuevoIntercambio);
                formulario.reset();
                mostrarIntercambios();
                alert("Intercambio publicado con éxito.");
            } catch (error) {
                console.log("Error al guardar:", error);
                alert("Hubo un error al guardar el intercambio.");
            }
        });
    }
});