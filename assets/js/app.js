const app = {

init:()=> {
  console.log('Trello start success !');
  api.getData(); 
  app.allListeners();
  
},

// * LISTENERS * //

allListeners:()=> {

  document.getElementById('create_column_btn').addEventListener('click', () => { 
      api.postColumn();
  });

  document.getElementById('create_card_btn').addEventListener('click', () => {     
      api.postCard();      
  });
  
  document.getElementById('fullscreen_switch').addEventListener('change', (event) => {
      app.toggleFullScreenMode(event);
  });

  document.querySelector('#dark_mode_switch').addEventListener('change', () => {
      app.handleToggleTheme();  
  });

},

// * INIT ALL APP ACTIONS * //

initAllAppActions:()=> {

    app.handleDragAndDrop();
    app.handleDeleteColumn();
    app.handleDeleteCard();
    app.handleChangeCardColor();
    app.handleDesableCheckBoxOnEmptyCard();
    app.handleTaskDone();
    app.handleDisableDragOnActiveInputs();
    app.handleHideColorsBtnsOnDoneCards();
    app.handleGetColumnName();
    app.updateAllCardsNumberAndColumnName();
    app.handleNewColumnSetNumber();
    app.handlePatchCardTitle();
    app.handlePatchCardContent();
    app.handleGetThemeStatusFromLocalStorage();
    app.handlePatchTextareasHeight();
},

// * ACTIONS * //

handlePatchTextareasHeight:() => {
  const textareas = document.getElementsByTagName('textarea');
  Array.from(textareas).forEach(textarea => {
    textarea.addEventListener('mouseup', (event) => {
      console.log('change');
      const cardId = event.target.closest('.draggable--card').getAttribute('id');
      const columnId = event.target.closest('.cards--dropzone').getAttribute('id');
      const textareaHeight = event.target.style.height.replace('px', '');    
      const cardData = { "textarea_height": textareaHeight };

      // PATCH CARD TEXTAREA HEIGHT
      api.patchCard(cardId, cardData, columnId);
    });
  });
},

handlePatchColumnName:() => {
  const column = document.querySelectorAll('.column');
  column.forEach(column => {
      const columnId = column.getAttribute('id');
      const columnName = column.querySelector('.column--name').value;

      // PATCH COLUMN NAME
      api.patchColumnName(columnId, columnName);
  });
},

handlePatchCardTitle:() => {

    document.querySelectorAll('.card--title').forEach(card => {

    card.addEventListener('blur', (event) => {
      const cardId = event.target.closest('.draggable--card').getAttribute('id');
      const cardTitle = event.target.value;
      const columnId = event.target.closest('.cards--dropzone').getAttribute('id');
      
      // PATCH CARD TITLE
    api.patchCard(cardId, {"tasktitle": cardTitle}, columnId);
    });
  }); 
},

handlePatchCardContent:() => {

  const textareas = document.getElementsByTagName('textarea');

  Array.from(textareas).forEach(textarea => {
    textarea.addEventListener('blur', (event) => {
      const cardId = event.target.closest('.draggable--card').getAttribute('id');
      const cardContent = event.target.value;
      const columnId = event.target.closest('.cards--dropzone').getAttribute('id');
        
      // PATCH CARD CONTENT
      api.patchCard(cardId, {"task_content": cardContent}, columnId);
    });
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
      document.getElementById('dark_mode_switch').checked = true;
   
      document.querySelectorAll('.cards--dropzone').forEach(dropzone => { 
        dropzone.classList.add('light--column--theme'); 
      });

  } else {

      document.body.classList.remove('light--theme');
      document.getElementById('dark_mode_switch').checked = false;
      document.querySelectorAll('.cards--dropzone').forEach(dropzone => {
          dropzone.classList.remove('light--column--theme');
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
      //TODO Avertir l'utilisateur qu'il va supprimer une colonne avec des cartes...
      //* je récupère l'id de la colonne cliquée pour la supprimer dans la BDD
      const columId = event.target.closest('div').getAttribute('id');
      api.deleteColumns(columId);
      //* je supprime la colonne du DOM
      event.target.closest('div').remove();
      //* je met à jour le numéro des colonnes
      app.handleNewColumnSetNumber();
      //* je met à jour le numéro des cartes -> API PATCH
      app.updateAllCardsColumnNumberOnDeleteColumn();
    });
  });
},

handleDeleteCard:() => {
  const buttons = document.querySelectorAll('.delete_card');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      api.deleteCard(event.target.closest('div').getAttribute('id'));
      event.target.closest('div').remove();
      app.updateAllCardsNumberAndColumnName();
    });
  });
},

