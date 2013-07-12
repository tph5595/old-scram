define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", 
"dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", "dojo/dom-class", "dijit/form/TextBox","dojo/text!scram/templates/flag.html"], 
function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, TextBox, template) {
	return Declare("scram.flag", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the flag
		///
		templateString : template,
		socket : null,

		constructor : function(args) {
			this.socket = args.socket;
		},
		postCreate : function() {
			this.flag = new TextBox({
				name : "flag",
				value : "",
				'class' : 'flag',
				'size' : 8,
				placeholder : "Flag"
			}, this.flagDAP);
			//focusUtil.focus(this.flag);
			this.inherited(arguments);
		},
		onFlagSubmission : function() {
			this.flagtemp = this.flag.get("value");
			j = {"flag":this.flagtemp}
			console.log(j, 'obj');
			if (this.flagtemp == ''){
				this.flag.set("value", "");
			}
			else {
				this.socket.send(JSON.stringify(j));
				this.flag.set("value", "");
				console.log(j);
			}
		}
	});
}); 