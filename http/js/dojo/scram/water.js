define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container","dijit/_Contained", "dijit/_TemplatedMixin",
"dojo/dom-construct", "dojo/dom-class","dojo/fx", "dojo/text!scram/templates/water.html"], 
function(lang, on, Declare, _WidgetBase,_Container, _Contained, _TemplatedMixin, domConstruct, domClass,fx,template) {
	return Declare("scram.water", [_WidgetBase, _TemplatedMixin, _Contained, _Container], {
		///
		/// This is the class for the water
		///
		templateString:template,
		socket : null,
		poll:null,
		waterState : null,
		rcsWaterClass : null,
		_setRcsWaterClassAttr: {node: 'rcsDAP', type:"class"},
		afsWaterClass : null,
		_setAfsWaterClassAttr: {node: 'afsDAP', type:"class"},
		csWaterClass : null,
		_setCsWaterClassAttr: {node: 'csDAP', type:"class"},
		hpiWaterClass: null,
		_setHpiWaterClassAttr: {node: 'hpiDAP', type:"class"},
		auxWaterClass: null,
		_setAuxWaterClassAttr: {node: 'auxDAP', type:"class"},
		
		constructor : function(args) {
			this.poll = args.poll;
			this.rcsWaterClass = args.rcsWaterClass;
			this.afsWaterClass = args.afsWaterClass;
			this.csWaterClass = args.csWaterClass;
			this.hpiWaterClass = args.hpiWaterClass;
			this.auxWaterClass = args.auxWaterClass;			
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
			this.rcsWaterMove();
			this.afsWaterMove();
			this.csWaterMove();
			this.hpiWaterMove();
			this.auxWaterMove();
		},
		rcsWaterMove : function() {
			this.rcsWater1 = fx.slideTo({
				node: this.rcsDAP,
				top: -636,
				left: 426
			});
			this.rcsWater2 = fx.slideTo({
				node: this.rcsDAP,
				top: -387,
				left: 426
			});
			this.rcsWater3 = fx.slideTo({
				node: this.rcsDAP,
				top: -387,
				left: 439
			});
			this.rcsWater4 = fx.slideTo({
				node: this.rcsDAP,
				top: -636,
				left: 439
			});
			this.rcsWater5 = fx.slideTo({
				node: this.rcsDAP,
				top: -636,
				left: 426
			});
			this.rcsWater6 = fx.slideTo({
				node: this.rcsDAP,
				top: -387,
				left: 426
			});
			this.rcsWater7 = fx.slideTo({
				node: this.rcsDAP,
				top: -387,
				left: 346
			});
			this.rcsWater8 = fx.slideTo({
				node: this.rcsDAP,
				top: -425,
				left: 290
			});
			this.rcsWater9 = fx.slideTo({
				node: this.rcsDAP,
				top: -425,
				left: 178
			});
			this.rcsWater10 = fx.slideTo({
				node: this.rcsDAP,
				top: -636,
				left: 177
			});
			this.chain = fx.chain([this.rcsWater1,this.rcsWater2,this.rcsWater3,this.rcsWater4,this.rcsWater5,this.rcsWater6,this.rcsWater7,this.rcsWater8,this.rcsWater9,this.rcsWater10]);
			console.log(this.chain);
			this.chain.play();
		},
		afsWaterMove : function(){
			//afs
			this.afsWater1 = fx.slideTo({
				node: this.afsDAP,
				top: -393,
				left: 469
			});
			this.afsWater2 = fx.slideTo({
				node: this.afsDAP,
				top: -640,
				left: 469
			});
			this.afsWater3 = fx.slideTo({
				node: this.afsDAP,
				top: -640,
				left: 458
			});
			this.afsWater4 = fx.slideTo({
				node: this.afsDAP,
				top: -393,
				left: 458
			});
			this.afsWater5 = fx.slideTo({
				node: this.afsDAP,
				top: -393,
				left: 469
			});
			this.afsWater6 = fx.slideTo({
				node: this.afsDAP,
				top: -640,
				left: 469
			});
			this.afsWater7 = fx.slideTo({
				node: this.afsDAP,
				top: -640,
				left: 657
			});
			this.afsWater8 = fx.slideTo({
				node: this.afsDAP,
				top: -471,
				left: 657
			});
			this.afsWater9 = fx.slideTo({
				node: this.afsDAP,
				top: -471,
				left: 645
			});
			this.afsWater10 = fx.slideTo({
				node: this.afsDAP,
				top: -515,
				left: 645
			});
			this.afsWater11 = fx.slideTo({
				node: this.afsDAP,
				top: -515,
				left: 657
			});
			this.afsWater12 = fx.slideTo({
				node: this.afsDAP,
				top: -430,
				left: 657
			});
			this.afsWater13 = fx.slideTo({
				node: this.afsDAP,
				top: -393,
				left: 605
			});
			fx.chain([this.afsWater1,this.afsWater2,this.afsWater3,this.afsWater4,this.afsWater5,this.afsWater6,this.afsWater7,this.afsWater8,this.afsWater9,this.afsWater10,this.afsWater11,this.afsWater12,this.afsWater13]).play();
		},
		csWaterMove : function() {
			//cs
			this.csWater1 = fx.slideTo({
				node: this.csDAP,
				top: -521,
				left: 688
			});
			this.csWater2 = fx.slideTo({
				node: this.csDAP,
				top: -521,
				left: 676
			});
			this.csWater3 = fx.slideTo({
				node: this.csDAP,
				top: -476,
				left: 676
			});
			this.csWater4 = fx.slideTo({
				node: this.csDAP,
				top: -476,
				left: 688
			});
			this.csWater5 = fx.slideTo({
				node: this.csDAP,
				top: -521,
				left: 688
			});
			this.csWater6 = fx.slideTo({
				node: this.csDAP,
				top: -521,
				left: 875
			});
			this.csWater7 = fx.slideTo({
				node: this.csDAP,
				top: -397,
				left: 875
			});
			this.csWater8 = fx.slideTo({
				node: this.csDAP,
				top: -397,
				left: 668
			});
			this.csWater9 = fx.slideTo({
				node: this.csDAP,
				top: -440,
				left: 688
			});
			fx.chain([this.csWater1,this.csWater2,this.csWater3,this.csWater4,this.csWater5,this.csWater6,this.csWater7,this.csWater8,this.csWater9]).play();
		},
		hpiWaterMove : function() {	
			//hpi
			this.hpiWater1 = fx.slideTo({
				node: this.hpiDAP,
				top: -300,
				left: 265
			});
			this.hpiWater2 = fx.slideTo({
				node: this.hpiDAP,
				top: -345,
				left: 213
			});
			this.hpiWater3 = fx.slideTo({
				node: this.hpiDAP,
				top: -435,
				left: 213
			});
			this.hpiWater4 = fx.slideTo({
				node: this.hpiDAP,
				left: 314,
				top: -305
			});
			fx.chain([this.hpiWater1,this.hpiWater2,this.hpiWater3,this.hpiWater4]).play();
		},
		auxWaterMove : function() {
			//aux
			this.auxWater1 = fx.slideTo({
				node: this.auxDAP,
				left: 501,
				top: -300
			});
			this.auxWater2 = fx.slideTo({
				node: this.auxDAP,
				left: 501,
				top: -393
			});
			this.auxWater3 = fx.slideTo({
				node: this.auxDAP,
				left: 700,
				top: -300
			});
			fx.chain([this.auxWater1,this.auxWater2,this.auxWater3]).play();
		}
		/*
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.waterState = obj.simtime;
			this.waterMove();
		}
		*/
	});
});
