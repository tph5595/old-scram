define(["dojo/_base/lang", "dijit/focus", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom",
"dojo/dom-construct", "dojo/dom-class", "dijit/form/TextBox", "dojox/socket", "dojo/text!scram/templates/flag.html"], 
function(lang, focusUtil, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, dom, domConstruct, domClass, TextBox, Socket, template) {
	return Declare("scram.flag", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the flag
		///
		templateString : template,
		socket : null,
		poll : null,
		simtime: null,
		tempSimtime: null,
		
		constructor : function(args) {
			this.flagTextBox = document.getElementById("flagTextBox");
			this.simtime = 0;
			this.tempSimtime = 0;
			this.socket = new Socket("ws://192.168.15.5:50506");
			this.poll = args.poll;
			this.socket.on('message', lang.hitch(this, this.socketMsg));
			this.poll.on('message', lang.hitch(this, this.pollMsg));
			this.poll.on('message', lang.hitch(this, this.windowMove));
			this.socket.on("error", lang.hitch(this, function(e) {
				console.log("Flag Socket Error", e);
			}));
		},
		postCreate : function() {
			this.inherited(arguments);
		},
		onFlagSubmission : function() {
			var submitFlag = {
				'flag' : this.flagDAP.value
			};
			console.log("Flag Post Data", JSON.stringify(submitFlag));
			this.socket.send(JSON.stringify(submitFlag));
		},
		socketMsg : function(event){
			var obj = JSON.parse(event.data);
			
			this.response = obj['result'];
			this.submissionResponseDAP.innerHTML=this.response;
			this.tempSimtime=this.simtime;
			this.flagTextBox.set("value", "");
			/*
			if (this.response == 'Flag Accepted'){
				this.submissionResponseDAP.innerHTML='Flag Accepted';
				this.tempSimtime = this.simtime;
			}
			else if (this.response == 'Invalid Flag!'){
				this.submissionResponseDAP.innerHTML='Invalid Flag!';
				this.tempSimtime = this.simtime;
			}*/
			
		},
		pollMsg : function(event){
			var obj = JSON.parse(event.data);
			this.simtime = obj['simtime'];
			if (Math.abs(this.tempSimtime - this.simtime) >= 10){
				this.submissionResponseDAP.innerHTML='Submit More Flags';
			}
		},
		windowMove : function(){
			this.windowWidth = window.innerWidth;
			this.widthCheck = 1920
			if (this.windowWidth < this.widthCheck){
				domClass.remove(this.flagdiv);
				domClass.add(this.flagdiv, 'modifiedflagdiv');
			}
			else{
				domClass.remove(this.flagdiv);
				domClass.add(this.flagdiv, 'flagdiv');
			}
		}
	});
});
