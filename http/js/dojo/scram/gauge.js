define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.socket", null, {
		///
		/// This is the class for the gauges
		///
		
		gauge : null,
		state : null,
		_socket : null,
		
		
		constructor : function(args) {
			
		},
	
		
		_socketMessage : function(event){
			//Add a listener
			this.state = msg;
		},
		
		
		gaugeUp : function(event){	
			console.log("Gauge Increase");
			//Will increase gauge value by 1
			//Will update state
		},
		
		
		gaugeDown : function(event){
			console.log("Gauge Decrease");
			//Will decrease gauge value by 1
			//Will update state
	
		}
		
		
	});
});
