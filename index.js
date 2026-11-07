import { usuarios, intercambios } from './datos.js';

const listado = document.querySelector("#listado-dashboard");

intercambios.forEach((intercambio) => {
    const esOferta = intercambio.tipo === "oferta";

    const tarjeta = document.createElement("article");
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

    const idioma = document.createElement("p");
    idioma.textContent = `Idioma: ${intercambio.idioma}`;

    const descripcion = document.createElement("p");
    descripcion.className = "tarjeta-descripcion";
    descripcion.textContent = intercambio.descripcion.length > 120
        ? `${intercambio.descripcion.slice(0, 120)}…`
        : intercambio.descripcion;

    const autor = usuarios.find((usuario) => {
        return usuario.id === intercambio.usuarioId;
    });

    const pie = document.createElement("div");
    pie.className = "tarjeta-footer";
    pie.textContent = `Publicado por: ${autor ? autor.nombre : "Usuario no disponible"}`;

    contenido.append(tipo, titulo, idioma, descripcion);
    tarjeta.append(contenido, pie);
    listado.append(tarjeta);
});
