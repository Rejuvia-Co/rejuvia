/**
 * Modern Interactions - Vanilla JS replacement for jQuery dependencies
 * Replaces custom.js.liquid and simplistic.js.liquid jQuery code
 */

// ============================================================================
// UTILITY FUNCTIONS (from SimplisticJS)
// ============================================================================

const Simplistic = {
  formatMoney: "$ {{amount}}",
  beforeTrapFocus: null,

  /**
   * Traps focus within a container for accessibility
   */
  trapFocus(options) {
    this.beforeTrapFocus = document.activeElement;
    const eventName = options.namespace ? `focusin.${options.namespace}` : 'focusin';

    const container = options.container;
    const elementToFocus = options.elementToFocus || container;

    container.setAttribute('tabindex', '-1');
    elementToFocus.focus();

    const handleFocusIn = (evt) => {
      if (container !== evt.target && !container.contains(evt.target)) {
        container.focus();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    container._focusInHandler = handleFocusIn; // Store for cleanup
  },

  /**
   * Removes focus trap
   */
  removeTrapFocus(options) {
    const container = options.container;

    if (container) {
      container.removeAttribute('tabindex');
      if (container._focusInHandler) {
        document.removeEventListener('focusin', container._focusInHandler);
        delete container._focusInHandler;
      }
    }

    if (this.beforeTrapFocus) {
      this.beforeTrapFocus.focus();
      this.beforeTrapFocus = null;
    }
  },

  handleize(str) {
    return str.toLowerCase().replace(/[^\w\u00C0-\u024f]+/g, "-").replace(/^-+|-+$/g, "");
  },

  reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  getQueryParam(name, url) {
    if (!url) url = window.location.href;
    const urlObj = new URL(url);
    return urlObj.searchParams.get(name);
  },

  randomstring(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  validateEmail(email) {
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  },

  openModal(content, css) {
    if (typeof tingle === 'undefined') return;

    const modal = new tingle.modal({
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: [css],
      beforeOpen() {
        if (window.innerWidth > 600) {
          const closeBtn = document.querySelector(".tingle-modal__close");
          const content = document.querySelector(".tingle-modal-box__content");
          if (closeBtn && content) content.appendChild(closeBtn);
        }
      },
      beforeClose() {
        const closeBtn = document.querySelector(".tingle-modal__close");
        const modal = document.querySelector(".tingle-modal");
        if (closeBtn && modal) modal.insertBefore(closeBtn, modal.firstChild);
        return true;
      }
    });
    modal.setContent(content);
    modal.open();
    window.modal = modal;
  },

  onImagesLoaded(images, callback) {
    // Convert jQuery object to array if needed
    const imageArray = images.jquery ? Array.from(images) : (Array.isArray(images) ? images : [images]);

    let imagesLoaded = 0;
    const loadFunction = () => {
      imagesLoaded++;
      if (imagesLoaded === imageArray.length) {
        callback();
      }
    };

    if (imageArray.length > 0) {
      imageArray.forEach(img => {
        const image = new Image();
        image.onload = loadFunction;
        image.onerror = loadFunction;
        image.src = img.getAttribute ? img.getAttribute('src') : img.src;
      });
    } else {
      callback();
    }
  }
};

// Make Simplistic globally available
window.Simplistic = Simplistic;

// ============================================================================
// KEYBOARD ACCESSIBILITY
// ============================================================================

function handleFirstTab(e) {
  if (e.keyCode === 9) { // tab
    document.body.classList.add('user-is-tabbing');
  }
}

window.addEventListener('keydown', handleFirstTab);
document.addEventListener('click', () => {
  document.body.classList.remove('user-is-tabbing');
});

// ============================================================================
// MOBILE DETECTION
// ============================================================================

if (typeof isMobile !== 'undefined' && !isMobile.any) {
  document.body.classList.add('isNotMobile');
}

// ============================================================================
// QUANTITY CONTROLS
// ============================================================================

function initQuantityBoxes() {
  // Minus buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.quantity-box .minus')) {
      e.preventDefault();
      const btn = e.target.closest('.quantity-box .minus');
      const input = btn.parentElement.querySelector('input[type=number]');

      if (input) {
        try {
          const min = parseInt(input.getAttribute('min')) || 0;
          const current = parseInt(input.value) || 0;
          if (current > min) {
            input.stepDown();
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch (err) {
          const value = parseInt(input.value) - 1;
          input.value = value >= 0 ? value : 0;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });

  // Plus buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.quantity-box .plus')) {
      e.preventDefault();
      const btn = e.target.closest('.quantity-box .plus');
      const input = btn.parentElement.querySelector('input[type=number]');

      if (input) {
        try {
          input.stepUp();
          input.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (err) {
          const value = parseInt(input.value) + 1;
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });
}

// ============================================================================
// QUICK VIEW
// ============================================================================

function initQuickView() {
  document.addEventListener('click', async (e) => {
    const quickViewBtn = e.target.closest('.product-item .quick-view-btn');
    if (quickViewBtn) {
      e.preventDefault();
      const url = quickViewBtn.dataset.url;
      const loadingOverlay = document.getElementById('loading-overlay');

      if (loadingOverlay) loadingOverlay.style.display = 'block';

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        const data = await response.text();

        if (loadingOverlay) loadingOverlay.style.display = 'none';
        Simplistic.openModal(data, 'quick-view');
      } catch (error) {
        console.error('Quick view error:', error);
        if (loadingOverlay) loadingOverlay.style.display = 'none';
      }
    }
  });
}

// ============================================================================
// SIDE CART
// ============================================================================

function initSideCart() {
  const cartWrap = document.querySelector('.header .cart-wrap');
  const sideCart = document.getElementById('side-cart');

  if (!sideCart) return;

  // Open side cart on cart icon click
  if (cartWrap) {
    cartWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      showSideCart(true);
    });
  }

  // Close side cart on outside click
  document.addEventListener('click', (event) => {
    const sideCart = document.getElementById('side-cart');
    if (sideCart &&
        !event.target.closest('#side-cart') &&
        event.target.id !== 'loading-overlay' &&
        sideCart.classList.contains('open')) {
      hideSideCart();
    }
  });
}

function showSideCart(animate) {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  const page = document.getElementById('page');
  const sideCart = document.getElementById('side-cart');

  if (page) page.classList.add('mode-overlay');

  if (animate) {
    setTimeout(() => {
      if (sideCart) sideCart.classList.add('open');
    }, 100);
  } else {
    if (sideCart) {
      sideCart.classList.remove('ease-animation-slow');
      sideCart.classList.add('open');
      setTimeout(() => {
        sideCart.classList.add('ease-animation-slow');
      }, 200);
    }
  }

  if (sideCart) {
    Simplistic.trapFocus({
      container: sideCart,
      namespace: 'side-cart'
    });
  }
}

function hideSideCart() {
  const sideCart = document.getElementById('side-cart');
  const page = document.getElementById('page');

  if (sideCart) sideCart.classList.remove('open');
  if (page) page.classList.remove('mode-overlay');

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  if (sideCart) {
    Simplistic.removeTrapFocus({
      container: sideCart,
      namespace: 'side-cart'
    });
  }
}

// ============================================================================
// ADD TO CART
// ============================================================================

function validateAddCart(form) {
  const variantInput = form.querySelector('input[name=id]');

  if (!variantInput || variantInput.value === '') {
    const singleOptionSelectors = form.querySelectorAll('.single-option-selector');
    let allOptionsSelected = true;

    if (singleOptionSelectors.length > 0) {
      singleOptionSelectors.forEach(selector => {
        if (selector.value === '') {
          allOptionsSelected = false;
        }
      });
    } else {
      allOptionsSelected = false;
    }

    if (allOptionsSelected) {
      const errorMsg = form.querySelector('.validation-msg')?.textContent;
      alert(errorMsg || "The selected variant is sold out.");
    } else {
      const labels = [];
      form.querySelectorAll('.options label').forEach(label => {
        labels.push(label.textContent.replace(':', '').trim());
      });
      alert("You must select a " + labels.join('/') + ".");
    }
    return false;
  }
  return true;
}

async function addToCart(form, callback) {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) loadingOverlay.style.display = 'block';
  if (window.modal) window.modal.close();

  const productContainer = form.closest('.initialized');
  let productJs = null;
  if (productContainer && productContainer.dataset.productjs) {
    productJs = productContainer.dataset.productjs;
  }

  // Trigger custom event
  if (productJs) {
    document.dispatchEvent(new CustomEvent('addToCart', {
      detail: { productJs, form }
    }));
  } else {
    document.dispatchEvent(new CustomEvent('addToCart', {
      detail: { form }
    }));
  }

  const formData = new FormData(form);

  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Add to cart failed');
    }

    // Success
    if (productJs) {
      document.dispatchEvent(new CustomEvent('addToCartSuccess', {
        detail: { productJs, form }
      }));
    } else {
      document.dispatchEvent(new CustomEvent('addToCartSuccess', {
        detail: { form }
      }));
    }

    if (callback) {
      callback();
    } else {
      addToCartSuccess();
    }
  } catch (error) {
    addToCartFail(error);
  }
}

