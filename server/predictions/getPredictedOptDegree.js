// Filename: getOptimizationDegree.js
// Note: This file also uses the 'getPredictedRate()' function
//
// Revisions:
// 01/25/2017 | Brian Stevens | Refacored into module exports
// 01/25/2017 | Brian Stevens | Initial work on async+promises
// 01/26/2017 | Brian Stevens | Code in place for future timestamps, logically makes sense, cannot test yet
// 02/06/2017 | David Shimkus | Filename/folder renaming and organization.
// 02/06/2017 | Brian Stevens | Fixed Opt Degree calculation. 
// 03/28/2017 | David Shimkus | Minor code cleanup.  Added the UnixTimestamp conversion.

var Promise = require('bluebird');
var rate = require('./getPredictedRate.js');
var conversion = require('../misc/unixJSConversion.js');
	
module.exports =
{
	//input: 6-digit zipcode, unix timestamps t_initial, t_target, t_final, unique provider
	//output: how "optimal" t_target is in relation to all times in range [t_initial, t_final]
	getPredictedOptDegree: function(zip, t_initial_unix, t_target_unix, t_final_unix, provider)
	{

		//convert the input unix timestamps to JS date objects
		var t_initial = conversion.unixToJs(t_initial_unix);
		var t_target  = conversion.unixToJs(t_target_unix);
		var t_final   = conversion.unixToJs(t_final_unix);

		return new Promise(function(resolve,reject)
		{	

			rate.getPredictedRate(zip, t_initial, t_final, provider ).then(function(rateMap)
			{
				min = 99999; 
				for(item in rateMap)
				{
					if(rateMap[item] < min)
					{
						min = rateMap[item];
					}
				}

				max = 0;
				for(item in rateMap)
				{
					if(rateMap[item] > max)
					{
						max = rateMap[item];
					}
				}

				//uncomment the following for debugging
				//console.log("min: "+min);
				//console.log("tar: "+rateMap[t_target]);
				//console.log("max: "+max);

				degree = ( (max - rateMap[t_target]) / (max-min) * 100 ).toFixed(4); 
				resolve(degree);
			});

		});//end Promise

	}//end getOptimizationDegree

}//end module.exports