define(["dojo/on", "dojo/_base/lang", "dojo/_base/declare", "dojo/fx", "dijit/_WidgetBase", "dijit/_Container", "dojo/dom-class", "dijit/_Contained", 
"dijit/_TemplatedMixin", "dojo/Evented", "dojo/text!scram/templates/banner.html"], 
function(on, lang, Declare, fx, _WidgetBase, _Container, domClass, _Contained, _TemplatedMixin, Evented, template) {
	return Declare("scram.banner", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
		///
		/// This is the class for the plant
		///
		templateString : template,

		constructor : function(args) {
		},
		postCreate : function() {
			this.inherited(arguments);
		}
	});
});
