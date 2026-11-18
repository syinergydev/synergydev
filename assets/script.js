const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#nav');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}
const filters=document.querySelectorAll('.filter');
const cards=document.querySelectorAll('.project-card');
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const f=btn.dataset.filter;
  cards.forEach(card=>card.style.display=(f==='all'||card.dataset.category===f)?'block':'none');
}));
