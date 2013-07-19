define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", 
"dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dojo/text!scram/templates/score.html"], 
function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.score", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the score
		///
		templateString : template,

		constructor : function(args) {
		},
		postCreate : function() {
			this.inherited(arguments);
		},
	});
});
