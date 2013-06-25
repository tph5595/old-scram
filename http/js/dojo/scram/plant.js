define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", 
"dijit/_TemplatedMixin", "scram/rod", "scram/pumps", "scram/temp",  "scram/valves", 
"dojo/text!scram/templates/plant.html"], function(lang, Declare, _WidgetBase, _Container, 
	_Contained, _TemplatedMixin, Rods, Pumps, Temp, Valves, template) {
	return Declare("scram.plant", [_WidgetBase, _Container, _Contained, _TemplatedMixin], {
		///
		/// This is the class for the plant
		///
		templateString : template,
		sockets : null,
		'class' : "scrambackground z1",

		constructor : function(args) {
			this.sockets = args.sockets;
		},
		postCreate : function() {
			this.temp = new Temp({
				socket : this.sockets.pollSocket
			});
			this.rods = new Rods({
				"socket" : this.sockets.rodSocket,
				'tip' : 'Reactor Core Rods',
				'class' : "z2"
			});
			this.pumps = new Pumps({
				socket : this.sockets.pumpSocket,
				poll : this.sockets.pollSocket
			});
			this.valve = new Valves({
				"socket" : this.sockets.valveSocket,
				poll : this.sockets.pollSocket
			});
			this.addChild(this.temp);
			this.addChild(this.rods);
			this.addChild(this.pumps);
			this.inherited(arguments);
		}
	});
});
