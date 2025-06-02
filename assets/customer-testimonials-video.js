var glide2 = new Glide("#glide-testimonials-video", {
  type: "carousel",
  perView: 4,
  gap: 16,
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
      peek: { before: 0, after: 60 },
    }
  },
});
glide2.mount();