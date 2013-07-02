define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin",
"scram/tank","dojo/text!scram/templates/tanks.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin,Tank,template) {
	return Declare("scram.tanks", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the tanks
		///
		templateString:template,
		//socket : null,
		poll:null,

		constructor : function(args) {
		//	this.socket = args.socket;
			this.poll = args.poll;
		},
		postCreate : function() {
			this.pressurizerTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'pressurizerTank',
				'title': 'Pressurizer Tank',
				tankClass :'pressurizertank pressurizertanklevel0 z2',
			},this.pressurizerTankDAP);
			
			this.hpiTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'hpiTank',
				'title':"HPI Tank",
				tankClass :'hpitank tanklevel0 z2',
			},this.hpiTankDAP);
			
			this.auxTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'auxTank',
				'title': 'Auxiliary Tank',
				tankClass :'auxtank tanklevel0 z2',
			},this.auxTankDAP);
			
			
			this.inherited(arguments);
		}


	});
});
