define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin",
"scram/repair","dojo/text!scram/templates/repairs.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin,Repair,template) {
	return Declare("scram.repairs", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the repairs
		///
		templateString:template,
		//socket : null,
		poll:null,

		constructor : function(args) {
		//	this.socket = args.socket;
			this.poll = args.poll;
		},
		postCreate : function() {
			this.pressurizerTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'pressurizerTank',
				'title': 'Pressurizer Tank',
				tankClass :'pressurizertank pressurizertanklevel0 z2',
			},this.pressurizerTankDAP);
			this.repair = new Repair({
				//'socket' : this.socket,
				'poll':this.poll,
				'repairState': false,
				'title': 'Repair Button',
				repairClass :'repaircursorfalse repairstatefalse z2',
			},this.repairDAP);
			
			
			this.inherited(arguments);
		}


	});
});
