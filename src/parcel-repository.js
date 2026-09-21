import {CONFIG} from '../config/app.js';
import {contains} from './geometry.js';
export class ParcelRepository{
 constructor(){this.cache=new Map();this.manifest={};}
 async init(){const r=await fetch(CONFIG.MANIFEST);if(!r.ok)throw Error('No pudimos cargar la cobertura.');this.manifest=await r.json();return this.manifest;}
 async viewport(municipality,bbox,signal){const m=this.manifest[municipality];if(!m?.available)throw Error('El parcelario de este municipio está en preparación.');const size=m.cellSize,keys=[];for(let x=Math.floor(bbox[0]/size);x<=Math.floor(bbox[2]/size);x++)for(let y=Math.floor(bbox[1]/size);y<=Math.floor(bbox[3]/size);y++)keys.push(`${x}_${y}`);if(keys.length>CONFIG.MAX_CELLS)throw Error('Acercá el mapa para ver las parcelas.');const features=new Map();for(let i=0;i<keys.length;i+=6)await Promise.all(keys.slice(i,i+6).map(async key=>{const id=`${municipality}/${m.version}/${key}`;if(!this.cache.has(id)){const r=await fetch(`/data/amba/${id}.json`,{signal});if(r.status===404)return;if(!r.ok)throw Error('No pudimos cargar algunas parcelas.');this.cache.set(id,(await r.json()).features);if(this.cache.size>CONFIG.MAX_CACHE)this.cache.delete(this.cache.keys().next().value);}for(const f of this.cache.get(id))features.set(f.id,f);}));return [...features.values()];}
 find(features,point){return features.find(f=>contains(f.geometry,point));}
}
