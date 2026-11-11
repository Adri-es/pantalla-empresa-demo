'use strict';
const $ = id => document.getElementById(id);
const screen = $('screen'), photo = $('photo'), movie = $('movie'), progress = $('progress');
let items = [], index = 0, timer = null, frame = null, version = '', lastUpdate = 0, sequence = 0, started = 0, duration = 0;
const stamp = () => new Date().toLocaleTimeString('es-GT',{hour:'2-digit',minute:'2-digit'});
function setStatus(message){ $('status').textContent = message; }
function resetTimers(){ if(timer) clearTimeout(timer); if(frame) cancelAnimationFrame(frame); timer = null; frame = null; movie.pause(); movie.onended = null; movie.onerror = null; }
function updateProgress(){
  if(!items.length) return;
  const elapsed = (performance.now()-started)/1000;
  let p = duration > 0 ? Math.min(1,elapsed/duration) : 0;
  if(items[index]?.type === 'video' && Number.isFinite(movie.duration) && movie.duration > 0) p = Math.min(1,movie.currentTime/movie.duration);
  progress.style.width=(p*100)+'%';
  frame = requestAnimationFrame(updateProgress);
}
function play(i=0){
  if(!items.length) return;
  resetTimers();
  const thisSequence = ++sequence;
  index = (i+items.length)%items.length;
  const item=items[index];
  photo.classList.remove('active'); movie.classList.remove('active');
  $('current-title').textContent=item.title || (item.type==='video'?'Video':'Imagen');
  $('counter').textContent=`${index+1} / ${items.length}`;
  document.querySelectorAll('.queue-item').forEach((el,j)=>el.classList.toggle('on',j===index));
  progress.style.width='0%'; started=performance.now(); duration=Number(item.duration)||8;
  setStatus(item.type==='video'?'Reproduciendo video':'Reproduciendo imagen');
  if(item.type==='image'){
    photo.onerror=()=>{if(sequence===thisSequence){setStatus('Imagen no disponible; pasando a la siguiente');timer=setTimeout(next,1500);}};
    photo.src=item.src; photo.classList.add('active'); timer=setTimeout(next,Math.max(1,duration)*1000);
  } else {
    movie.src=item.src; movie.classList.add('active'); movie.muted=true;
    movie.onended=()=>{if(sequence===thisSequence)next();};
    movie.onerror=()=>{if(sequence===thisSequence){setStatus('Video no disponible; pasando al siguiente');timer=setTimeout(next,1500);}};
    const attempt=movie.play();
    if(attempt && typeof attempt.catch==='function') attempt.catch(()=>{ if(sequence===thisSequence){setStatus('El navegador bloqueó el video; avanzando');timer=setTimeout(next,1800);} });
    // Avanza incluso si el archivo se queda cargando indefinidamente.
    timer=setTimeout(()=>{if(sequence===thisSequence)next();},120000);
  }
  updateProgress();
}
function next(){play(index+1);}
function renderQueue(){ $('playlist').replaceChildren(...items.map((item,i)=>{ const el=document.createElement('div');el.className='queue-item';const kind=document.createElement('span');kind.className='kind';kind.textContent=item.type==='video'?'▶ VIDEO':'▣ FOTO';el.append(kind,document.createTextNode(item.title||`Elemento ${i+1}`));return el;})); }
async function fetchList(first=false){
  try{
    const response=await fetch(`playlist.json?t=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const parsed=await response.json();
    if(!Array.isArray(parsed.items))throw new Error('Lista inválida');
    const valid=parsed.items.filter(it=>['image','video'].includes(it.type) && typeof it.src==='string' && it.src && !/^(https?:)?\/\//i.test(it.src));
    if(!valid.length)throw new Error('No hay contenido válido');
    const newVersion=JSON.stringify(valid);
    if(newVersion!==version){items=valid;version=newVersion;renderQueue();play(0);}
    lastUpdate=Date.now();
  }catch(err){ if(first && !items.length){setStatus(`No se pudo cargar playlist.json: ${err.message}`);$('current-title').textContent='Comprueba que abriste la página desde un servidor';} }
}
$('full').addEventListener('click',async()=>{try{await screen.requestFullscreen();}catch(e){setStatus('Pantalla completa no disponible: usa F11 en tu navegador');}});
$('exit').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();});
$('restart').addEventListener('click',()=>play(0));
$('year').textContent=new Date().getFullYear();
$('screen-clock').textContent=stamp();setInterval(()=>{$('screen-clock').textContent=stamp();},15000);
setInterval(()=>fetchList(false),60000);
fetchList(true);
