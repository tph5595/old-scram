define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "scram/sockets", "scram/plant", "scram/status", "scram/splash", "dojo/text!scram/templates/ui.html"], function(lang, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Sockets, Plant, Status, Splash, template) {
	return Declare("scram.ui", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
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

			/*this.twitterfeed = new domConstruct.create('div', {
			 id: 'twitterfeed',
			 'class': 'twitterfeed z0'
			 }, ui);
			 this.bgBlack = new domConstruct.create('div', {
			 id : 'bgBlack',
			 'class' : 'bgblack z1'
			 }, this.ui);
			 this.bgOrange = new domConstruct.create('div', {
			 id : 'bgOrange',
			 'class' : 'bgorange z1'
			 }, this.ui);
			 this.twitterFeed = new domConstruct.create('div', {
			 id : 'twitterFeed',
			 'class' : 'twitterfeed z1'
			 }, this.bgBlack);
			 this.main = new domConstruct.create("div", {
			 id : 'main',
			 'class' : "scrambackground z1"
			 }, this.bgBlack);
			 this.poll = new domConstruct.create("div", {
			 id : 'poll',
			 'class' : "statsbarbackground z1"
			 }, this.bgOrange);

			 */
			this.splash = new Splash();
			this.splash.on("hidden", lang.hitch(this, function() {
			this.status = new Status({
				socket : this._sockets.pollSocket
			}, this.statusDAP);

			this.plant = new Plant({
				sockets : this._sockets
			}, this.plantDAP);
			}));
			this.addChild(this.splash);
			//this.splash.show();


			
			dojo.style(this.statusDAP, "opacity", "0");
			dojo.style(this.plantDAP, "opacity", "0");
			this.inherited(arguments);
		},
		startup : function() {
			this.inherited(arguments);
		}
	});

});
