# San Isidro

Municipio habilitado junto con Tres de Febrero, Hurlingham y la localidad de Castelar. Código ARBA **97**, verificado en el catálogo oficial `https://geo.arba.gov.ar/datoabierto/partidos`.

- Parcelario ARBA publicado el 13/11/2025: **69.271 parcelas**, sin rechazos ni cuarentena, en 247 celdas.
- Límite municipal: capa Departamento de ARBA.
- Contexto OpenStreetMap: 8.261 referencias de calles, ferrocarriles, estaciones, parques y lugares, en 154 celdas y un resumen para la vista general.
- Las fechas de descarga, versiones y fuentes están registradas en los manifests y en el archivo del límite.

```sh
node scripts/fetch-arba.cjs san-isidro
node scripts/process-parcels.mjs san-isidro
node scripts/fetch-boundary.cjs san-isidro
node scripts/fetch-map-context.cjs san-isidro
npm run build
node scripts/check-san-isidro.cjs
```

La prueba de navegador verifica una parcela real, generación de 27 m, enlace compartido/restaurado e intercambio de municipio. El resultado de búsqueda se simula para no depender de la disponibilidad de Photon.

Las celdas parcelarias están ignoradas por Git, igual que los municipios anteriores. Antes de desplegar desde un clon nuevo, generar o transferir `data/amba/san-isidro/`. El build local ya incluye estos datos en `publicar/data/`. La atribución y las condiciones de las fuentes se conservan en sus manifests.
