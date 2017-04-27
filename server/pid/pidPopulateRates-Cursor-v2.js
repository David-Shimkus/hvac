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
var Promise 		 = require('bluebird');
var externals 		 = require('../externalsConfig.js');
//var pidRates  		 = require('../pid/pidUpdateRates.js');
var singlePrediction = require('../predictions/getPredictedRateSingle.js');
var conversion       = require('../misc/unixJSConversion.js');
var numDocs          = require('../misc/getNumDocs.js');
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
	pidPopulateRates: function(zip, provider, increment)
	{

		console.log("&&&&&&&&&&&&&&&&&&&");

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

					numDocs.getNumDocs().then(function(numOfDocs)
					{
						//had to set up an external file just to get the total number of "rows"
						console.log(numOfDocs);

						//set up the collection for this mongo database
						var collection = db.collection(ratesCollection);

						for (var i = 0; i < numOfDocs; i += chunkSize)
						{
							if(i > numOfDocs)
							{
								var offset = i - numOfDocs;
								chunkSize = offset; //handles cursor does not null out
							}


							populateChunk.populateChunk(zip, provider, i, chunkSize);

						}//end for loop

						db.close();//TODO: needs to close at some point...

					});//end the .then of getNumDocs()

				}//end else

			});//end MongoClient.connect()
			
			//db.close();//TODO: needs to close at some point...

		});//end return new Promise

	}//end pidPopulateRates

}//end module.exports