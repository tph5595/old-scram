define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dojo/dom-class", "dijit/_Container", 
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/fx", "dojo/text!scram/templates/rod.html"], 
function(lang, Declare, _WidgetBase, domClass, _Container,_Contained, _TemplatedMixin, Evented, fx, template) {
	return Declare("scram.rod", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the rods
		///
		templateString : template,
		_socket : null,
		pollSocket:null,
		damageId: null,
		damageMsg: null,
		rodLevel : null,
		rodTop : [-53, -58, -63, -69, -75, -80, -86, -92, -99, -105],

		constructor : function(args) {
			this._socket = args.socket;
			this.pollSocket = args.pollSocket;
			this.pollSocket.on("message", lang.hitch(this, this.pollMsg));
			this.tip = args.tip;
			this.damageId = 1;
			this.rodLevel = 9;
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		fix : function(){
			this.emit('removeRepair', {});
			if ((this.damageMsg & this.damageId) == this.damageId){
				this.rodUpdate();
			}
			else{
			}
		},
		increment : function() {
			if ((this.damageMsg & this.damageId) == this.damageId){
				this.rodMove();
			}
			else {
				this.rodUpdate(1);
			}
			
		},
		decrement : function() {
			if ((this.damageMsg & this.damageId) == this.damageId){
				this.rodMove();
			}
			else {
				this.rodUpdate(-1);
			}
		},
		rodUpdate:function(x){
			this.rodLevel = this.rodLevel + x
			if (this.rodLevel < 0) {
				this.rodLevel = 0
			}
			if (this.rodLevel > 9) {
				this.rodLevel = 9
			}
			if ((this.damageMsg & this.damageId) == this.damageId){
				/*
				j = {
					"level" : this.rodLevel,
					"damage" : this.damageId
				};
				console.log(JSON.stringify(j), j);
				this._socket.send(JSON.stringify(j));	
				*/
				this.emit('damageRepaired', {'damage' : this.damageId});
				this.rodMove();
			}
			else{
				j = {
					"level" : this.rodLevel
				};
				console.log(JSON.stringify(j), j);
				this._socket.send(JSON.stringify(j));	
				this.rodMove();
			}
		},
		rodMove : function() {
			if ((this.damageMsg & this.damageId) == this.damageId){
				domClass.remove(this.rod);
				domClass.add(this.rod, 'roddamage z1');//this needs to become a different image
			}
			else{ 
				domClass.remove(this.rod);
				domClass.add(this.rod, 'rods z1');
				fx.slideTo({
					top : this.rodTop[this.rodLevel],
					left : 86,
					node : this.rod
				}).play();
			}
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.rodLevel = obj['rods'];
			this.damageMsg = obj['damage'];
			this.rodMove();
		}
	});
});
