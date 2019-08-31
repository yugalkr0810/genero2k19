const http = require('http');
const https = require('https');
const qs = require('querystring');
const checksum_lib = require('./checksum.js');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const server  = express();
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: true })); 
server.use(session({secret: "whatever"}));


var PaytmConfig = {
	mid: process.env.MID,
	key: process.env.KEY,
	website: process.env.WEBSITE
}
const port = process.env.PORT;

var InitPayment = function(req,res){

    var per_info = {
        name : req.body.name,
        mobile : req.body.mobile,
        email : req.body.email,
        balance : req.body.balance
        }
        
        req.session.sess_per_info = per_info;
        //res.sendfile('register.html');
        //res.render('register',{name:name,mobile:mobile,email:email, bal:bal});
        
	var params 						= {};
			params['MID'] 					= PaytmConfig.mid;
			params['WEBSITE']				= PaytmConfig.website;
			params['CHANNEL_ID']			= 'WEB';
			params['INDUSTRY_TYPE_ID']	= 'Retail';
			params['ORDER_ID']			= per_info.email+"_"  + new Date().getTime();
			params['CUST_ID'] 			= per_info.email;
			params['TXN_AMOUNT']			= per_info.balance;
			params['CALLBACK_URL']		= 'http://localhost:'+port+'/callback';
			params['EMAIL']				= per_info.email;
			params['MOBILE_NO']			= per_info.mobile;

			checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {

				var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
				// var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
				
				var form_fields = "";
				for(var x in params){
					form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"' >";
				}
				form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";

				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields+'</form><script type="text/javascript">document.f1.submit();</script></body></html>');
				res.end();
            });
            
        

        };


module.exports = {InitPayment: InitPayment};