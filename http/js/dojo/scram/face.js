define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/dom-construct", 
"dojo/dom-class", "dojo/text!scram/templates/face.html"], 
function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, domConstruct, domClass, template) {
	return Declare("scram.face", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for face
		///
		
		'faceId' : null,
		socket : null,
		faceClass : null,
		_setFaceClassAttr : {node : "faceDAP", type : "class"},
		templateString : template,
			
		constructor: function(args){
			this.faceClass = args.faceClass;	
			this.socket = args.socket;
			this.socket.on("message",lang.hitch(this,this.socketMsg));
					
		},
	
		socketMsg: function(event){
			var obj = JSON.parse(event.data);
			this.socketMsgHolder = obj[this.faceId];
			this.socketMsg = this.socketMsgHolder;
			switch (this.socketMsg){
				case true:
					this.addFaceClosed();
					this.addFaceOpen();
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
		}
		
	})
});
