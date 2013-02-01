/*
	jQuery Zoom v1.7.0 - 2013-01-31
	(c) 2013 Jack Moore - jacklmoore.com/zoom
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(d,a){var e={on:"mouseover",url:false,callback:false,target:false,duration:120,zoomImgProps:{position:"absolute",top:0,left:0,opacity:0,border:"none",maxWidth:"none"}},c="zoom";d[c]=function(f,l,i){var m,k,g,j,h,n;f.css({position:/(absolute|fixed)/.test()?f.css("position"):"relative",overflow:"hidden"});n=d.extend({},e.zoomImgProps,{width:i.width,height:i.height});d(i).addClass("zoomImg").css(n).appendTo(f);return{init:function(){m=f.outerWidth();k=f.outerHeight();g=(i.width-m)/l.outerWidth();j=(i.height-k)/l.outerHeight();h=l.offset()},move:function(q){var p=q.pageX-h.left,o=q.pageY-h.top;o=Math.max(Math.min(o,k),0);p=Math.max(Math.min(p,m),0);i.style.left=(p*-g)+"px";i.style.top=(o*-j)+"px"}}};function b(v){var p=false,m=new Image(),t=d(document),k=d.extend({},e,v||{}),j=d(k.target||this),n=d(this),f=d(m),u;if(i()){m.onload=l;m.src=k.url}function i(){if(!k.url){k.url=n.find("img").attr("src");if(!k.url){return false}}return true}function h(w){u.init();u.move(w);f.stop().fadeTo(d.support.opacity?k.duration:0,1)}function q(){f.stop().fadeTo(k.duration,0)}function s(w){t.one("mouseup",function(){q();t.off("mousemove")});h(w);t.mousemove(u.move);w.preventDefault()}function o(w){if(p){return}else{p=true;h(w);t.mousemove(u.move);t.one("click",function(){q();p=false;t.off("mousemove")});return false}}function g(w){if(p){q()}else{h(w)}p=!p}function l(){u=d[c](j,n,m);switch(k.on){case"grab":n.mousedown(s);break;case"click":n.click(o);break;case"toggle":n.click(g);break;default:u.init();n.hover(h,q).mousemove(u.move)}if(d.isFunction(k.callback)){k.callback.call(m)}}function r(){f.remove();n.off("hover click mousedown").data("zoom",null)}return{destroy:r}}d.fn[c]=function(f){var g;return this.each(function(){g=d(this);if(g.data(c)){console.log(c+" already init",this)}else{g.data(c,b.call(this,f))}})};d.fn[c].defaults=e})(jQuery,window);