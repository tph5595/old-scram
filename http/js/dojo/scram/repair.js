define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/repair.html"], 
function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.repair", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for the repair
		///
		templateString : template,
		repairState : null,
		tip : null,
		repairClass : null,
		_setRepairClassAttr: {node:"repairDAP",type:"class"},
		_setRepairTipAttr: {node:"repairDAP",type:"title"},
		repairRemoveVar: null,

		constructor : function(args) {
			this.tip = args.tip;
			this.repairState = args.repairState;
			this.repairClass = args.repairClass;
			this.repairRemoveVar = args.repairRemoveVar;
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		repairFunc:function(){
			this.repairState = !this.repairState;
			this.repairUpdate();
		},
		switchRepairState : function(state) {
			domClass.remove(this.repairDAP);
			domClass.add(this.repairDAP, 'repairbutton '+ ' repairstate'+state +' '+this.repairClass);
		},
		repairUpdate : function(x) {
			if (this.repairRemoveVar == true){
				this.repairState = false;
				this.repairRemoveVar = false;
				console.log('testing');
			}
			if (this.repairState== false){
					this.emit('repairstatefalse', {'repairstate' : this.repairState});
			}	
			else if (this.repairState == true){
					this.emit('repairstatetrue', {'repairstate' : this.repairState});
			}
			this.switchRepairState(this.repairState);
		}
	});
});
