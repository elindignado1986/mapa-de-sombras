import {CONFIG} from '../config/app.js';
export class Community{
 constructor(){this.enabled=false;}
 async init(){try{const r=await fetch(CONFIG.COMMUNITY_URL);if(!r.ok)return;const s=await r.json();if(!s.enabled)return;this.enabled=true;const el=document.createElement('p');el.id='communityCount';el.textContent=`${Number(s.simulations).toLocaleString('es-AR')} simulaciones realizadas`;document.querySelector('header').append(el);}catch{}}
 async event(event,municipality){if(!this.enabled)return false;try{const r=await fetch(CONFIG.COMMUNITY_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,...(municipality?{municipality}:{})})});return r.ok;}catch{return false;}}
}
export function supportAndAds(){if(CONFIG.SUPPORT_URL){const url=new URL(CONFIG.SUPPORT_URL);if(url.protocol==='https:'){const a=document.createElement('a');a.textContent='☕ Apoyar el proyecto';a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';document.querySelector('footer').append(a);}}if(CONFIG.ADS_ENABLED)for(const slot of CONFIG.AD_SLOTS){const el=document.createElement('div');el.className='ad-slot';el.dataset.slot=slot;el.setAttribute('aria-label','Espacio publicitario');el.textContent='Espacio publicitario';document.querySelector('footer').append(el);}}
