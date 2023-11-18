const api = {

uri: "https://trello.simschab.cloud",
//uri: "https://127.0.0.1:8000",

init: () => {
    console.log('api init');
    //? API FETCH EXEMPLES
    // https://github.com/SimonChabrier/bikeManagementSystem/blob/main/public/assets/js/inventoryForm.js
},

//* OK
getData: async () => {

    const uri = api.uri;
    const endPoint = "/api/tasks";
    const apiRootUrl = uri + endPoint;

    let fetchOptions = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        }
    };
    try {
        response = await fetch(apiRootUrl, fetchOptions);
        data = await response.json();
        console.log(response.status);
        if(response.status === 200){
            //console.table(data);
            console.log('GET ALL DATAS SUCCESS');
            //app.initAllAppActions(true);
        }
    } catch (error){
        console.log(error);
    }
    // si j'ai des données...alors je les affiche et j'init les actions
    if(data.length){
        tpl.setColumnTemplate(data);
        app.initAllAppActions();
    }
},

//* OK
getLastCreatedCard: async () => {

    const uri = api.uri;
    const endPoint = '/api/tasks/last';
    const apiRootUrl = uri + endPoint;

    let fetchOptions = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        }
    };
    try {
        response = await fetch(apiRootUrl, fetchOptions);
        data = await response.json();
        if(response.status === 200){
            //console.table(data);
            console.log('SUCCESS - GET LAST CREATED CARD')
        }
    } catch (error){
        console.log(error);
    }
    
    tpl.setNewCardTemplate(data);
    app.initAllAppActions();
},

//* OK
getLastCreatedColumn: async () => {

    const uri = api.uri;
    const endPoint = '/api/columns/last';
    const apiRootUrl = uri + endPoint;

    let fetchOptions = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        }
    };
    try {
        response = await fetch(apiRootUrl, fetchOptions);
        data = await response.json();
        if(response.status === 200){
        //console.table(data);
            console.log('SUCCESS - GET LAST CREATED COLUMN')
        }
    } catch (error){
        console.log(error);
    }
     
    tpl.setNewColumnTemplate(data);
    //app.initAllAppActions();
},

//* OK
postCard: async () => {

    const uri = api.uri;
    const endPoint = '/api/tasks/';

    const firstColumnid = document.querySelectorAll('.cards--dropzone')[0].getAttribute('id');
    
    const cardData = { 
        "task_title": "",
        "task_content": "",
        "task_done": false,
        "column_number": "1",
        "card_number": "",
        "card_color": "card--color--default",
        "textarea_height": "150"
    };

    const response = await fetch(uri + endPoint + firstColumnid, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        },
        body: JSON.stringify(cardData)
    });
    if (response.status === 201) {
        console.log('SUCCESS - POST CARD')
    }
    //const data = await response.json();
    api.getLastCreatedCard();
},

//* OK
postColumn: async () => {    

    const uri = api.uri;
    const endPoint = '/api/column';

    const columnData = { 
        "column_name": "",
		"column_number": 1
    };

    const response = await fetch(uri + endPoint, {
        method: 'POST', 
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        },
        body: JSON.stringify(columnData)
    });
    if (response.status === 201) {
        console.log('SUCCESS - POST COLUMN')
    }
    //const data = await response.json();
    api.getLastCreatedColumn();
},

//* OK 
patchCard: async (cardId, cardData, columnId) => {       
    
    const uri = api.uri;

    // cardtId to int 
    cardId = parseInt(cardId);
    columnId = parseInt(columnId);

    if(cardData){
    // @Route("/{column}/task/{task}", name="api_patch_task", methods={"PATCH"})
    const response = await fetch(uri + '/api/' + columnId + '/task/' + cardId, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        },
        body: JSON.stringify(cardData)
    });
        // const data = await response.json( ); 
        // console.table(data);
        if (response.status === 200) {
            console.log('PATCH CARD SUCCESS')
        }
    }
},

//* OK
patchColumn: async (id, columnName) => {  

    id = parseInt(id);

    const uri = api.uri;
    const endPoint = '/api/column/';

    const columnData = { 
        "column_name": columnName,
    };

    const response = await fetch(uri + endPoint + id, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        },
        body: JSON.stringify(columnData)
    });

    // const data = await response.json( ); 
    // console.table(data);
    if (response.status === 200) {
        console.log('PATCH COLUMN SUCCESS')
    }
},

//* OK
deleteCard: async (id) => {               
    
    const uri = api.uri;
    const endPoint = '/api/task/';

    await fetch(uri + endPoint + id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        },
        body: null
    })
    .then(response => {
        if(response.status == 200){
        console.log('DELETE CARD SUCCESS')
        //return response.json( )
        }
    })
    // .then(data => 
    //     console.log(data) 
    // ); 
},

//* OK
deleteColumns: async (id) => {        
    
    const uri = api.uri;
    const endPoint = '/api/column/';

    await fetch(uri + endPoint + id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + jwt.getTokenFromLocalStorage()
        },
        body: null
    })
    .then(response => {
        if(response.status == 200){
        console.log('DLETE COLUMN SUCESS')
        //return response.json()
        }
    })
    // .then(data => 
    //     console.log(data) 
    // );
},

}   

//document.addEventListener('DOMContentLoaded', api.init);