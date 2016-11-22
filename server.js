const express = require('express');
const bodyParser = require('body-parser');
var hackerEarth = require('hackerearth-node');

// Hackerearth Specification
var hackerEarth = new hackerEarth('972c43a9827a338ca243c89f1ef87d7f9d5a954f','');
var config={};
config.time_limit=1;  //your time limit in integer
config.memory_limit=323244;  //your memory limit in integer
config.input="";  //input against which you have to test your source code
config.language="C++"; //optional choose any one of them or none


//const MongoClient = require('mongodb').MongoClient;
//var daasUrl = 'mongodb://jats22:jpg308@ds021289.mlab.com:21289/empfeed';

var database = require('./database');
const app = express();
var path = require('path');

var sess;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname ,'public')));

app.set('view engine','ejs');

app.get('/problems',function(req,res){
	console.log('Get request')
	database.connect().then(function(db){
		var collection = db.collection('problems');
		collection.find().toArray(function(err,problems){
			if(err) return res.send(err);

				res.send(problems);
		})
	});		
})

app.post('/compile',function(req,res){
	
	console.log('Compile request')
	config.source = req.body.code;  //Source code for which you want to use hackerEarth api
	hackerEarth.compile(config,function(err,resp){
		if(err){
			console.log("ERROR: Could not connect with Hackerearth!");
		}
		else{
			var compMessage = JSON.parse(resp).message;
			console.log(compMessage);
			res.send(compMessage);
		}
	});	
		
	// });
})
app.post('/run',function(req,res){
	
	console.log('Run request');
	config.source = req.body.code;  //Source code for which you want to use hackerEarth api

	database.connect().then(function(db){
		db.collection('testcases').findOne({"Cid":req.body.Cid},function(err,doc){
			config.input = doc.Input ;
			hackerEarth.run(config,function(err,resp){
				if(err){
					console.log("ERROR: Could not connect with Hackerearth!");
				}
				else{
					var runMessage = resp;
					var codeOutput = doc.Output;
					console.log(req.body.Cid);
					console.log(JSON.parse(runMessage).run_status.output == codeOutput );
					res.send(JSON.parse(runMessage).run_status.output == codeOutput );
				}
			});	
			db.close();
		});
	});
})

app.post('/codes',function(req,res){
	
	console.log("Post request");

	database.connect().then(function(db){
		db.collection('codes').insert(req.body,function(err,result){
			if(err) return res.send(err);
			res.sendStatus(200);
			console.log('Saved to Database');
			database.close(db);
		})
	})
	
})

app.put('/codes',function(req,res){
	console.log("Put request");
	database.connect().then(function(db){
		db.collection('codes').findOneAndUpdate(
		{
			Title:req.body.Title
		},
		{ 
			$set:
			{
			code: req.body.code,
			Title: req.body.Title
			}
		},
		{
			sort: {_id:-1},
			upsert: true
		},
		function(err,result){
			if(err) return res.send(err)
			
			console.log('Updated!');
			// res.redirect('/');
			database.close(db);
		}
		)

	})
	
})

app.listen(80,function(){
		console.log("Listening on 3000");
		//console.log(hackerEarth);
})
