const app = {

init:()=> {
  console.log('Trello start success !');
  app.allListeners(); 
  
  // compter les cartes renvoyées par le serveur pour vérifier qu'il n'en manque pas
  setTimeout(() => {
  console.log(document.querySelectorAll('.draggable--card').length);
  }, 1000);
  // * POUR API CALL IL QUE TOUT SOIT DISPO EN EN DEHORS DES LISTENERS
},

//TODO gérer l'ordre d'appel des méthodes si il y a des cartes qui sont déjà crées par tpl.js ou par fetch c'est là que ça va démarrer....
// TODO il faut gére de recalculer le numéro de carte à chque fois que je supprime une colonne sur Insomnia, le nuéro de colonne se décale
allListeners:()=> {

  document.getElementById('create_column_btn').addEventListener('click', () => { 
      app.handleCreateColumn()
      app.handleDragAndDrop();
      app.handleDeleteColumn();
      app.handleNewColumnSetNumber();
      app.handleGetColumnName();
      api.postColumn();
      
  });

  document.getElementById('create_card_btn').addEventListener('click', () => { 
      api.postCard();
      app.handleCreateCard()
      app.handleDragAndDrop();
      app.handleDeleteCard();
      app.handleCountBackLogCards();
      app.handleChangeCardColor();
      app.handleDesableCheckBoxOnEmptyCard();
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
    app.handleGetThemeStatusFromLocalStorage();
      // app.handleCountBackLogCards();
      // app.handleChangeCardColor();
      // app.handleDesableCheckBoxOnEmptyCard();
      // app.handleTaskDone();
      // app.handleOnLoadCheckIfTaskDone();
      // app.handleHideColorsBtnsOnDoneCards();
      // app.handleDeleteCard();
      // app.handleNewCardSetNumber();
      // app.handleDisableDragOnActiveInputs();      
  });
},

handleToggleTheme:() => {
  document.body.classList.toggle('light--theme');
  document.querySelectorAll('.cards--dropzone').forEach(dropzone => {
      dropzone.classList.toggle('light--column--theme');
  });
  document.querySelector('.header').classList.toggle('light--theme--header');

  localStorage.setItem('theme_status', document.body.classList.contains('light--theme') ? 'light' : 'dark');
  
},

handleGetThemeStatusFromLocalStorage:() => {
  const theme = localStorage.getItem('theme_status');
  if (theme === 'light') {
      document.body.classList.add('light--theme');
      document.querySelector('.header').classList.toggle('light--theme--header');
      document.querySelectorAll('.cards--dropzone').forEach(dropzone => {
          dropzone.classList.add('light--column--theme');
          document.getElementById('dark_mode_switch').checked = true;
      });
  } else {
      document.body.classList.remove('light--theme');
      document.querySelectorAll('.cards--dropzone').forEach(dropzone => {
          dropzone.classList.remove('light--column--theme');
          document.getElementById('dark_mode_switch').checked = false;
      });
  }
},

handleDisableDragOnActiveInputs:()=> {

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
  const buttons = document.querySelectorAll('.delete--column');

  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').remove();
      //* je récupère l'id de la colonne cliquée pour la supprimer dans la BDD
      const columId = event.target.closest('div').getAttribute('id');
      api.deleteColumns(columId);
      app.handleNewColumnSetNumber();
    });
  });
},

handleDeleteCard:() => {
  const buttons = document.querySelectorAll('.delete_card');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      api.deleteCard(event.target.closest('div').getAttribute('id'));
      event.target.closest('div').remove();
      app.handleCountBackLogCards();
      app.updateAllCardsNumberAndColumnName();
    });
  });
},

handleCreateColumn:() => {
  const column = app.createElement('div', 'cards--dropzone', '');
  column.appendChild(app.createInputElement('input', 'input', 'input_column_name', 'input--column--name', 'todo'));
  app.appendElementToQuerySelector(column,'.columns--container');
  const btn = app.createElement('button', 'delete--column', 'X');
  column.appendChild(btn);

  const theme = localStorage.getItem('theme_status');
  if (theme === 'light') {
      column.classList.add('light--column--theme');
  }
},

