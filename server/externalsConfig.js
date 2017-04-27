// Filename: externalsConfig.js
// HVAConnect Project
//	
// Revisions:
// 02/23/2017 | Brian Stevens | Creation
// 02/27/2017 | Brian Stevens | Changing use of this to be a config file for all exteral things that could be changed in the future
// 03/22/2017 | David Shimkus | PID coefficients added.
// 03/29/2017 | David Shimkus | PID variables modified to have different "K" values for each update function.

//--------------------------------------------------------------------------------
// Mongo Section
//--------------------------------------------------------------------------------

// Use to setup the client when someone wants it.
var mongodb = require('mongodb');

// Used for weather api
var forcastioTimeout = 10000 // in ms

//******RATES******
// Exports of varables to be used when require('./reqMongo.js')
exports.ratesDB = 'prices';
exports.ratesCollection = 'rtp_prices';

//******USAGES******
exports.usageDB = 'usage';
exports.usageCollection = 'usage_history';

//******TEMPERATURES******
exports.tempDB = 'n/a';
exports.tempCollection = 'n/a';

exports.mongoPort = 27017;
exports.mongoUrl = 'mongodb://localhost:27017/';
exports.mongoClient = mongodb.MongoClient;

//--------------------------------------------------------------------------------
// END Mongo 
//--------------------------------------------------------------------------------



//--------------------------------------------------------------------------------
// Weather related section
//--------------------------------------------------------------------------------

exports.formatZipAPI = function formatZipAPI(zip)
{
	var url = 'http://www.zipcodeapi.com/rest/qgnXmVPVdARfx4FVoKSG2cowk6lFav9ALwy8sn4FYWUv0Arpkk5nxuTRAfxKKHlw/info.json/'+zip+'/degrees';
	return url;
}

exports.apiOptions = { APIKey: '38d6d8bc6b9faa0425447a64a6279460', timeout: forcastioTimeout };

//--------------------------------------------------------------------------------
// END Weather 
//--------------------------------------------------------------------------------



//--------------------------------------------------------------------------------
// PID section
//--------------------------------------------------------------------------------

//these "K" variables can be tweaked to have the PID loop values fluctuate more/less
//higher K values = more fluctuation and vice versa
exports.Kp_usage = 0.01;
exports.Ki_usage = 0.01;
exports.Kd_usage = 0.01;

exports.Kp_rates = 0.01;
exports.Ki_rates = 0.01;
exports.Kd_usage = 0.01;

//these variables determine the "time increment" for each data media
//i.e. rates are updated every 24 hours for ameren, so the time increment is 24...
//...but the usages can be updated much updated much more frequently
//!!NOTE!! ALL VALUES ARE IN MINUTES
exports.rate_increment = 1440; //24 hours
exports.usage_increment = 5; //5 minutes
exports.temp_increment = 10; //10 minutes

//--------------------------------------------------------------------------------
// END PID section
//--------------------------------------------------------------------------------
