import castelarBoundary from '../data/context/castelar-boundary.json';
import {contains} from './geometry.js';
import {CONFIG} from '../config/app.js';
export class Geocoder{
 constructor(provider=new PhotonProvider()){this.provider=provider;this.last=0;this.cache=new Map();}
 async search(query,municipality,signal){if(query.trim().length<3)throw Error('Escribí una calle y altura.');const key=municipality+query.trim().toLowerCase();if(this.cache.has(key))return this.cache.get(key);const now=Date.now();if(now-this.last<1100)throw Error('Esperá un momento antes de buscar de nuevo.');this.last=now;const results=await this.provider.search(query,municipality,signal);this.cache.set(key,results);if(this.cache.size>50)this.cache.delete(this.cache.keys().next().value);return results;}
}
const normalize=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^partido de /,'').trim();
export class PhotonProvider{
 async search(query,municipality,signal){const m=CONFIG.municipalities.find(m=>m.id===municipality),url=new URL(CONFIG.GEOCODER_URL);url.search=new URLSearchParams({q:`${query}, ${m.searchName||m.name}, Argentina`,limit:'5',bbox:'-59.6,-35.5,-57.6,-33.7',...(m.center?{lon:m.center[0],lat:m.center[1]}:{})});const r=await fetch(url,{signal});if(!r.ok)throw Error('El buscador no está disponible. Podés explorar el mapa.');const number=query.match(/\b\d+\b/)?.[0],street=normalize(query.split(',')[0].replace(/\d+/g,'')).split(/\s+/).filter(Boolean);return(await r.json()).features.filter(f=>f.properties.countrycode?.toLowerCase()==='ar'&&(municipality==='castelar'?contains(castelarBoundary.geometry,f.geometry.coordinates):normalize(f.properties.county)===normalize(m.name))).map(f=>{const p=f.properties,exact=Boolean(number&&p.housenumber===number&&street.every(w=>normalize(p.street).includes(w)));return {label:(exact?'':'Aproximado · ')+[p.name,p.street,p.housenumber,p.city,p.county].filter(Boolean).join(', '),point:f.geometry.coordinates,exact};});}
}
