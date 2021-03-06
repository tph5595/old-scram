define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dojo/fx", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-class", 
"scram/sockets", "scram/plant", "scram/status", "scram/splash", "scram/user", "scram/tweet", "scram/toolbar", "scram/banner", "scram/mouseclick", "dojo/text!scram/templates/ui.html"], 
function(on, lang, Declare, _WidgetBase, _Container, _Contained, fx, _TemplatedMixin, Evented, domClass, Sockets, Plant, Status, Splash, User, Tweet,Toolbar, Banner, MouseClick, template) {
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
					this.banner = new Banner({
					}, this.bannerDAP);
					this.plant = new Plant({
						sockets : this._sockets
					}, this.plantDAP);
					this.tweet = new Tweet({
						socket : this._sockets.pollSocket
					}, this.tweetDAP);
					this.toolbar = new Toolbar({
						socket : this._sockets.pollSocket
					}, this.toolbarDAP);
					this.mouseclick = new MouseClick({
					}, this.mouseclickDAP);

					//this._sockets.earthquakeSocket.on('message', lang.hitch(this, this.quakeShake));
					/*
					this.earthquake = new Earthquake({
						socket : this._sockets.earthquakeSocket,
						poll : this._sockets.pollSocket
					}, this.plantDAP);*/
					//this.earthquake.on("quake", lang.hitch(this, this.quake));
					//this.earthquake.on("noquake", lang.hitch(this, this.noquake));
				}));
			}));
			this.addChild(this.splash);
			this.addChild(this.user);
			this.addChild(this.banner);
			this.addChild(this.plant);
			this.addChild(this.tweet);
			this.addChild(this.toolbar);
			this.addChild(this.mouseclick);

			dojo.style(this.userDAP, "opacity", "0");
			dojo.style(this.statusDAP, "opacity", "0");
			dojo.style(this.plantDAP, "opacity", "0");
			
			this.inherited(arguments);
		},
		startup : function() {
			this.inherited(arguments);
		}
		/*
		quakeShake : function(event) {
			var obj = JSON.parse(event.data);
			this.quakeState = obj['quake'];
			this.quakeState = true;
			if (this.quakeState == true){
				domClass.remove(this.plantDAP);
				domClass.add(this.plantDAP, 'scrambackground z5');
				console.log('earthquake');
				this.earthquakeLeft = fx.slideTo({
					node : this.plantDAP,
					duration : 50,
					top : 8,
					left : 300
				});
				this.earthquakeRight = fx.slideTo({
					node : this.plantDAP,
					duration : 50,
					top : 20,
					left : 500
				});
				this.earthquakeCenter = fx.slideTo({
					node : this.plantDAP,
					duration : 50,
					top : 8,
					left : 400
				});
				this.chain = fx.chain([this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeRight, this.earthquakeLeft, this.earthquakeCenter]);
				this.chain.play();
			}
			else if (this.quakeState == false){
				domClass.remove(this.plantDAP);
				domClass.add(this.plantDAP, 'scrambackground scrambackgroundposition z1');
			}
		}
		*/
	});

});
