define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dojox/socket", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/dom-construct", 
"dojo/dom-class", "scram/face", "dojo/text!scram/templates/faces.html"], 
function(lang, on, Declare, Socket, _WidgetBase, _Container, _Contained, _TemplatedMixin, domConstruct, domClass, Face, template) {
	return Declare("scram.faces", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for faces
		///
	
		templateString : template,
		socket : null,
		poll : null,
								
			
		constructor: function(args){
			this.socket = args.socket;
			this.poll = args.poll;
			
		},
		postCreate : function() {	
			this.quakeFace = new Face ({
				'socket' : this.socket,
				'poll' : this.poll,
				'faceClass' : 'noface z4',
				'faceId' : 'quake'				
			}, this.quakefaceDAP);
			this.meltdownFace = new Face ({
				'socket' : this.socket,
				'poll' : this.poll,
				'faceClass' : 'noface z4',
				'faceId' : 'meltdown'
			}, this.meltdownfaceDAP);
			this.explosionFace = new Face ({
				'socket' : this.socket,
				'poll' : this.poll,
				'faceClass' : 'noface z4',
				'faceId' : 'explosion'
			}, this.explosionfaceDAP);
			this.steamvoidingFace = new Face ({
				'socket' : this.socket,
				'poll' : this.poll,
				'faceClass' : 'noface z4',
				'faceId' : 'steamvoiding'
			}, this.steamvoidingfaceDAP);
			
			this.inherited(arguments);
		}
	})
});
