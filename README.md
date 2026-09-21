# Mapa de sombras · AMBA

Evolución del estudio de Ciudad Jardín, conservando Canvas, cámara, reloj solar, estética y el estudio original. Piloto con **77.651 parcelas de Tres de Febrero** y **89.356 de Morón**. Los otros 38 municipios figuran sin datos; no se simula disponibilidad ficticia.

## Ejecutar

Requiere Node.js 22 o superior y npm. En PowerShell con scripts deshabilitados, usar `npm.cmd`.

```sh
npm ci
npm run dev
```

Abrir `http://localhost:4173`. `npm run dev` construye y sirve la aplicación. Reejecutar el build después de editar módulos. No abrir con `file://`: los datos se cargan por HTTP.

Los datos descargados ya están preparados en este workspace. En un clon nuevo, los crudos/celdas no vienen en Git: seguir [ARBA-DATA](docs/ARBA-DATA.md) para generar los dos pilotos o importar manualmente. Sin esos datos sigue disponible «Estudio Wernicke». No se requiere ARBA al usar la app después de procesar los archivos.

```sh
npm run data:fetch -- tres-de-febrero moron
node scripts/process-parcels.mjs tres-de-febrero
node scripts/process-parcels.mjs moron
```

El archivo de Morón del 13/11/2025 contiene un registro fuera del AMBA. Tras revisar su informe, procesarlo con `--allow-quarantine`, como se documenta. No ignorar nuevos rechazos sin inspección.

## Uso

Elegir municipio, buscar una dirección o tocar una parcela. Usar toda la parcela o dibujar dentro de ella, indicar metros/pisos y generar. Mover fecha/hora; guardar localmente o compartir mediante enlace, WhatsApp, Web Share, QR o iframe. «Estudio Wernicke» conserva el escenario original y el modo sonoro.

En planta: arrastrar desplaza. En 3D: arrastrar gira; dos dedos desplazan/acercan. Flechas y +/− ofrecen controles de teclado. Dibujo: taps/clicks agregan puntos; arrastrar un vértice lo mueve; deshacer/reiniciar/cerrar validan la huella completa.

## Verificar

```sh
npm test
npm run build
npm run test:browser
```

La prueba de navegador requiere servidor activo en 4173 y Chrome; configurar `CHROME_PATH` en otros sistemas. Prueba desktop, mobile emulado, almacenamiento, enlaces, QR, embed, municipios y regresión del estudio original. Capturas y resultados quedan en `.checks/`.

## Publicación

`npm run build` genera `publicar/`; Vercel está configurado en `vercel.json`. **No se hizo deploy. Antes de publicar datos derivados, revisar las condiciones de redistribución ARBA**, todavía no documentadas de forma inequívoca. El build de Vercel verifica esta revisión: una vez documentada, configurar `ARBA_REDISTRIBUTION_REVIEWED=1`. Preparar/subir los datos al hosting propio como parte del despliegue; los directorios ignorados no viajan con Git. Los crudos y la información tributaria no se incorporan al frontend.

El contador/votación requiere Redis REST opcional y variables `COMMUNITY_REDIS_URL`, `COMMUNITY_REDIS_TOKEN`, `COMMUNITY_ORIGIN`. Sin ellas la aplicación funciona sin contadores ficticios. Configuración de apoyo/publicidad en `config/app.js`, desactivados inicialmente.

## Alcance y pendientes de validación

El piloto muestra cartografía parcelaria propia; aún no ofrece una capa de calles general del AMBA. Photon es un proveedor desacoplado de búsqueda basado en OSM, de disponibilidad limitada; requiere dimensionamiento antes de difusión masiva. No se simula normativa, mensura ni edificabilidad. Sombras sobre plano horizontal, sin terreno ni obstrucciones vecinas.

La prueba mobile es emulada, no una certificación en iPhone/Android físicos. Falta revisión geográfica independiente contra mensuras y autorización de redistribución. Sólo dos municipios fueron procesados; Hurlingham se prueba como estado sin datos.

Documentación: [Arquitectura](docs/ARCHITECTURE.md) · [Datos ARBA](docs/ARBA-DATA.md) · [Compartir](docs/SHARING.md).
