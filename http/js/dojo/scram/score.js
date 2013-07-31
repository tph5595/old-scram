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
			this.poll.on('message', lang.hitch(this, this.windowMove));
		},
		postCreate : function() {
			this.meltdownDAP.innerHTML = 'Meltdowns: ' + this.totmeltdowns;
			this.explosionDAP.innerHTML = 'Pressure Explosions: ' + this.totexplosions;
			this.earthquakeDAP.innerHTML = 'Earthquakes: ' + this.totearthquakes;
			this.steamvoidingDAP.innerHTML = 'Steam Voiding Time: ' + this.totsteamvoiding;
			this.totalsimtimeDAP.innerHTML = 'Total Simtime: ' + this.totsim;
			this.inherited(arguments);
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.totmeltdowns = obj['totmeltdowns'];
			this.totexplosions = obj['totexplosions'];
			this.totearthquakes = obj['totearthquakes'];
			this.totsteamvoiding = obj['totsteamvoiding'];
			//this.totsimTemporary = obj['totsim'];
			
			var totsteamvoidingMins = Math.floor(Math.round(obj['totsteamvoiding']) / 60 % 60);
			var totsteamvoidingHours = Math.floor(Math.round(obj['totsteamvoiding']) / 3660);
			var totsteamvoidingSeconds = Math.floor(Math.round(obj['totsteamvoiding']) % 60);
			var totsteamvoidingD = new Date();
			totsteamvoidingD.setHours(totsteamvoidingHours);
			totsteamvoidingD.setMinutes(totsteamvoidingMins);
			totsteamvoidingD.setSeconds(totsteamvoidingSeconds);
			this.totsteamvoiding= totsteamvoidingD.toTimeString().split(" ")[0];
			
			var totSimMins = Math.floor(Math.round(obj['totsim']) / 60 % 60);
			var totSimHours = Math.floor(Math.round(obj['totsim']) / 3660);
			var totSimSeconds = Math.floor(Math.round(obj['totsim']) % 60);
			var totSimD = new Date();
			totSimD.setHours(totSimHours);
			totSimD.setMinutes(totSimMins);
			totSimD.setSeconds(totSimSeconds);
			this.totsim= totSimD.toTimeString().split(" ")[0];
			
			
			
			this.increment();
		},
		windowMove : function(){
			this.windowWidth = window.innerWidth;
			this.widthCheck = 1920
			if (this.windowWidth < this.widthCheck){
				domClass.remove(this.titleDAP);
				domClass.remove(this.meltdownDAP);
				domClass.remove(this.explosionDAP);
				domClass.remove(this.earthquakeDAP);
				domClass.remove(this.steamvoidingDAP);
				domClass.remove(this.totalsimtimeDAP);
				
				domClass.add(this.titleDAP, 'modifiedscorestitle');
				domClass.add(this.meltdownDAP, 'modifiedscores');
				domClass.add(this.explosionDAP, 'modifiedscores');
				domClass.add(this.earthquakeDAP, 'modifiedscores');
				domClass.add(this.steamvoidingDAP, 'modifiedscores');
				domClass.add(this.totalsimtimeDAP, 'modifiedscores');
			}
			else{
				domClass.remove(this.titleDAP);
				domClass.remove(this.meltdownDAP);
				domClass.remove(this.explosionDAP);
				domClass.remove(this.earthquakeDAP);
				domClass.remove(this.steamvoidingDAP);
				domClass.remove(this.totalsimtimeDAP);
				
				domClass.add(this.titleDAP, 'scorestitle');
				domClass.add(this.meltdownDAP, 'scores');
				domClass.add(this.explosionDAP, 'scores');
				domClass.add(this.earthquakeDAP, 'scores');
				domClass.add(this.steamvoidingDAP, 'scores');
				domClass.add(this.totalsimtimeDAP, 'scores');
			}
		},
		increment : function() {
						
			this.meltdownDAP.innerHTML = 'Meltdowns: ' + this.totmeltdowns;
			this.explosionDAP.innerHTML = 'Pressure Explosions: ' + this.totexplosions;
			this.earthquakeDAP.innerHTML = 'Earthquakes: ' + this.totearthquakes;
			this.steamvoidingDAP.innerHTML = 'Total Time Steam Voiding: ' + this.totsteamvoiding;
			this.totalsimtimeDAP.innerHTML = 'Total Simtime: ' + this.totsim;

		}
	});
});
