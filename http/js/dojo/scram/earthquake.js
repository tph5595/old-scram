define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.earthquake", null, {
		///
		/// This is the class for earthquakes
		///
		constructor: function(args){
			this.socket = args.socket;
			this.socket.on("message",lang.hitch(this,this.onMsg));
		},
		onMsg: function(event){
			var obj = JSON.parse(event.data);
			console.log("Earthquake",obj);
		}
	});
});
