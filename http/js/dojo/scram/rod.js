define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.socket", null, {
		///
		/// This is the class for the rods
		///
		
		rods : null,
		state : null,
		_socket : null,
		
		
		constructor : function(args) {
			
		},
	
		
		_socketMessage : function(event){
			//Add a listener
			this.state = msg;
		},
		
		
		rodsUp : function(event){	
			console.log("Rods Up");
			//Will increase rods value by 1
			//Will update state
		},
		
		
		rodsDown : function(event){
			console.log("Rods Down");
			//Will decrease rods value by 1
			//Will update state
	
		}
		
		
	});
});
