// Convex clipping for parcel outlines traced from the supplied cadastral image.
const ParcelGeometry=(()=>{
 const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
 const signedArea=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-a[1]*b[0]},0)/2;
 function intersection(subject,clip){if(subject.length<3||clip.length<3)return [];let out=subject.map(p=>p.slice(0,2));const sign=signedArea(clip)>=0?1:-1;for(let i=0;i<clip.length;i++){const a=clip[i],b=clip[(i+1)%clip.length],input=out;out=[];if(!input.length)break;let prev=input[input.length-1],dp=sign*cross(a,b,prev);for(const cur of input){const dc=sign*cross(a,b,cur);if((dc>=0)!==(dp>=0)){const t=dp/(dp-dc);out.push([prev[0]+t*(cur[0]-prev[0]),prev[1]+t*(cur[1]-prev[1])]);}if(dc>=0)out.push(cur);prev=cur;dp=dc;}}return out;}
 const area=p=>p.length<3?0:Math.abs(signedArea(p));
 return {intersection,area,overlapArea:(a,b)=>area(intersection(a,b))};
})();
