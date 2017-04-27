// Filename: pidUpdateRatesStub.js
// HVAConnect Project
//
// Revisions:
// 02/28/2017 | David Shimkus | Creation.
// 03/22/2017 | David Shimkus | Included the other update functions.

//includes
var externals = require('../externalsConfig.js');
var pidRates  = require('../pid/pidPopulateRates-Cursor-v2.js');

//mongo stuff
var ratesDB 	    = externals.ratesDB;
var ratesCollection = externals.ratesCollection;

//set up the theoretical list of JS date objects
//TODO: pass this in from rateScrapeAndInsert
var dates = [];
dates[0] = new Date();
dates[0].setHours(0);

//set up the theoretical list of Rates
//TODO: pass this in from rateScrapeAndInsert
var rates = [];

for(i = 0; i < 24; i++)
{
	dates[i] = new Date();
	dates[i].setHours(dates[i].getHours() + i);

	
	

}

//now the variable 'dates' should be populated accordingly
//let's make up some rates.

//console.log(dates); //these are in UTC... 5 hours ahead of CDT


pidRates.pidPopulateRates(62234, 'ameren');
