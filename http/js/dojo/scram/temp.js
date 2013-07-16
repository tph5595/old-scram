define(["dojo/_base/lang","dojo/_base/declare", "dojo/dom-class", "dijit/_WidgetBase","dijit/_Container", 
"dijit/_Contained","dijit/_TemplatedMixin","dojo/text!scram/templates/temp.html"], 
function(lang,Declare, domClass, _WidgetBase, _Container,_Contained,_TemplatedMixin, template) {
	return Declare("scram.temp", [_WidgetBase, _Container,_Contained,_TemplatedMixin], {
		///
		/// This is the class for the poll data
		///
		_socket : null,
		templateString:template,
		critflag : null,
		reactorFlag : null,
		constructor : function(args) {
			this._socket = args.socket;
			this._socket.on("message", lang.hitch(this, this.pollMsg));
		},
		postCreate : function() {
			this.reactorFlag = 1;
			this.inherited(arguments);
			
		},
		
		pollMsg : function(event) {
			var obj = JSON.parse(event.data);
			this.critflag = obj['critflag'];
			if ((this.critflag & this.reactorFlag) == this.reactorFlag){
				domClass.remove(this.reactorTemp);
				domClass.add(this.reactorTemp, 'reactortemp criticaltemperatureelements');
			}
			else {
				domClass.remove(this.reactorTemp);
				domClass.add(this.reactorTemp, 'reactortemp temperatureelements');
			}
			try {
				var obj = JSON.parse(event.data);
				this.reactorTemp.innerHTML = Math.round(obj.reactortemp);
				this.rcsColdLegTemp.innerHTML = Math.round(obj.rcscoldlegtemp);
				this.rcsHotLegTemp.innerHTML = Math.round(obj.rcshotlegtemp);
				this.generalPowerOutput.innerHTML = Math.round(obj.genmw);
				this.csColdLegTemp.innerHTML = Math.round(obj.cscoldlegtemp);
				this.csHotLegTemp.innerHTML = Math.round(obj.cshotlegtemp);
				this.feedwaterColdLegTemp.innerHTML = Math.round(obj.afscoldlegtemp);
				this.feedwaterHotLegTemp.innerHTML = Math.round(obj.afshotlegtemp);;
			} catch(err) {
				console.log("Error in socket:", err);
			}
		}
	});
});
