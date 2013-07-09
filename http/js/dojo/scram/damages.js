define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin",
"scram/damage","dojo/text!scram/templates/damages.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, Damage,template) {
	return Declare("scram.damages", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the damages
		///
		templateString:template,
		//socket : null,
		socket:null,

		constructor : function(args) {
			this.socket = args.socket;
		},
		postCreate : function() {
						
			this.rcsPumpDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'RCS Pump Broken',
				'damageId' : 'rcsDamage',
				'damageClass' : 'pumpdamage'	
			}, this.rcsPumpDamageDAP)
			
			
			this.inherited(arguments);
		}


	});
});
