(function(){
  var fig=document.querySelector('.hero-media.iso');
  if(!fig)return;
  var svg=fig.querySelector('svg');
  var secs=[].slice.call(svg.querySelectorAll('[data-sec]'));
  var psecs=[].slice.call(svg.querySelectorAll('[data-psec]'));
  var names=["Navigasi","Hero","Layanan","Kontak"];
  var out=fig.querySelector('[data-readout]');
  var led=svg.querySelector('[data-part="srv-led"]');
  var pulse=svg.querySelector('[data-part="pulse"]');
  var keys=[].slice.call(svg.querySelectorAll('.sd-key'));
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shown=0,timer=0,visible=true,phase='build';
  function set(el,on,y){el.style.opacity=on?1:0;el.style.transform=on?'translateY(0)':'translateY('+(y||-6)+'px)';}
  function paint(n){
    secs.forEach(function(s,i){set(s,i<n,-5)});
    psecs.forEach(function(s,i){set(s,i<n,-4)});
    if(out)out.innerHTML='<i></i>Halaman <b>'+n+'/'+names.length+'</b>'+(n?' · '+names[n-1]:' · kosong');
    if(led){led.style.opacity=n%2?1:.35;}
  }
  function press(){
    var el=keys[Math.floor(Math.random()*keys.length)];
    if(!el)return;
    el.setAttribute('transform','translate(0 1.6)');el.setAttribute('data-down','');
    setTimeout(function(){el.removeAttribute('transform');el.removeAttribute('data-down');},90);
  }
  function sendPulse(){
    if(!pulse)return;
    pulse.style.transition='none';pulse.style.opacity=1;pulse.style.strokeDashoffset=6;
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      pulse.style.transition='stroke-dashoffset .9s linear, opacity .3s .7s';
      pulse.style.strokeDashoffset=-100;pulse.style.opacity=0;
    })});
  }
  function step(){
    if(!visible){timer=setTimeout(step,600);return;}
    if(phase==='build'){
      shown++;paint(shown);press();sendPulse();
      if(shown>=names.length){phase='hold';timer=setTimeout(step,3600);}
      else timer=setTimeout(step,900);
    }else if(phase==='hold'){
      phase='clear';shown=0;paint(0);timer=setTimeout(step,900);
    }else{phase='build';timer=setTimeout(step,300);}
  }
  if(still){paint(names.length);return;}
  paint(0);
  if('IntersectionObserver' in window){new IntersectionObserver(function(e){visible=e[e.length-1].isIntersecting},{rootMargin:'80px'}).observe(fig);}
  svg.addEventListener('click',function(){clearTimeout(timer);phase='build';shown=0;paint(0);timer=setTimeout(step,350);});
  timer=setTimeout(step,900);
})();