const app = {

init:()=> {
  console.log('Trello start success !');
  app.trelloListeners(); 

  // * POUR API CALL IL QUE TOUT SOIT DISPO EN EN DEHORS DES LISTENERS
  app.handleDragAndDrop();
  app.handleDeleteCard();
  app.handleCountBackLogCards();
  app.handleChangeCardColor();
  app.handleToggleEnableCheckBoxOnEmptyCard();
  app.handleTaskDone();
  app.handleNewCardSetNumber();
  app.handleDisableDragOnInputS();
},

//TODO désactiver le changement de couleur si la carte est DONE
//TODO vérouille les inputs si la carte est déjà DONE au chargement de la page voir dans handleTaskDone

trelloListeners:()=> {

  document.getElementById('create_column_btn').addEventListener('click', () => { 
      app.handleCreateColumn()
      app.handleDragAndDrop();
      app.handleDeleteColumn();
      app.handleNewColumnSetNumber();
      app.handleGetColumnName();
  });

  document.getElementById('create_card_btn').addEventListener('click', () => { 
      app.handleCreateCard()
      app.handleDragAndDrop();
      app.handleDeleteCard();
      app.handleCountBackLogCards();
      app.handleChangeCardColor();
      app.handleToggleEnableCheckBoxOnEmptyCard();
      app.handleTaskDone();
      app.handleNewCardSetNumber();
      app.handleDisableDragOnInputS();
    });

  document.getElementById('fullscreen_switch').addEventListener('change', (event) => {
      app.toggleFullScreenMode(event);
  });
},

handleDisableDragOnInputS:()=> {
  const inputs = document.querySelectorAll('.card--title, .card--text');
  const cards = document.querySelectorAll('.draggable--card');
  const columns = document.querySelectorAll('.draggable--column, .new--card--section');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
            cards.forEach(card => {
                card.setAttribute('draggable', 'false');
            });
            columns.forEach(column => {
                column.setAttribute('draggable', 'false');
            });
        });
        input.addEventListener('blur', () => {
          cards.forEach(card => {
            card.setAttribute('draggable', 'true');
          });
          columns.forEach(column => {
            column.setAttribute('draggable', 'true');
        });
      });
  });
},

handleDeleteColumn:()=> {
  const buttons = document.querySelectorAll('.delete_column');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').remove();
      app.handleNewColumnSetNumber();
    });
  });
},

handleDeleteCard:() => {
  const buttons = document.querySelectorAll('.delete_card');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').remove();
      app.handleCountBackLogCards();
      app.updateAllCardsNumberAndColumnName();
    });
  });
},

handleCreateColumn:() => {
  const column = app.createElement('div', 'cards_dropzone', '');
  column.appendChild(app.createInputElement('input','input', 'input_column_name', 'input--column--name', 'todo'));
  app.appendElementToSelector(column,'.columns--container');
  const btn = app.createElement('button', 'delete_column', 'X');
  column.appendChild(btn);
},

handleCreateCard:() => {
  const card = app.createElement('div', 'draggable--card', null);
  card.setAttribute('draggable', 'true');
  card.setAttribute('column_number', '0');
  card.appendChild(app.headerCardColors());
  card.appendChild(app.createElement('button', 'delete_card', 'X'));
  card.appendChild(app.createElement('span', 'card--number', 'N°'));
  card.appendChild(app.setCardContent());
  app.appendElementToSelector(card,'.new--card--section');
},

handleTaskDone:() => {
  console.log('handleTaskDone');
  const checkboxes = document.querySelectorAll('.card--checkox');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      
      if (event.target.checked) 
      {
        event.target.closest('div').classList.add('task--done');
        event.target.closest('div').setAttribute('task_done', 'true');
        const inputs = event.target.closest('section').querySelectorAll('.card--text, .card--title');
        inputs.forEach(input => {
          input.setAttribute('disabled', true);
          input.disabled = true;
        });
      } else {
        event.target.closest('div').classList.remove('task--done');
        const inputs = event.target.closest('section').querySelectorAll('.card--text, .card--title');
        inputs.forEach(input => {
          input.removeAttribute('disabled', true);
          input.disabled = false;
        });
      }
    });
  });
},

handleToggleEnableCheckBoxOnEmptyCard:() => {
  const cards = document.querySelectorAll('.draggable--card');
  cards.forEach(card => {
    const inputs = card.querySelectorAll('.card--text, .card--title');

      inputs.forEach(input => {
        if(input.value === '') {
            card.querySelector('.card--checkox').setAttribute('disabled', true);
        } else {
            card.querySelector('.card--checkox').removeAttribute('disabled', true);
        }
      });

      inputs.forEach(input => {
        input.addEventListener('input', (event) => {
          if(event.target.value === '') {
            card.querySelector('.card--checkox').setAttribute('disabled', true);
          } else {
            card.querySelector('.card--checkox').removeAttribute('disabled', true);
          }
        }
      );
    });
  });
},

