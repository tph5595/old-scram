define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container","dijit/_Contained", "dijit/_TemplatedMixin",
"dojo/dom-construct", "dojo/dom-class","dojo/text!scram/templates/tank.html"], 
function(lang, on, Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, domConstruct, domClass,template) {
	return Declare("scram.tank", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the tank
		///
		templateString:template,
	//	socket : null,
		poll:null,
		tankLevel : null,
		//pumpLevel : null,
	//	valveState: null,
		tankLevelMax : null,
		tankId : null,
		tankClass : null,
		_setTankClassAttr: {node:"tankDAP",type:"class"},
		_setTankTipAttr: {node:"tankDAP",type:"title"},

		constructor : function(args) {
		//	this.socket = args.socket;
			this.poll = args.poll;
			this.tankClass = args.tankClass;
			this.tankLevel = 0;
			this.tankLevelMax = args.tankLevelMax;
			this.tip = args.tip;
		//	this.socket.on("message", lang.hitch(this, this.tankMsg));
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		decrement:function(){
			this.tankUpdate(-1);
		},
		tankMove : function() {
			
			if (this.tankLevel < 0) {
				this.tankLevel = 0
			}
			if (this.tankLevel > this.tankLevelMax) {
				this.tankLevel = this.tankLevelMax;
			}
			if (this.tankId == 'pressurizerTank') {
				domClass.remove(this.tank);
				domClass.add(this.tank, this.tankId + ' pressurizertanklevel' + this.tankLevel + " " + this.tankClass);
			}
			else {
				domClass.remove(this.tank);
				domClass.add(this.tank, this.tankId + ' tanklevel' + this.tankLevel + " "+this.tankClass);
			}
			
		},
		tankUpdate : function(x) {
			this.tankLevel = this.tankLevel + x
			j = {
				"level" : this.tankLevel,
				"tankid" : this.tankId
			};
			console.log(JSON.stringify(j), j);
		//	this.socket.send(JSON.stringify(j));
			this.tankMove();
		},
		tankMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.tankLevel = obj[this.tankId];
			this.tankMove();
		},
		/*
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			//this.valveState = obj.valveState();
		//	this.pumpLevel = obj.pumpLevel();
			this.tankLevel = obj[this.tankId];
			this.tankMove()
			
		}
		*/
	});
});
