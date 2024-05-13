export default class ArrangeBoxControlButton extends HTMLElement {
  constructor() {
    super();
    this.styling = document.createElement('style');
    this.button = document.createElement('button');
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.text = '';
  };

  connectedCallback() {
    this.styling.textContent = `
      button {
        font-family: 'Roboto', sans-serif;
        height: 30px;
        width: 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #c3d7ff;
        transition: background-color 0.2s;
      }

      button:hover {
        background-color: #a4c3ff;
      }

      button:active {
        background-color: #70a0ff;
        color: white;
      };
    `
    this.shadow.appendChild(this.styling);
    this.shadow.appendChild(this.button);
    this.button.textContent = this.text;
  };
};