setCardContent:() => {
  const cardContent = app.createElement('section', 'card--content', ''); 
  cardContent.appendChild(app.createInputElement('input', 'text', 'task_title',  'card--title', 'Title'));
  cardContent.appendChild(app.createInputElement('textarea', '', 'task_content', 'card--text', 'Description'));
  cardContent.appendChild(app.createInputElement('input', 'checkbox', 'task_status', 'card--checkox', ''));
  
  return cardContent;
},

headerCardColors:() => {
  section = app.createElement('section', 'card--colors', null);
  section.appendChild(app.createInputElement('button', 'submit', 'color_button', 'card--color--default' ,''));
  section.appendChild(app.createInputElement('button', 'submit', 'color_button', 'card--color--red' ,''));
  section.appendChild(app.createInputElement('button', 'submit', 'color_button', 'card--color--orange' ,''));
  section.appendChild(app.createInputElement('button', 'submit', 'color_button', 'card--color--blue' ,''));
  
  return section;
},

handleChangeCardColor:() => {
    document.getElementsByName('color_button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').classList = '';
      event.target.closest('div').classList.add('draggable--card');    
      event.target.closest('div').classList.add(event.target.className);
      event.target.closest('div').setAttribute('card_color', event.target.className);
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

handleNewColumnSetNumber:() => {
  const columns = document.querySelector('.columns--container');
  for(let i = 0; i < columns.children.length; i++) {
    columns.children[i].setAttribute('column_number', i + 1);
  }
},

handleNewCardSetNumber:() => {
  console.log('handleNewCardSetNumber');
  const draggables = document.querySelectorAll('.draggable--card');  
  for(let i = 0; i < draggables.length; i++) {
    if (draggables[i].parentElement.classList.contains('new--card--section')) {
      draggables[i].setAttribute('card_number', i + 1);
      draggables[i].querySelector('.card--number').innerText = `Backlog Card - N° ${draggables[i].getAttribute('card_number')}`;
    }
  }
},

handleGetColumnName:() => {
  const columns = document.querySelectorAll('.input--column--name');
  columns.forEach(column => {
    column.addEventListener('input', (event) => {
      event.target.closest('div').setAttribute('placeholder', event.target.value);
      app.updateAllCardsNumberAndColumnName();
    });
  });
},

updateAllCardsNumberAndColumnName:() => {
  const columns = document.querySelectorAll('.cards_dropzone');
  columns.forEach(column => {
    const cards = column.querySelectorAll('.draggable--card');
    for(let i = 0; i < cards.length; i++) {
      cards[i].setAttribute('card_number', i + 1);
      cards[i].setAttribute('column_number', column.getAttribute('column_number'));
      
      if(cards[i].parentElement.classList.contains('new--card--section')){
        cards[i].querySelector('.card--number').innerText = `Backlog Card - N° ${cards[i].getAttribute('card_number')}`;
      } else {
        cards[i].parentElement.firstChild.value != '' ? cards[i].querySelector('.card--number').innerText = 
          `${cards[i].parentElement.firstChild.value} - Card N° ${cards[i].getAttribute('card_number')}` : 
        cards[i].querySelector('.card--number').innerText = 
          `${cards[i].parentElement.firstChild.getAttribute('placeholder')} - Card N° ${cards[i].getAttribute('card_number')}`
      }
    }
  });
},

handleCountBackLogCards:()=> {
  const newCard = document.querySelectorAll('.new--card--section');
  newCard.forEach(card => {
    const count = card.querySelectorAll('.draggable--card').length;
    count > 1 ? card.querySelector('.card--count').innerHTML = `${count} CARDS IN BACKLOG` : card.querySelector('.card--count').innerHTML = `${count} CARD IN BACKLOG`;
  });
},

handleDragAndDrop: ()=> {
  
  console.log('handleDragAndDrop');
  const draggables = document.querySelectorAll('.draggable--card');
  const columns = document.querySelectorAll('.cards_dropzone');
  
  draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (event) => {
        event.target.classList.add('dragging');
        app.handleCountBackLogCards();
    });
        draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        app.handleCountBackLogCards();
        app.updateAllCardsNumberAndColumnName();
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

};

document.addEventListener('DOMContentLoaded', app.init); 


