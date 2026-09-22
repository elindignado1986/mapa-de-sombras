// 32 mm full-frame equivalent, vertical sensor dimension 24 mm.
export const FOCAL_MM=32;
export function screenProject(state,{width:W,height:H,scale},x,y,z=0){
 const c=Math.cos(state.yaw),s=Math.sin(state.yaw),rx=x*c-y*s,ny=x*s+y*c;
 if(state.flat)return [W*.5+state.panX+rx*scale,H*.54+state.panY-ny*scale];
 const focal=H*FOCAL_MM/24,distance=focal/scale,depth=ny*Math.sin(state.pitch)-z*Math.cos(state.pitch),factor=focal/Math.max(distance*.08,distance+depth);
 return [W*.5+state.panX+rx*factor,H*.54+state.panY-(ny*Math.cos(state.pitch)+z*Math.sin(state.pitch))*factor];
}
export function groundPoint(state,{width:W,height:H,scale},x,y){
 const sx=x-W*.5-state.panX,sy=H*.54+state.panY-y,c=Math.cos(state.yaw),s=Math.sin(state.yaw);
 let rx=sx/scale,ny=sy/scale;
 if(!state.flat){const focal=H*FOCAL_MM/24,distance=focal/scale,den=focal*Math.cos(state.pitch)-sy*Math.sin(state.pitch);ny=sy*distance/Math.max(focal*.08,den);rx=sx*(distance+ny*Math.sin(state.pitch))/focal;}
 return [rx*c+ny*s,-rx*s+ny*c];
}
