'use strict';
(() => {
  const $=id=>document.getElementById(id),defaults={dark:'oklch(0.1558 0.0063 285.64)',light:'oklch(0.94 0.0063 285.64)'};
  let state={layout:'glass',theme:'dark',colors:{...defaults}};
  try{const saved=JSON.parse(localStorage.getItem('hesuvi-appearance'));if(saved){if(['simple','glass'].includes(saved.layout))state.layout=saved.layout;if(['dark','light'].includes(saved.theme))state.theme=saved.theme;for(const theme of ['dark','light'])if(HesuviMaterials.parseColor(saved.colors?.[theme]))state.colors[theme]=saved.colors[theme];}}catch{}
  function apply(){const tokens=HesuviMaterials.materialTokens(state.theme,state.colors[state.theme]);for(const [key,value]of Object.entries(tokens.css))document.documentElement.style.setProperty(key,value);document.documentElement.style.colorScheme=state.theme;document.documentElement.dataset.theme=state.theme;document.documentElement.dataset.layout=state.layout;$('layout').value=state.layout;window.HesuviPalette=tokens.canvas;window.HesuviContrast=tokens.contrastReport;$('theme').value=state.theme;$('base-color').value=state.colors[state.theme];$('color-error').hidden=true;try{localStorage.setItem('hesuvi-appearance',JSON.stringify(state));}catch{}document.dispatchEvent(new Event('appearancechange'));}
  $('layout').onchange=()=>{state.layout=$('layout').value;clearLighting();apply();};
  apply();
  $('appearance').onclick=()=>{$('appearance-dialog').showModal();clearLighting();};
  $('close-appearance').onclick=()=>$('appearance-dialog').close();
  $('appearance-dialog').addEventListener('close',()=>{clearLighting();$('appearance').focus();});
  $('theme').onchange=()=>{state.theme=$('theme').value;apply();};
  $('color-form').onsubmit=e=>{e.preventDefault();const color=$('base-color').value.trim();if(!HesuviMaterials.parseColor(color)){$('color-error').textContent='Enter an opaque OKLCH color or a 3- or 6-digit hex color.';$('color-error').hidden=false;return;}state.colors[state.theme]=color;apply();};
  $('reset-color').onclick=()=>{state.colors[state.theme]=defaults[state.theme];apply();};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let pending=0,targetX=0,targetY=0,currentX=0,currentY=0,lastTime=0;
  let localSurfaces=[],pointerX=0,pointerY=0,currentPointerX=0,currentPointerY=0;
  const root=document.documentElement;
  function writeLighting(){
    root.style.setProperty('--light-x',(currentX*36).toFixed(2)+'px');
    root.style.setProperty('--light-y',(currentY*28).toFixed(2)+'px');
    root.style.setProperty('--light-angle',(120+currentX*28+currentY*16).toFixed(2)+'deg');
    root.style.setProperty('--cast-x',(-currentX*8).toFixed(2)+'px');
    root.style.setProperty('--cast-y',(8-currentY*5).toFixed(2)+'px');
    root.style.setProperty('--edge-x',(-currentX).toFixed(2)+'px');
    root.style.setProperty('--edge-y',(1-currentY*.6).toFixed(2)+'px');
  }
  function renderLighting(time){
    const dt=Math.min(50,time-lastTime||16);lastTime=time;
    const amount=1-Math.exp(-dt/110);
    currentX+=(targetX-currentX)*amount;currentY+=(targetY-currentY)*amount;
    currentPointerX+=(pointerX-currentPointerX)*amount;
    currentPointerY+=(pointerY-currentPointerY)*amount;
    for(const {element,rect} of localSurfaces){
      element.style.setProperty('--pointer-x',Math.max(0,Math.min(rect.width,currentPointerX-rect.left)).toFixed(2)+'px');
      element.style.setProperty('--pointer-y',Math.max(0,Math.min(rect.height,currentPointerY-rect.top)).toFixed(2)+'px');
    }
    writeLighting();
    if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.002||Math.abs(pointerX-currentPointerX)+Math.abs(pointerY-currentPointerY)>.15)pending=requestAnimationFrame(renderLighting);
    else{currentX=targetX;currentY=targetY;writeLighting();pending=0;lastTime=0;}
  }
  function clearLocalLighting(){for(const {element} of localSurfaces)element.style.removeProperty("--local-light");localSurfaces=[];}
  function clearLighting(){clearLocalLighting();if(pending)cancelAnimationFrame(pending);pending=0;lastTime=0;targetX=targetY=currentX=currentY=0;writeLighting();}
  document.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||reduce.matches||!fine.matches||state.layout!=='glass')return;
    pointerX=e.clientX;pointerY=e.clientY;
    const control=e.target instanceof Element?e.target.closest('button:not(:disabled),a.button,summary,input:not(:disabled),select'):null;
    const surface=e.target instanceof Element?e.target.closest('#drop-zone,#editor,#output,dialog'):null;
    const next=[...new Set([control,surface].filter(Boolean))];
    if(next.some(element=>!localSurfaces.some(entry=>entry.element===element))||next.length!==localSurfaces.length){
      clearLocalLighting();currentPointerX=pointerX;currentPointerY=pointerY;
      localSurfaces=next.map(element=>({element,rect:element.getBoundingClientRect()}));
      for(const {element} of localSurfaces)element.style.setProperty('--local-light','1');
    }
    targetX=Math.max(-1,Math.min(1,e.clientX/innerWidth*2-1));targetY=Math.max(-1,Math.min(1,e.clientY/innerHeight*2-1));
    if(!pending)pending=requestAnimationFrame(renderLighting);
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{clearLocalLighting();targetX=targetY=0;if(!pending&&!reduce.matches&&state.layout==='glass')pending=requestAnimationFrame(renderLighting);});
  document.addEventListener('pointercancel',clearLighting);window.addEventListener('blur',clearLighting);window.addEventListener('resize',clearLighting);window.addEventListener('scroll',clearLocalLighting,{passive:true});reduce.addEventListener('change',clearLighting);fine.addEventListener('change',clearLighting);
})();
