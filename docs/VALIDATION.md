# Validación del piloto — 21/09/2026

## Referencia antes de cambios

Se ejecutaron la aplicación original local y `ciudadjardin.vercel.app` en Chrome automatizado. Ambas: 96 m para el escenario inicial, sin errores JavaScript. Se guardaron capturas locales. Canvas 2D, no WebGL; por eso las pruebas de pérdida de contexto GPU no corresponden a este stack.

## Datos

Descarga oficial real de dos municipios, descompresión TAR.GZ, interpretación PRJ/CPG, reproyección, validación y partición. Tres de Febrero 77.651 y Morón 89.356 geometrías únicas. Un outlier de Morón queda en cuarentena. 518 celdas, aproximadamente 96,4 MB de GeoJSON no comprimido total en disco (se solicita únicamente la vista). No se incorporaron crudos ni celdas a Git.

## Pruebas automatizadas

`npm test`: 8 pruebas de contención en concavidades/patios, auto-intersecciones, solar, sombra analítica, compresión/restauración, entradas dañadas y privacidad del endpoint comunitario.

`npm run test:browser` con Chrome:

- Seleccionar una parcela oficial, 8 pisos ≈ 24 m, generar y mover hora.
- Guardar, recargar página y abrir proyecto local.
- Compartir y reconstruir exactamente los valores guardados, incluyendo cámara.
- QR local y código iframe; abrir `/embed/`, mover reloj y comprobar enlace a la versión completa.
- Viewport móvil 390 × 844: dibujo por taps, cierre, 18 m, generar y compartir; sin desbordamiento horizontal.
- Cambiar a Morón, seleccionar parcela oficial y generar volumen; Hurlingham muestra falta de datos.
- Volver al estudio original y verificar modo sonoro.
- ARBA bloqueado en navegador durante las pruebas: la app usa sus archivos propios.
- Flujo de búsqueda con respuesta controlada para probar selección. La calidad del proveedor se revisó por separado con consultas reales.

Capturas y resumen en `.checks/`, fuera de Git. La URL del caso probado ocupó 538 caracteres. Benchmark de 12 cambios horarios en Morón: alrededor de 8,7 ms por cuadro, heap aproximado de 44 MB en la máquina de desarrollo. Es una medición puntual; no prueba rendimiento universal ni ausencia de todo leak. Caché parcelaria limitada a 96 celdas; no se crean contextos GPU.

## Búsqueda real

Photon respondió HTTP 200 a Wernicke 2236 y Santa Rosa 1200. No resolvió de manera inequívoca esas alturas: incluyó calles/paradas y resultados de otro partido. Se agregó filtro de partido y marca «Aproximado»; esas ubicaciones no seleccionan parcelas automáticamente. La app no afirma que una coincidencia difusa sea la propiedad buscada.

## Límites de lo verificado

No se hicieron pruebas en iPhone/Android físicos, mensura independiente ni comparación de parcelas contra un relevamiento terrestre. No se desplegó. Redis/contador no tiene credenciales, por lo que se probó su comportamiento deshabilitado y rechazo de datos privados, no una instancia persistente real. Web Share y WhatsApp se prepararon, sin enviar mensajes a terceros. El fondo AMBA es parcelario, sin calles generales rotuladas. Redistribución de ARBA pendiente de revisión.
