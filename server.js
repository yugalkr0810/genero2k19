const express = require('express');
const server  = express();
const session = require('express-session');
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(session({secret: "whatever"}));
var impo = require('./model/admin');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;


server.listen(port,()=>
{
    console.log("server is working");
});


//ADMIN

server.get('/admin',function(req,res)
{
    res.sendfile('./views/login.html');
});

server.post('/login',function(req,res)
{   
    impo.login(req,res);
});

server.get('/login',function(req,res)
{   
    req.body["username"] =  req.session.sess_admin_info;
    req.body["password"] =  req.session.sess_admin_pass;
    impo.login(req,res);
});


server.post('/register',function(req,res)
{   
    if(!('event' in req.body)){
        var doc = [req.session.sess_admin_info]
        res.render('home',{doc:doc});
    }
    else{
        impo.register(req,res);
    }
    
});

server.get('/signout',function(req,res)
{   
    req.session.destroy();
    delete req.body;
    res.sendfile('./views/login.html');
});

server.post('/search',function(req,res)
{   
    impo.search(req,res);
});

server.post('/attend',function(req,res)
{   
    impo.attend(req,res);
});

server.get('/search_res',function(req,res)
{   
    var doc = {
    user : req.session.sess_admin_info,
    password : req.session.sess_admin_pass
    }
    console.log(req.body)
    res.render('search_res', {doc : doc});
});


//USER

server.get('/',function(req,res)
{
    res.sendfile('./views/user/index.html');
});

server.get('/style.css',function(req,res)
{
    res.sendfile('./views/user/style.css');
});

//HEAD

server.get('/style1.css',function(req,res)
{
    res.sendfile('./views/user/style1.css');
});

server.get('/assets/fonts/stylesheet.css',function(req,res)
{
    res.sendfile('./views/user/assets/fonts/stylesheet.css');
});

server.get('/assets/css/home.css',function(req,res)
{
    res.sendfile('./views/user/assets/css/home.css');
});

server.get('/assets/css/home.css',function(req,res)
{
    res.sendfile('./views/user/assets/css/mediaquery.css');
});

server.get('/assets/css/navbar.css',function(req,res)
{
    res.sendfile('./views/user/assets/css/navbar.css');
});

//01

server.get('/assets/img/logo.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/logo.png');
});

server.get('/assets/img/facebook.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/facebook.png');
});

server.get('/assets/img/instagram.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/instagram.png');
});

server.get('/assets/img/marvel-wallpaper-avengers.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/marvel-wallpaper-avengers.png');
});

server.get('/assets/img/mob-grid-logo.jpg',function(req,res)
{
    res.sendfile('./views/user/assets/img/mob-grid-logo.jpg');
});

server.get('/assets/img/scroll.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/scroll.png');
});

server.get('/assets/img/dots.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/dots.png');
});

server.get('/assets/img/01.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/01.png');
});

server.get('/assets/img/scroll-big.png',function(req,res)
{
    res.sendfile('./views/user/assets/img/scroll-big.png');
});


//02

server.get('/cpt.png',function(req,res)
{
    res.sendfile('./views/user/cpt.png');
});

//03

server.get('/Group%20162.png',function(req,res)
{
    res.sendfile('./views/user/Group%20162.png');
});


//04

server.get('/thor.png',function(req,res)
{
    res.sendfile('./views/user/thor.png');
});

//05

server.get('/ola.jpg',function(req,res)
{
    res.sendfile('./views/user/ola.jpg');
});

server.get('/Aptron.png',function(req,res)
{
    res.sendfile('./views/user/Aptron.png');
});

server.get('/sopra.png',function(req,res)
{
    res.sendfile('./views/user/sopra.png');
});

server.get('/oyo.jpg',function(req,res)
{
    res.sendfile('./views/user/oyo.jpg');
});

//FOOTER

server.get('/black-logo.png',function(req,res)
{
    res.sendfile('./views/user/black-logo.png');
});
