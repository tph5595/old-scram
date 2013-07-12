define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container","dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented",
"dojo/dom-construct", "dojo/dom-class","dojo/text!scram/templates/valve.html"], 
function(lang, on, Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass,template) {
	return Declare("scram.valve", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for the valve
		///
		templateString:template,
		socket : null,
		poll:null,
		valveState : null,
		valveId : null,
		valveClass : null,
		damageId : null,
		damageMsg : null,
		_setValveClassAttr: {node:"valve",type:"class"},
		tip:null,
		_setValveTipAttr: {node:"valve",type:"title"},

		constructor : function(args) {
			this.socket = args.socket;
			this.poll = args.poll;
			this.damageId = args.damageId;
			this.valveClass = args.valveClass;
			this.valveState = false; //false = closed true = open
			this.tip = args.tip;
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		valveSwitch:function(){
			if ((this.damageMsg & this.damageId) == this.damageId){
				/*
				console.log('Valve Fixed');
				j = {
					"damage" : this.damageId
				};
				console.log(JSON.stringify(j), j);
				this.socket.send(JSON.stringify(j));
				*/
				console.log('Valve Repair CLicked');
				console.log(this.damageId);
				this.emit('damageRepaired', {'damage' : this.damageId});
				this.valveMove();
			}
			else{
				this.valveState = !this.valveState
				this.valveUpdate(this.valveState);
			}
		},
		valveMove : function() {
			if ((this.damageMsg & this.damageId) == this.damageId){
				//console.log('hi');
				domClass.remove(this.valve);
				domClass.add(this.valve, this.valveId + ' brokenvalve '+ 'z2');
			}
			else {
				if (this.valveId == 'pressurizervalve'){
					domClass.remove(this.valve);
					domClass.add(this.valve, 'pressurizervalve'+this.valveState + " " + this.valveClass);
				}
				else{
					domClass.remove(this.valve);
					domClass.add(this.valve, 'valve'+this.valveState + " " + this.valveClass);
				}
			}
			
		},
		valveUpdate : function(event) {
			j = {
				"state" : event,
				"valveid" : this.valveId
			};
			console.log(JSON.stringify(j), j);
			this.socket.send(JSON.stringify(j));
			this.valveMove();
		},
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.valveState = obj[this.valveId];
			this.damageMsg = obj['damage'];			
			this.valveMove();
		}
	});
});