//GESTIÓN DE USUARIOS (LocalStorage)

export function obtenerUsuarios() {
    const usuariosJSON = localStorage.getItem('usuarios');
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

export function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

export function altaUsuario(nombre, email, password) {
    const usuarios = obtenerUsuarios();

    //Comprobamos si existe el email
    const existe = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (existe) {
        return { exito: false, mensaje: "El email ya está registrado"};
    }

    const nuevoUsuario = {
        id: Date.now(), //Utilizamos la fecha actual para generar un ID único
        nombre: nombre,
        email: email,
        password: password
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    return { exito: true, mensaje: "Usuario registrado correctamente"};
}

export function borrarUsuario(id) {
    let usuarios = obtenerUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuarios);
}

//-----------------------------------------------------------------------------------
//GESTIÓN DE SESIÓN (login)

export function loguearUsuario(email, password) {
    const usuarios = obtenerUsuarios();

    //Busca al usuario que coincida con el email y contraseña
    const usuarioEncontrado = usuarios.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
        //Guardamos al usuario en el LocalStorage
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));

        return { exito: true, usuario: usuarioEncontrado};
    } else {
        return { exito: false, mensaje: "Credenciales incorrectas"};
    }
}

export function obtenerUsuarioActivo() {
    const usuarioJSON = localStorage.getItem('usuarioLogueado');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

export function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
}
//------------------------------------------------------------------------------------------------
//MÓDULO DE ALMACENAJE (IndexedDB - Intercambios)

const DB_NAME = "StackSolverDB";
const DB_VERSION = 4;
const STORE_NAME = "intercambios";

//1. Función para conectar con la base de datos
export function abrirDB() {
    return new Promise((resolve, reject) => {
        
        //Abrimos la base de datos
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        //Si la base de datos es nueva o cambia de version, creamos el "almacen"/tabla
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });
            }

            if (!db.objectStoreNames.contains("selecciones")) {
                db.createObjectStore("selecciones", {
                    keyPath: ["usuario", "intercambioId"]
                });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Error al abrir IndexedDB " + event.target.errorCode);
        };
    });
}

//2. Guardar un intercambio nuevo
export async function guardarIntercambio(intercambio) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {

        //Abrimos una transacción de escritura
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        //Añadimos el intercambio
        const request = store.add(intercambio);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject("Error al guardar el intercambio");
    });
}

//3.Obtener todos los intercambios
export async function obtenerIntercambios() {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll(); //Obtenemos todos los registros de intercambios

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error al obtener los intercambios");
    });
    
}

//4.Borrar intercambios por su ID
export async function borrarIntercambio(id) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject("Error al borrar el intercambio");
    });
    
}

export async function obtenerSeleccion(usuario) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("selecciones", "readonly");
        const peticion = transaccion.objectStore("selecciones").getAll();

        peticion.onsuccess = () => {
            const ids = peticion.result
                .filter((registro) => registro.usuario === usuario)
                .map((registro) => registro.intercambioId);

            resolve(ids);
        };

        peticion.onerror = () => reject(peticion.error);
    });
}

export async function guardarSeleccion(usuario, intercambioId) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("selecciones", "readwrite");
        transaccion.oncomplete = () => resolve();
        transaccion.onabort = () => reject(transaccion.error);

        transaccion.objectStore("selecciones").put({ usuario, intercambioId });
    });
}

export async function quitarDeSeleccion(usuario, intercambioId) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("selecciones", "readwrite");
        transaccion.oncomplete = () => resolve();
        transaccion.onabort = () => reject(transaccion.error);

        transaccion.objectStore("selecciones").delete([usuario, intercambioId]);
    });
}