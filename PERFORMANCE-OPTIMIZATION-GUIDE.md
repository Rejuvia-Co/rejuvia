# Performance Optimization Guide for Rejuvia.co
## Complete Step-by-Step Implementation Instructions

---

## 📊 Current Performance Issues

Your Shopify store has these critical bottlenecks:

- **428KB of JavaScript blocking page render**
  - jQuery: 88KB (line 27 in theme.liquid)
  - vendor.js: 188KB (line 59)
  - ProductJs.js: 31KB (line 60)
  - simplistic.js: 13KB (line 58)

- **Only 1 preconnect directive** (need 5 more for CDNs)
- **36 images loading eagerly** (should be lazy)
- **19 separate CSS files** (should consolidate)
- **38 JavaScript files** (not optimized)

### Current Estimated Scores:
- Performance: 30-50/100
- First Contentful Paint: 3-5 seconds
- Largest Contentful Paint: 5-8 seconds
- Total Blocking Time: 2-4 seconds
- Page Size: 2.5-3.5MB

---

## 🚀 PHASE 1: QUICK WINS (1-2 hours)

### STEP 1: Add Preconnect Directives (5 minutes)
**Risk:** None | **Impact:** 300-900ms faster connections

**File:** `layout/theme.liquid`

**Find line 19:**
```liquid
<link rel='preconnect dns-prefetch' href='https://api.config-security.com/' crossorigin />
```

**Add immediately after:**
```liquid
<link rel="preconnect" href="https://cdn.skio.com" crossorigin>
<link rel="preconnect" href="https://assets.replocdn.com" crossorigin>
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://cdn.addshoppers.com" crossorigin>
```

**Verify:**
- Open Chrome DevTools → Network tab
- Reload page
- Check connection times to CDNs are faster

---

### STEP 2: Async Load AOS Animation CSS (5 minutes)
**Risk:** Low | **Impact:** Removes render-blocking CSS

**File:** `layout/theme.liquid`

**Find lines 42-43:**
```liquid
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
<script defer src="https://unpkg.com/aos@next/dist/aos.js"></script>
```

**Replace with:**
```liquid
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css"></noscript>
<script defer src="https://unpkg.com/aos@next/dist/aos.js"></script>
```

**Verify:**
- Animations still work on page scroll
- CSS loads after initial paint (DevTools → Performance tab)

---

### STEP 3: Remove Empty JavaScript File (10 minutes)
**Risk:** None | **Impact:** 1 fewer HTTP request

**Actions:**
1. Search for `featured-reviews.js` references:
   ```bash
   grep -r "featured-reviews.js" .
   ```
