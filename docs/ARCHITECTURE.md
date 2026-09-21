# Arquitectura y diagnóstico

## Punto de partida

Aplicación estática: `index.html`, `style.css`, cinco scripts clásicos y dos imágenes usadas en producción. Los otros PNG son referencias aportadas. `parcels.js` contiene contornos trazados en píxeles, no un levantamiento georreferenciado. `publicar/` es una salida regenerable de esbuild. No había Three.js, WebGL, modelos 3D ni servidor.

El render Canvas 2D aplica giro, inclinación y escala a coordenadas en metros, ordena caras por profundidad y proyecta sombras sobre un plano horizontal. El estudio original calcula el sol por la aproximación de año fraccional NOAA para Ciudad Jardín, UTC−3. Reutilizamos su apariencia, proyección, cámara, controles, reloj y renderer de referencia; el sonido queda únicamente en ese estudio.

La referencia publicada y la copia local se ejecutaron antes de modificar: sin errores JS, sombra inicial 96 m. Capturas de trabajo en `.checks/original-*.png`, fuera de Git. Respaldo `backup/antes-amba-20260921`, commit `40b9f4e`.

## Módulos nuevos

- `config/ambaMunicipalities.json`: catálogo único de 40 municipios; sólo los dos pilotos tienen códigos ARBA verificados.
- `src/parcel-repository.js`: manifest, carga por viewport, abortado de peticiones y caché acotada.
- `src/geometry.js`: Polygon/MultiPolygon, huecos, contención, clipping, triangulación y unión de sombras.
- `src/renderer.js`: proyección local este/norte, volumen y sombras; sin rotación geográfica arbitraria.
- `src/solar.js`: misma aproximación NOAA, coordenadas de la selección, altura variable y reloj civil UTC−3 independiente del dispositivo.
- `src/main.js` y `src/ui.js`: flujo, dibujo, conexión a los controles existentes. `window.Legacy` es el adaptador explícito; `window.Urban` intercepta únicamente el modo AMBA.
- `src/geocoder.js`: proveedor Photon reemplazable, búsqueda explícita, sin autocompletar. La falta de resultados no impide explorar.
- `src/local-projects.js`, `src/share-state.js`: privacidad local y enlaces versionados.
- `api/community.js`: contadores anónimos opcionales en Redis REST, sin guardar geometrías, direcciones ni IP. Rate limit global por evento/minuto y origen autorizado; el voto tiene además freno local. Esto mitiga abuso casual, no garantiza un voto por persona.

## Datos y escala

Se eligieron celdas GeoJSON de 0,005° por municipio, equivalentes funcionalmente a teselas vectoriales para este Canvas. Conservan la geometría completa: no simplifican ni recortan las parcelas. Los polígonos que atraviesan celdas aparecen en ambas y se deduplican por ID. El cliente solicita sólo celdas de la vista, nunca un municipio entero. Máximo 64 celdas por petición y 96 en memoria. No se usa WebGL; no hay buffers GPU que liberar.

Es una solución para el piloto. PMTiles no se incorporó por preferencia personal: requiere lector y decodificador adicionales y complicaría la selección del polígono completo al atravesar teselas. Medir tamaños/carga antes de extender a los otros 38 municipios; un índice jerárquico o PMTiles es una evolución posible. No se descargaron los 40.

El mapa base AMBA actual es el propio parcelario, sin cartografía de calles externa. La referencia Wernicke conserva sus mapas raster originales. No se mezclan imágenes calibradas a mano con parcelas oficiales.

## Precisión y límites

Proyección local equirectangular con escala longitudinal según latitud; adecuada para exploración de parcelas, no mensura. Las sombras son la unión de barridos de triángulos, conservando concavidades y patios. No modelan terreno, árboles, edificios vecinos, intercepción en fachadas ni normativa. El contador cuenta solamente geometrías cargadas, siempre rotulado parcial. Las alturas y pisos son elegidos por el usuario.

El reloj usa UTC−3, vigente para Buenos Aires en el horizonte de simulación; una eventual modificación legal de zona horaria requeriría actualizarlo. Las fechas de solsticio/equinoccio son accesos aproximados, no efemérides astronómicas exactas.

## Publicación y servicios opcionales

Vercel sirve `publicar/`; `/embed/` reescribe a `index.html`. No se publicó ni se cambiaron servicios remotos. Revisar redistribución ARBA antes del deploy. El build en Vercel impide publicar mientras la revisión siga pendiente; después de documentarla, configurar `ARBA_REDISTRIBUTION_REVIEWED=1`. Los datos derivados no contienen los atributos tributarios del Shape.

Configurar `COMMUNITY_REDIS_URL`, `COMMUNITY_REDIS_TOKEN` y `COMMUNITY_ORIGIN` para activar contadores/votaciones. Sin credenciales no hay conteos ficticios. `SUPPORT_URL`, `ADS_ENABLED`, `AD_PROVIDER` y `AD_SLOTS` están en configuración. Publicidad y apoyo no bloquean funciones.

Photon usa el servidor de demostración para tráfico moderado; migrar a proveedor/instancia con capacidad garantizada antes de difusión masiva. [Documentación del proveedor](https://github.com/komoot/photon#demo-server).
