define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket","dojo/Evented"], function(lang, Declare, Socket, Evented) {
	return Declare("scram.sockets", [Evented], {
		///
		/// This is the class for standing up all the sockets and dealing with the comms.
		///
		pollSocket : null,
		valveSocket : null,
		pumpSocket : null,
		rodSocket : null,
		tankSocket : null,
		userSocket : null,
		earthquakeSocket : null,
		constructor : function(args) {
			//TODO: add emits for events
			this.pollSocket = new Socket("ws://192.168.6.200:8081");
			this.pollSocket.on("message", lang.hitch(this, this.onPollMsg));
			this.pollSocket.on("open", lang.hitch(this, this.onPollOpen));
			this.pollSocket.on("close", lang.hitch(this, this.onPollClose));
			this.pollSocket.on("error", lang.hitch(this, this.onPollErr));

			this.valveSocket = new Socket("ws://192.168.6.200:8082");
			this.valveSocket.on("message", lang.hitch(this, this.onValveMsg));
			this.valveSocket.on("open", lang.hitch(this, this.onValveOpen));
			this.valveSocket.on("close", lang.hitch(this, this.onValveClose));
			this.valveSocket.on("error", lang.hitch(this, this.onValveErr));

			this.pumpSocket = new Socket("ws://192.168.6.200:8083");
			this.pumpSocket.on("message", lang.hitch(this, this.onPumpMsg));
			this.pumpSocket.on("open", lang.hitch(this, this.onPumpOpen));
			this.pumpSocket.on("close", lang.hitch(this, this.onPumpClose));
			this.pumpSocket.on("error", lang.hitch(this, this.onPumpErr));

			this.rodSocket = new Socket("ws://192.168.6.200:8084");
			this.rodSocket.on("message", lang.hitch(this, this.onRodMsg));
			this.rodSocket.on("open", lang.hitch(this, this.onRodOpen));
			this.rodSocket.on("close", lang.hitch(this, this.onRodClose));
			this.rodSocket.on("error", lang.hitch(this, this.onRodErr));
			
			this.userSocket = new Socket("ws://192.168.6.200:8085");
			this.userSocket.on("message", lang.hitch(this, this.onUserMsg));
			this.userSocket.on("open", lang.hitch(this, this.onUserOpen));
			this.userSocket.on("close", lang.hitch(this, this.onUserClose));
			this.userSocket.on("error", lang.hitch(this, this.onUserErr));
			
			this.earthquakeSocket = new Socket("ws://192.168.6.200:8086");
			this.earthquakeSocket.on("message", lang.hitch(this, this.onEarthquakeMsg));
			this.earthquakeSocket.on("open", lang.hitch(this, this.onEarthquakeOpen));
			this.earthquakeSocket.on("close", lang.hitch(this, this.onEarthquakeClose));
			this.earthquakeSocket.on("error", lang.hitch(this, this.onEarthquakeErr));
			/*
			this.tankSocket = new Socket("ws://127.0.0.1:8087");
			this.tankSocket.on("message", lang.hitch(this, this.onTankMsg));
			this.tankSocket.on("open", lang.hitch(this, this.onTankOpen));
			this.tankSocket.on("close", lang.hitch(this, this.onTankClose));
			this.tankSocket.on("error", lang.hitch(this, this.onTankErr));
			*/
		},
		onPollMsg : function(event) {
		}, //stub
		onPollOpen : function(event) {
		}, //stub
		onPollClose : function(event) {
		}, //stub
		onPollErr : function(event) {
		}, //stub
		onValveMsg : function(event) {
		}, //stub
		onValveOpen : function(event) {
		}, //stub
		onValveClose : function(event) {
		}, //stub
		onValveErr : function(event) {
		}, //stub
		onPumpMsg : function(event) {
		}, //stub
		onPumpOpen : function(event) {
		}, //stub
		onPumpClose : function(event) {
		}, //stub
		onPumpErr : function(event) {
		}, //stub
		onRodMsg : function(event) {
		}, //stub
		onRodOpen : function(event) {
		}, //stub
		onRodClose : function(event) {
		}, //stub
		onRodErr : function(event) {
		}, //stub
		onUserMsg : function(event) {
		}, //stub
		onUserOpen : function(event) {
		}, //stub
		onUserClose : function(event) {
		}, //stub
		onUserErr : function(event) {
		}, //stub
		onEarthquakeMsg : function(event) {
		}, //stub
		onEarthquakeOpen : function(event) {
		}, //stub
		onEarthquakeClose : function(event) {
		}, //stub
		onEarthquakeErr : function(event) {
		}/*, //stub
		onTankMsg : function(event) {
		}, //stub
		onTankOpen : function(event) {
		}, //stub
		onTankClose : function(event) {
		}, //stub
		onTankErr : function(event) {
		} //stub
		*/
	});
});





