// Shopify option_selection.js
function floatToString(t,e){var o=t.toFixed(e).toString();return o.match(/^\.\d+/)?"0"+o:o}"undefined"==typeof window.Shopify&&(window.Shopify={}),Shopify.each=function(t,e){for(var o=0;o<t.length;o++)e(t[o],o)},Shopify.map=function(t,e){for(var o=[],i=0;i<t.length;i++)o.push(e(t[i],i));return o},Shopify.arrayIncludes=function(t,e){for(var o=0;o<t.length;o++)if(t[o]==e)return!0;return!1},Shopify.uniq=function(t){for(var e=[],o=0;o<t.length;o++)Shopify.arrayIncludes(e,t[o])||e.push(t[o]);return e},Shopify.isDefined=function(t){return void 0!==t},Shopify.getClass=function(t){return Object.prototype.toString.call(t).slice(8,-1)},Shopify.extend=function(t,e){function o(){}o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t,t.baseConstructor=e,t.superClass=e.prototype},Shopify.locationSearch=function(){return window.location.search},Shopify.locationHash=function(){return window.location.hash},Shopify.replaceState=function(t){window.history.replaceState({},document.title,t)},Shopify.urlParam=function(t){var e=RegExp("[?&]"+t+"=([^&#]*)").exec(Shopify.locationSearch());return e&&decodeURIComponent(e[1].replace(/\+/g," "))},Shopify.newState=function(t,e){return(Shopify.urlParam(t)?Shopify.locationSearch().replace(RegExp("("+t+"=)[^&#]+"),"$1"+e):""===Shopify.locationSearch()?"?"+t+"="+e:Shopify.locationSearch()+"&"+t+"="+e)+Shopify.locationHash()},Shopify.setParam=function(t,e){Shopify.replaceState(Shopify.newState(t,e))},Shopify.Product=function(t){Shopify.isDefined(t)&&this.update(t)},Shopify.Product.prototype.update=function(t){for(property in t)this[property]=t[property]},Shopify.Product.prototype.optionNames=function(){return"Array"==Shopify.getClass(this.options)?this.options:[]},Shopify.Product.prototype.optionValues=function(t){if(!Shopify.isDefined(this.variants))return null;var e=Shopify.map(this.variants,function(e){var o="option"+(t+1);return e[o]==undefined?null:e[o]});return null==e[0]?null:Shopify.uniq(e)},Shopify.Product.prototype.getVariant=function(t){var e=null;return t.length!=this.options.length?e:(Shopify.each(this.variants,function(o){for(var i=!0,r=0;r<t.length;r++){o["option"+(r+1)]!=t[r]&&(i=!1)}if(1==i)return void(e=o)}),e)},Shopify.Product.prototype.getVariantById=function(t){for(var e=0;e<this.variants.length;e++){var o=this.variants[e];if(t==o.id)return o}return null},Shopify.money_format="$",Shopify.formatMoney=function(t,e){function o(t,e){return void 0===t?e:t}function i(t,e,i,r){if(e=o(e,2),i=o(i,","),r=o(r,"."),isNaN(t)||null==t)return 0;t=(t/100).toFixed(e);var n=t.split(".");return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+i)+(n[1]?r+n[1]:"")}"string"==typeof t&&(t=t.replace(".",""));var r="",n=/\{\{\s*(\w+)\s*\}\}/,a=e||this.money_format;switch(a.match(n)[1]){case"amount":r=i(t,2);break;case"amount_no_decimals":r=i(t,0);break;case"amount_with_comma_separator":r=i(t,2,".",",");break;case"amount_with_space_separator":r=i(t,2," ",",");break;case"amount_with_period_and_space_separator":r=i(t,2," ",".");break;case"amount_no_decimals_with_comma_separator":r=i(t,0,".",",");break;case"amount_no_decimals_with_space_separator":r=i(t,0," ");break;case"amount_with_apostrophe_separator":r=i(t,2,"'",".")}return a.replace(n,r)},Shopify.OptionSelectors=function(t,e){return this.selectorDivClass="selector-wrapper",this.selectorClass="single-option-selector",this.variantIdFieldIdSuffix="-variant-id",this.variantIdField=null,this.historyState=null,this.selectors=[],this.domIdPrefix=t,this.product=new Shopify.Product(e.product),this.onVariantSelected=Shopify.isDefined(e.onVariantSelected)?e.onVariantSelected:function(){},this.replaceSelector(t),this.initDropdown(),e.enableHistoryState&&(this.historyState=new Shopify.OptionSelectors.HistoryState(this)),!0},Shopify.OptionSelectors.prototype.initDropdown=function(){var t={initialLoad:!0};if(!this.selectVariantFromDropdown(t)){var e=this;setTimeout(function(){e.selectVariantFromParams(t)})}},Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown=function(t){this.selectors[0].element.onchange(t)},Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown=function(t){this.selectVariantFromParams(t)||this.selectVariantFromDropdown(t)},Shopify.OptionSelectors.prototype.replaceSelector=function(t){var e=document.getElementById(t),o=e.parentNode;Shopify.each(this.buildSelectors(),function(t){o.insertBefore(t,e)}),e.style.display="none",this.variantIdField=e},Shopify.OptionSelectors.prototype.selectVariantFromDropdown=function(t){var e=document.getElementById(this.domIdPrefix).querySelector("[selected]");if(e||(e=document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')),!e)return!1;var o=e.value;return this.selectVariant(o,t)},Shopify.OptionSelectors.prototype.selectVariantFromParams=function(t){var e=Shopify.urlParam("variant");return this.selectVariant(e,t)},Shopify.OptionSelectors.prototype.selectVariant=function(t,e){var o=this.product.getVariantById(t);if(null==o)return!1;for(var i=0;i<this.selectors.length;i++){var r=this.selectors[i].element,n=r.getAttribute("data-option"),a=o[n];null!=a&&this.optionExistInSelect(r,a)&&(r.value=a)}return"undefined"!=typeof jQuery?jQuery(this.selectors[0].element).trigger("change",e):this.selectors[0].element.onchange(e),!0},Shopify.OptionSelectors.prototype.optionExistInSelect=function(t,e){for(var o=0;o<t.options.length;o++)if(t.options[o].value==e)return!0},Shopify.OptionSelectors.prototype.insertSelectors=function(t,e){Shopify.isDefined(e)&&this.setMessageElement(e),this.domIdPrefix="product-"+this.product.id+"-variant-selector";var o=document.getElementById(t);Shopify.each(this.buildSelectors(),function(t){o.appendChild(t)})},Shopify.OptionSelectors.prototype.buildSelectors=function(){for(var t=0;t<this.product.optionNames().length;t++){var e=new Shopify.SingleOptionSelector(this,t,this.product.optionNames()[t],this.product.optionValues(t));e.element.disabled=!1,this.selectors.push(e)}var o=this.selectorDivClass,i=this.product.optionNames();return Shopify.map(this.selectors,function(t){var e=document.createElement("div");if(e.setAttribute("class",o),i.length>1){var r=document.createElement("label");r.htmlFor=t.element.id,r.innerHTML=t.name,e.appendChild(r)}return e.appendChild(t.element),e})},Shopify.OptionSelectors.prototype.selectedValues=function(){for(var t=[],e=0;e<this.selectors.length;e++){var o=this.selectors[e].element.value;t.push(o)}return t},Shopify.OptionSelectors.prototype.updateSelectors=function(t,e){var o=this.selectedValues(),i=this.product.getVariant(o);i?(this.variantIdField.disabled=!1,this.variantIdField.value=i.id):this.variantIdField.disabled=!0,this.onVariantSelected(i,this,e),null!=this.historyState&&this.historyState.onVariantChange(i,this,e)},Shopify.OptionSelectorsFromDOM=function(t,e){var o=e.optionNames||[],i=e.priceFieldExists||!0,r=e.delimiter||"/",n=this.createProductFromSelector(t,o,i,r);e.product=n,Shopify.OptionSelectorsFromDOM.baseConstructor.call(this,t,e)},Shopify.extend(Shopify.OptionSelectorsFromDOM,Shopify.OptionSelectors),Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector=function(t,e,o,i){if(!Shopify.isDefined(o))var o=!0;if(!Shopify.isDefined(i))var i="/";var r=document.getElementById(t),n=r.childNodes,a=(r.parentNode,e.length),s=[];Shopify.each(n,function(t){if(1==t.nodeType&&"option"==t.tagName.toLowerCase()){var r=t.innerHTML.split(new RegExp("\\s*\\"+i+"\\s*"));0==e.length&&(a=r.length-(o?1:0));var n=r.slice(0,a),p=o?r[a]:"",l=(t.getAttribute("value"),{available:!t.disabled,id:parseFloat(t.value),price:p,option1:n[0],option2:n[1],option3:n[2]});s.push(l)}});var p={variants:s};if(0==e.length){p.options=[];for(var l=0;l<a;l++)p.options[l]="option "+(l+1)}else p.options=e;return p},Shopify.SingleOptionSelector=function(t,e,o,i){this.multiSelector=t,this.values=i,this.index=e,this.name=o,this.element=document.createElement("select");for(var r=0;r<i.length;r++){var n=document.createElement("option");n.value=i[r],n.innerHTML=i[r],this.element.appendChild(n)}return this.element.setAttribute("class",this.multiSelector.selectorClass),this.element.setAttribute("data-option","option"+(e+1)),this.element.id=t.domIdPrefix+"-option-"+e,this.element.onchange=function(o,i){i=i||{},t.updateSelectors(e,i)},!0},Shopify.Image={preload:function(t,e){for(var o=0;o<t.length;o++){var i=t[o];this.loadImage(this.getSizedImageUrl(i,e))}},loadImage:function(t){(new Image).src=t},switchImage:function(t,e,o){if(t&&e){var i=this.imageSize(e.src),r=this.getSizedImageUrl(t.src,i);o?o(r,t,e):e.src=r}},imageSize:function(t){var e=t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);return null!==e?e[1]:null},getSizedImageUrl:function(t,e){if(null==e)return t;if("master"==e)return this.removeProtocol(t);var o=t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(null!=o){var i=t.split(o[0]),r=o[0];return this.removeProtocol(i[0]+"_"+e+r)}return null},removeProtocol:function(t){return t.replace(/http(s)?:/,"")}},Shopify.OptionSelectors.HistoryState=function(t){this.browserSupports()&&this.register(t)},Shopify.OptionSelectors.HistoryState.prototype.register=function(t){window.addEventListener("popstate",function(){t.selectVariantFromParamsOrDropdown({popStateCall:!0})})},Shopify.OptionSelectors.HistoryState.prototype.onVariantChange=function(t,e,o){this.browserSupports()&&(!t||o.initialLoad||o.popStateCall||Shopify.setParam("variant",t.id))},Shopify.OptionSelectors.HistoryState.prototype.browserSupports=function(){return window.history&&window.history.replaceState};

var ProductJs = function( item, product, preselectedItem = null ) {
    var optionsMap = {};
    var optionsMapAll = {};
    var productJs = this;
    productJs.config = {
      gallery:{
        galleryGroupByOptions: ''.split(',').map(function(s) { return s.trim() }).filter(function(v){return v!==''}),
        galleryGroupMatchMode: 4, //1 Match Everything, 2 Match Any, 4 Exclusive OR
        slickMainOptions: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true,
          speed: 700,
          waitForAnimate: false,
          prevArrow: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-left left-arrow" viewBox="0 0 32 32"><path fill="#000000" d="M24.333 28.205l-1.797 1.684L7.666 16l14.87-13.889 1.797 1.675L11.269 16z"/></svg>',
          nextArrow: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-right right-arrow" viewBox="0 0 32 32"><path fill="#000000" d="M7.667 3.795l1.797-1.684L24.334 16 9.464 29.889l-1.797-1.675L20.731 16z"/></svg>',
          responsive: [
            {
              breakpoint: 600,
              settings: {
                adaptiveHeight: true,
              }
            }
          ]
        },
        slickThumbsOptions: {
          autoplay: false,
          speed: 700,
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: false,
          arrows: true,
          prevArrow: `<button aria-label="Previous thumbnail">
          <svg class=" slick-prev slick-arrow icon icon-arrow-left left-arrow" xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <path d="M28 7C16.402 7 7 16.402 7 28C7 39.598 16.402 49 28 49C39.598 49 49 39.598 49 28C49 16.402 39.598 7 28 7Z" stroke="#672666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M36.75 28L19.25 28" stroke="#672666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M26.25 35L19.25 28L26.25 21" stroke="#672666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></button>`,
          nextArrow: `<button aria-label="Next thumbnail"><svg class="icon icon-arrow-right right-arrow" xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <g clip-path="url(#clip0_3009_10343)">
                    <path d="M28 49C39.598 49 49 39.598 49 28C49 16.402 39.598 7 28 7C16.402 7 7 16.402 7 28C7 39.598 16.402 49 28 49Z" stroke="#672666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.25 28H36.75" stroke="#672666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M29.75 21L36.75 28L29.75 35" stroke="#672666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_3009_10343">
                      <rect width="56" height="56" fill="white"/>
                    </clipPath>
                  </defs>
                </svg></button>`,
          responsive: [
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                vertical: false,
                verticalSwiping: false,
                arrows: true
              }
            },
            {
              breakpoint: 900,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1,
                vertical: false,
                verticalSwiping: false,
              }
            }
          ]
        }
      }
    };

    var init = function() {
      if(!item.hasClass('initialized')) {
        item.data('productjs', productJs);
        initVariantStatus();
        initializeVariantSelector();
        
        item.on('galleryLoaded', function(){
          item.data('fullLoaded', true);
            item.trigger('productLoaded');
        });
        initGallery();
        
        item.addClass('initialized');
        checkPreselectVariant();
      }
    };

    var initVariantStatus = function() {
      $.each(product.variants, function(key, variant){
        //AVAILABLE
        if(variant.available) {
          variant.status = 'available';
        } else {
          //SOLDOUT
          variant.status = 'soldout';
        }
      });
    };

    productJs.slickFilterThumbs = function(slickOptions, objectOptions, optionsContainer, gallery) {
      //Example reference:
      //slickOptions: ...
      //objectOptions: product.options
      //optionsContainer: variant;
      //gallery: jQuery object of the gallery, ex. $('.thumbs'), $('.main-images'), etc.

      var galleryOptions = productJs.config.gallery;
      var groupOptionProperties = [];
      $(galleryOptions.galleryGroupByOptions).each(function (ix, e){
        $(objectOptions).each(function(ix2,e2){
          if (Simplistic.handleize(e) == Simplistic.handleize(e2))
            groupOptionProperties.push('option'+(1+ix2))
        })
      })
      
      if(groupOptionProperties.length>0) {
        gallery.slick('slickUnfilter');
        gallery.find('.slideVisible').removeClass('slideVisible');

        var slideSelector = '';
        $(groupOptionProperties).each(function(ix,e){
          var part1Selector = '';
          var part2Selector = '';
          if(slideSelector=='' || galleryOptions.galleryGroupMatchMode>=2)
            part1Selector += ' .slide';

          part1Selector += '[data-'+Simplistic.handleize(galleryOptions.galleryGroupByOptions[ix])+'*="_'+Simplistic.handleize(optionsContainer[e])+'_"]';
          if (galleryOptions.galleryGroupMatchMode==4) {
            part2Selector = ', ' +part1Selector;
            $(groupOptionProperties).each(function(ix2,e2){
              if (e2!=e) {
                part1Selector += ':not([data-'+Simplistic.handleize(galleryOptions.galleryGroupByOptions[ix2])+'])';
                part2Selector += '[data-'+Simplistic.handleize(galleryOptions.galleryGroupByOptions[ix2])+'*="_'+Simplistic.handleize(optionsContainer[e2])+'_"]';
              }
            });
          }
          slideSelector += (slideSelector=='' || galleryOptions.galleryGroupMatchMode==1 ? '' : ', ') + part1Selector + part2Selector;
        });

        //Show the images that don't have any of the galleryGroupByOptions
        var withoutAltSelector = ' .slide';
        $(galleryOptions.galleryGroupByOptions).each(function(){
          withoutAltSelector += ':not([data-'+Simplistic.handleize(this)+'])';
        });
        slideSelector += ', ' + withoutAltSelector;

        var sortCompare = function(a,b){
            akey = parseInt($(a).attr("data-index"));
            bkey = parseInt($(b).attr("data-index"));
            if (akey == bkey) return 0;
            if (akey < bkey) return -1;
            if (akey > bkey) return 1;
        };

        gallery.find(slideSelector).sortDomElements(sortCompare).addClass('slideVisible');
        gallery.slick('slickFilter', '.slideVisible');
        gallery.slick('slickGoTo', 0, true);
      }
    }

    var initializeVariantSelector = function() {
      var variantSelectorId = "product-select-"+product.id;
      var selectCallback = onVariantSelected();

      new Shopify.OptionSelectors(variantSelectorId, { product: product, onVariantSelected: selectCallback });

      if(product.options.length > 1) {
        if(product.variants.length > 1) {
          linkOptionSelectors(product);
        }

        // Add label if only one product option and it isn't 'Title'.
        if(product.options.length == 1 && product.options[0] != 'Title') {
          item.find('.selector-wrapper:eq(0)').prepend('<label>'+product.options[0]+'</label>');
        }

        item.find('.selector-wrapper label').append(':');
      } else {
        if(product.variants.length > 1) {
          item.find('.select-variant').change(function(){
            var variantSelected = false;
            $.each(product.variants, function(key, variant){
              if(variant.id==item.find('.select-variant').val()) {
                variantSelected = variant;
                return;
              }
            });
            selectCallback(variantSelected, null);
          });
        }
      }
      
      item.find('.swatch :radio').change(function() {
        console.log('----------------------- on select', this, $(this).val());

          var optionIndex = $(this).closest('.swatch').attr('data-option-index');
          var optionValue = $(this).val();
          const quantityLabel = document.querySelector('.swatch__title');
          const quantityLabelText = document.querySelector('.swatch__title').innerHTML;
          let pack_size = $(this).data('packsize');
          let newText = "Select Quantity: <span>" + pack_size + "</span>";
          if(pack_size) {
            quantityLabel.innerHTML = newText;
          }
          $(this).closest('form').find('.single-option-selector').eq(optionIndex).val(optionValue).trigger('change');
        })
      ;if(product.variants.length==1) {
        selectCallback(product.variants[0], null);
      } else {productJs.setVariant(productJs.getFirstAvailableVariant());
        console.log('ghhghghghghghggh')}
    };

    productJs.getFirstAvailableVariant = function() {
      for(var i=0; i < product.variants.length; i++){ 
        if(product.variants[i].available)
          return product.variants[i];
      }    
    };
  
    productJs.getVariantBySku = function(sku) {
      for(var i=0; i < product.variants.length; i++){ 
        if(product.variants[i].sku == sku)
          return product.variants[i];
      }    
    };

    productJs.getVariantById = function(id) {
      for(var i=0; i < product.variants.length; i++){ 
        if(product.variants[i].id == id) {
          return product.variants[i];
        }
      }
    };

    productJs.getCurrentVariant = function() {
      var variantId = item.find('[name=id]').val();
        if(variantId!="") {
          return productJs.getVariantById(variantId);
        } else {
          return false;
        }
    };

    productJs.getProduct = function() {
      return product;
    };

    productJs.setVariant = function(variant){
      if(variant) {
        if(!isNaN(variant)) {
          variant = productJs.getVariantById(variant);
        }
        item.find('.single-option-selector').each(function(){
          var selector = this;
          var option = $(selector).data('option');
          $(selector).find('option').each(function(){
            if(this.value == variant[option]){
              $(selector).val(this.value);
              return;
            }
          });
        });
        item.find('.single-option-selector:first').trigger('change');
      }
    };
  
    var onVariantSelected = function() {
      console.log('variant changed!');
      return function(variant, selector) {
        if(variant && variant.id) {//Swatches code
            var form = item.find('form');
            for(var i=0,length=variant.options.length; i<length; i++) {
              var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
              if(radioButton.length > 0) {
                radioButton.get(0).checked = true;
              }
            }//Update the price
          item.find('[data-price="deal"]').html(Shopify.formatMoney(variant.price, Simplistic.formatMoney).replace('.00', ''));
          if(variant.compare_at_price != null && variant.compare_at_price > variant.price){
            var retailPrice = Shopify.formatMoney(variant.compare_at_price, Simplistic.formatMoney).replace('.00', '');
            var percentDiscount = Math.round( (((variant.compare_at_price - variant.price) * 100 ) / variant.compare_at_price) );
            var moneyDiscount = Shopify.formatMoney((variant.compare_at_price - variant.price), Simplistic.formatMoney).replace('.00', '');
            item.find('[data-price="retail"]').html(retailPrice).show();
            item.find('[data-price="off-percent"]').html(percentDiscount+'%').show();
            item.find('[data-price="off-amount"]').html(moneyDiscount).show();
          } else {
            item.find('[data-price="retail"]').hide();
            item.find('[data-price="off-percent"]').hide();
            item.find('[data-price="off-amount"]').hide();
          }

          //Filter The images by variant
          filterImages(variant);

          //Update the variant value to add to cart
          item.find('#product-'+product.id+'-variant').val(variant.id);

        } else {
          item.find('#product-'+product.id+'-variant').val("");
        }
        updateButtons(variant);

        $(item).trigger("variantChange", [variant]);
      }
    };

    var filterImages = function(variant, notSwitchImg) {
      if(variant) {
        //Image in grid
        if(variant.featured_image) {
          item.find('.image img').attr('src', variant.featured_image.src);
        }

        //Main image in product page
        if(item.find('.main-images .slick-track').length>0) {
          productJs.slickFilterThumbs(productJs.config.gallery.slickMainOptions, product.options, variant, item.find('.main-images'));
          if(variant.featured_media&& !notSwitchImg && item.data('fullLoaded')) {
            switchMainImage(variant.featured_media.id);
          }
        }

        //Thumbs in product page
        if(item.find('.thumbs .slick-track').length>0) {
          productJs.slickFilterThumbs(productJs.config.gallery.slickThumbsOptions, product.options, variant, item.find('.thumbs'));
        }

      }
    };
    
    var updateButtons = function(variant) {
      var status;
      if(product.available) {
        status = variant ? variant.status : 'available';
      } else {
        status = 'soldout';
      }

      item.find('.buttons-wrapper .add-button, .buttons-wrapper .sold-out-button, .soldout-product-message').hide(); //Grid
      item.find('.content-available, .content-soldout, .quantity-box').hide(); //Product page
      switch(status) {
        case "available":
          item.find('.buttons-wrapper .add-button').show(); //Grid
          item.find('.content-available, .quantity-box').show(); //Product page
          break;
        case "soldout":
          item.find('.buttons-wrapper .sold-out-button').show(); //Grid
          item.find('.soldout-product-message').show(); //Grid
          item.find('.content-soldout').show(); //Product page
          break;
      }
    };

    var switchMainImage = function(mediaId){
        if(item.find('.main-images .slick-track').length>0) {
          var index = item.find('.main-images .slide:not(.slick-cloned)').index(item.find('.main-images .slide:not(.slick-cloned)[data-media-id="'+mediaId+'"]'));
          item.find('.main-images').slick('goTo', index);
        }
    };

    var initGallery = function(){
      var mainGalleryLoaded = false;
      var thumbsGalleryLoaded = false;
      
      //Initialize zoom on main product image
      var initializeZoom = function(index) {
      	if(item.find('.product-gallery').hasClass('zoom-in') && !isMobile.any) {
            var mainProductImage = item.find('.slide:not(.slick-cloned) .large-thumb:eq('+index+')');
            if(mainProductImage.length>0 && mainProductImage.parent().find('.zoomImg').length==0) {
              var zoomedSrc = mainProductImage.data('file');
              if(zoomedSrc && zoomedSrc!="") {
                mainProductImage.wrap('<span style="display:block"></span>').css('display', 'block').parent().zoom({
                  url: zoomedSrc, 
                  callback: function(){
                    item.find('.active-wrapper img.zoomImg').prop('alt', '');
                  } 
                });
              }
            }
        }
      };

      item.find('.main-images').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        var nextImage = $(this).find('.slide:not(.slick-cloned) .large-thumb:eq('+nextSlide+')');
        if(!nextImage.hasClass('lazyloaded')) {
        	nextImage.addClass('lazyload');
        }
        
        item.find('.thumbs.switch .slide').removeClass('active');
        item.find('.thumbs.switch .slide:not(.slick-cloned):eq('+nextSlide+')').addClass('active');

        var slidesToShow = item.find('.thumbs.switch').slick('slickGetOption', 'slidesToShow');
        if(slidesToShow==1) {
          item.find('.thumbs.switch').slick('slickGoTo', nextSlide);
        } else {
            item.find('.thumbs.switch').slick('slickGoTo', nextSlide-Math.floor((slidesToShow-1)/2));
        }
        initializeZoom(nextSlide);
      });
      Simplistic.onImagesLoaded(item.find('.main-images .active-wrapper'), function(){
          item.find('.main-images').slick(productJs.config.gallery.slickMainOptions);
          filterImages(productJs.getCurrentVariant(), true);
          initializeZoom(item.find('.active-wrapper:not(.slick-cloned)').index(item.find('.active-wrapper.slick-active')));
          mainGalleryLoaded = true;
          if(mainGalleryLoaded && thumbsGalleryLoaded) {
            item.trigger('galleryLoaded');
          }
      });

      // Initialize thumbs on main product page
      item.find('.thumbs.switch a.gallery').on('click', function(e) {
        e.preventDefault();
        switchMainImage($(this).data('media-id'));

        var variantId = $(this).attr('variant-id');
        if(variantId && variantId!='') {
          if(product.options.length <= 1) {
            productJs.setVariant(variantId);
          }
        }
      });
        Simplistic.onImagesLoaded(item.find('.thumbs img'), function(){
          item.find('.thumbs').slick(productJs.config.gallery.slickThumbsOptions);
          item.find('.thumbs .slide:not(.slick-cloned):eq(0)').addClass('active');
          filterImages(productJs.getCurrentVariant(), true);
          thumbsGalleryLoaded = true;
          if(mainGalleryLoaded && thumbsGalleryLoaded) {
            item.trigger('galleryLoaded');
          }
        });
      
      

      //Initialize photoswipe on main product image
      if($('.active-wrapper a.productImage').length > 0) {
        item.find('.active-wrapper a.productImage, .active-wrapper video, .active-wrapper iframe').photoSwipe();
      }
    }

    var checkPreselectVariant = function() {
      if(preselectedItem) {

        
        var allVariants = item.find('.swatch :radio');
        
        var allVariantsArray = Array.from(allVariants);
        
        if( preselectedItem <= allVariants.length ) {
          const preSelectedItemIndex = parseInt(preselectedItem) - 1;
  
          for (let index = 0; index < allVariantsArray.length; index++) {
            const element = allVariantsArray[index];
    
            if(index == preSelectedItemIndex) {
              element.checked = true;
              element.checked = true;
            }
            
          }
        }
      }



      console.log('--------------- init all', allVariants, typeof(allVariants), allVariantsArray);
    }

    // Linked Product Options (c) Copyright 2014 Caroline Schnapp. All Rights Reserved. Contact: mllegeorgesand@gmail.com
    // See http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
    var updateOptionsInSelector=function(selectorIndex){switch(selectorIndex){case 0:var key='root';var selector=item.find('.single-option-selector:eq(0)');break;case 1:var key=item.find('.single-option-selector:eq(0)').val();var selector=item.find('.single-option-selector:eq(1)');break;case 2:var key=item.find('.single-option-selector:eq(0)').val();key+=' / '+item.find('.single-option-selector:eq(1)').val();var selector=item.find('.single-option-selector:eq(2)')}
    var initialValue=selector.val();selector.empty();var options=optionsMapAll[key];if(options){for(var i=0;i<options.length;i++){var option=options[i];var newOption=jQuery('<option></option>').val(option).html(option);selector.append(newOption)}}
    var availableOptions=optionsMap[key];var existingOptions=optionsMapAll[key];item.find('.swatch[data-option-index="'+selectorIndex+'"] .swatch-element').each(function(){if(jQuery.inArray($(this).attr('data-value'),existingOptions)!==-1){if(jQuery.inArray($(this).attr('data-value'),availableOptions)!==-1){$(this).removeClass('soldout').find(':radio').removeAttr('checked')}else{$(this).addClass('soldout').find(':radio').removeAttr('checked')}
    $(this).show()}else{$(this).hide()}});if(jQuery.inArray(initialValue,availableOptions)!==-1){selector.val(initialValue)}
    selector.trigger('change')};var linkOptionSelectors=function(product){for(var i=0;i<product.variants.length;i++){var variant=product.variants[i];optionsMapAll.root=optionsMapAll.root||[];optionsMapAll.root.push(variant.option1);optionsMapAll.root=Shopify.uniq(optionsMapAll.root);if(product.options.length>1){var key=variant.option1;optionsMapAll[key]=optionsMapAll[key]||[];optionsMapAll[key].push(variant.option2);optionsMapAll[key]=Shopify.uniq(optionsMapAll[key])}
    if(product.options.length===3){var key=variant.option1+' / '+variant.option2;optionsMapAll[key]=optionsMapAll[key]||[];optionsMapAll[key].push(variant.option3);optionsMapAll[key]=Shopify.uniq(optionsMapAll[key])}
    if(variant.available){optionsMap.root=optionsMap.root||[];optionsMap.root.push(variant.option1);optionsMap.root=Shopify.uniq(optionsMap.root);if(product.options.length>1){var key=variant.option1;optionsMap[key]=optionsMap[key]||[];optionsMap[key].push(variant.option2);optionsMap[key]=Shopify.uniq(optionsMap[key])}
    if(product.options.length===3){var key=variant.option1+' / '+variant.option2;optionsMap[key]=optionsMap[key]||[];optionsMap[key].push(variant.option3);optionsMap[key]=Shopify.uniq(optionsMap[key])}}}
    updateOptionsInSelector(0);if(product.options.length>1)updateOptionsInSelector(1);if(product.options.length===3)updateOptionsInSelector(2);item.find(".single-option-selector:eq(0)").change(function(){updateOptionsInSelector(1);if(product.options.length===3)updateOptionsInSelector(2);return!0});item.find(".single-option-selector:eq(1)").change(function(){if(product.options.length===3)updateOptionsInSelector(2);return!0})}

    return init();
};