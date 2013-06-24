define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dojo/Evented", "dojo/dom-construct", "dojo/dom-style", "dojo/fx/Toggler", "dojo/fx", "dojo/on"], function(lang, Declare, _WidgetBase, _Container, Evented, domConstruct, domStyle, Toggler, coreFx, on) {
	return Declare("scram.splash", [Evented, _WidgetBase, _Container], {
		///
		/// This is the class for the splash page
		///
		srcNodeRef : null, //the node to place the widget
		splash : null, //ref to the node we create
		splashToggler : null,
		args : null, //property bag

		constructor : function(args, srcNodeRef) {
			this.srcNodeRef = srcNodeRef
		},
		buildRendering : function() {
			//add to the dom here
			this.splash = new domConstruct.create("div", {
				'class' : "splash z3"
			}, this.srcNodeRef);
			this.splashToggler = new Toggler({
				node : this.srcNodeRef,
				showFunc : coreFx.wipeIn,
				hideFunc : coreFx.wipeOut
			});

			this.inherited(arguments);
		},
		postCreate : function() {
			on(this.splash, "click", lang.hitch(this, this.hide));
			this.emit("test",{});
			this.inherited(arguments);
		},
		startup : function() {
			this.inherited(arguments);
		},
		show : function() {
			this.splashToggler.show();
		},
		hide : function() {
			this.splashToggler.hide();
			this.emit("hide",{});
		}
	});

});
