// Filename: unixJsConversion.js
// HVAConnect Project
//
// Revisions:
// 03/29/2017 | Gabe Maurer | Creation. 

require('datejs');

//var unixTime = null;
//var jsTime = null;

module.exports = 
{
	unixToJs: function(unixTime)
	{
		jsDate = new Date(unixTime);
		//console.log(jsDate);
		return jsDate;
	
	},

	jsToUnix: function(jsTime)
	{
		var unixTime
		unixDate = Date.parse(jsTime).getTime();
		//console.log(unixDate);
		return unixDate;
	}

}//end module