var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var mongodb = require('mongodb');

var collection = 'rtp_prices';
var mongourl = 'mongodb://localhost:27017/prices';
    
var url = 'https://www2.ameren.com/RetailEnergy/RealTimePrices';

function getRates(){
	return new Promise(function(resolve, reject){
		request(url, function(error, response, html){

			if(!error){
			    var $ = cheerio.load(html);

			    $('.priceTable').filter(function(){
				var data = $(this);
				var tableData = data.children().last();
				var priceArray = [];
	
				tableData.children().each(function(i, elem){
					priceArray.push($(this).children().last().text());
				});

				resolve(priceArray);
			    })
			}
		})
	});
}

var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

getRates().then(function(priceArray){
	var MongoClient = mongodb.MongoClient;
	MongoClient.connect(mongourl, function(err,db){
		if(err){
			console.log("cannot connect to db");
		}else{
			console.log("db connection successful");
			for(var x = 0; x < priceArray.length; x++){
				db.collection(collection).insert({
					"DAY": day,
					"MONTH": month,
					"YEAR": year,
					"HOUR": (x+1),
					"PRICE": priceArray[x]
				});
			}
			console.log("insert successful");
			process.exit();
		}
	});
});
