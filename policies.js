(() => {
  const sections=[...document.querySelectorAll('.policy-section')];
  const links=[...document.querySelectorAll('.policy-toc a')];
  if(!sections.length)return;
  function activate(id){links.forEach(link=>{if(link.hash==='#'+id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  links.forEach(link=>link.addEventListener('click',()=>activate(link.hash.slice(1))));
  if('IntersectionObserver' in window){
    const visible=new Set();
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{entry.isIntersecting?visible.add(entry.target.id):visible.delete(entry.target.id);});
      const first=sections.find(section=>visible.has(section.id));if(first)activate(first.id);
    },{rootMargin:'-95px 0px -45% 0px',threshold:0});
    sections.forEach(section=>observer.observe(section));
  }
})();
