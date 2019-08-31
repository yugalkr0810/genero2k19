
const dotenv = require('dotenv');
dotenv.config();
//const port = 8080;
const port = process.env.PORT;
var impo = require('./asset');
var User = require('./db');
var qr = require('qr-image'); 

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const server  = express();
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: true })); 
server.use(session({secret: "whatever"}));


server.listen(port,()=>
{
    console.log("server is working");
});

server.get('/',function(req,res)
{
    res.sendfile('form.html');
});



server.post('/register', function(req, res) {
    impo.InitPayment(req,res);
}); 

server.post('/callback', function(req,res){
	
    info = Object.assign({}, req.session.sess_per_info, req.body);
    if(info.STATUS=="TXN_SUCCESS"){
    var myData = new User(info);
    myData.save()
        .then(item => {
            //res.send("Name saved to database");

        var code = qr.image(JSON.stringify(info), { type: 'svg' });
        res.type('svg');
        code.pipe(res);
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
    }
    else {
        res.send("error");
    }
    req.session.destroy();
    
});


