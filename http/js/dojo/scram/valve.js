/**
 * @author DThomas
 */
define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.socket", null, {
		///
		/// This is the class for standing up all the sockets and dealing with the comms.
		///
		
		#current state of valve (open, off)
		valveState: null,
		
		#constructor takes in args
		constructor : function(args) {
			this.valve = new Socket("ws://127.0.0.1:8081");
			this.valve.on("valveOpen", lang.hitch(this, this._valveOpen));
			this.valve.on("valveClose", lang.hitch(this, this._valveClose));
		},
		_valveOpen : function(event) {
			console.log("Valve Opened");
			this.valve.send("Open");
		},
		_valveClose : function(event) {
			console.log("Valve Closed");
			this.valve.send("Close");
		}
		
	});
});
