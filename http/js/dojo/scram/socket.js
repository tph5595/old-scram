define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scam.socket", null, {
		///
		/// This is the class for standing up all the sockets and dealing with the comms.
		///
		pollSocket : null,
		constructor : function(args) {
			this.pollSocket = new Socket("ws://127.0.0.1:8081");
			this.pollSocket.on("message", lang.hitch(this, this._message));
			this.pollSocket.on("open", lang.hitch(this, this._opened));
		},
		_opened : function(event) {
			console.log("Poll Socket Open");
			this.pollSocket.send("test");
		},
		_message : function(event) {
			var data = event.data;
			console.log("Poll Data", data);
		}
	});
});
