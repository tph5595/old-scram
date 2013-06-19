define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-construct", "dojo/dom-style", "scram/sockets", "scram/rod", "scram/pump"], function(lang, Declare, _WidgetBase, _Container, domConstruct, domStyle, Sockets, Rods, Pump) {
	return Declare("scram.ui", [_WidgetBase, _Container], {
		///
		/// This is the class for the main UI
		///
		srcNodeRef : null, //the node to place the widget
		ui : null, //ref to the node we create
		args : null, //property bag
		_sockets : null,

		constructor : function(props, srcNodeRef) {
			this.props = props;
			this.srcNodeRef = srcNodeRef
			this._sockets = new Sockets();

		},
		buildRendering : function() {
			//add to the dom here
			this.ui = new domConstruct.create("div", {
				id : "ui",
				'class' : "ui z0"
			}, this.srcNodeRef);

			this.inherited(arguments);
		},
		postCreate : function() {
			//perform actions on the elements here
			//the widget has been rendered by now
			//no sizing has happened
			//child widgets in the containierNode have not been rendered
			this.rods = new Rods({
				"socket" : this._sockets.rodSocket,
				"parent" : this.ui
			});
			this.rcsPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'pumpLevelMax' : 4,
				'pumpId' : 'rcs',
				'parent' : this.ui,
				pumpClass :'rcspump pumpsize pump0',
				pumpUpClass : 'rcspumpup upbutton',
				pumpDownClass : 'rcspumpdown downbutton',
			});
			this.hpiTankPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'pumpLevelMax' : 4,
				'pumpId' : 'hpiTank',
				'parent' : this.ui,
				pumpClass :'hpitankpump pumpsize pump0',
				pumpUpClass : 'hpitankpumpup upbutton',
				pumpDownClass : 'hpitankpumpdown downbutton',
			});
			this.auxTankPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'pumpLevelMax' : 3,
				'pumpId' : 'auxTank',
				'parent' : this.ui,
				pumpClass :'auxtankpump pumpsize pump0',
				pumpUpClass : 'auxtankpumpup upbutton',
				pumpDownClass : 'auxtankpumpdown downbutton',
			});
			this.feedwaterPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'pumpLevelMax' : 2,
				'pumpId' : 'feedwater',
				'parent' : this.ui,
				pumpClass :'feedwaterpump pumpsize pump0',
				pumpUpClass : 'feedwaterpumpup upbutton',
				pumpDownClass : 'feedwaterpumpdown downbutton',
			});
			this.csPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'pumpLevelMax' : 2,
				'pumpId' : 'cs',
				'parent' : this.ui,
				pumpClass :'cspump pumpsize pump0',
				pumpUpClass : 'cspumpup upbutton',
				pumpDownClass : 'cspumpdown downbutton',
			});

			this.addChild(this.rods);
			this.inherited(arguments);
		},
		startup : function() {
			//If you need to be sure parsing and creation of any child widgets has completed, use startup.
			//This is often used for layout widgets like BorderContainer.
			//If the widget does JS sizing, then startup() should call resize(), which does the sizing.
			this.inherited(arguments);
		}
	});

});
