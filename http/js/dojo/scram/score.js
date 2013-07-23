define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", 
"dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dojo/text!scram/templates/score.html"], 
function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.score", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the score
		///
		templateString : template,
		poll : null,
		totmeltdowns : null,
		totexplosions : null,
		totearthquakes : null,
		totsteamvoiding : null,
		totsimtime : null,
		totsim : null,

		constructor : function(args) {
			this.poll = args.poll;
			this.totmeltdowns = 0;
			this.totexplosions = 0;
			this.totearthquakes = 0;
			this.totsteamvoiding = 0;
			this.totsim = 0;
			this.poll.on('message', lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.meltdownDAP.innerHTML = 'Meltdowns: ' + this.totmeltdowns;
			this.explosionDAP.innerHTML = 'Pressure Explosions: ' + this.totexplosions;
			this.earthquakeDAP.innerHTML = 'Earthquakes: ' + this.totearthquakes;
			this.steamvoidingDAP.innerHTML = 'Steam Voiding: ' + this.totsteamvoiding;
			this.totalsimtimeDAP.innerHTML = 'Total Simtime Voiding: ' + this.totsim;
			this.inherited(arguments);
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.totmeltdowns = obj['totmeltdowns'];
			this.totexplosions = obj['totexplosions'];
			this.totearthquakes = obj['totearthquakes'];
			this.totsteamvoiding = obj['totsteamvoiding'];
			this.totsim = obj['totsim'];
			this.increment();
		},
		increment : function() {
						
			this.meltdownDAP.innerHTML = 'Meltdowns: ' + this.totmeltdowns;
			this.explosionDAP.innerHTML = 'Pressure Explosions: ' + this.totexplosions;
			this.earthquakeDAP.innerHTML = 'Earthquakes: ' + this.totearthquakes;
			this.steamvoidingDAP.innerHTML = 'Steam Voiding Time: ' + this.totsteamvoiding;
			this.totalsimtimeDAP.innerHTML = 'Total Simtime: ' + this.totsim;

		}
	});
});
