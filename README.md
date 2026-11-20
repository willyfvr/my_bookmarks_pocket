# 🔖 Bookmark's Pocket

**Bookmark's Pocket** es un gestor de marcadores y biblioteca de investigación liviana, inspirada en Pocket y construida con tecnologías web nativas (**HTML, CSS y JavaScript puro**, sin frameworks ni dependencias externas).

Permite guardar enlaces de LinkedIn, repositorios de GitHub, videos de YouTube y artículos web con extractos de texto, etiquetas personalizadas (`#labels`), detección automática de plataforma y notas de investigación con guardado automático.

Funciona en **dos modos**:
1. **Como aplicación web:** Se puede abrir en cualquier navegador o desplegar gratis en GitHub Pages / Netlify.
2. **Como extensión de Chrome (Manifest V3):** Permite guardar páginas o enlaces con clic derecho desde cualquier pestaña.

---

## 📁 Estructura del Proyecto

Si recién entrás al código, acá tenés qué hace cada archivo:

```text
my_bookmarks_pocket/
├── manifest.json       # Configuración de la extensión para Chrome (permisos, íconos, nombre)
├── background.js       # Script en segundo plano para el menú contextual (clic derecho -> Guardar)
├── index.html          # Estructura principal de la interfaz, modal para guardar y panel de lectura
├── style.css           # Estilos, variables CSS de colores y modo claro/oscuro
├── docker-compose.yml  # Configuración de Docker para levantar el entorno local sin instalar nada
├── .dockerignore       # Archivos que Docker ignora al montar el proyecto
├── README.md           # Esta guía
└── js/
    ├── data.js         # Maneja el guardado de datos (Chrome Storage o LocalStorage) y detecta la web
    ├── ui.js           # Dibuja las tarjetas, filtros y el panel de lectura en pantalla
    └── app.js          # Conecta los botones, el buscador y la lógica general de la aplicación