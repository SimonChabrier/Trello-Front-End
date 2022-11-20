const tpl = {

init: () => {
    console.log('tpl init');
    tpl.setCardTemplate(cards);
    
},

// TODO GERER LES COLONNES
// * COLUMNS TEMPLATES A CONSTRUIRE AVANT LES CARTES

setColumnTemplate: (cards) => {
},

// TODO VOIR BUG SI CLIC SUR CARTE 2
// * CARDS TEMPLATES A ASSOCIER AUX COLUMNS A TESTER

setCardTemplate: (cards) => {   
    cards.forEach(card => {
        const target = document.getElementById('backlog_column');
        const cardTemplate = document.getElementById("card_template").content.cloneNode(true);
        
        cardTemplate.querySelector('.draggable--card').setAttribute('column_number', card.column_number);
        cardTemplate.querySelector('.draggable--card').setAttribute('card_number', card.card_number);
        
        if (card.task_done == 'true') {
            cardTemplate.querySelector('.draggable--card').classList.add('task--done');
            cardTemplate.querySelector('.draggable--card').setAttribute('task_done', card.task_done);
            cardTemplate.querySelector('.card--checkox').setAttribute('checked', 'checked');
        }
        
        if (card.card_color !== 'card--color--default') {
            cardTemplate.querySelector('.draggable--card').setAttribute('card_color', card.card_color);
            cardTemplate.querySelector('.draggable--card').classList.add(card.card_color);
        }

        cardTemplate.querySelector('.card--title').setAttribute('value', card.task_title);
        cardTemplate.querySelector('.card--text').innerHTML = card.task_content;

        target.appendChild(cardTemplate);
    });
},
    
}



document.addEventListener('DOMContentLoaded', tpl.init);