function addToCartSuccess() {
  // Get setting value from global variable if available
  const allowSideCart = window.THEME_SETTINGS?.allow_side_cart ?? true;
  updateCartDesc(allowSideCart);
}

function addToCartFail(error) {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) loadingOverlay.style.display = 'none';

  const errorMessage = error.message || 'An error occurred';
  Simplistic.openModal(`<div class="error-itemincart">${errorMessage}</div>`, 'message');
}

async function updateCartDesc(openSideCart) {
  try {
    const response = await fetch('/cart?view=side-cart', {
      method: 'GET',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    const data = await response.text();

    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';

    const oldSideCart = document.getElementById('side-cart');
    const animate = !oldSideCart || oldSideCart.offsetWidth === 0 || !oldSideCart.classList.contains('open');

    if (oldSideCart) oldSideCart.remove();

    const page = document.getElementById('page');
    if (page) page.insertAdjacentHTML('beforeend', data);

    if (window.modal) window.modal.close();

    if (openSideCart) {
      showSideCart(animate);
    } else {
      window.location.pathname = "/cart";
    }
  } catch (error) {
    console.error('Update cart error:', error);
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }
}

function initAddToCart(allowAjaxCart) {
  document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('add-to-cart-form')) {
      e.preventDefault();

      if (validateAddCart(e.target)) {
        if (allowAjaxCart) {
          addToCart(e.target);
        } else {
          e.target.submit();
        }
      }
    }
  });
}

