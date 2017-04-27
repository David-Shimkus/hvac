// File: HVAConnect.js
//
// Revisions:
// 01/25/2017 | David Shimkus | Creation.
// 01/26/2017 | David Shimkus | TODO: rounding of the date objects? -> maybe in function itself
// 02/06/2017 | David Shimkus | Directory Organization
// 03/22/2017 | David Shimkus | Added getPredictedRateSingle()
// 03/29/2017 | David Shimkus | Minor Code cleanup.  Changed getPredTemp parameters.
// 04/08/2017 | David Shimkus | Included POST requests for this client side version.
// 04/08/2017 | Brian Stevens | Filled out all of the post requests. 

var Promise     = require('bluebird');
var querystring = require('querystring');
var request = require('request');
var http        = require('http');
var fs          = require('fs');
var externals   = require('./externalsConfig_client.js');

module.exports = 
{
	//GET PREDICTED USAGE
	getPredictedUsage: function(endpoint, t_target_unix)
	{
		return new Promise(function(resolve, reject)
		{
			request.post
			(
				externals.URL+"/api/getPredictedUsage",
				{ json: { endpoint : endpoint, t_target_unix : t_target_unix } },
				function (error, response, body) 
				{
					if (!error && response.statusCode == 200) 
					{
						average = body;
						resolve(average);
					}
				}
			);//end post
		});//end promise
	},//end get predicted usage



	//GET PREDICTED TEMP
	getPredictedTemp: function(zip, t_target_unix)
	{
		var weather;
		return new Promise(function(resolve, reject)
		{
			request.post
			(
				externals.URL+"/api/getPredictedTemp",
				{ json: { zip : zip, t_target_unix : t_target_unix } },
				function (error, response, body) 
				{
					if (!error && response.statusCode == 200) 
					{
						weather = body;
						resolve(weather); 
					}
				}
			);//end post
		});//end promise
	},//end get predicted temp
	


	//GET PREDICTED RATE
	getPredictedRate: function(zip, t_init_unix, t_final_unix, provider)
	{
		return new Promise(function(resolve, reject)
		{
			request.post
			(
				externals.URL+"/api/getPredictedRate",
				{ json: { zip : zip, t_init_unix : t_init_unix, t_final_unix : t_final_unix, provider : provider } },
				function (error, response, body) 
				{
					if (!error && response.statusCode == 200) 
					{
						average = body;
						resolve(average);
					}
				}
			);//end post
		});//end promise
	},//end get predicted rate

	//GET PREDICTED RATE SINGLE
	getPredictedRateSingle: function(zip, t_target_unix, provider)
	{
		return new Promise(function(resolve, reject)
		{
			request.post
			(
				externals.URL+"/api/getPredictedRateSingle",
				{ json: { zip : zip, t_target_unix : t_target_unix, provider : provider } },
				function (error, response, body) 
				{
					if (!error && response.statusCode == 200) 
					{
						average = body;
						resolve(average);
					}
				}
			);//end post
		});//end promise
	},//end get predicted rate

	//GET PREDICTED OPT DEGREE
	getPredictedOptDegree: function(zip, t_init_unix, t_target_unix, t_final_unix, provider)
	{
		return new Promise(function(resolve, reject)
		{
			request.post
			(
				externals.URL+"/api/getPredictedOptDegree",
				{ json: { zip : zip, t_init_unix : t_init_unix, t_target_unix : t_target_unix, t_final_unix : t_final_unix, provider : provider } },
				function (error, response, body) 
				{
					if (!error && response.statusCode == 200) 
					{
						degree = body;
						resolve(degree);
					}
				}
			);//end post
		});//end promise
	}//end get predicted opt degree

}//end module exports
