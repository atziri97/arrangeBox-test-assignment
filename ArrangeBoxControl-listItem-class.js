export default class ArrangeBoxControlListItem extends HTMLElement {
  static observedAttributes = ['class']

  constructor() {
    super();
    this.styling = document.createElement('style');
    this.shadow = this.attachShadow({ mode: 'open' });
    this.text = '';
    this.li = document.createElement('li');
  }

  connectedCallback() {
    this.styling.textContent = `
      li {
        padding: var(--main-padding);
        cursor: pointer;
        box-sizing: border-box;
        transition: background-color 0.1s;
      }

      .item-active {
        background-color: #b2c0ff;
      }
      
      .item-active:hover {
          background-color: #9badff;
      }
      
      .item-active-latest {
        background-color: #6e89ff;
      }
      
      .item-active-latest:hover {
        background-color: #5574fd;
      }
      
      li:hover {
        background-color: #f1f1f1;
      }
      
      .hide-item {
        display: none;
      }
    `;
    this.shadow.appendChild(this.styling);
    this.li.textContent = this.text;
    this.shadow.appendChild(this.li)

  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.li.className = newValue
  }
}