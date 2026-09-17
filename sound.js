/* Automatic schematic sources from the supplied functional description.
   Normalized visual activity is not a decibel estimate or an acoustic solver. */
const SoundSimulation=(()=>{
  const config={
    apartments:52,floors:8,shops:8,
    weights:{balcony:.60,commercial:.55,sum:.42,sumTerrace:.65,barbecue:.60,gym:.32,sauna:.08,motor:.38,gate:.20,alarm:.70},
    normalization:{balcony:1/13,commercial:1/8,amenities:.65,access:1},
    graphicSpread:22,displayCutoff:.035,parcelOutlineThreshold:.12,
    pulseDuration:20,pulsePeriods:{peak:90,day:600,night:1800},
    busyEveningDays:[4,5,6,0],busyStart:1140,busyEnd:60,
    profiles:{
      residential:[[0,.12],[60,.06],[360,.02],[480,.30],[600,.15],[840,.25],[1080,.38],[1170,.50],[1320,.38],[1440,.12]],
      commercial:[[0,.03],[60,0],[420,0],[480,.20],[600,.65],[840,.55],[1020,.65],[1140,.70],[1260,.40],[1380,.10],[1440,.03]],
      amenities:[[0,.10],[60,0],[600,0],[780,.30],[960,.25],[1080,.35],[1170,.55],[1320,.40],[1440,.10]],
      gym:[[0,0],[390,0],[480,.60],[600,.20],[840,.20],[1020,.40],[1170,.65],[1260,.25],[1380,0],[1440,0]],
      sauna:[[0,0],[660,0],[840,.15],[1080,.35],[1170,.45],[1320,.10],[1380,0],[1440,0]],
      access:[[0,.05],[60,0],[360,0],[450,.50],[480,.80],[540,.35],[660,.15],[840,.25],[1020,.20],[1080,.60],[1170,.85],[1260,.45],[1380,.10],[1440,.05]]
    }
  };
  let sources=[];
  const clamp=x=>Math.max(0,Math.min(1,x));
  function interpolate(points,t){const m=((t%1440)+1440)%1440;for(let i=1;i<points.length;i++)if(m<=points[i][0]){const a=points[i-1],b=points[i],u=(m-a[0])/(b[0]-a[0]);return a[1]+u*(b[1]-a[1]);}return 0;}
  function init(buildings,toWorld){
    const tower=buildings.find(b=>b.id==='tower'),sum=buildings.find(b=>b.id==='sum'),base=tower.base;
    const center=base.reduce((p,v)=>[p[0]+v[0]/base.length,p[1]+v[1]/base.length],[0,0]);
    const edges=base.map((a,i)=>{const b=base[(i+1)%base.length],length=Math.hypot(b[0]-a[0],b[1]-a[1]),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];let normal=[(b[1]-a[1])/length,-(b[0]-a[0])/length];if(normal[0]*(mid[0]-center[0])+normal[1]*(mid[1]-center[1])<0)normal=normal.map(n=>-n);return {a,b,length,mid,normal};});
    const perimeter=edges.reduce((n,e)=>n+e.length,0);
    function boundary(fraction){let d=fraction*perimeter;for(const e of edges){if(d<=e.length)return {point:[e.a[0]+(e.b[0]-e.a[0])*d/e.length,e.a[1]+(e.b[1]-e.a[1])*d/e.length],normal:e.normal};d-=e.length;}return {point:edges[0].a,normal:edges[0].normal};}
    sources=[];let index=0;
    for(let floor=1;floor<=config.floors;floor++){
      const count=Math.floor(config.apartments/config.floors)+(floor<=config.apartments%config.floors?1:0);
      for(let i=0;i<count;i++){
        const {point,normal}=boundary((i+.5)/count),z=floor*tower.height/(config.floors+1);
        sources.push({id:'balcony-'+(++index),label:'Balcón residencial · piso '+floor,group:'residential',type:'balcony',profile:'residential',kind:'activity',floor,normal,position:[point[0]+normal[0]*.7,point[1]+normal[1]*.7,z],factor:config.normalization.balcony});
      }
    }
    // Wernicke borders the western side of the current footprint.
    const west=edges.filter(e=>e.length>Math.max(...edges.map(e=>e.length))*.25).sort((a,b)=>a.mid[0]-b.mid[0])[0];
    for(let i=0;i<config.shops;i++){const u=(i+.5)/config.shops;sources.push({id:'shop-'+(i+1),label:'Local '+(i+1)+' · Wernicke',group:'commercial',type:'commercial',profile:'commercial',kind:'activity',normal:west.normal,position:[west.a[0]+(west.b[0]-west.a[0])*u+west.normal[0]*.7,west.a[1]+(west.b[1]-west.a[1])*u+west.normal[1]*.7,1.5],factor:config.normalization.commercial});}
    // Amenities share a sector, without pretending to survey individual room positions.
    const c=sum.base.reduce((p,v)=>[p[0]+v[0]/sum.base.length,p[1]+v[1]/sum.base.length],[0,0]);
    for(const [type,label,profile]of [['sum','SUM interior','amenities'],['sumTerrace','Terraza del SUM al aire libre','amenities'],['barbecue','Parrilla del SUM','amenities'],['gym','Gimnasio','gym'],['sauna','Sauna','sauna']])sources.push({id:type,label,group:'amenities',type,profile,kind:'activity',position:[...c,sum.height/2],factor:config.normalization.amenities});
    const entry=toWorld([672,531]);
    for(const [type,label,z]of [['motor','Ingreso y egreso de autos',.5],['gate','Apertura y cierre del portón',1],['alarm','Aviso de portón / chicharra',2]])sources.push({id:type,label,group:'amenities',type,profile:'access',kind:'event',position:[entry[0],entry[1],z],factor:config.normalization.access});
  }
  function schedule(date,minutes){
    const m=((minutes%1440)+1440)%1440,day=new Date(date+'T12:00:00Z').getUTCDay();
    // After midnight the busy evening belongs to the previous calendar day.
    const eveningDay=m<config.busyEnd?(day+6)%7:day;
    const busyNight=config.busyEveningDays.includes(eveningDay)&&(m>=config.busyStart||m<config.busyEnd);
    const boost=busyNight?(m>=1140?Math.min(1,(m-1140)/30+.65):Math.min(1,(60-m)/15)):0;
    return {busyNight,boost,day,eveningDay};
  }
  function snapshot(date,minutes,filter='all'){
    const timing=schedule(date,minutes),t=(((minutes*60)%86400)+86400)%86400;
    const active=sources.filter(s=>filter==='all'||s.group===filter).map(s=>{
      let activity=interpolate(config.profiles[s.profile],minutes);
      const boostTarget={residential:.85,commercial:.45,amenities:.95,gym:.65,sauna:.45,access:.65}[s.profile];
      activity=clamp(Math.max(activity,boostTarget*timing.boost));
      const period=activity>.45?config.pulsePeriods.peak:activity>.12?config.pulsePeriods.day:config.pulsePeriods.night,phase=((t+5)%period)/config.pulseDuration;
      const pulse=s.kind==='event'&&activity>.03&&phase<1?Math.sin(Math.PI*phase):0;
      return {...s,activity,phase:s.kind==='event'&&activity>.03&&phase<1?phase:null,strength:config.weights[s.type]*s.factor*activity*(s.kind==='event'?pulse:1)};
    });
    return {sources:active,total:sources.length,...timing};
  }
  function kernel(x,y,s){const [sx,sy,sz]=s.position,dx=x-sx,dy=y-sy,d2=dx*dx+dy*dy+sz*sz;const directional=s.normal?(.55+.45*Math.max(0,(dx*s.normal[0]+dy*s.normal[1])/Math.max(.1,Math.hypot(dx,dy)))):1;return directional*Math.exp(-d2/(2*config.graphicSpread**2));}
  function field(x,y,active){let total=0;for(const s of active)if(s.strength>0)total+=s.strength*kernel(x,y,s);return 1-Math.exp(-total);}
  return {config,init,list:()=>sources.map(s=>({...s,position:s.position.slice()})),snapshot,field,kernel,schedule};
})();
