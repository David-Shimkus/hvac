// File: clientCodeExample.js
// 
// Revisions:
// 01/25/2017 | David Shimkus | Creation.
// 01/26/2017 | David Shimkus | Messed with nested return things.
// 01/31/2017 | David Shimkus | Need to implement the getOptDegree
// 02/06/2017 | David Shimkus | Directory Organization and Opt Degree
// 02/06/2017 | Brian Stevens | Minor changes.
// 03/29/2017 | David Shimkus | Work with the unix timestamp.  Removed the unused 'myMap' object.

require('datejs');
var predictions = require('./HVAConnect.js');
var conversion = require('./misc/unixJSConversion.js')

//declare two date objects
var now = new Date();
var then = new Date(now);
var target = new Date(now);
then.setHours(then.getHours() + 10); //datejs magic
target.setHours(now.getHours() + 3); //datejs magic

console.log("\nCLIENT CODE EXAMPLE\n");
console.log("now:    " + now);
console.log("then:   " + then);
console.log("target: " + target);
console.log("\n");

var t_other_js = new Date();
var t_target_js = new Date();
t_other_js.setDate(t_other_js.getDate() + 1); //datejs magic

//convert these guys to unix times:
var t_other = conversion.jsToUnix(t_other_js);
var t_target = conversion.jsToUnix(t_target_js);

//the zip code we will concern ourselves with
var zip = 62025;

//the particular endpoing we will use
//NOTE: the database is set up to use this
var endpoint = "endpoint_a";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!
//predicted weather
//!!!!!!!!!!!!!!!!!!!!!!!!!!!
predictions.getPredictedUsage(endpoint, t_target).then(function(average)
{
	var tempAvg = average;
	console.log("Predicted usage @ target:               " + tempAvg + " kwh");

	//!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//predicted temperature 
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!
	predictions.getPredictedTemp(zip, t_target).then(function(weather)
	{
		
		console.log("Predicted temperature @ target:         " + weather.currently.temperature + " deg F");	

		//!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//predicted rate
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!
		predictions.getPredictedRate(zip, now, then, "ameren").then(function(rateMap)
		{
			//uncomment to show how the working returned map
			//console.log("rateMap follows:");
			//console.log(rateMap);

			//!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//predicted rate single
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!
			predictions.getPredictedRateSingle(zip, t_target, "ameren").then(function(average)
			{
				console.log("Predicted rate @ target:                " + average + " $");

				//!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//predicted opt degree
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!
				predictions.getPredictedOptDegree(zip, now, t_target, then, "ameren").then(function(degree)
				{
					console.log("Predicted optimization degree @ target: " + degree + " %");
					console.log("\n");
				});

			});

		});

	});

});
