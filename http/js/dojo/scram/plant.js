define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dojo/fx", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-class", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", 
"scram/rod", "scram/pumps", "scram/temp", "scram/valves", "scram/waters", "scram/tanks", "scram/faces", /*"scram/flag",*/ "scram/repairs", "dojo/text!scram/templates/plant.html"], 
function(on, lang, Declare, fx, _WidgetBase, _Container, domClass, _Contained, _TemplatedMixin, Evented, Rods, Pumps, Temp, Valves, Waters, Tanks, Faces, /*Flag,*/ Repairs, template) {
	return Declare("scram.plant", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the plant
		///
		templateString : template,
		sockets : null,
		'class' : "scrambackground scrambackgroundposition z1",
		repairRemoveVar: null,

		constructor : function(args) {
			this.repairRemoveVar = false;
			this.sockets = args.sockets;
			/*
			this.sockets.pollSocket.on("message", lang.hitch(this, function(msg) {
				console.log("Poll Data", msg.data);
			}));
			/*this.sockets.earthquakeSocket.on("message", lang.hitch(this, function(msg) {
				console.log("EarthquakeData", msg.data);
			}));*/
		},
		postCreate : function() {
			this.temp = new Temp({
				socket : this.sockets.pollSocket
			});
			this.rods = new Rods({
				"socket" : this.sockets.rodSocket,
				"pollSocket" : this.sockets.pollSocket,
				'title' : 'Reactor Core Rods',
				'class' : "z2"
			});
			this.rods.on('damageRepaired', lang.hitch(this, this.repair));

			this.pumps = new Pumps({
				socket : this.sockets.pumpSocket,
				poll : this.sockets.pollSocket
			});
			this.pumps.on('damageRepaired', lang.hitch(this, this.repair));
			this.pumps.on('repairRemoveVar', lang.hitch(this, this.removeRepair));

			this.valves = new Valves({
				socket : this.sockets.valveSocket,
				poll : this.sockets.pollSocket
			});
			this.valves.on('damageRepaired', lang.hitch(this, this.repair));

			this.waters = new Waters({
				poll : this.sockets.pollSocket
			});

			this.tanks = new Tanks({
				poll : this.sockets.pollSocket
			});
//			this.flag = new Flag();

			this.repairs = new Repairs({
				repairRemoveVar : this.repairRemoveVar
			});
			this.repairs.on('repairstatefalse', lang.hitch(this, this.repairStateSwitch));
			this.repairs.on('repairstatetrue', lang.hitch(this, this.repairStateSwitch));


			this.faces = new Faces({
				socket : this.sockets.earthquakeSocket,
				poll : this.sockets.pollSocket
			});

			this.addChild(this.temp);
			this.addChild(this.rods);
			this.addChild(this.pumps);
			this.addChild(this.valves);
			this.addChild(this.waters);
			this.addChild(this.tanks);
			//this.addChild(this.flag);
			this.addChild(this.repairs);
			this.addChild(this.faces);
			this.inherited(arguments);
		},
		repair : function(event) {
			if (this.repairState == true){
				this.damageId = event['damage'];
				j = {
					'damage' : this.damageId
				}
				this.sockets.earthquakeSocket.send(JSON.stringify(j));
			}
			else {
				alert('ERROR: Repair State Off')
			}
		},
		repairStateSwitch : function(event){
			this.repairState = event['repairstate'];
		},
		removeRepair : function(event){
			this.repairRemoveVar = true;
			console.log('removeRepair');
		}
	});
});
