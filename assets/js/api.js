const api = {

init: () => {
    console.log('data init');
    //? API FETCH EXEMPLES
    // https://github.com/SimonChabrier/bikeManagementSystem/blob/main/public/assets/js/inventoryForm.js
},

//* LECTURE DES DONNEES
getCards: () => {
    // APi fetch cards
},

getColumns: async () => {


        //const location = window.location.origin;
        const endPoint = '/api/tasks';
        //const apiRootUrl = location + endPoint;
        const apiRootUrl = 'https://127.0.0.1:8000' + endPoint;

        let fetchOptions = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };
        try {
            response = await fetch(apiRootUrl, fetchOptions);
            data = await response.json();
        } catch (error){
            console.log(error);
        }

        tpl.setColumnTemplate(data);

        app.handleGetColumnName();
        app.handleDragAndDrop();
        app.handleDeleteCard();
        app.handleCountBackLogCards();
        app.handleChangeCardColor();
        app.handleDesableCheckBoxOnEmptyCard();
        app.handleTaskDone();
        app.handleDisableDragOnActiveInputs();
        app.handleHideColorsBtnsOnDoneCards();
},

//* ECRITURE DES DONNEES
postCards: () => {
    //APi call POST
},

postColumns: () => {     
    console.log('postColumns');
    // Préparer le stockage des données
    const columnsData = [];
    const cards = [];

    // 1 - Récupérer les données des colonnes et créer un tableau d'objets.
    const columns = document.querySelectorAll('.cards--dropzone');
    columns.forEach((column) => {

    let id = column.getAttribute('id');
    let column_number = column.getAttribute('column_number');
    let column_name = column.getAttribute('column_name');
        
        // 2 - Récupérer les cartes de la colonne au passage sur chaque colonne dans le forEach et créer un tableau d'objets des cartes.
        let colum_cards = column.querySelectorAll('.draggable--card');
        colum_cards.forEach((card) => {
            let task_title = card.querySelector('.card--title').value;
            let id = card.getAttribute('id');
            let task_content = card.querySelector('.card--text').value;
            let task_done = card.getAttribute('task_done');
            let column_number = card.getAttribute('column_number');
            let card_number = card.getAttribute('card_number');
            let card_color = card.getAttribute('card_color');
            let textarea_height = card.querySelector('.card--text').style.height;
            
            cards.push({
                id : id,
                task_title: task_title,
                task_content: task_content,
                task_done: task_done,
                column_number: column_number,
                card_number: card_number,
                card_color: card_color,
                textarea_height: textarea_height,
                
            });
        });

        columnsData.push({
            id : id,
            column_number : column_number,
            column_name : column_name,
        });
    });

    console.log(columnsData);
    console.log(cards);

    // 3 - Envoyer les données au serveur
    fetch('https://127.0.0.1:8000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'body': JSON.stringify(columnsData, cards),
            'cache': 'no-cache',
            'credentials': 'same-origin',
            'mode': 'no-cors',
        },
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(error);
    });
},

//* MODIFICATION COMPLETE DES DONNEES
putCards: () => {         
    //APi call PUT
},

putColumns: () => {                    
    //APi call PUT
},

//* MODIFICATION PARTIELLE DES DONNEES
patchCards: () => {
    //APi call PATCH
},

patchColumns: () => {
    //APi call PATCH
},

//* SUPPRESSION DES DONNEES
deleteCards: () => {                               
    //APi call DELETE
},

deleteColumns: () => {                                          
    //APi call DELETE
},



}   

document.addEventListener('DOMContentLoaded', api.init);