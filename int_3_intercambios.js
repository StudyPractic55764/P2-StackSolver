import { guardarIntercambio, obtenerIntercambios, borrarIntercambio, obtenerUsuarioActivo } from "./almacenaje.js";

document.addEventListener('DOMContentLoaded', () => {
    //Actualizamos el nombre en la barra superior
    const usuarioActivo = obtenerUsuarioActivo();
    const spanUsuario = document.getElementById('usuarioActivo');
    if (usuarioActivo && spanUsuario) {
        spanUsuario.textContent = usuarioActivo.nombre;
    }


    const formulario = document.querySelector("#form-intercambio");
    const listado = document.querySelector("#listado-intercambios");

    // FUNCIÓN PARA MOSTRAR EL GRÁFICO
    function dibujarGrafico(intercambios) {
        const canvas = document.querySelector("#grafico-intercambios");
        const resumen = document.querySelector("#resumen-grafico");

        const ofertas = intercambios.filter((item) => item.tipo === "oferta").length;
        const peticiones = intercambios.filter((item) => item.tipo === "peticion").length;

        resumen.textContent = `Ofertas: ${ofertas}. Peticiones: ${peticiones}.`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px sans-serif";
        ctx.textBaseline = "middle";

        const maximo = Math.max(ofertas, peticiones, 1);
        const anchoDisponible = canvas.width - 170;

        function dibujarBarra(etiqueta, cantidad, color, y) {
            const ancho = (cantidad / maximo) * anchoDisponible;

            ctx.fillStyle = "#212529";
            ctx.fillText(etiqueta, 10, y + 12);

            ctx.fillStyle = color;
            ctx.fillRect(105, y, ancho, 24);

            ctx.fillStyle = "#212529";
            ctx.fillText(String(cantidad), 113 + ancho, y + 12);
        }

        dibujarBarra("Ofertas", ofertas, "#198754", 30);
        dibujarBarra("Peticiones", peticiones, "#0d6efd", 85);
    }

    //FUNCIÓN PARA PRINTAR LOS INTERCAMBIOS
    function mostrarMensajeTabla(texto) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 6;
        celda.textContent = texto;
        fila.append(celda);
        listado.replaceChildren(fila);
    }

    async function mostrarIntercambios() {
        if (!listado) return;

        mostrarMensajeTabla("Cargando intercambios...");

        try {
            const intercambios = await obtenerIntercambios();
            dibujarGrafico(intercambios);

            if (intercambios.length === 0) {
                mostrarMensajeTabla("Todavía no hay intercambios publicados.");
                return;
            }

            listado.replaceChildren();

            intercambios.forEach((intercambio) => {
                const fila = document.createElement("tr");

                const valores = [
                    intercambio.titulo,
                    intercambio.email || "—",
                    intercambio.fecha || "—",
                    intercambio.descripcion,
                    intercambio.tipo === "oferta" ? "Ofrezco idioma" : "Busco idioma"
                ];

                valores.forEach((valor) => {
                    const celda = document.createElement("td");
                    celda.textContent = valor;
                    fila.append(celda);
                });

                const acciones = document.createElement("td");
                const botonEliminar = document.createElement("button");
                botonEliminar.type = "button";
                botonEliminar.className = "btn btn-outline-danger btn-sm";
                botonEliminar.textContent = "Eliminar";

                botonEliminar.addEventListener("click", async () => {
                    if (!confirm(`¿Quieres eliminar "${intercambio.titulo}"?`)) return;

                    try {
                        await borrarIntercambio(intercambio.id);
                        await mostrarIntercambios();
                    } catch (error) {
                        console.error("Error al eliminar el intercambio:", error);
                        alert("No se ha podido eliminar el intercambio.");
                    }
                });

                acciones.append(botonEliminar);
                fila.append(acciones);
                listado.append(fila);
            });
        } catch (error) {
            console.error("Error al cargar los intercambios:", error);
            mostrarMensajeTabla("No se han podido cargar los intercambios.");
        }
    }
    
    //Printamos los intercambios al cargar la página
    mostrarIntercambios();

    //EVENTO PARA GUARDAR UN NUEVO INTERCAMBIO
    if (formulario) {
        formulario.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const tipo = formulario.elements.namedItem("tipo").value;
            const email = formulario.elements.namedItem("email").value.trim();
            const fecha = formulario.elements.namedItem("fecha").value;
            const titulo = formulario.elements.namedItem("titulo").value.trim();
            const descripcion = formulario.elements.namedItem("descripcion").value.trim();

            if (!titulo || !descripcion) {
                alert("Completa los campos con texto, no solo con espacios.");
                return;
            }

            const usuarioActivo = obtenerUsuarioActivo();
            const idAutor = usuarioActivo ? usuarioActivo.id : 1;

            const nuevoIntercambio = {
                tipo: tipo,
                email: email,
                fecha: fecha,
                titulo: titulo,
                descripcion: descripcion,
                usuarioId: idAutor
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