define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", 
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/fx", "dojo/text!scram/templates/repair.html"], 
function(lang, Declare, _WidgetBase, _Container,_Contained, _TemplatedMixin, fx, template) {
	return Declare("scram.repair", [_WidgetBase, _Container, _Contained, _TemplatedMixin], {
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
			this.repairState = args.repairState;
		//	this.socket.on("message", lang.hitch(this, this.repairMsg));
			this.poll.on("message",lang.hitch(this,this.pollMsg));
			this.poll = args.poll;
			this.repairClass = args.repairClass;
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		repair:function(){
			this.repairUpdate();
		},
		switchRepairState : function(state) {
			domClass.remove(this.repair);
			domClass.add(this.repair, 'repaircursor'+state + ' repairbutton'+state +' '+this.repairClass);
		},
		repairUpdate : function(x) {
			this.repairState = !this.repairState
			j = {
				"repairstate" : this.repairState
			};
			console.log(JSON.stringify(j), j);
		//	this.socket.send(JSON.stringify(j));
			this.switchRepairState(this.repairState);
		},
		/*
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.repairState = obj['repairstate'];
			this.switchRepairState();
			
		}
		*/
	});
});
