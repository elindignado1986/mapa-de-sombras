# Guardado, enlaces y embed

Las simulaciones se guardan en `localStorage`, clave `amba.projects.v1`. No hay cuenta, backend de proyectos ni subida de geometrías. La lista permite abrir, renombrar, duplicar y eliminar. El navegador puede borrar su almacenamiento; no equivale a una copia de seguridad en la nube.

Una URL `/#v1=...` contiene JSON validado, comprimido GZIP, codificado base64url. El fragmento no se envía al servidor al abrir la página. Incluye `schemaVersion`, municipio, ID y geometría completa de parcela, versión de dataset, huella opcional, altura, unidad, valor ingresado, fecha, minutos y cámara. No incluye nombre personal ni nombre del proyecto guardado.

Incluir geometría evita que una actualización de ARBA altere silenciosamente un enlace viejo. Se avisa si su versión difiere del manifest. Los vecinos provienen del dataset actualmente instalado; ese contexto puede cambiar aunque el volumen compartido no cambie.

Se valida versión, tamaño, geometría, altura, fecha real, reloj y cámara antes de restaurar. Límites: 30.000 caracteres comprimidos y 200 KB descomprimidos; 3.000 vértices de parcela y 512 por anillo/huella. El formato v1 no se reinterpretará como una versión posterior: futuras versiones deben agregar un decodificador/migración explícitos.

«Copiar enlace», WhatsApp y Web Share comparten la misma URL. No se envía nada hasta que la persona elige compartir. QR generado localmente con `qrcode`, sin API externa. Geometrías complejas pueden exceder la capacidad QR: se conserva el enlace y se explica el límite, sin reducir precisión silenciosamente.

`/embed/#v1=...` usa la misma escena y reloj, interfaz reducida y enlace a versión completa. El generador entrega iframe de ancho 100% y 650 px de alto. Vercel permite `frame-ancestors *` para embed; no agrega X-Frame-Options. El host del iframe puede necesitar permitir este origen en su propia CSP.

El hash es público para quien recibe el enlace: compresión no es cifrado. Analítica comunitaria, si se habilita, sólo transmite un nombre de evento o municipio votado. No transmite la URL ni sus coordenadas.
