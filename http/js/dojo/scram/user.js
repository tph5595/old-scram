define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/dom-construct", "dojo/dom-class", "dijit/form/TextBox","dojo/text!scram/templates/user.html"], function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, domConstruct, domClass, TextBox, template) {
	return Declare("scram.user", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the valve
		///
		templateString : template,
		socket : null,

		constructor : function(args) {
			this.socket = args.socket;
		},
		postCreate : function() {
			var userName = new TextBox({
				name : "userName",
				value : "",
				placeHolder : "User Name"
			}, this.userDAP);
						var userPass = new TextBox({
				name : "userPass",
				type:"password",
				value : ""
			}, this.passwordDAP);
			
			this.inherited(arguments);
		},
		onLoginClick : function() {
			j = {"user":this.userName.get("value"),
				"password":this.userPass.get("value")}
				
			this.socket.send(JSON.stringify(j));
		}
	});
}); 