2. Remove any `<script>` tags loading this file
3. Delete `assets/featured-reviews.js` (it's 0 bytes)

---

### STEP 4: Defer Blocking JavaScript (30 min + testing) ⚡ BIGGEST IMPACT
**Risk:** Medium | **Impact:** 328KB no longer blocks rendering!

**File:** `layout/theme.liquid`

**Change 1 - Line 27:**
```liquid
<!-- BEFORE: -->
<script src="{{ 'jquery.min.js' | asset_url }}"></script>

<!-- AFTER: -->
<script src="{{ 'jquery.min.js' | asset_url }}" defer></script>
```

**Change 2 - Lines 58-60:**
```liquid
<!-- BEFORE: -->
<script src="{{ 'simplistic.js' | asset_url }}"></script>
<script src="{{ 'vendor.js' | asset_url }}"></script>
<script src="{{ 'ProductJs.js' | asset_url }}"></script>

<!-- AFTER: -->
<script src="{{ 'simplistic.js' | asset_url }}" defer></script>
<script src="{{ 'vendor.js' | asset_url }}" defer></script>
<script src="{{ 'ProductJs.js' | asset_url }}" defer></script>
```

**CRITICAL - Test ALL These Features:**
- [ ] Homepage loads correctly
- [ ] Product page loads
- [ ] Add to cart button works
- [ ] Side cart opens and functions
- [ ] Product variant selection (color/size pickers)
- [ ] Quantity +/- buttons
- [ ] Mobile menu opens/closes
- [ ] Product image gallery/zoom
- [ ] Search functionality
- [ ] Forms submit correctly
- [ ] SKIO subscription selectors

**If something breaks:**
1. Revert changes immediately
2. Note which feature broke
3. Contact developer for custom initialization code

---

### ✅ Results After Phase 1

**Expected Improvements:**
- Performance Score: **50-70/100** (+20-30 points)
- First Contentful Paint: **1.5-2.5 seconds** (50% faster!)
- Total Blocking Time: **0.5-1 second** (75% reduction)

**What users notice:**
- Page content appears MUCH faster
- Text and images visible almost immediately
- Interactive features work after tiny delay

---

## 🎨 PHASE 2: IMAGE & CSS OPTIMIZATION (7-10 hours)

### STEP 5: Optimize Replo Image Loading (1-2 hours)
**Risk:** Low | **Impact:** 200-400KB saved, 500ms-1.5s faster LCP

**Option A - Replo Dashboard (RECOMMENDED):**
1. Login to https://replo.app
2. Navigate to each page/section
3. Click on images
4. Change loading from "Eager" to "Lazy" for:
   - All images below the fold
   - All images not initially visible
5. Keep ONLY hero/above-fold images as "Eager" (max 1-2 per page)

**Option B - Code (if no dashboard access):**
1. Find files: `snippets/reploChunk*.liquid` (44 files)
2. Search for: `loading="eager"`
3. Change to: `loading="lazy"` (for below-fold images only)

**Verify:**
- DevTools → Network: "Transferred" size much smaller
- Images load as you scroll
- Test on mobile (biggest impact)

---

### STEP 6: Implement WebP Image Format (2-3 hours)
**Risk:** Low | **Impact:** 25-35% smaller image sizes

**Files to edit:**
- `snippets/product_item.liquid`
- `snippets/product_item2.liquid`
- `snippets/product_item_img.liquid`

**Find code like:**
```liquid
<img src="{{ image | image_url: width: 800 }}" alt="{{ image.alt }}">
```

**Replace with:**
```liquid
<picture>
  <source
    srcset="{{ image | image_url: width: 800, format: 'webp' }}"
    type="image/webp">
  <img
    src="{{ image | image_url: width: 800 }}"
    loading="lazy"
    alt="{{ image.alt }}">
</picture>
```

**Verify:**
- DevTools → Network → Filter "Img"
- Images have `.webp` extension
- File sizes 25-35% smaller
- Safari shows JPG fallback (works correctly)

---

### STEP 7: Consolidate CSS Files (3-4 hours)
**Risk:** Medium | **Impact:** 8-10 fewer HTTP requests

**Create 3 new bundled files:**

**1. Create `assets/sections-reviews.css`**
Combine these files:
- `customer-testimonials.css` (2.8KB)
- `customer-testimonials-video.css` (5.0KB)
- `featured-customer-reviews.css` (2.8KB)

**2. Create `assets/sections-features.css`**
Combine these files:
- `how-it-works-section.css` (2.2KB)
- `how-touse-section.css` (2.2KB)
- `trust-badge.css` (1.1KB)
- `product-features-home.css` (1.7KB)

**3. Create `assets/sections-common.css`**
Combine remaining small section CSS files

**Update:** `snippets/head-styles.liquid` to load bundles conditionally

**Verify:**
- DevTools → Network → CSS filter
- ~10 CSS requests (down from 19)
- Test all page types

---

### STEP 8: Async Load CDN Libraries (30 minutes)
**Risk:** Low | **Impact:** Non-blocking carousel CSS

**File:** `sections/customer-testimonials.liquid`

**Find lines 4-14:**
```liquid
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.core.min.css" onload="this.media='all'">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.theme.min.css" onload="this.media='all'">
```

**Change to:**
```liquid
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.core.min.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.theme.min.css" media="print" onload="this.media='all'">
```

---

### ✅ Results After Phase 2

**Expected Improvements:**
- Performance Score: **70-85/100** (+40-50 points total!)
- First Contentful Paint: **1.2-2 seconds** (60% faster)
- Largest Contentful Paint: **2-3 seconds** (50% faster)
- Page Size: **1.5-2MB** (40% reduction)
- Requests: **60-70** (40% fewer)

---

## 🔧 PHASE 3: ADVANCED (Optional, 2-4 weeks)

### JavaScript Bundling & Tree-Shaking
- Reduce JS from 438KB to ~200KB
- Bundle: vendor.js (188KB) + ProductJs.js (31KB) + utilities
- Use webpack/rollup
- **Risk:** High - requires testing

### Replace Slick Carousel
- Remove slick.js (57KB)
- Use Glide.js (already loaded, 11KB)
- **Risk:** Medium - migration needed

### Third-Party App Audit
- SKIO: Lazy-load on product pages only (-121KB on other pages)
- AddShoppers: Evaluate if needed (-20-40KB)
- AOS: Replace with CSS animations (-8KB)

### Service Worker for Caching
- 2-5x faster repeat visits
- Cache static assets and images
- **Risk:** Low - progressive enhancement

---

## 📋 TESTING CHECKLIST

### Before Starting:
- [ ] Backup/duplicate current theme
- [ ] Test in development theme (NOT production!)
- [ ] Run PageSpeed Insights baseline test

### After Each Step:
- [ ] Homepage loads
- [ ] Product page works
- [ ] Add to cart functions
- [ ] Side cart works
- [ ] Variants work
- [ ] Mobile menu works
- [ ] No console errors
- [ ] SKIO subscriptions work

### Tools to Use:
1. **PageSpeed Insights:** https://pagespeed.web.dev/
2. **Chrome DevTools:**
   - Network tab (requests, sizes)
   - Performance tab (load times)
   - Console tab (errors)
3. **Real devices:** iPhone and Android

---

## 📅 RECOMMENDED SCHEDULE

### Day 1 (1-2 hours) - Easy Wins:
1. ✅ Add preconnect directives
2. ✅ Async AOS CSS
3. ✅ Remove empty file
4. ✅ Test everything
5. ✅ Run PageSpeed test

### Day 2 (1-2 hours) - Big Impact:
6. ✅ Defer blocking JavaScript
7. ✅ THOROUGH testing
8. ✅ Run PageSpeed test
9. ✅ Deploy if all works

### Day 3-4 (3-5 hours) - Images:
10. ✅ Optimize Replo images
11. ✅ Implement WebP
12. ✅ Test & measure

### Day 5-6 (3-4 hours) - CSS:
13. ✅ Consolidate CSS
14. ✅ Async CDN libraries
15. ✅ Final test

---

## 📊 EXPECTED RESULTS SUMMARY

### Current State:
- Score: 30-50/100
- FCP: 3-5s
- LCP: 5-8s
- Size: 2.5-3.5MB

### After Phase 1 (Steps 1-4):
- Score: **50-70/100** ⬆️ +25 points
- FCP: **1.5-2.5s** ⬆️ 50% faster
- TBT: **0.5-1s** ⬆️ 75% faster

### After Phase 2 (Steps 5-8):
- Score: **70-85/100** ⬆️ +45 points total
- FCP: **1.2-2s** ⬆️ 60% faster
- LCP: **2-3s** ⬆️ 50% faster
- Size: **1.5-2MB** ⬆️ 40% smaller

### After Phase 3 (Long-term):
- Score: **85-95/100** ⬆️ +60 points
- FCP: **0.8-1.5s** ⬆️ 70% faster
- Size: **1-1.5MB** ⬆️ 60% smaller
- Lighthouse: **90+ mobile, 95+ desktop**

---

## ⚠️ IMPORTANT SAFETY NOTES

**DO:**
✅ Test in development theme first
✅ Create backup before changes
✅ Test thoroughly after each step
✅ Have rollback plan ready
✅ Test on real mobile devices

**DON'T:**
❌ Make changes directly to live theme
❌ Skip testing steps
❌ Rush through changes
❌ Deploy without verification

---

## 💡 BUSINESS IMPACT

- **Faster site = Higher conversions** (Amazon: 100ms = 1% conversion)
- **Better mobile experience = More mobile sales**
- **Better SEO = Higher Google rankings**
- **Lower bounce rate = More engagement**

Expected conversion increase: **30-65%** based on performance improvements

---

## 🎯 PRIORITY SUMMARY

**CRITICAL (Do First):**
- Steps 1-4 (Phase 1) - Biggest impact, lowest effort

**IMPORTANT (Do Next):**
- Steps 5-6 (Phase 2 Part A) - Image optimization

**NICE-TO-HAVE (If Time):**
- Steps 7-8 (Phase 2 Part B) - CSS optimization

**OPTIONAL (Long-term):**
- Phase 3 - Advanced optimizations

---

## 📁 QUICK FILE REFERENCE

### Phase 1 Files:
- `layout/theme.liquid` (lines 19, 27, 42-43, 58-60)

### Phase 2 Files:
- `snippets/reploChunk*.liquid` (44 files)
- `snippets/product_item.liquid`
- `snippets/product_item2.liquid`
- `snippets/product_item_img.liquid`
- `sections/customer-testimonials.liquid` (lines 4-14)

### Phase 3 Files:
- `assets/vendor.js`
- `assets/custom.js.liquid`
- `assets/simplistic.js`
- `assets/ProductJs.js`

---

## 🚀 READY TO START?

Begin with **STEP 1** (preconnect directives) - it's the easiest and safest!

After each step, run PageSpeed Insights to see improvements:
https://pagespeed.web.dev/?url=https://rejuvia.co

Good luck! 🎉
