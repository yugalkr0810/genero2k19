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

server.get('/',function(req,res)
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
