define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented",
"scram/rod", "scram/pumps", "scram/temp", "scram/valves", "scram/waters", "scram/tanks", "scram/repairs", "scram/earthquake", "dojo/text!scram/templates/plant.html"], 
function(on, lang, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, Rods, Pumps, Temp, Valves, Waters, Tanks, Repairs, Earthquake, template) {
	return Declare("scram.plant", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
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
				socket : this.sockets.earthquakeSocket,
				poll : this.sockets.pollSocket
			});
			this.earthquake.on('quake', lang.hitch(this, function() {
				console.log('Quake passthrough works. Now implement shaking here');
			}));
			this.temp = new Temp({
				socket : this.sockets.pollSocket
			});
			this.rods = new Rods({
				"socket" : this.sockets.rodSocket,
				"pollSocket":this.sockets.pollSocket,
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
