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
		},
		postCreate : function() {
				this.mwh = new domConstruct.create('div', {
					id : 'mwh',
					'class': 'mwh statsbarelements'
				}, this.parent);
				
				this.simtime = new domConstruct.create('div', {
					id : 'simtime',
					'class':"simtime statsbarelements"
				}, this.parent);
				this.rcspressure = new domConstruct.create('div', {
					id : 'rcspressure',
					'class': "rcspressure statsbarelements"
				}, this.parent);
				this.boilingtemp = new domConstruct.create('div', {
					id : 'boilingtemp',
					'class': "boilingtemp statsbarelements"
				}, this.parent);
				this.workers = new domConstruct.create('div', {
					id : 'workers',
					'class': 'workers statsbarelements'
				}, this.parent);
				this.risk = new domConstruct.create('div', {
					id : 'risk',
					'class': 'risk'
				}, this.parent);
				this.generalPowerOutput = new domConstruct.create('div', {
					id : 'generalPowerOutput'
				}, this.parent);
				this.simtime.innerHTML = "123456";
				this.rcspressure.innerHTML = "123456";
				this.boilingtemp.innerHTML = "123456";
				this.workers.innerHTML = "123456";
				this.risk.innerHTML = "123";
				this.mwh.innerHTML = "123456";
			this.inherited(arguments);
		}
	});
});
