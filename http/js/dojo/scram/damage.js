define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/damage.html"], 
function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, domConstruct, domClass, template) {
	return Declare("scram.damage", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the damage
		///
		templateString : template,
		_socket : null,
		repairState : null,
		tip : null,
		damageId : null,
		damageClass : null,
		_setDamageClassAttr: {node:"damageDAP",type:"class"},
		_setDamageTipAttr: {node:"damageDAP",type:"title"},
		
		constructor : function(args) {
			this.tip = args.tip;
			this.damageId = args.damageId;
			this.socket = args.socket;
			this.socket.on("message", lang.hitch(this, this.socketMsg));
			this.damageClass = args.damageClass;
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		damageFunc:function(){
			this.damageUpdate();
		},
		switchDamageState : function() {
			if (this.damageState == true){
				domClass.remove(this.damageDAP);
				domClass.add(this.damageDAP, this.damageClass);
			}
			else{
				domClass.remove(this.damageDAP);
				domClass.add(this.damageDAP, 'nodamage');
			}
		},
		damageUpdate : function(x) {
			if (this.damageState == true && this.repairState == true){
				this.damageState = false;
			};
			j = {
				"damagestate" : this.damageState
			};
			console.log(JSON.stringify(j), j);
			this.socket.send(JSON.stringify(j));
			this.switchDamageState();
		},
		socketMsg : function(event){
			var obj = JSON.parse(event.data);
			this.damageState = obj[this.damageId];
			this.repairState = obj['repairstate'];
			this.switchDamageState();
		}
	});
});
