const api = {

init: () => {
    console.log('data init');
    api.getCards();
    
},

//* LECTURE DES DONNEES
getCards: () => {
    // APi fetch cards
},

getColumns: () => {
    //APi call GET
},

//* ECRITURE DES DONNEES
postCards: () => {
    //APi call POST
},

postColumns: () => {     
    console.log('postColumns');
    //APi call POST
    const columns = document.querySelectorAll('.cards--dropzone');
    columns.forEach((column) => {
        console.log(column.getAttribute('id'));
        console.log(column.getAttribute('column_number'));
        console.log(column.getAttribute('column_name'));
        
        
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