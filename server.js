var express =  require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var product = require ('./model/advice');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT|| 8090;
var router= express.Router();

app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('Rest API is running  at port: '+ port);