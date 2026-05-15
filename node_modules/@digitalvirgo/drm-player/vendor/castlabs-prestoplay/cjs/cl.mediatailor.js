(function(){var g={}; var _ = _ || {}
var f=function(window){var DS=function(){this.g=new _.L("clpp.mediatailor.MediaTailorPlugin")},ES=function(a,b,c){var d,e,f,g,h;return _.I(function(l){if(1==l.a)return _.x(l,fetch(b,{method:_.rb,body:JSON.stringify(c.sessionConfig)}),2);if(3!=l.a)return d=l.f,_.x(l,d.json(),3);e=l.f;f=e.manifestUrl;g=e.trackingUrl;h={xj:_.An(f,b),Zp:g?_.An(g,b):null};a.g.info("Media Tailor session initialized.\n  - manifest URI: "+h.xj);return l["return"](h)})},FS=function(){};_.w(DS,_.Zv);
DS.prototype.onContentWillLoad=function(a,b){var c=this,d,e,f;return _.I(function(g){if(1==g.a){d=a.getConfiguration().mediatailor;if(!d.enabled)return g["return"]();c.g.info("MediaTailor plugin is enabled");_.F(g,2);return _.x(g,ES(c,b.url,d),4)}if(2!=g.a)return e=g.f,a.trigger(new _.Q("mt-session-started")),b.url=e.xj,_.G(g,0);f=_.H(g);c.g.error("Failed to start session",f);throw new _.O(_.P,9,7003,"Media Tailor session failed to initialize.");})};DS.prototype.id=function(){return"mediatailor"};
FS.prototype.create=function(){return new DS};_.bp(new FS);};
if(typeof(module)!="undefined"&&module.exports){var x=require("./cl.core.js");_ = x._;(f.call(g,this));module.exports=g;}
else if (typeof(define)!="undefined"&&define.amd) {define(["./cl.core"], function(c){_=c._;(f.call(g,this));return g;});}
else{_=this.clpp._;(f.call(g,this));}
})();