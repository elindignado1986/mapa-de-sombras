# Contexto cartográfico

Tres de Febrero y Hurlingham están habilitados. El mapa inicial encuadra el límite oficial de ARBA del municipio elegido. Las parcelas y el contexto se conservan al pasar a perspectiva de 32 mm.

`scripts/fetch-map-context.cjs tres-de-febrero` descarga calles con nombre, ferrocarriles, cursos de agua, parques, estaciones y lugares de OpenStreetMap mediante Overpass. Produce celdas de 0,02 grados y un resumen para escalas lejanas en `data/context/`. El manifest registra fecha, versión, fuente y licencia. La app sirve esos archivos propios; no consulta Overpass durante el uso.

Datos de OpenStreetMap y sus colaboradores, bajo [ODbL](https://www.openstreetmap.org/copyright). La atribución permanece visible en el visor. `scripts/fetch-boundary.cjs` obtiene el límite municipal de ARBA; las condiciones de los datos ARBA se documentan en ARBA-DATA.md.

Google Híbrido queda pendiente por decisión del usuario: selector deshabilitado y variable de build `GOOGLE_MAPS_API_KEY` reservada. Agregar una clave no activa por sí solo esa capa: falta integrar el proveedor, sus sesiones y su atribución. No se reutilizan credenciales del visor de ARBA.

La cabecera usa `logo.png` y una copia local del botón oficial de Cafecito, con enlace a la cuenta solicitada.
