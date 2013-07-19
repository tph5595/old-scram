define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dojo/Deferred", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/face.html"], 
function(lang, on, Declare, Deferred, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.face", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for face
		///
		
		faceId : null,
		socket : null,
		socketFace : null,
		modSimtime : null,
		pollFace : null,
		poll: null,
		faceClass : null,
		_setFaceClassAttr : {node : "faceDAP", type : "class"},
		templateString : template,
			
		constructor: function(args){
			this.faceId = args.faceId;
			this.socketFace = false;
			this.socket = args.socket;
			this.faceClass = args.faceClass;
			this.modSimtime = -1;
			this.pollFace = false;
			this.poll = args.poll;
			this.socket.on("message",lang.hitch(this,this.socketMsg));
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		socketMsg: function(event){
			var obj = JSON.parse(event.data);
			if (this.faceId != 'meltdown' && this.faceId != 'explosion' && this.faceId != 'steamvoiding'){
				this.socketFace = obj['quake'];
				this.addFacePrep();
			}	
			this.addFacePrep();
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.modSimtime = obj['simtime'] % 2;
			if (this.faceId != 'quake'){
				this.pollFace = obj[this.faceId];
				this.addFacePrep();
			}
			
		},
		addFacePrep : function(){
			if (this.pollFace == true || this.socketFace == true){
				if (this.socketFace == true && this.pollFace == false){
					this.faceId = 'quake';
				}
				if (this.socketFace == true && this.faceId == 'steamvoiding' && this.pollFace == true){
					this.pollFace = false
				}
				switch (this.modSimtime){
					case 0:
						this.addFaceClosed(this.faceId);
						break;
					case 1:
						this.addFaceOpen(this.faceId);
						break;
				}
			}
			else{
				this.removeFace();
			}
		},
		addFaceClosed : function(id){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, id+'faceclosed' + ' z4');
		},
		addFaceOpen : function (id){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, id+'faceopen' + ' z4');
		},
		removeFace : function(){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, 'noface' + ' z4');
		}
	})
});
