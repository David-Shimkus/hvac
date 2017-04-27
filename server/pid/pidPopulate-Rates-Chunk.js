// Filename: pidPopulateRates.js
// HVAConnect Project
//
// Revisions:
// 02/28/2017 | David Shimkus | Creation.
// 03/22/2017 | David Shimkus | Included the other update functions.
// 04/07/2017 | David Shimkus | This file populates the DB based upon what is CURRENTLY in there.
// 04/07/2017 | David Shimkus | Still need to include the "K" values from the externals config.
// 04/07/2017 | Brian Stevens | Messed with the code a bit.  Imported Kp
// 04/08/2017 | David Shimkus | Original 'rates' array would only return first 1000 elements.

//includes
require('datejs');
var Promise 		 = require('bluebird');
var externals 		 = require('../externalsConfig.js');
//var pidRates  		 = require('../pid/pidUpdateRates.js');
var singlePrediction = require('../predictions/getPredictedRateSingle.js');
var conversion       = require('../misc/unixJSConversion.js');
//var numDocs          = require('../misc/getNumDocs.js');
var populateChunk    = require('./pidPopulate-Rates-Chunk.js');

//mongo stuff
var MongoClient      = externals.mongoClient;
var db 	    	     = externals.ratesDB;
var ratesCollection  = externals.ratesCollection;
var url              = externals.mongoUrl + db;

//mongo cursor variables
var count 	  = 0; 
var chunkSize = 900; //can honestly be set to 1000 MAX if necessary
var wow = 0;

module.exports = 
{
	//iterates through ITS PORTION OF the database as determined by increment and calcs errors
	populateChunk: function(zip, provider, chunkStart, chunkSize)
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

					collection.find().skip(chunkStart).limit(chunkSize - 1).each(function (err, rate)
					//collection.find().skip(i).limit(5).each(function (err, rate)
					{
						//console.log(rate);
						console.log("count: " + count + " i: " + i);
						count++;

						//sometimes this will find random null entries (?)
						if(rate == null)
						{
							wow++;
							console.log("WOW");
							console.log(wow);

						}
						else
						{		

							console.log("!!!!!!!!!!!!!!!!!!!!");

							//convert this row/doc into a unix timestamp
							var date = new Date();
							date.setYear(rate.YEAR);
							date.setMonth(rate.MONTH);
							date.setDate(rate.DATE);
							date.setHours(rate.HOUR);
							//date.setMinutes(rate.MINUTE); //this breaks the JS date object
							var date_unix = conversion.jsToUnix(date);

							console.log(date);

							singlePrediction.getPredictedRateSingle(zip, date_unix, "ameren").then(function(average)
							{

								console.log("prediction: " + average);


								//update


							});//end getPredRateSingle



						}//end else

					});//end collection.find().each();


					//db.close();

				}//end else

			});//end MongoClient.connect()
			
			//db.close();//TODO: needs to close at some point...

		});//end return new Promise

	}//end pidPopulateRates

}//end module.exports