var glide2 = new Glide("#glide-testimonials", {
    type: "carousel",
  animationDuration: 200,
  animationTimingFunc: "cubic-bezier(.22,1,.36,1)",
    perView: 4,
    gap: 24,
    breakpoints: {
      1100: {
        perView: 3,
        peek: { before: 0, after: 10 },
      },
      850: {
        perView: 2,
        peek: { before: 0, after: 50 },
      },
      550: {
        perView: 1,
        peek: { before: 0, after: 100 },
      }
    },
});

glide2.mount();

/* Snappy dots: Glide flips the active bullet on move.after (transition end),
   which lands ~1s after the click here. Update it on the early 'run' event
   instead so the dot moves with the slide, not a second behind it. */
glide2.on('run', function () {
  var root = document.getElementById('glide-testimonials');
  if (!root) return;
  var scope = root.closest('[id^="shopify-section"]') || root.parentNode || document;
  var bullets = scope.querySelectorAll('.glide__bullet');
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].classList.toggle('glide__bullet--active', i === glide2.index);
  }
});