define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dojo/text!scram/templates/score.html"], function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.score", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the score
		///
		templateString : template,
		poll : null,
		earthquakeSocket : null,
		meltdownCounter : null,
		explosionCounter : null,
		earthquakeCounter : null,
		steamvoidingCounter : null,
		totalsimtimeCounter : null,

		constructor : function(args) {
			this.poll = args.poll;
			this.earthquakeSocket = args.earthquakeSocket;
			this.meltdownCounter = 0;
			this.explosionCounter = 0;
			this.earthquakeCounter = 0;
			this.steamvoidingCounter = 0;
			this.totalsimtimeCounter = 0;
			this.poll.on('message', lang.hitch(this, this.pollMsg));
			this.earthquakeSocket.on('message', lang.hitch(this, this.earthquakeMsg));
		},
		postCreate : function() {
			this.meltdownDAP.innerHTML = 'Meltdowns: ' + this.meltdownCounter;
			this.explosionDAP.innerHTML = 'Pressure Explosions: ' + this.explosionCounter;
			this.earthquakeDAP.innerHTML = 'Earthquakes: ' + this.earthquakeCounter;
			this.steamvoidingDAP.innerHTML = 'Steam Voiding: ' + this.steamvoidingCounter;
			this.totalsimtimeDAP.innerHTML = 'Total Simtime Voiding: ' + this.totalsimtimeCounter;
			this.inherited(arguments);
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.meltdown = obj['meltdown'];
			this.explosion = obj['explosion'];
			this.steamvoiding = obj['steamvoiding'];
			this.increment();
		},
		earthquakeMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.earthquake = obj['quake'];
			this.increment();
		},
		increment : function() {
			if (this.meltdown == true) {
				this.meltdown = false;
				this.meltdownCounter += 1;
			};
			if (this.explosion == true) {
				this.explosion = false;
				this.explosionCounter += 1;
			};
			if (this.earthquake == true) {
				this.earthquake = false
				this.earthquakeCounter += 1;
			};
			if (this.steamvoiding == true) {
				this.steamvoiding = false
				this.steamvoidingCounter += 1;
			};
			
			this.totalsimtimeCounter += 1;
			
			this.meltdownDAP.innerHTML = 'Meltdowns: ' + this.meltdownCounter;
			this.explosionDAP.innerHTML = 'Pressure Explosions: ' + this.explosionCounter;
			this.earthquakeDAP.innerHTML = 'Earthquakes: ' + this.earthquakeCounter;
			this.steamvoidingDAP.innerHTML = 'Steam Voiding Time: ' + this.steamvoidingCounter;
			this.totalsimtimeDAP.innerHTML = 'Total Simtime: ' + this.totalsimtimeCounter;

		}
	});
});
