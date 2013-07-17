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
		tankLevel : null,
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
			this.rcsTimeSlice = true;
			this.afsTimeSlice = 0;
			this.csTimeSlice = true;
			this.poll = args.poll;
			this.tankLevel = args.tankLevel;
			this.rcsWaterClass = args.rcsWaterClass;
			this.afsWaterClass = args.afsWaterClass;
			this.csWaterClass = args.csWaterClass;
			this.hpiWaterClass = args.hpiWaterClass;
			this.auxWaterClass = args.auxWaterClass;			
			this.poll.on("message",lang.hitch(this,this.pollMsg));
		},
		postCreate : function() {
			this.inherited(arguments);
			//this.rcsWaterMove();
			//this.afsWaterMove();
			//this.csWaterMove();
			//this.hpiWaterMove();
			//this.auxWaterMove();
		},
		rcsWaterMove1 : function() {
			this.rcsWater1 = fx.slideTo({
				node: this.rcsDAP,
				top: -675,
				left: 178,
				duration: 50
			});
			this.rcsWater2 = fx.slideTo({
				node: this.rcsDAP,
				top: -675,
				left: 426,
				duration: 250
			});
			this.rcsWater3 = fx.slideTo({
				node: this.rcsDAP,
				top: -426,
				left: 426,
				duration: 225
			});
			this.rcsWater4 = fx.slideTo({
				node: this.rcsDAP,
				top: -426,
				left: 439,
				duration: 125
			});
			this.rcsWater5 = fx.slideTo({
				node: this.rcsDAP,
				top: -675,
				left: 439,
				duration: 225
			});
			this.rcsWater6 = fx.slideTo({
				node: this.rcsDAP,
				top: -675,
				left: 426,
				duration: 125
			});
			this.chain = fx.chain([this.rcsWater1,this.rcsWater2,this.rcsWater3,this.rcsWater4,this.rcsWater5,this.rcsWater6]);
			this.chain.play();
		},
		rcsWaterMove2 : function() {
			this.rcsWater6 = fx.slideTo({
				node: this.rcsDAP,
				top: -426,
				left: 426,
				duration: 200
			});
			this.rcsWater7 = fx.slideTo({
				node: this.rcsDAP,
				top: -426,
				left: 346,
				duration: 200
			});
			this.rcsWater8 = fx.slideTo({
				node: this.rcsDAP,
				top: -464,
				left: 290,
				duration: 200
			});
			this.rcsWater9 = fx.slideTo({
				node: this.rcsDAP,
				top: -464,
				left: 178,
				duration: 200
			});
			this.rcsWater10 = fx.slideTo({
				node: this.rcsDAP,
				top: -675,
				left: 178,
				duration: 200
			});
			this.rcsWater11 = fx.slideTo({
				node: this.rcsDAP,
				top: -675,
				left: 178,
				duration: 200
			});
			this.chain = fx.chain([this.rcsWater6,this.rcsWater7,this.rcsWater8,this.rcsWater9,this.rcsWater10,this.rcsWater11]);
			this.chain.play();
		},
		afsWaterMove1 : function(){
			//afs
			this.afsWater1 = fx.slideTo({
				node: this.afsDAP,
				top: -432,
				left: 605,
				duration: 200
			});
			this.afsWater2 = fx.slideTo({
				node: this.afsDAP,
				top: -432,
				left: 469,
				duration: 200
			});
			this.afsWater3 = fx.slideTo({
				node: this.afsDAP,
				top: -679,
				left: 469,
				duration: 200
			});
			this.afsWater4 = fx.slideTo({
				node: this.afsDAP,
				top: -679,
				left: 458,
				duration: 200
			});
			this.afsWater5 = fx.slideTo({
				node: this.afsDAP,
				top: -432,
				left: 458,
				duration: 200
			});
			this.afschain1 = fx.chain([this.afsWater1,this.afsWater2,this.afsWater3,this.afsWater4,this.afsWater5]);
			this.afschain1.play();
		},
		afsWaterMove2 : function(){
			this.afsWater6 = fx.slideTo({
				node: this.afsDAP,
				top: -432,
				left: 469,
				duration: 200
			});
			this.afsWater7 = fx.slideTo({
				node: this.afsDAP,
				top: -679,
				left: 469,
				duration: 200
			});
			this.afsWater8 = fx.slideTo({
				node: this.afsDAP,
				top: -679,
				left: 469,
				duration: 200
			});
			this.afsWater9 = fx.slideTo({
				node: this.afsDAP,
				top: -679,
				left: 657,
				duration: 200
			});
			this.afsWater10 = fx.slideTo({
				node: this.afsDAP,
				top: -510,
				left: 657,
				duration: 200
			});
			this.afschain2 = fx.chain([this.afsWater6, this.afsWater7, this.afsWater8, this.afsWater9, this.afsWater10]);
			this.afschain2.play();
		},
		afsWaterMove3 : function(){
			this.afsWater11 = fx.slideTo({
				node: this.afsDAP,
				top: -510,
				left: 645,
				duration: 200
			});
			this.afsWater12 = fx.slideTo({
				node: this.afsDAP,
				top: -554,
				left: 645,
				duration: 200
			});
			this.afsWater13 = fx.slideTo({
				node: this.afsDAP,
				top: -554,
				left: 657,
				duration: 200
			});
			this.afsWater14 = fx.slideTo({
				node: this.afsDAP,
				top: -430,
				left: 657,
				duration: 200
			});
			this.afsWater15 = fx.slideTo({
				node: this.afsDAP,
				top: -432,
				left: 605,
				duration: 200
			});
			this.afschain3 = fx.chain([this.afsWater11,this.afsWater12,this.afsWater13,this.afsWater14,this.afsWater15]);
			this.afschain3.play();
		},
		csWaterMove1 : function() {
			//cs
			this.csWater1 = fx.slideTo({
				node: this.csDAP,
				top: -560,
				left: 688,
				duration: 200
			});
			this.csWater2 = fx.slideTo({
				node: this.csDAP,
				top: -560,
				left: 676,
				duration: 200
			});
			this.csWater3 = fx.slideTo({
				node: this.csDAP,
				top: -515,
				left: 676,
				duration: 200
			});
			this.csWater4 = fx.slideTo({
				node: this.csDAP,
				top: -515,
				left: 688,
				duration: 200
			});
			this.csWater5 = fx.slideTo({
				node: this.csDAP,
				top: -560,
				left: 688,
				duration: 200
			});
			this.cschain1 = fx.chain([this.csWater1,this.csWater2,this.csWater3,this.csWater4,this.csWater5]);
			this.cschain1.play();
		},
		csWaterMove2 : function() {
			this.csWater6 = fx.slideTo({
				node: this.csDAP,
				top: -560,
				left: 875,
				duration: 250
			});
			this.csWater7 = fx.slideTo({
				node: this.csDAP,
				top: -436,
				left: 875,
				duration: 225
			});
			this.csWater8 = fx.slideTo({
				node: this.csDAP,
				top: -436,
				left: 668,
				duration: 225
			});
			this.csWater9 = fx.slideTo({
				node: this.csDAP,
				top: -476,
				left: 688,
				duration: 200
			});
			this.cschain2 = fx.chain([this.csWater6,this.csWater7,this.csWater8,this.csWater9]);
			this.cschain2.play();
		},
		hpiWaterMove : function() {	
			//hpi
			this.hpiWater1 = fx.slideTo({
				node: this.hpiDAP,
				top: -344,
				left: 265,
				duration: 200
			});
			this.hpiWater2 = fx.slideTo({
				node: this.hpiDAP,
				top: -384,
				left: 213,
				duration: 200
			});
			this.hpiWater3 = fx.slideTo({
				node: this.hpiDAP,
				top: -484,
				left: 213,
				duration: 200
			});
			this.hpiWater4 = fx.slideTo({
				node: this.hpiDAP,
				left: 314,
				top: -344,
				duration: 200
			});
			fx.chain([this.hpiWater1,this.hpiWater2,this.hpiWater3,this.hpiWater4]).play();
		},
		auxWaterMove : function() {
			//aux
			this.auxWater1 = fx.slideTo({
				node: this.auxDAP,
				left: 501,
				top: -340,
				duration: 200
			});
			this.auxWater2 = fx.slideTo({
				node: this.auxDAP,
				left: 501,
				top: -442,
				duration: 200
			});
			this.auxWater3 = fx.slideTo({
				node: this.auxDAP,
				left: 650,
				top: -400,
				duration: 200
				
			});
			this.auxWater4 = fx.slideTo({
				node: this.auxDAP,
				left: 700,
				top: -340,
				duration: 200
				
			});
			fx.chain([this.auxWater1,this.auxWater2,this.auxWater3, this.auxWater4]).play();
		},
		
		pollMsg:function(event){
			var obj = JSON.parse(event.data);
			this.auxTankLevel = obj['afswater'];
			this.hpiTankLevel = obj['hpiwater'];
			//rcs
			this.rcsPumpState = obj['rcs'];
			this.rcsTimeSlice = !this.rcsTimeSlice;
			this.csTimeSlice = !this.csTimeSlice;
			switch (this.afsTimeSlice){
				case 0:
					this.afsTimeSlice = 1;
					break;
				case 1:
					this.afsTimeSlice = 2;
					break;
				case 2:
					this.afsTimeSlice = 0;
					break;
			}
			console.log(this.rcsTimeSlice);
			if (this.rcsPumpStateTemp != 0 && this.rcsTimeSlice == true){
				this.rcsWaterMove1();
			}
			else if (this.rcsPumpStateTemp != 0 && this.rcsTimeSlice == false){
				this.rcsWaterMove2();
			}
			//afs
			this.afsPumpState = obj['feedwater'];
			if (this.afsPumpState != 0 && this.afsTimeSlice == 0){
				this.afsWaterMove1();
			}
			else if (this.afsPumpState != 0 && this.afsTimeSlice == 1){
				this.afsWaterMove2();
			}
			else if (this.afsPumpState != 0 && this.afsTimeSlice == 2){
				this.afsWaterMove3();
			}
			//cs
			this.csPumpState = obj['cs'];
			if (this.csPumpState != 0 && this.csTimeSlice == true){
				this.csWaterMove1();
			}
			else if (this.csPumpState != 0 && this.csTimeSlice == false){
				this.csWaterMove2();
			}
			//aux
			this.auxPumpState = obj['auxTank'];
			this.auxValveState = obj['afsvalve'];//yes this says afs. Naming confusion made earlier
			if (this.auxPumpState != 0 && this.auxValveState == true  && this.auxTankLevel != 0){
				this.auxWaterMove();
			}
			//hpi
			this.hpiPumpState = obj['hpiTank'];
			this.hpiValveState = obj['hpivalve'];
			if (this.hpiPumpState != 0 && this.hpiValveState == true  && this.hpiTankLevel != 0){
				this.hpiWaterMove();
			}
			
		}
		
	});
});
