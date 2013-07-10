define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", 
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/fx", "dojo/text!scram/templates/rod.html"], 
function(lang, Declare, _WidgetBase, _Container,_Contained, _TemplatedMixin, fx, template) {
	return Declare("scram.rod", [_WidgetBase, _Container, _Contained, _TemplatedMixin], {
		///
		/// This is the class for the rods
		///
		templateString : template,
		_socket : null,
		pollSocket:null,
		rodLevel : null,
		tip : null,
		_setRodTipAttr : {
			node : "rod",
			type : "title"
		},
		rodTop : [-53, -58, -63, -69, -75, -80, -86, -92, -99, -105],

		constructor : function(args) {
			this._socket = args.socket;
			this.pollSocket = args.pollSocket;
			this.pollSocket.on("message", lang.hitch(this, this.pollMsg));
			this.tip = args.tip;
			this.rodLevel = 9;
		},
		postCreate : function() {

			this.inherited(arguments);
		},
		increment : function() {
			this.rodUpdate(1);
		},
		decrement : function() {
			this.rodUpdate(-1);
		},
		rodUpdate:function(x){
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
			this.rodMove();
		},
		rodMove : function() {

			fx.slideTo({
				top : this.rodTop[this.rodLevel],
				left : 86,
				node : this.rod
			}).play();

		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.rodLevel = obj['rods'];
			this.rodMove();
		}
	});
});
