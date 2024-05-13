export default class ArrangeBoxControlTextFilterClass extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.styling = document.createElement('style');
    this.inputElement = document.createElement('input');
    this.filterTargetList;
    this.parentArrangeBoxControlElement;
  };

  handleInput(e) {
    for (let child of this.filterTargetList) {
      const processInputRegExp = new RegExp(/[^А-Яа-яA-Za-z#0-9\s]/, 'g')
      if (processInputRegExp.test(e.target.value) === true) {
        e.target.value = e.target.value.replace(processInputRegExp, '')
      }
      let searchRegExp = new RegExp(`${e.target.value}`, 'gi');
      if (searchRegExp.test(child.text) === false) {
        this.parentArrangeBoxControlElement.excludeItemsBySearchLeft = [...this.parentArrangeBoxControlElement.excludeItemsBySearchLeft, child]
        this.parentArrangeBoxControlElement.assignStyles()
      } else {
        this.parentArrangeBoxControlElement.excludeItemsBySearchLeft = this.parentArrangeBoxControlElement.excludeItemsBySearchLeft.filter(current => current != child)
        this.parentArrangeBoxControlElement.assignStyles()
      }
    }
  }

  connectedCallback() {
    this.styling.textContent = `
      input {
        font-family: helvetica, sans-serif;
        font-size: 1em;
        border: solid 1px var(--border);
        border-radius: 4px;
        padding: 8px;
        margin: 0px;
        width: 100%;
        box-sizing: border-box;
      }
    `;
    this.shadow.appendChild(this.styling);
    this.shadow.appendChild(this.inputElement);

    this.inputElement.addEventListener('input', (e) => this.handleInput(e))
  }
}