// ============================================================================
// DROPDOWN MENUS
// ============================================================================

function setupDropdownMenus() {
  // Mega dropdown
  const trigger = document.querySelector('.has-dropdown--mega');
  const menu = document.querySelector('.menu-desktop');

  if (trigger && menu) {
    trigger.addEventListener('mouseenter', () => {
      menu.classList.add('open');
      trigger.classList.add('open');
    });

    document.addEventListener('mousemove', (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        menu.classList.remove('open');
        trigger.classList.remove('open');
      }
    });
  }

  // Keyboard navigation for dropdowns
  document.addEventListener('keydown', (e) => {
    const focused = document.activeElement;

    // Main menu dropdown navigation
    if (focused.closest('.main-menu .has-dropdown > a')) {
      if (e.which === 32) { // Spacebar
        e.preventDefault();
        const submenu = focused.nextElementSibling;
        if (submenu) toggleSlide(submenu);
      }
      if (e.which === 40) { // Arrow Down
        e.preventDefault();
        const submenu = focused.nextElementSibling;
        if (submenu) slideDown(submenu);
      }
      if (e.which === 38) { // Arrow Up
        e.preventDefault();
        const submenu = focused.nextElementSibling;
        if (submenu) slideUp(submenu);
      }
    }

    // Nested dropdown navigation
    if (focused.closest('.main-menu .has-dropdown .has-dropdown > a')) {
      if (e.which === 39) { // Arrow Right
        e.preventDefault();
        const submenu = focused.nextElementSibling;
        if (submenu) slideDown(submenu);
      }
      if (e.which === 37) { // Arrow Left
        e.preventDefault();
        const submenu = focused.nextElementSibling;
        if (submenu) slideUp(submenu);
      }
    }
  });
}

// Slide animations with reduced motion support
function slideDown(element, duration = 300) {
  if (Simplistic.reducedMotion()) {
    element.style.display = 'block';
    return;
  }

  element.style.display = 'block';
  const height = element.scrollHeight;
  element.style.height = '0';
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  requestAnimationFrame(() => {
    element.style.height = height + 'px';
  });

  setTimeout(() => {
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
  }, duration);
}

function slideUp(element, duration = 300) {
  if (Simplistic.reducedMotion()) {
    element.style.display = 'none';
    return;
  }

  const height = element.scrollHeight;
  element.style.height = height + 'px';
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  requestAnimationFrame(() => {
    element.style.height = '0';
  });

  setTimeout(() => {
    element.style.display = 'none';
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
  }, duration);
}

function toggleSlide(element, duration = 300) {
  if (element.offsetHeight === 0) {
    slideDown(element, duration);
  } else {
    slideUp(element, duration);
  }
}

// ============================================================================
// HEADER SCROLL BEHAVIOR
// ============================================================================

function initHeaderScroll() {
  const header = document.getElementById('header');
  const utilityBar = document.querySelector('.utility-bar');

  if (!header || !utilityBar) return;

  const barHeight = utilityBar.offsetHeight;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const translateValue = Math.min(scrollTop, barHeight);
    header.style.transform = `translateY(-${translateValue}px)`;
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
  // Clone header menu for drop header
  const mainMenu = document.querySelector('#header .main-menu');
  const dropHeaderMenu = document.querySelector('.header-drop .main-menu');

  if (mainMenu && dropHeaderMenu) {
    dropHeaderMenu.innerHTML = mainMenu.innerHTML;
    dropHeaderMenu.querySelectorAll('a').forEach(link => {
      link.setAttribute('focusable', 'false');
      link.setAttribute('tabindex', '-1');
      link.setAttribute('aria-hidden', 'true');
    });
  }

  // Initialize all components
  initQuantityBoxes();
  initQuickView();
  setupDropdownMenus();

  const sideCart = document.getElementById('side-cart');
  if (sideCart) {
    initSideCart();
  }

  // Menu desktop visibility
  const menuDesktop = document.querySelector('.menu-desktop');
  if (menuDesktop) {
    menuDesktop.classList.remove('hidden');
  }

  // Header scroll
  initHeaderScroll();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for external use
window.ModernInteractions = {
  addToCart,
  initAddToCart,
  showSideCart,
  hideSideCart,
  updateCartDesc,
  validateAddCart
};
