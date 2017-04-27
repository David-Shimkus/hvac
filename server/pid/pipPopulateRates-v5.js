// Filename: pidPopulateRates-v5.js
// HVAConnect Project
//
// Revisions:
// 02/28/2017 | David Shimkus | Creation.
// 03/22/2017 | David Shimkus | Included the other update functions.
// 04/07/2017 | David Shimkus | This file populates the DB based upon what is CURRENTLY in there.
// 04/07/2017 | David Shimkus | TODO: include the "K" values from the externals config.

//includes
var externals 		 = require('../externalsConfig.js');
var pidRates  		 = require('../pid/pidUpdateRates.js');
var singlePrediction = require('../predictions/getPredictedRateSingle.js');
var conversion       = require('../misc/unixJSConversion.js');

//mongo stuff
var MongoClient      = externals.mongoClient;
var db 	    	     = externals.ratesDB;
var ratesCollection  = externals.ratesCollection;
var url              = externals.mongoUrl + db;

module.exports = 
{
	//iterates through ENTIRE database and calcs errors
	pidPopulateRates: function(zip, provider)
	{
		return new Promise(function(resolve, reject)
		{
			MongoClient.connect(url, function (err,db)
			{
				if(err)
				{
					console.log('Unable to connect to mongoDB server. Error: ', err);
				}
				else
				{
					var collection = db.collection(ratesCollection);

					//sort the ENTIRE database in ascending order of the DATE, MONTH, YEAR, HOUR
					collection.find().sort(
					{
						"YEAR" : 1,
						"MONTH": 1,
						"DATE" : 1,
						"HOUR" : 1,
						"MIN"  : 1 //not really necessary for ameren rates
					}).toArray(function(err, rates)
					{
						//console.log(rates);
						//OK the 'rates' variable has it all sorted appropriately

						//the JS date object we will use as our base case
						var rowDate = new Date();
						
						//construct the js date object for that row
						rowDate.setYear(rates[0].YEAR);
						rowDate.setMonth(rates[0].MONTH);
						rowDate.setDate(rates[0].DATE);
						rowDate.setHours(rates[0].HOUR);
						rowDate.setMinutes(rates[0].MIN);
						//we don't really need to worry about seconds and milliseconds for rates

						//convert that js date object to unix timestamp
						var rowDate_unix = conversion.jsToUnix(rowDate);


						singlePrediction.getPredictedRateSingle(zip, rowDate_unix, provider).then(function(average)
						{
							//the "raw" prediction for the very first element
							var prediction = average;

							//Uncomment the following for debugging:
							/*
							console.log("Inside the singlePrediction");
							var offset = rowDate.getTimezoneOffset();
							rowDate.setMinutes(rowDate.getMinutes() - offset);
							console.log(rowDate);
							console.log("rowDate.getMonth(): " + rowDate.getMonth());
							console.log(prediction);
							*/

							//calculate the errors for the BASE CASE
							var p_first = prediction - rates[0].ACTUAL;
							var i_first = p_first;
							var d_first = 0;

							//we need to update that very first row so that all other rows
							//can utilize that data with promises cascading in a sliding window fashion
							collection.update({"_id":rates[0]._id}, {$set: {"ERROR": p_first, "ERROR_RUN_SUM": i_first, "ERROR_LAST_CHANGE": d_first}}).then(function()
							{
								
								//uncomment the following for debugging purposes:
								/*
								console.log("We make it this far...");
								console.log("rates[0]._id: " + rates[0]._id);
								console.log("p_first: " + p_first);
								console.log("i_first: " + i_first);
								console.log("d_first: " + d_first);
								*/

								//chop out the first element (already handled it as base case)
								rates = rates.slice(1, rates.length);

								//crescent loop
								rates.forEach(function(dateItem, index)
								{

									//construct the JS date object from the JSON
									var iDate = new Date();
									iDate.setYear(dateItem.YEAR);
									iDate.setMonth(dateItem.MONTH);
									iDate.setDate(dateItem.DATE);
									iDate.setHours(dateItem.HOUR);
									iDate.setMinutes(dateItem.MIN);//not really necessary
									//potential TODO: secs/milliseconds

									//TODO: not all values are getting printed out...
									console.log(iDate);

									//set up "t_previous" for 'iDate'
									//SHOULD handle edge cases
									var iDate_prev = new Date(iDate);
									iDate_prev.setHours(iDate_prev.getHours() - 1);

									console.log("iDate_prev.getFullYear():  " + iDate_prev.getFullYear());
									console.log("iDate_prev.getMonth(): " + iDate_prev.getMonth());
									console.log("iDate_prev.getDate():  " + iDate_prev.getDate());
									console.log("iDate_prev.getHours(): " + iDate_prev.getHours());


									//query the DB for the iDate_prev (we will need it for i & d)
									collection.find(
									{
										"YEAR" : iDate_prev.getFullYear(),
										"MONTH": iDate_prev.getMonth(),
										"DATE" : iDate_prev.getDate(),
										"HOUR" : iDate_prev.getHours()
										//"MIN"  : iDate_prev.getMinutes() //probably don't need this

									}).toArray(function (err, rate_previous)
									{

										//console.log("We make it this far.................");
										//console.log("rate_previous.length: " + rate_previous.length);
										console.log(rate_previous[0]);

										//rate_previous should be an array of length 1
										//rate_previous[0] should be the JSON object returned from mongo
										console.log("rate_previous[0]" + rate_previous[0]);
										if(rate_previous[0] == null)
										{
											console.log("*******" + rate_previous[0]);
										}

										//error variables from the previous entry to be added
										var i = rate_previous[0].ERROR_RUN_SUM;
										var d = rate_previous[0].ERROR;

										//convert the iDate to unix for the predictive function
										var iDate_unix = conversion.jsToUnix(iDate);

										//calculate the raw prediction for the current iDate
										singlePrediction.getPredictedRateSingle(zip, iDate_unix, provider).then(function(average)
										{
											//the "raw" prediction for 'iDate' element	
											var iDate_prediction = average;

											//calculate the proportion
											var p = iDate_prediction - dateItem.ACTUAL;
											
											//calculate the integral
											var i = i + dateItem.ERROR_RUN_SUM;

											//calculate the derivative
											var d = iDate.ERROR - d;

											//update these values in the database:
											collection.update({"_id":dateItem._id}, {$set: {"ERROR": p, "ERROR_RUN_SUM": i, "ERROR_LAST_CHANGE": d}}).then(function()
											{

												console.log("!!!!!!!!!!!!! WE MADE IT !!!!!!!!!!!!");

											});//end collection.update.then() for the dateItem

										});//end getPredRateSingle() for the 'iDate'//

									});//end toArray() for rate_previous

									//db.close();

								});//end crescent foreach

								//db.close(); TODO: we have to close the db somewhere??

							});//end the base case's collection.update()

						});//end the .then() of the getPredictedRateSingle

					});//end collection.sort().toArray()

					//db.close();//TODO: needs to close at some point...

				}//end else

				//db.close();//TODO: needs to close at some point...

			});//end MongoClient.connect()

			db.close();

		});//end return new Promise

	}//end pidPopulateRates

	//,

}//end module.exports