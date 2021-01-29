const express = require('express');
const dbConnect = require('./config/db.connect.seq');
const bodyParser = require('body-parser');
const userRoute = require('./routes/user');

dbConnect.authenticate()
    .then(() => { console.log("Successfully connected to the database : "+ process.env.DB_DATABASE)})
    .then(() => { console.log("Welcome user : "+ process.env.DB_USER)})
    .catch(error => { console.error('Unable to connect to the database:', error) });

const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/users', userRoute);

module.exports = app;