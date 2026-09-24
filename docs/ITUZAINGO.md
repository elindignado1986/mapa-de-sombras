# Ituzaingó

Código ARBA **136**, verificado en el catálogo oficial de partidos. Parcelas y límite Departamento descargados de ARBA; publicación de origen: 13/11/2025.

- **55.250 parcelas** aceptadas, distribuidas en 185 celdas.
- Un registro en cuarentena: índice 53215 del archivo fuente, polígono de siete vértices con coordenadas aproximadas −60,2757 / −35,0218, fuera de Ituzaingó y del rango AMBA utilizado. Se revisó antes de ejecutar `--allow-quarantine`. No se corrigió ni desplazó artificialmente.
- Contexto de OpenStreetMap: 5.738 referencias en 62 celdas, con resumen para la vista general.
- Fechas, versiones y atribuciones conservadas en los manifests.

```sh
node scripts/fetch-arba.cjs ituzaingo
node scripts/process-parcels.mjs ituzaingo
# Si falla, revisar el informe: no aceptar automáticamente nuevos rechazos.
# Para el archivo revisado de esta incorporación:
node scripts/process-parcels.mjs ituzaingo --allow-quarantine
node scripts/fetch-boundary.cjs ituzaingo
node scripts/fetch-map-context.cjs ituzaingo
npm run build
node scripts/check-ituzaingo.cjs
```

La prueba usa una parcela real y verifica generación de 27 m, enlace/restauración y cambio de municipio. La respuesta del buscador se simula para no depender de Photon. El informe completo de geometrías queda en `data-source/arba/ituzaingo/validation.json`.

Los datos parcelarios están ignorados por Git. Antes de desplegar desde un clon nuevo, generar o transferir `data/amba/ituzaingo/`. El build local los incluye en `publicar/data/`. La validación automática no sustituye una mensura.
