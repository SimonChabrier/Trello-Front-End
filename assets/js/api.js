const api = {

init: () => {
    console.log('data init');
    
    //? API FETCH EXEMPLES
    // https://github.com/SimonChabrier/bikeManagementSystem/blob/main/public/assets/js/inventoryForm.js
},

//* LECTURE DES DONNEES
// TODO ne pas vider tout template mais juste ajouter la denrière carte postée
getLastCreatedCard: async () => {
    //const location = window.location.origin;
    const endPoint = '/api/tasks/last';
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
    console.table(data);
    // TODO ici il faut que je construise la carte avec les données de data
   
    tpl.setNewCardTemplate(data);

    app.handleDragAndDrop();
    app.handleDeleteCard();
    app.handleCountBackLogCards();
    app.handleChangeCardColor();
    app.handleDesableCheckBoxOnEmptyCard();
    app.handleTaskDone();
    app.handleDisableDragOnActiveInputs();
    app.handleHideColorsBtnsOnDoneCards();
    app.handleGetColumnName();
    app.updateAllCardsNumberAndColumnName();
},

getData: async () => {
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
    console.table(data);
    tpl.setColumnTemplate(data);

    app.handleDragAndDrop();
    app.handleDeleteCard();
    app.handleCountBackLogCards();
    app.handleChangeCardColor();
    app.handleDesableCheckBoxOnEmptyCard();
    app.handleTaskDone();
    app.handleDisableDragOnActiveInputs();
    app.handleHideColorsBtnsOnDoneCards();
    app.handleGetColumnName();
    app.updateAllCardsNumberAndColumnName();
    
},

// getLastColumn: async () => {
//     //const location = window.location.origin;
//     const endPoint = '/api/columns/last';
//     //const apiRootUrl = location + endPoint;
//     const apiRootUrl = 'https://127.0.0.1:8000' + endPoint;

//     let fetchOptions = {
//         method: 'GET',
//         mode: 'cors',
//         cache: 'no-cache'
//     };
//     try {
//         response = await fetch(apiRootUrl, fetchOptions);
//         data = await response.json();
//     } catch (error){
//         console.log(error);
//     }
//     console.log(data);
//     tpl.setColumnTemplate(data);

//     app.handleDragAndDrop();
//     app.handleDeleteCard();
//     app.handleCountBackLogCards();
//     app.handleChangeCardColor();
//     app.handleDesableCheckBoxOnEmptyCard();
//     app.handleTaskDone();
//     app.handleDisableDragOnActiveInputs();
//     app.handleHideColorsBtnsOnDoneCards();
//     app.handleGetColumnName();
    
// },

//* OK
// TODO mettre la colonne backlog en BDD avec un id
postCard: async () => {

    const firstColumnid = document.querySelectorAll('.cards--dropzone')[0].getAttribute('id');
    const newCardNumber = document.getElementById(firstColumnid).lastChild.getAttribute('card_number');

    const cardData = { 
        "task_title": "New card",
        "task_content": "",
        "task_done": false,
        "column_number": "1",
        "card_number": newCardNumber,
        "card_color": "card--color--default",
        "textarea_height": "150"
    };

        const response = await fetch('https://127.0.0.1:8000/api/column/' + firstColumnid, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
     
       const data = await response.json( );
        //console.table(data);
        //TODO ici il faut juste ajouter la dernière carte postée sans tout recharger
        document.getElementById('columns_container').innerHTML = '';
        api.getData();

        //document.querySelectorAll('.cards--dropzone')[0].innerHTML = '';
        //api.getLastCreatedCard();
},

//* OK
postColumn: async () => {     
    const newColumn = document.getElementById('columns_container').lastChild;
    const newColumnNumber = newColumn.getAttribute('column_number');

    const columnData = { 
        "column_name": "",
		"column_number": parseInt(newColumnNumber),
    };

    const response = await fetch('https://127.0.0.1:8000/api/column', {
        method: 'POST', 
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(columnData)
    });
    
    const data = await response.json( );
    console.log(data);
    document.getElementById('columns_container').innerHTML = '';
    api.getData();

},

//* OK Manque la mise à jour du numéro de carte quand on les déplace il prend toujours la valeur 1
patchCard: async (cardId, title, content, done, column_number, card_number, card_color, textarea_height, columnId) => {         

    // Si modification de toute les données de la carte
    if(title && content && done && column_number && card_number && card_color && textarea_height){
    const cardData = { 
        "task_title": title,
        "task_content": content,
        "task_done": done,
		"column_number": column_number,
        "card_number": card_number,
        "card_color": card_color,
        "textarea_height": textarea_height.replace('px', ''),
    };
    // premier id = id de la colonne et le deuxième id = id de la carte
    // le param converter côté serveur permet de convertir l'id de la colonne et id de la carte
    // pour mettre à jour la relation oneToMany entre la carte et la colonne
    const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });
        const data = await response.json( );
        console.table(data);
    }

    // Si modification de la couleur de la carte
    if(card_color){
        const cardData = { 
            "card_color": card_color,
        };
    const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });
        const data = await response.json( ); 
        console.table(data);
    }

    // si modification du titre de la carte
    if(title){
    const cardData = { 
        "task_title": title,
    };
    const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });
        const data = await response.json( );
        console.table(data);
    }

    // si modification du texte de la carte
    if(content){
    const cardData = { 
        "task_content": content,
    };
    const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });
        const data = await response.json( );
        console.table(data);
    }

     // si modification du statut de la carte
     if(done == 0 || done == 1){
        console.log(done);
        const cardData = { 
            "task_done": done,
        };
        const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
            const data = await response.json( );
            console.table(data);
        }

    // si modification du numéro de la carte
    if(card_number){
        const cardData = { 
            "card_number": card_number,
        };
        const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
            const data = await response.json( );
            console.table(data);
        }

    if(column_number){
    const cardData = { 
        "column_number": column_number,
    };
    const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });
        const data = await response.json( );
        console.table(data);
    }

    if(textarea_height){
    const cardData = { 
        "textarea_height": textarea_height.replace('px', ''),
    };
    const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });
        const data = await response.json( );
        console.table(data);
    }

    

    
},

//* OK
patchColumn: async (id, columnName) => {   
    console.log('patchColumn');   
    console.log(id);
    console.log(columnName);             
    //APi call PUT
    const columnData = { 
        "column_name": columnName,
    };

    const response = await fetch('https://127.0.0.1:8000/api/column/' + id, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(columnData)
    });

    const data = await response.json( );
    // now do whatever you want with the data  
    console.log(data);
},

//* OK
deleteCard: async (id) => {                               
    //APi call DELETE
    await fetch('https://127.0.0.1:8000/api/task/' + id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
    })
    .then(response => {
        return response.json( )
    })
    .then(data => 
        console.log(data) 
    ); 
},

//* OK
deleteColumns: async (id) => {                                          
    // APi call DELETE
    await fetch('https://127.0.0.1:8000/api/column/' + id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
    })
    .then(response => {
        return response.json( )
    })
    .then(data => 
        console.log(data) 
    );
},

}   

document.addEventListener('DOMContentLoaded', api.init);