# Hurlingham

Incorporado el 22/09/2026. Código **135**, verificado en el catálogo oficial `https://geo.arba.gov.ar/datoabierto/partidos`.

- Fuente parcelaria: ARBA, publicación del 13/11/2025.
- 44.162 parcelas aceptadas; ninguna rechazada ni en cuarentena.
- 175 celdas parcelarias, con geometría completa e IDs estables derivados del catastro.
- Límite municipal oficial de la capa Departamento de ARBA.
- 3.679 referencias de OpenStreetMap (calles, ferrocarriles, estaciones, parques y lugares), distribuidas en 48 celdas, con un resumen para la vista general.

Descarga y procesamiento reproducibles:

```sh
node scripts/fetch-arba.cjs hurlingham
node scripts/process-parcels.mjs hurlingham
node scripts/fetch-boundary.cjs hurlingham
node scripts/fetch-map-context.cjs hurlingham
npm run build
```

Las condiciones ARBA siguen registradas en el manifest; los datos OSM llevan atribución ODbL en el visor. Los crudos y las celdas parcelarias están ignorados por Git, igual que los municipios anteriores: una publicación desde un clon nuevo necesita generar o transferir `data/amba/hurlingham/` antes del build. El build local ya incluye estos datos en `publicar/data/`.

`node scripts/check-hurlingham.cjs` valida selección de municipio y parcela real, generación de 27 m, enlace compartido/restaurado y regreso a Tres de Febrero. La búsqueda de direcciones se simula en la prueba para no depender de Photon. La validación automática de geometría no sustituye una mensura.
