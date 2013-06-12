define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket"], function(lang, Declare, Socket) {
	return Declare("scram.socket", null, {
		///
		/// This is the class for standing up all the sockets and dealing with the comms.
		///
		pollSocket : null,
		constructor : function(args) {
			this.pollSocket = new Socket("ws://127.0.0.1:8081");
			this.pollSocket.on("message", lang.hitch(this, this.onPollMsg));
			this.pollSocket.on("open", lang.hitch(this, this._opened));
		},
		_opened : function(event) {
			console.log("Poll Socket Open");
			this.pollSocket.send("test");
		},
		//dojo.connect(myScramSocket.onPollMsg, myFunc)
		onPollMsg: function(event){
			console.log("Poll Msg:",event.data)
		} //stub
	});
});
