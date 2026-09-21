# Parcelario oficial ARBA

Investigación realizada el 21/09/2026. Fuentes: [GeoARBA](https://arba.gov.ar/geoarba/inicio.asp), [ficha oficial de objetos](https://www.arba.gov.ar/archivos/Publicaciones/geoarba-FichasdeDByF-v2.pdf), [WFS GetCapabilities](https://geo.arba.gov.ar/geoserver/idera/wfs?request=GetCapabilities&service=WFS). CARTO no fue scrapeado.

## Endpoints observados, no inferidos

El JavaScript de la página GeoARBA contiene:

```
https://geo.arba.gov.ar/datoabierto/partidos
https://geo.arba.gov.ar/datoabierto/codigos/{partido}
https://geo.arba.gov.ar/datoabierto/fecha
https://geo.arba.gov.ar/datoabierto/datos/{partido}/{capa}
```

Se verificó que Tres de Febrero = 117, Morón = 101, Parcela = 110101. La respuesta de datos es TAR.GZ, aunque la interfaz dice «Shape». El pipeline detecta el contenedor real, lee sus archivos en memoria y normaliza a ZIP sin extraer rutas arbitrarias al disco.

WFS publica `idera:Parcela`, CRS por defecto EPSG:5347. DescribeFeatureType devuelve `cca`, `tpa`, `ara1`, `sag`, `pda`, `geom` (MultiSurface). El Shape incluye PRJ POSGAR 2007 / Argentina 5, EPSG:5347, y CPG UTF-8. `shpjs` reproyecta según PRJ a GeoJSON longitud/latitud. No se asigna EPSG:4326 a coordenadas proyectadas sin transformar.

El endpoint de fecha declaró **13/11/2025**. Es una fecha global publicada por el portal; no se afirma que cada parcela se haya actualizado ese día.

## Resultados reales del piloto

| Municipio | ZIP normalizado | Parcelas derivadas | Celdas | Observación |
|---|---:|---:|---:|---|
| Tres de Febrero | 4.844.010 bytes | 77.651 | 248 | Un registro idéntico deduplicado |
| Morón | 8.021.769 bytes | 89.356 | 270 | Un registro geográfico apartado |

La nomenclatura no es única en todos los registros. El ID interno combina nomenclatura con hash de geometría, evitando que dos polígonos distintos se sobrescriban. No incluye partida tributaria. Se retienen exclusivamente ID, municipio y geometría.

En Morón el registro 80379 del archivo recibido tiene coordenadas próximas a **−62,758 / −37,178**, fuera del AMBA y del resto del dataset. Se registró en `data-source/arba/moron/validation.json` y se excluyó expresamente mediante `--allow-quarantine`. No se movió ni reparó inventando ubicación. Manifest: `quarantinedCount: 1`. Este flag no debe usarse rutinariamente sin revisar el informe.

## Actualización en 6 o 12 meses

1. Ejecutar `node scripts/research-arba.cjs` y verificar catálogo, capa, esquema, fecha y condiciones.
2. Ejecutar `npm run data:fetch -- tres-de-febrero moron`.
3. Ejecutar `npm run data:build -- tres-de-febrero moron`. Si rechaza geometrías, examinar `validation.json`; no promover automáticamente datos incompletos.
4. Para el archivo de Morón documentado arriba: `node scripts/process-parcels.mjs moron --allow-quarantine`.
5. Ejecutar `node scripts/validate-parcels.mjs`, `npm test`, `npm run build` y `npm run test:browser` con servidor local activo.
6. Revisar visualmente parcelas reales, norte, escala, volúmenes y sombras en ambos municipios. No confundir la fuente oficial con una mensura.
7. Publicar únicamente después de revisar licencia y revisar diferencias del manifest. Las URLs incluyen la geometría original, por lo que una actualización no la reemplaza silenciosamente.

Los crudos y celdas generadas están fuera de Git. Se conservan localmente para repetir el build sin conexión con ARBA. Archivar versiones anteriores en storage propio cuando se habilite la publicación; nunca consultar ARBA desde el navegador.

## Licencia: pendiente antes de publicar

La página oficial anuncia datos/servicios abiertos y adhesión a IDERA, pero no se encontró allí una licencia explícita que establezca condiciones completas para redistribuir el parcelario derivado. **No se presume CC-BY, dominio público ni autorización irrestricta.** Revisar condiciones con ARBA y registrar su texto/enlace y fecha antes del deploy o subida a un CDN público. La descarga para este piloto no resuelve ese punto.

## Entrada manual

Ver [README-DATA.md](../data-source/arba/README-DATA.md). No se necesitan propietarios, valuaciones, partidas ni información fiscal en producción.
