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
  const measured=await send('Runtime.evaluate',{expression:`(()=>{const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,width:r.width,height:r.height,display:getComputedStyle(e).display}};return {width:innerWidth,header:{logo:rect(document.querySelector('.header-brand,.portfolio-header-brand')),portfolio:rect(document.querySelector('.header-portfolio,.portfolio-header .nav-cta')),menu:rect(document.querySelector('.hamburger,.portfolio-header .menu-btn'))},sections:[...document.querySelectorAll('body>section,main>section')].map(e=>({id:e.id,height:e.offsetHeight,paddingTop:getComputedStyle(e).paddingTop,paddingBottom:getComputedStyle(e).paddingBottom,marginTop:getComputedStyle(e).marginTop,marginBottom:getComputedStyle(e).marginBottom})),scrollWidth:document.documentElement.scrollWidth,serviceCards:[...document.querySelectorAll('.service-panel')].map(e=>({name:e.querySelector('h3').textContent,features:e.querySelectorAll('li').length,overflow:e.querySelector('.service-panel-copy').getBoundingClientRect().bottom>e.getBoundingClientRect().bottom-4})),projectCards:[...document.querySelectorAll('.case-card')].map(e=>({name:e.querySelector('h3').textContent,active:e.classList.contains('is-active'),paragraphs:e.querySelectorAll('.case-details>p').length,highlights:e.querySelectorAll('.case-highlights li').length,background:getComputedStyle(e).backgroundColor,filter:getComputedStyle(e).filter,textPanel:getComputedStyle(e.querySelector('.case-details')).backgroundColor,overflow:e.querySelector('.case-details').scrollWidth>e.querySelector('.case-details').clientWidth}))}})()`,returnByValue:true});
  result.push(measured.result.value);
  if(width===390||width===1440){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`output/layout-check/${stage}-${width}.png`,Buffer.from(shot.data,'base64'));}
 }
 await writeFile(`output/layout-check/${stage}.json`,JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
} finally {socket?.close();browser.kill();}
