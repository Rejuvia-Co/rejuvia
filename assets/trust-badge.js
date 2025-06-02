var glide2 = new Glide('.glide-press', {
    type: 'carousel',
    perView: 6,
    
    breakpoints: {
      800: {
        startAt: 4,
        peek: { before: -50, after: -50 },
        perView: 4
      },
      570: {
        startAt: 4,
        peek: { before: -50, after: -50 },
        perView: 3
      }
    }
  })
  
  
  
  glide2.mount()