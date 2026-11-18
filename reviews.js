const initialReviews = [
  {
    "id": "existing-1",
    "name": "Ahsan Iqbal",
    "location": "CEO, TechStore Pakistan",
    "rating": 5,
    "title": "A thoughtful e-commerce partner",
    "body": "Globaxify transformed our e-commerce business completely. Their Shopify expertise helped us increase sales by 300% in just 3 months. The team's dedication and professionalism exceeded all our expectations.",
    "sample": false,
    "createdAt": null
  },
  {
    "id": "existing-2",
    "name": "Sarah Ahmed",
    "location": "Founder, StartupX",
    "rating": 5,
    "title": "Support for our next chapter",
    "body": "Working with Globaxify was a game-changer for our startup. Their web development team delivered a world-class platform that helped us secure our first round of funding. Highly recommended!",
    "sample": false,
    "createdAt": null
  },
  {
    "id": "existing-3",
    "name": "Muhammad Ali",
    "location": "Marketing Director, BrandCo",
    "rating": 5,
    "title": "A creative marketing team",
    "body": "The social media marketing strategy by Globaxify increased our brand visibility by 500%. Their creative team understands exactly what the audience wants. Best investment we ever made!",
    "sample": false,
    "createdAt": null
  },
  {
    "id": "existing-4",
    "name": "Usman Tariq",
    "location": "E-commerce Entrepreneur",
    "rating": 5,
    "title": "Product research expertise",
    "body": "Product hunting service by Globaxify is exceptional. They found winning products that generated $50k revenue in the first month. Their research team is incredibly talented and data-driven.",
    "sample": false,
    "createdAt": null
  },
  {
    "id": "existing-5",
    "name": "Hassan Raza",
    "location": "Owner, HR Solutions",
    "rating": 5,
    "title": "Professional from start to finish",
    "body": "From web development to digital marketing, Globaxify handled everything professionally. Their 24/7 support and commitment to quality makes them stand out from the competition.",
    "sample": false,
    "createdAt": null
  },
  {
    "id": "sample-1",
    "name": "Sample review",
    "location": "Layout preview",
    "rating": 5,
    "title": "Shopify design",
    "body": "This is a sample card showing how a customer review will look. New customer feedback replaces these preview cards.",
    "sample": true,
    "createdAt": null
  },
  {
    "id": "sample-2",
    "name": "Sample review",
    "location": "Layout preview",
    "rating": 4,
    "title": "Web development",
    "body": "This is a sample card showing how a customer review will look. New customer feedback replaces these preview cards.",
    "sample": true,
    "createdAt": null
  },
  {
    "id": "sample-3",
    "name": "Sample review",
    "location": "Layout preview",
    "rating": 5,
    "title": "Brand identity",
    "body": "This is a sample card showing how a customer review will look. New customer feedback replaces these preview cards.",
    "sample": true,
    "createdAt": null
  },
  {
    "id": "sample-4",
    "name": "Sample review",
    "location": "Layout preview",
    "rating": 4,
    "title": "Digital marketing",
    "body": "This is a sample card showing how a customer review will look. New customer feedback replaces these preview cards.",
    "sample": true,
    "createdAt": null
  },
  {
    "id": "sample-5",
    "name": "Sample review",
    "location": "Layout preview",
    "rating": 5,
    "title": "IT consulting",
    "body": "This is a sample card showing how a customer review will look. New customer feedback replaces these preview cards.",
    "sample": true,
    "createdAt": null
  }
];
(() => {
  const root=document.querySelector('.customer-reviews');
  if(!root)return;
  const conveyor=root.querySelector('.reviews-conveyor');
  const group=root.querySelector('.reviews-group');
  const filter=root.querySelector('#reviewsRatingFilter');
  const form=root.querySelector('#customerReviewForm');
  const status=form.querySelector('.review-form-status');
  const pause=root.querySelector('.reviews-pause');
  let submitted=[];
  function rows(){
    const actual=[...submitted,...initialReviews.filter(r=>!r.sample)];
    const samples=initialReviews.filter(r=>r.sample);
    return [...actual,...samples].slice(0,10);
  }
  function node(tag,className,text){
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(text!==undefined)element.textContent=text;
    return element;
  }
  function stars(rating,className){
    const element=node('div',className);
    element.setAttribute('aria-label',`${rating} out of 5 stars`);
    for(let i=1;i<=5;i++){
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 26 28');
      svg.setAttribute('aria-hidden','true');
      svg.classList.add('review-gold-star');
      if(i>rating)svg.classList.add('review-star-empty');
      const use=document.createElementNS('http://www.w3.org/2000/svg','use');
      use.setAttribute('href','#review-gold-star');svg.append(use);element.append(svg);
    }
    return element;
  }
  function card(review){
    const article=node('article','customer-review-card');article.tabIndex=0;
    const top=node('div','customer-review-top');
    const identity=node('div');identity.append(node('h4','',review.name));
    if(review.location)identity.append(node('p','',review.location));
    top.append(identity);
    if(review.sample)top.append(node('span','review-sample-tag','Sample'));
    else if(review.createdAt){const date=node('time','',new Intl.DateTimeFormat('en',{month:'short',day:'numeric'}).format(new Date(review.createdAt)));date.dateTime=review.createdAt;top.append(date);}
    article.append(top,stars(review.rating,'customer-review-stars'),node('h5','',review.title),node('p','customer-review-body',review.body));
    return article;
  }
  function summary(){
    const actual=[...submitted,...initialReviews.filter(r=>!r.sample)];
    const count=actual.length;
    const average=count?actual.reduce((sum,r)=>sum+r.rating,0)/count:0;
    root.querySelector('#reviewsAverage').textContent=average.toFixed(1);
    root.querySelector('#reviewsBasedOn').textContent=`Based on ${count} review${count===1?'':'s'}`;
    const starsElement=root.querySelector('.reviews-score-stars');
    if(!starsElement.firstElementChild)starsElement.replaceChildren(stars(0,'review-score-base'),stars(5,'review-score-fill'));
    starsElement.style.setProperty('--star-fill',`${average/5*100}%`);
    starsElement.setAttribute('aria-label',`${average.toFixed(1)} out of 5 stars`);
    const breakdown=root.querySelector('.reviews-breakdown');breakdown.replaceChildren();
    for(let rating=5;rating>=1;rating--){
      const total=actual.filter(r=>r.rating===rating).length;
      const row=node('div','review-rating-row');row.append(node('span','',`${rating} stars`));
      const bar=node('div','review-rating-bar');const fill=node('span');fill.style.width=`${count?total/count*100:0}%`;bar.append(fill);
      row.append(bar,node('strong','',String(total)));breakdown.append(row);
    }
  }
  function render(){
    filter.refreshCustomSelect?.();
    const all=rows(),visible=filter.value==='all'?all:all.filter(r=>r.rating===Number(filter.value));
    group.replaceChildren(...visible.map(card));
    conveyor.querySelector('.reviews-group-clone')?.remove();
    if(visible.length){
      const clone=group.cloneNode(true);clone.classList.add('reviews-group-clone');clone.setAttribute('aria-hidden','true');clone.inert=true;clone.querySelectorAll('[tabindex]').forEach(item=>item.removeAttribute('tabindex'));conveyor.append(clone);
    }
    root.querySelector('.reviews-window').scrollTop=0;
    root.querySelector('.reviews-empty').hidden=visible.length>0;
    root.querySelector('#reviewsFeedCount').textContent=String(visible.length);
    conveyor.style.setProperty('--reviews-duration',`${Math.max(25,visible.length*9)}s`);
    // Restart the seamless loop with the newly added review at the top.
    conveyor.style.animationName='none';
    requestAnimationFrame(()=>{conveyor.style.animationName='';});
    summary();
  }
  async function refresh(){
    const response=await fetch('/api/reviews',{cache:'no-store'});
    if(!response.ok)throw Error('Reviews could not be loaded.');
    const data=await response.json();
    if(!Array.isArray(data.reviews))throw Error('Invalid review response.');
    submitted=data.reviews;
    render();
  }
  filter.addEventListener('change',render);
  pause.addEventListener('click',()=>{
    const paused=root.classList.toggle('reviews-manually-paused');
    pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume':'Pause';
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const button=form.querySelector('button[type=submit]');
    button.disabled=true;status.textContent='Posting your review…';status.classList.remove('is-error');
    try{
      const input=Object.fromEntries(new FormData(form));input.rating=Number(input.rating);
      const response=await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
      const result=await response.json();
      if(!response.ok||!result.review)throw Error(result.error||'Your review could not be saved. Please try again.');
      submitted=[result.review,...submitted.filter(r=>r.id!==result.review.id)];
      filter.value='all';render();
      root.classList.add('reviews-manually-paused');pause.setAttribute('aria-pressed','true');pause.textContent='Resume';
      form.reset();status.textContent='Thank you! Your review has been added to the list.';
    }catch(error){status.classList.add('is-error');status.textContent=error.message||'Your review could not be saved. Please try again.';}
    finally{button.disabled=false;}
  });
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{root.classList.toggle('reviews-offscreen',!entries[0].isIntersecting);},{rootMargin:'100px'}).observe(root);}
  document.addEventListener('visibilitychange',()=>root.classList.toggle('reviews-offscreen',document.hidden));
  window.addEventListener('focus',()=>{if(!form.contains(document.activeElement))refresh().catch(()=>{});});
  render();
  refresh().catch(()=>{});
})();
