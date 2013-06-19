define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Contained", "dojo/dom-construct", "dojo/dom-style", "dojo/fx"], function(lang, on, Declare, _WidgetBase, _Contained, domConstruct, domStyle, fx) {
	return Declare("scram.pumps", [_WidgetBase, _Contained], {
		///
		/// This is the class for the pumps
		///
		_socket : null,
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

		constructor : function(args) {
			this._socket = args.socket;
			this.parent = args.parent;
			this.pumpClass = args.pumpClass;
			this.pumpUpClass = args.pumpUpClass;
			this.pumpDownClass = args.pumpDownClass;
			this.pumpLevel = 0;
			this.pumpLevelMax = args.pumpLevelMax;
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
				'class' : this.pumpClass
			}, this.parent);

			this.handlePumpDown = on(this.pumpDown, "click", lang.hitch(this, this.pumpMove, -1));
			this.handlePumpUp = on(this.pumpUp, "click", lang.hitch(this, this.pumpMove, 1));
			this.inherited(arguments);
		},
		pumpMove : function(x) {
			this.rodLevel = this.rodLevel + x
			if (this.pumpLevel < 0) {
				this.pumpLevel = 0
			}
			if (this.pumpLevel > this.pumpLevelMax) {
				this.pumpLevelMax = this.pumpLevelMax;
			}
			j = {
				"level" : this.pumpLevel,
				"pumpid": this.pumpId
			};
			console.log(JSON.stringify(j), j);
			this._socket.send(JSON.stringify(j));
			domStyle.set(this.pump, {
				'class' : "pump" + this.pumpLevel + ' ' + this.pumpClass
			});
		}
	});
});
