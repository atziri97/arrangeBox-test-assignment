class ArrangeBoxControl extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    //Сбросить списки до начального состояния
    function resetToDefault() {
      resetMainVars()
      let list1 = shadow.getElementById('list');
      let list2 = shadow.getElementById('list-active');
      while (list1.firstChild) {
        list1.removeChild(list1.lastChild)
      };
      while (list2.firstChild) {
        list2.removeChild(list2.lastChild)
      };
      items.forEach( current => {
        let element = document.createElement('li');
        element.textContent = current.title;
        element.id = `item-#${current.id}`
        list1
          .appendChild(element)
          .addEventListener('click', (e) => {
            handleClickItem(e)
          });
        displayedItems = [...displayedItems, element];
      }
      )  
    };

    //Установить список выбранных значений
    //обрабатывает массив с id желаемых объектов на примере exampleSelectedItems
    let exampleSelectedItems = [0, 6, 5, 12];

    function setSelectedItems(idsArray) {
      resetToDefault()
      if (shadow.getElementById('list').children.length != 0) {
        if (idsArray.map(current => {
          if (shadow.getElementById(`item-#${current}`) === null) {
            return false
          } else {
            return true
          }  
      }).includes(true)) {
        idsArray.forEach(current => {
          let currentObject = shadow.getElementById(`item-#${current}`)
          if (currentObject !== null) {
            activeItemsLeft = [...activeItemsLeft, currentObject]
            displayedItems = displayedItems.filter(current2 => current2 != currentObject);
            selectedItems = [...selectedItems, currentObject]
            latestSelectedItem = {}
          } else {
            console.log(`Объект с id ${current} отсутствует в списке`)
          }
          assignStyles()      
        });
        reRenderLists('left')
        } else {
          console.log('Не удалось установить список выбранных значений: нет совпадений id')
        }      
      }
    };

    //Получить текущее значение контрола
    //результат предоставляется в виде объекта currentState
    function getCurrentState() {
      let currentState =
        {
          leftList: [

          ],
          rightList: [

          ]  
        };
      if (shadow.getElementById('list').children != null) {
        for (let child of shadow.getElementById('list').children) {
          currentState.leftList = [...currentState.leftList, {
            id: child.id.split('#')[1],
            title: child.textContent
          }]
        }  
      }  ; 
      if (shadow.getElementById('list-active').children != null) {
        for (let child of shadow.getElementById('list-active').children) {
          currentState.rightList = [...currentState.rightList, {
            id: child.id.split('#')[1],
            title: child.textContent
          }]
        }  
      };    
      return currentState
    };

    //Изменение списка возможных значений
    //принимает массив с объектами на примере changeItemsExample, при создании объекта 
    let changeItemsExample = 
    [
      {id: 0, title: 'Пример значения #1'},
      {id: 1, title: 'Пример значения #2'},
      {id: 2, title: 'Пример значения #3'},
      {id: 3, title: 'Пример значения #4'},
    ]

    function changeItems(inputList) {
      items = inputList;
      resetToDefault();
    };

    //HTML разметка
    const shadow = this.attachShadow({ mode: "closed" });
    const styleSheetLink = document.createElement('link');
    styleSheetLink.setAttribute('rel', 'stylesheet');
    styleSheetLink.setAttribute('href', 'ArrangeBoxControl-styles.css')
    shadow.appendChild(styleSheetLink); 

    const arrangeBox = document.createElement('div');
    arrangeBox.id = 'arrange-box';
    shadow.appendChild(arrangeBox);

    const fieldWrap = document.createElement('div');
    fieldWrap.id = 'field-wrap';
    fieldWrap.className = 'field-wrap';
    shadow.getElementById('arrange-box').appendChild(fieldWrap);

    const buttonsActivateWrap = document.createElement('div');
    buttonsActivateWrap.id = 'buttons-activate-wrap';
    shadow.getElementById('arrange-box').appendChild(buttonsActivateWrap);

    const buttonActivate = document.createElement('button');
    const buttonActivateAll = document.createElement('button');
    const buttonDeactivate = document.createElement('button');
    const buttonDeactivateAll = document.createElement('button');
    buttonActivate.textContent = '>';
    buttonActivateAll.textContent = '>>';
    buttonDeactivate.textContent = '<';
    buttonDeactivateAll.textContent = '<<';
    shadow.getElementById('buttons-activate-wrap').appendChild(buttonActivate);
    shadow.getElementById('buttons-activate-wrap').appendChild(buttonActivateAll);
    shadow.getElementById('buttons-activate-wrap').appendChild(buttonDeactivate);
    shadow.getElementById('buttons-activate-wrap').appendChild(buttonDeactivateAll);

    const fieldActiveWrap = document.createElement('div');
    fieldActiveWrap.id = 'field-active-wrap';
    fieldActiveWrap.className = 'field-wrap';
    shadow.getElementById('arrange-box').appendChild(fieldActiveWrap);

    const titleActiveWrap = document.createElement('div');
    titleActiveWrap.id = 'title-active-wrap';
    titleActiveWrap.className = 'title-wrap';
    shadow.getElementById('field-active-wrap').appendChild(titleActiveWrap);

    const listActiveTitle = document.createElement('span');
    shadow.getElementById('title-active-wrap').appendChild(listActiveTitle);
    listActiveTitle.className = 'list-title';
    listActiveTitle.textContent = 'Список выбранных значений';

    const inputActiveFilter = document.createElement('input');
    inputActiveFilter.id = 'filter-active-name';
    shadow.getElementById('title-active-wrap').appendChild(inputActiveFilter);
    inputActiveFilter.setAttribute('placeholder', 'Поиск по имени')

    const listActiveWrap = document.createElement('div');
    listActiveWrap.id = 'list-active-wrap';
    listActiveWrap.className = 'list-wrap';
    shadow.getElementById('field-active-wrap').appendChild(listActiveWrap);

    const listActive = document.createElement('ul');
    listActive.className = 'list';
    listActive.id = 'list-active'
    shadow.getElementById('list-active-wrap').appendChild(listActive);

    const buttonsSortActiveWrap = document.createElement('div');
    buttonsSortActiveWrap.className = 'buttons-sort-wrap';
    buttonsSortActiveWrap.id = 'buttons-sort-active-wrap';
    shadow.getElementById('list-active-wrap').appendChild(buttonsSortActiveWrap);

    const buttonActiveSortUp = document.createElement('button');
    const buttonActiveSortUpTop = document.createElement('button');
    const buttonActiveSortDown = document.createElement('button');
    const buttonActiveSortDownBottom = document.createElement('button');
    buttonActiveSortUp.textContent = '^';
    buttonActiveSortUpTop.textContent = '^^';
    buttonActiveSortDown.textContent = 'v';
    buttonActiveSortDownBottom.textContent = 'vv';
    shadow.getElementById('buttons-sort-active-wrap').appendChild(buttonActiveSortUp);
    shadow.getElementById('buttons-sort-active-wrap').appendChild(buttonActiveSortUpTop);
    shadow.getElementById('buttons-sort-active-wrap').appendChild(buttonActiveSortDown);
    shadow.getElementById('buttons-sort-active-wrap').appendChild(buttonActiveSortDownBottom);

    const titleWrap = document.createElement('div');
    titleWrap.id = 'title-wrap';
    titleWrap.className = 'title-wrap';
    shadow.getElementById('field-wrap').appendChild(titleWrap);

    const listTitle = document.createElement('span');
    shadow.getElementById('title-wrap').appendChild(listTitle);
    listTitle.id = 'list-title';
    listTitle.className = 'list-title';
    listTitle.textContent = 'Список значений';

    const inputFilter = document.createElement('input');
    inputFilter.id = 'filter-name';
    shadow.getElementById('title-wrap').appendChild(inputFilter);
    inputFilter.setAttribute('placeholder', 'Поиск по имени')

    const listWrap = document.createElement('div');
    listWrap.id = 'list-wrap';
    listWrap.className = 'list-wrap';
    shadow.getElementById('field-wrap').appendChild(listWrap);

    const buttonsSortWrap = document.createElement('div');
    buttonsSortWrap.className = 'buttons-sort-wrap';
    buttonsSortWrap.id = 'buttons-sort-wrap';
    shadow.getElementById('list-wrap').appendChild(buttonsSortWrap);

    const list = document.createElement('ul');
    list.className = 'list';
    list.id = 'list'
    shadow.getElementById('list-wrap').appendChild(list);     

    const buttonSortUp = document.createElement('button');
    const buttonSortUpTop = document.createElement('button');
    const buttonSortDown = document.createElement('button');
    const buttonSortDownBottom = document.createElement('button');
    buttonSortUp.textContent = '^';
    buttonSortUpTop.textContent = '^^';
    buttonSortDown.textContent = 'v';
    buttonSortDownBottom.textContent = 'vv';
    shadow.getElementById('buttons-sort-wrap').appendChild(buttonSortUp);
    shadow.getElementById('buttons-sort-wrap').appendChild(buttonSortUpTop);
    shadow.getElementById('buttons-sort-wrap').appendChild(buttonSortDown);
    shadow.getElementById('buttons-sort-wrap').appendChild(buttonSortDownBottom);

    let items = [];
    let displayedItems = [];
    let selectedItems = [];    
    let activeItemsLeft = [];
    let activeItemsRight = [];
    let excludeItemsBySearchLeft = [];
    let excludeItemsBySearchRight = [];
    let latestSelectedItem = {};

    function resetMainVars() {
      displayedItems = [];
      selectedItems = [];
      activeItemsLeft = [];
      activeItemsRight = [];
      excludeItemsBySearchLeft = [];
      excludeItemsBySearchRight = [];
      latestSelectedItem = {};
      inputFilter.value = '';
      inputActiveFilter.value = '';
    }

    //При создании ArrangeBox'а создать и установить список с 15 рандомными значениями
    changeItems(generateRandomItems(15))

    function generateRandomItems(itemCount) {
      let newItemCount
      function generateRandomUniqueNumbers() {
        let numbersArray = [];   
        if (itemCount > 100) {
          newItemCount = 100
        } else {
          newItemCount = itemCount
        };
        while (numbersArray.length < newItemCount) {
          let generatedNumber = Math.floor(Math.random() * 100) + 1;
          if (numbersArray.indexOf(generatedNumber) === -1) {
            numbersArray.push(generatedNumber)
          }
        }
        return numbersArray
      };
      let randomNumbers = generateRandomUniqueNumbers();
      items = [];
      items.length = newItemCount;
      return items
        .fill({})
        .map((current, index) => {return {
          title: `Значение #${randomNumbers[index]}`,
          id: index
          }}
        )     
    };

    function assignStyles() {
      for (let child of shadow.getElementById('list').children) {  
        if (latestSelectedItem == child) {
          child.className = 'item-active-latest'
        } else if (activeItemsLeft.includes(child) === true) {
          child.className = 'item-active'
        } else {
          child.className = ''
        }
        if (excludeItemsBySearchLeft.includes(child) === true) {
          child.className = 'hide-item'
        }    
      };
      for (let child of shadow.getElementById('list-active').children) {  
        if (latestSelectedItem == child) {
          child.className = 'item-active-latest'
        } else if (activeItemsRight.includes(child) === true) {
          child.className = 'item-active'
        } else {
          child.className = ''
        }
        if (excludeItemsBySearchRight.includes(child) === true) {
          child.className = 'hide-item'
        }    
      };
    }

    function handleClickItem(e) {
      if (e.target.parentElement == shadow.getElementById('list')) {
        if (activeItemsLeft.includes(e.target) === false) {
          activeItemsLeft = [...activeItemsLeft, e.target];
          latestSelectedItem = e.target;
          assignStyles()
        } else {
          activeItemsLeft = activeItemsLeft.filter(current => current != e.target);
          latestSelectedItem = {};
          assignStyles()  
        }  
      } else if (e.target.parentElement == shadow.getElementById('list-active')) {
        if (activeItemsRight.includes(e.target) === false) {
          activeItemsRight = [...activeItemsRight, e.target];
          latestSelectedItem = e.target;
          assignStyles()
        } else {
          activeItemsRight = activeItemsRight.filter(current => current != e.target);
          latestSelectedItem = {};  
          assignStyles()
        }
      }
      
    };

    function reRenderLists(side) {
      for (let child of shadow.getElementById('list').children) {
        if (displayedItems.includes(child) === false) {
          child.remove()
        }
      };
      for (let child of shadow.getElementById('list-active').children) {
        if (selectedItems.includes(child) === false) {
          child.remove()   
        }
      };
      if (side == 'left') {
        activeItemsLeft.forEach(current => {
          shadow.getElementById('list-active').insertBefore(current, shadow.getElementById('list-active').firstChild)
          activeItemsLeft = [];
          assignStyles();
        });
      } else if (side == 'right') {
        activeItemsRight.forEach(current => {
          shadow.getElementById('list').insertBefore(current, shadow.getElementById('list').firstChild)
          activeItemsRight = [];
          assignStyles();       
      });
      }  
    };

    buttonActivate.addEventListener('click', handleActivatePress);

    function handleActivatePress() {
      if (activeItemsLeft.length != 0) {
        activeItemsLeft.forEach(current => {
          displayedItems = displayedItems.filter(current2 => current2 != current);
          selectedItems = [...selectedItems, current]
          latestSelectedItem = {}
          assignStyles()        
        });
        reRenderLists('left')
      }
    };

    buttonActivateAll.addEventListener('click', handleActivateAllPress);

    function handleActivateAllPress() {
      if (shadow.getElementById('list').children.length != 0) {
          displayedItems = [];
          latestSelectedItem = {};
          activeItemsLeft = [];
          assignStyles()
        for (let child of shadow.getElementById('list').children) {
          selectedItems = [...selectedItems, child];
          activeItemsLeft = [...activeItemsLeft, child];
          assignStyles()       
        }
        reRenderLists('left')
      }
    };

    buttonDeactivate.addEventListener('click', handleDeactivatePress);

    function handleDeactivatePress() {
      if (activeItemsRight.length != 0) {
        activeItemsRight.forEach(current => {
            selectedItems = selectedItems.filter(current2 => current2 != current);
            displayedItems = [...displayedItems, current];
            latestSelectedItem = {};
            assignStyles()         
        });
        reRenderLists('right')
      }
    };

    buttonDeactivateAll.addEventListener('click', handleDeactivateAllPress);

    function handleDeactivateAllPress() {
      if (shadow.getElementById('list-active').children.length != 0) {
          selectedItems = [];
          latestSelectedItem = {};
          activeItemsRight = [];
          assignStyles()
        for (let child of shadow.getElementById('list-active').children) {
          displayedItems = [...displayedItems, child];
          activeItemsRight = [...activeItemsRight, child];
          assignStyles()       
        }
        reRenderLists('right')
      }
    };

    buttonSortUpTop.addEventListener('click', () => handleSortUpTopPress('left'))
    buttonActiveSortUpTop.addEventListener('click', () => handleSortUpTopPress('right'))

    function handleSortUpTopPress(side) {
      let sideList;
      let activeItems;
      if (side === 'left') {
        sideList = shadow.getElementById('list');
        activeItems = activeItemsLeft;
      } else if (side === 'right') {
        sideList = shadow.getElementById('list-active');
        activeItems = activeItemsRight;
      };
      if (activeItems.length != 0) {
        if (activeItems.includes(sideList.firstChild) === false) {
          activeItems.forEach(current => {
            for (let child of sideList.children) {
              if (child == current) {
                let insertionPlace = child.parentElement.children[0];
                child.remove();
                sideList.insertBefore(child, insertionPlace);
                break
              }
            }
          })
        }
      }
    };

    buttonSortUp.addEventListener('click', () => handleSortUpPress('left'));
    buttonActiveSortUp.addEventListener('click', () => handleSortUpPress('right'));

    function handleSortUpPress(side) {
      let sideList;
      let activeItems;
      if (side === 'left') {
        sideList = shadow.getElementById('list');
        activeItems = activeItemsLeft;
      } else if (side === 'right') {
        sideList = shadow.getElementById('list-active');
        activeItems = activeItemsRight;
      };
      if (activeItems.length != 0) {
        if (activeItems.includes(sideList.firstChild) === false) {
          activeItems.forEach(current => {
            for (let child of sideList.children) {
              if (child == current) {
                let insertionPlace = child.previousElementSibling;
                child.remove();
                sideList.insertBefore(child, insertionPlace);
                break
              }
            }
          })
        }
      }
    };

    buttonSortDown.addEventListener('click', () => handleSortDownPress('left'));
    buttonActiveSortDown.addEventListener('click', () => handleSortDownPress('right'));

    function handleSortDownPress(side) {
      let sideList;
      let activeItems;
      if (side === 'left') {
        sideList = shadow.getElementById('list');
        activeItems = activeItemsLeft;
      } else if (side === 'right') {
        sideList = shadow.getElementById('list-active');
        activeItems = activeItemsRight;
      };
      if (activeItems.length != 0) {
        if (activeItems.includes(sideList.lastChild) === false) {
          activeItems.forEach(current => {
            for (let child of sideList.children) {
              if (child == current) {
                let insertionPlace = child.nextElementSibling.nextSibling;
                child.remove();
                sideList.insertBefore(child, insertionPlace);
                break
              }
            }
          })
        }
      }
    };

    buttonSortDownBottom.addEventListener('click', () => handleSortDownBottomPress('left'))
    buttonActiveSortDownBottom.addEventListener('click', () => handleSortDownBottomPress('right'))

    function handleSortDownBottomPress(side) {
      let sideList;
      let activeItems;
      if (side === 'left') {
        sideList = shadow.getElementById('list');
        activeItems = activeItemsLeft;
      } else if (side === 'right') {
        sideList = shadow.getElementById('list-active');
        activeItems = activeItemsRight;
      };
      if (activeItems.length != 0) {
        if (activeItems.includes(sideList.lastChild) === false) {
          activeItems.forEach(current => {
            for (let child of sideList.children) {
              if (child == current) {        
                child.remove();
                sideList.appendChild(child);
                break
              }
            }
          })
        }
      }
    };

    function handleFilterByNameLeft(e) {  
      for (let child of shadow.getElementById('list').children) {
        const processInputRegExp = new RegExp(/[^А-Яа-яA-Za-z#0-9\s]/, 'g')
        if (processInputRegExp.test(e.target.value) === true) {
          e.target.value = e.target.value.replace(processInputRegExp, '')
        }
        let searchRegExp = new RegExp(`${e.target.value}`, 'gi');
        if (searchRegExp.test(child.textContent) === false) {
          excludeItemsBySearchLeft = [...excludeItemsBySearchLeft, child]
          assignStyles()
        } else {
          excludeItemsBySearchLeft = excludeItemsBySearchLeft.filter(current => current != child)
          assignStyles()
        }
      }
    };

    function handleFilterByNameRight(e) {
      for (let child of shadow.getElementById('list-active').children) {
        const processInputRegExp = new RegExp(/[^А-Яа-яA-Za-z#0-9\s]/, 'g')
        if (processInputRegExp.test(e.target.value) === true) {
          e.target.value = e.target.value.replace(processInputRegExp, '')
        }
        let searchRegExp = new RegExp(`${e.target.value}`, 'gi');
        if (searchRegExp.test(child.textContent) === false) {
          excludeItemsBySearchRight = [...excludeItemsBySearchRight, child]
          assignStyles()
        } else {
          excludeItemsBySearchRight = excludeItemsBySearchRight.filter(current => current != child)
          assignStyles()
        }
      }
    };
    
    inputFilter.addEventListener('input', handleFilterByNameLeft);
    inputActiveFilter.addEventListener('input', handleFilterByNameRight);

    //Кнопки для тестирования
    const testTools = document.createElement('div');
    testTools.id = 'test-tools';
    shadow.getElementById('arrange-box').appendChild(testTools);

    const testGetCurrentState = document.createElement('button');
    testGetCurrentState.textContent = 'Вывести текущее состояние контрола в консоль';
    testTools.appendChild(testGetCurrentState);
    testGetCurrentState.addEventListener('click', () => console.log(getCurrentState()))   

    const testSetSelectedItems = document.createElement('button');
    testSetSelectedItems.textContent = 'Задать список выбранных значений (прим. ids: 0, 6, 5, 12)';
    testTools.appendChild(testSetSelectedItems);
    testSetSelectedItems.addEventListener('click', () => setSelectedItems(exampleSelectedItems));

    const testResetToDefault = document.createElement('button');
    testResetToDefault.textContent = 'Сбросить списки до начального состояния';
    testTools.appendChild(testResetToDefault);
    testResetToDefault.addEventListener('click', resetToDefault);

    const testChangeItems = document.createElement('button');
    testChangeItems.textContent = 'Установить заранее заданный список возможных значений';
    testTools.appendChild(testChangeItems);
    testChangeItems.addEventListener('click', () => changeItems(changeItemsExample));

    let testInputValue;
    const testGenerateNewRandomItems = document.createElement('button');
    testGenerateNewRandomItems.textContent = 'Сгенерировать новый список рандомных значений';
    testTools.appendChild(testGenerateNewRandomItems);
    testGenerateNewRandomItems.addEventListener('click', () => changeItems(generateRandomItems(testInputValue)));
    const testGenerateNewRandomItemsInput = document.createElement('input');
    testGenerateNewRandomItems.appendChild(testGenerateNewRandomItemsInput);
    testGenerateNewRandomItemsInput.setAttribute('placeholder', 'Кол-во (макс. 100)');    
    testGenerateNewRandomItemsInput.addEventListener('input', testInput);

    function testInput(e) {
      testInputValue = e.target.value; 
    };
  }
};

customElements.define('arrange-box', ArrangeBoxControl);

const arrangeBoxInstance = document.createElement('arrange-box');
document.getElementById('arrangebox-container').appendChild(arrangeBoxInstance);


//Кнопка для тестирования - создание новых инстансов
const testAddInstance = document.createElement('button')
testAddInstance.textContent = 'Добавить новый ArrangeBox'
document.body.appendChild(testAddInstance);
testAddInstance.addEventListener('click', () => {document.getElementById('arrangebox-container').appendChild(document.createElement('arrange-box'));})

