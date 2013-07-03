define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", 
"scram/rod", "scram/pumps", "scram/temp", "scram/valves", "scram/waters", "scram/tanks", "scram/repairs", "scram/earthquake", "dojo/text!scram/templates/plant.html"], 
function(lang, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Rods, Pumps, Temp, Valves, Waters, Tanks, Repairs, Earthquake, template) {
	return Declare("scram.plant", [_WidgetBase, _Container, _Contained, _TemplatedMixin], {
		///
		/// This is the class for the plant
		///
		templateString : template,
		sockets : null,
		'class' : "scrambackground z1",

		constructor : function(args) {
			this.sockets = args.sockets;
			this.sockets.pollSocket.on("message", lang.hitch(this, function(msg) {
				console.log("Poll Data", msg.data);
			}));
		},
		postCreate : function() {

			this.earthquake = new Earthquake({
				socket : this.sockets.earthquakeSocket
			});

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
			this.valves = new Valves({
				"socket" : this.sockets.valveSocket,
				poll : this.sockets.pollSocket
			});
			this.waters = new Waters({
				poll : this.sockets.pollSocket
			});
			
			 this.tanks = new Tanks({
			 //"socket" : this.sockets.tankSocket,
			 poll : this.sockets.pollSocket
			 });
			 
			 this.repairs = new Repairs({
			 //"socket" : this.sockets.repairSocket,
			 poll : this.sockets.pollSocket
			 });
			 
			this.addChild(this.temp);
			this.addChild(this.rods);
			this.addChild(this.pumps);
			this.addChild(this.valves);
			this.addChild(this.waters);
			this.addChild(this.tanks);
			this.addChild(this.repairs);
			this.inherited(arguments);
		}
	});
});
