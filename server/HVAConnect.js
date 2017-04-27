// File: HVAConnect.js
//
// Revisions:
// 01/25/2017 | David Shimkus | Creation.
// 01/26/2017 | David Shimkus | TODO: rounding of the date objects? -> maybe in function itself
// 02/06/2017 | David Shimkus | Directory Organization
// 03/22/2017 | David Shimkus | Added getPredictedRateSingle()
// 03/29/2017 | David Shimkus | Minor Code cleanup.  Changed getPredTemp parameters.

var Promise    = require('bluebird');
var usage 	   = require('./predictions/getPredictedUsage.js');
var temp 	   = require('./predictions/getPredictedTemp.js');
var rate 	   = require('./predictions/getPredictedRate.js');
var rateSingle = require('./predictions/getPredictedRateSingle.js');
var optDeg 	   = require('./predictions/getPredictedOptDegree.js');


//TODO: these functions should POST to the server as defined in client_externalsConfig.js


module.exports = 
{
	//GET PREDICTED USAGE
	getPredictedUsage: function(endpoint, t_target)
	{
		return new Promise(function(resolve, reject)
		{
			usage.getPredictedUsage(endpoint, t_target).then(function(average)
			{
				resolve(average);
			});
		});
	},//end get predicted usage


	//GET PREDICTED TEMP
	getPredictedTemp: function(zip, t_target)
	{
		return new Promise(function(resolve, reject)
		{
			temp.getPredictedTemp(zip, t_target).then(function(weather)
			{
				resolve(weather);
			});	
		});
	},//end get predicted temp
	

	//GET PREDICTED RATE
	getPredictedRate: function(zip, t_init, t_final, provider)
	{
		return new Promise(function(resolve, reject)
		{
			rate.getPredictedRate(zip, t_init, t_final, provider).then(function(average)
			{
				resolve(average);
			
			});
		});

	},

	//GET PREDICTED RATE SINGLE
	getPredictedRateSingle: function(zip, t_target, provider)
	{
		return new Promise(function(resolve, reject)
		{
			rateSingle.getPredictedRateSingle(zip, t_target, provider).then(function(average)
			{
				resolve(average);
			});
			
		});
	},

	//GET PREDICTED OPT DEGREE
	getPredictedOptDegree: function(zip, t_init, t_target, t_final, provider)
	{
		return new Promise(function(resolve, reject)
		{
			optDeg.getPredictedOptDegree(zip, t_init, t_target, t_final, provider).then(function(degree)
			{
				resolve(degree);
			});
		});
	}

}
