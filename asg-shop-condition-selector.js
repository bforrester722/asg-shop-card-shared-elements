/**
 * `asg-shop-condition-selector`
 * select card grade
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
import {AppElement, html} from '@smyd/app-shared/app-element.js';
import htmlString    from './asg-shop-condition-selector.html';
import {listenOnce}  from '@smyd/app-functions/utils.js';
import '@polymer/iron-selector/iron-selector.js';

const displayedBuylistPrice = ({price}, qty, buylist) => {
const buylistPercent = buylist.all.price;
  return (price * buylistPercent / 100).toFixed(2);
};

class ASGShopConditionSelector extends AppElement {
  static get is() { return 'asg-shop-condition-selector'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      buylistRules: Object,

      card: Object,

      foil: Boolean,
      // 'left' or 'top'
      from: {
        type: String,
        value: 'top'
      },

      isBuylist: {
        type: Boolean, 
        value: false
      },

      selected: String,

      _transform: {
        type: String,
        computed: '__computeTransform(from)'
      }

    };
  }


  static get observers() {
    return [
      '__transformChanged(_transform)'
    ];
  }


  __computeTransform(from) {
    if (!from) { return; }
    return from === 'left' ? 'translateX(-100%)' : 'translateY(-100%)';
  }


  __computeConditionDisabled(card, foil, condition, buylist) {
    if (buylist) return false;
    if (!card) { return; }
    const foilKey = foil ? 'foil' : 'notFoil';
    const {qty}   = card[foilKey][condition];
    return !Boolean(Number(qty));
  }


  __computeCondPrice(card, foil, condition) {    
    const notAvailable = 'Not Available';
    if (!card) { return notAvailable; }
    const {foil: foilConds, notFoil: notFoilConds} = card;
    const displayedPrice = ({price, sale}) => {
      const displayed = sale && sale !== '0' ? sale : price;
      return displayed ? `$ ${Number(displayed).toFixed(2)}` : notAvailable;
    };
    if (foil) {
      if (!foilConds) { return notAvailable; }
      return displayedPrice(foilConds[condition]);
    }
    if (!notFoilConds) { return notAvailable; }
    return displayedPrice(notFoilConds[condition]);
  }

  __computeBuylistCondPrice(card, foil, condition, buylistRules) {    
    const notAvailable = 'Not Available';
    if (!card || !buylistRules) { return; }
    const {foil: foilConds, notFoil: notFoilConds} = card;
    if (foil) {
      if (!foilConds) { return notAvailable; }
      return displayedBuylistPrice(foilConds[condition], qty, buylistRules);
    }
    if (!notFoilConds) { return notAvailable; }
    return displayedBuylistPrice(notFoilConds[condition], qty, buylistRules);
  }


  async __conditionClicked() {
    try {
      await this.clicked();
      this.close();
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error(error);
    }
  }


  __conditionSelectedChanged(event) {
    this.fire('asg-shop-condition-selector-selected', event.detail);
  }


  __transformChanged(str) {
    if (!str) { return; }
    this.style.transform = str;
  }


  close() {   
    this.style.opacity   = '0';
    this.style.transform = this._transform;
  }


  async open() {      
    this.style.opacity   = '1';
    this.style.transform = 'none';
    await listenOnce(window, 'click');
    this.close();
  }

}

window.customElements.define(ASGShopConditionSelector.is, ASGShopConditionSelector);
