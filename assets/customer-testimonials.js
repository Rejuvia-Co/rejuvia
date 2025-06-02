var glide2 = new Glide("#glide-testimonials", {
    type: "carousel",
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