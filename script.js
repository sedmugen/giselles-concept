/**
 * ==========================================================================
 * Giselle's Vegan Kitchen - Luxury Interactive Engine
 * ==========================================================================
 * Standardized modular JavaScript engine managing client-side shopping bag,
 * luxury toast notifications, accessible dialogs, and lookbook interactions.
 */

'use strict';

/**
 * Product Catalog Registry
 */
const PRODUCT_REGISTRY = {
  1: {
    id: 1,
    name: 'Vanilla Rose Cake',
    price: 25000,
    img: 'assets/images/products/vanilla-rose-cake.png',
    description: 'Organic Madagascar vanilla bean layers infused with delicate organic rose petal concentrate.'
  },
  2: {
    id: 2,
    name: 'Tahini Cacao Cookie',
    price: 10500,
    img: 'assets/images/products/tahini-cacao-cookie.png',
    description: 'Sprouted sesame tahini base topped with organic single-origin raw cacao chunks and flaky sea salt.'
  },
  3: {
    id: 3,
    name: 'Almond Fudge Brownie',
    price: 14000,
    img: 'assets/images/products/almond-fudge-brownie.png',
    description: 'Cold-pressed sprouted raw almonds and coconut nectar blended into a dense dark chocolate fudge block.'
  },
  4: {
    id: 4,
    name: 'PROTEIN BARS - CHOCOLATE PEANUT BUTTER - DOZEN',
    price: 28100,
    subscriptionPrice: 23885,
    img: 'assets/images/products/protein-bar-peanut-butter.png',
    description: 'Rich organic peanut butter, sprouted almond flour, single-origin cacao, and coconut blossom nectar.'
  },
  5: {
    id: 5,
    name: 'Matcha Coconut Bar - Dozen',
    price: 28100,
    img: 'assets/images/products/protein-bar-matcha.png',
    description: 'Uji ceremonial matcha blended with cold-pressed coconut shreds, almonds, and cordyceps adaptogens.'
  }
};

/**
 * Main Application Module
 */
