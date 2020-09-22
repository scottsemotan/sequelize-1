const express = require("express");
const app = express();
const session = require('express-session');
const pbkdf2 = require('pbkdf2');

require('dotenv').config();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000}
}));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/', function (req, res){
    res.send('Hello fellow kids!');
});

app.listen(process.env.PORT, function (){
    console.log(`My API is listening to port ${process.env.PORT}`)
})