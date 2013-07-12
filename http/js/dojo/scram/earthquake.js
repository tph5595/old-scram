define(["dojo/on","dojo/_base/lang", "dojo/fx", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", 
"dojo/dom-class", "dojo/text!scram/templates/earthquake.html"], 
function(on, lang, fx, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domClass, template) {
	return Declare("scram.earthquake", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {
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
			if (this.earthquake == true){
				this.emit("quake", {});
			}
			else if (this.earthquake == false){
				this.emit('noquake', {});
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
