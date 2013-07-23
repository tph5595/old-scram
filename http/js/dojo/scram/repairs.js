define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented",
"scram/repair","dojo/text!scram/templates/repairs.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, Evented, Repair,template) {
	return Declare("scram.repairs", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for the repairs
		///
		templateString:template,
		repairRemoveVar : null,

		constructor : function(args) {
			this.repairRemoveVar = args.repairRemoveVar;
		},
		postCreate : function() {
			this.repair = new Repair({
				'repairstate': false,
				'title': 'Repair Button',
				'repairRemoveVar' : this.repairRemoveVar,
				repairClass :'repairbutton repairstatefalse z2',
			},this.repairDAP);
			this.repair.on('repairstatefalse', lang.hitch(this, this.repairStateSwitch));
			this.repair.on('repairstatetrue', lang.hitch(this, this.repairStateSwitch));

			this.inherited(arguments);
		},
		repairStateSwitch : function(event){
			this.repairState = event['repairstate'];
			if (this.repairState == true){
				this.emit('repairstatetrue', {'repairstate' : this.repairState});
			}
			else if (this.repairState == false){
				this.emit('repairstatefalse', {'repairstate' : this.repairState});
			}
		}


	});
});
