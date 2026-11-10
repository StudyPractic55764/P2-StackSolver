import { obtenerIntercambios, obtenerUsuarios, obtenerUsuarioActivo} from './almacenaje.js';

document.addEventListener('DOMContentLoaded', async () => {
    //Actualizamos el nombre en la barra superior
    const usuarioActivo = obtenerUsuarioActivo();
    const spanUsuario = document.getElementById('userLoggedIn');
    if (usuarioActivo && spanUsuario) {
        spanUsuario.textContent = usuarioActivo.nombre;
    }
    
    
    const listado = document.querySelector("#listado-dashboard");
    if (!listado) return;

    //1.Obtenemos los datos almacenados en arrays
    let intercambios = [];
    let usuarios = [];

    try {
        intercambios = await obtenerIntercambios();
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

    const autor = usuarios.find(u => u.id === intercambio.usuarioId);

    const pie = document.createElement("div");
    pie.className = "tarjeta-footer";
    pie.textContent = `Publicado por: ${autor ? autor.nombre : "Usuario no disponible"}`;

    contenido.append(tipo, titulo, idioma, descripcion);
    tarjeta.append(contenido, pie);
    listado.append(tarjeta);
    });

});

