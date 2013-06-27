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
		waterClass : null,
		_setWaterClassAttr: {node: 'rcsDAP', type:"class"},
		
		constructor : function(args) {
			this.poll = args.poll;
			this.waterClass = args.waterClass;
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
			this.waterMove();
		},
		waterMove : function() {
			//rcs
			
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
				left: 188
			});
			fx.chain([this.rcsWater1,this.rcsWater2,this.rcsWater3,this.rcsWater4,this.rcsWater5,this.rcsWater6,this.rcsWater7,this.rcsWater8,this.rcsWater9]).play();
			/*
			//afs
			this.afsWater1 = dojo.fx.slideTo({
				
			});
			this.afsWater2 = dojo.fx.slideTo({
				
			});
			this.afsWater3 = dojo.fx.slideTo({
				
			});
			this.afsWater4 = dojo.fx.slideTo({
				
			});
			dojo.fx.chain([afsWater1,afsWater2,afsWater3,afsWater4]).play();
			
			//cs
			this.csWater1 = dojo.fx.slideTo({
				
			});
			this.csWater2 = dojo.fx.slideTo({
				
			});
			this.csWater3 = dojo.fx.slideTo({
				
			});
			this.csWater4 = dojo.fx.slideTo({
				
			});
			dojo.fx.chain([csWater1,csWater2,csWater3,csWater4]).play();
			
			//hpi
			this.hpiWater1 = dojo.fx.slideTo({
				
			});
			this.hpiWater2 = dojo.fx.slideTo({
				
			});
			dojo.fx.chain([hpiWater1,hpiWater2]).play();
			
			//aux
			this.auxWater1 = dojo.fx.slideTo({
				
			});
			this.auxWater2 = dojo.fx.slideTo({
				
			});
			dojo.fx.chain([auxWater1,auxWater2]).play();
			*/
		},
		/*
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.waterState = obj.simtime;
			this.waterMove();
		}
		*/
	});
});
