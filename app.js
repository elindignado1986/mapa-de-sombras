const $=id=>document.getElementById(id),rad=Math.PI/180;
const state={mode:'sun',minutes:960,date:'2026-06-21',width:36,depth:30,rotation:0,yaw:-.35,pitch:.85,zoom:2.8,flat:true,frontage:35,base:"streets",panX:0,panY:0};
const canvas=$('map'),ctx=canvas.getContext('2d');let W=800,H=480,scale=3,playing=null;
function solar(date,minutes){if(window.Urban?.active)return window.Urban.solar(date,minutes);const d=new Date(date+'T12:00:00Z'),year=d.getUTCFullYear(),day=Math.floor((d-Date.UTC(year,0,1))/86400000)+1,days=(year%4===0&&(year%100!==0||year%400===0))?366:365,g=2*Math.PI/days*(day-1+(minutes/60-12)/24);const eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g)),decl=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);const ha=((minutes+eq+4*(-58.5906360448885)+180)/4-180)*rad,lat=-34.592113240512525*rad;const east=-Math.cos(decl)*Math.sin(ha),north=Math.cos(lat)*Math.sin(decl)-Math.sin(lat)*Math.cos(decl)*Math.cos(ha),up=Math.sin(lat)*Math.sin(decl)+Math.cos(lat)*Math.cos(decl)*Math.cos(ha);return {east,north,up,alt:Math.asin(up)/rad,az:(Math.atan2(east,north)/rad+360)%360,length:up>0?30*Math.hypot(east,north)/up:null};}
function project(x,y,z=0){if(window.Urban?.active)return window.Urban.project(x,y,z);const a=state.yaw,c=Math.cos(a),s=Math.sin(a),rx=x*c-y*s,ny=x*s+y*c;return [W*.5+state.panX+rx*scale,H*.54+state.panY-ny*scale*(state.flat?1:Math.cos(state.pitch))-z*scale*(state.flat?0:Math.sin(state.pitch))];}
function polygon(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>{const q=project(...p);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke()}}
function corners(x,y,w,d,a=8,z=0){const t=a*rad;return [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([u,v])=>[x+u*Math.cos(t)+v*Math.sin(t),y-u*Math.sin(t)+v*Math.cos(t),z]);}
function line(points,color,width=1,dash=[]){ctx.beginPath();points.forEach((p,i)=>{i?ctx.lineTo(...project(...p)):ctx.moveTo(...project(...p))});ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function textAt(text,x,y,z,color='#78908b',size=11){const p=project(x,y,z);ctx.fillStyle=color;ctx.font=`${size}px "DM Sans", sans-serif`;ctx.textAlign='center';ctx.fillText(text,...p)}
function hull(points){const p=points.map(v=>[v[0],v[1],0]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);let l=[],u=[];for(const v of p){while(l.length>1&&cross(l.at(-2),l.at(-1),v)<=0)l.pop();l.push(v)}for(const v of p.slice().reverse()){while(u.length>1&&cross(u.at(-2),u.at(-1),v)<=0)u.pop();u.push(v)}return l.slice(0,-1).concat(u.slice(0,-1));}

const maps={lots:{src:'catastro-original2.png',cx:588,cy:558,width:1140,height:1041,points:[],frontPx:Math.hypot(5,74)},streets:{src:'mapa-original2.png',cx:621,cy:595,width:1239,height:1148,points:[],frontPx:Math.hypot(5,74)}};
maps.lots.points=hull(PARCELS.filter(p=>p.project).flatMap(p=>p.polygon));
const cadastralPPM=maps.lots.frontPx/state.frontage;
const cadastralWorld=([x,y])=>[(x-maps.lots.cx)/cadastralPPM,(maps.lots.cy-y)/cadastralPPM,0];
// SUM: dos niveles, altura provisional de 6 m; huella aproximada de la parcela marcada.
const sumParcel=PARCELS.find(p=>p.id===217);
const buildings=[
  {id:'tower',base:maps.lots.points.map(cadastralWorld),height:30,floorHeight:3.3},
  {id:'sum',base:hull(sumParcel.polygon.map(cadastralWorld)),height:6,floorHeight:3}
];
const parcelPolygons=PARCELS.filter(p=>!p.project&&p.id!==sumParcel.id&&!p.uncertain).map(p=>({...p,world:p.polygon.map(cadastralWorld),labelPoint:cadastralWorld(p.center)}));
const unresolvedPolygons=PARCELS.filter(p=>p.uncertain).map(p=>p.polygon.map(cadastralWorld));
function shadowFootprint(sun,building=buildings[0]){const base=building.base;if(sun.up<=0)return [];const theta=state.rotation*rad,e=-building.height*sun.east/sun.up,n=-building.height*sun.north/sun.up,dx=e*Math.cos(theta)+n*Math.sin(theta),dy=n*Math.cos(theta)-e*Math.sin(theta);return hull([...base,...base.map(p=>[p[0]+dx,p[1]+dy,0])]);}
function affectedParcels(sun){
  const shadows=buildings.map(b=>shadowFootprint(sun,b)).filter(p=>p.length);
  const hits=parcelPolygons.filter(p=>shadows.some(shadow=>ParcelGeometry.overlapArea(p.world,shadow)>.05));
  const outside=shadows.some(shadow=>shadow.some(p=>{const x=p[0]*cadastralPPM+maps.lots.cx,y=maps.lots.cy-p[1]*cadastralPPM;return x<0||y<0||x>maps.lots.width||y>maps.lots.height}));
  const unresolved=unresolvedPolygons.some(p=>shadows.some(shadow=>ParcelGeometry.overlapArea(p,shadow)>.05));
  return {shadow:shadows[0]||[],shadows,hits,outside,unresolved};
}
function drawBuildings(){
  const depth=p=>(p[0]*Math.sin(state.yaw)+p[1]*Math.cos(state.yaw))*Math.sin(state.pitch)-p[2]*Math.cos(state.pitch);
  const surfaces=[];
  for(const b of buildings){
    const top=b.base.map(p=>[p[0],p[1],b.height]),isSum=b.id==='sum';
    if(!state.flat)b.base.forEach((p,i)=>{const j=(i+1)%b.base.length;surfaces.push({pts:[p,b.base[j],top[j],top[i]],fill:isSum?['#478c87','#5b9e98','#70aaa3','#397d79'][i%4]:['#c38b38','#d6a04e','#e5b667','#be8d3e'][i%4],b,wall:true});});
    surfaces.push({pts:top,fill:isSum?'#86c5b9':'#efb74c',b,wall:false});
  }
  surfaces.sort((a,b)=>b.pts.reduce((n,p)=>n+depth(p),0)/b.pts.length-a.pts.reduce((n,p)=>n+depth(p),0)/a.pts.length);
  for(const f of surfaces){
    polygon(f.pts,f.fill,f.b.id==='sum'?'#286d66':'#8d581b');
    if(f.wall){for(let z=f.b.floorHeight;z<f.b.height;z+=f.b.floorHeight)line(f.pts.slice(0,2).map(p=>[p[0],p[1],z]),f.b.id==='sum'?'#bce2d9':'#f7d38a',.6);}
    else if(f.b.id==='sum'){const p=cadastralWorld(sumParcel.center);textAt('SUM',p[0],p[1],f.b.height,'#123f3b',11);}
  }
  // Acceso vehicular aproximado sobre el frente de Origone.
  const entry=cadastralWorld([672,531]),street=cadastralWorld([692,536]);
  line([entry,street],'#286d66',3);
  const [x,y]=project(...street);ctx.fillStyle='#123f3b';ctx.font='bold 11px sans-serif';ctx.textAlign=x>W-145?'right':'left';ctx.fillText(W<500?'↔ Acceso':'↔ Acceso vehicular',x>W-145?x-5:x+5,y+4);
}
SoundView.init();
let soundFrame=null,soundLast=0;
for(const m of Object.values(maps)){m.image=new Image();m.image.onload=()=>draw();m.image.onerror=()=>{$('sunstatus').textContent='No se pudo cargar el mapa. Recargá la página.'};m.image.src=m.src;}
function draw(){if(window.Urban?.active){window.Urban.draw();return;}ctx.clearRect(0,0,W,H);const m=maps[state.base],ppm=m.frontPx/state.frontage;scale=Math.min(W/(m.image.naturalWidth||m.width),H/(m.image.naturalHeight||m.height))*.98*ppm*state.zoom;const sun=solar(state.date,state.minutes),toWorld=([x,y])=>[(x-m.cx)/ppm,(m.cy-y)/ppm,0],base=maps.lots.points.map(cadastralWorld),top=base.map(p=>[p[0],p[1],30]);ctx.fillStyle='#edf1ef';ctx.fillRect(0,0,W,H);
if(m.image.complete&&m.image.naturalWidth){const p0=project(...toWorld([0,0])),px=project(...toWorld([1,0])),py=project(...toWorld([0,1]));ctx.save();ctx.transform(px[0]-p0[0],px[1]-p0[1],py[0]-p0[0],py[1]-p0[1],p0[0],p0[1]);ctx.drawImage(m.image,0,0);ctx.restore();}
if(state.mode==='sun'){
const impact=affectedParcels(sun);$('affectedCount').textContent=(impact.outside||impact.unresolved?'≥ ':'')+impact.hits.length;$('impactScope').textContent=sun.up<=0?'':impact.outside?'Conteo parcial: la sombra sale del mapa':impact.unresolved?'Conteo parcial: algunos límites no son legibles':'En el mapa disponible · estimación';
for(const lot of impact.hits){polygon(lot.world,'#f477493b','#bd3a19');}
const theta=state.rotation*rad,geoToMap=(east,north)=>[east*Math.cos(theta)+north*Math.sin(theta),north*Math.cos(theta)-east*Math.sin(theta)];
if(sun.up>0){const [dx,dy]=geoToMap(-30*sun.east/sun.up,-30*sun.north/sun.up);ctx.beginPath();for(const shadow of impact.shadows){shadow.forEach((p,i)=>{const q=project(...p);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath()}ctx.fillStyle='#274e745f';ctx.fill();ctx.strokeStyle='#244e78';ctx.lineWidth=.7;ctx.stroke();line([[0,0,0],[dx,dy,0]],'#163d6a',1.5,[5,5]);}

for(const [i,lot]of impact.hits.entries()){polygon(lot.world,null,'#bd3a19');const [lx,ly]=project(...lot.labelPoint);ctx.beginPath();ctx.arc(lx,ly,9,0,Math.PI*2);ctx.fillStyle='#b84021';ctx.fill();ctx.fillStyle='white';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(String(i+1),lx,ly+3);}
}
if(state.mode==='sound')SoundView.render();
drawBuildings();
if(state.mode==='sound')SoundView.overlay();
ctx.save();ctx.translate(W-66,91);ctx.fillStyle='#ffffffed';ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.fill();for(const [letter,az]of [['N',0],['E',90],['S',180],['O',270]]){const a=(state.rotation+az)*rad-state.yaw,rawX=Math.sin(a),rawY=-Math.cos(a)*(state.flat?1:Math.cos(state.pitch)),norm=Math.hypot(rawX,rawY),dx=rawX/norm,dy=rawY/norm;ctx.beginPath();ctx.moveTo(dx*8,dy*8);ctx.lineTo(dx*24,dy*24);ctx.strokeStyle=letter==='N'?'#c17518':'#6a8180';ctx.lineWidth=letter==='N'?2.5:1;ctx.stroke();ctx.fillStyle=letter==='N'?'#a96416':'#4b6668';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(letter,dx*33,dy*33+4)}ctx.restore();
}

function update(){const s=solar(state.date,state.minutes);$('time').value=state.minutes;$('timeLabel').value=String(Math.floor(state.minutes/60)).padStart(2,'0')+':'+String(Math.floor(state.minutes%60)).padStart(2,'0');$('datecaption').textContent=new Date(state.date+'T12:00:00Z').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).toUpperCase();$('length').textContent=s.length===null?'Sin sol':s.length>999?'> 999 m':Math.round(s.length)+' m';$('altitude').textContent=s.alt.toFixed(1)+'°';const dir=(s.az+180)%360,names=['Norte','Noreste','Este','Sudeste','Sur','Sudoeste','Oeste','Noroeste'];$('direction').textContent=s.up>0?names[Math.round(dir/45)%8]:'—';$('sunstatus').textContent=s.up<=0?'':s.alt<5?'Sol cerca del horizonte: parte de la sombra queda fuera de la vista.':'Sombra proyectada sobre el suelo.';$('month').value=state.date.slice(5,7);draw();return {date:state.date,time:$('timeLabel').value,solarElevation:s.alt,shadowLength:s.length,shadowDirection:s.up>0?dir:null};}
$('time').addEventListener('input',e=>{stop();state.minutes=+e.target.value;update()});$('date').addEventListener('change',e=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)||!e.target.validity.valid){e.target.value=state.date;return}state.date=e.target.value;update()});function dateInMonth(date,month){const [year,,day]=date.split('-').map(Number),lastDay=new Date(Date.UTC(year,Number(month),0)).getUTCDate();return year+'-'+String(month).padStart(2,'0')+'-'+String(Math.min(day,lastDay)).padStart(2,'0');}
$('month').addEventListener('change',e=>{const month=e.target.value;if(!/^(0[1-9]|1[0-2])$/.test(month))return;state.date=dateInMonth(state.date,month);$('date').value=state.date;update()});
function stop(){clearInterval(playing);playing=null;if(soundFrame!==null)cancelAnimationFrame(soundFrame);soundFrame=null;soundLast=0;$('playIcon').textContent='▶';$('playText').textContent='Recorrer el día';$('play').setAttribute('aria-pressed','false');}
function soundTick(now){if(state.mode!=='sound'){stop();return;}const dt=soundLast?Math.min((now-soundLast)/1000,.1):0;soundLast=now;state.minutes+=dt*.05;if(state.minutes>=1439){state.minutes=1439;stop();update();return;}update();soundFrame=requestAnimationFrame(soundTick);}
$('play').onclick=()=>{if(playing||soundFrame!==null){stop();return;}if(state.mode==='sound'){if(state.minutes>=1439)state.minutes=0;soundFrame=requestAnimationFrame(soundTick);}else{if(state.minutes>=1080)state.minutes=480;playing=setInterval(()=>{state.minutes+=5;if(state.minutes>=1080){state.minutes=1080;stop()}update()},130);}$('playIcon').textContent='Ⅱ';$('playText').textContent='Pausar';$('play').setAttribute('aria-pressed','true');};
function setSimulation(mode){stop();state.mode=mode;const sound=mode==='sound';for(const button of document.querySelectorAll('[data-simulation]')){const active=button.dataset.simulation===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}for(const node of document.querySelectorAll('[data-sound-only]'))node.hidden=!sound;for(const node of document.querySelectorAll('[data-sun-only]'))node.hidden=sound;$('time').min=sound?0:480;$('time').max=sound?1439:1080;$('time').step=sound?1:5;state.minutes=sound?Math.floor(state.minutes):Math.max(480,Math.min(1080,Math.round(state.minutes/5)*5));document.querySelector('.ticks').innerHTML=(sound?['00:00','06:00','12:00','18:00','23:59']:['08:00','10:00','12:00','14:00','16:00','18:00']).map(t=>'<span>'+t+'</span>').join('');update();}
document.querySelectorAll('[data-simulation]').forEach(b=>b.onclick=()=>setSimulation(b.dataset.simulation));
document.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>{state.base=b.dataset.base;document.querySelectorAll('[data-base]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});draw()});

function setView(flat){if(window.Urban?.active)return window.Urban.setView(flat);state.flat=flat;state.yaw=flat?0:-.35;state.pitch=.85;state.panX=0;state.panY=0;state.zoom=flat?1:2.8;for(const [id,active]of [['view2d',flat],['view3d',!flat]]){$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}document.querySelector('.maphint').textContent=flat?'Arrastrá para desplazar · dos dedos para zoom':'Arrastrá para girar · dos dedos para zoom y desplazar';canvas.style.cursor=flat?'grab':'move';draw();}
$('view2d').onclick=()=>setView(true);$('view3d').onclick=()=>setView(false);$('zoomIn').onclick=()=>{state.zoom=Math.min(window.Urban?.active?30:5,state.zoom*1.3);draw()};$('zoomOut').onclick=()=>{state.zoom=Math.max(window.Urban?.active ? .006 : .5,state.zoom/1.3);draw()};$('reset').onclick=()=>setView(state.flat);
// Track each contact independently so a second finger starts a pinch, not a rotation.
const activePointers=new Map();
const clampZoom=value=>Math.max(window.Urban?.active ? .006 : .5,Math.min(window.Urban?.active?30:5,value));
function pointerPair(){const points=[...activePointers.values()];if(points.length<2)return null;const [a,b]=points;return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(a.x-b.x,a.y-b.y)};}
canvas.onpointerdown=e=>{if(window.Urban?.pointerDown(e))return;if(e.pointerType==='mouse'&&e.button!==0)return;if(e.cancelable)e.preventDefault();activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{if(window.Urban?.pointerMove(e))return;const previous=activePointers.get(e.pointerId);if(!previous)return;if(e.cancelable)e.preventDefault();const before=pointerPair();activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const after=pointerPair();if(before&&after){if(before.distance>2&&after.distance>2){const nextZoom=clampZoom(state.zoom*after.distance/before.distance),ratio=nextZoom/state.zoom,rect=canvas.getBoundingClientRect(),originX=W*.5,originY=H*.54;state.panX=after.x-rect.left-originX-(before.x-rect.left-originX-state.panX)*ratio;state.panY=after.y-rect.top-originY-(before.y-rect.top-originY-state.panY)*ratio;state.zoom=nextZoom;}}else{const dx=e.clientX-previous.x,dy=e.clientY-previous.y;if(state.flat){state.panX+=dx;state.panY+=dy}else{state.yaw+=dx*.006;state.pitch=Math.max(.25,Math.min(1.2,state.pitch+dy*.004));}}draw();};
function endPointer(e){window.Urban?.pointerUp(e);activePointers.delete(e.pointerId);if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);}
canvas.onpointerup=canvas.onpointercancel=endPointer;canvas.onlostpointercapture=e=>activePointers.delete(e.pointerId);
canvas.onwheel=e=>{e.preventDefault();state.zoom=Math.max(window.Urban?.active ? .006 : .5,Math.min(window.Urban?.active?30:5,state.zoom*Math.exp(-e.deltaY*.001)));draw()};canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();if(state.flat){if(e.key==='ArrowLeft')state.panX+=20;if(e.key==='ArrowRight')state.panX-=20;if(e.key==='ArrowUp')state.panY+=20;if(e.key==='ArrowDown')state.panY-=20}else{if(e.key==='ArrowLeft')state.yaw-=.12;if(e.key==='ArrowRight')state.yaw+=.12;if(e.key==='ArrowUp')state.pitch=Math.max(.25,state.pitch-.08);if(e.key==='ArrowDown')state.pitch=Math.min(1.2,state.pitch+.08)}if(e.key==='+')state.zoom=Math.min(window.Urban?.active?30:5,state.zoom*1.1);if(e.key==='-')state.zoom=Math.max(window.Urban?.active ? .006 : .5,state.zoom/1.1);draw()}};
new ResizeObserver(()=>{const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;W=r.width;H=r.height;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}).observe(canvas);
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'configure_shadow_simulation',title:'Configurar simulación de sombras',description:'Cambiar fecha y hora local para explorar la sombra del proyecto.',inputSchema:{type:'object',properties:{date:{type:'string',description:'Fecha YYYY-MM-DD, entre 2020 y 2100'},minutes:{type:'integer',minimum:0,maximum:1439}},required:['date','minutes'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||input.date<'2020-01-01'||input.date>'2100-12-31'||!Number.isInteger(input.minutes)||input.minutes<(state.mode==='sound'?0:480)||input.minutes>(state.mode==='sound'?1439:1080))throw Error('Fecha u hora no válida');const parsed=new Date(input.date+'T12:00:00Z');if(!Number.isFinite(+parsed)||parsed.toISOString().slice(0,10)!==input.date)throw Error('Fecha inexistente');stop();state.date=input.date;state.minutes=input.minutes;$('date').value=state.date;return update()}})).catch(()=>{})}catch{}}
setView(true);
update();

window.Legacy={state,canvas,ctx,project,polygon,line,draw,update,stop,setView,setSimulation,dimensions:()=>({width:W,height:H,scale}),setScale:value=>scale=value};
