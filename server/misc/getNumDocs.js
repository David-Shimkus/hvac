// Filename: getNumDocs.js
//
// Sad that this warrants its own file.
//
// Revisions:
// 04/08/2017 | David Shimkus | Creation.


//TODO: change the 'includes' and 'mongo stuff' section to the passed in parameters (modularity)


//includes
var externals 		 = require('../externalsConfig.js');
var Promise 		 = require('bluebird');

//mongo stuff
var MongoClient      = externals.mongoClient;
var db 	    	     = externals.ratesDB;
var ratesCollection  = externals.ratesCollection;
var url              = externals.mongoUrl + db;


module.exports = 
{
	//used SOLELY to get the number of documents in the collection
	getNumDocs: function()
	{

		return new Promise(function(resolve, reject)
		{

			MongoClient.connect(url, function (err, db)
			{

				if(err)
				{
					console.log("Unable to connect to mongoDB server.  Error: ", err);
				}
				else
				{

					var collection = db.collection(ratesCollection);//TODO: use parameter instead

					collection.count({}, function(err, numOfDocs)
					{
						



						resolve(numOfDocs);


						
						db.close();


					});//end collection.count




				}//end else

			});//end connect()



		});//end return new Promise
	}
}