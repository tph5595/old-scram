define(["dojo/_base/lang", "dojo/_base/declare", "dojo/dom-class", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained", "dijit/_TemplatedMixin", "dojo/Evented", "dojo/fx/Toggler", 
"dojo/fx", "dojo/on", "dojo/text!scram/templates/tweet.html"], 
function(lang, Declare, domClass, _WidgetBase, _Container, _Contained, _TemplatedMixin, Evented, Toggler, coreFx, on, template) {
	return Declare("scram.tweet", [_WidgetBase, _Container, _Contained, _TemplatedMixin, Evented], {

		///
		/// This is the class for the splash page
		///
		templateString : template,
		args : null, //property bag,
		'class' : 'twitterfeed',
		poll: null,

		constructor : function(args) {
			this.poll = args.socket;
			this.poll.on('message', lang.hitch(this, this.windowMove));
			this.args = args;
		},
		buildRendering : function() {
			this.inherited(arguments);
		},
		postCreate : function() {! function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
				if (!d.getElementById(id)) {
					js = d.createElement(s);
					js.id = id;
					js.src = p + "://platform.twitter.com/widgets.js";
					fjs.parentNode.insertBefore(js, fjs);
				}
			}(document, "script", "twitter-wjs");

			this.inherited(arguments);
		},
		startup : function() {
			this.inherited(arguments);
		},
		windowMove : function(){
			this.windowWidth = window.innerWidth;
			this.widthCheck = 1800
			if (this.windowWidth < this.widthCheck){
				domClass.remove(this.tweetDAP);
				domClass.add(this.tweetDAP, 'modifiedtwitterfeed');
			}
			else{
				domClass.remove(this.tweetDAP);
				domClass.add(this.tweetDAP, 'twitterfeed');
			}
		}
	});

});
