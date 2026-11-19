import {spawn} from 'node:child_process';
import {mkdtemp,readFile,mkdir,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const stage=process.argv[2]||'before';
const pagePath=process.argv[3]||'/';
const widths=(process.argv[4]||'320,390,768,1024,1440').split(',').map(Number);
const viewportHeight=Number(process.argv[5]||900);
const profile=await mkdtemp(path.join(tmpdir(),'globaxify-layout-'));
const browser=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
browser.on('error',error=>{console.error(error.message);process.exitCode=1;});
let socket;
try {
 let port;
 for(let i=0;i<100;i++){try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 if(!port)throw Error('Headless Edge did not expose a debugging endpoint.');
 const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
 const target=targets.find(t=>t.type==='page');
 socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 let id=0;const pending=new Map();
 socket.onmessage=event=>{const message=JSON.parse(event.data);if(message.id){const promise=pending.get(message.id);pending.delete(message.id);message.error?promise.reject(Error(message.error.message)):promise.resolve(message.result);}};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});
 await send('Page.enable');await send('Network.enable');await send('Network.setBlockedURLs',{urls:['*googlesyndication.com*','*doubleclick.net*']});await mkdir('output/layout-check',{recursive:true});
 const result=[];
 for(const width of widths){
  await send('Emulation.setDeviceMetricsOverride',{width,height:viewportHeight,deviceScaleFactor:1,mobile:width<700});
  await send('Page.navigate',{url:'http://127.0.0.1:5501'+pagePath});
  for(let i=0;i<80;i++){const state=await send('Runtime.evaluate',{expression:"document.readyState !== 'loading' && !!document.querySelector('.header-brand,.portfolio-header-brand')",returnByValue:true});if(state.result.value===true)break;await new Promise(r=>setTimeout(r,100));}
  await send('Runtime.evaluate',{expression:'Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))])',awaitPromise:true});
  if(stage.startsWith('projects')){
    await send('Runtime.evaluate',{expression:"document.querySelector('#projects').scrollIntoView({behavior:'instant',block:'start'})"});
    await send('Runtime.evaluate',{expression:'new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))',awaitPromise:true});
  }
  if(stage.startsWith('services')){
    await send('Runtime.evaluate',{expression:"(()=>{const e=document.querySelector('#services');window.scrollTo({top:e.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(e).getPropertyValue('--service-top')),behavior:'instant'})})()"});
    await send('Runtime.evaluate',{expression:'new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))',awaitPromise:true});
  }
  if(stage.startsWith('policy')){
    const check=await send('Runtime.evaluate',{expression:`(()=>{
      const assert=(v,m)=>{if(!v)throw Error(m)};
      const sections=[...document.querySelectorAll('.policy-section')];
      assert(sections.length>=4,'Policy content missing');
      assert(document.querySelectorAll('.policy-switcher [aria-current="page"]').length===1,'Current policy tab');
      assert([...document.querySelectorAll('.policy-toc a')].every(a=>document.getElementById(a.hash.slice(1))),'TOC links');
      assert(document.querySelector('.policy-back-home').getAttribute('href')==='index.html','Home link');
      assert(document.documentElement.scrollWidth<=innerWidth,'Page overflow');
      assert([...document.querySelectorAll('.policy-document,.policy-section')].every(e=>e.scrollWidth<=e.clientWidth+1),'Content overflow');
      return {sections:sections.length,links:true,overflow:false};
    })()`,returnByValue:true});
    if(check.exceptionDetails)throw Error(check.exceptionDetails.exception?.description||check.exceptionDetails.text);
    console.log('Policy checks: '+JSON.stringify(check.result.value));
  }
  let catalogCheck;
  if(stage.startsWith('work')){
    const check=await send('Runtime.evaluate',{expression:`(()=>{
      const root=document.querySelector('.work-library');if(!root)throw Error('Missing project gallery');
      const cards=[...root.querySelectorAll('.work-card')],visible=()=>cards.filter(c=>!c.hidden);
      const tab=value=>root.querySelector('[data-work-filter="'+value+'"]');
      const search=root.querySelector('#work-search'),industry=root.querySelector('#work-industry');
      const assert=(value,message)=>{if(!value)throw Error(message)};
      assert(cards.length===8,'Expected 8 projects');
      tab('business').click();assert(visible().length===1&&visible()[0].dataset.name==='Al Taqwa Services','Business category');
      tab('ecommerce').click();assert(visible().length===7,'Ecommerce category');
      search.value='Gymshark';search.dispatchEvent(new Event('input',{bubbles:true}));assert(visible().length===1,'Search');
      industry.value='beauty';industry.dispatchEvent(new Event('change',{bubbles:true}));assert(visible().length===0&&!root.querySelector('.work-empty').hidden,'Empty search result');
      root.querySelector('.work-empty-reset').click();assert(visible().length===8&&search.value==='','Reset');
      industry.value='home';industry.dispatchEvent(new Event('change',{bubbles:true}));assert(visible().length===2,'Industry filter');
      root.querySelector('.work-reset').click();assert(visible().length===8,'Clear filters');
      const combo=root.querySelector('.work-industry .review-select-trigger');
      if(combo){
        combo.click();assert(combo.getAttribute('aria-expanded')==='true','Open industry dropdown');
        combo.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}));combo.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
        assert(industry.value==='business'&&visible().length===1,'Keyboard industry choice');
        combo.click();combo.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(combo.getAttribute('aria-expanded')==='false','Escape dropdown');
        root.querySelector('.work-reset').click();assert(combo.textContent==='All industries','Clear resets custom dropdown');
      }
      const home=document.querySelector('.work-back-home');assert(home&&home.getAttribute('href')==='index.html'&&home.textContent.includes('Back to Home'),'Clear home link');
      const menu=document.querySelector('.hamburger');
      if(getComputedStyle(menu).display!=='none'){menu.click();assert(menu.getAttribute('aria-expanded')==='true','Open mobile menu');document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(menu.getAttribute('aria-expanded')==='false','Close mobile menu');}
      search.blur();window.scrollTo({top:0,behavior:'instant'});
      const bounds=root.querySelector('.work-controls').getBoundingClientRect();assert(bounds.left>=0&&bounds.right<=document.documentElement.clientWidth+1,'Controls overflow');
      assert(cards.every(c=>c.scrollWidth<=c.clientWidth+1),'Card text overflow');
      return {projects:cards.length,categories:2,filters:true,industry:true,search:true,emptyState:true,reset:true,mobileMenu:true,overflow:false};
    })()`,returnByValue:true});
    if(check.exceptionDetails)throw Error(check.exceptionDetails.exception?.description||check.exceptionDetails.text);
    catalogCheck=check.result.value;
    const images=await send('Runtime.evaluate',{expression:`Promise.all([...document.querySelectorAll('.work-card-preview img')].map(async image=>{image.loading='eager';await image.decode();return {width:image.naturalWidth,source:image.getAttribute('src')};}))`,awaitPromise:true,returnByValue:true});
    if(images.exceptionDetails)throw Error(images.exceptionDetails.exception?.description||images.exceptionDetails.text);
    catalogCheck.images=images.result.value.length;
    if(stage==='work-dropdown')await send('Runtime.evaluate',{expression:"document.querySelector('.work-industry .review-select-trigger').click()"});
    if(images.result.value.some(image=>!image.width))throw Error('A project preview did not load');
    await send('Runtime.evaluate',{expression:'new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))',awaitPromise:true});
  }
  const measured=await send('Runtime.evaluate',{expression:`(()=>{const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,width:r.width,height:r.height,display:getComputedStyle(e).display}};return {width:innerWidth,header:{logo:rect(document.querySelector('.header-brand,.portfolio-header-brand')),portfolio:rect(document.querySelector('.header-portfolio,.portfolio-header .nav-cta')),menu:rect(document.querySelector('.hamburger,.portfolio-header .menu-btn'))},sections:[...document.querySelectorAll('body>section,main>section')].map(e=>({id:e.id,height:e.offsetHeight,paddingTop:getComputedStyle(e).paddingTop,paddingBottom:getComputedStyle(e).paddingBottom,marginTop:getComputedStyle(e).marginTop,marginBottom:getComputedStyle(e).marginBottom})),scrollWidth:document.documentElement.scrollWidth,serviceCards:[...document.querySelectorAll('.service-panel')].map(e=>({name:e.querySelector('h3').textContent,features:e.querySelectorAll('li').length,overflow:e.querySelector('.service-panel-copy').getBoundingClientRect().bottom>e.getBoundingClientRect().bottom-4})),projectCards:[...document.querySelectorAll('.case-card')].map(e=>({name:e.querySelector('h3').textContent,active:e.classList.contains('is-active'),paragraphs:e.querySelectorAll('.case-details>p').length,highlights:e.querySelectorAll('.case-highlights li').length,background:getComputedStyle(e).backgroundColor,filter:getComputedStyle(e).filter,textPanel:getComputedStyle(e.querySelector('.case-details')).backgroundColor,overflow:e.querySelector('.case-details').scrollWidth>e.querySelector('.case-details').clientWidth}))}})()`,returnByValue:true});
  result.push({...measured.result.value,catalogCheck});
  if(width===390||width===1440){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`output/layout-check/${stage}-${width}.png`,Buffer.from(shot.data,'base64'));}
 }
 await writeFile(`output/layout-check/${stage}.json`,JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
} finally {socket?.close();browser.kill();}
