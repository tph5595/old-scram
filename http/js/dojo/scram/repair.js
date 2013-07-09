define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/repair.html"], 
function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, domConstruct, domClass, template) {
	return Declare("scram.repair", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the repair
		///
		templateString : template,
		_socket : null,
		repairState : null,
		tip : null,
		repairClass : null,
		_setRepairClassAttr: {node:"repairDAP",type:"class"},
		_setRepairTipAttr: {node:"repairDAP",type:"title"},
		
		constructor : function(args) {
			this.tip = args.tip;
			this.socket = args.socket;
			this.repairState = args.repairState;
			this.repairClass = args.repairClass;
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
			j = {
				"repairstate" : this.repairState
			};
			console.log(JSON.stringify(j), j);
			this.socket.send(JSON.stringify(j));
			this.switchRepairState(this.repairState);
		}
	});
});
