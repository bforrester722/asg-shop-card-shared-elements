/**
 * `asg-shop-sold-out-label`
 * 
 * This label is visible when there are no cards available for sale in any condition/foil
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
import {AppElement, html} from '@smyd/app-shared/app-element.js';
import htmlString from './asg-shop-sold-out-label.html';


class ASGShopSoldOutLabel extends AppElement {
  static get is() { return 'asg-shop-sold-out-label'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      isBuylist: {
        type: Boolean,
        value: false
      },

      card: Object, 

      _soldOut: {
        type: Boolean,
        value: false,
        computed: '__computeSoldOut(card, isBuylist)',
        observer: '__soldOutChanged'
      }  
      
    };
  }


  __computeSoldOut(card, isBuylist) {
    if (isBuylist) { return false; }
    if (!card) { return false; }
    const {foil, notFoil} = card;
    const foilQtys    = Object.values(foil).map(obj => obj.qty);
    const notFoilQtys = Object.values(notFoil).map(obj => obj.qty);
    const qtys        = [...foilQtys, ...notFoilQtys];
    const inStock     = qtys.some(qty => 
                          typeof qty === 'number' && qty > 0);
    return !inStock;
  }


  __soldOutChanged(bool) {
    if (bool) {
      this.style.display = 'flex';
    }
    else {
      this.style.display = 'none';
    }
  }

}

window.customElements.define(ASGShopSoldOutLabel.is, ASGShopSoldOutLabel);
