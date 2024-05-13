import ArrangeBoxControlButton from "./ArrangeBoxControl-button-class.js";

customElements.define('arrangeboxcontrol-button', ArrangeBoxControlButton);

export default class ArrangeBoxControl extends HTMLElement {
  constructor() {
    super();
    
    this.shadow = this.attachShadow({ mode: "closed" });

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

    this.inputFilter = document.createElement('input');
    this.inputActiveFilter = document.createElement('input');

    this.items = [];
    this.displayedItems = [];
    this.selectedItems = [];    
    this.activeItemsLeft = [];
    this.activeItemsRight = [];
    this.excludeItemsBySearchLeft = [];
    this.excludeItemsBySearchRight = [];
    this.latestSelectedItem = {};

    //для правильной работы 'this'
    this.handleActivatePress = this.handleActivatePress.bind(this);
    this.handleActivateAllPress = this.handleActivateAllPress.bind(this);
    this.handleDeactivatePress = this.handleDeactivatePress.bind(this);
    this.handleDeactivateAllPress = this.handleDeactivateAllPress.bind(this);

    this.handleFilterByNameLeft = this.handleFilterByNameLeft.bind(this);
    this.handleFilterByNameRight = this.handleFilterByNameRight.bind(this);
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
      let element = document.createElement('li');
      element.textContent = current.title;
      element.id = `item-#${current.id}`
      list1
        .appendChild(element)
        .addEventListener('click', (e) => {this.#handleClickItem(e)});
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
        this.#assignStyles()      
      });
      this.#reRenderLists('left')
      } else {
        console.log('Не удалось установить список выбранных значений: нет совпадений id')
      }      
    }
  };

  //HTML разметка
  #createHTML() {    
    const styleSheetLink = document.createElement('link');
    styleSheetLink.setAttribute('rel', 'stylesheet');
    styleSheetLink.setAttribute('href', 'ArrangeBoxControl-styles.css')
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

  #assignStyles() {
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

  #reRenderLists(side) {
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
        this.#assignStyles();
      });
    } else if (side == 'right') {
      this.activeItemsRight.forEach(current => {
        this.shadow.getElementById('list').insertBefore(current, this.shadow.getElementById('list').firstChild)
        this.activeItemsRight = [];
        this.#assignStyles();       
    });
    }  
  };

  //хэндлеры ивентов
  #handleClickItem(e) {
    if (e.target.parentElement == this.shadow.getElementById('list')) {
      if (this.activeItemsLeft.includes(e.target) === false) {
        this.activeItemsLeft = [...this.activeItemsLeft, e.target];
        this.latestSelectedItem = e.target;
        this.#assignStyles()
      } else {
        this.activeItemsLeft = this.activeItemsLeft.filter(current => current != e.target);
        this.latestSelectedItem = {};
        this.#assignStyles()  
      }  
    } else if (e.target.parentElement == this.shadow.getElementById('list-active')) {
      if (this.activeItemsRight.includes(e.target) === false) {
        this.activeItemsRight = [...this.activeItemsRight, e.target];
        this.latestSelectedItem = e.target;
        this.#assignStyles()
      } else {
        this.activeItemsRight = this.activeItemsRight.filter(current => current != e.target);
        this.latestSelectedItem = {};  
        this.#assignStyles()
      }
    }  
  };

  handleActivatePress() {
    if (this.activeItemsLeft.length != 0) {
      this.activeItemsLeft.forEach(current => {
        this.displayedItems = this.displayedItems.filter(current2 => current2 != current);
        this.selectedItems = [...this.selectedItems, current]
        this.latestSelectedItem = {}
        this.#assignStyles()        
      });
      this.#reRenderLists('left')
    }
  };

  handleActivateAllPress() {
    if (this.shadow.getElementById('list').children.length != 0) {
        this.displayedItems = [];
        this.latestSelectedItem = {};
        this.activeItemsLeft = [];
        this.#assignStyles()
      for (let child of this.shadow.getElementById('list').children) {
        this.selectedItems = [...this.selectedItems, child];
        this.activeItemsLeft = [...this.activeItemsLeft, child];
        this.#assignStyles()       
      }
      this.selectedItems = this.selectedItems.reverse()
      this.activeItemsLeft = this.activeItemsLeft.reverse()
      this.#reRenderLists('left')
    }
  };

  handleDeactivatePress() {
    if (this.activeItemsRight.length != 0) {
      this.activeItemsRight.forEach(current => {
          this.selectedItems = this.selectedItems.filter(current2 => current2 != current);
          this.displayedItems = [...this.displayedItems, current];
          this.latestSelectedItem = {};
          this.#assignStyles()         
      });
      this.#reRenderLists('right')
    }
  };

  handleDeactivateAllPress() {
    if (this.shadow.getElementById('list-active').children.length != 0) {
        this.selectedItems = [];
        this.latestSelectedItem = {};
        this.activeItemsRight = [];
        this.#assignStyles()
      for (let child of this.shadow.getElementById('list-active').children) {
        this.displayedItems = [...this.displayedItems, child];
        this.activeItemsRight = [...this.activeItemsRight, child];
        this.#assignStyles()       
      }
      this.displayedItems = this.displayedItems.reverse()
      this.activeItemsRight = this.activeItemsRight.reverse()
      this.#reRenderLists('right')
    }
  }; 

  sortActiveItems(list, activeItems) {
    let sortedActiveItems = [];
      for (let child of list.children) {
        if (activeItems.includes(child) === true) {
          sortedActiveItems = [...sortedActiveItems, child]
        }
      };
    return sortedActiveItems;
  }

  handleSortUpTopPress(side) {
    let sideList;
    let activeItems;
    if (side === 'left') {
      sideList = this.shadow.getElementById('list');
      activeItems = this.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.shadow.getElementById('list-active');
      activeItems = this.activeItemsRight;
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
      sideList = this.shadow.getElementById('list');
      activeItems = this.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.shadow.getElementById('list-active');
      activeItems = this.activeItemsRight;
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
      sideList = this.shadow.getElementById('list');
      activeItems = this.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.shadow.getElementById('list-active');
      activeItems = this.activeItemsRight;
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
      sideList = this.shadow.getElementById('list');
      activeItems = this.activeItemsLeft;
    } else if (side === 'right') {
      sideList = this.shadow.getElementById('list-active');
      activeItems = this.activeItemsRight;
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
  
  handleFilterByNameLeft(e) {  
    for (let child of this.shadow.getElementById('list').children) {
      const processInputRegExp = new RegExp(/[^А-Яа-яA-Za-z#0-9\s]/, 'g')
      if (processInputRegExp.test(e.target.value) === true) {
        e.target.value = e.target.value.replace(processInputRegExp, '')
      }
      let searchRegExp = new RegExp(`${e.target.value}`, 'gi');
      if (searchRegExp.test(child.textContent) === false) {
        this.excludeItemsBySearchLeft = [...this.excludeItemsBySearchLeft, child]
        this.#assignStyles()
      } else {
        this.excludeItemsBySearchLeft = this.excludeItemsBySearchLeft.filter(current => current != child)
        this.#assignStyles()
      }
    }
  };
  
  handleFilterByNameRight(e) {
    for (let child of this.shadow.getElementById('list-active').children) {
      const processInputRegExp = new RegExp(/[^А-Яа-яA-Za-z#0-9\s]/, 'g')
      if (processInputRegExp.test(e.target.value) === true) {
        e.target.value = e.target.value.replace(processInputRegExp, '')
      }
      let searchRegExp = new RegExp(`${e.target.value}`, 'gi');
      if (searchRegExp.test(child.textContent) === false) {
        this.excludeItemsBySearchRight = [...this.excludeItemsBySearchRight, child]
        this.#assignStyles()
      } else {
        this.excludeItemsBySearchRight = this.excludeItemsBySearchRight.filter(current => current != child)
        this.#assignStyles()
      }
    }
  };
    
  connectedCallback() {
    this.#createHTML();

    this.buttonActivate.addEventListener('click', this.handleActivatePress);
    this.buttonActivateAll.addEventListener('click', this.handleActivateAllPress);

    this.buttonDeactivate.addEventListener('click', this.handleDeactivatePress);
    this.buttonDeactivateAll.addEventListener('click', this.handleDeactivateAllPress);

    this.buttonSortUpTop.addEventListener('click', () => this.handleSortUpTopPress('left'))
    this.buttonActiveSortUpTop.addEventListener('click', () => this.handleSortUpTopPress('right'))

    this.buttonSortUp.addEventListener('click', () => this.handleSortUpPress('left'));
    this.buttonActiveSortUp.addEventListener('click', () => this.handleSortUpPress('right'));

    this.buttonSortDown.addEventListener('click', () => this.handleSortDownPress('left'));
    this.buttonActiveSortDown.addEventListener('click', () => this.handleSortDownPress('right'));

    this.buttonSortDownBottom.addEventListener('click', () => this.handleSortDownBottomPress('left'))
    this.buttonActiveSortDownBottom.addEventListener('click', () => this.handleSortDownBottomPress('right'))

    this.inputFilter.addEventListener('input', this.handleFilterByNameLeft);
    this.inputActiveFilter.addEventListener('input', this.handleFilterByNameRight);
  }
};
