(() => {
  const root=document.querySelector('.work-library');
  if(!root)return;
  const cards=[...root.querySelectorAll('.work-card')];
  const groups=[...root.querySelectorAll('.work-category-group')];
  const tabs=[...root.querySelectorAll('[data-work-filter]')];
  const search=root.querySelector('#work-search');
  const industry=root.querySelector('#work-industry');
  const count=root.querySelector('#work-result-count');
  const clear=root.querySelector('.work-reset');
  const empty=root.querySelector('.work-empty');
  const normalize=value=>value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim();
  const catalog=cards.map(card=>({card,category:card.dataset.category,industry:card.dataset.industry,text:normalize(card.textContent)}));
  let selected='all';
  function render(){
    industry.refreshCustomSelect?.();
    const query=normalize(search.value);
    let visible=0;
    for(const item of catalog){
      const match=(selected==='all'||item.category===selected)&&(industry.value==='all'||item.industry===industry.value)&&(!query||item.text.includes(query));
      item.card.hidden=!match;if(match)visible++;
    }
    for(const group of groups){
      const amount=[...group.querySelectorAll('.work-card')].filter(card=>!card.hidden).length;
      group.hidden=amount===0;group.querySelector('.work-group-count').textContent=String(amount).padStart(2,'0');
    }
    for(const tab of tabs){const active=tab.dataset.workFilter===selected;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',String(active));}
    const noun=visible===1?'project':'projects';
    count.textContent=visible===cards.length?`Showing all ${visible} projects`:`Showing ${visible} of ${cards.length} ${noun}`;
    empty.hidden=visible>0;
    clear.hidden=selected==='all'&&industry.value==='all'&&!query;
  }
  function reset(){selected='all';search.value='';industry.value='all';render();search.focus({preventScroll:true});}
  tabs.forEach(tab=>{
    const category=tab.dataset.workFilter;
    tab.querySelector('span').textContent=String(category==='all'?cards.length:cards.filter(card=>card.dataset.category===category).length).padStart(2,'0');
    tab.addEventListener('click',()=>{selected=category;render();});
  });
  search.addEventListener('input',render);search.addEventListener('search',render);
  industry.addEventListener('change',render);clear.addEventListener('click',reset);
  root.querySelector('.work-empty-reset').addEventListener('click',reset);
  const skip=document.querySelector('.work-skip');
  if(skip)skip.addEventListener('click',()=>{const main=document.querySelector('#main-content');main.tabIndex=-1;main.focus({preventScroll:true});});
  render();
})();
