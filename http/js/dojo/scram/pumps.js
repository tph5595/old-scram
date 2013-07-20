define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented",
"scram/pump","dojo/text!scram/templates/pumps.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, Evented, Pump,template) {
	return Declare("scram.pumps", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
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
				'damageId' : 2,
				'title': 'Reactor Coolant System Pump',
				//'repairState': false,
				pumpClass :'rcspump pumpsize z2',
				pumpUpClass : 'rcspumpup upbutton z2',
				pumpDownClass : 'rcspumpdown downbutton z2',
			},this.rcsPumpDAP);
			this.rcsPump.on('damageRepaired', lang.hitch(this, this.repair));
			this.rcsPump.on('repairRemoveVar', lang.hitch(this, this.removeRepair));
			
			this.hpiTankPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 4,
				'pumpId' : 'hpiTank',
				'damageId' : 8,
				'title':"HPI Tank Pump",
				//'repairState': false,
				pumpClass :'hpitankpump pumpsize z2',
				pumpUpClass : 'hpitankpumpup upbutton z2',
				pumpDownClass : 'hpitankpumpdown downbutton z2',
			},this.hpiPumpDAP);
			this.hpiTankPump.on('damageRepaired', lang.hitch(this, this.repair));
			this.hpiTankPump.on('removeRepair', lang.hitch(this, this.removeRepair));
			
			this.auxTankPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 3,
				'pumpId' : 'auxTank',
				'damageId' : 128,
				'title': 'Auxiliary Tank Pump',
				//'repairState': false,
				pumpClass :'auxtankpump pumpsize z2',
				pumpUpClass : 'auxtankpumpup upbutton z2',
				pumpDownClass : 'auxtankpumpdown downbutton z2',
			},this.auxPumpDAP);
			this.auxTankPump.on('damageRepaired', lang.hitch(this, this.repair));
			this.auxTankPump.on('removeRepair', lang.hitch(this, this.removeRepair));
			
			this.feedwaterPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 2,
				'pumpId' : 'feedwater',
				'damageId' : 32,
				'title': 'Auxiliary Feedwater System Pump',
				//'repairState': false,
				pumpClass :'feedwaterpump pumpsize z2',
				pumpUpClass : 'feedwaterpumpup upbutton z2',
				pumpDownClass : 'feedwaterpumpdown downbutton z2',
			},this.fwPumpDAP);
			this.feedwaterPump.on('damageRepaired', lang.hitch(this, this.repair));
			this.feedwaterPump.on('removeRepair', lang.hitch(this, this.removeRepair));
			
			this.csPump = new Pump({
				'socket' : this.socket,
				'poll':this.poll,
				'pumpLevelMax' : 2,
				'pumpId' : 'cs',
				'damageId' : 256,
				'title': 'Circulating Systems Pump',
			//	'repairState': false,
				pumpClass :'cspump pumpsize z2',
				pumpUpClass : 'cspumpup upbutton z2',
				pumpDownClass : 'cspumpdown downbutton z2',
			},this.csPumpDAP);
			this.csPump.on('damageRepaired', lang.hitch(this, this.repair));
			this.csPump.on('removeRepair', lang.hitch(this, this.removeRepair));
			
			this.inherited(arguments);
		},
		repair : function(event) {
			this.emit('damageRepaired', event)
		},
		removeRepair : function(){
			this.emit('repairRemoveVar', {});
		}


	});
});
