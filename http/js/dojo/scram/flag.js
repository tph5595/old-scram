define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dijit/form/TextBox", "dojo/text!scram/templates/flag.html"], function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, TextBox, template) {
	return Declare("scram.flag", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the flag
		///
		templateString : template,

		constructor : function(args) {
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		onFlagSubmission : function() {
			var submitFlag = 'flag=test';
			var xhrArgs = {
				url:"http://127.0.0.1:50505",
				postData:submitFlag,
				handleAs : "text/html",
				//headers:{"Content-Length":submitFlag.length},
				load : function(data) {
					console.log("posted Flag",data)
				},
				error : function(error) {
					console.log("Flag",error);
				}
			}
			var deferred = dojo.xhrPost(xhrArgs);

		}
	});
});
