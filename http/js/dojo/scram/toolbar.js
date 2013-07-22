define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dojo/fx", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-class", "dijit/_Contained", "dijit/_TemplatedMixin", 
"dojo/Evented", "scram/score", "scram/flag", "dojo/text!scram/templates/toolbar.html"], 
function(on, lang, Declare, fx, _WidgetBase, _Container, domClass, _Contained, _TemplatedMixin, Evented, Score, Flag, template) {
	return Declare("scram.toolbar", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the toolbar
		///
		templateString : template,
		sockets : null,
		
		constructor : function(args) {
			this.sockets = args.sockets
		},
		postCreate : function() {
			
			this.score = new Score({
				poll : this.sockets.pollSocket,
				earthquakeSocket : this.sockets.earthquakeSocket
			});
			this.flag = new Flag();
			
			this.addChild(this.score);
			this.addChild(this.flag);
			this.inherited(arguments);
		}
	});
});