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
    if(req.body.username=="event" &&  req.body.password == "2019"){
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
        var events = {event: {}}
        var count=((JSON.stringify(info.event)).split(",").length - 1);
        /*if((JSON.stringify(info.event)).includes(",")){
            count++;
        }*/
            if(count==0){
                events.event[info.event] = 0 ;
            }
            else
            {
                for(var key in info.event)
		{
        if(info.event.hasOwnProperty(key)){
			events.event[info.event[key]] = "0" ;
		}
    }
                
            }
        
    delete info.event;
    counts = {no_events: parseInt(count)+1}
    info = Object.assign({}, info, events, counts);
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

var search = function(req,res){
   
  if(req.body.type=="gid"){
    User
    .find({
      gid: req.body.search     
    })
    .then(doc => {
      var user = {user:req.session.sess_admin_info}
      doc = Object.assign({}, doc, user);
      res.render('search_res',{doc: doc});
    })
    .catch(err => {
      console.error(err)
    })
      }
    
    else if(req.body.type=="email"){
        User
  .find({
    email: req.body.search     
  })
  .then(doc => {
    var user = {user:req.session.sess_admin_info}
    doc = Object.assign({}, doc, user);
    res.render('search_res',{doc: doc});
  })
  .catch(err => {
    console.error(err)
  })
    }
}


// var attend = function(req,res){
//   User
//     .find({
//       gid: req.body.gid     
//     })
//     .then(doc => {
//       for( var key in doc) {
//       //HAVE TO BE UPDATED HERE
//       for (var i in req.body.check){
//         var up = (req.body.check[i]);
//         //console.log(doc[key].event)
//          var x = doc[key].event[up];
//         // var query = { gid: req.body.gid  };
//          var up_val = {[up]:"1"}
//          var eve = {event:{}}
//         eve.event = Object.assign({}, doc[key].event , up_val);
//         // console.log(eve)
//          delete doc[key].event;
//         // console.log(doc[key])
//          doc[key] = Object.assign({}, doc[key], eve);
//          res.send(doc[key])
//          //console.log(doc[key].event)
//         // console.log(doc[key])
//         // doc[key].save
//         // res.send(doc[key])
//        /* User.updateOne({gid: req.body.gid   }, {$set : {[doc[key].event[up]]: "1"}}, (err, item) => {
//           if (err) {
//             console.log("Something wrong when updating data!");
//         }
//         res.send(item);
//     }); */
//         //console.log([doc[key].event[up]])
//       /*User.findOneAndUpdate({gid: req.body.gid}, {$set:{[doc[key].event[up]]: "1"}}, {new: true}, (err, doc) => {
//         if (err) {
//             console.log("Something wrong when updating data!");
//         }
//         res.send(doc);
//     });*/
//     }
//   }
      
//       //res.render('search_res',{doc: doc});
//     })
//     .catch(err => {
//       console.error(err)
//     })
// } 

var attend = function(req,res){
  User
  .find({
    gid: req.body.gid     
  })
  .then(doc => {
      var to_update = { [req.body.check] : "1"}
      var eve = {}
      eve = Object.assign({}, doc[0].event , to_update);
     User.updateOne({gid: req.body.gid   }, {$set : {  event : eve }}, (err, item) => {
                if (err) {
                  console.log("Something wrong when updating data!");
              }
              
              res.redirect("/login?status=attended");
          });
     
  })
  .catch(err => {
    console.error(err)
  })
}

module.exports = {login: login, register: register, search: search, attend: attend};