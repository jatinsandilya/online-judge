const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set('view engine','ejs');

var db;

MongoClient.connect('mongodb://jats22:jpg308@ds021289.mlab.com:21289/empfeed',function(err,database){
	if(err) return console.log(err);
	db = database;
	app.listen(3000,function(){
		console.log("Listening on 3000");
	})
})

app.get('/',function(req,res){
	db.collection('quotes').find().toArray(function(err,results){
		if(err) return console.log(err);

		console.log(results);
		
		res.render('index.ejs',{quotes :results});
	});
	//res.sendFile(__dirname+'/index.html');
})

app.post('/quotes',function(req,res){
	console.log(req.body);
	db.collection('quotes').save(req.body,function(err,result){
		if(err) return console.log(err);

		console.log('Saved to Database');
		res.redirect('/');			
	})
})

app.put('/quotes',function(req,res){
	console.log("Put request");

	db.collection('quotes')
	.findOneAndUpdate(
		{name:'Yoda'},
		{ $set:{
			name: req.body.name,
			quote: req.body.quote
		}},
		{
			sort: {_id:-1},
			upsert: true
		},
		function(err,result){
			if(err) return res.send(err)
				res.send(result)
		}
	)	
})
