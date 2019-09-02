const express = require('express');
const server  = express();
const session = require('express-session');
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(session({secret: "whatever"}));
var User = require('../db');
var impo_mail = require('./mail');

var login = function(req,res){
   if(req.body.username=="genero" &&  req.body.password == "2019"){
        req.session.sess_admin_info = req.body.username;
        req.session.sess_admin_pass= req.body.password;
        var doc = [req.body.username]
        res.render('home',{doc: doc});
    }
    else{
        res.sendfile("./views/login.html");
    }
}

var register = function(req,res){
    var info = {
        user : req.session.sess_admin_info,
        gid: Date.now()+"_"+req.body.email
    }
    if(!('user' in info)){
        res.sendfile("./views/login.html");
    }
    if((info.user==undefined)){
        res.sendfile("./views/login.html");
    }
    else{
        info = Object.assign({}, info, req.body);
        var myData = new User(info);
				myData.save()
					.then(item => {
                        
                        impo_mail.mail(info);
						res.redirect("/login?status=success");
						
					
					})
					.catch(err => {
						res.redirect("/login?status=error");
					});
    }
    
}

module.exports = {login: login, register: register};