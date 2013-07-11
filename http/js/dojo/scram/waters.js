define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin", "dojo/fx",
"scram/water","dojo/text!scram/templates/waters.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin,fx,Water,template) {
	return Declare("scram.waters", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the waters
		///
		templateString:template,
		poll:null,

		constructor : function(args) {
			this.poll = args.poll;
		},
		postCreate : function() {
			//rcs hot leg
			this.rcs = new Water({
				'poll':this.poll,
				rcsWaterClass :'rcsdot dot z2',
			},this.rcsDAP);
			this.afs = new Water({
				'poll':this.poll,
				afsWaterClass :'afsdot dot z2',
			},this.afsDAP);
			this.cs = new Water({
				'poll':this.poll,
				csWaterClass :'csdot dot z2',
			},this.csDAP);
			this.hpi = new Water({
				'poll':this.poll,
				'tankLevel':'hpiTank',
				hpiWaterClass :'hpidot dot z2',
			},this.hpiDAP);
			this.aux = new Water({
				'poll':this.poll,
				'tankLevel':'auxTank',
				auxWaterClass :'auxdot dot z2',
			},this.auxDAP);
			//next one
			this.inherited(arguments);
		},

	});
});
