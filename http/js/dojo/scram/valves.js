define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin",
"scram/valve","dojo/text!scram/templates/valves.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin,Valve,template) {
	return Declare("scram.valves", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the valves
		///
		templateString:template,
		socket : null,
		poll:null,

		constructor : function(args) {
			this.socket = args.socket;
			this.poll = args.poll;
		},
		postCreate : function() {
			this.hpiTankValveDAP = new Valve({
				'socket' : this.socket,
				'poll' : this.poll,
				'valveId' : 'hpiTank',
				'title': 'HPI Tank Valve',
				valveClass : 'hpitankvalve valvefalse z2',
			}, this.hpiTankValveDap);
			this.pressurizerValve = new Valve({
				'socket' : this.socket,
				'poll' : this.poll,
				'valveId' : 'pressurizerValve',
				'title': 'Pressurizer Tank Valve',
				valveClass : 'pressurizertankvalve valvefalse z2',
			}, this.pressurizerValveDAP);
			this.auxTankValve = new Valve({
				'socket' : this.socket,
				'poll' : this.poll,
				'valveId' : 'auxTankValve',
				'title': 'Auxiliary Tank Valve',
				valveClass : 'auxtankvalve valvefalse z2',
			}, this.auxTankValveDAP);
			
			this.inherited(arguments);
		}
		


	});
});
