/* Accessible select-only comboboxes, backed by native form fields. */
(() => {
  document.querySelectorAll('#customerReviewForm select, #reviewsRatingFilter').forEach((select, number) => {
    const shell=document.createElement('div');shell.className='review-select';
    select.parentNode.insertBefore(shell,select);shell.append(select);
    const trigger=document.createElement('button');trigger.type='button';trigger.className='review-select-trigger';
    const text=document.createElement('span');text.className='review-select-value';trigger.append(text);
    const menu=document.createElement('div');menu.className='review-select-menu';menu.id=`review-select-menu-${number}`;menu.role='listbox';menu.hidden=true;
    const label=select.name==='rating'?'Your rating':'Filter reviews';
    menu.setAttribute('aria-label',label);trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
    const values=[...select.options].filter(option=>option.value!=='');
    let active=0,opened=false;
    const items=values.map((option,index)=>{
      const item=document.createElement('div');item.className='review-select-option';item.id=`review-select-option-${number}-${index}`;item.role='option';
      const wording=document.createElement('span');wording.textContent=option.textContent;item.append(wording);
      const check=document.createElement('span');check.className='review-select-check';check.textContent='\u2713';check.setAttribute('aria-hidden','true');item.append(check);
      item.addEventListener('pointerdown',event=>event.preventDefault());
      item.addEventListener('click',event=>{event.preventDefault();choose(index);});
      item.addEventListener('pointerenter',()=>highlight(index,false));
      menu.append(item);return item;
    });
    function highlight(index,scroll=true){
      active=(index+items.length)%items.length;
      items.forEach((item,i)=>item.classList.toggle('is-active',i===active));
      trigger.setAttribute('aria-activedescendant',items[active].id);
      if(scroll)items[active].scrollIntoView({block:'nearest'});
    }
    function sync(){
      const selected=select.options[select.selectedIndex];
      text.textContent=selected?.textContent||'Choose a rating';
      trigger.setAttribute('aria-label',`${label}: ${text.textContent}`);
      trigger.classList.toggle('has-value',select.value!=='');
      items.forEach((item,i)=>item.setAttribute('aria-selected',String(values[i].value===select.value)));
    }
    function close(){opened=false;menu.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');shell.classList.remove('is-open');}
    function open(index){
      opened=true;menu.hidden=false;shell.classList.add('is-open');trigger.setAttribute('aria-expanded','true');
      const selected=values.findIndex(option=>option.value===select.value);
      highlight(index??Math.max(0,selected));
    }
    function choose(index){
      select.value=values[index].value;select.dispatchEvent(new Event('change',{bubbles:true}));
      shell.classList.remove('is-invalid');trigger.removeAttribute('aria-invalid');sync();close();trigger.focus();
    }
    trigger.addEventListener('click',event=>{event.preventDefault();opened?close():open();});
    trigger.addEventListener('keydown',event=>{
      if(event.key==='Escape'){if(opened){event.preventDefault();close();}return;}
      if(event.key==='Tab'){close();return;}
      if(['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)){
        event.preventDefault();
        if(event.key==='Enter'||event.key===' '){opened?choose(active):open();return;}
        if(event.key==='Home'){open(0);return;}if(event.key==='End'){open(items.length-1);return;}
        if(!opened)open();else highlight(active+(event.key==='ArrowDown'?1:-1));
      }else if(event.key.length===1){
        const match=values.findIndex(option=>option.textContent.toLowerCase().startsWith(event.key.toLowerCase()));
        if(match>=0){event.preventDefault();open(match);}
      }
    });
    document.addEventListener('pointerdown',event=>{if(opened&&!shell.contains(event.target))close();});
    trigger.addEventListener('blur',event=>{if(opened&&!shell.contains(event.relatedTarget))close();});
    select.addEventListener('change',sync);
    select.addEventListener('invalid',event=>{event.preventDefault();shell.classList.add('is-invalid');trigger.setAttribute('aria-invalid','true');trigger.focus();});
    if(select.form)select.form.addEventListener('reset',()=>requestAnimationFrame(()=>{sync();close();shell.classList.remove('is-invalid');trigger.removeAttribute('aria-invalid');}));
    select.refreshCustomSelect=sync;
    select.classList.add('review-select-native');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
    shell.append(trigger,menu);sync();
  });
})();
