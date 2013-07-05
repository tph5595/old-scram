define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket", "dojo/Evented"], 
function(lang, Declare, Socket, Evented) {
	return Declare("scram.earthquake", [Evented], {
		///
		/// This is the class for earthquakes
		///
		constructor: function(args){
			this.socket = args.socket;
			this.socket.on("message",lang.hitch(this,this.onMsg));
		},
		onMsg: function(event){
			var obj = JSON.parse(event.data);
			this.earthquake = obj['Earthquake']
			console.log("Earthquake",obj);
			this.emit("quake", {});
		}
	});
});
