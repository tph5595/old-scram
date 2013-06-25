define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", 
"dijit/_TemplatedMixin", "dojo/Evented", "dojo/fx/Toggler", "dojo/fx", "dojo/on",
"dojo/text!scram/templates/splash.html"], function(lang, Declare, _WidgetBase, _Container, 
	_Contained, _TemplatedMixin, Evented, Toggler, coreFx, on, template) {
	return Declare("scram.splash", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the splash page
		///
		templateString : template,
		splashToggler : null,
		args : null, //property bag

		constructor : function(args) {
			this.args = args;
		},
		buildRendering : function() {
			this.inherited(arguments);
		},
		postCreate : function() {
			this.audio = new Audio("/js/dojo/scram/templates/atari-st-beat-11.wav");
			this.audio.loop = true;
			this.audio.play();
			dojo.style(this.splashDAP, "opacity", "0");
			var fadeArgs = {
				node : this.splashDAP,
				duration : 5000,
			};
			dojo.fadeIn(fadeArgs).play();
			this.inherited(arguments);
		},
		startup : function() {
			this.inherited(arguments);
		},
		click : function() {
			this.hide();
		},
		show : function() {
			this.emit("test", {
				blargh : "test"
			});
			this.splashToggler.show();
		},
		hide : function() {
			var fadeArgs = {
				node : this.splashDAP,
				duration : 200,
			};
			dojo.fadeOut(fadeArgs).play();
			dojo.style(this.splashDAP, "height", "0px");
			this.emit("hidden",{});
			this.audio.pause();

		}
	});

});
