import ArrangeBoxControl from "./ArrangeBoxControl-class";

customElements.define('arrange-box', ArrangeBoxControl);

addNewArrangeBoxInstance()

//arrangeBoxInstance.changeItems(list) - изменить список возможных значений
//arrangeBoxInstance.getCurrentState() - получить текущее значение контрола
//arrangeBoxInstance.resetToDefault() - сбросить списки до начального состояния
//arrangeBoxInstance.setSelectedItems(idsArray) - установить список выбранных значений
//arrangeBoxInstance.generateRandomItems(itemCount) - сгенерировать список случайных значений

//Кнопки для тестирования
const testAddInstance = document.createElement('button');
testAddInstance.textContent = 'Добавить новый ArrangeBox';
document.body.appendChild(testAddInstance);
testAddInstance.id = 'test-add-instance';
testAddInstance.addEventListener('click', addNewArrangeBoxInstance);

function addNewArrangeBoxInstance() {
  const arrangeBoxInstance = document.createElement('arrange-box');
  document.getElementById('arrangebox-container').appendChild(arrangeBoxInstance);
  arrangeBoxInstance.changeItems(generateRandomItems(25))

  const testTools = document.createElement('div');
  testTools.id = 'test-tools';
  document.getElementById('arrangebox-container').appendChild(testTools);

  const testGetCurrentState = document.createElement('button');
  testGetCurrentState.textContent = 'Вывести текущее состояние контрола в консоль';
  testTools.appendChild(testGetCurrentState);
  testGetCurrentState.addEventListener('click', () => console.log(arrangeBoxInstance.getCurrentState()))   

  const testSetSelectedItems = document.createElement('button');
  testSetSelectedItems.textContent = 'Задать список выбранных значений (прим. ids: 0, 3, 8, 12)';
  testTools.appendChild(testSetSelectedItems);
  testSetSelectedItems.addEventListener('click', () => arrangeBoxInstance.setSelectedItems(exampleSelectedItems));

  const testResetToDefault = document.createElement('button');
  testResetToDefault.textContent = 'Сбросить списки до начального состояния';
  testTools.appendChild(testResetToDefault);
  testResetToDefault.addEventListener('click', () => arrangeBoxInstance.resetToDefault());

  const testChangeItems = document.createElement('button');
  testChangeItems.textContent = 'Установить заранее заданный список возможных значений';
  testTools.appendChild(testChangeItems);
  testChangeItems.addEventListener('click', () => arrangeBoxInstance.changeItems(changeItemsExample));

  let testInputValue;
  const testGenerateNewRandomItems = document.createElement('button');
  testGenerateNewRandomItems.textContent = 'Сгенерировать новый список рандомных значений';
  testTools.appendChild(testGenerateNewRandomItems);
  testGenerateNewRandomItems.addEventListener('click', () => {
    if (testInputValue) {arrangeBoxInstance.changeItems(generateRandomItems(testInputValue))
    } else {
      alert('Введите кол-во объектов в поле')
    }
});
  const testGenerateNewRandomItemsInput = document.createElement('input');
  testTools.appendChild(testGenerateNewRandomItemsInput);
  testGenerateNewRandomItemsInput.setAttribute('placeholder', 'Кол-во (макс. 100)');    
  testGenerateNewRandomItemsInput.addEventListener('input', (e) => {testInputValue = e.target.value;});
  window.scrollTo(0, document.body.scrollHeight);
};

//Функция для генерации списка случайных значений
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
  let items = [];
  items.length = newItemCount;
  return items
    .fill({})
    .map((current, index) => {return {
      title: `Значение #${randomNumbers[index]}`,
      id: index
      }}
    )     
};

//Заранее заданные массивы для тестирования методов контрола
let changeItemsExample = 
[
  {id: 0, title: 'Пример значения #1'},
  {id: 1, title: 'Пример значения #2'},
  {id: 2, title: 'Пример значения #3'},
  {id: 3, title: 'Пример значения #4'},
]

let exampleSelectedItems = [0, 3, 8, 12];