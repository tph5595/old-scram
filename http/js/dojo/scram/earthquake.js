define(["dojo/_base/lang", "dojo/fx", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojox/socket", "dojo/Evented", 
"dojo/dom-class", "dojo/text!scram/templates/earthquake.html"], 
function(lang, fx, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Socket, Evented, domClass, template) {
	return Declare("scram.earthquake", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for earthquakes
		///
		socket : null,
		templateString : template,
		//earthquakeClass : null,
		//_setEarthquakeClassAttr : {node : "earthquakeDAP", type : "class"},
		
		constructor: function(args){
			this.socket = args.socket;
			this.socket.on("message",lang.hitch(this,this.onMsg));
		},
		onMsg: function(event){
			var obj = JSON.parse(event.data);
			this.earthquake = obj['quake'];
			//console.log(this.earthquake,obj);
			switch (this.earthquake){
				case true:
					this.emit("quake", {})
					//this.startQuake();
					break;
					/*
				case false:
					this.emit("prequake", {})
					//this.noQuake();
					break;*/
			}
		},
		postCreate : function() {

			this.inherited(arguments);
		},
		/*
		startQuake : function(){
			domClass.remove(this.earthquakeDAP);
			domClass.add(this.earthquakeDAP, 'quake' + ' z3');
			this.earthquakeLeft = fx.slideTo({
				node : this.earthquakeDAP,
				duration: 50,
				top : 8,
				left : 300
			});
			this.earthquakeRight = fx.slideTo({
				node : this.earthquakeDAP,
				duration: 50,
				top : 8,
				left : 500
			});
			this.earthquakeCenter = fx.slideTo({
				node : this.earthquakeDAP,
				duration: 50,
				top : 8,
				left : 400
			});
			this.chain = fx.chain([this.earthquakeLeft, this.earthquakeRight,this.earthquakeLeft, this.earthquakeRight,
									this.earthquakeLeft, this.earthquakeRight,this.earthquakeLeft, this.earthquakeRight,
									this.earthquakeLeft, this.earthquakeRight,this.earthquakeLeft, this.earthquakeRight,
									this.earthquakeLeft, this.earthquakeRight,this.earthquakeLeft, this.earthquakeRight,
									this.earthquakeLeft, this.earthquakeRight,this.earthquakeLeft, this.earthquakeCenter]);
			this.chain.play();
		},
		
		noQuake : function(){
			domClass.remove(this.earthquakeDAP);
			domClass.add(this.earthquakeDAP, 'prequake' + ' z3');
		}
		*/
	});
});
