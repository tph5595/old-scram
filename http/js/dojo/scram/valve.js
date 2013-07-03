define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container","dijit/_Contained", "dijit/_TemplatedMixin",
"dojo/dom-construct", "dojo/dom-class","dojo/text!scram/templates/valve.html"], 
function(lang, on, Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, domConstruct, domClass,template) {
	return Declare("scram.valve", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the valve
		///
		templateString:template,
		socket : null,
		poll:null,
		valveState : null,
		valveId : null,
		valveClass : null,
		_setValveClassAttr: {node:"valve",type:"class"},
		tip:null,
		_setValveTipAttr: {node:"valve",type:"title"},

		constructor : function(args) {
			this.socket = args.socket;
			this.poll = args.poll;
			this.valveClass = args.valveClass;
			this.valveState = false; //false = closed true = open
			this.tip = args.tip;
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		valveSwitch:function(){
			this.valveState = !this.valveState
			this.valveUpdate(this.valveState);
		},
		valveMove : function() {
			domClass.remove(this.valve);
			domClass.add(this.valve, 'valve'+this.valveState + " " + this.valveClass);
		},
		valveUpdate : function(newValveState) {
			j = {
				"state" : newValveState,
				"valveid" : this.valveId
			};
			console.log(JSON.stringify(j), j);
			this.socket.send(JSON.stringify(j));
			this.valveMove();
		},
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.valveState = obj[this.valveId];
			this.valveMove();
		}
	});
});