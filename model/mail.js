var nodemailer = require('nodemailer');
var fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
var qr = require('qr-image');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var mail = function(req){
  //console.log(req)
    var qr_data = {
      gid: req.gid,
      name : req.name,
      event : req.event
    };
			
		
    console.log(qr_data)
    const hash = cryptr.encrypt(qr_data);
    // const unhash = cryptr.decrypt(hash);
    // console.log(unhash)
var qr_png = qr.image(JSON.stringify(hash), { type: 'png' });
qr_png.pipe(fs.createWriteStream('./qrcode/'+req.gid+'.png'));
 
//var svg_string = qr.imageSync(req.gid+'.png', { type: 'png' });


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, //add ur gmail id
    pass: process.env.PASS  //add id password
  }
});

var mailOptions = {
  from: process.env.EMAIL, //add ur gmail id
  to: req.email,
  subject: 'Genero ID',
  text: 'Your Genero Registeration ID is '+req.gid,
  attachments: [
      {
          filename: req.gid+'.png',
          content: fs.createReadStream('./qrcode/'+req.gid+'.png') 
        }
    ]
  
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
   // console.log(error);
   
  } else {
    //console.log('Email sent: ' + info.response);
    
  }
}); 
}

module.exports = {mail: mail};