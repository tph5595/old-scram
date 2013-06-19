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
				var MWH = new domConstruct.create('div', {
					id : 'MWH'
				}, this.parent);
				var simtime = new domConstruct.create('div', {
					id : 'simtime'
				}, this.parent);
				var rcspressure = new domConstruct.create('div', {
					id : 'rcspressure'
				}, this.parent);
				var boilingtemp = new domConstruct.create('div', {
					id : 'boilingtemp'
				}, this.parent);
				var workers = new domConstruct.create('div', {
					id : 'workers'
				}, this.parent);
				var risk = new domConstruct.create('div', {
					id : 'risk'
				}, this.parent);
				var generalPowerOutput = new domConstruct.create('div', {
					id : 'generalPowerOutput'
				}, this.parent);
			this.inherited(arguments);
		}
	});
});
