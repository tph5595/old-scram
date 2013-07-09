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
				'damageId' : 'rcsdamage',
				'damageClass' : 'rcsdamage'	
			}, this.rcsPumpDamageDAP),
			
			this.afsPumpDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'AFS Pump Broken',
				'damageId' : 'afsdamage',
				'damageClass' : 'afsdamage'	
			}, this.afsPumpDamageDAP),
			this.csPumpDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'CS Pump Broken',
				'damageId' : 'csdamage',
				'damageClass' : 'csdamage'	
			}, this.csPumpDamageDAP),
			
			this.hpiPumpDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'HPI Tank Pump Broken',
				'damageId' : 'hpitankdamage',
				'damageClass' : 'hpitankdamage'	
			}, this.hpiPumpDamageDAP),
			
			this.auxPumpDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'AUX Tank Pump Broken',
				'damageId' : 'auxtankdamage',
				'damageClass' : 'auxtankdamage'	
			}, this.auxPumpDamageDAP),
			
			this.hpiValveDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'HPI Tank Valve Broken',
				'damageId' : 'hpivalvedamage',
				'damageClass' : 'hpivalvedamage'	
			}, this.hpiValveDamageDAP),
			
			this.auxValveDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'AUX Tank Valve Broken',
				'damageId' : 'auxvalvedamage',
				'damageClass' : 'auxvalvedamage'
			}, this.auxValveDamageDAP),
			
			this.pressurizerValveDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'Pressurizer Tank Valve Broken',
				'damageId' : 'pressurizervalvedamage',
				'damageClass' : 'pressurizervalvedamage'
			}, this.pressurizerValveDamageDAP),
			
			this.rodsDamage = new Damage({
				'socket' : this.socket,
				'damagestate' : false,
				'title' : 'Rods Broken',
				'damageId' : 'roddamage',
				'damageClass' : 'roddamage'
			}, this.rodsDamageDAP)
					
			
			this.inherited(arguments);
		}


	});
});
