# Sonido: escenario automático

El modo Sonido usa el único slider y la cámara de la aplicación. No necesita ubicar fuentes, cargar archivos ni configurar alturas. No se recuperan las ubicaciones manuales guardadas por versiones anteriores. No reproduce audio ni incorpora tráfico.

## Fuentes precargadas

- 52 balcones residenciales distribuidos sobre las ocho plantas y todas las fachadas de la huella existente. Se usan siete puntos en cuatro plantas y seis puntos en las otras cuatro, sumando 52. Las alturas se distribuyen en el volumen existente; son esquemáticas, no un plano arquitectónico de cada departamento.
- Ocho fuentes comerciales a nivel bajo, a lo largo del frente occidental sobre Wernicke.
- SUM interior, terraza abierta, parrilla, gimnasio y sauna, agrupados en el volumen del SUM sobre Origone. No se presentan sus centros como ubicaciones exactas de cada habitación.
- Motor/maniobras, portón y chicharra en el acceso aproximado ya representado sobre Origone, como eventos intermitentes.

Son 68 contribuciones gráficas, no 68 fuentes acústicas medidas. Las ponderaciones diferencian actividad exterior, interior, gimnasio y sauna. La contribución de cada balcón y local se normaliza para representar actividad media de un escenario y evitar asignar a cada unidad el peso de un edificio completo.

## Horario

Las noches de jueves, viernes, sábado y domingo aumentan la actividad potencial desde las 19:00 hasta la 01:00 del día siguiente. A las 00:30 del lunes se conserva el escenario de la noche del domingo; a las 00:30 del jueves no se anticipa la noche del jueves. La intensidad se reduce gradualmente al acercarse la 01:00.

Los perfiles, coeficientes y ciclos gráficos están centralizados en sound.js. Son hipótesis editables por el desarrollador, no horarios de uso confirmados. El slider muestra el estado determinista elegido; Recorrer el día anima los pulsos y la evolución temporal. Cambiar de modo detiene la animación.

## Interpretación

La visualización mezcla intensidades normalizadas, no calcula decibeles. Un número de departamentos o locales no basta para obtener un nivel acústico. Los niveles en dB se combinan logarítmicamente y requieren niveles de emisión, distancias, actividad y condiciones de propagación. No se emplea un promedio aritmético de dB ni se inventan niveles de referencia.

Referencia: https://www.osha.gov/otm/section-3-health-hazards/chapter-5

Los halos y contornos ayudan a comparar actividad y superposición hacia los linderos; no prueban exposición, distancias audibles ni cumplimiento normativo. No se calculan aislamiento, barreras, reflexiones ni transmisión estructural.

El render reutiliza mapas y proyección de la aplicación, con campos gráficos precalculados para mantener rendimiento. Las sombras, geometría del edificio y SUM permanecen intactas.
