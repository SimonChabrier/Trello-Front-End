const jwt = {
    token: null,
    isLoggedIn: false,
    //uri: "https://127.0.0.1:8000/auth",
    uri: "https://trello.simschab.cloud/auth",

    // listen to login button click event
    init: () => {
        console.log('jwt init');
        jwt.checkToken();
        loginButton.addEventListener('click', jwt.logIn);
    },

    getLoginData: () => {
        console.log('getLoginData');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const data = {
            email: email,
            password: password
        };
        return JSON.stringify(data);
    },

    logOut: () => {
        console.log('logOut');
        jwt.token = null;
        localStorage.removeItem('token');
        document.querySelector('.loginForm').style.display = 'flex';
        jwt.isLoggedIn = false;
        app.clearAllListeners();
        document.querySelector('.page').style.display = 'none';
        location.reload();
    },

    logIn: async () => {
        console.log('logIn');
        try {
            const response = await fetch(jwt.uri, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jwt.getLoginData()
            });

            if (response.status === 200) {
                jwt.isLoggedIn = true;
                const responseData = await response.json();
                jwt.token = responseData.token;
                jwt.saveTokenToLocalStorage(responseData.token);
                document.querySelector('.loginForm').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'block';
                jwt.checkToken();
                return true;
            } else {
                console.log('Authentication failed:', response.status);
                const responseBody = await response.json();
                document.getElementById('errorLogin').innerText = await responseBody.message;
                return false;
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            return false;
        }
    },

    saveTokenToLocalStorage: (token) => {
        localStorage.setItem('token', token);
    },

    getTokenFromLocalStorage: () => {
        return localStorage.getItem('token');
    },

    checkToken: () => {
        console.log('checkToken');
        const storedToken = localStorage.getItem('token');
        if (storedToken === null) {
            console.log('No token found');
            // displau login form
            jwt.isLoggedIn = false;
            document.querySelector('.loginForm').style.display = 'flex';
            return false;
        } else {
            console.log('Token found:', storedToken);
            document.querySelector('.loginForm').style.display = 'none';
            jwt.isLoggedIn = true;
            // récupère les datas si on rafrachit la page
            document.querySelector('.page').style.display = 'block';
            app.init();         
            //api.init();
            return true;
        }
    },
};

document.addEventListener('DOMContentLoaded', jwt.init); 
