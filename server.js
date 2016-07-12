const express = require('express');
const bodyParser = require('body-parser');
//const MongoClient = require('mongodb').MongoClient;
//var daasUrl = 'mongodb://jats22:jpg308@ds021289.mlab.com:21289/empfeed';
var database = require('./database');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set('view engine','ejs');

// MongoClient.connect('mongodb://jats22:jpg308@ds021289.mlab.com:21289/empfeed',function(err,database){
// 	if(err) return console.log(err);
// 	db = database;
	
// })

app.get('/',function(req,res){
	console.log('Get request')
	
	database.connect().then(function(db){
		var collection = db.collection('quotes');
		collection.find().toArray(function(err,quote){
			res.render('index.ejs',{quotes: quote});
		})
	})


		
		
	// });
})

app.post('/quotes',function(req,res){
	
	console.log("Post request");

	database.connect().then(function(db){
		db.collection('quotes').insert(req.body,function(err,result){
			if(err) return res.send(err);
			res.redirect('/');
			console.log('Saved to Database');

			database.close(db);
		})
	})
	
})

app.put('/quotes',function(req,res){
	console.log("Put request");
	database.connect().then(function(db){
		db.collection('quotes').findOneAndUpdate(
		{
			name:'Yoda'
		},
		{ 
			$set:
			{
			name: req.body.name,
			quote: req.body.quote
			}
		},
		{
			sort: {_id:-1},
			upsert: true
		},
		function(err,result){
			if(err) return res.send(err)
			
			console.log('invasion!');
			res.redirect('/');
			database.close(db);
		}
		)

	})
	
})

app.listen(3000,function(){
		console.log("Listening on 3000");
})
