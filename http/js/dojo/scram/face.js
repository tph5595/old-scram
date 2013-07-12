define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dojo/Deferred", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/face.html"], 
function(lang, on, Declare, Deferred, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.face", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for face
		///
		
		faceId : null,
		socket : null,
		poll: null,
		faceClass : null,
		_setFaceClassAttr : {node : "faceDAP", type : "class"},
		templateString : template,
			
		constructor: function(args){
			this.faceId = args.faceId;
			this.socket = args.socket;
			this.faceClass = args.faceClass;
			this.poll = args.poll;
			this.socket.on("message",lang.hitch(this,this.socketMsg));
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		socketMsg: function(event){
			var obj = JSON.parse(event.data);
			this.socketMsgHolder = obj['quake'];
			this.socketMsg = this.socketMsgHolder;
			//this.socketMsg = true;
			if (this.socketMsg == true){
				switch (this.modSimtime){
					case 0:
						//this.addFaceClosed('quake');
						break;
					case 1:
						//this.addFaceOpen('quake');
						break;
				}
			}
				
			else {
				this.removeFace();
			}
		},
		addFace : function(){
			domClass.toggle(this.faceDAP, this.faceId+'faceclosed ' + this.faceId+'faceopen');
		},
		addFaceClosed : function(){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, this.faceId+'faceclosed' + ' z4');
			console.log('did face closed run?)');
		},
		addFaceOpen : function (id){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, this.id+'faceopen' + ' z4');
		},
		removeFace : function(){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, 'noface' + ' z4');
		},
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			if (this.faceId != 'quake'){
				this.pollMsg = obj[this.faceId]
				if (this.pollMsg == true){
					//this.addFace();
				}
			}
			/*
			this.meltdown = this.obj['meltdown'];
			this.explosion = this.obj['explosion']; 
			this.explosion = true; //for testing
			*/
		}
	})
});