const GisellesApp = (() => {
  let cart = [];
  let currentSlideIndex = 0;
  let reviewAutoplayTimer = null;
  let currentLightboxIndex = 0;
  let lightboxImages = [];

  /**
   * Initialize all core application features
   */
  const init = () => {
    loadCartFromStorage();
    initIcons();
    initScrollHeader();
    initMobileMenu();
    initScrollReveal();
    initIngredientsAccordion();
    initReviewSlider();
    initCartDrawer();
    initQtySelectors();
    initPurchaseOptions();
    initProductGalleryLightbox();
    initDeliveryEstimator();
    initGlobalActionDelegation();
    initKeyboardNavigation();
  };

  /**
   * Safe Icon Loader
   */
  const initIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  /**
   * Toast Notification System
   * @param {string} title - Toast headline
   * @param {string} message - Toast message body
   * @param {string} type - 'info' | 'success' | 'gold'
   */
  const showToast = (title, message, type = 'gold') => {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML = `
      <i data-lucide="sparkles" class="toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-body">${escapeHtml(message)}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);
    initIcons();

    // Trigger active transition
    requestAnimationFrame(() => {
      toast.classList.add('toast-active');
    });

    const removeToast = () => {
      toast.classList.remove('toast-active');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 400);
    };

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', removeToast);
    }

    setTimeout(removeToast, 4500);
  };

  /**
   * Sanitize HTML helper
   */
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  /**
   * LocalStorage Cart State
   */
  const loadCartFromStorage = () => {
    try {
      const saved = localStorage.getItem('giselles_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          cart = parsed.filter(item => item && item.id && item.price && item.quantity > 0);
        }
      }
    } catch {
      cart = [];
    }
    renderCart();
  };

  const saveCartToStorage = () => {
    try {
      localStorage.setItem('giselles_cart', JSON.stringify(cart));
    } catch {
      // Fallback if local storage quota exceeded
    }
  };

  /**
   * Cart Operations
   */
  const addToCart = (productId, quantity = 1) => {
    const product = PRODUCT_REGISTRY[productId];
    if (!product) return;

    let finalId = String(productId);
    let finalName = product.name;
    let finalPrice = product.price;

    // Check if subscription option is active on product detail page
    const subOption = document.querySelector('input[name="purchase-option"]:checked');
    if (subOption && subOption.value === 'subscription' && productId === 4) {
      finalId = '4-subscription';
      finalName = `${product.name} (Monthly Subscription)`;
      finalPrice = product.subscriptionPrice || 23885;
    }

    const existingIdx = cart.findIndex(item => item.id === finalId);
    if (existingIdx > -1) {
      cart[existingIdx].quantity += quantity;
    } else {
      cart.push({
        id: finalId,
        productId: productId,
        name: finalName,
        price: finalPrice,
        img: product.img,
        quantity: quantity
      });
    }

    saveCartToStorage();
    renderCart();
    animateCartBadge();

    showToast('Bag Updated', `Added ${quantity}x "${finalName}" to your shopping bag.`);
  };

  const removeFromCart = (itemId) => {
    const item = cart.find(i => String(i.id) === String(itemId));
    cart = cart.filter(i => String(i.id) !== String(itemId));
    saveCartToStorage();
    renderCart();
    if (item) {
      showToast('Item Removed', `"${item.name}" was removed from your bag.`);
    }
  };

  const animateCartBadge = () => {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 300);
  };

  const renderCart = () => {
    const itemsContainer = document.getElementById('cartItems');
    const totalValue = document.getElementById('cartTotal');
    const countBadge = document.getElementById('cartCount');
    if (!itemsContainer || !totalValue || !countBadge) return;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    countBadge.textContent = totalCount;

    if (cart.length === 0) {
      itemsContainer.innerHTML = '<p class="empty-cart-message">Your bag is currently empty.</p>';
      totalValue.textContent = 'Rs. 0';
      return;
    }

    let html = '';
    cart.forEach(item => {
      html += `
        <div class="cart-item">
          <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="cart-item-image">
          <div class="cart-item-info">
            <h3 class="cart-item-title">${escapeHtml(item.name)}</h3>
            <div class="cart-item-meta">
              <span class="cart-item-price">Rs. ${item.price.toLocaleString()} (${item.quantity}x)</span>
              <button type="button" class="cart-item-remove" data-action="remove-from-cart" data-item-id="${escapeHtml(String(item.id))}" aria-label="Remove ${escapeHtml(item.name)}">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });

    itemsContainer.innerHTML = html;
    totalValue.textContent = `Rs. ${subtotal.toLocaleString()}`;
    initIcons();
  };

  /**
   * Cart Drawer Interaction
   */
  const openCartDrawer = () => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      drawer.setAttribute('aria-hidden', 'false');
    }
  };

  const closeCartDrawer = () => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      drawer.setAttribute('aria-hidden', 'true');
    }
  };

  const initCartDrawer = () => {
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
      overlay.addEventListener('click', closeCartDrawer);
    }
  };

  /**
   * Scroll-Linked Header & Logo Transition
   */
  const initScrollHeader = () => {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    const heroLogo = document.querySelector('.hero-logo-overlay');
    const isHomePage = document.body.classList.contains('home-page');

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (isHomePage && heroLogo) {
        const threshold = window.innerHeight * 0.25;
        if (scrollY > threshold) {
          heroLogo.classList.add('fade-out');
          header.classList.add('show-logo');
        } else {
          heroLogo.classList.remove('fade-out');
          header.classList.remove('show-logo');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  /**
   * Mobile Menu
   */
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (!menuBtn || !mobileNav) return;

    const toggleMenu = () => {
      const isActive = mobileNav.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', String(isActive));

      if (isActive) {
        menuBtn.children[0].style.transform = 'translateY(7px) rotate(45deg)';
        menuBtn.children[1].style.opacity = '0';
        menuBtn.children[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        document.body.style.overflow = 'hidden';
      } else {
        menuBtn.children[0].style.transform = 'none';
        menuBtn.children[1].style.opacity = '1';
        menuBtn.children[2].style.transform = 'none';
        document.body.style.overflow = '';
      }
    };

    menuBtn.addEventListener('click', toggleMenu);

    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  };

  /**
   * Intersection Observer Scroll Reveals
   */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  };

  /**
   * Ingredients Accordion
   */
  const initIngredientsAccordion = () => {
    const items = document.querySelectorAll('.ingredient-item');
    const ingredientImg = document.querySelector('.ingredient-image-wrapper img');

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('active')) return;
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (ingredientImg) {
          ingredientImg.style.transform = 'scale(1.03)';
          setTimeout(() => {
            ingredientImg.style.transform = 'none';
          }, 450);
        }
      });
    });
  };

  /**
   * Press Review Slider
   */
  const initReviewSlider = () => {
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.review-dot');
    if (slides.length === 0) return;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      currentSlideIndex = (index + slides.length) % slides.length;
      slides[currentSlideIndex].classList.add('active');
      if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlideIndex + 1);

    const startAutoplay = () => {
      stopAutoplay();
      reviewAutoplayTimer = setInterval(nextSlide, 7000);
    };

    const stopAutoplay = () => {
      if (reviewAutoplayTimer) {
        clearInterval(reviewAutoplayTimer);
      }
    };

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoplay();
      });
    });

    startAutoplay();
  };

  /**
   * Quantity Selector Engine
   */
  const initQtySelectors = () => {
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');
    const qtyInput = document.getElementById('qtyInput');
    if (!minusBtn || !plusBtn || !qtyInput) return;

    minusBtn.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10) || 1;
      if (val < 99) qtyInput.value = val + 1;
    });
  };

  const getProductQty = () => {
    const qtyInput = document.getElementById('qtyInput');
    return qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
  };

  /**
   * Subscription Model Selector
   */
  const initPurchaseOptions = () => {
    const options = document.querySelectorAll('input[name="purchase-option"]');
    const priceDisplay = document.querySelector('.product-page-price');
    const optionSubscribeCard = document.getElementById('optionSubscribeCard');
    const optionOneTimeCard = document.getElementById('optionOneTimeCard');
    if (options.length === 0 || !priceDisplay) return;

    options.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'subscription') {
          if (optionSubscribeCard) optionSubscribeCard.classList.add('active');
          if (optionOneTimeCard) optionOneTimeCard.classList.remove('active');
          priceDisplay.innerHTML = `Rs. 23,885.00 <span class="price-meta">(Box of 12 — Save 15%)</span>`;
        } else {
          if (optionOneTimeCard) optionOneTimeCard.classList.add('active');
          if (optionSubscribeCard) optionSubscribeCard.classList.remove('active');
          priceDisplay.innerHTML = `Rs. 28,100.00 <span class="price-meta">(Box of 12)</span>`;
        }
      });
    });
  };

  /**
   * Product Gallery Lightbox Modal
   */
  const initProductGalleryLightbox = () => {
    const galleryImages = document.querySelectorAll('.product-gallery-stack img');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (!lightboxModal || galleryImages.length === 0) return;

    lightboxImages = Array.from(galleryImages).map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || 'Product detailed view'
    }));

    const showLightboxImage = (index) => {
      currentLightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
      if (lightboxImg) lightboxImg.src = lightboxImages[currentLightboxIndex].src;
      if (lightboxCaption) lightboxCaption.textContent = lightboxImages[currentLightboxIndex].alt;
    };

    galleryImages.forEach((img, idx) => {
      img.addEventListener('click', () => {
        showLightboxImage(idx);
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(currentLightboxIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(currentLightboxIndex + 1));
  };

  /**
   * Delivery Date Estimator
   */
  const initDeliveryEstimator = () => {
    const btnEstimate = document.getElementById('btnEstimateDelivery');
    const regionSelect = document.getElementById('deliveryRegion');
    const resultDiv = document.getElementById('deliveryResult');
    if (!btnEstimate || !regionSelect || !resultDiv) return;

    const calculateDelivery = () => {
      const region = regionSelect.value;
      const today = new Date();
      let transitDays = (region === 'ca') ? 2 : 3;

      if (today.getHours() >= 11) {
        transitDays += 1;
      }

      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + transitDays);

      const dateString = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      let message = '';
      if (region === 'ca') {
        message = `Estimated arrival date: <strong>${dateString}</strong>.<br><span style="font-size: 0.8rem; opacity: 0.85;">Inside California orders are prepared and shipped via insulation cooling packs.</span>`;
      } else {
        message = `Estimated arrival date: <strong>${dateString}</strong>.<br><span style="font-size: 0.8rem; opacity: 0.85;">Outside California shipping takes 1 extra day. Freshness is fully protected by cool packs.</span>`;
      }

      resultDiv.innerHTML = message;
      resultDiv.style.borderColor = 'var(--accent-gold)';
    };

    btnEstimate.addEventListener('click', calculateDelivery);
    regionSelect.addEventListener('change', calculateDelivery);
  };

  /**
   * Micro-Interactive Add to Bag Flow
   */
  const triggerAddToBagFlow = (productId = 4) => {
    const btn = document.getElementById('btnAddToBag');
    if (!btn || btn.classList.contains('adding')) return;

    btn.classList.add('adding');
    addToCart(productId, getProductQty());

    setTimeout(() => {
      btn.classList.remove('adding');
      btn.classList.add('success');

      setTimeout(() => {
        btn.classList.remove('success');
        openCartDrawer();
      }, 900);
    }, 600);
  };

  /**
   * Central Event Delegation Engine
   */
  const initGlobalActionDelegation = () => {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');

      switch (action) {
        case 'open-cart':
          e.preventDefault();
          openCartDrawer();
          break;

        case 'close-cart':
          e.preventDefault();
          closeCartDrawer();
          break;

        case 'quick-add':
          e.preventDefault();
          const pId = parseInt(target.getAttribute('data-product-id'), 10);
          if (pId) {
            addToCart(pId, 1);
            setTimeout(openCartDrawer, 300);
          }
          break;

        case 'add-main-product':
          e.preventDefault();
          triggerAddToBagFlow(4);
          break;

        case 'remove-from-cart':
          e.preventDefault();
          const removeId = target.getAttribute('data-item-id');
          if (removeId) removeFromCart(removeId);
          break;

        case 'preview-notice':
          e.preventDefault();
          const feature = target.getAttribute('data-feature') || 'Feature';
          showToast(feature, `${feature} portal is currently in preview demonstration mode.`);
          break;

        case 'checkout-notice':
          e.preventDefault();
          if (cart.length === 0) {
            showToast('Bag Empty', 'Please add treats to your shopping bag before proceeding to checkout.');
          } else {
            showToast('Secure Checkout', 'Proceeding to secure SSL encrypted payment portal...');
          }
          break;

        default:
          break;
      }
    });

    // Form Submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.classList.contains('cta-form') || form.classList.contains('footer-newsletter-form')) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input ? input.value : '';
        if (email) {
          showToast('Welcome to the Kitchen', `Thank you for subscribing (${email}). Seasonal recipe ledger unlocked.`);
          form.reset();
        }
      }
    });
  };

  /**
   * Keyboard & Escape Accessibility
   */
  const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCartDrawer();
        const lightboxModal = document.getElementById('lightboxModal');
        if (lightboxModal && lightboxModal.classList.contains('active')) {
          lightboxModal.classList.remove('active');
          document.body.style.overflow = '';
        }
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav && mobileNav.classList.contains('active')) {
          const menuBtn = document.getElementById('menuBtn');
          if (menuBtn) menuBtn.click();
        }
      }
    });
  };

  return {
    init,
    addToCart,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer,
    showToast
  };
})();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', GisellesApp.init);
