define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Contained", "dojo/dom-construct", "dojo/dom-class", "dojo/fx", "dijit/Tooltip"], 
function(lang, on, Declare, _WidgetBase, _Contained, domConstruct, domClass, fx, Tooltip) {
	return Declare("scram.pumps", [_WidgetBase, _Contained], {
		///
		/// This is the class for the pumps
		///
		socket : null,
		poll:null,
		parent : null,
		pump : null,
		pumpUp : null,
		pumpDown : null,
		pumpLevel : null,
		pumpLevelMax : null,
		pumpId : null,
		pumpClass : null,
		pumpUpClass : null,
		pumpDownClass : null,
		tip:null,

		constructor : function(args) {
			this.socket = args.socket;
			this.poll = args.poll;
			this.parent = args.parent;
			this.pumpClass = args.pumpClass;
			this.pumpUpClass = args.pumpUpClass;
			this.pumpDownClass = args.pumpDownClass;
			this.pumpLevel = 0;
			this.pumpLevelMax = args.pumpLevelMax;
			this.tip = args.tip;
			this.socket.on("message", lang.hitch(this, this.pumpMsg));
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.pumpDown = new domConstruct.create("div", {
				'class' : this.pumpDownClass
			}, this.parent);

			//create the gauge bottom left Down button div
			this.pumpUp = new domConstruct.create("div", {
				'class' : this.pumpUpClass
			}, this.parent);

			//create the gauge bottom left up button div
			this.pump = new domConstruct.create("div", {
				'class' : this.pumpClass,
				'title':this.tip
			}, this.parent);

			this.handlePumpDown = on(this.pumpDown, "click", lang.hitch(this, this.pumpUpdate, -1));
			this.handlePumpUp = on(this.pumpUp, "click", lang.hitch(this, this.pumpUpdate, 1));
			this.inherited(arguments);
		},
		pumpMove : function() {
			
			if (this.pumpLevel < 0) {
				this.pumpLevel = 0
			}
			if (this.pumpLevel > this.pumpLevelMax) {
				this.pumpLevel = this.pumpLevelMax;
			}
			domClass.remove(this.pump);
			domClass.add(this.pump, 'pump' + this.pumpLevel + ' pumpsize ' + this.pumpClass);
		},
		pumpUpdate : function(x) {
			this.pumpLevel = this.pumpLevel + x
			j = {
				"level" : this.pumpLevel,
				"pumpid" : this.pumpId
			};
			console.log(JSON.stringify(j), j);
			this.socket.send(JSON.stringify(j));
			this.pumpMove();
		},
		pumpMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.pumpLevel = obj[this.pumpId];
			this.pumpMove();
		},
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.pumpLevel = obj[this.pumpId];
			this.pumpMove();
		}
	});
});
