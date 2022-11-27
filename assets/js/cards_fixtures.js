console.log('fixtures init');

// const cards = [
//     {
//         id : '1',
//         task_title : 'Titre de la carte 1',
//         task_content : 'Contenu de la carte 1',
//         task_done : 'true',
//         column_number : '1',
//         card_number : '1',
//         card_color : 'card--color--blue',
//         textarea_height : '100px',
//     },
//     {
//         id : '2',
//         task_title : 'Titre de la carte 2',
//         task_content : 'Contenu de la carte 2',
//         task_done : 'true',
//         column_number : '2',
//         card_number : '100',
//         card_color : 'card--color--red',
//         textarea_height : '200px',
//     },
// ];

const columns = [
    {
        id : '1',
        column_number : '1',
        placeholder : 'Col 1',
        cards : [
            {
            id : '1',
            task_title : 'Titre de la carte 1',
            task_content : 'Contenu de la carte 1',
            task_done : 'true',
            column_number : '1',
            card_number : '1',
            card_color : 'card--color--blue',
            textarea_height : '100px',
            },
        ]
    },
    {
        id : '2',
        column_number :'2',
        placeholder : 'Col 2',
        cards : [
            {
            id : '2',
            task_title : 'Titre de la carte 3',
            task_content : 'Contenu de la carte 3',
            task_done : 'false',
            column_number : '2',
            card_number : '1',
            card_color : 'card--color--orange',
            textarea_height : '100px',
            },
            {
            id : '3',
            task_title : 'Titre de la carte 2',
            task_content : 'Contenu de la carte 2',
            task_done : 'true',
            column_number : '2',
            card_number : '2',
            card_color : 'card--color--blue',
            textarea_height : '100px',
            },
        ]
    },
];