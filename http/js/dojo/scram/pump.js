define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/pump.html"], 
function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.pump", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for the pump
		///
		templateString : template,
		socket : null,
		poll : null,
		pumpLevel : null,
		pumpLevelMax : null,
		pumpId : null,
		damageId : null,
		damageMsg: null,
		pumpClass : null,
		_setPumpClassAttr : {
			node : "pump",
			type : "class"
		},
		pumpUpClass : null,
		_setPumpUpClassAttr : {
			node : "pumpUp",
			type : "class"
		},
		pumpDownClass : null,
		_setPumpDownClassAttr : {
			node : "pumpDown",
			type : "class"
		},

		constructor : function(args) {
			this.socket = args.socket;
			this.damageId = args.damageId;
			this.poll = args.poll;
			this.pumpClass = args.pumpClass;
			this.pumpUpClass = args.pumpUpClass;
			this.pumpDownClass = args.pumpDownClass;
			this.pumpLevel = 0;
			this.pumpLevelMax = args.pumpLevelMax;
			this.poll.on("message", lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		fix : function(){
			if (this.workers <= 0){
				alert('Not Enough Workers');
			}
			if ((this.damageMsg & this.damageId) == this.damageId && this.workers > 0){
				/*
				console.log('Pump Fixed');
				i = {
					"damage" : this.damageId
				};
				console.log(JSON.stringify(i), i);
				this.socket.send(JSON.stringify(i));
				*/
				console.log('Pump Repair CLicked');
				console.log(this.damageId);
				this.emit('damageRepaired', {'damage' : this.damageId});
				this.pumpMove();
			}
			else{
			}
		},
		increment : function() {
			///*For testing*/this.damageId = this.damageMsg & this.damageId;
			if ((this.damageMsg & this.damageId) == this.damageId){
				this.pumpMove();
			}
			else{
				this.pumpUpdate(1);
			}
		},
		decrement : function() {
			if ((this.damageMsg & this.damageId) == this.damageId){
				this.pumpMove();
			}
			else{
				this.pumpUpdate(-1);
			}
		},
		pumpMove : function() {
			//console.log(this.pumpId+': '+(this.damageMsg & this.damageId));
			if ((this.damageMsg & this.damageId) == this.damageId){
				//console.log('hi');
				domClass.remove(this.pump);
				domClass.add(this.pump, 'pumpsize ' + 'brokenpump '+ this.pumpClass);
			}
			else{
				domClass.remove(this.pump);
				domClass.add(this.pump, 'pump' + this.pumpLevel + ' pumpsize ' + this.pumpClass);
			}
			
		},
		pumpUpdate : function(x) {
			this.pumpLevel = this.pumpLevel + x
			if (this.pumpLevel < 0) {
				this.pumpLevel = 0
			}
			if (this.pumpLevel > this.pumpLevelMax) {
				this.pumpLevel = this.pumpLevelMax;
			}
			j = {
				"level" : this.pumpLevel,
				"pumpid" : this.pumpId
			};
			console.log(JSON.stringify(j), j);
			this.socket.send(JSON.stringify(j));
			this.pumpMove();
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.pumpLevel = obj[this.pumpId];
			this.damageMsg = obj['damage'];
			this.workers = obj['workers'];
			this.pumpMove();
		}
	});
});
