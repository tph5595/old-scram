define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dojo/Deferred", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/face.html"], 
function(lang, on, Declare, Deferred, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, template) {
	return Declare("scram.face", [_WidgetBase, _TemplatedMixin, Evented, _Contained, _Container], {
		///
		/// This is the class for face
		///
		
		'faceId' : null,
		socket : null,
		poll: null,
		faceClass : null,
		_setFaceClassAttr : {node : "faceDAP", type : "class"},
		templateString : template,
			
		constructor: function(args){
			this.faceClass = args.faceClass;	
			this.socket = args.socket;
			this.poll = args.poll;
			this.socket.on("message",lang.hitch(this,this.socketMsg));
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		socketMsg: function(event){
			var obj = JSON.parse(event.data);
			this.socketMsgHolder = obj[this.faceId];
			this.socketMsg = this.socketMsgHolder;
			switch (this.socketMsg){
				case true:
					switch (this.modSimtime){
						case 0:
							this.addFaceClosed();
							break;
						case 1:
							this.addFaceOpen();
							break;
					};
					break;
				case false:
					this.removeFace();
					break;
			}
		},
		
		addFaceClosed : function(){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, 'quakefaceclosed' + ' z4');
		},
		addFaceOpen : function (){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, 'quakefaceopen' + ' z4');
		},
		removeFace : function(){
			domClass.remove(this.faceDAP);
			domClass.add(this.faceDAP, 'noface' + ' z4');
		},
		pollMsg : function(event) {
			this.obj = JSON.parse(event.data);
			this.simtime = this.obj['simtime'];
			this.modSimtime = this.simtime % 2;
		}
		
	})
});
