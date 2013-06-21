define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-construct", 
"dojo/dom-style", "scram/sockets", "scram/rod", "scram/pump","scram/poll"], 
function(lang, Declare, _WidgetBase, _Container, domConstruct, domStyle, Sockets, Rods, Pump, Poll) {
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
			/*this.twitterfeed = new domConstruct.create('div', {
				id: 'twitterfeed',
				'class': 'twitterfeed z0'
			}, ui);*/
			this.bgBlack = new domConstruct.create('div', {
				id: 'bgBlack',
				'class': 'bgblack z1'
			}, ui);
			this.bgOrange = new domConstruct.create('div', {
				id: 'bgOrange',
				'class': 'bgorange z1'
			}, ui);
			this.twitterFeed = new domConstruct.create('div', {
				id: 'twitterFeed',
				'class': 'twitterfeed z1'
			}, bgBlack);
			this.main = new domConstruct.create("div", {
				id: 'main',
				'class' : "scrambackground z1"
			}, bgBlack);
			this.poll = new domConstruct.create("div", {
				id: 'poll',
				'class' : "statsbarbackground z1"
			}, bgOrange);
			this.rods = new Rods({
				"socket" : this._sockets.rodSocket,
				"parent" : this.main,
				'class' : "z2"
			});
			this.rcsPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'poll':this._sockets.pollSocket,
				'pumpLevelMax' : 4,
				'pumpId' : 'rcs',
				'parent' : this.main,
				pumpClass :'rcspump pumpsize pump0 z2',
				pumpUpClass : 'rcspumpup upbutton z2',
				pumpDownClass : 'rcspumpdown downbutton z2',
			});
			this.hpiTankPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'poll':this._sockets.pollSocket,
				'pumpLevelMax' : 4,
				'pumpId' : 'hpiTank',
				'parent' : this.main,
				pumpClass :'hpitankpump pumpsize pump0 z2',
				pumpUpClass : 'hpitankpumpup upbutton z2',
				pumpDownClass : 'hpitankpumpdown downbutton z2',
			});
			this.auxTankPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'poll':this._sockets.pollSocket,
				'pumpLevelMax' : 3,
				'pumpId' : 'auxTank',
				'parent' : this.main,
				pumpClass :'auxtankpump pumpsize pump0 z2',
				pumpUpClass : 'auxtankpumpup upbutton z2',
				pumpDownClass : 'auxtankpumpdown downbutton z2',
			});
			this.feedwaterPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'poll':this._sockets.pollSocket,
				'pumpLevelMax' : 2,
				'pumpId' : 'feedwater',
				'parent' : this.main,
				pumpClass :'feedwaterpump pumpsize pump0 z2',
				pumpUpClass : 'feedwaterpumpup upbutton z2',
				pumpDownClass : 'feedwaterpumpdown downbutton z2',
			});
			this.csPump = new Pump({
				'socket' : this._sockets.pumpSocket,
				'poll':this._sockets.pollSocket,
				'pumpLevelMax' : 2,
				'pumpId' : 'cs',
				'parent' : this.main,
				pumpClass :'cspump pumpsize pump0 z2',
				pumpUpClass : 'cspumpup upbutton z2',
				pumpDownClass : 'cspumpdown downbutton z2',
			});
			this.poll = new Poll({
				parent: this.poll,
				socket: this._sockets.pollSocket
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
