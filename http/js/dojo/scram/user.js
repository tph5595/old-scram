define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", 
"dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dijit/form/TextBox","dojo/text!scram/templates/user.html"], 
function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, TextBox, template) {
	return Declare("scram.user", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the valve
		///
		templateString : template,
		socket : null,

		constructor : function(args) {
			this.socket = args.socket;
		},
		postCreate : function() {
			this.userName = new TextBox({
				name : "userName",
				value : "",
				'class' : 'user',
				placeholder : "User Name"
			}, this.userDAP);
			this.userPass = new TextBox({
				name : "userPass",
				type:"password",
				value : "",
				'class' : 'pass',
				placeholder : "Password"
			}, this.passwordDAP);
			dojo.style(this.loginbodyDAP, "opacity", "0");
			var loginFadeArgs = {
				node : this.loginbodyDAP,
				duration : 1000,
			};
			dojo.fadeIn(loginFadeArgs).play();
			focusUtil.focus(this.userName);
			this.inherited(arguments);
		},
		hide : function() {
			var fadeArgs = {
				node : this.loginbodyDAP,
				duration : 200,
			};
			dojo.fadeOut(fadeArgs).play();
			dojo.style(this.loginbodyDAP, "height", "0px");
			this.emit("hidden",{});
		},
		onLoginClick : function() {
			this.usertemp = this.userName.get("value");
			this.passtemp = this.userPass.get("value");
			j = {"user":this.usertemp,
				"password":this.passtemp}
			console.log(j, 'obj');
			if (this.usertemp == '' && this.passtemp == ''){
				this.userName.set("value", "");
				this.userPass.set("value", "");	
				console.log('incorrect login');
			}
			else if (this.usertemp == 'password' && this.passtemp == 'admin'){
				window.location = "goo.php";
			}
			else {
				this.socket.send(JSON.stringify(j));
				console.log('correct login');	
				this.hide();
			}
		}
	});
}); 