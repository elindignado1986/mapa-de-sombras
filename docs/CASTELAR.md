# Castelar (Morón)

Se habilita la localidad de Castelar, incluyendo Norte y Sur; el resto de Morón permanece deshabilitado en el selector.

Parcelas originales: dataset ARBA de Morón, publicación 13/11/2025. Límite de localidad: [relación 2014610 de OpenStreetMap](https://www.openstreetmap.org/relation/2014610), ODbL, descargada por `scripts/fetch-castelar-boundary.cjs`. No es un límite certificado por ARBA. Sus calles principales se contrastaron con la [descripción del Instituto y Archivo Histórico de Morón](https://historiamoron.wordpress.com/2016/01/27/castelar-sur/): Santa Rosa, Presidente Perón, Colihué, Cañada de Juan Ruiz, Bernardo de Irigoyen, Santa María de Oro, Base Aérea, Eva Perón, Hortiguera y Blas Parera.

El procesamiento selecciona 31.882 parcelas, sin recortar ni modificar su geometría, en 102 celdas. Excluye cinco parcelas que cruzan el límite. Requiere al menos 99,99 % del área dentro del polígono para absorber diferencias numéricas muy pequeñas. El informe detallado queda en `.checks/castelar-validation.json`. El área aproximada del polígono es 20,51 km². La validación no sustituye una mensura.

La búsqueda añade Castelar al texto y filtra las coordenadas de cada resultado por el límite, aunque el proveedor indique Partido de Morón. Los enlaces nuevos usan el identificador `castelar`; las parcelas mantienen sus IDs ARBA y registran a Morón como municipio de origen.

```sh
node scripts/fetch-castelar-boundary.cjs
node scripts/build-castelar.mjs
node scripts/fetch-map-context.cjs castelar
npm run build
node scripts/check-castelar.cjs
```

El procesamiento requiere las celdas de Morón ya disponibles. Los datos parcelarios están ignorados por Git: antes de un despliegue desde un clon nuevo, transferir o generar `data/amba/castelar/`, además de los datos del resto de municipios. La salida local `publicar/` los incluye después del build.
