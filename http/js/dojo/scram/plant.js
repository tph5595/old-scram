define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dojo/fx", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-class", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented",
"scram/rod", "scram/pumps", "scram/temp", "scram/valves", "scram/waters", "scram/tanks", "scram/repairs", "scram/earthquake", "scram/faces", "scram/damages", "dojo/text!scram/templates/plant.html"], 
function(on, lang, Declare, fx, _WidgetBase, _Container, domClass, _Contained, _TemplatedMixin, Evented, Rods, Pumps, Temp, Valves, Waters, Tanks, Repairs, Earthquake, Faces, Damages, template) {
	return Declare("scram.plant", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the plant
		///
		templateString : template,
		sockets : null,
		'class' : "scrambackground scrambackgroundposition z1",

		constructor : function(args) {
			this.sockets = args.sockets;
			this.sockets.pollSocket.on("message", lang.hitch(this, function(msg) {
				console.log("Poll Data", msg.data);
			}));
		},
		postCreate : function() {
			/*
			this.earthquake = new Earthquake({
				socket : this.sockets.earthquakeSocket,
				poll : this.sockets.pollSocket
			});*/
			this.damages = new Damages ({
				socket : this.sockets.earthquakeSocket,
			})
			this.faces = new Faces ({
				socket : this.sockets.earthquakeSocket,
				poll : this.sockets.pollSocket
			});
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
			 socket : this.sockets.earthquakeSocket
			 });
			 
			//this.addChild(this.earthquake);
			this.addChild(this.faces);
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
