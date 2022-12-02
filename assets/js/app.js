const app = {

init:()=> {
  console.log('Trello start success !');
  app.trelloListeners(); 
  //app.handleToggleTheme();
  // * POUR API CALL IL QUE TOUT SOIT DISPO EN EN DEHORS DES LISTENERS
},

//TODO gérer l'ordre d'appel des méthodes si il y a des cartes qui sont déjà crées par tpl.js ou par fetch c'est là que ça va démarrer....
//TODO voir comment récupérer le nom de la colonne dans la carte au chargement de la page

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
      app.handleDisableDragOnActiveInputs();
  });

  document.getElementById('fullscreen_switch').addEventListener('change', (event) => {
      app.toggleFullScreenMode(event);
  });

  document.querySelector('#dark_mode_switch').addEventListener('change', () => {
      app.handleToggleTheme();
  });

  window.addEventListener('load', () => {
      // app.handleCountBackLogCards();
      // app.handleChangeCardColor();
      // app.handleToggleEnableCheckBoxOnEmptyCard();
      // app.handleTaskDone();
      // app.handleOnLoadCheckIfTaskDone();
      // app.handleHideColorsBtnsOnDoneCards();
      // app.handleDeleteCard();
      // app.handleNewCardSetNumber();
      // app.handleDisableDragOnActiveInputs();      
  });
},

handleDisableDragOnActiveInputs:()=> {

  const inputs = document.querySelectorAll('.card--title, .card--text');
  const cards = document.querySelectorAll('.draggable--card');
  const columns = document.querySelectorAll('.draggable--column, .new--card--section');

  inputs.forEach(input => {
      input.classList.add('hidden');
});
  
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
  const buttons = document.querySelectorAll('.delete--column');

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
  const column = app.createElement('div', 'cards--dropzone', '');
  column.appendChild(app.createInputElement('input','input', 'input_column_name', 'input--column--name', 'todo'));
  app.appendElementToSelector(column,'.columns--container');
  const btn = app.createElement('button', 'delete--column', 'X');
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

handleOnLoadCheckIfTaskDone:()=> {
  document.querySelectorAll('.card--checkox').forEach(checkBox => {
      if (checkBox.checked) {
        checkBox.parentElement.querySelectorAll('.card--title, .card--text').forEach(input => {
          input.setAttribute('disabled', 'true');
          input.disabled = true;
        });
      };
  });
},

handleTaskDone:() => {
  document.querySelectorAll('.card--checkox').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      if (event.target.checked){ 
        // hide colors btns on check action
        app.handleHideColorsBtnsOnDoneCards();
        event.target.closest('div').classList.add('task--done');
        event.target.closest('div').setAttribute('task_done', 'true');

          event.target.closest('section').querySelectorAll('.card--text, .card--title').forEach(input => {
          input.setAttribute('disabled', true);
          input.disabled = true;
        });
      } else {
          event.target.closest('div').classList.remove('task--done');
          event.target.closest('section').querySelectorAll('.card--text, .card--title').forEach(input => {
          input.removeAttribute('disabled', true);
          input.disabled = false;
          });
          event.target.closest('div').querySelectorAll('[name=color_button]').forEach(btn => {
          btn.style.display = 'block';
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
  element.innerText = textContent;

  return element;
},

// inputType pour le type de l'input par exemple text, checkbox, submit, file etc...
// attribute pour préciser le type de l'input par exemple (submit)
createInputElement:(inputType, attribute, name, className, placeHolder) => {
  const element = document.createElement(inputType);
  element.setAttribute('type', attribute);
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
  console.log('handleGetColumnName');
  const columns = document.querySelectorAll('.input--column--name');

  columns.forEach(column => {
    column.addEventListener('input', (event) => {
      if(event.target.value === '') {
        event.target.placeholder = 'TODO';
        event.target.closest('div').setAttribute('column_name', event.target.placeholder)
      } else {
        event.target.closest('div').setAttribute('column_name', event.target.value)
      }
      app.updateAllCardsNumberAndColumnName();
    });
  });
},

updateAllCardsNumberAndColumnName:() => {
  console.log('updateAllCardsNumberAndColumnName');

  const columns = document.querySelectorAll('.cards--dropzone');
  columns.forEach(column => {
    
    const cards = column.querySelectorAll('.draggable--card');
 
    for(let i = 0; i < cards.length; i++) {
      cards[i].setAttribute('card_number', i + 1);
      cards[i].setAttribute('column_number', column.getAttribute('column_number'));
      
      if(cards[i].parentElement.classList.contains('new--card--section')) {
        cards[i].querySelector('.card--number').innerText = `Backlog Card - N° ${cards[i].getAttribute('card_number')}`;
      } else {
        // si ma colonne n'a pas d'attribute placeholder (nouvelles colonnes), je donne à son placeholder la valeur par défaut 'TODO'.
        'column', column.getAttribute('column_name') == null ? column.setAttribute('column_name', 'TODO') : true;
        cards[i].querySelector('.card--number').innerText = `${column.getAttribute('column_name')} Card - N° ${cards[i].getAttribute('card_number')}`;
      }
    }
  });
},

handleCountBackLogCards:()=> {
  const newCard = document.querySelectorAll('.new--card--section');
  newCard.forEach(card => {
    const count = card.querySelectorAll('.draggable--card').length;
    count > 1 ? card.querySelector('.card--count').innerText= `${count} CARDS IN BACKLOG` : card.querySelector('.card--count').innerText = `${count} CARD IN BACKLOG`;
  });
},

handleDragAndDrop: ()=> {
  
  console.log('handleDragAndDrop');
  const draggables = document.querySelectorAll('.draggable--card');
  const columns = document.querySelectorAll('.cards--dropzone');
  
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

handleHideColorsBtnsOnDoneCards:() => {
  const checkBox = document.querySelectorAll('input[type=checkbox]');

  checkBox.forEach(checkBox => {
  if (checkBox.checked) {
    const colorBtns = checkBox.closest('div').querySelectorAll('[name=color_button]');
      colorBtns.forEach(btn => {
        btn.style.display = 'none';
      });
    } 
  });
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

handleToggleTheme:() => {
    document.body.classList.toggle('light--theme');
},

};

document.addEventListener('DOMContentLoaded', app.init); 


