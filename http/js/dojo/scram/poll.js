define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Contained", "dojo/dom-construct", "dojo/dom-style", "dojo/fx"], function(lang, on, Declare, _WidgetBase, _Contained, domConstruct, domStyle, fx) {
	return Declare("scram.poll", [_WidgetBase, _Contained], {
		///
		/// This is the class for the poll data
		///
		_socket : null,
		parent : null,
		tip: null,

		constructor : function(args) {
			this._socket = args.socket;
			this.parent = args.parent;
			this.tip = args.tip;
			this._socket.on("message", lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.mwh = new domConstruct.create('div', {
				id : 'mwh',
				'title': 'Net Energy',
				'class' : 'mwh statsbarelements'
			}, this.parent);
			this.simtime = new domConstruct.create('div', {
				id : 'simtime',
				'title': 'Simulation Time',
				'class' : "simtime statsbarelements"
			}, this.parent);
			this.rcspressure = new domConstruct.create('div', {
				id : 'rcspressure',
				'title': 'Reactor Coolant System Pressure',
				'class' : "rcspressure statsbarelements"
			}, this.parent);
			this.boilingtemp = new domConstruct.create('div', {
				id : 'boilingtemp',
				'title': 'Boiling Temperature',
				'class' : "boilingtemp statsbarelements"
			}, this.parent);
			this.workers = new domConstruct.create('div', {
				id : 'workers',
				'title': 'Workers Left',
				'class' : 'workers statsbarelements'
			}, this.parent);
			this.risk = new domConstruct.create('div', {
				id : 'risk',
				'title': 'Risk Level',
				'class' : 'risk'
			}, this.parent);
			this.generalPowerOutput = new domConstruct.create('div', {
				id : 'generalPowerOutput',
				'title': 'General Power Output'
			}, this.parent);
			this.reactorTemp = new domConstruct.create('div', {
				id: 'reactorTemp',
				'class' : 'reactortemp temperatureelements',
				'title': 'Reactor Temperature'
			}, this.parent);
			this.rcsColdLegTemp = new domConstruct.create('div', {
				id: 'rcsColdLegTemp',
				'title': 'Reactor Coolant System Cold Leg Temperature',
				'class' : 'rcscoldlegtemp temperatureelements'
			}, this.parent);
			this.rcsHotLegTemp = new domConstruct.create('div', {
				id: 'rcsHotLegTemp',
				'title': 'Reactor Coolant System Hot Leg Temperature',
				'class' : 'rcshotlegtemp temperatureelements'
			}, this.parent);
			this.circulatingSystemColdLegTemp = new domConstruct.create('div', {
				id: 'circulatingSystemColdLegTemp',
				'title': 'Circulating System Cold Leg Temperature',
				'class' : 'circulatingsystemcoldlegtemp temperatureelements'
			}, this.parent);
			this.circulatingSystemHotLegTemp = new domConstruct.create('div', {
				id: 'circulatingSystemHotLegTemp',
				'title': 'Circulating System Hot Leg Temperature',
				'class' : 'circulatingsystemhotlegtemp temperatureelements'
			}, this.parent);
			this.feedwaterColdLegTemp = new domConstruct.create('div', {
				id: 'feedwaterColdLegTemp',
				'title': 'Auxiliary Feedwater Cold Leg Temperature',
				'class' : 'feedwatercoldlegtemp temperatureelements'
			}, this.parent);
			this.feedwaterHotLegTemp = new domConstruct.create('div', {
				id: 'feedwaterHotLegTemp',
				'title': 'Auxiliary Feedwater Hot Leg Temperature',
				'class' : 'feedwaterhotlegtemp temperatureelements'
			}, this.parent);
			this.generalPowerOutput = new domConstruct.create('div', {
				id: 'generalPowerOutput',
				'title': 'General Power Output (MWH)',
				'class' : 'generalpoweroutput temperatureelements'
			}, this.parent);
		},
		
		pollMsg : function(event) {

			try {
				var obj = JSON.parse(event.data);
				this.mwh.innerHTML = Math.round(obj.mwh);
				this.reactorTemp.innerHTML = Math.round(obj.reactortemp);
				this.rcsColdLegTemp.innerHTML = Math.round(obj.rcscoldlegtemp);
				this.rcsHotLegTemp.innerHTML = Math.round(obj.rcshotlegtemp);
				this.simtime.innerHTML = Math.round(obj.simtime);
				this.generalPowerOutput.innerHTML = Math.round(obj.genmw);
				this.circulatingSystemColdLegTemp.innerHTML = Math.round(obj.cscoldlegtemp);
				this.circulatingSystemHotLegTemp.innerHTML = Math.round(obj.cshotlegtemp);
				this.feedwaterColdLegTemp.innerHTML = Math.round(obj.afscoldlegtemp);
				this.feedwaterHotLegTemp.innerHTML = Math.round(obj.afshotlegtemp);
				this.rcspressure.innerHTML=Math.round(obj.rcspressure);
				this.boilingtemp.innerHTML=Math.round(obj.boilingtemp);
				this.workers.innerHTML=Math.round(obj.workers);
				this.risk.innerHTML=Math.round(obj.risk);
			} catch(err) {
				console.log("Error in socket:", err);
			}
		}
	});
});
