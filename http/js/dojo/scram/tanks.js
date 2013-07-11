define(["dojo/_base/lang", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
"dijit/_Contained", "dijit/_TemplatedMixin",
"scram/tank","dojo/text!scram/templates/tanks.html"], 
function(lang,Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin,Tank,template) {
	return Declare("scram.tanks", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the tanks
		///
		templateString:template,
		poll:null,

		constructor : function(args) {
			this.poll = args.poll;
		},
		postCreate : function() {
			this.pressurizerTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'pressurizerwater',
				'valveId' : 'pressurizervalve',
				'pumpLevel' : -1,
				'title': 'Pressurizer Tank',
				tankClass :'pressurizertank pressurizertanklevel0 z2',
			},this.pressurizerTankDAP);
			
			this.hpiTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'hpiwater',
				'valveId' : 'hpivalve',
				'pumpLevel' : 'hpiTank',
				'title':"HPI Tank",
				tankClass :'hpitank tanklevel7 z2',
			},this.hpiTankDAP);
			
			this.auxTank = new Tank({
				//'socket' : this.socket,
				'poll':this.poll,
				'tankLevelMax' : 6,
				'tankId' : 'afswater',
				'valveId' : 'afsvalve',
				'pumpLevel' : 'auxTank',
				'title': 'Auxiliary Tank',
				tankClass :'auxtank tanklevel7 z2',
			},this.auxTankDAP);
			
			
			this.inherited(arguments);
		}


	});
});
