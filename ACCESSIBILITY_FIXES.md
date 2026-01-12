# Accessibility Fixes - January 2026

This document lists all accessibility improvements made to address PageSpeed Insights findings.

## Summary

- **Branch:** `fix/accessibility-issues`
- **Total Files Modified:** 12
- **Issues Fixed:** 8

---

## Fixes Applied

### 1. Buttons Without Accessible Names
**Issue:** Slider arrow buttons announced as "button" without context for screen readers.

**Files Modified:**
- `sections/featured-customer-reviews.liquid`
- `sections/customer-testimonials.liquid`
- `sections/customer-testimonials-video.liquid`
- `sections/second-customer-testimonial.liquid`

**Solution:** Added `aria-label` attributes to all glide slider navigation buttons.
```html
<button aria-label="Previous review">...</button>
<button aria-label="Next review">...</button>
```

---

### 2. Links Without Discernible Names
**Issue:** Mobile menu toggle link had no accessible name.

**Files Modified:**
- `sections/header.liquid`

**Solution:** Added `aria-label` and `role="button"` to menu toggle links.
```html
<a href="#" class="btn-open-mobile-menu" aria-label="Open menu" role="button">
<a class="close hidden" aria-label="Close menu" role="button">
```

---

### 3. aria-hidden Elements Contain Focusable Descendants
**Issue:** Swatch radio inputs had `aria-hidden="true"` but were still keyboard focusable.

**Files Modified:**
- `snippets/swatch-new.liquid`

**Solution:** Added `tabindex="-1"` to prevent focus on hidden inputs.
```html
<input aria-hidden="true" tabindex="-1" ...>
```

---

### 4. Insufficient Color Contrast - Scroll Hint
**Issue:** Scroll hint text had low contrast with animation reducing opacity to 0.5.

**Files Modified:**
- `sections/product-comparison-enhanced.liquid`

**Solution:** Changed color from `#672666` to `#333333` and minimum opacity from `0.5` to `0.7`.

---

### 5. Insufficient Color Contrast - Footer Email Input
**Issue:** Email input placeholder had very low contrast (`#FFFFFF48`).

**Files Modified:**
- `assets/custom.css`

**Solution:** Changed input color to `#FFFFFF` and added placeholder styling with `#FFFFFFB3`.

---

### 6. Missing Form Label
**Issue:** Footer email input relied only on placeholder, no label for screen readers.

**Files Modified:**
- `sections/footer.liquid`

**Solution:** Added visually hidden label associated with the input.
```html
<label for="MailingListForm--{{ section.id }}" class="visuallyhidden">Email address</label>
```

---

### 7. Invalid List Structure
**Issue:** Slick slider modified DOM, causing `<li>` elements to appear outside `<ul>`.

**Files Modified:**
- `sections/featured-customer-reviews.liquid`

**Solution:** Changed from `<ul>/<li>` to `<div>` with ARIA roles.
```html
<div class="slides-customer-reviews" role="list" aria-label="Customer reviews">
  <div class="glide__slide" role="listitem">
```

---

### 8. Heading Order Not Sequential
**Issue:** Pages had `h4` and `h5` headings without proper `h1`, `h2`, `h3` hierarchy.

**Files Modified:**
- `sections/featured-customer-reviews.liquid` (h4 → h2)
- `sections/footer.liquid` (h5 → h2)
- `sections/subscribe-save.liquid` (h4 → h2)
- `sections/ingredients-section.liquid` (h4 → h2)
- `sections/ingredients-benefits.liquid` (h4 → h2)

**Solution:** Changed heading levels to maintain proper document outline.

---

## Testing Recommendations

1. Run PageSpeed Insights again to verify improvements
2. Test with screen reader (VoiceOver, NVDA, or JAWS)
3. Test keyboard navigation (Tab, Enter, Escape)
4. Verify color contrast with browser DevTools or WAVE extension

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
