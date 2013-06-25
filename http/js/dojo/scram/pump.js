define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container","dijit/_Contained", "dijit/_TemplatedMixin",
"dojo/dom-construct", "dojo/dom-class","dojo/text!scram/templates/pump.html"], 
function(lang, on, Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, domConstruct, domClass,template) {
	return Declare("scram.pump", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the pump
		///
		templateString:template,
		socket : null,
		poll:null,
		//pump : null,
		//pumpUp : null,
		//pumpDown : null,
		pumpLevel : null,
		pumpLevelMax : null,
		pumpId : null,
		pumpClass : null,
		_setPumpClassAttr: {node:"pump",type:"class"},
		pumpUpClass : null,
		_setPumpUpClassAttr: {node:"pumpUp",type:"class"},
		pumpDownClass : null,
		_setPumpDownClassAttr: {node:"pumpDown",type:"class"},
		tip:null,
		_setPumpTipAttr: {node:"pump",type:"title"},

		constructor : function(args) {
			this.socket = args.socket;
			this.poll = args.poll;
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
			/*
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
			*/
			//this.handlePumpDown = on(this.pumpDown, "click", lang.hitch(this, this.pumpUpdate, -1));
			//this.handlePumpUp = on(this.pumpUp, "click", lang.hitch(this, this.pumpUpdate, 1));
			this.inherited(arguments);
		},
		increment:function(){
			this.pumpUpdate(1);
		},
				decrement:function(){
			this.pumpUpdate(-1);
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
