export default class ArrangeBoxControlButton extends HTMLElement {
  static observedAttributes = ['data-button-type']

  constructor() {
    super();
    this.styling = document.createElement('style');
    this.button = document.createElement('button');
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.parentArrangeBoxControlElement;
    this.text = '';
    this.handleActivatePress = this.handleActivatePress.bind(this);
    this.handleActivateAllPress = this.handleActivateAllPress.bind(this);
    this.handleDeactivatePress = this.handleDeactivatePress.bind(this);
    this.handleDeactivateAllPress = this.handleDeactivateAllPress.bind(this);
  };

  sortActiveItems(list, activeItems) {
    let sortedActiveItems = [];
      for (let child of list.children) {
        if (activeItems.includes(child) === true) {
          sortedActiveItems = [...sortedActiveItems, child]
        }
      };
    return sortedActiveItems;
  };

  handleActivatePress() {
    if (this.parentArrangeBoxControlElement.activeItemsLeft.length != 0) {
      this.parentArrangeBoxControlElement.activeItemsLeft = this.sortActiveItems(this.parentArrangeBoxControlElement.shadow.getElementById('list'), this.parentArrangeBoxControlElement.activeItemsLeft).reverse();
      this.parentArrangeBoxControlElement.activeItemsLeft.forEach(current => {
        this.parentArrangeBoxControlElement.displayedItems = this.parentArrangeBoxControlElement.displayedItems.filter(current2 => current2 != current);
        this.parentArrangeBoxControlElement.selectedItems = [...this.parentArrangeBoxControlElement.selectedItems, current]
        this.parentArrangeBoxControlElement.latestSelectedItem = {}
        this.parentArrangeBoxControlElement.assignStyles()        
      });
      this.parentArrangeBoxControlElement.reRenderLists('left')
    }
  };

  handleActivateAllPress() {
    if (this.parentArrangeBoxControlElement.shadow.getElementById('list').children.length != 0) {
        this.parentArrangeBoxControlElement.displayedItems = [];
        this.parentArrangeBoxControlElement.latestSelectedItem = {};
        this.parentArrangeBoxControlElement.activeItemsLeft = [];
        this.parentArrangeBoxControlElement.assignStyles()
      for (let child of this.parentArrangeBoxControlElement.shadow.getElementById('list').children) {
        this.parentArrangeBoxControlElement.selectedItems = [...this.parentArrangeBoxControlElement.selectedItems, child];
        this.parentArrangeBoxControlElement.activeItemsLeft = [...this.parentArrangeBoxControlElement.activeItemsLeft, child];
        this.parentArrangeBoxControlElement.assignStyles()       
      }
      this.parentArrangeBoxControlElement.selectedItems = this.parentArrangeBoxControlElement.selectedItems.reverse()
      this.parentArrangeBoxControlElement.activeItemsLeft = this.parentArrangeBoxControlElement.activeItemsLeft.reverse()
      this.parentArrangeBoxControlElement.reRenderLists('left')
    }
  };

  handleDeactivatePress() {
    if (this.parentArrangeBoxControlElement.activeItemsRight.length != 0) {
      this.parentArrangeBoxControlElement.activeItemsRight = this.sortActiveItems(this.parentArrangeBoxControlElement.shadow.getElementById('list-active'), this.parentArrangeBoxControlElement.activeItemsRight).reverse()
      this.parentArrangeBoxControlElement.activeItemsRight.forEach(current => {
        this.parentArrangeBoxControlElement.selectedItems = this.parentArrangeBoxControlElement.selectedItems.filter(current2 => current2 != current);
        this.parentArrangeBoxControlElement.displayedItems = [...this.parentArrangeBoxControlElement.displayedItems, current];
        this.parentArrangeBoxControlElement.latestSelectedItem = {};
        this.parentArrangeBoxControlElement.assignStyles()         
      });
      this.parentArrangeBoxControlElement.reRenderLists('right')
    }
  };

  handleDeactivateAllPress() {
    if (this.parentArrangeBoxControlElement.shadow.getElementById('list-active').children.length != 0) {
        this.parentArrangeBoxControlElement.selectedItems = [];
        this.parentArrangeBoxControlElement.latestSelectedItem = {};
        this.parentArrangeBoxControlElement.activeItemsRight = [];
        this.parentArrangeBoxControlElement.assignStyles()
      for (let child of this.parentArrangeBoxControlElement.shadow.getElementById('list-active').children) {
        this.parentArrangeBoxControlElement.displayedItems = [...this.parentArrangeBoxControlElement.displayedItems, child];
        this.parentArrangeBoxControlElement.activeItemsRight = [...this.parentArrangeBoxControlElement.activeItemsRight, child];
        this.parentArrangeBoxControlElement.assignStyles()       
      }
      this.parentArrangeBoxControlElement.displayedItems = this.parentArrangeBoxControlElement.displayedItems.reverse()
      this.parentArrangeBoxControlElement.activeItemsRight = this.parentArrangeBoxControlElement.activeItemsRight.reverse()
      this.parentArrangeBoxControlElement.reRenderLists('right')
    }
  };

