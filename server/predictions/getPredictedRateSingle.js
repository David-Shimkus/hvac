// Filename: getPredictedRateSingle.js
// HVAConnect Project
//
// Revisions:
// 02/01/2017 | David Shimkus | Creation.
// 02/06/2017 | David Shimkus | Filename/folder renaming and organiztion.
// 02/12/2017 | David Shimkus | Comments Cleanup
// 02/23/2017 | Brian Stevens | Modularized Mongo
// 03/28/2017 | David Shimkus | Code cleanup and unix timestamp conversion.  Added zip as parameter.

//includes
var mongoVars = require('../externalsConfig.js');
var Promise = require('bluebird');
require('datejs'); //this does not need to be assigned to a variable b/c extends JS Dates
var conversion = require('../misc/unixJSConversion.js');

//mongo global vars
var db = mongoVars.ratesDB;
var collectionName = mongoVars.ratesCollection; //TODO: this needs to get passed in
var port = mongoVars.mongoPort;
var url = mongoVars.mongoUrl + mongoVars.ratesDB; 

//start up the mongo connection
var MongoClient = mongoVars.mongoClient; 

//################## GET PREDICTED RATE ##################
module.exports = 
{
	getPredictedRateSingle: function(zip, t_target_unix, provider)
	{
		//convert input unix timestamp to js date object
		var t_target = conversion.unixToJs(t_target_unix);

		//Uncomment for debugging
		//console.log("New call of getPredictedRateSingle with t_target: " + t_target);

		return new Promise(function(resolve, reject)
		{
			MongoClient.connect(url, function (err,db)
			{
				if (err)
				{
					console.log('Unable to connect to mongoDB server.  Error: ', err);
				}
				else
				{
					var collection = db.collection(collectionName);

					//1/25/2017 edit: removed the following and implemented my own - DS
					//pull past 7 days at that hour and average them to find a predicted rate.
					
					//console.log("############");
					//console.log("t_target.getMonth(): " + t_target.getMonth());
					//console.log("t_target.getDate(): " + t_target.getDate());
					//console.log("t_target.getHours(): " + t_target.getHours());


					//1/25/2017 pull that month, day, hour for each year available from the DB
					//perform the query
					collection.find({"MONTH": t_target.getMonth(),
									 "DATE" : t_target.getDate(),
									 "HOUR" : t_target.getHours()}).sort({"YEAR":-1}).toArray(function (err, rates)
					{
						if (err)
						{
							console.log("Problem pulling from collection" + err);
						}
						else if (rates.length)
						{
							//console.log("Found some data.  Placed into 'rates' variable.");
						}
						else
						{
							console.log("")
							console.log("getPredictedRateSingle: No document(s) found with: " + t_target);
						}

						if(rates[0].YEAR == t_target.getFullYear() && rates[0].ACTUAL)
						{
							//console.log(" --- WE HAD THAT RATE, HERE IT IS: "+rates[0].ACTUAL);
							resolve(rates[0].ACTUAL);
						}
						else
						{
							var total = 0;
							//iterate through the list of json objects
							for (i = 0; i < rates.length; i++)
							{
								//add each objects PRICE to the total variable
								total = total + rates[i].ACTUAL;
							}

							//calculate the average
							average = total/rates.length;

							resolve(average);
						}
					});

					//close connection
					db.close();

				}//end else
			
			db.close();
			
			});//end function(err,db) 

		});//end return new Promise & MongoClient.connect()
	}

}