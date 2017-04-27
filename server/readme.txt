Project HVAC Sart Dev
SIUE F16/S17

Team Members:
David Shimkus
Alec Beyer
Brian Stevens
Gabe Maurer

Revisions:
2/12/17 | David Shimkus | Screenshot from master revision #5aa206e7
4/05/17 | Gabe Maurer   | Merged both readmes

Primary functionality:

################################################################################################

    getPredictedTemp(zip z, timestamp t) 

    returns temp in Fahrenheit of the zipcode area with timestamp set for a future JS 
    date object

    TODO: Currently this function only returns the CURRENT temperature of the given zip.


################################################################################################

	getPredictedUsage(endpoint e, timestamp t) 

    returns usage in kwh of a specific endpoint e (i.e. a single household home or single 
    customer) for a given future timestamp (JS date object)

    TODO: the endpoint is currently just an empty argument.  for a final product there will 
    have to be some kind of demo customer database set up where each 'e' will be some unique
    identifier to a specific customer.


################################################################################################

	getPredictedRate(zip z, timestamp t_init, timestamp t_final, provider p)    

    TODO: same endpoing issue as above.  machine learning.  PID system??

    NOTE: for this project we are only implementing fucntionality for a specific provider type
    and that is if p = "ameren".  Currently there is a lot of hard code to scrape rates from 
    Ameren's website, and if another electricity provider is to be used an entirely new scraper
    will have to developed.


################################################################################################

    getOptDegree(zip z, timestamp t_init, timestamp t_target, timestamp t_final, provider p)

    returns value [0-100] based on how optimal t_target is in relation to t_init & t_final

    NOTE: this is the team's idea of how to handle whether or not to turn on an appliance.
    Every hour has an associated "optimization degree" between [0,100].  100 being the "most 
    optimal" time to use an appliance (i.e. the cheapest time to consume electricity) and 0 
    being the most expensive time (i.e. the LEAST optimal).

    NOTE2: based on a customer's comfort preference or how much they are willing to spend will
    determine the 'cutoff' that they will allow their optimization degree to be at.
    i.e. somebody who doesnt care how much it costs to keep their temperature within a very
    tiny range of temperatures will still turn on his appliances even if getOptDegree returns
    very close to zero.  
    Similarly, somebody who wants to pinch pennies will not want to turn on appliances unless
    getOptDegree returns a value closer to 100.

################################################################################################


How to use HVACsmartdev
	
Quick Start:
	
Firstly, look at the clientCodeExample.js for query examples
	
Secondly, open the externalsConfig and input your
	
	- mongo Datebase names
	
	- mongo Datebase collections 
	
	- mongo port number
	
	- mongo URL and client
	
Important file explaination:
	
clientCodeExample: example usage of the predictive functions
	
externalsConfig: the global variables you may need to change for your data
	
HVAConnect: Include this in any files using the predictive functions. This is the gateway to the functions(this is shown in the clientCodeExample file)
	
rateScrapeAndInsert: gets data from the ameren site (for other sites you will need a new scraper or way of filling out your database)
	
getPredictedOptDegree: finding the optimization degree for how effective the cost of electricity at a certain time is
	
getPredictedRate & getPredictedRateSingle: finding an average rate for a date based on previous dates rates
	
getPredictedTemp: getting the temp for a date 
	
getPredictedUsage: finding the ideal time to use electricty  