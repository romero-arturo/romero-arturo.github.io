const CLAVE_API = '8Ts8Qib5TwEN1SiAp4hLTh2tcZ0WUjEOrehD0q8k';
const URL_BASE = 'https://api.nasa.gov/planetary/apod';

// Elementos del DOM
const elementos = {
    selectorFecha: document.getElementById('date-picker'),
    botonHoy: document.getElementById('today-btn'),
    cargando: document.getElementById('loading'),
    contenido: document.getElementById('content'),
    contenedorMultimedia: document.getElementById('media-container'),
    titulo: document.getElementById('title'),
    fecha: document.getElementById('date'),
    explicacion: document.getElementById('explanation')
};

// Inicializar la aplicación
function iniciar() {
    const fechaActual = new Date().toISOString().split('T')[0];
    
    // Configurar el selector de fecha
    elementos.selectorFecha.max = fechaActual;
    elementos.selectorFecha.value = fechaActual;
    
    // Eventos
    elementos.selectorFecha.addEventListener('change', manejarCambioFecha);
    elementos.botonHoy.addEventListener('click', manejarClickHoy);
    
    // Cargar datos iniciales
    obtenerAPOD(fechaActual);
}

// Manejar cambio de fecha
function manejarCambioFecha(evento) {
    obtenerAPOD(evento.target.value);
}

// Manejar click en "Ver hoy"
function manejarClickHoy() {
    const fechaActual = new Date().toISOString().split('T')[0];
    elementos.selectorFecha.value = fechaActual;
    obtenerAPOD(fechaActual);
}

// Obtener datos de la API de la NASA
async function obtenerAPOD(fecha) {
    try {
        mostrarCarga(true);
        
        const respuesta = await fetch(`${URL_BASE}?api_key=${CLAVE_API}&date=${fecha}`);
        
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        
        const datos = await respuesta.json();
        mostrarDatos(datos);
        
    } catch (error) {
        mostrarError(error);
    } finally {
        mostrarCarga(false);
    }
}

// Mostrar los datos en la interfaz
function mostrarDatos(datos) {
    elementos.contenedorMultimedia.innerHTML = '';
    
    // Mostrar imagen o video
    if (datos.media_type === 'image') {
        const imagen = document.createElement('img');
        imagen.src = datos.url;
        imagen.alt = datos.title;
        imagen.classList.add('apod-media');
        elementos.contenedorMultimedia.appendChild(imagen);
    } else if (datos.media_type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = datos.url;
        iframe.classList.add('apod-media');
        iframe.setAttribute('allowfullscreen', '');
        elementos.contenedorMultimedia.appendChild(iframe);
    }
    
    // Mostrar información
    elementos.titulo.textContent = datos.title || 'Sin título';
    elementos.fecha.textContent = formatearFecha(datos.date);
    elementos.explicacion.textContent = datos.explanation || 'No hay descripción disponible.';
}

// Mostrar estado de carga
function mostrarCarga(mostrar) {
    elementos.cargando.style.display = mostrar ? 'block' : 'none';
    elementos.contenido.style.display = mostrar ? 'none' : 'block';
}

// Mostrar mensaje de error
function mostrarError(error) {
    let mensaje = error.message;
    
    if (error.message.includes("404")) {
        mensaje = "No hay datos disponibles para esta fecha. Intenta con una fecha entre el 16/06/1995 y hoy.";
    }
    
    elementos.contenido.innerHTML = `
        <div class="error">
            <p>¡Error al cargar los datos!</p>
            <p>${mensaje}</p>
            <button onclick="window.location.reload()">Reintentar</button>
        </div>
    `;
}

// Formatear fecha en español
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', iniciar);
