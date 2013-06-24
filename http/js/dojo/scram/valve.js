/**
 * @author DThomas
 */
define(["dojo/_base/lang", "dojo/_base/declare", "dojox/socket", "dojo/dom-construct", "dojo/on"], function(lang, Declare, Socket, domConstruct, on) {
	return Declare("scram.socket", null, {
		///
		///Valve class
		///
		
		valve: null,
		//current state of valve (open, closed)
		valveState: null,
		_socket: null,
		tip: null,
		valveId: null,
		valveClass: null,
		
		//constructor takes in args
		constructor : function(args) {
			this._socket = args.socket;
			this.parent = args.parent;
			this.valveState = 'closed';
			this.tip = args.tip;
			this.valveClass = args.valveClass;
		},
		
		postCreate : function() {
			this.valve = new domConstruct.create('div', {
				'class' : this.valveClass,
				'title' : this.tip
			}, this.parent);
			
			this.handleValve = on(this.valve, "click", lang.hitch(this, this.valveSwitch, this.valveState));
		},
		
		_socketMessage: function(event){
			//Listenurr
			this.valveState = msg;
		},
		
		valveMsg: function(event){
			var obj = JSON.parse(event.data);
			this.valveState = obj[this.valveId]; 
			this.valveSwitch(this.valveState);
		},
		valveSwitch: function(state){
			domClass.remove(this.valve);
			switch (state){
				case 'closed':
					console.log('valve closed: switched to open')
					//this.valve.send('open');
					domClass.add(this.valve, 'valveopen ' + this.valveClass)
					break;
				case 'open':
					console.log('valve open: switched to closed')
					//this.valve.send('closed');
					domClass.add(this.valve, 'valveclosed ' + this.valveClass)
					break;
			}
		},
		
	});
});
