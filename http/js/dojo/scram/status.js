define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/text!scram/templates/status.html"], function(lang, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, template) {
	return Declare("scram.status", [_WidgetBase, _Container, _Contained, _TemplatedMixin], {

		_socket : null,
		templateString : template,
		'class':"statsbarbackground z1",
		constructor : function(args) {
			this._socket = args.socket;
			this._socket.on("message", lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
		},

		pollMsg : function(event) {

			try {
				var obj = JSON.parse(event.data);
				this.mwh.innerHTML = Math.round(obj.mwh);
				this.rcsPressure.innerHTML = Math.round(obj.rcspressure);
				this.boilingTemp.innerHTML = Math.round(obj.boilingtemp);
				this.workers.innerHTML = Math.round(obj.workers);
				this.risk.innerHTML = Math.round(obj.risk);
				this.simtime.innerHTML = Math.round(obj.simtime);
			} catch(err) {
				console.log("Error in socket:", err);
			}
		}
	});
});