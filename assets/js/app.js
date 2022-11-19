const app = {

init:()=> {
  console.log('Trello strated success !');
  app.trelloListeners(); 
},

trelloListeners:()=> {

  document.getElementById('create_column_btn').addEventListener('click', () => { 
      app.handleCreateColumn()
      app.handleDragAndDrop();
      app.handleDeleteColumn();
  });

  document.getElementById('create_card_btn').addEventListener('click', () => { 
      app.handleCreateCard()
      app.handleDragAndDrop();
      app.handleDeleteCard();
      app.handleCountNewCard();
      app.handleChangeCardColor();
      app.handleTaskDone();
    });

  document.getElementById('fullscreen_switch').addEventListener('change', (event) => {
    app.toggleFullScreenMode(event);
  });
},

handleDeleteColumn:()=> {
  const buttons = document.querySelectorAll('.delete_column');
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
      app.handleCountNewCard();
    });
  });
},

handleCreateColumn:() => {
  const column = app.createElement('div', 'cards_dropzone', '');
  column.appendChild(app.createInputElement('input','input', 'input--column--name', 'input--column--name', 'todo'));
  app.appendElementToSelector(column,'.columns--container');
  const btn = app.createElement('button', 'delete_column', 'X');
  column.appendChild(btn);
},

handleCreateCard:() => {
  const card = app.createElement('div', 'draggable--card', null);
  card.setAttribute('draggable', 'true');
  card.appendChild(app.headerCardColors());
  card.appendChild(app.createElement('button', 'delete_card', 'X'));
  card.appendChild(app.setCardContent());
  app.appendElementToSelector(card,'.new--card--section');
},

handleTaskDone:() => {
  const checkboxes = document.querySelectorAll('.card--checkox');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      
      if (event.target.checked) 
      {
        event.target.closest('div').classList.add('task--done');
        const inputs = event.target.closest('section').querySelectorAll('.card--text, .card--title');
        inputs.forEach(input => {
          input.setAttribute('disabled', true);
        });
      } else {
        event.target.closest('div').classList.remove('task--done');
        const inputs = event.target.closest('section').querySelectorAll('.card--text, .card--title');
        inputs.forEach(input => {
          input.removeAttribute('disabled', true);
        });
      }

    });
  });
},

setCardContent:() => {
  const cardContent = app.createElement('section', 'card_content', ''); 
  cardContent.appendChild(app.createInputElement('input', 'text', 'task_title',  'card--title', 'Title'));
  cardContent.appendChild(app.createInputElement('textarea', '', 'task_content', 'card--text', 'Description'));
  cardContent.appendChild(app.createInputElement('input', 'checkbox', 'task_status', 'card--checkox', ''));
  
  return cardContent;
},

headerCardColors:() => {
  section = app.createElement('section', 'card--colors', null);
  section.appendChild(app.createElement('button', 'card--color--default', null));
  section.appendChild(app.createElement('button', 'card--color--red', null));
  section.appendChild(app.createElement('button', 'card--color--orange', null));
  section.appendChild(app.createElement('button', 'card--color--blue', null));
  
  return section;
},

handleChangeCardColor:() => {
  document.querySelectorAll('.card--color--red, .card--color--orange, .card--color--blue, .card--color--default').forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').className = '';
      event.target.closest('div').classList.add('draggable--card');
      event.target.closest('div').classList.add(event.target.className);
    });
  });
},

createElement:(tag, className, textContent) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerHTML = textContent;
  return element;
},

createInputElement:(inputType, atribute, name, className, placeHolder) => {
  const element = document.createElement(inputType);
  element.setAttribute('type', atribute);
  element.setAttribute('name', name);
  element.classList.add(className);
  element.placeholder = placeHolder;
  return element;
},

appendElementToSelector:(element, querySelector) => {
  const appendTo = document.querySelector(querySelector);
  appendTo.appendChild(element);
  return appendTo;
},

handleCountNewCard:()=> {
  const newCard = document.querySelectorAll('.new--card--section');
  newCard.forEach(card => {
    const count = card.querySelectorAll('.draggable--card').length;
    count > 1 ? card.querySelector('.card--count').innerHTML = `${count} CARDS IN BACKLOG` : card.querySelector('.card--count').innerHTML = `${count} CARD IN BACKLOG`;
  });
},

handleDragAndDrop: ()=> {

  const draggables = document.querySelectorAll('.draggable--card');
  const columns = document.querySelectorAll('.cards_dropzone');

  draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', (event) => {
      event.target.classList.add('dragging');
      app.handleCountNewCard();
    });
        draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        app.handleCountNewCard();
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

toggleFullScreenMode:(event) => {
  
  const element = document.documentElement

  if(event.target.checked == true)
  {
    
    event.target.setAttribute('checked', 'true');
    setTimeout(() => {
    element.requestFullscreen();
    }, 500);
  } else {
    event.target.removeAttribute('checked');
    setTimeout(() => {
    document.exitFullscreen();
    }, 500); 
  }
},

// y c'est la position de l'élment déplacé sur l'axe horizontal
// positionne l'élément déplacé au dessous ou au dessus du plus proche élément de la liste
getDragAfterElement:(column, y_position) => {

  const draggableElements = [...column.querySelectorAll('.draggable--card:not(.dragging)')];

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

