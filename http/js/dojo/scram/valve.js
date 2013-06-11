/**
 * @author DThomas
 */
define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.socket", null, {
		///
		///Valve class
		///
		
		valve: null,
		//current state of valve (open, off)
		valveState: null,
		_socket: null,
		
		//constructor takes in args
		constructor : function(args) {
			
			//don't need dis crap here
			//this.valve = new Socket("ws://127.0.0.1:8081");
			//this.valve.on("valveOpen", lang.hitch(this, this._valveOpen));
			//this.valve.on("valveClose", lang.hitch(this, this._valveClose));
			
			//This will be used in collection
			//this._socket = (args.socket);
		},
		
		_socketMessage: function(event){
			//Listenurr
			this.valveState = msg;
		},
		
		valveOpen: function(event) {
			console.log("Valve Opened");
			//this.valve.send("Open");
			//Will update valve state to open
		},
		
		valveClose: function(event) {
			console.log("Valve Closed");
			//this.valve.send("Close");
			//will update valve state to closed
		}
		
	});
});
