import clipping from 'polygon-clipping';
import {polygons,center,localProjection} from './geometry.js';
// Common boundary must have length, not merely a shared corner. 5 cm tolerance
// absorbs cadastral coordinate noise without joining lots across a road.
export function contiguous(a,b){
 const projection=localProjection(center(a)),rings=g=>polygons(g).flatMap(p=>p.map(r=>r.map(projection.forward)));
 for(const ra of rings(a))for(const rb of rings(b))for(let i=0;i<ra.length-1;i++)for(let j=0;j<rb.length-1;j++){
  const p=ra[i],q=ra[i+1],u=rb[j],v=rb[j+1],dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);if(length<.1)continue;
  const dist=w=>Math.abs(dx*(w[1]-p[1])-dy*(w[0]-p[0]))/length;
  if(dist(u)>.05||dist(v)>.05)continue;
  const along=w=>((w[0]-p[0])*dx+(w[1]-p[1])*dy)/length,lo=Math.max(0,Math.min(along(u),along(v))),hi=Math.min(length,Math.max(along(u),along(v)));
  if(hi-lo>.2)return true;
 }return false;
}
export function connected(features){if(features.length<2)return true;const reached=new Set([0]);let changed=true;while(changed){changed=false;for(let i=0;i<features.length;i++)if(!reached.has(i)&&[...reached].some(j=>contiguous(features[i].geometry,features[j].geometry))){reached.add(i);changed=true;}}return reached.size===features.length;}
export function mergeParcels(features){if(!features.length)return null;return {type:'Feature',id:features.map(f=>String(f.id)).sort().join('|'),properties:{municipality:features[0].properties?.municipality},geometry:{type:'MultiPolygon',coordinates:clipping.union(...features.map(f=>polygons(f.geometry)))}};}
