define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container","dijit/_Contained", "dijit/_TemplatedMixin",
"dojo/dom-construct", "dojo/dom-class","dojo/text!scram/templates/tank.html"], 
function(lang, on, Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, domConstruct, domClass,template) {
	return Declare("scram.tank", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the tank
		///
		templateString:template,
		poll:null,
		tankLevel : null,
		pumpLevel : null,
		valveState: null,
		tankLevelMax : null,
		tankId : null,
		valveId : null,
		tankClass : null,
		tip : null,
		_setTankClassAttr: {node:"tankDAP",type:"class"},
		_setTankTipAttr: {node:"tankDAP",type:"title"},

		constructor : function(args) {
			this.poll = args.poll;
			this.tankClass = args.tankClass;
			this.tankLevel = 0;
			this.valveId = args.valveId;
			this.pumpLevel = args.pumpLevel;
			this.tankLevelMax = args.tankLevelMax;
			this.tip = args.title;
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		tankMove : function() {
			if (this.valveState == true && this.pumpLevel != 0){
				if (this.tankLevel < 0) {
					this.tankLevel = 0
				}
				if (this.tankLevel > this.tankLevelMax) {
					this.tankLevel = this.tankLevelMax;
				}
				if (this.tankId == 'pressurizerwater') {
					domClass.remove(this.tankDAP);
					domClass.add(this.tankDAP, this.tankId + ' pressurizertanklevel' + this.tankLevel + " " + this.tankClass);
				}
				else {
					domClass.remove(this.tankDAP);
					domClass.add(this.tankDAP, this.tankId + ' tanklevel' + this.tankLevel + " "+this.tankClass);
				}
			}
		},
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.valveState = obj[this.valveId];
			if (this.valveId != 'pressurizervalve'){
				this.pumpLevel = obj[this.pumpLevel];
			}
			else if (this.valveId == 'pressurizervalve'){
				this.pumpLevel =-1;
			}
			this.tankLevel = obj[this.tankId];
			this.tankMove()
			
		}
	});
});
