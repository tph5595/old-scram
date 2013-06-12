define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.socket", null, {
		///
		/// This is the class for earthquakes
		///
		
		//Used to store info about the damage caused (to report back to server)
		_damage : null,
		
		
		constructor : function(args) {
			
		},
	
		
		beginEarthquake : function(event){
			
			//Start the earthquake
			
		},
		
		
		endEarthquake : function(event){
			
			//End the earthquake
			//Assess or cause damage here
			
		},
		
		
		reportDamage : function(event){
			
			//Send information back to the
			//server about what happened
			
		}
		
	});
});
