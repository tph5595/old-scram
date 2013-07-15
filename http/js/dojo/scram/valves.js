define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented",
"scram/valve","dojo/text!scram/templates/valves.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, Evented, Valve,template) {
	return Declare("scram.valves", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
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
			this.hpiTankValve = new Valve({
				'socket' : this.socket,
				'poll' : this.poll,
				'valveId' : 'hpivalve',
				'title': 'HPI Tank Valve',
				'damageId' : 4,
				valveClass : 'hpivalve valvefalse z2',
			}, this.hpiTankValveDAP);
			this.hpiTankValve.on('damageRepaired', lang.hitch(this, this.repair));
			
			this.pressurizerValve = new Valve({
				'socket' : this.socket,
				'poll' : this.poll,
				'valveId' : 'pressurizervalve',
				'title': 'Pressurizer Tank Valve',
				'damageId' : 16,
				valveClass : 'pressurizervalve valvefalse z2',
			}, this.pressurizerValveDAP);
			this.pressurizerValve.on('damageRepaired', lang.hitch(this, this.repair));
			
			this.auxTankValve = new Valve({
				'socket' : this.socket,
				'poll' : this.poll,
				'valveId' : 'afsvalve',
				'damageId' : 64,
				'title': 'Auxiliary Tank Valve',
				valveClass : 'afsvalve valvefalse z2',
			}, this.auxTankValveDAP);
			this.auxTankValve.on('damageRepaired', lang.hitch(this, this.repair));
			
			this.inherited(arguments);
		},
		repair : function(event){
			this.emit('damageRepaired', event)
		}


	});
});
