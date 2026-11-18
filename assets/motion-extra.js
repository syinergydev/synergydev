/* SynergyDev — animasi tambahan (aman: tidak jalan bila GSAP gagal, reduced-motion, atau layar kecil) */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(min-width: 961px)').matches) return;
  var steps = document.querySelectorAll('.steps li');
  if (!steps.length) return;
  gsap.registerPlugin(ScrollTrigger);
  steps.forEach(function (li) {
    var n = li.querySelector('.n');
    if (!n) return;
    gsap.fromTo(n, { color: '#B8C7DC' }, {
      color: '#2F6FE0',
      scrollTrigger: { trigger: li, start: 'top 75%', end: 'top 45%', scrub: true }
    });
  });
})();
