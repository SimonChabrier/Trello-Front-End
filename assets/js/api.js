const api = {

init: () => {
    console.log('data init');
    //? API FETCH EXEMPLES
    // https://github.com/SimonChabrier/bikeManagementSystem/blob/main/public/assets/js/inventoryForm.js
},

//* OK
getData: async () => {
    console.log('getData');
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
        if(response.status === 200){
            console.log('SUCCESS - GET ALL DATA')
        }
    } catch (error){
        console.log(error);
    }
    //console.table(data);
    //* si j'ai des données...alors je les affiche
    if(data.length){

    tpl.setColumnTemplate(data);

        app.handleDragAndDrop();
        app.handleDeleteColumn();
        app.handleDeleteCard();
        app.handleCountBackLogCards();
        app.handleChangeCardColor();
        app.handleDesableCheckBoxOnEmptyCard();
        app.handleTaskDone();
        app.handleDisableDragOnActiveInputs();
        app.handleHideColorsBtnsOnDoneCards();
        app.handleGetColumnName();
        app.updateAllCardsNumberAndColumnName();
    }
},

//* OK
getLastCreatedCard: async () => {
    console.log('getLastCreatedCard');

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
        if(response.status === 200){
            console.log('SUCCESS - GET LAST CREATED CARD')
        }
    } catch (error){
        console.log(error);
    }
    
    tpl.setNewCardTemplate(data);

    app.handleDragAndDrop();
    app.handleDeleteColumn();
    app.handleDeleteCard();
    app.handleCountBackLogCards();
    app.handleChangeCardColor();
    app.handleDesableCheckBoxOnEmptyCard();
    app.handleTaskDone();
    app.handleDisableDragOnActiveInputs();
    app.handleHideColorsBtnsOnDoneCards();
    app.handleGetColumnName();
    app.updateAllCardsNumberAndColumnName();
    app.handleNewColumnSetNumber();
},

//* OK
getLastCreatedColumn: async () => {
console.log('getLastCreatedColumn');
     //const location = window.location.origin;
     const endPoint = '/api/columns/last';
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
         if(response.status === 200){
             console.log('SUCCESS - GET LAST CREATED COLUMN')
         }
     } catch (error){
         console.log(error);
     }
     
    tpl.setNewColumnTemplate(data);

    app.handleDragAndDrop();
    app.handleDeleteCard();
    app.handleDeleteColumn();
    app.handleCountBackLogCards();
    app.handleChangeCardColor();
    app.handleDesableCheckBoxOnEmptyCard();
    app.handleTaskDone();
    app.handleDisableDragOnActiveInputs();
    app.handleHideColorsBtnsOnDoneCards();
    app.handleGetColumnName();
    app.updateAllCardsNumberAndColumnName();
},

//* OK
postCard: async () => {
console.log('postCard');
    const firstColumnid = document.querySelectorAll('.cards--dropzone')[0].getAttribute('id');
    //const newCardNumber = document.getElementById(firstColumnid).lastChild.getAttribute('card_number');

    const cardData = { 
        "task_title": "",
        "task_content": "",
        "task_done": false,
        "column_number": "1",
        "card_number": 1,
        "card_number": "1",
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
    if (response.status === 200) {
        console.log('SUCCESS - POST CARD')
    }
    //const data = await response.json();
    api.getLastCreatedCard();
},

//* OK
postColumn: async () => {    
    console.log('postColumn'); 

    const columnData = { 
        "column_name": "",
		"column_number": 1
    };

    const response = await fetch('https://127.0.0.1:8000/api/column', {
        method: 'POST', 
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(columnData)
    });
    //const data = await response.json();
    if (response.status === 200) {
        console.log('SUCCESS - POST COLUMN')
    }
    api.getLastCreatedColumn();
},

//* OK 
patchCard: async (cardId, title, content, done, column_number, card_number, card_color, textarea_height, columnId) => {         

    // TODO Si modification de toute les données de la carte
    // if(title && content && done && column_number && card_number && card_color && textarea_height){
    // const cardData = { 
    //     "task_title": title,
    //     "task_content": content,
    //     "task_done": done,
	// 	"column_number": column_number,
    //     "card_number": card_number,
    //     "card_color": card_color,
    //     "textarea_height": textarea_height.replace('px', ''),
    // };
    // // premier id = id de la colonne et le deuxième id = id de la carte
    // // le param converter côté serveur permet de convertir l'id de la colonne et id de la carte
    // // pour mettre à jour la relation oneToMany entre la carte et la colonne
    // const response = await fetch('https://127.0.0.1:8000/api/' + columnId + '/task/' + cardId, {
    //     method: 'PATCH', 
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(cardData)
    // });
    //     const data = await response.json( );
    //     console.table(data);
    // }

    // Si modification de la couleur de la carte
    if(card_color){
        console.log('patch card color' + card_color)
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
        // const data = await response.json( ); 
        // console.table(data);
        if (response.status === 200) {
            console.log('SUCCESS - Card color updated')
        }
    }

    // si modification du titre de la carte
    if(title){
    console.log('patch card title' + title)
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
        // const data = await response.json( ); 
        // console.table(data);
        if (response.status === 200) {
            console.log('SUCCESS - Card title updated')
        }
    }

    // si modification du texte de la carte
    if(content){
    console.log('patch card content' + content)
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
        // const data = await response.json( ); 
        // console.table(data);
        if (response.status === 200) {
            console.log('SUCCESS - Card content updated')
        }
    }

     // si modification du statut de la carte
     if(done == 0 || done == 1){
        console.log('patch card done' + done);
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
            // const data = await response.json( ); 
            // console.table(data);
            if (response.status === 200) {
                console.log('SUCCESS - Card done updated')
            }
        }

    // si modification du numéro de la carte
    if(card_number){
        console.log('patch card number' + card_number);
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
            // const data = await response.json( ); 
            // console.table(data);
            if (response.status === 200) {
                console.log('SUCCESS - Card card_number updated')
            }
        }

    if(column_number){
    console.log('patch card column number' + column_number);
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
        // const data = await response.json( ); 
        // console.table(data);
        if (response.status === 200) {
            console.log('SUCCESS - Card column_number updated')
        }
    }

    if(textarea_height){
    console.log('patch card textarea height' + textarea_height);
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
        // const data = await response.json( ); 
        // console.table(data);
        if (response.status === 200) {
            console.log('SUCCESS - Card number updated')
        }
    }  
},

//* OK
patchColumn: async (id, columnName) => {               
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

    // const data = await response.json( ); 
    // console.table(data);
    if (response.status === 200) {
        console.log('SUCCESS - Patch column')
    }
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
        if(response.status == 200){
        console.log('SUCCESS - Delete card')
        //return response.json( )
        }
    })
    // .then(data => 
    //     console.log(data) 
    // ); 
},

//* OK
deleteColumns: async (id) => {                                          

    await fetch('https://127.0.0.1:8000/api/column/' + id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
    })
    .then(response => {
        if(response.status == 200){
        console.log('SUCESS - Delete column')
        //return response.json()
        }
    })
    // .then(data => 
    //     console.log(data) 
    // );
},

}   

document.addEventListener('DOMContentLoaded', api.init);