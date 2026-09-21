import {validate} from './share-state.js';
const KEY='amba.projects.v1';
export class LocalProjects{
 list(){try{const rows=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(rows))throw Error();return rows;}catch{throw Error('No pudimos leer tus simulaciones guardadas. No se modificaron.');}}
 write(rows){try{localStorage.setItem(KEY,JSON.stringify(rows));}catch{throw Error('No hay espacio disponible para guardar en este dispositivo.');}}
 save(state,name='Mi simulación'){validate(state);const rows=this.list();rows.push({id:crypto.randomUUID(),name:name.slice(0,100),state,createdAt:new Date().toISOString()});this.write(rows);}
 open(id){return validate(this.list().find(r=>r.id===id)?.state);}
 rename(id,name){const rows=this.list(),row=rows.find(r=>r.id===id);if(row)row.name=name.slice(0,100)||'Mi simulación';this.write(rows);}
 duplicate(id){const row=this.list().find(r=>r.id===id);if(row)this.save(row.state,row.name+' · copia');}
 remove(id){this.write(this.list().filter(r=>r.id!==id));}
}
