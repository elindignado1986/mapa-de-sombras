const SoundView=(()=>{
  const size=96,colors={residential:'#74539a',commercial:'#be6329',amenities:'#287d82'};
  let filter='all',snapshot=null,bounds=null,texture=null,pixels=null,values=null,lastKey='',kernels=new Map();
  const el=id=>document.getElementById(id);
  function init(){
    SoundSimulation.init(buildings,cadastralWorld);
    document.querySelectorAll('[data-sound-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.soundFilter;for(const x of document.querySelectorAll('[data-sound-filter]')){x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));}draw();});
    const all=SoundSimulation.list(),pad=SoundSimulation.config.graphicSpread*3;
    bounds={minX:Math.min(...all.map(s=>s.position[0]))-pad,maxX:Math.max(...all.map(s=>s.position[0]))+pad,minY:Math.min(...all.map(s=>s.position[1]))-pad,maxY:Math.max(...all.map(s=>s.position[1]))+pad};
    texture=document.createElement('canvas');texture.width=size;texture.height=size;pixels=texture.getContext('2d').createImageData(size,size);values=new Float32Array(size*size);
    for(const s of all){const kernel=new Float32Array(size*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++)kernel[y*size+x]=SoundSimulation.kernel(bounds.minX+(x+.5)/size*(bounds.maxX-bounds.minX),bounds.maxY-(y+.5)/size*(bounds.maxY-bounds.minY),s);kernels.set(s.id,kernel);}
  }
  function heat(){
    const active=snapshot.sources.filter(s=>s.strength>.0001),nextKey=filter+':'+active.map(s=>s.id+':'+Math.round(s.strength*10000)).join(',');
    if(nextKey!==lastKey){lastKey=nextKey;values.fill(0);pixels.data.fill(0);for(const s of active){const kernel=kernels.get(s.id);for(let i=0;i<values.length;i++)values[i]+=kernel[i]*s.strength;}for(let i=0;i<values.length;i++){const v=1-Math.exp(-values[i]);values[i]=v;if(v<SoundSimulation.config.displayCutoff)continue;const warm=Math.min(1,v*1.8),j=i*4;pixels.data[j]=38+210*warm;pixels.data[j+1]=159-78*warm;pixels.data[j+2]=172-129*warm;pixels.data[j+3]=Math.min(.65,v*.9)*255;}texture.getContext('2d').putImageData(pixels,0,0);}
    const b=bounds,p0=project(b.minX,b.maxY),px=project(b.maxX,b.maxY),py=project(b.minX,b.minY);ctx.save();ctx.transform((px[0]-p0[0])/size,(px[1]-p0[1])/size,(py[0]-p0[0])/size,(py[1]-p0[1])/size,p0[0],p0[1]);ctx.drawImage(texture,0,0);ctx.restore();
    function sample(p){const x=Math.floor((p[0]-b.minX)/(b.maxX-b.minX)*size),y=Math.floor((b.maxY-p[1])/(b.maxY-b.minY)*size);return x>=0&&y>=0&&x<size&&y<size?values[y*size+x]:0;}
    for(const lot of parcelPolygons)if([lot.labelPoint,...lot.world].some(p=>sample(p)>SoundSimulation.config.parcelOutlineThreshold))polygon(lot.world,null,'#64848b88');
  }
  function render(){
    snapshot=SoundSimulation.snapshot(state.date,state.minutes,filter);heat();
    const mean=snapshot.sources.reduce((n,s)=>n+s.activity,0)/snapshot.sources.length,level=mean>.65?'alta':mean>.25?'moderada':'baja';
    el('soundStatus').textContent='Actividad potencial '+level;
    el('soundPeriod').textContent=snapshot.busyNight?(state.minutes<60?'Continuación de la noche anterior · hasta la 01:00':'Mayor actividad nocturna · 19:00–01:00'):'Escenario horario habitual';
  }
  function overlay(){
    if(!snapshot)return;
    for(const s of snapshot.sources){
      const [x,y,z]=s.position;
      if(s.kind==='event'&&s.phase!==null&&s.strength>0){ctx.save();ctx.globalAlpha=(1-s.phase)*.8;for(const offset of [0,.22]){const radius=(s.phase+offset)*SoundSimulation.config.graphicSpread;line(Array.from({length:49},(_,i)=>[x+Math.cos(i*Math.PI/24)*radius,y+Math.sin(i*Math.PI/24)*radius,z]),s.type==='alarm'?'#bf542b':'#407b88',1.5);}ctx.restore();}
      if(s.kind==='event'||(s.group==='amenities'&&s.type!=='sumTerrace'))continue;
      // Avoid showing markers on the back facade through the opaque building.
      if(!state.flat&&s.normal&&s.normal[0]*-Math.sin(state.yaw)+s.normal[1]*-Math.cos(state.yaw)<0)continue;
      const p=project(x,y,z);ctx.beginPath();ctx.arc(p[0],p[1],s.group==='amenities'?4:2.1,0,Math.PI*2);ctx.fillStyle=colors[s.group];ctx.fill();ctx.strokeStyle='#ffffffb0';ctx.lineWidth=.7;ctx.stroke();
    }
  }
  return {init,render,overlay};
})();
