define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Contained", "dojo/dom-construct", "dojo/dom-style", "dojo/fx"], function(lang, on, Declare, _WidgetBase, _Contained, domConstruct, domStyle, fx) {
	return Declare("scram.poll", [_WidgetBase, _Contained], {
		///
		/// This is the class for the poll data
		///
		_socket : null,
		parent : null,

		constructor : function(args) {
			this._socket = args.socket;
			this.parent = args.parent;
			this._socket.on("message", lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.mwh = new domConstruct.create('div', {
				id : 'mwh',
				'class' : 'mwh statsbarelements'
			}, this.parent);
			this.simtime = new domConstruct.create('div', {
				id : 'simtime',
				'class' : "simtime statsbarelements"
			}, this.parent);
			this.rcspressure = new domConstruct.create('div', {
				id : 'rcspressure',
				'class' : "rcspressure statsbarelements"
			}, this.parent);
			this.boilingtemp = new domConstruct.create('div', {
				id : 'boilingtemp',
				'class' : "boilingtemp statsbarelements"
			}, this.parent);
			this.workers = new domConstruct.create('div', {
				id : 'workers',
				'class' : 'workers statsbarelements'
			}, this.parent);
			this.risk = new domConstruct.create('div', {
				id : 'risk',
				'class' : 'risk'
			}, this.parent);
			this.generalPowerOutput = new domConstruct.create('div', {
				id : 'generalPowerOutput'
			}, this.parent);
			this.reactorTemp = new domConstruct.create('div', {
				id: 'reactorTemp',
				'class' : 'reactortemp temperatureelements'
			}, this.parent);
			this.rcsColdLegTemp = new domConstruct.create('div', {
				id: 'rcsColdLegTemp',
				'class' : 'rcscoldlegtemp temperatureelements'
			}, this.parent);
			this.rcsHotLegTemp = new domConstruct.create('div', {
				id: 'rcsHotLegTemp',
				'class' : 'rcshotlegtemp temperatureelements'
			}, this.parent);
			this.circulatingSystemColdLegTemp = new domConstruct.create('div', {
				id: 'circulatingSystemColdLegTemp',
				'class' : 'circulatingsystemcoldlegtemp temperatureelements'
			}, this.parent);
			this.circulatingSystemHotLegTemp = new domConstruct.create('div', {
				id: 'circulatingSystemHotLegTemp',
				'class' : 'circulatingsystemhotlegtemp temperatureelements'
			}, this.parent);
			this.feedwaterColdLegTemp = new domConstruct.create('div', {
				id: 'feedwaterColdLegTemp',
				'class' : 'feedwatercoldlegtemp temperatureelements'
			}, this.parent);
			this.feedwaterHotLegTemp = new domConstruct.create('div', {
				id: 'feedwaterHotLegTemp',
				'class' : 'feedwaterhotlegtemp temperatureelements'
			}, this.parent);
			this.generalPowerOutput = new domConstruct.create('div', {
				id: 'generalPowerOutput',
				'class' : 'generalpoweroutput temperatureelements'
			}, this.parent);
		},
		
		pollMsg : function() {

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
