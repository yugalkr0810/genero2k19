const dotenv = require('dotenv');
dotenv.config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const url = process.env.url;
mongoose.connect(url);
var per_info = new mongoose.Schema({
    name: String,
    email: String,
    mobile : String,
    balance: String
});
var User = mongoose.model("User", per_info);
module.exports = User;