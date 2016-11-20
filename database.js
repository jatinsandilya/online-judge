var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var url = 'mongodb://localhost:27017/test';
//var url = 'mongodb://jats22:jpg308@ds021289.mlab.com:21289/empfeed'
module.exports = {
	connect: function() {
		return new Promise(function(resolve, reject) {
			MongoClient.connect(url, function(err, db) {
				if(err) {
					return reject(err);
				}

				return resolve(db);
			});
		});
	},
	close: function(db) {
		db.close();
	}
};