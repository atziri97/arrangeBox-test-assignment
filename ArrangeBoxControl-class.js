import ArrangeBoxControlButton from "./ArrangeBoxControl-button-class.js";
import ArrangeBoxControlListItem from "./ArrangeBoxControl-listItem-class.js";
import ArrangeBoxControlTextFilterClass from "./ArrangeBoxControl-text-filter-class.js";

customElements.define('arrangeboxcontrol-list-item', ArrangeBoxControlListItem);
customElements.define('arrangeboxcontrol-button', ArrangeBoxControlButton);
customElements.define('arrangeboxcontrol-text-filter', ArrangeBoxControlTextFilterClass);

export default class ArrangeBoxControl extends HTMLElement {
  constructor() {
    super();
    
    this.shadow = this.attachShadow({ mode: "open" });

    this.buttonActivate = document.createElement('arrangeboxcontrol-button');
    this.buttonActivateAll = document.createElement('arrangeboxcontrol-button');
    this.buttonDeactivate = document.createElement('arrangeboxcontrol-button');
    this.buttonDeactivateAll = document.createElement('arrangeboxcontrol-button');

    this.buttonSortUp = document.createElement('arrangeboxcontrol-button');
    this.buttonSortUpTop = document.createElement('arrangeboxcontrol-button');
    this.buttonSortDown = document.createElement('arrangeboxcontrol-button');
    this.buttonSortDownBottom = document.createElement('arrangeboxcontrol-button');

    this.buttonActiveSortUp = document.createElement('arrangeboxcontrol-button');
    this.buttonActiveSortUpTop = document.createElement('arrangeboxcontrol-button');
    this.buttonActiveSortDown = document.createElement('arrangeboxcontrol-button');
    this.buttonActiveSortDownBottom = document.createElement('arrangeboxcontrol-button');

    this.inputFilter = document.createElement('arrangeboxcontrol-text-filter')      
    this.inputActiveFilter = document.createElement('arrangeboxcontrol-text-filter')

    this.list
    this.listActive

    this.items = [];
    this.displayedItems = [];
    this.selectedItems = [];    
    this.activeItemsLeft = [];
    this.activeItemsRight = [];
    this.excludeItemsBySearchLeft = [];
    this.excludeItemsBySearchRight = [];
    this.latestSelectedItem = {};
    this.isDragging = false;
    this.hoveringElementWhileDragging = {};
  };

