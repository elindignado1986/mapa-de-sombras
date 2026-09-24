// Prepare the image locally; the Instagram button opens Instagram, not the OS share sheet.
export function instagramShare(){
 const button=document.getElementById('instagramShare'),area=document.getElementById('instagramArea'),download=document.getElementById('instagramDownload'),preview=document.getElementById('instagramPreview'),message=document.getElementById('shareMessage');
 let file=null,objectURL=null,generation=0;
 button.onclick=()=>{if(!file)return;area.hidden=false;window.open('https://www.instagram.com/','_blank','noopener,noreferrer');message.textContent='Instagram se abre en otra pestaña o en la app si el dispositivo lo permite. Descargá la imagen y elegila al crear la publicación. No se adjunta automáticamente.';};
 return function prepare({canvas,place,date,time,height,count}){const token=++generation;button.disabled=true;file=null;area.hidden=true;if(objectURL){URL.revokeObjectURL(objectURL);objectURL=null;}download.removeAttribute('href');preview.removeAttribute('src');
  const out=document.createElement('canvas');out.width=1080;out.height=1350;const c=out.getContext('2d');c.fillStyle='#f6f7f7';c.fillRect(0,0,1080,1350);c.fillStyle='#23484c';c.font='bold 48px sans-serif';c.fillText('Mapa de sombras',54,85);c.font='30px sans-serif';c.fillText(place,54,140);c.fillStyle='#e9b451';c.fillRect(54,170,972,6);
  const k=Math.min(972/canvas.width,820/canvas.height),w=canvas.width*k,h=canvas.height*k;c.drawImage(canvas,(1080-w)/2,205+(820-h)/2,w,h);
  c.fillStyle='#23484c';c.font='bold 32px sans-serif';c.fillText(`${date} · ${time} · Altura: ${height} m`,54,1085);c.font='28px sans-serif';c.fillText(`${count} lotes alcanzados en la vista`,54,1135);c.font='22px sans-serif';c.fillText('Estimación exploratoria · sombras sobre suelo · conteo parcial',54,1180);c.fillText('Parcelas: ARBA · Calles y referencias: © OpenStreetMap',54,1220);c.font='bold 30px sans-serif';c.fillText('@mapadesombras',54,1290);
  out.toBlob(blob=>{if(token!==generation)return;if(!blob){message.textContent='No pudimos preparar la imagen para Instagram.';return;}file=new File([blob],'mapa-de-sombras-instagram.png',{type:'image/png'});objectURL=URL.createObjectURL(blob);download.href=objectURL;preview.src=objectURL;button.disabled=false;},'image/png');
 };
}
