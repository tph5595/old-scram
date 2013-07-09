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
		socket:null,

		constructor : function(args) {
			this.socket = args.socket;
		},
		postCreate : function() {
			this.repair = new Repair({
				'socket' : this.socket,
				'repairstate': false,
				'title': 'Repair Button',
				repairClass :'repairbutton repairstatefalse z2',
			},this.repairDAP);
			
			
			this.inherited(arguments);
		}


	});
});
