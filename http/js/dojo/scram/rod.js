define(["dojo/_base/lang", "dojo/on","dojo/_base/declare", "dijit/_WidgetBase","dijit/_Contained","dojo/dom-construct","dojo/dom-style","dojo/fx"],
 function(lang, on, Declare, _WidgetBase, _Contained, domConstruct,domStyle,fx) {
	return Declare("scram.rod", [_WidgetBase, _Contained], {
		///
		/// This is the class for the rods
		///

		rods : null,
		rodDown : null,
		rodUp : null,
		state : null,
		_socket : null,
		rodLevel : null,
		rodTop : [233, 228, 224, 218, 212, 206, 200, 194, 188, 182],

		constructor : function(args) {
			this._socket = args.socket;
			this.parent = args.parent;
			this.rodLevel = 9;
		},
		postCreate : function() {
			this.rods = new domConstruct.create("div", {
				id : 'rods',
				'class':'rods z1'
			}, this.parent);
			
			this.rodDown = new domConstruct.create("div", {
				id : 'rodDownButtonDiv',
				'class':'roddown downbutton z1'
			}, this.parent);
			
			//create the rod down button div
			this.rodUp = new domConstruct.create("div", {
				'class' : 'rodup upbutton z1'
			}, this.parent);
			
			this.handleRodDown = on(this.rodDown, "click", lang.hitch(this, this.rodMove, -1));
			this.handleRodUp = on(this.rodUp, "click", lang.hitch(this, this.rodMove, 1));
			this.inherited(arguments);
		},
		rodMove : function(x) {
			this.rodLevel = this.rodLevel + x
			if (this.rodLevel < 0) {
				this.rodLevel = 0
			}
			if (this.rodLevel > 9) {
				this.rodLevel = 9
			}

			j = {
				"level" : this.rodLevel
			};
			console.log(JSON.stringify(j), j);
			this._socket.send(JSON.stringify(j));
			fx.slideTo({
				top : this.rodTop[this.rodLevel],
				left : 94,
				node : this.rods
			}).play();

		}
	});
});
