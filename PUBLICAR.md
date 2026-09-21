# Versión para publicar

Los archivos `index.html`, `app.js`, `sound.js`, `sound-view.js`, `parcels.js`, `parcel-geometry.js` y `style.css` siguen siendo los originales editables. Se puede abrir el sitio local como antes.

La carpeta **publicar** contiene la versión compactada para subir al alojamiento. Publicar sólo su contenido, no toda la carpeta del proyecto. El ZIP `mapa-de-sombras-publicar.zip` preparado por Codex contiene únicamente esos archivos, con el `index.html` en la raíz.

Después de editar el proyecto, generar la versión nueva desde una terminal en esta carpeta:

```sh
npm ci
npm run build
```

`npm ci` instala la herramienta de desarrollo y sólo hace falta al preparar el proyecto o actualizar sus dependencias. La web publicada no necesita Node.js ni npm.

La compilación reúne y compacta JavaScript, abrevia nombres internos, elimina comentarios ordinarios, compacta CSS y usa nombres de archivo con una huella del contenido para evitar versiones viejas en caché. No incluye mapas de código fuente, documentación interna, archivos de Git ni herramientas de desarrollo. Conserva los avisos legales y el texto visible de la página. No bloquea F12, clic derecho, teclado, zoom ni gestos táctiles.

Esto dificulta la lectura del código; no lo vuelve secreto. El navegador sigue recibiendo el programa y los datos necesarios para ejecutarlo.

## Si publicás con GitHub Pages

No alcanza con generar esta carpeta si Pages sigue sirviendo la raíz del repositorio con los originales. Pages debe publicar el contenido generado, mediante una configuración de despliegue o un repositorio/rama dedicado a esos archivos. Esta tarea no cambia la configuración remota ni publica automáticamente.

Si el repositorio de los originales es público, esos originales se pueden leer igualmente en GitHub. Para restringir su acceso hay que mantenerlos en un repositorio privado y publicar únicamente el resultado. Los permisos y el historial del repositorio no fueron modificados.

Herramienta de compactación: [esbuild](https://esbuild.github.io/api/#minify). Se fija su versión en package-lock.json.
