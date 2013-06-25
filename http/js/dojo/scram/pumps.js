define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin",
"scram/pump","dojo/text!scram/templates/pumps.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin,Pump,template) {
	return Declare("scram.pumps", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the pumps
		///
		templateString:template,
		socket : null,
		poll:null,

		constructor : function(args) {
			this.socket = args.socket;
			this.poll = args.poll;
		},
		postCreate : function() {
			this.rcsPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 4,
				'pumpId' : 'rcs',
				'tip': 'Reactor Coolant System Pump',
				pumpClass :'rcspump pumpsize pump0 z2',
				pumpUpClass : 'rcspumpup upbutton z2',
				pumpDownClass : 'rcspumpdown downbutton z2',
			},this.rcsPumpDAP);
			
			this.hpiTankPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 4,
				'pumpId' : 'hpiTank',
				'tip':"HPI Tank Pump",
				pumpClass :'hpitankpump pumpsize pump0 z2',
				pumpUpClass : 'hpitankpumpup upbutton z2',
				pumpDownClass : 'hpitankpumpdown downbutton z2',
			},this.hpiPumpDAP);
			
			this.auxTankPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 3,
				'pumpId' : 'auxTank',
				'tip': 'Auxiliary Tank Pump',
				pumpClass :'auxtankpump pumpsize pump0 z2',
				pumpUpClass : 'auxtankpumpup upbutton z2',
				pumpDownClass : 'auxtankpumpdown downbutton z2',
			},this.auxPumpDAP);
			
			this.feedwaterPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 2,
				'pumpId' : 'feedwater',
				'tip': 'Auxiliary Feedwater System Pump',
				pumpClass :'feedwaterpump pumpsize pump0 z2',
				pumpUpClass : 'feedwaterpumpup upbutton z2',
				pumpDownClass : 'feedwaterpumpdown downbutton z2',
			},this.fwPumpDAP);
			
			this.csPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 2,
				'pumpId' : 'cs',
				'tip': 'Circulating Systems Pump',
				pumpClass :'cspump pumpsize pump0 z2',
				pumpUpClass : 'cspumpup upbutton z2',
				pumpDownClass : 'cspumpdown downbutton z2',
			},this.csPumpDAP);
			
			this.inherited(arguments);
		}


	});
});
