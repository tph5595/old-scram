define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dijit/form/TextBox", "dojox/socket", "dojo/text!scram/templates/flag.html"], function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, TextBox, Socket, template) {
	return Declare("scram.flag", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the flag
		///
		templateString : template,
		socket : null,
		constructor : function(args) {
			this.socket = new Socket("ws://192.168.15.5:50506");
			this.socket.on("error", lang.hitch(this, function(e) {
				console.log("Flag Socket Error", e);
			}));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		onFlagSubmission : function() {
			var submitFlag = {
				'flag' : this.flagDAP.value
			};
			console.log("Flag Post Data", submitFlag);
			this.socket.send(JSON.stringify(submitFlag));
		}
	});
});
