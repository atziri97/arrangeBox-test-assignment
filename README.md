<h1>ArrangeBox control</h1>
<p>Кастомный web компонент контрола ArrangeBox.
Перед созданием экзэмпляра:
  
```javascript
customElements.define('arrange-box', ArrangeBoxControl)
```
  
Потом добавляется как обычный HTML элемент. Пример:
```javascript
const arrangeBoxInstance = document.createElement('arrange-box');
document.getElementById('arrangebox-container').appendChild(arrangeBoxInstance);
arrangeBoxInstance.changeItems(itemList)
```
Контрол создается с пустыми списками, после создания используется метод <code>.changeItems(array)</code> для задания списков.
</p>
<h2>Методы</h2>
<code>.changeItems(list)</code> - Изменить список возможных значений, в качестве аргумента принимается массив со следущей структурой:

```javascript
[
  {
    id: '0',
    title: 'Заголовок объекта'
  }, ...
]
```
<code>.getCurrentState()</code> - Получить текущее значение контрола, возвращает текущие значения списков в виде объекта со следущей структурой:

```javascript
      {
        leftList: [
          {}, {}, ...
        ],
        rightList: [
          {}, {}, ...
        ]  
      };
```
<code>.resetToDefault()</code> - Сбросить контрол до началаьного состояния (будет установлен последний загруженный список).  
<code>.setSelectedItems(idsArray)</code> - Установить список выбранных значений, в качестве аргумента принимается массив с id объектов, которые нужно выбрать. Пример:

```javascript
[0, 1, 6, 12, ...];
```
