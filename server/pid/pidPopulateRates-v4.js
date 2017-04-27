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
						
						console.log(rates);






					});//end collection.sort().toArray()

					//db.close();//TODO: needs to close at some point...

				}//end else

				//db.close();//TODO: needs to close at some point...

			});//end MongoClient.connect()

		});//end return new Promise

	}//end pidPopulateRates

	//,

}//end module.exports