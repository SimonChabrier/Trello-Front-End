// Récupéer nom de la conlonne 1


const tpl = {

init: () => {
    console.log('tpl init');
    api.getColumns();
    //tpl.setColumnTemplate(columns);
    // les méthodes nécéssaires pour manipuler les cartes
    // app.handleGetColumnName();
    // app.handleDragAndDrop();
    // app.handleDeleteCard();
    // app.handleCountBackLogCards();
    // app.handleChangeCardColor();
    // app.handleDesableCheckBoxOnEmptyCard();
    // app.handleTaskDone();
    // app.handleDisableDragOnActiveInputs();
    // app.handleHideColorsBtnsOnDoneCards();
    //TODO pour tester les données
    // api.postColumns();
    
},

// * 1 - CONSTRUCTION DES COLONNES
setColumnTemplate: (columns) => {
    // je crée les colonnes
    columns.forEach(column => {
        const target = document.getElementById('columns_container');
        const columnTemplate = document.getElementById('column_template').content.cloneNode(true);
        
        columnTemplate.querySelector('.cards--dropzone').setAttribute('id', column.id);
        columnTemplate.querySelector('.cards--dropzone').setAttribute('column_number', column.column_number);
        columnTemplate.querySelector('.cards--dropzone').setAttribute('column_name', column.column_name);
        columnTemplate.querySelector('.input--column--name').value = column.column_name;
        columnTemplate.querySelector('.input--column--name').setAttribute('column_name', column.column_name);

        target.appendChild(columnTemplate); 

        app.handleDeleteColumn();
        app.handleNewColumnSetNumber();
        // Je passe les carte à setCardTemplate
        tpl.setCardTemplate(column.tasks, column.column_name);
    }); 
},

// * 2 - CONSTRUCTION DES CARTES
setCardTemplate: (cards, colName) => {   
    // j'utilise ? pour dire que si cards existe alors je fais le forEach (optionnal chaining)
    cards?.forEach(card => {
        const cardTemplate = document.getElementById("card_template").content.cloneNode(true);
        
        cardTemplate.querySelector('.draggable--card').setAttribute('column_number', card.column_number);
        cardTemplate.querySelector('.draggable--card').setAttribute('id', card.id);
        cardTemplate.querySelector('.draggable--card').setAttribute('card_number', card.card_number);
       
        if (card.task_done == true) {
            cardTemplate.querySelector('.draggable--card').classList.add('task--done');
            cardTemplate.querySelector('.draggable--card').setAttribute('task_done', card.task_done);
            cardTemplate.querySelector('.card--checkox').setAttribute('checked', 'checked');
        }

        if (card.card_color !== 'card--color--default') {
            cardTemplate.querySelector('.draggable--card').classList.add(card.card_color);
            cardTemplate.querySelector('.draggable--card').setAttribute('card_color',  card.card_color);
        }

        cardTemplate.querySelector('.card--title').setAttribute('value', card.task_title);
        cardTemplate.querySelector('.card--text').innerText = card.task_content;
        cardTemplate.querySelector('.card--text').style.height = `${card.textarea_height}px`;
        cardTemplate.querySelector('.card--number').innerText = `${colName} Card - N° ${card.card_number}`;
        

        let newColumns = document.querySelectorAll('.cards--dropzone');
        // - newColumns? pour dire que si newColumns existe alors je fais le forEach (optionnal chaining) sinon je ne fais rien
        newColumns?.forEach(newColumn => {
            if (newColumn.getAttribute('column_number') == card.column_number) {
                newColumn.appendChild(cardTemplate);
            }
        });
    });
},
 
};

document.addEventListener('DOMContentLoaded', tpl.init);