  handleSortUpTopPress(side) {
    let sideList;
    let activeItems;
    if (side === 'left') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list');
      activeItems = this.parentArrangeBoxControlElement.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list-active');
      activeItems = this.parentArrangeBoxControlElement.activeItemsRight;
    };
    if (activeItems.length != 0) {
      if (activeItems.includes(sideList.firstChild) === false) {
        this.sortActiveItems(sideList, activeItems)
          .reverse()
          .forEach(current => {
            for (let child of sideList.children) {
              if (child === current) {
                sideList.insertBefore(child, sideList.firstChild)
                break
              }
            }  
        })
        sideList.scrollTop = 0
      }
    }
  };
  
  handleSortUpPress(side) {
    let sideList;
    let activeItems;
    if (side === 'left') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list');
      activeItems = this.parentArrangeBoxControlElement.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list-active');
      activeItems = this.parentArrangeBoxControlElement.activeItemsRight;
    }; 
    if (activeItems.length != 0) {
      if (activeItems.includes(sideList.firstChild) === false) {
        this.sortActiveItems(sideList, activeItems)
          .forEach(current => {
            for (let child of sideList.children) {
              if (child == current) {
                sideList.insertBefore(child, child.previousElementSibling)            
                break
              }
            }
        })
      }
    }
  };

  handleSortDownPress(side) {
    let sideList;
    let activeItems;
    if (side === 'left') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list');
      activeItems = this.parentArrangeBoxControlElement.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list-active');
      activeItems = this.parentArrangeBoxControlElement.activeItemsRight;
    };
    if (activeItems.length != 0) {
      if (activeItems.includes(sideList.lastChild) === false) {
        this.sortActiveItems(sideList, activeItems)
          .reverse()
          .forEach(current => { 
            for (let child of sideList.children) {
              if (child === current) {
                sideList.insertBefore(child, child.nextElementSibling.nextElementSibling)
                break
              }
            }
        })
      }
    }
  };

  handleSortDownBottomPress(side) {
    let sideList;
    let activeItems;
    if (side === 'left') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list');
      activeItems = this.parentArrangeBoxControlElement.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.parentArrangeBoxControlElement.shadow.getElementById('list-active');
      activeItems = this.parentArrangeBoxControlElement.activeItemsRight;
    };
    if (activeItems.length != 0) {
      if (activeItems.includes(sideList.lastChild) === false) {
        this.sortActiveItems(sideList, activeItems)
          .forEach((current) => {
            for (let child of sideList.children) {
              if (current == child) {
                sideList.appendChild(child)
                break
              }
            }
          })
        sideList.scrollTop = sideList.scrollHeight
      }
    }
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

  attributeChangedCallback(name, oldValue, newValue) {
    switch (this.dataset.buttonType) {
      case 'activate':
        this.button.addEventListener('click', this.handleActivatePress);
        break;
      case 'activateAll':
        this.button.addEventListener('click', this.handleActivateAllPress);
        break;
      case 'deactivate':
        this.button.addEventListener('click', this.handleDeactivatePress);
        break;
      case 'deactivateAll':
        this.button.addEventListener('click', this.handleDeactivateAllPress);
        break;
      case 'sortUpTop':
        this.button.addEventListener('click', () => this.handleSortUpTopPress('left'));
        break;
      case 'activeSortUpTop':
        this.button.addEventListener('click', () => this.handleSortUpTopPress('right'))
        break;
      case 'sortUp':
        this.button.addEventListener('click', () => this.handleSortUpPress('left'));
        break;
      case 'activeSortUp':
        this.button.addEventListener('click', () => this.handleSortUpPress('right'));
        break;
      case 'sortDown':
        this.button.addEventListener('click', () => this.handleSortDownPress('left'));
        break;
      case 'activeSortDown':
        this.button.addEventListener('click', () => this.handleSortDownPress('right'));
        break;
      case 'sortDownBottom':
        this.button.addEventListener('click', () => this.handleSortDownBottomPress('left'));
        break;
      case 'activeSortDownBottom':
        this.button.addEventListener('click', () => this.handleSortDownBottomPress('right'));
        break;    
    }  
  }
};