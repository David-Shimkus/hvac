// File: server.js
//
// Revisions:
// ??-??-???? | Alec Beyer    | Creation.
// 04-12-2017 | David Shimkus | Added getPredRateSingle.

var forge = require('node-forge');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var assert = require('assert');
var hvac = require('./HVAConnect.js');

//Setting up the JSON parsing/formatting
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('json spaces', 2);

/* Setting headers and metadata for JSON */
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Content-Type', 'application/vnd.api+json');
	next();
});

/* API routes and functions */
app.post('/api/getPredictedUsage', function(req, res)
{
	console.log('getPredictedUsage hit, endpoint: ' + req.body.endpoint + ', t_target_unix: ' + req.body.t_target_unix);
	if(req.body.endpoint && req.body.t_target_unix)
	{
		hvac.getPredictedUsage(req.body.endpoint, req.body.t_target_unix).then(function(average)
		{
			console.log('getPredictedUsage average: ' + average + "\n");
			res.send({"average": average});
		});	
	}
	else
	{
		res.send({"average": "error: missing arguements"});
	}
});

app.post('/api/getPredictedTemp', function(req,res)
{
	console.log('getPredictedTemp hit, zip: ' + req.body.zip + ', t_target_unix:' + req.body.t_target_unix);
	if(req.body.zip && req.body.t_target_unix)
	{
		hvac.getPredictedTemp(req.body.zip, req.body.t_target_unix).then(function(weather)
		{
			console.log('getPredictedTemp weather: ' + weather + "\n");
			res.send(weather);
		});
	}
	else
	{
		res.send({"average": "error: missing arguements"});
	}
});

app.post('/api/getPredictedRate', function(req, res)
{
	console.log('getPredictedRate hit, zip: ' + req.body.zip + ', t_init_unix: ' + req.body.t_init_unix + ', t_final_unix: ' + req.body.t_final_unix + ', provider: ' + req.body.provider);
	if(req.body.zip && req.body.t_init_unix && req.body.t_final_unix && req.body.provider)
	{
		hvac.getPredictedRate(req.body.zip, req.body.t_init_unix, req.body.t_final_unix, req.body.provider).then(function(average)
		{
			console.log('getPredictedRate average: ' + average + "\n");
			res.send({"average": average});
		});
	}
	else
	{
		res.send({"average": "error: missing arguements"});
	}
});	

//added by David
app.post('/api/getPredictedRateSingle', function(req, res)
{
	console.log('getPredictedRateSingle hit, zip: '+ req.body.zip + ', t_target_unix: ' + req.body.t_target_unix + ', provider' + req.body.provider);
	if(req.body.zip && req.body.t_target_unix && req.body.provider)
	{	
		hvac.getPredictedRateSingle(req.body.zip, req.body.t_target_unix, req.body.provider).then(function(average)
		{
			console.log('getPredictedRateSingle average: ' + average + "\n");
			res.send({"average": average});
		});
	}
	else
	{
		res.send({"average": "error: missing arguements"});
	}
});

app.post('/api/getPredictedOptDegree', function(req,res)
{
	console.log('getPredictedOptDegree hit, zip: ' + req.body.zip + ', t_init_unix: ' + req.body.t_init_unix + ', t_target_unix: ' + req.body.t_target_unix + ', t_final_unix: ' + req.body.t_final_unix + ', provider: ' + req.body.provider);

	if(req.body.zip && req.body.t_init_unix && req.body.t_target_unix && req.body.t_final_unix && req.body.provider)
	{
		hvac.getPredictedOptDegree(req.body.zip, req.body.t_init_unix, req.body.t_target_unix, req.body.t_final_unix, req.body.provider).then(function(degree)
		{
			console.log('getPredictedOptDegree degree: ' + degree + "\n");
			res.send({"degree": degree});
		});
	}
	else
	{
		res.send({"average": "error: missing arguements"});
	}
});
	 
/* server starts listening */
app.listen(1234);
console.log('listening on port 1234');


//Scrapes and inserts the current rates.
//setImmediate(function(){hvac.rateScrapeInsert("Ameren")});

//This calls scrape and insert every 12 hours.
// setInterval
// (
// 	function()
// 	{
// 		hvac.rateScrapeInsert("Ameren");
// 	},
// 	43200000 //interval in milliseconds
// );