handleCreateCard:() => {
  const card = app.createElement('div', 'draggable--card', null);
  card.setAttribute('draggable', 'true');
  card.setAttribute('column_number', '0');
  card.appendChild(app.headerCardColors());
  card.appendChild(app.createElement('button', 'delete_card', 'X'));
  card.appendChild(app.createElement('span', 'card--number', 'N°'));
  card.appendChild(app.setCardContent());
  app.appendElementToQuerySelector(card,'.new--card--section');
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
            input.removeAttribute('disabled');
            input.disabled = false;
          });
            event.target.closest('div').querySelectorAll('[name=color_button]').forEach(btn => {
            btn.style.display = 'block';
          });
        }
    });
  });
},

handleDesableCheckBoxOnEmptyCard:() => {
  const cards = document.querySelectorAll('.draggable--card');
  cards.forEach(card => {
    const inputs = card.querySelectorAll('.card--text, .card--title');

      inputs.forEach(input => {
        if(input.value === '') {
            card.querySelector('.card--checkox').setAttribute('disabled', true);
        } else {
            card.querySelector('.card--checkox').removeAttribute('disabled');
        }
      });

      inputs.forEach(input => {
        input.addEventListener('input', (event) => {
          if(event.target.value === '') {
            card.querySelector('.card--checkox').setAttribute('disabled', true);
          } else {
            card.querySelector('.card--checkox').removeAttribute('disabled');
          }
        }
      );
    });
  });
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

handleCountBackLogCards:()=> {
  const newCardColumn = document.querySelectorAll('.new--card--section');
  newCardColumn.forEach(card => {
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
        draggable.addEventListener('dragend', (event) => {
        draggable.classList.remove('dragging');

        app.handleCountBackLogCards();
        app.updateAllCardsNumberAndColumnName();

        //* On traite la sauvegarde des données de la carte
        // console.log(event.target);
        cardId = event.target.getAttribute('id');
        title = event.target.querySelector('.card--title').value;
        content = event.target.querySelector('.card--text').value;
        done = event.target.getAttribute('task_done');
        column_number = event.target.parentElement.getAttribute('column_number');
        card_number = event.target.getAttribute('card_number');
        card_color = event.target.getAttribute('card_color');
        textarea_height = event.target.querySelector('.card--text').style.height;
        columnId = event.target.parentElement.getAttribute('id');
        
        console.log('columnId', columnId);
        console.log('cardId', cardId);
        
          api.patchCard(
            cardId, 
            title, 
            content, 
            done, 
            column_number, 
            card_number, 
            card_color, 
            textarea_height,
            columnId
          ); 
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

handleNewColumnSetNumber:() => {
  // ici j'ai chaque chaque colonne et je boucle sur leur cartes
  const columns = document.querySelector('.columns--container');
  for(let i = 0; i < columns.children.length; i++) {    
    columns.children[i].setAttribute('column_number', i + 1);
  }
  console.log('recalculer les uméros des cartes à la suppression d\'une colonne');
},

//* UTILS

createElement:(tag, className, textContent) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerText = textContent;

  return element;
},

// inputType pour le type de l'input par exemple text, checkbox, submit, file etc...
// attribute pour préciser le type de l'input par exemple (submit)
// eg : app.createInputElement('input', 'text', 'task_title',  'card--title', 'Title')
createInputElement:(input, inputType, inputName, className, placeHolder) => {
  const element = document.createElement(input);
  element.setAttribute('type', inputType);
  element.setAttribute('name', inputName);
  element.classList.add(className);
  element.placeholder = placeHolder;

  return element;
},

appendElementToQuerySelector:(element, querySelector) => {
  const appendTo = document.querySelector(querySelector);
  appendTo.appendChild(element);

  return appendTo;
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
  console.log('toggleFullScreenMode');
  
  const element = document.documentElement
   
  if(event.target.checked == true)
  {
    event.target.setAttribute('checked', 'true');
    setTimeout(() => {
      element.requestFullscreen();
    }, 200);
  } else {
    event.target.removeAttribute('checked');
    setTimeout(() => {
      document.exitFullscreen();
    }, 200); 
  }
},

setCardContent:() => {
  const cardContent = app.createElement('section', 'card--content', ''); 
  cardContent.appendChild(app.createInputElement('input', 'text', 'task_title',  'card--title', 'Title'));
  cardContent.appendChild(app.createInputElement('textarea', '', 'task_content', 'card--text', 'Description'));
  cardContent.appendChild(app.createInputElement('input', 'checkbox', 'task_status', 'card--checkox', ''));
  
  return cardContent;
},

};

document.addEventListener('DOMContentLoaded', app.init); 


