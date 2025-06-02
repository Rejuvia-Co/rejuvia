var glide2 = new Glide("#glide-testimonials", {
    type: "carousel",
    perView: 4,
    peek: { before: 0, after: 0 },
    gap: 24,
    breakpoints: {
      1230: {
        perView: 3,
        peek: { before: 0, after: 80 },
      },
      1050: {
        perView: 3,
        peek: { before: 0, after: 0 },
      },
      945: {
        perView: 2,
        peek: { before: 0, after: 170 },
      },
      800: {
        perView: 2,
        peek: { before: 0, after: 50 },
      },
      690: {
        perView: 2,
        peek: { before: 0, after: 0 },
      },
      640: {
        perView: 1,
        peek: { before: 0, after: 180 },
      },
      550: {
        perView: 1,
        peek: { before: 0, after: 100 },
      },
      460: {
        perView: 1,
        peek: { before: 0, after: 90 },
      },
      405: {
        perView: 1,
        peek: { before: 0, after: 50 },
      }
    },
});

glide2.mount();