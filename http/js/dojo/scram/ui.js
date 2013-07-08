define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dojo/fx", "dijit/_TemplatedMixin", "dojo/Evented", 
"scram/sockets", "scram/plant", "scram/status", "scram/splash", "scram/user", "scram/earthquake", "dojo/text!scram/templates/ui.html"], 
function(on, lang, Declare, _WidgetBase, _Container, _Contained, fx, _TemplatedMixin, Evented, Sockets, Plant, Status, Splash, User, Earthquake, template) {
	return Declare("scram.ui", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for the main UI
		///
		templateString : template,
		args : null, //property bag
		_sockets : null,

		constructor : function(args) {
			this.args = args;
			this._sockets = new Sockets();
		},
		buildRendering : function() {
			this.inherited(arguments);
		},
		postCreate : function() {
			this.splash = new Splash();
			this.splash.on("hidden", lang.hitch(this, function() {
				this.user = new User({
					socket : this._sockets.userSocket
				}, this.userloginDAP);
				this.user.on("hidden", lang.hitch(this, function() {
					this.status = new Status({
						socket : this._sockets.pollSocket
					}, this.statusDAP);
					this.plant = new Plant({
						sockets : this._sockets
					}, this.plantDAP);
				}));
			}));
			this.addChild(this.splash);
			this.addChild(this.user);
			this.addChild(this.earthquake);

			dojo.style(this.userDAP, "opacity", "0");
			dojo.style(this.statusDAP, "opacity", "0");
			dojo.style(this.plantDAP, "opacity", "0");
			this.inherited(arguments);
		},
		startup : function() {
			this.inherited(arguments);
		}
	});

});
