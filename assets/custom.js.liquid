/**************logo-showcase (HOMEPAGE + PDP) slick******************/
$(function(){
  $(document).ready(function(){ 
    // console.log("Test");
    $('.cst_logo_slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      dots: true,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false
    });
    
    
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    fade: false,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true
  });
    $('.slideReview').slick({
      autoplay:true,
      speed: 700,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0',
      prevArrow: '<svg focusable="false" role="presentation" class="icon icon-arrow-left left-arrow slick-arrow" viewBox="0 0 32 32" style="display: flex;"><path fill="#000000" d="M24.333 28.205l-1.797 1.684L7.666 16l14.87-13.889 1.797 1.675L11.269 16z"></path></svg>',
      nextArrow: '<svg focusable="false" role="presentation" class="icon icon-arrow-right right-arrow slick-arrow" viewBox="0 0 32 32" style="display: flex;"><path fill="#000000" d="M7.667 3.795l1.797-1.684L24.334 16 9.464 29.889l-1.797-1.675L20.731 16z"></path></svg>',
      responsive: [
      	{
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
            centerMode: true,
            centerPadding: '0%',
            dots: true
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '0%',
            dots: true
          }
        }
      ]
    });

  });
  
});

const productCards = document.querySelectorAll(".product-item");
productCards.forEach(card => {
  const subBoxes = card.querySelector(".subscription-boxes")
  const oneTimeBox = card.querySelector(".one-time-box")
  const sellingPlanInput = card.querySelector("[name='selling_plan']")
  const subscriptionSelect = card.querySelector("[data-subscription-select]")
  const sellingTypeDisplay = card.querySelector("[data-selling-plan-type]")
  const quantityInput = card.querySelector("[data-quantity-input]")

  subBoxes.addEventListener("click", function() {
    oneTimeBox.classList.remove("selected");
    subBoxes.classList.add("selected")
    sellingPlanInput.value = subscriptionSelect.value;
    sellingTypeDisplay.innerText = "Subscription"
  })

  oneTimeBox.addEventListener("click", function() {
    oneTimeBox.classList.add("selected");
    subBoxes.classList.remove("selected")
    sellingPlanInput.value = null;
    sellingTypeDisplay.innerText = "One Time"
  })

  subscriptionSelect.addEventListener("change", function() {
    sellingPlanInput.value = this.value;
    card.querySelector("[data-subscribe-price]").innerText = this.options[this.selectedIndex].dataset.price;
  })

  console.log( card.querySelector("[data-quantity-dec]"))
  card.querySelector("[data-quantity-dec]").addEventListener("click", function() {
    if (quantityInput.value > 1) quantityInput.value = Number(quantityInput.value) - 1;
  })
  
  card.querySelector("[data-quantity-inc]").addEventListener("click", function() {
    quantityInput.value = Number(quantityInput.value) + 1;
  })
})