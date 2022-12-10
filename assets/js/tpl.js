// Récupéer nom de la conlonne 1


const tpl = {

init: () => {
    console.log('tpl init');
    // Je récupère les données en BDD via l'API si il y en a   
},

// CONSTRUCTION DE L'ENSEMBLE DES COLONNES PERSISTEES EN BDD
setColumnTemplate: (columns) => {
    // je crée les colonnes
    columns.forEach(column => {
        const target = document.getElementById('columns_container');
        const columnTemplate = document.getElementById('column_template').content.cloneNode(true);
        
        columnTemplate.querySelector('.cards--dropzone').setAttribute('id', column.id);
        columnTemplate.querySelector('.cards--dropzone').setAttribute('column_name', column.column_name);
        columnTemplate.querySelector('.cards--dropzone').setAttribute('column_number', column.column_number);
        columnTemplate.querySelector('.input--column--name').value = column.column_name;
        columnTemplate.querySelector('.input--column--name').setAttribute('column_name', column.column_name);

        target.appendChild(columnTemplate); 
        tpl.setCardTemplate(column.tasks, column.column_name);
    }); 
},

// CONSTRUCTION DE L'ENSEMBLE DES CARTES PERSISTEES EN BDD
setCardTemplate: (cards, colName) => {  

    //TODO gérer l'association des cartes à la bonne colonne
    //* méthode obligatoire pour associer les cartes à la bonne colonne
    app.handleNewColumnSetNumber();
    
    
    // j'utilise ? pour dire que si cards existe alors je fais le forEach (optionnal chaining)
    cards?.forEach(card => {
        const cardTemplate = document.getElementById("card_template").content.cloneNode(true);
        
        cardTemplate.querySelector('.draggable--card').setAttribute('id', card.id);
        cardTemplate.querySelector('.draggable--card').setAttribute('column_number', card.column_number);
        cardTemplate.querySelector('.draggable--card').setAttribute('card_number', card.card_number);

        cardTemplate.querySelector('.card--title').setAttribute('value', card.task_title);
        cardTemplate.querySelector('.card--text').innerText = card.task_content;
        cardTemplate.querySelector('.card--text').style.height = `${card.textarea_height}px`;
        cardTemplate.querySelector('.card--number').innerText = `${colName} Card - N° ${card.card_number}`;
       
        if (card.task_done == true) {
            cardTemplate.querySelector('.draggable--card').classList.add('task--done');
            cardTemplate.querySelector('.draggable--card').setAttribute('task_done', card.task_done);
            cardTemplate.querySelector('.card--checkox').setAttribute('checked', 'checked');
        }

        if (card.card_color !== 'card--color--default') {
            cardTemplate.querySelector('.draggable--card').classList.add(card.card_color);
            cardTemplate.querySelector('.draggable--card').setAttribute('card_color',  card.card_color);
        }

        let newColumns = document.querySelectorAll('.cards--dropzone');
        // - newColumns? pour dire que si newColumns existe alors je fais le forEach (optionnal chaining) sinon je ne fais rien
        newColumns?.forEach(newColumn => {
            if (newColumn.getAttribute('column_number') == card.column_number) {  
                newColumn.appendChild(cardTemplate);
            }
        });
    });
},
 
///////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// CONSTRUCTION D'UNE NOUVELLE COLONNE
setNewCardTemplate: (card) => {

    const cardTemplate = document.getElementById("card_template").content.cloneNode(true);
    const firstColumn = document.querySelectorAll('.cards--dropzone')[0];

        
        cardTemplate.querySelector('.draggable--card').setAttribute('id', card.id);
        cardTemplate.querySelector('.draggable--card').setAttribute('column_number', card.column_number);
        cardTemplate.querySelector('.draggable--card').setAttribute('card_number', card.card_number);
        
        //TODO VOIR LA GESTION D'UNE CARTE AVEC DU CONTENU DANS LA COLONNE 1
        // cardTemplate.querySelector('.card--title').setAttribute('value', card.task_title);
        // cardTemplate.querySelector('.card--text').innerText = card.task_content;
        // cardTemplate.querySelector('.card--text').style.height = `${card.textarea_height}px`;
        // cardTemplate.querySelector('.card--number').innerText = `${colName} Card - N° ${card.card_number}`;   
        firstColumn.appendChild(cardTemplate);
        //firstColumn.getElementsByTagName("input")[0].appendChild(cardTemplate);
  
},

// CONSTRUCTION D'UNE NOUVELLE CARTE
setNewColumnTemplate: (column) => {

    // je récupère le nombre de colonne qui démarrera à 1 en ajoutant + 1 
    // au premier passage, comme le noeud est vide le premier valeur retournée par columns.length == 0
    const columns = document.querySelectorAll('.cards--dropzone');
    column.column_number = columns.length + 1;
    const target = document.getElementById('columns_container');
    const columnTemplate = document.getElementById('column_template').content.cloneNode(true);
        
    columnTemplate.querySelector('.cards--dropzone').setAttribute('id', column.id);
    columnTemplate.querySelector('.cards--dropzone').setAttribute('column_name', column.column_name);
    columnTemplate.querySelector('.cards--dropzone').setAttribute('column_number', column.column_number); 
    columnTemplate.querySelector('.input--column--name').value = column.column_name;
    columnTemplate.querySelector('.input--column--name').setAttribute('column_name', column.column_name);

    target.appendChild(columnTemplate); 
},

};

document.addEventListener('DOMContentLoaded', tpl.init);