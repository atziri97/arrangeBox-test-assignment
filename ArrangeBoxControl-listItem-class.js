export default class ArrangeBoxControlListItem extends HTMLElement {
  static observedAttributes = ['class']

  constructor() {
    super();
    this.styling = document.createElement('style');
    this.shadow = this.attachShadow({ mode: 'open' });
    this.text = '';
    this.li = document.createElement('li');
    this.draggableLi = document.createElement('li');
    this.mainDiv = document.createElement('div');
    this.parentArrangeBoxControlElement;
    this.posX = 0;
    this.posY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.handleClickItem = this.handleClickItem.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.moveElement = this.moveElement.bind(this);
    this.assingDraggableLiStyle = this.assingDraggableLiStyle.bind(this);
    this.listElement;
    this.oppositeListElement;
    this.movedUp = false;
    this.mouseHeldAndMoved = false;
  }

  handleClickItem() {
    if (this.parentElement == this.parentArrangeBoxControlElement.shadow.getElementById('list')) {
      if (this.parentArrangeBoxControlElement.activeItemsLeft.includes(this) === false) {
        this.parentArrangeBoxControlElement.activeItemsLeft = [...this.parentArrangeBoxControlElement.activeItemsLeft, this];
        this.parentArrangeBoxControlElement.latestSelectedItem = this;
        this.parentArrangeBoxControlElement.assignStyles()
      } else {
        this.parentArrangeBoxControlElement.activeItemsLeft = this.parentArrangeBoxControlElement.activeItemsLeft.filter(current => current != this);
        this.parentArrangeBoxControlElement.latestSelectedItem = {};
        this.parentArrangeBoxControlElement.assignStyles()  
      }  
    } else if (this.parentElement == this.parentArrangeBoxControlElement.shadow.getElementById('list-active')) {
      if (this.parentArrangeBoxControlElement.activeItemsRight.includes(this) === false) {
        this.parentArrangeBoxControlElement.activeItemsRight = [...this.parentArrangeBoxControlElement.activeItemsRight, this];
        this.parentArrangeBoxControlElement.latestSelectedItem = this;
        this.parentArrangeBoxControlElement.assignStyles()
      } else {
        this.parentArrangeBoxControlElement.activeItemsRight = this.parentArrangeBoxControlElement.activeItemsRight.filter(current => current != this);
        this.parentArrangeBoxControlElement.latestSelectedItem = {};  
        this.parentArrangeBoxControlElement.assignStyles()
      }
    }
  };

  assingDraggableLiStyle() {
    if (this.parentArrangeBoxControlElement.latestSelectedItem == this) {
      this.draggableLi.className = 'draggable-li item-active-latest'
    } else if (this.parentArrangeBoxControlElement.activeItemsLeft.includes(this)) {
      this.draggableLi.className = 'draggable-li item-active'  
    } else {
      this.draggableLi.className = 'draggable-li'
    };
  }

  mouseDown(e) {
    e.preventDefault();
    this.posX = e.clientX - this.li.offsetLeft;
    this.posY = e.clientY - (this.li.offsetTop - this.listElement.scrollTop);
    this.draggableLi.style.left = this.li.offsetLeft + 'px';
    this.draggableLi.style.top = (this.li.offsetTop - this.listElement.scrollTop) + 'px';   
    window.addEventListener('mousemove', this.moveElement, false);
    this.assingDraggableLiStyle();
    this.mainDiv.appendChild(this.draggableLi);
    this.li.className = 'item-shadowed';
    this.parentArrangeBoxControlElement.isDragging = true;
    window.addEventListener('scroll', this.mouseUp);
    this.mouseHeldAndMoved = false;
  };

  mouseUp() {
    window.removeEventListener('mousemove', this.moveElement, false);
    window.removeEventListener('scroll', this.mouseUp);
    this.draggableLi.remove();
    this.parentArrangeBoxControlElement.assignStyles();
    this.parentArrangeBoxControlElement.isDragging = false;
    if (this.mouseHeldAndMoved == false) {
      this.handleClickItem();
    };
    this.mouseHeldAndMoved = false;
  };

  dragListItemStateChange() {
    this.parentArrangeBoxControlElement.latestSelectedItem = {};
    if (this.listElement.id == 'list-active') {
      this.parentArrangeBoxControlElement.activeItemsLeft = this.parentArrangeBoxControlElement.activeItemsLeft.filter(current => current !== this);
      this.parentArrangeBoxControlElement.displayedItems == this.parentArrangeBoxControlElement.displayedItems.filter(current => current != this);
      this.parentArrangeBoxControlElement.selectedItems = [...this.parentArrangeBoxControlElement.selectedItems, this];
      /* this.parentArrangeBoxControlElement.reRenderLists('left'); */
    } else if (this.listElement.id == 'list') {
      this.parentArrangeBoxControlElement.activeItemsRight = this.parentArrangeBoxControlElement.activeItemsRight.filter(current => current !== this);
      this.parentArrangeBoxControlElement.selectedItems == this.parentArrangeBoxControlElement.selectedItems.filter(current => current != this);
      this.parentArrangeBoxControlElement.displayedItems = [...this.parentArrangeBoxControlElement.displayedItems, this];
      /* this.parentArrangeBoxControlElement.reRenderLists('right'); */
    }
  };

  moveElement(e) {
    this.mouseHeldAndMoved = true;
    this.mouseX = e.clientX - this.posX;
    this.mouseY = e.clientY - this.posY;    
    this.draggableLi.style.left = this.mouseX + 'px';
    this.draggableLi.style.top = this.mouseY + 'px';
    if (this.oppositeListElement.children.length == 0) {
      let getHoveringList = this.shadow.elementsFromPoint(e.clientX, e.clientY)
        .filter(current => current.nodeName == 'UL')[0];
      if (getHoveringList !== undefined &&
        getHoveringList == this.oppositeListElement) {
          this.oppositeListElement.appendChild(this);
          this.dragListItemStateChange();
      }
    }
    let getHoveringElement = this.shadow.elementsFromPoint(e.clientX, e.clientY)
      .filter(current => current.nodeName == 'ARRANGEBOXCONTROL-LIST-ITEM')[0];
    if (getHoveringElement !== undefined &&
      getHoveringElement !== this) {
        if (getHoveringElement !== this.parentArrangeBoxControlElement.hoveringElementWhileDragging) {
          this.parentArrangeBoxControlElement.hoveringElementWhileDragging = getHoveringElement;
        }
        if (this.movedUp == true &&
          getHoveringElement == this.parentArrangeBoxControlElement.hoveringElementWhileDragging &&
          getHoveringElement.parentElement == this.listElement) {    
            this.listElement.insertBefore(this, this.parentArrangeBoxControlElement.hoveringElementWhileDragging.nextSibling);
            this.assingDraggableLiStyle();
            this.movedUp = false;
        } else  if (this.movedUp == false &&
          getHoveringElement.parentElement == this.listElement) {
            this.listElement.insertBefore(this, this.parentArrangeBoxControlElement.hoveringElementWhileDragging);
            this.assingDraggableLiStyle();         
            this.movedUp = true;
        }
        if (getHoveringElement == this.parentArrangeBoxControlElement.hoveringElementWhileDragging &&
          getHoveringElement.parentElement !== this.listElement) {    
            this.oppositeListElement.insertBefore(this, this.parentArrangeBoxControlElement.hoveringElementWhileDragging);
            this.dragListItemStateChange();
            this.assingDraggableLiStyle();
        }
    }
  };

  connectedCallback() {
    const mainStyle = `
      li {
        padding: var(--main-padding);
        cursor: pointer;
        box-sizing: border-box;
        transition: background-color 0.1s;
        size: 100%;
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

      .item-shadowed {
        background-color: white;
        color: rgba(0, 0, 0, 0);
        box-sizing: border-box;
        size: 100%;
        box-shadow: inset 5px 5px 20px #bfbfbf;
      }
      
      .draggable-li {
        background-color: #f1f1f1;
        position: absolute;
        width: 300px;
        box-shadow: 10px 10px 30px #bfbfbf;
        border-radius: 4px;
      }
      

      .hide-item {
        display: none;
      }
    `;

    this.listElement = this.parentElement;
    if (this.listElement.id == 'list') {
      this.oppositeListElement = this.parentArrangeBoxControlElement.listActive;
    } else if (this.listElement.id == 'list-active') {
      this.oppositeListElement = this.parentArrangeBoxControlElement.list;
    }

    this.styling.textContent = mainStyle;
    
    this.shadow.appendChild(this.styling);
    this.li.textContent = this.text;

    this.draggableLi.textContent = this.text;

    this.shadow.appendChild(this.mainDiv);
    this.mainDiv.appendChild(this.li);

    this.li.addEventListener('mousedown', this.mouseDown, false);
    this.shadow.addEventListener('mouseup', this.mouseUp, false); 
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.li.className = newValue;
  }
}