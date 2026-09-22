# Votos públicos por municipio

El botón «Votar próximo municipio» abre una lista con un botón y el total de votos por municipio pendiente. Los totales se consultan al abrir y cada 15 segundos mientras el diálogo está visible. Un voto confirmado se conserva en Redis; todos los visitantes consultan el mismo total.

La API existente `api/community.js` requiere estas variables del servidor:

- `COMMUNITY_REDIS_URL`: endpoint REST de Redis.
- `COMMUNITY_REDIS_TOKEN`: token privado, nunca se incorpora al frontend.
- `COMMUNITY_ORIGIN`: origen exacto de la web, por ejemplo `https://mapa.example`, sin barra final.

La configuración se realiza en el entorno del hosting, sin incluir secretos en Git. Sin conexión, los botones quedan deshabilitados y se informa que el total no está disponible; no se muestran votos ficticios ni se suman votos exclusivamente locales.

La marca local evita repetir el voto a un municipio desde el mismo navegador. No identifica personas y se puede eludir borrando el almacenamiento o usando otro navegador. La API conserva el límite existente de 60 eventos por municipio por minuto.

Verificación: `npm test` comprueba escritura y lectura de totales con un adaptador Redis simulado. `node scripts/check-community-ui.cjs` comprueba alineación del encabezado, controles y totales entre dos navegadores con API simulada. Estas pruebas no acreditan una conexión de producción: para habilitarla faltan las variables del servicio real.
