define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dojo/fx", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-class", "dijit/_Contained", "dijit/_TemplatedMixin", 
"dojo/Evented", "scram/score", "scram/flag", "dojo/text!scram/templates/toolbar.html"], 
function(on, lang, Declare, fx, _WidgetBase, _Container, domClass, _Contained, _TemplatedMixin, Evented, Score, Flag, template) {
	return Declare("scram.toolbar", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the toolbar
		///
		templateString : template,

		constructor : function(args) {
			
		},
		postCreate : function() {
			
			this.score = new Score();
			this.flag = new Flag();
			
			this.addChild(this.flag);
			this.inherited(arguments);
		}
	});
});