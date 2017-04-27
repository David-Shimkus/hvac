// File: getPredictedUsage.js
// GetPredictedUsage() and GetPredictedExpense()
// Note: This file also uses the 'GetPredictedRate()' function
// Revisions:
// 12/10/2016 | David Shimkus | Creation.  
// 01/17/2017 | Alec Beyer    | Fixed the promise issue.
// 01/18/2017 | David Shimkus | Messed with a LOT of things... module.exports stuff
// 02/06/2017 | David Shimkus | organization
// 02/12/2017 | David Shimkus | Added Parameters to main function & date parsing for query 
// 02/23/2017 | Brian Stevens | Modularized Mongo
// 03/22/2017 | David Shimkus | Added comments.  Work on issue #2292.
// 03/29/2017 | David Shimkus | Removed console.log's.  Unix time conversion.  Mongo Modularity.

//includes
var mongoVars = require('../externalsConfig.js');
var Promise = require('bluebird');
var conversion = require('../misc/unixJSConversion.js');

//mongo global vars
var db = mongoVars.usageDB;
var collectionName = mongoVars.usageCollection;
var port = mongoVars.mongoPort;
var url = mongoVars.mongoUrl + mongoVars.usageDB;

//start up the mongo connection
var MongoClient = mongoVars.mongoClient;

//################## GET PREDICTED USAGE ##################
var usages = [];
var average;

module.exports = 
{
	//the function to export
	//endpoint e is a reference to a single home location or business (think node)
	//t_target is the timestamp (JS date object) of sometime in the future
	getPredictedUsage: function(endpoint, t_target_unix)
	{

		//convert the unix time to JS date object
		var t_target = conversion.unixToJs(t_target_unix);

		return new Promise(function(resolve, reject)
		{
			MongoClient.connect(url, function (err,db) 
			{
				if (err) 
				{
					console.log('Unable to connect to mongoDB server.  Error:', err);
				}
				else
				{
					//console.log('Connection established to', url);
				
					//do some work here with the database.
							
					//go to the usage_history collection
					var collection = db.collection(collectionName);

					//console.log("t_target.getMonth(): " + t_target.getMonth());
					//console.log("t_target.getDate(): " + t_target.getDate());
					//console.log("t_target.getHours(): " + t_target.getHours());


					//find the data we need to average
					collection.find({"MONTH": t_target.getMonth(), 
									 "DATE": t_target.getDate(), 
									 "HOUR": t_target.getHours()}).toArray(function (err, usages) 
					{
						if (err)
						{
							console.log(err);
						}
						else if (usages.length)
						{
							//console.log('Found some data.  Placed into "usages" variable.');
							//console.log('usages: ' + usages);
						}
						else 
						{
							console.log(usages);
							console.log('getPredictedUsage: No document(s) found with: ' + t_target);
						}
						
						var total = 0;
						//iterate through the list of json objects
						for (i = 0; i < usages.length; i++)
						{	
							//console.log('usages[i]' + usages[i]);
							total = total + usages[i].ACTUAL;
						}

						//calculate the average
						average = total/usages.length;

						resolve(average);

					});
				
					//console.log("--middle--");
					//console.log(usages);		
				
					//close connection
					db.close();
				}
			});
		}); 

	}//end findPredictedUsagePromise();
}
