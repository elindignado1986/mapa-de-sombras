# Ingreso manual de datos

Si ARBA bloquea automatización, requiere CAPTCHA o cambia endpoints, usar [GeoARBA](https://arba.gov.ar/geoarba/inicio.asp) → Archivos vectoriales → Partido → **Parcela** → Descargar Shape.

| Partido | Carpeta | Archivo requerido |
|---|---|---|
| Tres de Febrero (117) | `data-source/arba/tres-de-febrero/` | `parcelas.zip` |
| Morón (101) | `data-source/arba/moron/` | `parcelas.zip` |

El ZIP debe contener una sola capa parcelaria con `.shp`, `.shx`, `.dbf`, `.prj` y, si está disponible, `.cpg`. Si el portal entrega TAR.GZ, extraer sus componentes con una herramienta de archivos y comprimirlos como ZIP. No incluir subparcelas/manzanas ni cambiar CRS a mano.

Crear `source.json` en la misma carpeta:

```json
{"source":"ARBA","url":"https://arba.gov.ar/geoarba/inicio.asp","layer":"110101","downloadedAt":"FECHA-ISO-REAL","publishedAt":"FECHA-QUE-MUESTRA-EL-PORTAL","redistribution":"pending-review"}
```

Alternativa: `parcelas.geojson` FeatureCollection ya reproyectado a EPSG:4326; agregar `"crs":"EPSG:4326"` a `source.json`. No renombrar un Shape como GeoJSON.

Ejecutar `node scripts/process-parcels.mjs tres-de-febrero` y después `node scripts/validate-parcels.mjs`. Cualquier rechazo queda en `validation.json`. No se publica un dataset rechazado salvo revisión y uso explícito de `--allow-quarantine`.

Para incorporar otro municipio, primero verificar su código en el catálogo oficial y completar `arbaCode` y `center` en `config/ambaMunicipalities.json`. No hace falta modificar el motor.
