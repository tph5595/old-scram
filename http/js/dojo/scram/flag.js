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
		
		constructor : function(args) {
			this.simtime = 0;
			this.socket = new Socket("ws://192.168.15.5:50506");
			this.poll = args.poll;
			this.socket.on('message', lang.hitch(this, this.socketMsg));
			this.poll.on('message', lang.hitch(this, this.pollMsg));
			this.poll.on('message', lang.hitch(this, this.windowMove));
			//this.socket.on('message', lang.hitch(this, this. socketMsg));
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
			//FIXME: Need the response that is coming down
			//this.response = obj['FILL THIS IN''];
			
			this.response = obj['result'];
			if (this.response == 'Flag Accepted'){
				this.submissionResponseDAP.innerHTML='Flag Accepted';
				var tempSimtime = this.simtime;
			}
			else if (this.response == 'Invalid Flag!'){
				this.submissionResponseDAP.innerHTML='Invalid Flag!';
				var tempSimtime = this.simtime;
			}
			if (Math.abs(tempSimtime - this.simtime) >= 10){
				this.submissionResponseDAP.innerHTML='Submit More Flags';
			}
		},
		pollMsg : function(event){
			var obj = JSON.parse(event.data);
			this.simtime = obj['simtime'];
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
