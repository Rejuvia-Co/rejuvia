import { LitElement, html, css, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js'

/**
 * Skio Universal Plan Picker
 * @docs https://integrate.skio.com/
 *
 * Uses LitJS (<5kb) https://lit.dev/ for reactive web components
 */

export class SkioPlanPicker extends LitElement {
  static properties = {
    key: { type: String },

    product: { type: Object },
    productHandle: { type: String },
    selectedVariant: { type: Object },

    options: { type: Object },

    quantity: { type: Number },
    rules: { type: Array },
    rule: { type: Object },
    cart: { type: Object },

    availableSellingPlanGroups: { state: true },
    selectedSellingPlanGroup: { type: Object },
    selectedSellingPlan: { type: Object },

    disableUrl: { type: Boolean },

    debug: { type: Boolean },
  }

  static styles = [
    css`
      :host {
        width: 100%;
      }
      .skio-plan-picker {
        display: flex;
        gap: 1rem;
        padding: 0;
        border: 0;
        font-size: 14px;
        color: black;
        width: 100%;
        margin-bottom: 1rem;
        font-family: inherit;
        letter-spacing: 0.7px
      }
      :host([layout='hidden']) .skio-plan-picker {
        display: none;
      }
      :host([layout='vertical']) .skio-plan-picker {
        flex-direction: column;
      }
      :host([layout='horizontal']) .skio-plan-picker {
        flex-direction: row;
        flex-wrap: wrap;
      }
      .sr-only {
        position: absolute;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
      }
      .group-container {
        display: block;
        position: relative;
        transition: border-color 0.2s ease;
        border: var(--skio-group-border-width, 1px) solid var(--skio-group-border-color, #ccc);
        border-radius: var(--skio-group-border-radius, 0);
        background-color: var(--skio-group-background-color, transparent);
        color: var(--skio-group-text-color, #000);
      }
      
      .group-container--selected {
        border-color: var(--skio-group-border-selected-color, #333);
        border-width: var(--skio-group-border-selected-width, 1.5px);
        background-color: var(--skio-group-background-selected-color, transparent);
        color: var(--skio-group-text-selected-color, #000);
      }
      .group-container--last {
        order: 1;
      }
      :host([layout='horizontal']) .group-container {
        width: calc(50% - 0.5rem - calc(2 * var(--skio-group-border-width, 1px)));
      }
      .group-container.first-one-time {
        margin-bottom: 14px;
      }
      .group-container.first-one-time .group-content.margin-left{
        margin-left: 15px;
      }
      .group-input {
        position: absolute;
        opacity: 0;
        width: 0px;
        height: 0px;
      }
      .group-input:focus-visible ~ .group-label {
        outline: 2px #ccc solid;
        outline-offset: 4px;
      }
      .group-label {
        display: flex;
        flex-direction: column;
        padding: 15px;
        cursor: pointer;
      }
      .group-topline {
        display: flex;
        align-items: center;
        width: auto;
        font-weight: 700;
        gap: 8px;
      }
      :host([layout='horizontal']) .group-topline {
        flex-direction: column;
        text-align: center;
      }
      .skio-radio__container {
        display: flex;
        color: rgb(229 221 228);
      }
      .group-container--selected .skio-radio__container {
        color: var(--skio-group-border-selected-color, #333);
      }
      .skio-plan-picker.bundle-product .group-container--selected {
        background: #E8DFE8;
      } 
      .skio-radio {
        transform-origin: center;
        opacity: 0;
        transform: scale(0);
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group-container--selected:hover .skio-radio {
        filter: brightness(80%);
      }
      .group-label:hover .skio-radio {
        opacity: 0.75;
        transform: scale(1);
      }
      .group-container--selected .group-label .skio-radio {
        opacity: 1;
        transform: scale(1);
      }
      .skio-price {
        align-items: center;
        text-align: right;
        line-height: 1;
        margin-left: auto;
        vertical-align: middle;
        font-weight: 500;
      }
      .subs-group-container.group-container--selected .skio-price {
        color: #006516;
        font-weight: 700;
      }
      .subs-group-container.group-container--selected .skio-price:after {
          content: "+ Free Shipping";
          color: #000;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          display: block;
          margin-top: 3px;
          letter-spacing: -0.4px;
      }
      .skio-price s {
        display: none;
        font-size: 13px;
        font-weight: 400;
        opacity: 0.75;
      }
      :host([layout='horizontal']) .skio-price {
        text-align: center;
        margin-right: auto;
      }
      .group-content {
        display: flex;
        flex-direction: column;
        opacity: 1;
        width: auto;
        max-height: 1000px;
        transition: max-height 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group-content.margin-left {
        margin-left: 25px;
      }
      .group-content p {
        margin: 0.5rem 0 0 0;
        font-size: 13px;
        color: #000;
      }
      :host([layout='horizontal']) .group-content {
        width: 100%;
      }
      :host([layout='horizontal']) .group-container:not(.group-container--selected) + .group-content {
        pointer-events: none;
        opacity: 0;
        max-height: 0;
        visibility: hidden;
      }
      .group-title {
        line-height: 1.5;
      }
      :host([layout='horizontal']) .group-title {
        max-width: 100%;
      }
      .savings {
        color: var(--skio-discount-text-color, #fff);
      }
      .savings.bubble {
        padding: 7px 10px 5px;
        background-color: var(--skio-discount-color, #0fa573);
        border: 1px var(--skio-discount-color, #0fa573) solid;
        border-radius: 4px;
        font-size: 12.6px;
        color: var(--skio-discount-text-color, #fff);
        font-weight: 700;
        letter-spacing: 0.45px;
        white-space: nowrap;
      }
      .selling-plan-dropdown-container {
        display: flex;
        align-items: center;
        margin-top: 15px;
      }
      .selling-plan-dropdown-container > span {
        font-weight: 700;
        margin-right: 12px;
      }
      .selling-plan-dropdown {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        display: flex;
        align-items: center;
        gap: 5px;
        width: fit-content;
        padding: 7px 30px 6px 10px;
        background-color: transparent;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px top 50%;
        background-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: inherit;
        letter-spacing: 0.7px;
      }
      .selling-plan-dropdown:focus-visible {
        outline: none;
      }
      .selling-plan-dropdown-label {
        color: #666666;
        font-weight: 500;
      }
      .selling-plan-dropdown--one {
        background-image: none;
        pointer-events: none;
        background: transparent;
      }
      .selling-plan-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--skio-button-plan-selector-width, 20px), 1fr));
        gap: 10px;
        padding: 0.75rem 0;
        border: 0;
        font-size: 13px;
      }
      .selling-plan-buttons input[type='radio'] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      .selling-plan-buttons label {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #ccc;
        text-align: center;
        padding: 1rem 0.5rem;
      }
      .selling-plan-buttons input[type='radio']:checked + label {
        border-color: #000;
      }
      .selling-plan-buttons input:focus-visible + label {
        outline: 2px #ccc solid;
        outline-offset: 4px;
      }
      .skio-details {
        --text-color: #333;
        --text-color-secondary: #888;
        user-select: none;
        -webkit-user-select: none;
        margin-bottom: 20px;
        order: 3;
        max-width: max-content;
      }
      .skio-details summary::-webkit-details-marker,
      .skio-details summary::marker,
      .skio-details slot {
        color: rgba(0, 0, 0, 0) !important;
      }
      .skio-details summary {
        margin-top: 15px;
      }
      .skio-details summary span {
        font-size: 0.9em;
        display: flex;
        padding: 0.5em 0;
        cursor: pointer;
        align-items: center;
        gap: 10px;
        text-decoration: underline;
        margin-top: -40px;
        color: #000;
      }
      @keyframes fadeInDown {
        0% {
          opacity: 0;
          transform: translateY(-15px);
        }
        100% {
          opacity: 1;
          transform: translateY(0px);
        }
      }
      .skio-details[open] > .skio-details--content {
        animation-name: fadeInDown;
        animation-duration: 0.3s;
      }
      .skio-details--content {
        position: absolute;
        z-index: 1020;
        padding: 1em;
        width: fit-content;
        border-radius: 5px;
        background: white;
        box-shadow: 0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 7%);
      }
      .skio-details ul {
        margin: 0;
        padding: 0;
      }
      .skio-details ul li {
        display: flex;
        align-items: flex-start;
        gap: 0.75em;
        margin-bottom: 1em;
      }
      .skio-details .skio-content {
        display: flex;
        flex-direction: column;
      }
      .skio-details .skio-content p {
        font-size: 0.9em;
        margin-top: 0;
        margin-bottom: 0;
        letter-spacing: 0;
        line-height: 1.5;
        color: var(--text-color);
      }
      .skio-details ul li small {
        font-size: 0.7em;
        color: var(--text-color-secondary);
      }
      .skio-details .skio-icon {
        display: flex;
        width: 2.25em;
        height: 2.25em;
        color: var(--text-color);
        background: #f8f8f8;
        border-radius: 100%;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
      }
      .skio-details .skio-icon svg {
        width: 1.25em;
        height: 1.25em;
        color: inherit;
      }
      .skio-details--footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.9em;
      }
      .skio-details--footer a {
        color: var(--text-color);
      }
      .skio-manage-link {
        text-decoration: underline;
      }
      .powered-by-skio {
        font-size: 0.8em;
        display: flex;
        text-decoration: none;
        align-items: center;
        gap: 3px;
      }
      .setupMode {
        position: relative;
        color: black;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 1rem;
        font-size: 14px;
        border-style: solid;
        border-width: 4px;
        border-image: repeating-linear-gradient(-55deg, #000, #000 20px, #ffb101 20px, #ffb101 40px) 10;
      }
      .setupMode:after {
        content: 'Setup Mode';
        position: absolute;
        top: 0;
        right: 0;
        background-color: black;
        color: white;
        padding: 0.25rem 1rem;
        font-size: 13px;
      }
      .setupMode .detection {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
      }
      .setupMode .detection small {
        grid-column: 1/-1;
      }
      .extra-discount-text {
        margin-right: 10px;
      }
      .skio-plan-picker .subs-group-container .group-label .skio-price {
        font-size: 18px;
        font-weight: 700;
        line-height: 150%;
        color: #006516;
        margin-bottom: -4px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .skio-plan-picker .group-container:not(.subs-group-container) .group-label .skio-price {
        color: #000000;
        font-size: 16px;
        font-weight: 400;
        line-height: 150%;
      }
      @media only screen and (max-width: 900px) {
        .group-title {
          text-align: left !important;
        }
        .skio-plan-picker .subs-group-container .group-title {
           gap: 6px;
        }
        .skio-plan-picker .custom-picker-heading {
          font-size: 14px!important;
          margin-bottom: 16px!important;
        }
      }
      .custom-picker-heading {
        font-weight: 700;
        font-size: 15.4px;
        letter-spacing: -0.4px;
        text-align: left;
        margin-bottom: -6px;
      }
      .custom-picker-heading > span {
        font-weight: 400;
      }

      .skio-plan-picker {
        gap: 0;
        margin: 26px 0 24px 0;
      }

      .skio-plan-picker .custom-picker-heading {
        font-size: 18px;
        font-weight: 700;
        line-height: 100%;
        margin-bottom: 16px;
      }

    .skio-plan-picker .group-label {
        padding: 16px;
      }

      .skio-plan-picker .subs-group-container .group-label {
        padding: 16px 0;
      }
      

      .skio-plan-picker .group-label .group-title {
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: -4px;
        letter-spacing: normal;
      }

      .skio-plan-picker .group-label .skio-price {
        font-size: 18px;
        font-weight: 700;
        line-height: 150%;
        color: #006516;
        margin-bottom: -4px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      
      .skio-plan-picker .group-label .skio-price .skio-price__delivery {
        font-size: 12px;
        font-weight: 400;
        line-height: 150%;
        color: #000000;
        margin-bottom: -4px;
      }

      .skio-plan-picker .subs-group-container {
        margin: 0 0 12px 0;
      }

      .skio-plan-picker .group-container.group-container--selected {
        border: 2px solid #672666;
        background: #67266626;

        .skio-plan-picker .subs-group-container .selling-plan-dropdown {
          background-color: #F7F4F7;
        }
      }

      .skio-plan-picker .group-container {
            border: 1px solid #BFBFBF;
      }

      .skio-plan-picker .subs-group-container .group-title      {
        display: flex;
        align-items: center;
        gap: 0px;
        margin: 0;
      }

      .skio-plan-picker .savings.bubble {
        color: black;
        font-size: 14px;
        font-weight: 400;
        line-height: 26px;
        padding: 0;
        display: flex;
        // height: 21px !important;
        // justify-content: center;
        // align-items: center;
        // display: flex;
        // border-radius: 4px;
        background: transparent;
        // border: unset;
        // margin-bottom: 2px;
        // margin-left: 4px;
        padding-top: 3px;
        border: none;
      }

      .skio-plan-picker .savings.bubble span {
        display: flex;
        align-items: center;
        margin-left: 3px;
        // flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .skio-plan-picker .extra-discount-text {
        display: none;
      }

      .subs-group-container.group-container--selected .skio-price:after {
        content: '';
        display: none;
      }

      .skio-plan-picker .group-title__span {
        line-height: 100%;
      }

      .skio-plan-picker .subs-group-container .selling-plan-dropdown-container {
        margin-top: 0px;
        margin-bottom: 18px;
      }

      .skio-plan-picker .subs-group-container .group-content.margin-left {
        margin-left: 0px;
        padding-left: 24px;
        padding-right: 16px;
      }

      .skio-plan-picker .subs-group-container .group-topline {
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid #672666;
        padding-left: 16px;
        padding-right: 16px;
      }

      .skio-plan-picker .subs-group-container .selling-plan-dropdown-container > span {
        font-size: 16px;
        font-weight: 400;
        line-height: 150%;
        margin-right: 8px;
  
      }

      .skio-plan-picker .subs-group-container .selling-plan-dropdown {
        padding: 0;
        border: 0;
        padding-right: 30px;
        color: #040404;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        cursor: pointer;
        background-position: right 15px top 0%;
        letter-spacing: 0;
      }

      .skio-plan-picker .subs-group-container ul {
        list-style-type: none;
        font-size: 14px;
        padding-top: 0px !important;
        margin: 0;
      }

      .skio-plan-picker .subs-group-container ul li {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 100% !important;
        display: flex;
        gap: 6px;
        align-items: center;
        color: #040404 !important;
      }

      .skio-plan-picker .subs-group-container ul li span {
        // margin-top: 5px;
      }

      @media only screen and (max-width: 749px) {
        .skio-plan-picker {
          margin: 24px 0 20px 0;
        }
        .skio-plan-picker .savings.bubble {
          font-size: 12px!important;
        }
        .skio-plan-picker .group-label .group-title {
          font-size: 12px!important;
          white-space: nowrap;
        }
        .subscription__label {
          font-size: 10px!important;
        }
        .skio-plan-picker .savings.bubble span {
          flex-direction: row;
        }
        
        .skio-plan-picker .subs-group-container .group-topline {
      padding-left: 10px;
      padding-right: 10px;
    }

        .skio-plan-picker .subs-group-container {
          margin-bottom: 8px;
        }
      }

      @media only screen and (max-width: 415px) {
        .skio-plan-picker .group-label {
          padding: 12px;
        }
      }

      @media only screen and (max-width: 398px) {
        .skio-plan-picker .group-label .group-title {
          font-size: 14px;
        }
      }

      @media only screen and (max-width: 380px) {
        .skio-plan-picker .group-label {
          padding: 10px;
        }
      }
      .subscription__label {
          background: #C2F1BD;
          display: block;
          border-radius: 99px;
          text-transform: uppercase;
          font-size: 14px;
          font-weight: 700;
          padding-top: 3px;
          padding: 0 10px;
          line-height: 100%;
          max-height: 26px;
          height: 26px;
          padding-top: 3px;
              margin-bottom: 3px;
        }
        
        span.text-bold {
            font-weight: 700;
        }
        .subscription__images {
            display: flex;
            column-gap: 16px;
            margin-top: 13px;
            margin-left: 15px;
        }
        .subscription__image {
          text-align: center;
        }
        .subscription__image img {
          max-width: 83px;
          display: block;
          line-height: 0;
          margin-bottom: 12px;
        }
        .subscription__image span {
          font-size: 12px;
          line-height: 130%;
          color: #040404;
          margin-top: 12px;
          font-weight: 400;
        }
        .li-images {
          flex-direction: column;
              align-items: flex-start !important;
        }
        .subscription__image span {
          margin-top: 12px;
        }
        .group-container:not(.subs-group-container.group-container--selected) .group-content {
          display: none;
        }
        .group-container:not(.subs-group-container.group-container--selected)  .group-topline {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: 0;
        }
    `,
  ]

  constructor() {
    super()

    this.currency = window.Shopify.currency.active || 'USD'
    this.language = window.Shopify.locale || 'en-US'
    this.moneyFormatter = new Intl.NumberFormat(this.language, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    // Start - Debug Variables
    this.debug = window?.Shopify?.designMode
    this.variantChanged = false
    // End - Debug Variables

    this.rules = []
    this.rule = null
    this.quantity = 1
    this.showDetailsHover = false
  }

  async connectedCallback() {
    super.connectedCallback()

    this.log('Mounted')

    if (this.productHandle) {
      this.loading = true
      this.fetchProduct(this.productHandle)
    }

    this.bindFormEvents()
    this.bindCartEvents()

    this.rules = await this.fetchRules()
    await this.getRule()
  }

  // SECTION: Element Templates
  radioTemplate() {
    return html`
      <div class="skio-radio__container">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1"></circle>
          <circle class="skio-radio" cx="12" cy="12" r="6.5" fill="currentColor"></circle>
        </svg>
      </div>
    `
  }

  sellingPlanDropdown(group) {
    return html`
      <div class="selling-plan-dropdown-container">
        <span>Delivery every: </span>
        <select
            class="selling-plan-dropdown ${this.getAvailableSellingPlans(group).length == 1 ? 'selling-plan-dropdown--one' : ''}"
            @change=${e => {
              this.selectSellingPlan(e.target.value)
            }}
        >
          ${group
              ? this.getAvailableSellingPlans(group).map(
                  selling_plan => html` <option ?selected=${group.selected_selling_plan.id === selling_plan.id} value=${selling_plan.id}>${selling_plan.name}</option> `
              )
              : ''}
        </select>
      </div>
    `
  }

  sellingPlanButtons(group) {
    return html`
      <fieldset class="selling-plan-buttons">
        <legend class="sr-only">Select subscription interval</legend>
        ${group
            ? this.getAvailableSellingPlans(group).map(
                selling_plan => html`
                  <input
                      type="radio"
                      name="selling_plan_button"
                      value="${selling_plan}"
                      id="selling_plan_button-${selling_plan.id}"
                      @change="${e => this.selectSellingPlan(selling_plan.id)}"
                      ?checked=${group.selected_selling_plan === selling_plan}
                  />

                  <label for="selling_plan_button-${selling_plan.id}"> ${selling_plan.name} </label>
                `
            )
            : ''}
      </fieldset>
    `
  }

  invalidIcon() {
    return html`
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#D22B2B" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `
  }

  validIcon() {
    return html`
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0BDA51" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `
  }

  setupMode() {
    return html`
      <div class="setupMode">
        Skio Plan Picker
        <small>This will not appear on the live site.</small>

        <small>Key: ${this.key}</small>

        <div class="detection">${this.product ? this.validIcon() : this.invalidIcon()} Product</div>

        <div class="detection">${this.selectedVariant ? this.validIcon() : this.invalidIcon()} Selected Variant</div>

        <div class="detection">${this.form ? this.validIcon() : this.invalidIcon()} Form</div>

        <div class="detection">${this.variantInput ? this.validIcon() : this.invalidIcon()} Variant Input</div>

        <div class="detection">
          ${this.variantChanged ? this.validIcon() : this.invalidIcon()} Variant Change Detection
          <small>Please attempt to change the selected variant.</small>
        </div>

        <small>If any of these don't pass please troubleshoot using our <a target="_blank" rel="noreferrer" href="https://integrate.skio.com/troubleshooting">troubleshooting guide</a>.</small>
      </div>
    `
  }

  groupContent(group) {
    return html`
      <div class="group-content ${this.options?.layout == 'horizontal' ? '' : this.options?.show_radio_selector && this.options?.dropdownPosition == 'inside' ? 'margin-left' : ''}">
        <span class="selling-plan-dropdown-label">${this.additionalFrequencyLabel()}</span>
        ${this.options?.selector_type == 'dropdown' ? this.sellingPlanDropdown(group) : ''}

        ${this.options?.selector_type == 'button' ? this.sellingPlanButtons(group) : ''} ${this.additionalContentText()}

        <!-- Subscription bullet points copied with styling from Loop -->
        <ul style="width: 100%; height: 100%; padding-top: 4px; padding-inline-start: 0; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; display: inline-flex">
          <li>
            <svg width="6px" height="6px" viewBox="0 0 0.12 0.12" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" d="M0.06 0.022a0.037 0.037 0 1 0 0 0.075A0.037 0.037 0 0 0 0.06 0.022"/></svg>
            <span>
              Get 20% OFF Every Order
            </span>
          </li>
           <li>
            <svg width="6px" height="6px" viewBox="0 0 0.12 0.12" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" d="M0.06 0.022a0.037 0.037 0 1 0 0 0.075A0.037 0.037 0 0 0 0.06 0.022"/></svg>
            <span>
              Fast, <span class="text-bold">FREE</span> Shipping On Every Order
            </span>
          </li>
          <li class="li-images">
            <div>
              <svg width="6px" height="6px" viewBox="0 0 0.12 0.12" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" d="M0.06 0.022a0.037 0.037 0 1 0 0 0.075A0.037 0.037 0 0 0 0.06 0.022"/></svg>
              Get $50+ Worth of <span class="text-bold">FREE</span> Gifts
            </div>
            <div>
              <div class="subscription__images">
                <div class="subscription__image">
                  <img src="data:image/png;base64,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" >
                  <span>
                    Rejuvia Magnet
                  </span>
                </div>
                <div class="subscription__image">
                  <img src="data:image/png;base64,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" >
                  <span>
                    Rejuvia Stickers
                  </span>
                </div>
                <div class="subscription__image">
                  <img src="data:image/png;base64,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" >
                  <span>
                    Rejuvia Spray
                  </span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <svg width="6px" height="6px" viewBox="0 0 0.12 0.12" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" d="M0.06 0.022a0.037 0.037 0 1 0 0 0.075A0.037 0.037 0 0 0 0.06 0.022"/></svg>
            <span>
               Easily Pause, Skip or Cancel Anytime
            </span>
          </li>
        </ul>
      </div>
    `
  }

  groupContentOneTime() {
    return html`
      <div class="group-content ${this.options?.layout == 'horizontal' ? '' : this.options?.show_radio_selector && this.options?.dropdownPosition == 'inside' ? 'margin-left' : ''}">
        <!-- Subscription bullet points copied with styling from Loop -->
        <ul style="width: 100%; height: 100%; padding-top: 4px; padding-inline-start: 0; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; display: inline-flex">
          <li>
            <span>
              Over 55% OFF vs. Buying Seperately
            </span>
          </li>
        </ul>
      </div>
    `
  }

  showDetails() {
    return html`
      <details class="skio-details" @mouseover=${e => this.detailsMouseover()} @mouseleave=${e => this.detailsMouseleave()}>
        <summary>
          <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="ai ai-ArrowRepeat"
            >
              <path d="M18 2l3 3-3 3" />
              <path d="M6 22l-3-3 3-3" />
              <path d="M21 5H10a7 7 0 0 0-7 7" />
              <path d="M3 19h11a7 7 0 0 0 7-7" />
            </svg>

            How do subscriptions work?
          </span>
        </summary>
        <div class="skio-details--content">
          <ul>
            <li>
              <div class="skio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div class="skio-content">
                <p>Get exclusive deals</p>
                <small>Subscribe for unique discounts</small>
              </div>
            </li>
            <li>
              <div class="skio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <div class="skio-content">
                <p>Edit your subscription anytime</p>
                <small>Edit products, delivery schedule and more</small>
              </div>
            </li>
            <li>
              <div class="skio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="skio-content">
                <p>No commitment</p>
                <small>Easy to cancel if it’s not for you</small>
              </div>
            </li>
          </ul>
          <div class="skio-details--footer">
            <a class="skio-manage-link" href="/a/account/login">Manage subscriptions</a>

            <a style="letter-spacing: 0" class="powered-by-skio" href="https://skio.com/?utm_source=eonsincshop.myshopify.com&utm_medium=details_popover" target="_blank" rel="noopener">
              Powered by
              <svg width="24" height="11" viewBox="0 0 24 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.28399 5.78801C4.12399 5.63601 3.93599 5.50801 3.71999 5.40401C3.50399 5.30001 3.27599 5.24801 3.03599 5.24801C2.85199 5.24801 2.67999 5.28401 2.51999 5.35601C2.36799 5.42801 2.29199 5.55201 2.29199 5.72801C2.29199 5.89601 2.37599 6.01601 2.54399 6.08801C2.71999 6.16001 2.99999 6.24001 3.38399 6.32801C3.60799 6.37601 3.83199 6.44401 4.05599 6.53201C4.28799 6.62001 4.49599 6.73601 4.67999 6.88001C4.86399 7.02401 5.01199 7.20001 5.12399 7.40801C5.23599 7.61601 5.29199 7.86401 5.29199 8.15201C5.29199 8.52801 5.21599 8.84801 5.06399 9.11201C4.91199 9.36801 4.71199 9.57601 4.46399 9.73601C4.22399 9.89601 3.95199 10.012 3.64799 10.084C3.34399 10.156 3.03999 10.192 2.73599 10.192C2.24799 10.192 1.76799 10.116 1.29599 9.96401C0.831989 9.80401 0.443989 9.57201 0.131989 9.26801L1.23599 8.10401C1.41199 8.29601 1.62799 8.45601 1.88399 8.58401C2.13999 8.71201 2.41199 8.77601 2.69999 8.77601C2.85999 8.77601 3.01599 8.74001 3.16799 8.66801C3.32799 8.58801 3.40799 8.45201 3.40799 8.26001C3.40799 8.07601 3.31199 7.94001 3.11999 7.85201C2.92799 7.76401 2.62799 7.67201 2.21999 7.57601C2.01199 7.52801 1.80399 7.46401 1.59599 7.38401C1.38799 7.30401 1.19999 7.19601 1.03199 7.06001C0.871989 6.92401 0.739989 6.75601 0.635989 6.55601C0.531989 6.35601 0.479989 6.11601 0.479989 5.83601C0.479989 5.47601 0.555989 5.17201 0.707989 4.92401C0.859989 4.66801 1.05599 4.46001 1.29599 4.30001C1.53599 4.14001 1.79999 4.02401 2.08799 3.95201C2.38399 3.87201 2.67599 3.83201 2.96399 3.83201C3.41199 3.83201 3.84799 3.90401 4.27199 4.04801C4.70399 4.18401 5.06799 4.39201 5.36399 4.67201L4.28399 5.78801Z"
                    fill="black"
                />
                <path d="M12.8481 10H10.4121L8.45615 7.13201H8.42015V10H6.44015V0.928009H8.42015V6.44801H8.45615L10.3641 4.02401H12.7521L10.4481 6.72401L12.8481 10Z" fill="black" />
                <path
                    d="M15.7009 2.11601C15.7009 2.26801 15.6689 2.41201 15.6049 2.54801C15.5489 2.67601 15.4689 2.78801 15.3649 2.88401C15.2689 2.98001 15.1489 3.05601 15.0049 3.11201C14.8689 3.16801 14.7249 3.19601 14.5729 3.19601C14.2529 3.19601 13.9849 3.09201 13.7689 2.88401C13.5529 2.66801 13.4449 2.41201 13.4449 2.11601C13.4449 1.97201 13.4729 1.83601 13.5289 1.70801C13.5849 1.57201 13.6649 1.45601 13.7689 1.36001C13.8729 1.26401 13.9929 1.18801 14.1289 1.13201C14.2649 1.06801 14.4129 1.03601 14.5729 1.03601C14.7249 1.03601 14.8689 1.06401 15.0049 1.12001C15.1489 1.17601 15.2689 1.25201 15.3649 1.34801C15.4689 1.44401 15.5489 1.56001 15.6049 1.69601C15.6689 1.82401 15.7009 1.96401 15.7009 2.11601ZM13.5889 10V4.02401H15.5569V10H13.5889Z"
                    fill="black"
                />
                <path
                    d="M23.4516 6.98801C23.4516 7.47601 23.3636 7.92001 23.1876 8.32001C23.0116 8.71201 22.7716 9.04801 22.4676 9.32801C22.1636 9.60001 21.8116 9.81201 21.4116 9.96401C21.0116 10.116 20.5836 10.192 20.1276 10.192C19.6796 10.192 19.2516 10.116 18.8436 9.96401C18.4436 9.81201 18.0916 9.60001 17.7876 9.32801C17.4916 9.04801 17.2556 8.71201 17.0796 8.32001C16.9036 7.92001 16.8156 7.47601 16.8156 6.98801C16.8156 6.50001 16.9036 6.06001 17.0796 5.66801C17.2556 5.27601 17.4916 4.94401 17.7876 4.67201C18.0916 4.40001 18.4436 4.19201 18.8436 4.04801C19.2516 3.90401 19.6796 3.83201 20.1276 3.83201C20.5836 3.83201 21.0116 3.90401 21.4116 4.04801C21.8116 4.19201 22.1636 4.40001 22.4676 4.67201C22.7716 4.94401 23.0116 5.27601 23.1876 5.66801C23.3636 6.06001 23.4516 6.50001 23.4516 6.98801ZM21.5556 6.98801C21.5556 6.79601 21.5236 6.60801 21.4596 6.42401C21.3956 6.24001 21.3036 6.08001 21.1836 5.94401C21.0636 5.80001 20.9156 5.68401 20.7396 5.59601C20.5636 5.50801 20.3596 5.46401 20.1276 5.46401C19.8956 5.46401 19.6916 5.50801 19.5156 5.59601C19.3396 5.68401 19.1916 5.80001 19.0716 5.94401C18.9596 6.08001 18.8716 6.24001 18.8076 6.42401C18.7516 6.60801 18.7236 6.79601 18.7236 6.98801C18.7236 7.18001 18.7516 7.36801 18.8076 7.55201C18.8716 7.73601 18.9636 7.90401 19.0836 8.05601C19.2036 8.20001 19.3516 8.31601 19.5276 8.40401C19.7036 8.49201 19.9076 8.53601 20.1396 8.53601C20.3716 8.53601 20.5756 8.49201 20.7516 8.40401C20.9276 8.31601 21.0756 8.20001 21.1956 8.05601C21.3156 7.90401 21.4036 7.73601 21.4596 7.55201C21.5236 7.36801 21.5556 7.18001 21.5556 6.98801Z"
                    fill="black"
                />
              </svg>
            </a>
          </div>
        </div>
      </details>
    `
  }

  // !SECTION: Element Templates

  render() {
    if (!this.viable() || this.options?.layout === 'hidden') {
      return this.debug ? this.setupMode() : ''
    }

    if (this.selectedVariant.selling_plan_allocations.length === 0 && !this.options?.show_without_subscription) {
      return this.debug ? this.setupMode() : ''
    }

    const isSleepSprayPack = this.product?.title === 'Sleep Spray 6-Pack';

    return html`
    ${this.debug ? this.setupMode() : null}

    <fieldset class="skio-plan-picker ${isSleepSprayPack ? 'bundle-product' : ''} " role="radiogroup" aria-labelledby="skio-plan-picker-legend">
      <legend id="skio-plan-picker-legend" class="${!this.options?.show_legend ? 'sr-only' : ''}">
        ${unsafeHTML(this.options?.legend_content)}
      </legend>

      <div class="custom-picker-heading 33">
        Choose Your Frequency: <span>Subscribe & Save 20%</span>
      </div>

      ${isSleepSprayPack
        ? html`${this.renderOneTimePurchase('first-one-time')}${this.renderSubscriptionOptions()}`
        : html`${this.renderSubscriptionOptions()}${this.renderOneTimePurchase()}`
    }

      ${this.options?.show_details === true ? this.showDetails() : ''}
    </fieldset>
  `;
  }

  renderSubscriptionOptions() {
    return this.availableSellingPlanGroups?.length
        ? this.availableSellingPlanGroups.map((group, index) => html`
        <div class="group-container subs-group-container ${this.selectedSellingPlanGroup == group ? 'group-container--selected' : ''}">
          <input
            id="group-${index}-${this.key}"
            class="group-input"
            name="skio-group-${this.key}"
            type="radio"
            value="${group.id}"
            @change=${() => this.selectSellingPlanGroup(group)}
            ?checked=${this.selectedSellingPlanGroup == group}
          />

          <label class="group-label" for="group-${index}-${this.key}">
            <div class="group-topline">
              ${this.options?.layout == 'horizontal' ? '' : this.options?.show_radio_selector ? this.radioTemplate() : ''}

              <div class="group-title 44"><span style="height: 22px;">
                ${group.name !== 'Prepaid' && this.options?.subscription_title
            ? this.options?.subscription_title
            : group.name == 'Prepaid' && this.options?.prepaid_title
                ? this.options?.prepaid_title
                : group.name}
              </span>
                ${html`
                  <span class="extra-discount-text">
                    ${this.discountText(group.selected_selling_plan) || ''}
                  </span>`}
                ${this.discountText(group.selected_selling_plan)
            ? html`<span class="savings bubble ${this.options?.discount_style}"><span>Save ${this.discountText(group.selected_selling_plan)} <span class="subscription__label">Best Price</span></span></span>`
            : ''}
              </div>

              <div class="skio-price" aria-live="polite">
                ${this.options?.show_compare_price &&
        (this.selectedVariant?.compare_at_price > this.selectedVariant.price ||
            this.selectedVariant.price > this.price(group.selected_selling_plan, false))
            ? html`<s aria-hidden="true">${this.money(this.selectedVariant.compare_at_price || this.selectedVariant.price)}</s>`
            : ''}
                ${this.price(group.selected_selling_plan)}
                <span class="skio-price__delivery">+ Free Shipping</span>
              </div>
            </div>

            ${this.options?.layout == 'vertical' && this.options?.dropdownPosition == 'inside'
            ? this.groupContent(group)
            : ''}
          </label>
        </div>

        ${this.selectedSellingPlanGroup == group
            ? (this.options?.layout == 'horizontal' || this.options?.dropdownPosition == 'underneath'
                ? this.groupContent(group)
                : '')
            : ''}
      `)
        : '';
  }


  renderOneTimePurchase(classname) {
    const isSleepSprayPack = this.product?.title === 'Sleep Spray 6-Pack';

    return !this.product.requires_selling_plan
        ? html`
        <div
          class="group-container ${classname} ${this.selectedSellingPlanGroup == null ? ' group-container--selected' : ''} ${!this.options?.onetime_first ? 'group-container--last' : ''}"
          @click=${() => this.selectSellingPlanGroup(null)}
        >
          <input
            id="one-time-${this.key}"
            class="group-input"
            name="skio-group-${this.key}"
            type="radio"
            value="One time purchase"
            ?checked=${!this.selectedSellingPlanGroup}
            @change=${() => this.selectSellingPlanGroup(null)}
          />

          <label class="group-label" for="one-time-${this.key}">
            <div class="group-topline">
              ${this.options?.layout == 'horizontal' ? '' : this.options?.show_radio_selector ? this.radioTemplate() : ''}

              <div class="group-title 33">
                <span>${this.options?.onetime_title || 'One time purchase'}</span>
              </div>

              <div class="skio-price" aria-live="polite">
                ${this.options?.show_compare_price && this.selectedVariant?.compare_at_price > this.selectedVariant.price
            ? html`<s aria-hidden="true">${this.money(this.selectedVariant.compare_at_price)}</s>`
            : ''}
                ${this.money(this.selectedVariant.price)}
              </div>
            </div>
            ${isSleepSprayPack ? this.groupContentOneTime() : ''}
          </label>
        </div>
      `
        : '';
  }



  async fetchRules() {
    if (sessionStorage.getItem('skio-discount-rules')) {
      return JSON.parse(sessionStorage.getItem('skio-discount-rules'))
    } else {
      const rules = await fetch(`https://api.skio.com/storefront-http/get-rules-by-domain-or-hostname?domain=${window?.Shopify?.shop}`)
          .then(response => response.json())
          .then(response => {
            return response.rules.filter(rule => rule.type !== 'surpriseDelight').sort((a, b) => a.minQuantityToDiscount - b.minQuantityToDiscount)
          })

      sessionStorage.setItem('skio-discount-rules', JSON.stringify(rules))
      return rules
    }
  }

  eligibleItemCount(rule) {
    if (!this.cart?.items) return this.quantity

    let cartItems = Number(
        this.cart?.items.reduce((aggregate, item) => (rule?.productVariantIds.some(gid => gid.includes(item.id) && item.selling_plan_allocation) ? aggregate + item.quantity : aggregate), 0)
    )

    return cartItems + this.quantity
  }

  getRule() {
    let largestMinQuantity = {
      value: -1,
      index: -1,
    }

    this.rules.forEach((rule, index) => {
      if (rule.code && largestMinQuantity.value < rule.minQuantityToDiscount) {
        if (rule.minQuantityToDiscount <= this.eligibleItemCount(rule)) {
          largestMinQuantity.value = rule.minQuantityToDiscount
          largestMinQuantity.index = index
        }
      }
    })

    this.rule = largestMinQuantity.index > -1 ? this.rules[largestMinQuantity.index] : null
  }

  bindCartEvents() {
    document.addEventListener('CartUpdated', event => {
      this.cart = event.detail
    })
  }

  bindFormEvents() {
    this.form = document.getElementById(this.options?.form_id) || this.closest('form[action*="/cart/add"]')

    if (!this.form) {
      return
    }

    this.variantInput = this.form.querySelector('[name="id"]')

    // if (this.variantInput) {
    //   this.variantInput.addEventListener('change', e => {
    //     this.selectedVariant = this.product.variants.find(variant => variant.id == e.target.value)
    //     this.variantChanged = true
    //   })
    // }

    if (this.variantInput) {
      // Create a MutationObserver to watch for changes to the variant input's value
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            const newVariantId = this.variantInput.value;
            this.selectedVariant = this.product.variants.find(variant => variant.id == newVariantId);
            this.variantChanged = true;
            // this.requestUpdate(); // Trigger a re-render of the component
          }
        });
      });

      // Configure the observer to watch for changes to the 'value' attribute
      observer.observe(this.variantInput, { attributes: true, attributeFilter: ['value'] });
    }
  }

  detailsMouseover() {
    let details = this.renderRoot.querySelector('.skio-details')
    let summary = this.renderRoot.querySelector('.skio-details summary')
    if (!details.hasAttribute('open') && this.showDetailsHover == false) {
      summary.click()
      this.showDetailsHover = true
    }
  }

  detailsMouseleave() {
    let details = this.renderRoot.querySelector('.skio-details')
    let summary = this.renderRoot.querySelector('.skio-details summary')
    if (details.hasAttribute('open') && this.showDetailsHover == true) {
      summary.click()
      this.showDetailsHover = false
    }
  }

  updated(changed) {
    if (!this.viable()) return

    if (changed.has('product') && this.product) {
      this.key = this.key ? this.key : this.product.id
    }

    if (changed.has('selectedVariant') && this.selectedVariant) {
      const filteredSellingPlanGroups = this.product.selling_plan_groups.filter(
          selling_plan_group =>
              selling_plan_group.app_id === 'SKIO' && !selling_plan_group.name.toLowerCase().includes('hidden-') && !selling_plan_group.name.toLowerCase().includes('dynamic box subscription')
      )

      //update availableSellingPlanGroups based on skioSellingPlanGroups and selectedVariant.id
      this.availableSellingPlanGroups = filteredSellingPlanGroups.filter(selling_plan_group =>
          selling_plan_group.selling_plans.some(selling_plan =>
              this.selectedVariant.selling_plan_allocations.some(selling_plan_allocation => selling_plan_allocation.selling_plan_id === selling_plan.id)
          )
      )

      if (this.options?.combine_groups) {
        this.availableSellingPlanGroups = [
          {
            name: this.options?.combined_group_name,
            selling_plans: this.availableSellingPlanGroups.flatMap(group => group.selling_plans),
            id: 'combined_group',
            app_id: 'SKIO',
          },
        ]
      }

      // TODO: Select proper group depending on what selling plan is selected

      //update selectedSellingPlan value
      if (this.availableSellingPlanGroups?.length) {
        const url = new URL(window.location.href)
        const urlSelectedSellingPlanId = url.searchParams.get('selling_plan')

        //update each group with a default selected_selling_plan
        this.availableSellingPlanGroups.forEach(group => {
          const availableSellingPlans = this.getAvailableSellingPlans(group)

          const urlSelectedSellingPlan = availableSellingPlans.find(plan => plan.id == urlSelectedSellingPlanId)
          const nameSelectedSellingPlan = availableSellingPlans.find(plan => plan.name === this.selectedSellingPlan?.name)
          const defaultSellingPlan =
              this.options?.default_subscription && this.options.default_subscription.trim() !== ''
                  ? availableSellingPlans.find(plan => plan.name.toLowerCase().includes(this.options.default_subscription.toLowerCase()))
                  : null

          group.selected_selling_plan = urlSelectedSellingPlan || nameSelectedSellingPlan || defaultSellingPlan || availableSellingPlans[0]

          const isAnyPlanSelected = urlSelectedSellingPlan || nameSelectedSellingPlan || defaultSellingPlan

          group.selected = !!isAnyPlanSelected
        })

        if ((!this.variantChanged && this.options?.start_onetime == false) || this.product.requires_selling_plan == true || urlSelectedSellingPlanId || this.selectedSellingPlan) {
          let selectedSellingPlanGroup = this.availableSellingPlanGroups.find(group => group.selected) || this.availableSellingPlanGroups[0]
          let selectedSellingPlanId = selectedSellingPlanGroup.selected_selling_plan.id
          this.selectSellingPlan(selectedSellingPlanId)
        } else {
          this.selectSellingPlanGroup(null)
        }
      } else {
        this.selectSellingPlanGroup(null)
      }
    }

    if (changed.has('selectedSellingPlan')) {
      //dispatch CustomEvent to tell that this specific plan picker was updated, and pass the selectedSellingPlan
      const event = new CustomEvent(`skio::update-selling-plan`, {
        bubbles: true,
        composed: true,
        detail: {
          variant: this.selectedVariant,
          sellingPlan: this.selectedSellingPlan,
          key: this.key,
        },
      })

      this.dispatchEvent(event)

      this.dispatchEvent(
          new CustomEvent('change', {
            detail: { value: this.selectedSellingPlan?.id },
          })
      )
    }

    this.updateForm()
    this.updateExternalPrice()

    if (!this.disableUrl) {
      this.updateURLParams()
    }

    if (changed.has('quantity')) {
      this.getRule()
    }

    if (changed.has('cart')) {
      this.getRule()
    }

    this.updateExternalElements()
  }

  updateExternalElements() {
    document.querySelectorAll(`[skio-price][skio-key="${this.key}"]`).forEach(el => {
      el.innerHTML = this.price(this.selectedSellingPlan + '<span class="skio-price__delivery">+ Free Shipping</span>')
    })

    document.querySelectorAll(`[skio-subscription-content]`).forEach(el => {
      el.style.display = this.selectedSellingPlan ? 'block' : 'none'
    })
  }

  // SECTION: Utility Functions
  log(...args) {
    args.unshift(`%c[skio plan picker][${this.key}]`, 'color: #8770f2;')
    console.log.apply(console, args)
  }

  error(...args) {
    args.unshift(`%c [skio plan picker][${this.key}]`, 'color: #ff0000')
    console.error.apply(console, args)
  }

  appendOrdinalSuffix(num) {
    const j = num % 10,
        k = num % 100
    if (j == 1 && k != 11) {
      return num + 'st'
    }
    if (j == 2 && k != 12) {
      return num + 'nd'
    }
    if (j == 3 && k != 13) {
      return num + 'rd'
    }
    return num + 'th'
  }

  money(price) {
    return this.moneyFormatter.format(price / 100.0)
  }

  viable() {
    const errors = []

    const sellingPlanInput = this.querySelector('input[name=selling_plan]')
    if (!sellingPlanInput) {
      errors.push('Missing selling plan input')
    }

    if (!this.product) {
      errors.push('No product found. Please pass a product or productHandle to the skio-plan-picker component.')
    }
    if (!this.selectedVariant) {
      errors.push('No variant found. Please pass a product or productHandle to the skio-plan-picker component.')
    }
    if (!this.form) {
      errors.push('No form found. Please add a form_id to the plan picker through the Shopify customizer or ensure that the element is in a form that has an input with name="id".')
    }
    if (!this.variantInput) {
      errors.push('No variant input found. Please add a form_id to the plan picker through the Shopify customizer or ensure that the element is in a form that has an input with name="id"')
    }

    if (errors.length == 0) return true

    this.error('Errors', errors)
    return false
  }

  getAvailableSellingPlans(group) {
    let availableSellingPlans = group.selling_plans.filter(selling_plan =>
        this.selectedVariant.selling_plan_allocations.some(selling_plan_allocation => selling_plan_allocation.selling_plan_id === selling_plan.id)
    )

    return availableSellingPlans
  }

  // !SECTION: Utility Functions

  // Update selected selling plan group; called on click of group-container element
  selectSellingPlanGroup(group) {
    this.selectedSellingPlanGroup = group
    this.selectedSellingPlan = group?.selected_selling_plan

    if(group){
      console.log("It is subscription");
      const additional_product = document.querySelector(".additional-product__wrap");
      const variantsFree = document.querySelectorAll(".subscription-text");
      if(additional_product){
        additional_product.classList.remove('hidden')
      }
      if(variantsFree){
        variantsFree.forEach((item)=>{
          item.classList.remove('hidden')
        })
      }
    } else {
      const additional_product = document.querySelector(".additional-product__wrap");
      const variantsFree = document.querySelectorAll(".subscription-text");
      if(additional_product){
        additional_product.classList.add('hidden')
      }
      if(variantsFree){
        variantsFree.forEach((item)=>{
          item.classList.add('hidden')
        })
      }
    }
  }

  // Update selected selling plan; called on change of skio-frequency select element
  selectSellingPlan(selling_plan_id) {
    const selectedGroup = this.availableSellingPlanGroups.find(group => group.selling_plans.some(plan => plan.id == selling_plan_id))
    const selectedSellingPlan = selectedGroup.selling_plans.find(plan => plan.id == selling_plan_id)

    selectedGroup.selected_selling_plan = selectedSellingPlan
    this.selectedSellingPlanGroup = selectedGroup
    this.selectedSellingPlan = selectedSellingPlan
  }

  updateExternalPrice() {
    document.querySelectorAll(this.options?.external_price_selector).forEach(el => {
      this.selectedSellingPlan ? (el.innerHTML = this.price(this.selectedSellingPlan)) : (el.innerHTML = this.money(this.selectedVariant.price))
    })
    // document.querySelectorAll(this.options?.external_price_selector).forEach(el => {
    //   this.selectedSellingPlan ? (el.innerHTML = this.price(this.selectedSellingPlan) + ' ' + this.currency) : (el.innerHTML = this.money(this.selectedVariant.price) + ' ' + this.currency)
    // })
  }

  additionalFrequencyLabel() {
    if (!this.options?.additional_frequency_label || this.options?.additional_frequency_label == '') return

    return unsafeHTML(this.options?.additional_frequency_label)
  }

  additionalContentText() {
    if (!this.options?.additional_subscription_content || this.options?.additional_subscription_content == '') return

    return unsafeHTML(
        this.options?.additional_subscription_content
            .replaceAll('[discount]', this.options?.discount_format === 'absolute' ? this.money(this.discount(this.selectedSellingPlan).absolute) : this.discount(this.selectedSellingPlan).percent + '%')
            .replaceAll('[future_price_adjustments]', this.postCheckoutDiscountsText(this.selectedSellingPlan) || '')
    )
  }

  // SECTION: Discount Functions
  // Calculates discount based on selling_plan.price_adjustments, returns { percent, amount } of selling plan discount
  discountText(selling_plan) {
    const discount = this.discount(selling_plan)
    const hasInvalidDiscount = Object.values(discount).some(value => value === 0 || value === Infinity || value.toString().includes('-'))

    if (hasInvalidDiscount) {
      return '' // Return empty if any invalid condition is met
    } else {
      return unsafeHTML(
          this.options?.discount_text
              .replaceAll('[discount]', this.options?.discount_format === 'absolute' ? this.money(discount.absolute) : discount.percent + '%')
              .replaceAll('[future_price_adjustments]', this.postCheckoutDiscountsText(selling_plan) || '')
      )
    }
  }

  discount(selling_plan) {
    if (!selling_plan) return { percent: 0, amount: 0 }
    return this.getDiscountFromPriceAdjustment(selling_plan, selling_plan.price_adjustments[0])
  }

  postCheckoutPriceAdjustments(selling_plan) {
    const { price_adjustments } = selling_plan
    const postCheckoutPriceAdjustments = price_adjustments.filter(({ position }) => position !== 1)
    const discounts = postCheckoutPriceAdjustments.map(price_adjustment => this.getDiscountFromPriceAdjustment(selling_plan, price_adjustment))
    return discounts
  }

  postCheckoutDiscountsText(sellingPlan = this.selectedSellingPlan) {
    if (!sellingPlan || !this.options?.future_price_adjustments_text || this.future_price_adjustments_text == '') return

    const postCheckoutPriceAdjustments = this.postCheckoutPriceAdjustments(sellingPlan)
    if (!postCheckoutPriceAdjustments.length) return

    return postCheckoutPriceAdjustments.map((discount, index) =>
        this.options?.future_price_adjustments_text
            .replaceAll('[discount]', this.options?.discount_format === 'absolute' ? this.money(discount.absolute) : discount.percent + '%')
            .replaceAll('[order_count]', index + 1)
            .replaceAll('[order_count_ordinal]', this.appendOrdinalSuffix(index + 1))
    )
  }

  getDiscountFromPriceAdjustment(selling_plan, price_adjustment) {
    const discount = {
      percent: 0,
      amount: 0,
      absolute: 0,
    }

    let multiplier = 1

    let sellingPlanGroup = this.product.selling_plan_groups.find(group => group.selling_plans.some(plan => plan.id == selling_plan.id))

    if (sellingPlanGroup?.name === 'Prepaid') {
      const str = selling_plan.name // replace with your string
      const intervalDate = /\b\d+\s*(days|weeks|months|years)\b/gi
      const intervalDateMatches = str.match(intervalDate)

      if (intervalDateMatches?.length) {
        const intervals = intervalDateMatches[0].match(/\d+/g)
        multiplier = intervals[0] / (intervals[1] || 1)
        multiplier = multiplier > 1 ? multiplier : 1
      }
    }

    const price = this.selectedVariant.price
    const compareAtPrice = this.selectedVariant.compare_at_price && this.selectedVariant.compare_at_price > price ? this.selectedVariant.compare_at_price : price

    switch (price_adjustment.value_type) {
      case 'percentage':
        discount.percent = price_adjustment.value
        discount.absolute = Math.round((price * price_adjustment.value) / 100.0)
        discount.amount = Math.round((price * price_adjustment.value) / 100.0)
        break
      case 'fixed_amount':
        discount.percent = Math.round(((price_adjustment.value * 1.0) / price) * 100.0)
        discount.absolute = price_adjustment.value
        discount.amount = price_adjustment.value
        break
      case 'price':
        discount.percent = Math.round((((compareAtPrice * multiplier - price_adjustment.value) * 1.0) / (compareAtPrice * multiplier)) * 100.0)
        discount.absolute = compareAtPrice * multiplier - price_adjustment.value
        discount.amount = price - price_adjustment.value
        break
    }

    return discount
  }
  // !SECTION: Discount Functions
  price(selling_plan, formatted = true) {
    if (this.rule) {
      return formatted
          ? this.money(this.selectedVariant.price - this.discount(selling_plan).amount - this.selectedVariant.price * (this.rule.discountAmount / 100))
          : this.selectedVariant.price - this.discount(selling_plan).amount - this.selectedVariant.price * (this.rule.discountAmount / 100)
    }

    return formatted ? this.money(this.selectedVariant.price - this.discount(selling_plan).amount) : this.selectedVariant.price - this.discount(selling_plan).amount
  }

  // Updates element data to be registered by forms
  updateForm() {
    let $sellingPlan = this.querySelector('input[name=selling_plan]')

    if ($sellingPlan) {
      $sellingPlan.value = this.selectedSellingPlan ? this.selectedSellingPlan.id : ''
      $sellingPlan.dispatchEvent(new Event('change'))
    }
  }

  // SECTION: Additional Functionality
  updateURLParams() {
    const url = new URL(window.location.href)

    if (this.selectedSellingPlan) {
      url.searchParams.set('selling_plan', this.selectedSellingPlan.id)
      window.history.replaceState({}, '', url.href)
    } else {
      url.searchParams.delete('selling_plan')
      window.history.replaceState({}, '', url.href)
    }
  }

  // Runs a fetch request to add the selectedVariant to the cart with the passed quantity and selectedSellingPlan
  addToCart(quantity) {
    console.log("addToCart(quantity)", "TEEEEEEEESSSSSSSSSTTTTTTTTT")
    const items = [
      {
        id: this.selectedVariant.id,
        quantity: quantity,
        ...(this.selectedSellingPlan && {
          selling_plan: this.selectedSellingPlan?.id,
        }),
      },
    ]

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
      }),
    })
        .then(response => response.json())
        .then(response => {
          this.log('Added item to cart: ', response)
          //dispatch CustomEvent to tell document that an item was added to cart
          const event = new CustomEvent(`skio::added-to-cart`, {
            bubbles: true,
            composed: true,
            detail: {
              response,
              key: this.key,
            },
          })

          this.dispatchEvent(event)
        })
        .catch(error => {
          this.error(`SKIO ${this.key} error adding item to cart: `, error)
        })
  }

  fetchProduct = handle => {
    return fetch(`/products/${handle}.js`)
        .then(response => response.json())
        .then(product => {
          this.product = product
          this.selectedVariant = product.variants[0]

          return product
        })
  }
  // !SECTION: Additional Functionality
}

if (!customElements.get('skio-plan-picker')) {
  customElements.define('skio-plan-picker', SkioPlanPicker)
}

if (window) window.SkioPlanPicker = SkioPlanPicker
