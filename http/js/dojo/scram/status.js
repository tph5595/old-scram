define(["dojo/_base/lang", "dojo/_base/declare", "dojo/dom-class", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/text!scram/templates/status.html"], function(lang, Declare, domClass, _WidgetBase, _Container, _Contained, _TemplatedMixin, template) {
	return Declare("scram.status", [_WidgetBase, _Container, _Contained, _TemplatedMixin], {

		_socket : null,
		templateString : template,
		'class' : "statsbarbackground z1",
		critflag : null,
		rcsFlag : null,
		boilingFlag : null,
		constructor : function(args) {
			this._socket = args.socket;
			this._socket.on("message", lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.rcsFlag = 2;
			this.boilingFlag = 4;
			this.inherited(arguments);
		},

		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.critflag = obj['critflag'];
			if ((this.critflag & this.rcsFlag) == this.rcsFlag) {
				domClass.remove(this.rcsPressure);
				domClass.add(this.rcsPressure, 'rcspressure criticalstatsbarelements');
			} else {
				domClass.remove(this.rcsPressure);
				domClass.add(this.rcsPressure, 'rcspressure statsbarelements');
			}
			if ((this.critflag & this.boilingFlag) == this.boilingFlag) {
				domClass.remove(this.boilingTemp);
				domClass.add(this.boilingTemp, 'boilingtemp criticalstatsbarelements');
			} else {
				domClass.remove(this.boilingTemp);
				domClass.add(this.boilingTemp, 'boilingtemp statsbarelements');
			}
			try {
				var obj = JSON.parse(event.data);
				this.mwh.innerHTML = Math.round(obj.mwh);
				this.rcsPressure.innerHTML = Math.round(obj.rcspressure);
				this.boilingTemp.innerHTML = Math.round(obj.boilingtemp);
				this.workers.innerHTML = Math.round(obj.workers);
				this.risk.innerHTML = Math.round(obj.risk);

				var mins = Math.floor(Math.round(obj.simtime) / 60 % 60);
				var hours = Math.floor(Math.round(obj.simtime) / 3660);
				var seconds = Math.floor(Math.round(obj.simtime) % 60);
				var d = new Date();
				d.setHours(hours);
				d.setMinutes(mins);
				d.setSeconds(seconds);
				var simTime = d.toTimeString().split(" ")[0];
				this.simtime.innerHTML = simTime;
			} catch(err) {
				console.log("Error in socket:", err);
			}
		}
	});
});
