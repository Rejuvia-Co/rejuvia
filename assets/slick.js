(function(n) {
    "use strict";
    typeof define == "function" && define.amd ? define(["jquery"], n) : typeof exports != "undefined" ? module.exports = n(require("jquery")) : n(jQuery)
})(function(n) {
    "use strict";
    var r = window.Slick || {};
    r = function() {
        var e = 0;

        function i(t, s) {
            var o = this,
                a;
            o.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: n(t),
                appendDots: n(t),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(d, c) {
                    return n('<button type="button" />').text(c + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 0,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, o.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, n.extend(o, o.initials), o.activeBreakpoint = null, o.animType = null, o.animProp = null, o.breakpoints = [], o.breakpointSettings = [], o.cssTransitions = !1, o.focussed = !1, o.interrupted = !1, o.hidden = "hidden", o.paused = !0, o.positionProp = null, o.respondTo = null, o.rowCount = 1, o.shouldClick = !0, o.$slider = n(t), o.$slidesCache = null, o.transformType = null, o.transitionType = null, o.visibilityChange = "visibilitychange", o.windowWidth = 0, o.windowTimer = null, a = n(t).data("slick") || {}, o.options = n.extend({}, o.defaults, s, a), o.currentSlide = o.options.initialSlide, o.originalSettings = o.options, typeof document.mozHidden != "undefined" ? (o.hidden = "mozHidden", o.visibilityChange = "mozvisibilitychange") : typeof document.webkitHidden != "undefined" && (o.hidden = "webkitHidden", o.visibilityChange = "webkitvisibilitychange"), o.autoPlay = n.proxy(o.autoPlay, o), o.autoPlayClear = n.proxy(o.autoPlayClear, o), o.autoPlayIterator = n.proxy(o.autoPlayIterator, o), o.changeSlide = n.proxy(o.changeSlide, o), o.clickHandler = n.proxy(o.clickHandler, o), o.selectHandler = n.proxy(o.selectHandler, o), o.setPosition = n.proxy(o.setPosition, o), o.swipeHandler = n.proxy(o.swipeHandler, o), o.dragHandler = n.proxy(o.dragHandler, o), o.keyHandler = n.proxy(o.keyHandler, o), o.instanceUid = e++, o.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, o.registerBreakpoints(), o.init(!0)
        }
        return i
    }(), r.prototype.activateADA = function() {
        var e = this;
        e.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }, r.prototype.addSlide = r.prototype.slickAdd = function(e, i, t) {
        var s = this;
        if (typeof i == "boolean") t = i, i = null;
        else if (i < 0 || i >= s.slideCount) return !1;
        s.unload(), typeof i == "number" ? i === 0 && s.$slides.length === 0 ? n(e).appendTo(s.$slideTrack) : t ? n(e).insertBefore(s.$slides.eq(i)) : n(e).insertAfter(s.$slides.eq(i)) : t === !0 ? n(e).prependTo(s.$slideTrack) : n(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function(o, a) {
            n(a).attr("data-slick-index", o)
        }), s.$slidesCache = s.$slides, s.reinit()
    }, r.prototype.animateHeight = function() {
        var e = this;
        if (e.options.slidesToShow === 1 && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
            var i = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.animate({
                height: i
            }, e.options.speed)
        }
    }, r.prototype.animateSlide = function(e, i) {
        var t = {},
            s = this;
        s.animateHeight(), s.options.rtl === !0 && s.options.vertical === !1 && (e = -e), s.transformsEnabled === !1 ? s.options.vertical === !1 ? s.$slideTrack.animate({
            left: e
        }, s.options.speed, s.options.easing, i) : s.$slideTrack.animate({
            top: e
        }, s.options.speed, s.options.easing, i) : s.cssTransitions === !1 ? (s.options.rtl === !0 && (s.currentLeft = -s.currentLeft), n({
            animStart: s.currentLeft
        }).animate({
            animStart: e
        }, {
            duration: s.options.speed,
            easing: s.options.easing,
            step: function(o) {
                o = Math.ceil(o), s.options.vertical === !1 ? (t[s.animType] = "translate(" + o + "px, 0px)", s.$slideTrack.css(t)) : (t[s.animType] = "translate(0px," + o + "px)", s.$slideTrack.css(t))
            },
            complete: function() {
                i && i.call()
            }
        })) : (s.applyTransition(), e = Math.ceil(e), s.options.vertical === !1 ? t[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : t[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(t), i && setTimeout(function() {
            s.disableTransition(), i.call()
        }, s.options.speed))
    }, r.prototype.getNavTarget = function() {
        var e = this,
            i = e.options.asNavFor;
        return i && i !== null && (i = n(i).not(e.$slider)), i
    }, r.prototype.asNavFor = function(e) {
        var i = this,
            t = i.getNavTarget();
        t !== null && typeof t == "object" && t.each(function() {
            var s = n(this).slick("getSlick");
            s.unslicked || s.slideHandler(e, !0)
        })
    }, r.prototype.applyTransition = function(e) {
        var i = this,
            t = {};
        i.options.fade === !1 ? t[i.transitionType] = i.transformType + " " + i.options.speed + "ms " + i.options.cssEase : t[i.transitionType] = "opacity " + i.options.speed + "ms " + i.options.cssEase, i.options.fade === !1 ? i.$slideTrack.css(t) : i.$slides.eq(e).css(t)
    }, r.prototype.autoPlay = function() {
        var e = this;
        e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
    }, r.prototype.autoPlayClear = function() {
        var e = this;
        e.autoPlayTimer && clearInterval(e.autoPlayTimer)
    }, r.prototype.autoPlayIterator = function() {
        var e = this,
            i = e.currentSlide + e.options.slidesToScroll;
        !e.paused && !e.interrupted && !e.focussed && (e.options.infinite === !1 && (e.direction === 1 && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : e.direction === 0 && (i = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 === 0 && (e.direction = 1))), e.slideHandler(i))
    }, r.prototype.buildArrows = function() {
        var e = this;
        e.options.arrows === !0 && (e.$prevArrow = n(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = n(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), e.options.infinite !== !0 && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, r.prototype.buildDots = function() {
        var e = this,
            i, t;
        if (e.options.dots === !0 && e.slideCount > e.options.slidesToShow) {
            for (e.$slider.addClass("slick-dotted"), t = n("<ul />").addClass(e.options.dotsClass), i = 0; i <= e.getDotCount(); i += 1) t.append(n("<li />").append(e.options.customPaging.call(this, e, i)));
            e.$dots = t.appendTo(e.options.appendDots), e.$dots.find("li").first().addClass("slick-active")
        }
    }, r.prototype.buildOut = function() {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function(i, t) {
            n(t).attr("data-slick-index", i).data("originalStyling", n(t).attr("style") || "")
        }), e.$slider.addClass("slick-slider"), e.$slideTrack = e.slideCount === 0 ? n('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), (e.options.centerMode === !0 || e.options.swipeToSlide === !0) && (e.options.slidesToScroll = 1), n("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses(typeof e.currentSlide == "number" ? e.currentSlide : 0), e.options.draggable === !0 && e.$list.addClass("draggable")
    }, r.prototype.buildRows = function() {
        var e = this,
            i, t, s, o, a, d, c;
        if (o = document.createDocumentFragment(), d = e.$slider.children(), e.options.rows > 0) {
            for (c = e.options.slidesPerRow * e.options.rows, a = Math.ceil(d.length / c), i = 0; i < a; i++) {
                var l = document.createElement("div");
                for (t = 0; t < e.options.rows; t++) {
                    var p = document.createElement("div");
                    for (s = 0; s < e.options.slidesPerRow; s++) {
                        var f = i * c + (t * e.options.slidesPerRow + s);
                        d.get(f) && p.appendChild(d.get(f))
                    }
                    l.appendChild(p)
                }
                o.appendChild(l)
            }
            e.$slider.empty().append(o), e.$slider.children().children().children().css({
                width: 100 / e.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, r.prototype.checkResponsive = function(e, i) {
        var t = this,
            s, o, a, d = !1,
            c = t.$slider.width(),
            l = window.innerWidth || n(window).width();
        if (t.respondTo === "window" ? a = l : t.respondTo === "slider" ? a = c : t.respondTo === "min" && (a = Math.min(l, c)), t.options.responsive && t.options.responsive.length && t.options.responsive !== null) {
            o = null;
            for (s in t.breakpoints) t.breakpoints.hasOwnProperty(s) && (t.originalSettings.mobileFirst === !1 ? a < t.breakpoints[s] && (o = t.breakpoints[s]) : a > t.breakpoints[s] && (o = t.breakpoints[s]));
            o !== null ? t.activeBreakpoint !== null ? (o !== t.activeBreakpoint || i) && (t.activeBreakpoint = o, t.breakpointSettings[o] === "unslick" ? t.unslick(o) : (t.options = n.extend({}, t.originalSettings, t.breakpointSettings[o]), e === !0 && (t.currentSlide = t.options.initialSlide), t.refresh(e)), d = o) : (t.activeBreakpoint = o, t.breakpointSettings[o] === "unslick" ? t.unslick(o) : (t.options = n.extend({}, t.originalSettings, t.breakpointSettings[o]), e === !0 && (t.currentSlide = t.options.initialSlide), t.refresh(e)), d = o) : t.activeBreakpoint !== null && (t.activeBreakpoint = null, t.options = t.originalSettings, e === !0 && (t.currentSlide = t.options.initialSlide), t.refresh(e), d = o), !e && d !== !1 && t.$slider.trigger("breakpoint", [t, d])
        }
    }, r.prototype.changeSlide = function(e, i) {
        var t = this,
            s = n(e.currentTarget),
            o, a, d;
        switch (s.is("a") && e.preventDefault(), s.is("li") || (s = s.closest("li")), d = t.slideCount % t.options.slidesToScroll !== 0, o = d ? 0 : (t.slideCount - t.currentSlide) % t.options.slidesToScroll, e.data.message) {
            case "previous":
                a = o === 0 ? t.options.slidesToScroll : t.options.slidesToShow - o, t.slideCount > t.options.slidesToShow && t.slideHandler(t.currentSlide - a, !1, i);
                break;
            case "next":
                a = o === 0 ? t.options.slidesToScroll : o, t.slideCount > t.options.slidesToShow && t.slideHandler(t.currentSlide + a, !1, i);
                break;
            case "index":
                var c = e.data.index === 0 ? 0 : e.data.index || s.index() * t.options.slidesToScroll;
                t.slideHandler(t.checkNavigable(c), !1, i), s.children().trigger("focus");
                break;
            default:
                return
        }
    }, r.prototype.checkNavigable = function(e) {
        var i = this,
            t, s;
        if (t = i.getNavigableIndexes(), s = 0, e > t[t.length - 1]) e = t[t.length - 1];
        else
            for (var o in t) {
                if (e < t[o]) {
                    e = s;
                    break
                }
                s = t[o]
            }
        return e
    }, r.prototype.cleanUpEvents = function() {
        var e = this;
        e.options.dots && e.$dots !== null && (n("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", n.proxy(e.interrupt, e, !0)).off("mouseleave.slick", n.proxy(e.interrupt, e, !1)), e.options.accessibility === !0 && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), e.options.accessibility === !0 && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), n(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), e.options.accessibility === !0 && e.$list.off("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && n(e.$slideTrack).children().off("click.slick", e.selectHandler), n(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), n(window).off("resize.slick.slick-" + e.instanceUid, e.resize), n("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), n(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    }, r.prototype.cleanUpSlideEvents = function() {
        var e = this;
        e.$list.off("mouseenter.slick", n.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", n.proxy(e.interrupt, e, !1))
    }, r.prototype.cleanUpRows = function() {
        var e = this,
            i;
        e.options.rows > 0 && (i = e.$slides.children().children(), i.removeAttr("style"), e.$slider.empty().append(i))
    }, r.prototype.clickHandler = function(e) {
        var i = this;
        i.shouldClick === !1 && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
    }, r.prototype.destroy = function(e) {
        var i = this;
        i.autoPlayClear(), i.touchObject = {}, i.cleanUpEvents(), n(".slick-cloned", i.$slider).detach(), i.$dots && i.$dots.remove(), i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()), i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()), i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            n(this).attr("style", n(this).data("originalStyling"))
        }), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.detach(), i.$list.detach(), i.$slider.append(i.$slides)), i.cleanUpRows(), i.$slider.removeClass("slick-slider"), i.$slider.removeClass("slick-initialized"), i.$slider.removeClass("slick-dotted"), i.unslicked = !0, e || i.$slider.trigger("destroy", [i])
    }, r.prototype.disableTransition = function(e) {
        var i = this,
            t = {};
        t[i.transitionType] = "", i.options.fade === !1 ? i.$slideTrack.css(t) : i.$slides.eq(e).css(t)
    }, r.prototype.fadeSlide = function(e, i) {
        var t = this;
        t.cssTransitions === !1 ? (t.$slides.eq(e).css({
            zIndex: t.options.zIndex
        }), t.$slides.eq(e).animate({
            opacity: 1
        }, t.options.speed, t.options.easing, i)) : (t.applyTransition(e), t.$slides.eq(e).css({
            opacity: 1,
            zIndex: t.options.zIndex
        }), i && setTimeout(function() {
            t.disableTransition(e), i.call()
        }, t.options.speed))
    }, r.prototype.fadeSlideOut = function(e) {
        var i = this;
        i.cssTransitions === !1 ? i.$slides.eq(e).animate({
            opacity: 0,
            zIndex: i.options.zIndex - 2
        }, i.options.speed, i.options.easing) : (i.applyTransition(e), i.$slides.eq(e).css({
            opacity: 0,
            zIndex: i.options.zIndex - 2
        }))
    }, r.prototype.filterSlides = r.prototype.slickFilter = function(e) {
        var i = this;
        e !== null && (i.$slidesCache = i.$slides, i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.filter(e).appendTo(i.$slideTrack), i.reinit())
    }, r.prototype.focusHandler = function() {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick", "*", function(i) {
            var t = n(this);
            setTimeout(function() {
                e.options.pauseOnFocus && t.is(":focus") && (e.focussed = !0, e.autoPlay())
            }, 0)
        }).on("blur.slick", "*", function(i) {
            var t = n(this);
            e.options.pauseOnFocus && (e.focussed = !1, e.autoPlay())
        })
    }, r.prototype.getCurrent = r.prototype.slickCurrentSlide = function() {
        var e = this;
        return e.currentSlide
    }, r.prototype.getDotCount = function() {
        var e = this,
            i = 0,
            t = 0,
            s = 0;
        if (e.options.infinite === !0)
            if (e.slideCount <= e.options.slidesToShow) ++s;
            else
                for (; i < e.slideCount;) ++s, i = t + e.options.slidesToScroll, t += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else if (e.options.centerMode === !0) s = e.slideCount;
        else if (!e.options.asNavFor) s = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
        else
            for (; i < e.slideCount;) ++s, i = t + e.options.slidesToScroll, t += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s - 1
    }, r.prototype.getLeft = function(e) {
        var i = this,
            t, s, o = 0,
            a, d;
        if (i.slideOffset = 0, s = i.$slides.first().outerHeight(!0), i.options.infinite === !0 ? (i.slideCount > i.options.slidesToShow && (i.slideOffset = i.slideWidth * i.options.slidesToShow * -1, d = -1, i.options.vertical === !0 && i.options.centerMode === !0 && (i.options.slidesToShow === 2 ? d = -1.5 : i.options.slidesToShow === 1 && (d = -2)), o = s * i.options.slidesToShow * d), i.slideCount % i.options.slidesToScroll !== 0 && e + i.options.slidesToScroll > i.slideCount && i.slideCount > i.options.slidesToShow && (e > i.slideCount ? (i.slideOffset = (i.options.slidesToShow - (e - i.slideCount)) * i.slideWidth * -1, o = (i.options.slidesToShow - (e - i.slideCount)) * s * -1) : (i.slideOffset = i.slideCount % i.options.slidesToScroll * i.slideWidth * -1, o = i.slideCount % i.options.slidesToScroll * s * -1))) : e + i.options.slidesToShow > i.slideCount && (i.slideOffset = (e + i.options.slidesToShow - i.slideCount) * i.slideWidth, o = (e + i.options.slidesToShow - i.slideCount) * s), i.slideCount <= i.options.slidesToShow && (i.slideOffset = 0, o = 0), i.options.centerMode === !0 && i.slideCount <= i.options.slidesToShow ? i.slideOffset = 0 : i.options.centerMode === !0 && i.options.infinite === !0 ? i.slideOffset += i.slideWidth * Math.floor(i.options.slidesToShow / 2) - i.slideWidth : i.options.centerMode === !0 && (i.slideOffset = 0, i.slideOffset += i.slideWidth * Math.floor(i.options.slidesToShow / 2)), i.options.vertical === !1) i.slideCount <= i.options.slidesToShow ? t = i.slideOffset : t = e * i.slideWidth * -1 + i.slideOffset;
        else {
            o = 0;
            for (var c = 0; c < e; c++) o += i.$slides.eq(c).outerHeight(!0);
            if (i.options.infinite === !0)
                for (var l = Array.prototype.slice.call(i.$slideTrack[0].children), c = 0; c < l.length; c++) l[c].dataset.slickIndex < 0 && (o += n(l[c]).outerHeight(!0));
            t = o * -1
        }
        return i.options.variableWidth === !0 && (i.slideCount <= i.options.slidesToShow || i.options.infinite === !1 ? a = i.$slideTrack.children(".slick-slide").eq(e) : a = i.$slideTrack.children(".slick-slide").eq(e + i.options.slidesToShow), i.options.rtl === !0 ? a[0] ? t = (i.$slideTrack.width() - a[0].offsetLeft - a.width()) * -1 : t = 0 : t = a[0] ? a[0].offsetLeft * -1 : 0, i.options.centerMode === !0 && (i.slideCount <= i.options.slidesToShow || i.options.infinite === !1 ? a = i.$slideTrack.children(".slick-slide").eq(e) : a = i.$slideTrack.children(".slick-slide").eq(e + i.options.slidesToShow + 1), i.options.rtl === !0 ? a[0] ? t = (i.$slideTrack.width() - a[0].offsetLeft - a.width()) * -1 : t = 0 : t = a[0] ? a[0].offsetLeft * -1 : 0, t += (i.$list.width() - a.outerWidth()) / 2)), t
    }, r.prototype.getOption = r.prototype.slickGetOption = function(e) {
        var i = this;
        return i.options[e]
    }, r.prototype.getNavigableIndexes = function() {
        var e = this,
            i = 0,
            t = 0,
            s = [],
            o;
        for (e.options.infinite === !1 ? o = e.slideCount : (i = e.options.slidesToScroll * -1, t = e.options.slidesToScroll * -1, o = e.slideCount * 2); i < o;) s.push(i), i = t + e.options.slidesToScroll, t += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    }, r.prototype.getSlick = function() {
        return this
    }, r.prototype.getSlideCount = function() {
        var e = this,
            i, t, s, o;
        return o = e.options.centerMode === !0 ? Math.floor(e.$list.width() / 2) : 0, s = e.swipeLeft * -1 + o, e.options.swipeToSlide === !0 ? (e.$slideTrack.find(".slick-slide").each(function(a, d) {
            var c, l, p;
            if (c = n(d).outerWidth(), l = d.offsetLeft, e.options.centerMode !== !0 && (l += c / 2), p = l + c, s < p) return t = d, !1
        }), i = Math.abs(n(t).attr("data-slick-index") - e.currentSlide) || 1, i) : e.options.slidesToScroll
    }, r.prototype.goTo = r.prototype.slickGoTo = function(e, i) {
        var t = this;
        t.changeSlide({
            data: {
                message: "index",
                index: parseInt(e)
            }
        }, i)
    }, r.prototype.init = function(e) {
        var i = this;
        n(i.$slider).hasClass("slick-initialized") || (n(i.$slider).addClass("slick-initialized"), i.buildRows(), i.buildOut(), i.setProps(), i.startLoad(), i.loadSlider(), i.initializeEvents(), i.updateArrows(), i.updateDots(), i.checkResponsive(!0), i.focusHandler()), e && i.$slider.trigger("init", [i]), i.options.accessibility === !0 && i.initADA(), i.options.autoplay && (i.paused = !1, i.autoPlay())
    }, r.prototype.initADA = function() {
        var e = this,
            i = Math.ceil(e.slideCount / e.options.slidesToShow),
            t = e.getNavigableIndexes().filter(function(a) {
                return a >= 0 && a < e.slideCount
            });
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }), e.$dots !== null && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(a) {
            var d = t.indexOf(a);
            if (n(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + a,
                tabindex: -1
            }), d !== -1) {
                var c = "slick-slide-control" + e.instanceUid + d;
                n("#" + c).length && n(this).attr({
                    "aria-describedby": c
                })
            }
        }), e.$dots.attr("role", "tablist").find("li").each(function(a) {
            var d = t[a];
            n(this).attr({
                role: "presentation"
            }), n(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + e.instanceUid + a,
                "aria-controls": "slick-slide" + e.instanceUid + d,
                "aria-label": a + 1 + " of " + i,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(e.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var s = e.currentSlide, o = s + e.options.slidesToShow; s < o; s++) e.options.focusOnChange ? e.$slides.eq(s).attr({
            tabindex: "0"
        }) : e.$slides.eq(s).removeAttr("tabindex");
        e.activateADA()
    }, r.prototype.initArrowEvents = function() {
        var e = this;
        e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, e.changeSlide), e.options.accessibility === !0 && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
    }, r.prototype.initDotEvents = function() {
        var e = this;
        e.options.dots === !0 && e.slideCount > e.options.slidesToShow && (n("li", e.$dots).on("click.slick", {
            message: "index"
        }, e.changeSlide), e.options.accessibility === !0 && e.$dots.on("keydown.slick", e.keyHandler)), e.options.dots === !0 && e.options.pauseOnDotsHover === !0 && e.slideCount > e.options.slidesToShow && n("li", e.$dots).on("mouseenter.slick", n.proxy(e.interrupt, e, !0)).on("mouseleave.slick", n.proxy(e.interrupt, e, !1))
    }, r.prototype.initSlideEvents = function() {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", n.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", n.proxy(e.interrupt, e, !1)))
    }, r.prototype.initializeEvents = function() {
        var e = this;
        e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), n(document).on(e.visibilityChange, n.proxy(e.visibility, e)), e.options.accessibility === !0 && e.$list.on("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && n(e.$slideTrack).children().on("click.slick", e.selectHandler), n(window).on("orientationchange.slick.slick-" + e.instanceUid, n.proxy(e.orientationChange, e)), n(window).on("resize.slick.slick-" + e.instanceUid, n.proxy(e.resize, e)), n("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), n(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), n(e.setPosition)
    }, r.prototype.initUI = function() {
        var e = this;
        e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.show()
    }, r.prototype.keyHandler = function(e) {
        var i = this;
        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (e.keyCode === 37 && i.options.accessibility === !0 ? i.changeSlide({
            data: {
                message: i.options.rtl === !0 ? "next" : "previous"
            }
        }) : e.keyCode === 39 && i.options.accessibility === !0 && i.changeSlide({
            data: {
                message: i.options.rtl === !0 ? "previous" : "next"
            }
        }))
    }, r.prototype.lazyLoad = function() {
        var e = this,
            i, t, s, o;

        function a(f) {
            n("img[data-lazy]", f).each(function() {
                var u = n(this),
                    h = n(this).attr("data-lazy"),
                    g = n(this).attr("data-srcset"),
                    v = n(this).attr("data-sizes") || e.$slider.attr("data-sizes"),
                    k = document.createElement("img");
                k.onload = function() {
                    u.animate({
                        opacity: 0
                    }, 100, function() {
                        g && (u.attr("srcset", g), v && u.attr("sizes", v)), u.attr("src", h).animate({
                            opacity: 1
                        }, 200, function() {
                            u.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }), e.$slider.trigger("lazyLoaded", [e, u, h])
                    })
                }, k.onerror = function() {
                    u.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), e.$slider.trigger("lazyLoadError", [e, u, h])
                }, k.src = h
            })
        }
        if (e.options.centerMode === !0 ? e.options.infinite === !0 ? (s = e.currentSlide + (e.options.slidesToShow / 2 + 1), o = s + e.options.slidesToShow + 2) : (s = Math.max(0, e.currentSlide - (e.options.slidesToShow / 2 + 1)), o = 2 + (e.options.slidesToShow / 2 + 1) + e.currentSlide) : (s = e.options.infinite ? e.options.slidesToShow + e.currentSlide : e.currentSlide, o = Math.ceil(s + e.options.slidesToShow), e.options.fade === !0 && (s > 0 && s--, o <= e.slideCount && o++)), i = e.$slider.find(".slick-slide").slice(s, o), e.options.lazyLoad === "anticipated")
            for (var d = s - 1, c = o, l = e.$slider.find(".slick-slide"), p = 0; p < e.options.slidesToScroll; p++) d < 0 && (d = e.slideCount - 1), i = i.add(l.eq(d)), i = i.add(l.eq(c)), d--, c++;
        a(i), e.slideCount <= e.options.slidesToShow ? (t = e.$slider.find(".slick-slide"), a(t)) : e.currentSlide >= e.slideCount - e.options.slidesToShow ? (t = e.$slider.find(".slick-cloned").slice(0, e.options.slidesToShow), a(t)) : e.currentSlide === 0 && (t = e.$slider.find(".slick-cloned").slice(e.options.slidesToShow * -1), a(t))
    }, r.prototype.loadSlider = function() {
        var e = this;
        e.setPosition(), e.$slideTrack.css({
            opacity: 1
        }), e.$slider.removeClass("slick-loading"), e.initUI(), e.options.lazyLoad === "progressive" && e.progressiveLazyLoad()
    }, r.prototype.next = r.prototype.slickNext = function() {
        var e = this;
        e.changeSlide({
            data: {
                message: "next"
            }
        })
    }, r.prototype.orientationChange = function() {
        var e = this;
        e.checkResponsive(), e.setPosition()
    }, r.prototype.pause = r.prototype.slickPause = function() {
        var e = this;
        e.autoPlayClear(), e.paused = !0
    }, r.prototype.play = r.prototype.slickPlay = function() {
        var e = this;
        e.autoPlay(), e.options.autoplay = !0, e.paused = !1, e.focussed = !1, e.interrupted = !1
    }, r.prototype.postSlide = function(e) {
        var i = this;
        if (!i.unslicked && (i.$slider.trigger("afterChange", [i, e]), i.animating = !1, i.slideCount > i.options.slidesToShow && i.setPosition(), i.swipeLeft = null, i.options.autoplay && i.autoPlay(), i.options.accessibility === !0 && (i.initADA(), i.options.focusOnChange))) {
            var t = n(i.$slides.get(i.currentSlide));
            t.attr("tabindex", 0).focus()
        }
    }, r.prototype.prev = r.prototype.slickPrev = function() {
        var e = this;
        e.changeSlide({
            data: {
                message: "previous"
            }
        })
    }, r.prototype.preventDefault = function(e) {
        e.preventDefault()
    }, r.prototype.progressiveLazyLoad = function(e) {
        e = e || 1;
        var i = this,
            t = n("img[data-lazy]", i.$slider),
            s, o, a, d, c;
        t.length ? (s = t.first(), o = s.attr("data-lazy"), a = s.attr("data-srcset"), d = s.attr("data-sizes") || i.$slider.attr("data-sizes"), c = document.createElement("img"), c.onload = function() {
            a && (s.attr("srcset", a), d && s.attr("sizes", d)), s.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), i.options.adaptiveHeight === !0 && i.setPosition(), i.$slider.trigger("lazyLoaded", [i, s, o]), i.progressiveLazyLoad()
        }, c.onerror = function() {
            e < 3 ? setTimeout(function() {
                i.progressiveLazyLoad(e + 1)
            }, 500) : (s.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), i.$slider.trigger("lazyLoadError", [i, s, o]), i.progressiveLazyLoad())
        }, c.src = o) : i.$slider.trigger("allImagesLoaded", [i])
    }, r.prototype.refresh = function(e) {
        var i = this,
            t, s;
        s = i.slideCount - i.options.slidesToShow, !i.options.infinite && i.currentSlide > s && (i.currentSlide = s), i.slideCount <= i.options.slidesToShow && (i.currentSlide = 0), t = i.currentSlide, i.destroy(!0), n.extend(i, i.initials, {
            currentSlide: t
        }), i.init(), e || i.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }, r.prototype.registerBreakpoints = function() {
        var e = this,
            i, t, s, o = e.options.responsive || null;
        if (n.type(o) === "array" && o.length) {
            e.respondTo = e.options.respondTo || "window";
            for (i in o)
                if (s = e.breakpoints.length - 1, o.hasOwnProperty(i)) {
                    for (t = o[i].breakpoint; s >= 0;) e.breakpoints[s] && e.breakpoints[s] === t && e.breakpoints.splice(s, 1), s--;
                    e.breakpoints.push(t), e.breakpointSettings[t] = o[i].settings
                } e.breakpoints.sort(function(a, d) {
                return e.options.mobileFirst ? a - d : d - a
            })
        }
    }, r.prototype.reinit = function() {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && e.currentSlide !== 0 && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), e.options.focusOnSelect === !0 && n(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses(typeof e.currentSlide == "number" ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
    }, r.prototype.resize = function() {
        var e = this;
        n(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function() {
            e.windowWidth = n(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
        }, 50))
    }, r.prototype.removeSlide = r.prototype.slickRemove = function(e, i, t) {
        var s = this;
        if (typeof e == "boolean" ? (i = e, e = i === !0 ? 0 : s.slideCount - 1) : e = i === !0 ? --e : e, s.slideCount < 1 || e < 0 || e > s.slideCount - 1) return !1;
        s.unload(), t === !0 ? s.$slideTrack.children().remove() : s.$slideTrack.children(this.options.slide).eq(e).remove(), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slidesCache = s.$slides, s.reinit()
    }, r.prototype.setCSS = function(e) {
        var i = this,
            t = {},
            s, o;
        i.options.rtl === !0 && (e = -e), s = i.positionProp == "left" ? Math.ceil(e) + "px" : "0px", o = i.positionProp == "top" ? Math.ceil(e) + "px" : "0px", t[i.positionProp] = e, i.transformsEnabled === !1 ? i.$slideTrack.css(t) : (t = {}, i.cssTransitions === !1 ? (t[i.animType] = "translate(" + s + ", " + o + ")", i.$slideTrack.css(t)) : (t[i.animType] = "translate3d(" + s + ", " + o + ", 0px)", i.$slideTrack.css(t)))
    }, r.prototype.setDimensions = function() {
        var e = this;
        if (e.options.vertical === !1) e.options.centerMode === !0 && e.$list.css({
            padding: "0px " + e.options.centerPadding
        });
        else {
            if (e.options.slidesToShow == 1) {
                var i = -1;
                e.$slides.each(function() {
                    n(this).height() > i && (i = n(this).height())
                }), e.$slides.each(function() {
                    n(this).height() < i && n(this).css("margin", Math.ceil((i - n(this).height()) / 2) + "px 0")
                })
            }
            e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), e.options.centerMode === !0 && e.$list.css({
                padding: e.options.centerPadding + " 0px"
            })
        }
        e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), e.options.vertical === !1 && e.options.variableWidth === !1 ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : e.options.variableWidth === !0 ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
        e.options.variableWidth === !1 && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
    }, r.prototype.setFade = function() {
        var e = this,
            i;
        e.$slides.each(function(t, s) {
            i = e.slideWidth * t * -1, e.options.rtl === !0 ? n(s).css({
                position: "relative",
                right: i,
                top: 0,
                zIndex: e.options.zIndex - 2,
                opacity: 0
            }) : n(s).css({
                position: "relative",
                left: i,
                top: 0,
                zIndex: e.options.zIndex - 2,
                opacity: 0
            })
        }), e.$slides.eq(e.currentSlide).css({
            zIndex: e.options.zIndex - 1,
            opacity: 1
        })
    }, r.prototype.setHeight = function() {
        var e = this;
        if (e.options.slidesToShow === 1 && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
            var i = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.css("height", i)
        }
    }, r.prototype.setOption = r.prototype.slickSetOption = function() {
        var e = this,
            i, t, s, o, a = !1,
            d;
        if (n.type(arguments[0]) === "object" ? (s = arguments[0], a = arguments[1], d = "multiple") : n.type(arguments[0]) === "string" && (s = arguments[0], o = arguments[1], a = arguments[2], arguments[0] === "responsive" && n.type(arguments[1]) === "array" ? d = "responsive" : typeof arguments[1] != "undefined" && (d = "single")), d === "single") e.options[s] = o;
        else if (d === "multiple") n.each(s, function(c, l) {
            e.options[c] = l
        });
        else if (d === "responsive")
            for (t in o)
                if (n.type(e.options.responsive) !== "array") e.options.responsive = [o[t]];
                else {
                    for (i = e.options.responsive.length - 1; i >= 0;) e.options.responsive[i].breakpoint === o[t].breakpoint && e.options.responsive.splice(i, 1), i--;
                    e.options.responsive.push(o[t])
                } a && (e.unload(), e.reinit())
    }, r.prototype.setPosition = function() {
        var e = this;
        e.setDimensions(), e.setHeight(), e.options.fade === !1 ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
    }, r.prototype.setProps = function() {
        var e = this,
            i = document.body.style;
        e.positionProp = e.options.vertical === !0 ? "top" : "left", e.positionProp === "top" ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), (i.WebkitTransition !== void 0 || i.MozTransition !== void 0 || i.msTransition !== void 0) && e.options.useCSS === !0 && (e.cssTransitions = !0), e.options.fade && (typeof e.options.zIndex == "number" ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), i.OTransform !== void 0 && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", i.perspectiveProperty === void 0 && i.webkitPerspective === void 0 && (e.animType = !1)), i.MozTransform !== void 0 && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", i.perspectiveProperty === void 0 && i.MozPerspective === void 0 && (e.animType = !1)), i.webkitTransform !== void 0 && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", i.perspectiveProperty === void 0 && i.webkitPerspective === void 0 && (e.animType = !1)), i.msTransform !== void 0 && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", i.msTransform === void 0 && (e.animType = !1)), i.transform !== void 0 && e.animType !== !1 && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && e.animType !== null && e.animType !== !1
    }, r.prototype.setSlideClasses = function(e) {
        var i = this,
            t, s, o, a;
        if (s = i.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), i.$slides.eq(e).addClass("slick-current"), i.options.centerMode === !0) {
            var d = i.options.slidesToShow % 2 === 0 ? 1 : 0;
            t = Math.floor(i.options.slidesToShow / 2), i.options.infinite === !0 && (e >= t && e <= i.slideCount - 1 - t ? i.$slides.slice(e - t + d, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = i.options.slidesToShow + e, s.slice(o - t + 1 + d, o + t + 2).addClass("slick-active").attr("aria-hidden", "false")), e === 0 ? s.eq(s.length - 1 - i.options.slidesToShow).addClass("slick-center") : e === i.slideCount - 1 && s.eq(i.options.slidesToShow).addClass("slick-center")), i.$slides.eq(e).addClass("slick-center")
        } else e >= 0 && e <= i.slideCount - i.options.slidesToShow ? i.$slides.slice(e, e + i.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : s.length <= i.options.slidesToShow ? s.addClass("slick-active").attr("aria-hidden", "false") : (a = i.slideCount % i.options.slidesToShow, o = i.options.infinite === !0 ? i.options.slidesToShow + e : e, i.options.slidesToShow == i.options.slidesToScroll && i.slideCount - e < i.options.slidesToShow ? s.slice(o - (i.options.slidesToShow - a), o + a).addClass("slick-active").attr("aria-hidden", "false") : s.slice(o, o + i.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        (i.options.lazyLoad === "ondemand" || i.options.lazyLoad === "anticipated") && i.lazyLoad()
    }, r.prototype.setupInfinite = function() {
        var e = this,
            i, t, s;
        if (e.options.fade === !0 && (e.options.centerMode = !1), e.options.infinite === !0 && e.options.fade === !1 && (t = null, e.slideCount > e.options.slidesToShow)) {
            for (e.options.centerMode === !0 ? s = e.options.slidesToShow + 1 : s = e.options.slidesToShow, i = e.slideCount; i > e.slideCount - s; i -= 1) t = i - 1, n(e.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - e.slideCount).prependTo(e.$slideTrack).addClass("slick-cloned");
            for (i = 0; i < s + e.slideCount; i += 1) t = i, n(e.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + e.slideCount).appendTo(e.$slideTrack).addClass("slick-cloned");
            e.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                n(this).attr("id", "")
            })
        }
    }, r.prototype.interrupt = function(e) {
        var i = this;
        e || i.autoPlay(), i.interrupted = e
    }, r.prototype.selectHandler = function(e) {
        var i = this,
            t = n(e.target).is(".slick-slide") ? n(e.target) : n(e.target).parents(".slick-slide"),
            s = parseInt(t.attr("data-slick-index"));
        if (s || (s = 0), i.slideCount <= i.options.slidesToShow) {
            i.slideHandler(s, !1, !0);
            return
        }
        i.slideHandler(s)
    }, r.prototype.slideHandler = function(e, i, t) {
        var s, o, a, d, c = null,
            l = this,
            p;
        if (i = i || !1, !(l.animating === !0 && l.options.waitForAnimate === !0) && !(l.options.fade === !0 && l.currentSlide === e)) {
            if (i === !1 && l.asNavFor(e), s = e, c = l.getLeft(s), d = l.getLeft(l.currentSlide), l.currentLeft = l.swipeLeft === null ? d : l.swipeLeft, l.options.infinite === !1 && l.options.centerMode === !1 && (e < 0 || e > l.getDotCount() * l.options.slidesToScroll)) {
                l.options.fade === !1 && (s = l.currentSlide, t !== !0 && l.slideCount > l.options.slidesToShow ? l.animateSlide(d, function() {
                    l.postSlide(s)
                }) : l.postSlide(s));
                return
            } else if (l.options.infinite === !1 && l.options.centerMode === !0 && (e < 0 || e > l.slideCount - l.options.slidesToScroll)) {
                l.options.fade === !1 && (s = l.currentSlide, t !== !0 && l.slideCount > l.options.slidesToShow ? l.animateSlide(d, function() {
                    l.postSlide(s)
                }) : l.postSlide(s));
                return
            }
            if (l.options.autoplay && clearInterval(l.autoPlayTimer), s < 0 ? l.slideCount % l.options.slidesToScroll !== 0 ? o = l.slideCount - l.slideCount % l.options.slidesToScroll : o = l.slideCount + s : s >= l.slideCount ? l.slideCount % l.options.slidesToScroll !== 0 ? o = 0 : o = s - l.slideCount : o = s, l.animating = !0, l.$slider.trigger("beforeChange", [l, l.currentSlide, o]), a = l.currentSlide, l.currentSlide = o, l.setSlideClasses(l.currentSlide), l.options.asNavFor && (p = l.getNavTarget(), p = p.slick("getSlick"), p.slideCount <= p.options.slidesToShow && p.setSlideClasses(l.currentSlide)), l.updateDots(), l.updateArrows(), l.options.fade === !0) {
                t !== !0 ? (l.fadeSlideOut(a), l.fadeSlide(o, function() {
                    l.postSlide(o)
                })) : l.postSlide(o), l.animateHeight();
                return
            }
            t !== !0 && l.slideCount > l.options.slidesToShow ? l.animateSlide(c, function() {
                l.postSlide(o)
            }) : l.postSlide(o)
        }
    }, r.prototype.startLoad = function() {
        var e = this;
        e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
    }, r.prototype.swipeDirection = function() {
        var e, i, t, s, o = this;
        return e = o.touchObject.startX - o.touchObject.curX, i = o.touchObject.startY - o.touchObject.curY, t = Math.atan2(i, e), s = Math.round(t * 180 / Math.PI), s < 0 && (s = 360 - Math.abs(s)), s <= 45 && s >= 0 || s <= 360 && s >= 315 ? o.options.rtl === !1 ? "left" : "right" : s >= 135 && s <= 225 ? o.options.rtl === !1 ? "right" : "left" : o.options.verticalSwiping === !0 ? s >= 35 && s <= 135 ? "down" : "up" : "vertical"
    }, r.prototype.swipeEnd = function(e) {
        var i = this,
            t, s;
        if (i.dragging = !1, i.swiping = !1, i.scrolling) return i.scrolling = !1, !1;
        if (i.interrupted = !1, i.shouldClick = !(i.touchObject.swipeLength > 10), i.touchObject.curX === void 0) return !1;
        if (i.touchObject.edgeHit === !0 && i.$slider.trigger("edge", [i, i.swipeDirection()]), i.touchObject.swipeLength >= i.touchObject.minSwipe) {
            switch (s = i.swipeDirection(), s) {
                case "left":
                case "down":
                    t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide + i.getSlideCount()) : i.currentSlide + i.getSlideCount(), i.currentDirection = 0;
                    break;
                case "right":
                case "up":
                    t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide - i.getSlideCount()) : i.currentSlide - i.getSlideCount(), i.currentDirection = 1;
                    break;
                default:
            }
            s != "vertical" && (i.slideHandler(t), i.touchObject = {}, i.$slider.trigger("swipe", [i, s]))
        } else i.touchObject.startX !== i.touchObject.curX && (i.slideHandler(i.currentSlide), i.touchObject = {})
    }, r.prototype.swipeHandler = function(e) {
        var i = this;
        if (!(i.options.swipe === !1 || "ontouchend" in document && i.options.swipe === !1) && !(i.options.draggable === !1 && e.type.indexOf("mouse") !== -1)) switch (i.touchObject.fingerCount = e.originalEvent && e.originalEvent.touches !== void 0 ? e.originalEvent.touches.length : 1, i.touchObject.minSwipe = i.listWidth / i.options.touchThreshold, i.options.verticalSwiping === !0 && (i.touchObject.minSwipe = i.listHeight / i.options.touchThreshold), e.data.action) {
            case "start":
                i.swipeStart(e);
                break;
            case "move":
                i.swipeMove(e);
                break;
            case "end":
                i.swipeEnd(e);
                break
        }
    }, r.prototype.swipeMove = function(e) {
        var i = this,
            t = !1,
            s, o, a, d, c, l;
        if (c = e.originalEvent !== void 0 ? e.originalEvent.touches : null, !i.dragging || i.scrolling || c && c.length !== 1) return !1;
        if (s = i.getLeft(i.currentSlide), i.touchObject.curX = c !== void 0 ? c[0].pageX : e.clientX, i.touchObject.curY = c !== void 0 ? c[0].pageY : e.clientY, i.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(i.touchObject.curX - i.touchObject.startX, 2))), l = Math.round(Math.sqrt(Math.pow(i.touchObject.curY - i.touchObject.startY, 2))), !i.options.verticalSwiping && !i.swiping && l > 4) return i.scrolling = !0, !1;
        if (i.options.verticalSwiping === !0 && (i.touchObject.swipeLength = l), o = i.swipeDirection(), e.originalEvent !== void 0 && i.touchObject.swipeLength > 4 && (i.swiping = !0, e.preventDefault()), d = (i.options.rtl === !1 ? 1 : -1) * (i.touchObject.curX > i.touchObject.startX ? 1 : -1), i.options.verticalSwiping === !0 && (d = i.touchObject.curY > i.touchObject.startY ? 1 : -1), a = i.touchObject.swipeLength, i.touchObject.edgeHit = !1, i.options.infinite === !1 && (i.currentSlide === 0 && o === "right" || i.currentSlide >= i.getDotCount() && o === "left") && (a = i.touchObject.swipeLength * i.options.edgeFriction, i.touchObject.edgeHit = !0), i.options.vertical === !1 ? i.swipeLeft = s + a * d : i.swipeLeft = s + a * (i.$list.height() / i.listWidth) * d, i.options.verticalSwiping === !0 && (i.swipeLeft = s + a * d), i.options.fade === !0 || i.options.touchMove === !1) return !1;
        if (i.animating === !0) return i.swipeLeft = null, !1;
        i.setCSS(i.swipeLeft)
    }, r.prototype.swipeStart = function(e) {
        var i = this,
            t;
        if (i.interrupted = !0, i.touchObject.fingerCount !== 1 || i.slideCount <= i.options.slidesToShow) return i.touchObject = {}, !1;
        e.originalEvent !== void 0 && e.originalEvent.touches !== void 0 && (t = e.originalEvent.touches[0]), i.touchObject.startX = i.touchObject.curX = t !== void 0 ? t.pageX : e.clientX, i.touchObject.startY = i.touchObject.curY = t !== void 0 ? t.pageY : e.clientY, i.dragging = !0
    }, r.prototype.unfilterSlides = r.prototype.slickUnfilter = function() {
        var e = this;
        e.$slidesCache !== null && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
    }, r.prototype.unload = function() {
        var e = this;
        n(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, r.prototype.unslick = function(e) {
        var i = this;
        i.$slider.trigger("unslick", [i, e]), i.destroy()
    }, r.prototype.updateArrows = function() {
        var e = this,
            i;
        i = Math.floor(e.options.slidesToShow / 2), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.currentSlide === 0 ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : (e.currentSlide >= e.slideCount - e.options.slidesToShow && e.options.centerMode === !1 || e.currentSlide >= e.slideCount - 1 && e.options.centerMode === !0) && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, r.prototype.updateDots = function() {
        var e = this;
        e.$dots !== null && (e.$dots.find("li").removeClass("slick-active").end(), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
    }, r.prototype.visibility = function() {
        var e = this;
        e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
    }, n.fn.slick = function() {
        var e = this,
            i = arguments[0],
            t = Array.prototype.slice.call(arguments, 1),
            s = e.length,
            o, a;
        for (o = 0; o < s; o++)
            if (typeof i == "object" || typeof i == "undefined" ? e[o].slick = new r(e[o], i) : a = e[o].slick[i].apply(e[o].slick, t), typeof a != "undefined") return a;
        return e
    }
});
//# sourceMappingURL=/s/files/1/0418/7085/2258/t/34/assets/slick.js.map?v=1638376269