handleTaskDone:() => {
  document.querySelectorAll('.card--checkox').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
    const cardId = event.target.closest('div').getAttribute('id');
    const columnId = event.target.closest('.cards--dropzone').getAttribute('id');
  if(event.target.checked) {
        // hide colors btns on check action
        app.handleHideColorsBtnsOnDoneCards();
        event.target.closest('div').classList.add('task--done');
        event.target.closest('div').setAttribute('task_done', 'true');
        event.target.closest('section').querySelectorAll('.card--text, .card--title').forEach(input => {
        input.setAttribute('disabled', true);
        input.disabled = true;

        // PATCH CARD
        api.patchCard(cardId, {"task_done": true}, columnId);
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

          // PATCH CARD
          api.patchCard(cardId, {"task_done": false}, columnId);
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

handleChangeCardColor:() => {
    document.getElementsByName('color_button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.closest('div').classList = '';
      event.target.closest('div').classList.add('draggable--card');    
      event.target.closest('div').classList.add(event.target.className);
      event.target.closest('div').setAttribute('card_color', event.target.className);

      const cardId = event.target.closest('div').getAttribute('id')
      const columnId = event.target.closest('.cards--dropzone').getAttribute('id');
      const cardColor = event.target.closest('div').getAttribute('card_color');

      // PATCH CARD
      api.patchCard(cardId, {"card_color" : cardColor}, columnId);
    });
  });
},

handleNewCardSetNumber:() => {
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
      if(event.target.value === '') {
        event.target.placeholder = 'TODO';
        event.target.closest('div').setAttribute('column_name', event.target.placeholder)
      } else {
        event.target.closest('div').setAttribute('column_name', event.target.value);
      }
      app.updateAllCardsNumberAndColumnName();
      });

        // update column name on blur event
        column.addEventListener('blur', (event) => {

        // PATCH COLUMN
        api.patchColumn(event.target.closest('div').getAttribute('id'), 
        event.target.closest('div').getAttribute('column_name'))
      }
    );
  });
},

handleDragAndDrop:() => {
  const draggables = document.querySelectorAll('.draggable--card');
  const columns = document.querySelectorAll('.cards--dropzone');
  
  draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (event) => {
        event.target.classList.add('dragging');
    });
        draggable.addEventListener('dragend', (event) => {
        draggable.classList.remove('dragging');

        app.updateAllCardsNumberAndColumnName();

        //* On traite la sauvegarde des données de la carte
        cardId = event.target.getAttribute('id');
        column_number = event.target.parentElement.getAttribute('column_number');
        card_number = event.target.getAttribute('card_number');
        const columnId = event.target.parentElement.getAttribute('id');
      
        // PATCH CARD
        api.patchCard(cardId, {"column_number" : column_number, "card_number" : card_number}, columnId); 
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
  const columnContainer = document.querySelector('.columns--container');
  for(let i = 0; i < columnContainer.children.length; i++) {    
    // je donne le numéro de la colonne à chaque colonne en fontion de leur position dans le DOM
    columnContainer.children[i].setAttribute('column_number', i + 1);
  }
},

// * UTILS * //

updateAllCardsNumberAndColumnName:() => {
  const columns = document.querySelectorAll('.cards--dropzone');
  columns.forEach(column => {
    
    const cards = column.querySelectorAll('.draggable--card');
 
    for(let i = 0; i < cards.length; i++) {
      cards[i].setAttribute('card_number', i + 1);
      cards[i].setAttribute('column_number', column.getAttribute('column_number'));
      column.getAttribute('column_name') == null ? column.setAttribute('column_name', 'TODO') : true;
      cards[i].querySelector('.card--number').innerText = `${column.getAttribute('column_name')} Card - N° ${cards[i].getAttribute('card_number')}`;
      
      cards.forEach(card => {
        const columnId = card.parentElement.getAttribute('id');
        const cardId = card.getAttribute('id');
        const cardNumber = card.getAttribute('card_number');
        
        // PATCH CARD
        api.patchCard(cardId, {"card_number" : cardNumber}, columnId);
      });
    }
  });
},

updateAllCardsColumnNumberOnDeleteColumn:() => {
  const columns = document.querySelectorAll('.cards--dropzone');
  columns.forEach(column => {
    const cards = column.querySelectorAll('.draggable--card');
    
    cards.forEach(card => {
      card.setAttribute('column_number', column.getAttribute('column_number'));
      const columnId = card.closest(".cards--dropzone").getAttribute('id');
      const cardId = card.getAttribute('id');
      const column_number = card.getAttribute('column_number');

      if(columnId && cardId && column_number) {

          // PATCH CARD
          api.patchCard(cardId, {"column_number" : column_number}, columnId);
      }

    });
  });
},

// y c'est la position de l'élément déplacé sur l'axe horizontal
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
    }, 200);
  } else {
    event.target.removeAttribute('checked');
    setTimeout(() => {
      document.exitFullscreen();
    }, 200); 
  }
},

};

document.addEventListener('DOMContentLoaded', app.init); 


