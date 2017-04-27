// Filename: pidPopulateRates.js
// HVAConnect Project
//
// Revisions:
// 02/28/2017 | David Shimkus | Creation.
// 03/22/2017 | David Shimkus | Included the other update functions.
// 04/07/2017 | David Shimkus | This file populates the DB based upon what is CURRENTLY in there.
// 04/07/2017 | David Shimkus | TODO: include the "K" values from the externals config.
// 04/07/2017 | David Shimkus | Ripped out the I and D portions of the error correction.  Just P now.

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

//pid stuff
var Kp = externals.Kp_rates;
//var Ki = externals.Ki_rates;
//var Kd = externals.Kd_rates;

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

						
						
						//construct the js date object for each row
						rates_js = [];
						for(var i = 0; i < rates.length; i++)
						{
							//the JS date object we will use as our base case
							var rowDate = new Date();

							rowDate.setYear(rates[i].YEAR);
							rowDate.setMonth(rates[i].MONTH);
							rowDate.setDate(rates[i].DATE);
							rowDate.setHours(rates[i].HOUR);
							rowDate.setMinutes(rates[i].MIN);
							//we don't really need to worry about seconds and milliseconds for rates

							//convert this guy to the unix timestamp
							var rowDate_unix = conversion.jsToUnix(rowDate);
							console.log("rowDate_unix: " + rowDate_unix);

							//fire the prediction

							singlePrediction.getPredictedRateSingle(zip, rowDate_unix, provider).then(function(average)
							{
								//the "raw" prediction for the very first element
								var prediction = average;

								//TODO: update the prediction with the error

								console.log("rowDate.getFullYear(): " + rowDate.getFullYear());
								console.log("rowDate.getMonth(): " + rowDate.getMonth());
								console.log("rowDate.getDate(): " + rowDate.getDate());
								console.log("rowDate.getHours(): " + rowDate.getHours());

								
								

								collection.update(
								{
									
									"YEAR": rowDate.getFullYear(),
									"MONTH" : rowDate.getMonth(),
									"DATE" : rowDate.getDate(),
									"HOUR" : rowDate.getHours()
								},
								{ $set: {"PREDICTED":prediction}}).then(function()
								{
									if(i == rates.length)
									{
										db.close();
									}
								});//end the .then() of the update() function

							});//end the .then() of the getPredictedRateSingle
						}

					});//end collection.sort().toArray()

					//db.close();//TODO: needs to close at some point...

				}//end else

				//db.close();//TODO: needs to close at some point...

			});//end MongoClient.connect()

		});//end return new Promise

	}//end pidPopulateRates

	//,

}//end module.exports