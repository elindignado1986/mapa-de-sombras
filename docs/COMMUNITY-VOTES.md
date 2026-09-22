# Votos públicos por municipio

El botón «Votar próximo municipio» abre una lista con un botón y el total de votos por municipio pendiente. Los totales se consultan al abrir y cada 15 segundos mientras el diálogo está visible. Un voto confirmado se conserva en Redis; todos los visitantes consultan el mismo total.

La API `api/community.js` acepta directamente las variables creadas por la integración de Upstash en Vercel:

- `KV_REST_API_URL`: endpoint REST de Redis.
- `KV_REST_API_TOKEN`: token con permiso de escritura, nunca se incorpora al frontend.

No se usa `KV_REST_API_READ_ONLY_TOKEN`, porque votar necesita escribir. Las variables de conexión no REST tampoco se usan. Se mantiene compatibilidad con el par `COMMUNITY_REDIS_URL` y `COMMUNITY_REDIS_TOKEN`, que tiene prioridad si ambos están configurados.

Sin `COMMUNITY_ORIGIN`, las escrituras se aceptan desde el mismo origen HTTPS que sirve la API (incluye dominio propio o de Vercel). Opcionalmente se puede fijar `COMMUNITY_ORIGIN` al origen exacto, sin barra final; en ese caso tiene prioridad.

Publicar una nueva versión con este código y las variables disponibles en el entorno correspondiente. Verificar `/api/community`: debe responder `enabled: true` y el objeto `votes`. Un error del almacenamiento mantiene la votación deshabilitada. No hace falta compartir tokens ni incorporarlos al repositorio.

La configuración se realiza en el entorno del hosting, sin incluir secretos en Git. Sin conexión, los botones quedan deshabilitados y se informa que el total no está disponible; no se muestran votos ficticios ni se suman votos exclusivamente locales.

La marca local evita repetir el voto a un municipio desde el mismo navegador. No identifica personas y se puede eludir borrando el almacenamiento o usando otro navegador. La API conserva el límite existente de 60 eventos por municipio por minuto.

Verificación: `npm test` comprueba las variables de Vercel, escritura y lectura de totales y rechazo de otros orígenes con un adaptador Redis simulado. `node scripts/check-community-ui.cjs` comprueba controles y totales entre dos navegadores con API simulada. Estas pruebas no acreditan una conexión de producción; esa comprobación debe realizarse sobre el despliegue actualizado.
