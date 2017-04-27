// File: clientCodeExample.js
// 
// Revisions:
// 01/25/2017 | David Shimkus | Creation.
// 01/26/2017 | David Shimkus | Messed with nested return things.
// 01/31/2017 | David Shimkus | Need to implement the getOptDegree
// 02/06/2017 | David Shimkus | Directory Organization and Opt Degree
// 02/06/2017 | Brian Stevens | Minor changes.
// 03/29/2017 | David Shimkus | Work with the unix timestamp.  Removed the unused 'myMap' object.
// 04/08/2017 | Brian Stevens | Overhaul to use server instead of local

require('datejs');
var predictions = require('./HVAConnect_client.js');
var conversion = require('./misc/unixJSConversion.js')

var t_now_js = new Date();
var t_target_js = new Date();
var t_then_js = new Date();
t_target_js.setHours(t_target_js.getHours() + 1); 
t_then_js.setDate(t_then_js.getDate() + 1); 

console.log("\nCLIENT CODE EXAMPLE\n");
console.log("now:    " + t_now_js);
console.log("target: " + t_target_js);
console.log("then:   " + t_then_js);
console.log("\n");

//convert these guys to unix times:
var t_now_unix = conversion.jsToUnix(t_now_js);
var t_then_unix = conversion.jsToUnix(t_then_js);
var t_target_unix = conversion.jsToUnix(t_target_js);

//the zip code we will concern ourselves with
var zip = 62062;

//the particular endpoing we will use
//NOTE: the database is set up to use this
var endpoint = "endpoint_a";

//the energy provider
var provider = "Ameren"

//!!!!!!!!!!!!!!!!!!!!!!!!!!!
//predicted weather
//!!!!!!!!!!!!!!!!!!!!!!!!!!!
predictions.getPredictedTemp(zip, t_target_unix).then(function(weather)
{
	console.log("Predicted temperature: " + weather.currently.temperature + " deg F");	

	predictions.getPredictedUsage(zip, t_target_unix).then(function(average)
	{
		console.log("Predicted usage:       " + average.average + " kWh");	

		predictions.getPredictedRate(zip, t_now_unix, t_then_unix, provider).then(function(average)
		{
			console.log("Predicted rate:        " + average.average[t_target_js] + " USD/kwh");	

			predictions.getPredictedRateSingle(zip, t_target_unix, provider).then(function(average)
			{
				console.log("Predicted rate single: " + average.average + " USD/kwh");

				predictions.getPredictedOptDegree(zip, t_now_unix, t_target_unix, t_then_unix, provider).then(function(degree)
				{
					console.log("Predicted opt deg:     " + degree.degree + "%");	

				});//end predictUsage

			});

		});//end predictUsage

	});//end predictUsage

});//end predictTemp

