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
```

---

## 🐳 Cómo levantar el proyecto con Docker (Recomendado para desarrollar)

Usar Docker te permite correr la interfaz en un servidor web local (`http://localhost:8080`) sin tener que instalar servidores ni configurar herramientas en tu computadora.

### 1. Requisitos previos
* Tener instalado **Docker Desktop** (y que esté abierto y corriendo).
* Tener **Git** para clonar el repositorio.

### 2. Pasos para arrancar desde cero

1. **Cloná el repositorio y entrá a la carpeta:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd my_bookmarks_pocket
   ```

2. **Levantá el contenedor de Docker:**
   ```bash
   docker compose up -d
   ```
   *¿Qué hace este comando?* Descarga una imagen liviana de Nginx (un servidor web), monta los archivos de esta carpeta adentro y deja el servidor andando en segundo plano (`-d`).

3. **Abrí la aplicación en tu navegador:**
   Entrá a: **[http://localhost:8080](http://localhost:8080)**

4. **Editá el código y probá cambios:**
   No hace falta reiniciar Docker cada vez que tocás un archivo. Guardá tus cambios en `index.html`, `style.css` o en la carpeta `js/` y simplemente **recargá la página (`F5`)** en el navegador.

### 3. Comandos útiles de Docker para el día a día

* **Ver si el contenedor está corriendo:**
  ```bash
  docker compose ps
  ```
* **Ver los registros (logs) del servidor si algo falla:**
  ```bash
  docker compose logs -f web
  ```
* **Apagar el proyecto cuando termines de trabajar:**
  ```bash
  docker compose down
  ```
  *(Esto detiene y elimina el contenedor para liberar recursos, pero **no borra** ninguno de tus archivos ni cambios).*

---

## 🧩 Cómo probarlo como Extensión de Chrome

> **Nota importante:** Cuando abrís la app en `http://localhost:8080` con Docker, funciona en **modo web** (guarda los datos en el `localStorage` del navegador). Las funciones exclusivas de extensión (como el clic derecho en otras pestañas) solo funcionan cargando el proyecto en Chrome.

Para probarlo en modo extensión:
1. Abrí Google Chrome y entrá a `chrome://extensions/`.
2. Activá el **Modo de desarrollador** (arriba a la derecha).
3. Hacé clic en **Cargar descomprimida** (arriba a la izquierda).
4. Seleccioná la carpeta raíz `my_bookmarks_pocket/`.
5. Cada vez que modifiques código en `js/`, `index.html` o `style.css`, hacé clic en el ícono de **recargar (↻)** dentro de la tarjeta de la extensión en `chrome://extensions/`.

---

## 🛠️ Guía rápida: ¿Dónde tocar cada cosa?

| Si querés... | Tenés que editar... |
| :--- | :--- |
| Cambiar colores, tipografías o tamaños | `style.css` |
| Agregar reconocimiento de nuevas páginas web | `js/data.js` (`detectSource`) y `js/ui.js` (`SOURCE_ICONS`) |
| Cambiar cómo se ven las tarjetas o el lector | `js/ui.js` e `index.html` |
| Cambiar filtros, buscador o eventos de botones | `js/app.js` |

---

## 🤝 Cómo colaborar

1. Asegurate de estar en la rama principal actualizada (`git checkout main && git pull`).
2. Creá una rama nueva para tu tarea:
   ```bash
   git checkout -b feature/nombre-de-tu-mejora
   ```
3. Probá tus cambios tanto en `http://localhost:8080` (con Docker) como en `chrome://extensions/`.
4. Hacé commit de tus cambios, subí tu rama y abrí un **Pull Request**.