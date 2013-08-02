define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dojo/fx", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-class", "dijit/_Contained", "dijit/_TemplatedMixin", 
"dojo/Evented", "scram/score", "scram/flag", "dojo/text!scram/templates/toolbar.html"], 
function(on, lang, Declare, fx, _WidgetBase, _Container, domClass, _Contained, _TemplatedMixin, Evented, Score, Flag, template) {
	return Declare("scram.toolbar", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the toolbar
		///
		templateString : template,
		sockets : null,
		'class': 'toolbar',
		
		constructor : function(args) {
			this.socket = args.socket
			this.socket.on('message', lang.hitch(this, this.windowMove));
		},
		postCreate : function() {
			this.score = new Score({
				poll : this.socket
			}, this.toolbarDAP);
			this.flag = new Flag({
				poll : this.socket
			}, this.toolbarDAP);
			
			this.addChild(this.score);
			this.addChild(this.flag);
			this.inherited(arguments);
		},
		windowMove : function(){
			this.windowWidth = window.innerWidth;
			this.widthCheck = 1920;
			if (this.windowWidth < this.widthCheck){
				domClass.remove(this.toolbarDAP)
				domClass.add(this.toolbarDAP, 'modifiedtoolbar');
			}
			else{
				domClass.remove(this.toolbarDAP)
				domClass.add(this.toolbarDAP, 'toolbar');
			}
		}
	});
});