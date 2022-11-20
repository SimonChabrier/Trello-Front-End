const api = {

init: () => {
    console.log('data init');
    api.getCards();
},

//* LECTURE DES DONNEES
getCards: () => {

},

getColumns: () => {
    //APi call GET
},

//* ECRITURE DES DONNEES
postCards: () => {
    //APi call POST
},

postColumns: () => {     
    //APi call POST
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