// Filename: getPredictedRate.js
// HVAConnect Project
//
// Revisions:
// 01/31/2017 | David Shimkus | Creation.  Modified original to return a map.  Messed with Date objects.
// 02/01/2017 | David Shimkus | Ripped DB stuff and placed into separate file.
// 02/01/2017 | Brian Stevens | Edited the for loop so that it uses 'foreach' instead.
// 02/06/2017 | David Shimkus | Filename/folder renaming and organization.
// 03/29/2017 | David Shimkus | Minor code cleanup.  Added Unix timestamp conversions.

//includes
var mongodb = require('mongodb');
var Promise = require('bluebird');
require('datejs'); 
var single = require('./getPredictedRateSingle.js'); //needed to perform the actual DB querying
var conversion = require('../misc/unixJSConversion.js');

//################## GET PREDICTED RATE ##################
module.exports = 
{
	//t_init is the timestamp (unix timestamp) from the earlier point in the timeline
	//t_final is the later point in the timeline (another unix timestamp)
	getPredictedRate: function(zip, t_init_unix, t_final_unix, provider)
	{ 

		//convert the input unix timestamps to JS date objects
		var t_init = conversion.unixToJs(t_init_unix);
		var t_final = conversion.unixToJs(t_final_unix);

		//find the number of hours that are in between the t_init and t_final date objects
		//The subtraction returns the difference between the two dates in milliseconds. 
		//36e5 is the scientific notation for 60*60*1000, 
		//dividing by which converts the milliseconds difference into hours.
		var num_hours = Math.abs(t_init - t_final) / 36e5;

		//create new date objects for each hour in that range 
		//i.e. range [t_init, t_final]
		var dates = [t_init];
		for (var i = 1; i < num_hours; i++)
		{
			//datejs magic
			var temp = new Date(t_init);
			temp.setHours(temp.getHours() + i);
			dates.push(temp);
		}
		dates.push(t_final);

		//now 'dates' is an array of date objects between [t_init and t_final] 1hr increments
		//console.log("date array creation: "+dates);
		
		return new Promise(function(resolve, reject)
		{
			//this is the 'map' that will be returned to getOptDegree
			//the key/value pair is a JS date object/associated rate
			var rateMap = {};
			var count = 0;

			// Crescent Loop
			dates.forEach(function(listItem, index)
			{
				var listItem_unix = conversion.jsToUnix(listItem);
				single.getPredictedRateSingle(zip, listItem_unix, provider).then(function(average)
				{
					//uncomment the following for debugging
					//console.log("getPredictedRateSingle listItem: " + listItem);

					rateMap[listItem] = average;
					count++;

					if (count == dates.length)
					{
						resolve(rateMap);
					}

				});//end getPredictedRateSingle

			});// end Crescent ForEach

		});//end return new Promise & MongoClient.connect()

	}//end getPredictedRate

}

