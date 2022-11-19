const app = {

init:()=> {
  console.log('Trello strated success !');
  app.trelloListeners(); 
},

trelloListeners:()=> {

  document.getElementById('create_row_btn').addEventListener('click', () => { 
    app.handleCreateColumn()
    app.dragAndDrop();
    app.handleDeleteRow();
  });

document.getElementById('create_card_btn').addEventListener('click', () => { 
    app.handleCreateCard()
    app.dragAndDrop();
    app.handleDeleteCard();
    app.countNewCard();
  });
},

handleDeleteRow:()=> {
  const buttons = document.querySelectorAll('.delete_row');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').remove();
    });
  });
},

handleDeleteCard:() => {
  const buttons = document.querySelectorAll('.delete_card');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').remove();
      app.countNewCard();
    });
  });
},

handleCreateColumn:() => {
  const row = app.createElement('div', 'cards_dropzone', '');
  row.appendChild(app.createInputElement('input', null, 'Column name'));
  app.appendElementToSelector(row,'.columns--container');
  const btn = app.createElement('button', 'delete_row', 'X');
  row.appendChild(btn);
},

handleCreateCard:() => {
  const card = app.createElement('div', 'draggable', null);
  card.setAttribute('draggable', 'true');
  card.appendChild(app.createElement('button', 'delete_card', 'X'));
  card.appendChild(app.setCardContent());
  app.appendElementToSelector(card,'.new--card--section');
},

setCardContent:() => {
  const cardContent = app.createElement('div', 'card_content', null);  
  cardContent.appendChild(app.createInputElement('input', null, 'Title'));
  cardContent.appendChild(app.createInputElement('textarea', null, 'Description'));
  return cardContent;
},

createElement:(tag, className, content) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerHTML = content;
  return element;
},

createInputElement:(inputType, className, placeHolder) => {
  const element = document.createElement(inputType);
  element.classList.add(className);
  element.placeholder = placeHolder;
  return element;
},

appendElementToSelector:(element, querySelector) => {
  const appendTo = document.querySelector(querySelector);
  appendTo.appendChild(element);
  return appendTo;
},

countNewCard:()=> {
  console.log('countNewCard');
  const newCard = document.querySelectorAll('.new--card--section');
  newCard.forEach(card => {
    const count = card.querySelectorAll('.draggable').length;
    console.log(count);
    card.querySelector('.card--count').innerHTML = `${count} New Cards`;
  });
},

dragAndDrop: ()=> {

  const draggables = document.querySelectorAll('.draggable');
  const columns = document.querySelectorAll('.cards_dropzone');


  draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
      app.countNewCard();
    });
        draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        app.countNewCard();
    });
  });

  columns.forEach(column => {
    
    column.addEventListener('dragover', (event) => {
      event.preventDefault();

      const afterElement = app.getDragAfterElement(column, event.clientY);
      const draggable = document.querySelector('.dragging');
        if(afterElement == null) {
          column.appendChild(draggable);
        } else {
            column.insertBefore(draggable, afterElement);
        }
      });
    }
  );
},

// y c'est la position de l'élment déplacé sur l'axe horizontal
// positionne l'élément déplacé au dessous ou au dessus du plus proche élément de la liste
getDragAfterElement:(column, y_position) => {

  const draggableElements = [...column.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y_position - box.top - box.height / 2;
      
    if(offset < 0 && offset > closest.offset) {
        return {
          offset: offset, 
          element: child
        };
      } else {
        return closest;
      }
  }, {offset: Number.NEGATIVE_INFINITY}).element;
},

};

document.addEventListener('DOMContentLoaded', app.init); 