  #resetMainVars() {
    this.displayedItems = [];
    this.selectedItems = [];
    this.activeItemsLeft = [];
    this.activeItemsRight = [];
    this.excludeItemsBySearchLeft = [];
    this.excludeItemsBySearchRight = [];
    this.latestSelectedItem = {};
    this.inputFilter.value = '';
    this.inputActiveFilter.value = '';
  }

  //Сбросить списки до начального состояния
  resetToDefault() {
    this.#resetMainVars()
    let list1 = this.shadow.getElementById('list');
    let list2 = this.shadow.getElementById('list-active');
    while (list1.firstChild) {
      list1.removeChild(list1.lastChild)
    };
    while (list2.firstChild) {
      list2.removeChild(list2.lastChild)
    };
    this.items.forEach(current => {
      let element = document.createElement('arrangeboxcontrol-list-item');
      element.text = current.title;
      element.id = `item-#${current.id}`;
      element.parentArrangeBoxControlElement = this;
      list1
        .appendChild(element)
      this.displayedItems = [...this.displayedItems, element];
    }
    )  
  };

  //Изменить список возможных значений
  changeItems(inputList) {
    this.items = inputList;
    this.resetToDefault();
  };

  //Получить текущее значение контрола
  //результат предоставляется в виде объекта currentState
  getCurrentState() {
    let currentState =
      {
        leftList: [

        ],
        rightList: [

        ]  
      };
    if (this.shadow.getElementById('list').children != null) {
      for (let child of this.shadow.getElementById('list').children) {
        currentState.leftList = [...currentState.leftList, {
          id: child.id.split('#')[1],
          title: child.textContent
        }]
      }  
    }  ; 
    if (this.shadow.getElementById('list-active').children != null) {
      for (let child of this.shadow.getElementById('list-active').children) {
        currentState.rightList = [...currentState.rightList, {
          id: child.id.split('#')[1],
          title: child.textContent
        }]
      }  
    };    
    return currentState
  };

  //Установить список выбранных значений
  //обрабатывает массив с id желаемых объектов
  setSelectedItems(idsArray) {
    this.resetToDefault()
    if (this.shadow.getElementById('list').children.length != 0) {
      if (idsArray.map(current => {
        if (this.shadow.getElementById(`item-#${current}`) === null) {
          return false
        } else {
          return true
        }  
    }).includes(true)) {
      idsArray.forEach(current => {
        let currentObject = this.shadow.getElementById(`item-#${current}`)
        if (currentObject !== null) {
          this.activeItemsLeft = [...this.activeItemsLeft, currentObject]
          this.displayedItems = this.displayedItems.filter(current2 => current2 != currentObject);
          this.selectedItems = [...this.selectedItems, currentObject]
          this.latestSelectedItem = {}
        } else {
          console.log(`Объект с id ${current} отсутствует в списке`)
        }
        this.assignStyles()      
      });
      this.reRenderLists('left')
      } else {
        console.log('Не удалось установить список выбранных значений: нет совпадений id')
      }      
    }
  };

  //HTML разметка
  #createHTML() {    
    const styleSheetLink = document.createElement('link');
    styleSheetLink.setAttribute('rel', 'stylesheet');
    styleSheetLink.setAttribute('href', 'ArrangeBoxControl-styles.css');
    this.shadow.appendChild(styleSheetLink);

    this.#createMainHTMLLayout();
    this.#createActivateButtons();
    this.#createLeftList();
    this.#createLeftListSortButtons();
    this.#createRightList();
    this.#createRightListSortButtons();
  };

  #createMainHTMLLayout() {
    const arrangeBox = document.createElement('div');
    arrangeBox.id = 'arrange-box';
    this.shadow.appendChild(arrangeBox);

    const fieldWrap = document.createElement('div');
    fieldWrap.id = 'field-wrap';
    fieldWrap.className = 'field-wrap';
    this.shadow.getElementById('arrange-box').appendChild(fieldWrap);
  };

  #createActivateButtons() {
    const buttonsActivateWrap = document.createElement('div');
    buttonsActivateWrap.id = 'buttons-activate-wrap';
    this.shadow.getElementById('arrange-box').appendChild(buttonsActivateWrap);
    this.buttonActivate.text = '>';
    this.buttonActivateAll.text = '>>';
    this.buttonDeactivate.text = '<';
    this.buttonDeactivateAll.text = '<<';
    buttonsActivateWrap.appendChild(this.buttonActivate);
    buttonsActivateWrap.appendChild(this.buttonActivateAll);
    buttonsActivateWrap.appendChild(this.buttonDeactivate);
    buttonsActivateWrap.appendChild(this.buttonDeactivateAll);
  };

  #createLeftList() {
    const titleWrap = document.createElement('div');
    titleWrap.id = 'title-wrap';
    titleWrap.className = 'title-wrap';
    this.shadow.getElementById('field-wrap').appendChild(titleWrap);

    const listTitle = document.createElement('span');
    titleWrap.appendChild(listTitle);
    listTitle.id = 'list-title';
    listTitle.className = 'list-title';
    listTitle.textContent = 'Список значений';

    this.inputFilter.id = 'filter-name';
    titleWrap.appendChild(this.inputFilter);
    this.inputFilter.setAttribute('placeholder', 'Поиск по имени')

    const listWrap = document.createElement('div');
    listWrap.id = 'list-wrap';
    listWrap.className = 'list-wrap';
    this.shadow.getElementById('field-wrap').appendChild(listWrap);
    
    const list = document.createElement('ul');
    list.className = 'list';
    list.id = 'list';
    listWrap.appendChild(list);
    this.list = list;     
  };
  
  #createLeftListSortButtons() {
    const buttonsSortWrap = document.createElement('div');
    buttonsSortWrap.className = 'buttons-sort-wrap';
    buttonsSortWrap.id = 'buttons-sort-wrap';
    this.shadow.getElementById('list-wrap').appendChild(buttonsSortWrap);
    this.buttonSortUp.text = '^';
    this.buttonSortUpTop.text = '^^';
    this.buttonSortDown.text = 'v';
    this.buttonSortDownBottom.text = 'vv';
    buttonsSortWrap.appendChild(this.buttonSortUp);
    buttonsSortWrap.appendChild(this.buttonSortUpTop);
    buttonsSortWrap.appendChild(this.buttonSortDown);
    buttonsSortWrap.appendChild(this.buttonSortDownBottom);
  };

  #createRightList() {
    const fieldActiveWrap = document.createElement('div');
    fieldActiveWrap.id = 'field-active-wrap';
    fieldActiveWrap.className = 'field-wrap';
    this.shadow.getElementById('arrange-box').appendChild(fieldActiveWrap);

    const titleActiveWrap = document.createElement('div');
    titleActiveWrap.id = 'title-active-wrap';
    titleActiveWrap.className = 'title-wrap';
    fieldActiveWrap.appendChild(titleActiveWrap);

    const listActiveTitle = document.createElement('span');
    titleActiveWrap.appendChild(listActiveTitle);
    listActiveTitle.className = 'list-title';
    listActiveTitle.textContent = 'Список выбранных значений';

    this.inputActiveFilter.id = 'filter-active-name';
    titleActiveWrap.appendChild(this.inputActiveFilter);
    this.inputActiveFilter.setAttribute('placeholder', 'Поиск по имени')

    const listActiveWrap = document.createElement('div');
    listActiveWrap.id = 'list-active-wrap';
    listActiveWrap.className = 'list-wrap';
    fieldActiveWrap.appendChild(listActiveWrap);

    const listActive = document.createElement('ul');
    listActive.className = 'list';
    listActive.id = 'list-active'
    listActiveWrap.appendChild(listActive);
    this.listActive = listActive;    
  };

  #createRightListSortButtons() {
    const buttonsSortActiveWrap = document.createElement('div');
    buttonsSortActiveWrap.className = 'buttons-sort-wrap';
    buttonsSortActiveWrap.id = 'buttons-sort-active-wrap';
    this.shadow.getElementById('list-active-wrap').appendChild(buttonsSortActiveWrap);
    this.buttonActiveSortUp.text = '^';
    this.buttonActiveSortUpTop.text = '^^';
    this.buttonActiveSortDown.text = 'v';
    this.buttonActiveSortDownBottom.text = 'vv';
    buttonsSortActiveWrap.appendChild(this.buttonActiveSortUp);
    buttonsSortActiveWrap.appendChild(this.buttonActiveSortUpTop);
    buttonsSortActiveWrap.appendChild(this.buttonActiveSortDown);
    buttonsSortActiveWrap.appendChild(this.buttonActiveSortDownBottom);
  };

  assignStyles() {
    for (let child of this.shadow.getElementById('list').children) {  
      if (this.latestSelectedItem == child) {
        child.className = 'item-active-latest'
      } else if (this.activeItemsLeft.includes(child) === true) {
        child.className = 'item-active'
      } else {
        child.className = ''
      }
      if (this.excludeItemsBySearchLeft.includes(child) === true) {
        child.className = 'hide-item'
      }    
    };
    for (let child of this.shadow.getElementById('list-active').children) {  
      if (this.latestSelectedItem == child) {
        child.className = 'item-active-latest'
      } else if (this.activeItemsRight.includes(child) === true) {
        child.className = 'item-active'
      } else {
        child.className = ''
      }
      if (this.excludeItemsBySearchRight.includes(child) === true) {
        child.className = 'hide-item'
      }    
    };
  }

  reRenderLists(side) {
    for (let child of this.shadow.getElementById('list').children) {
      if (this.displayedItems.includes(child) === false) {
        child.remove()
      }
    };
    for (let child of this.shadow.getElementById('list-active').children) {
      if (this.selectedItems.includes(child) === false) {
        child.remove()   
      }
    };
    if (side == 'left') {
      this.activeItemsLeft.forEach(current => {
        this.shadow.getElementById('list-active').insertBefore(current, this.shadow.getElementById('list-active').firstChild)
        this.activeItemsLeft = [];
        this.assignStyles();
      });
    } else if (side == 'right') {
      this.activeItemsRight.forEach(current => {
        this.shadow.getElementById('list').insertBefore(current, this.shadow.getElementById('list').firstChild)
        this.activeItemsRight = [];
        this.assignStyles();       
    });
    }  
  };
    
  connectedCallback() {
    this.#createHTML();

    this.buttonActivate.parentArrangeBoxControlElement = this;
    this.buttonActivate.setAttribute('data-button-type', 'activate');
    this.buttonActivateAll.parentArrangeBoxControlElement = this;
    this.buttonActivateAll.setAttribute('data-button-type', 'activateAll');

    this.buttonDeactivate.parentArrangeBoxControlElement = this;
    this.buttonDeactivate.setAttribute('data-button-type', 'deactivate');
    this.buttonDeactivateAll.parentArrangeBoxControlElement = this;
    this.buttonDeactivateAll.setAttribute('data-button-type', 'deactivateAll');    

    this.buttonSortUpTop.parentArrangeBoxControlElement = this;
    this.buttonSortUpTop.setAttribute('data-button-type', 'sortUpTop');
    this.buttonActiveSortUpTop.parentArrangeBoxControlElement = this;
    this.buttonActiveSortUpTop.setAttribute('data-button-type', 'activeSortUpTop');

    this.buttonSortUp.parentArrangeBoxControlElement = this;
    this.buttonSortUp.setAttribute('data-button-type', 'sortUp');
    this.buttonActiveSortUp.parentArrangeBoxControlElement = this;
    this.buttonActiveSortUp.setAttribute('data-button-type', 'activeSortUp');

    this.buttonSortDown.parentArrangeBoxControlElement = this;
    this.buttonSortDown.setAttribute('data-button-type', 'sortDown');
    this.buttonActiveSortDown.parentArrangeBoxControlElement = this;
    this.buttonActiveSortDown.setAttribute('data-button-type', 'activeSortDown');

    this.buttonSortDownBottom.parentArrangeBoxControlElement = this;
    this.buttonSortDownBottom.setAttribute('data-button-type', 'sortDownBottom');
    this.buttonActiveSortDownBottom.parentArrangeBoxControlElement = this;
    this.buttonActiveSortDownBottom.setAttribute('data-button-type', 'activeSortDownBottom');

    this.inputFilter.parentArrangeBoxControlElement = this;
    this.inputFilter.setAttribute('data-filter-side', 'left');
    this.inputActiveFilter.parentArrangeBoxControlElement = this;
    this.inputActiveFilter.setAttribute('data-filter-side', 'right');


  }
};
