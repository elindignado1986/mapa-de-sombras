import fs from 'node:fs';
import path from 'node:path';
const manifest=JSON.parse(fs.readFileSync('data/amba/municipality-manifest.json','utf8'));
for(const [id,m]of Object.entries(manifest)){if(!m.available)continue;const ids=new Set();const dir=path.join('data/amba',id,m.version);for(const name of fs.readdirSync(dir)){const fc=JSON.parse(fs.readFileSync(path.join(dir,name)));for(const f of fc.features){if(Object.keys(f.properties).join()!=='municipality')throw Error('Atributos no permitidos');if(f.properties.municipality!==id)throw Error('Municipio incorrecto');ids.add(f.id);}}if(ids.size!==m.parcelCount)throw Error('Cantidad inconsistente');console.log(id,ids.size,'OK');}
