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
    console.log(data);
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
    
},

//* OK
postCard: async () => {
    //APi call POST
    const cardData = { 
        "task_title": "Titre de la carte 1",
        "task_content": "Contenu de la carte 1",
        "task_done": false,
        "column_number": "0",
        "card_number": "",
        "card_color": "card--color--default",
        "textarea_height": "150"
    };

        const response = await fetch('https://127.0.0.1:8000/api/column/1/task', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });
     
       const data = await response.json( );
     
       // now do whatever you want with the data  
        console.log(data);
},

//* OK
postColumn: async () => {     
    console.log('postColumns');
    // Préparer le stockage des données
    // 3 - Envoyer les données au serveur
    const columnData = { 
        "column_name": "",
		"column_number": 1,
    };

        const response = await fetch('https://127.0.0.1:8000/api/column', {
            method: 'POST', 
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
patchCard: async (id) => {         
    //APi call PUT

    const cardData = { 
        "task_title": "Mise à jour test PATCH",
		"column_number": "1",
	    "task_content": "test de contenu",
		"card_number": "1"
    };

    const response = await fetch('https://127.0.0.1:8000/api/task/' + id, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    });

    const data = await response.json( );
    // now do whatever you want with the data  
    console.log(data);
},

//* OK
patchColumn: async (id) => {   
    console.log('patchColumn');                 
    //APi call PUT
    const columnData = { 
        column_name: 'Nouveau titre',
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