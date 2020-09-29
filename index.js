const express = require("express");
const app = express();
const session = require('express-session');
const pbkdf2 = require('pbkdf2');
const models = require('./models');

require('dotenv').config();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000}
}));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

function encryptPassword(req, res, next){
    if(req.body.password) {
    var key = pbkdf2.pbkdf2Sync(
        req.body.password, process.env.PASSWORD_SALT, 3600, 256, 'sha256'
    );
    var hash = key.toString('hex');
    req.body.password = hash;
    next();
    } else {
        res.send('please add password');
    }
}

app.post('/sign-up', encryptPassword, function (req,res){
    models.user.create({username: req.body.username, password: req.body.password})
    .then(function (user){
        console.log("New User Created: ", user);
        res.send(user)
    })
})


app.get('/', function (req, res){
    res.send(process.env.HELLO_MESSAGE);
});

app.listen(process.env.PORT, function (){
    console.log(`My API is listening to port ${process.env.PORT}`)
})