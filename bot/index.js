const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')

const webApp = express();

webApp.use(cookieParser());
webApp.use(session({
    secret: 'keyboardcat',
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT || 5000;

const homeRoute = require('./routes/home_route');
const dialogflowRoute = require('./routes/dialogflow_route');

webApp.use(homeRoute.router);
webApp.use(dialogflowRoute.router);

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});