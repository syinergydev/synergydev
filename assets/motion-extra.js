/* SynergyDev — animasi tambahan (aman: tidak jalan bila GSAP gagal, reduced-motion, atau layar kecil) */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(min-width: 961px)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Pinned storytelling: judul menempel saat langkah di kanan digulir */
  var sec = document.querySelector('.pin-story');
  var head = sec && sec.querySelector('.wrap > .head');
  if (sec && head) {
    ScrollTrigger.create({
      trigger: sec, start: 'top 120px', end: 'bottom bottom',
      pin: head, pinSpacing: false, anticipatePin: 1
    });
  }

  /* Nomor langkah berubah warna mengikuti scroll */
  document.querySelectorAll('.steps li').forEach(function (li) {
    var n = li.querySelector('.n');
    if (!n) return;
    gsap.fromTo(n, { color: '#B8C7DC' }, {
      color: '#2F6FE0',
      scrollTrigger: { trigger: li, start: 'top 75%', end: 'top 45%', scrub: true }
    });
  });
})();
