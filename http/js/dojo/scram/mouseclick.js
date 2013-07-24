define(["dojo/_base/lang", "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/dom-construct", "dojo/dom-class", 
"dojo/mouse", "dojo/dom", "dojo/text!scram/templates/mouseclick.html"], 
function(lang, on, Declare, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, domConstruct, domClass, mouse, dom, template) {
	return Declare("scram.mouseclick", [_WidgetBase, _TemplatedMixin, _Contained, _Container, Evented], {
		///
		/// This is the class for the flag
		///
		templateString : template,

		constructor : function(args) {
			this.min = 100;
			this.max = 1000;
			this.proxmin = 25;
			this.proxmax = 50;
			this.proximity = 30;
			this.xLocFlag = Math.round(Math.random() * (this.max - this.min) + this.min);
			this.yLocFlag = Math.round(Math.random() * (this.max - this.min) + this.min);
			this.flags = new Array(
				'flag1',
				'flag2',
				'flag3',
				'flag4',
				'flag5',
				'flag6',
				'flag7',
				'flag8',
				'flag9',
				'flag10'
			);
			this.flagcount = 0;
			this.flaglen = this.flags.length;
		},
		postCreate : function() {
			this.onMouseOver();
			this.inherited(arguments);
		},
		onMouseOver : function() {
			window.onmouseover = lang.hitch(this, function(e) {
				this.xLocUser = e.pageX;
				this.yLocUser = e.pageY;
				this.mouselocation = {
					x : e.pageX,
					y : e.pageY
				};
				this.flagLocation = {
					x : this.xLocFlag,
					y : this.yLocFlag
				};
				//console.log('Flag Location: ' + JSON.stringify(this.flagLocation), this.flagLocation);
				//console.log('Mouse Location: ' + JSON.stringify(this.mouselocation), this.mouselocation);
				
				
				if (Math.abs(this.xLocUser - this.xLocFlag) <= this.proximity && Math.abs(this.yLocUser - this.yLocFlag) <= this.proximity) {
					if (this.flagcount >= this.flaglen){
						console.log('No More ... or is there');
					}
					else{
						console.log(this.flags[this.flagcount]);
						this.xLocFlag = Math.round(Math.random() * (this.max - this.min) + this.min);
						this.yLocFlag = Math.round(Math.random() * (this.max - this.min) + this.min);
						this.proximity = Math.round(Math.random() * (this.proxmax - this.proxmin) + this.proxmin);
						this.flagcount += 1;
					}
				}
			})
		}
	});
});
