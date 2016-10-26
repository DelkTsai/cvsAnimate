;
//create by 栾树崇
//
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
var cvsAnimate = {};
cvsAnimate.tools = {};
cvsAnimate.tools.extend = function(target, options) {
    for (name in options) {
        copy = options[name];
        if (copy instanceof Array) {
            target[name] = arguments.callee([], copy);
        } else if (copy instanceof Object) {
            target[name] = arguments.callee({}, copy);
        } else {
            target[name] = options[name];
        }
    }
    return target;
}
cvsAnimate.scatterIn = function(elem, imgurl, options) {
    var self=this;
    var defaults = { 
        width: elem.clientWidth,
        height: elem.clientHeight,
        duration: 1000,
        animationInterval: 40,
        cols: elem.clientWidth/4,
        rows: elem.clientHeight/4,
    }
    cvsAnimate.tools.extend(defaults, options);
    var c = document.createElement('canvas');
    c.width = defaults.width;
    c.height = defaults.height;
    var ctx = c.getContext("2d");
    var img = new Image();
    this.particles = [];
    var pos = 0;
    var cw = Math.ceil(c.width / defaults.cols) || 1;
    var rh = Math.ceil(c.height / defaults.rows) || 1;
    img.onload = function() {
        ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, c.width, c.height);
        var imageData = ctx.getImageData(0, 0, c.width, c.height);
        ctx.clearRect(0, 0, c.width, c.height);
        elem.appendChild(c);
        var data = imageData.data;
        for (var i = 0; i < defaults.cols; i++)
            for (var j = 0; j < defaults.rows; j++) {
                pos = (j * rh * c.width + i * cw) * 4;
                var particle = {
                    x: i * cw,
                    y: j * rh,
                    fillStyle: 'rgba('+data[pos++]+', '+data[pos++]+', '+data[pos++]+','+data[pos++]/255+')'
                };
                self.particles.push(particle);
        }
        draw(self.particles)
    }
    //img.crossOrigin = "anonymous";
    img.src = imgurl;

    function draw(p) {
        var t1=new Date();
        ctx.clearRect(0, 0, c.width, c.height);
        for (var i in p) {
            ctx.fillStyle=p[i].fillStyle;
            ctx.fillRect(p[i].x,p[i].y,cw,rh);
        }
        var t2=new Date();
        console.log('画一次用的时间:'+(t2-t1)+'ms');
    }
}
// "use strict";
// var canvas = {},
// image = {},
// requestId = 0,
// startTime = 0;

// function Particles(c) {
//     var a = this;
//     var b = c.ease || "easeInOutExpo";
//     if (typeof window[b] !== "function") {
//         console.log("the function is not existed, it will use easeInOutExpo instead");
//         b = "easeInOutExpo"
//     }
//     this.init = (function() {
//         if (!c.canvasId || !document.getElementById(c.canvasId)) {
//             console.log("pls use the correct canvas id");
//             return
//         }
//         if (!c.imgUrl) {
//             console.log("pls use the correct img url");
//             return
//         }
//         canvas.self = document.getElementById(c.canvasId);
//         if (canvas.self.getContext) {
//             canvas.w = canvas.self.width;
//             canvas.h = canvas.self.height;
//             canvas.ctx = canvas.self.getContext("2d");
//             var d = new Image();
//             image.isLoaded = false;
//             d.onload = function() {
//                 image.self = d;
//                 image.w = d.width;
//                 image.h = d.height;
//                 image.x = c.imgX || parseInt(canvas.w / 2 - image.w / 2);
//                 image.y = c.imgY || 0;
//                 canvas.ctx.drawImage(image.self, image.x, image.y, image.w, image.h);
//                 image.imgData = canvas.ctx.getImageData(image.x, image.y, image.w, image.h);
//                 canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
//                 Particles.prototype._calculate({
//                     color: c.fillStyle || "rgba(26,145,211,1)",
//                     pOffset: c.particleOffset || 2,
//                     startX: c.startX || (image.x + image.w / 2),
//                     startY: c.startY || 0,
//                     duration: c.duration || 3000,
//                     interval: c.interval || 3,
//                     ease: b,
//                     ratioX: c.ratioX || 1,
//                     ratioY: c.ratioY || 1,
//                     cols: c.cols || 100,
//                     rows: c.rows || 100
//                 });
//                 image.isLoaded = true;
//                 startTime = new Date().getTime()
//             };
//             d.crossOrigin = "anonymous";
//             d.src = c.imgUrl
//         }
//     })();
//     this.draw = function() {
//         if (image.isLoaded) {
//             Particles.prototype._draw()
//         } else {
//             setTimeout(a.draw)
//         }
//     };
//     this.animate = function() {
//         if (image.isLoaded) {
//             Particles.prototype._animate(c.delay)
//         } else {
//             setTimeout(a.animate)
//         }
//     }
// }
// Particles.prototype = {
//     array: [],
//     _calculate: function(a) {
//         var k = image.imgData.length;
//         var f = image.imgData.data;
//         var m = a.cols,
//         o = a.rows;
//         var n = parseInt(image.w / m),
//         c = parseInt(image.h / o);
//         var g, e;
//         var l = 0;
//         var h = {};
//         for (var d = 0; d < m; d++) {
//             for (var b = 0; b < o; b++) {
//                 l = (b * c * image.w + d * n) * 4;
//                 if (f[l + 3] > 100) {
//                     h = {
//                         x0: a.startX,
//                         y0: a.startY,
//                         x1: image.x + d * n + (Math.random() - 0.5) * 10 * a.pOffset,
//                         y1: image.y + b * c + (Math.random() - 0.5) * 10 * a.pOffset,
//                         fillStyle: a.color,
//                         delay: b / 20,
//                         currTime: 0,
//                         count: 0,
//                         duration: parseInt(a.duration / 16.66) + 1,
//                         interval: parseInt(Math.random() * 10 * a.interval),
//                         ease: a.ease,
//                         ratioX: a.ratioX,
//                         ratioY: a.ratioY
//                     };
//                     if (f[l + 1] < 175 && f[l + 2] < 10) {
//                         h.fillStyle = "#ffa900"
//                     } else {
//                         if (f[l + 1] < 75 && f[l + 1] > 50) {
//                             h.fillStyle = "#ff4085"
//                         } else {
//                             if (f[l + 1] < 220 && f[l + 1] > 190) {
//                                 h.fillStyle = "#00cfff"
//                             } else {
//                                 if (f[l + 1] < 195 && f[l + 1] > 175) {
//                                     h.fillStyle = "#9abc1c"
//                                 }
//                             }
//                         }
//                     }
//                     this.array.push(h)
//                 }
//             }
//         }
//     },
//     _draw: function() {
//         canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
//         var b = this.array.length;
//         var a = null;
//         for (var c = 0; c < b; c++) {
//             a = this.array[c];
//             canvas.ctx.fillStyle = a.fillStyle;
//             canvas.ctx.fillRect(a.x1, a.y1, 1, 1)
//         }
//     },
//     _render: function() {
//         canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
//         var l = Particles.prototype.array;
//         var f = l.length;
//         var h = null;
//         var d, a;
//         var k = 0,
//         b = 0,
//         c = 0,
//         j = 1,
//         g = 1;
//         for (var e = 0; e < f; e++) {
//             h = l[e];
//             if (h.count++ > h.delay) {
//                 canvas.ctx.fillStyle = h.fillStyle;
//                 k = h.currTime;
//                 b = h.duration;
//                 c = h.interval;
//                 h.ratioX !== 1 ? j = h.ratioX + Math.random() * 2 : 1;
//                 h.ratioY !== 1 ? g = h.ratioY + Math.random() * 2 : 1;
//                 if (l[f - 1].duration + l[f - 1].interval < l[f - 1].currTime / 2) {
//                     cancelAnimationFrame(requestId);
//                     Particles.prototype._draw();
//                     return
//                 } else {
//                     if (k < b + c) {
//                         if (k >= c) {
//                             d = window[h.ease]((k - c) * j, h.x0, (h.x1 - h.x0) * j, b);
//                             a = window[h.ease]((k - c) * g, h.y0, (h.y1 - h.y0) * g, b);
//                             canvas.ctx.fillRect(d, a, 1, 1)
//                         }
//                     } else {
//                         canvas.ctx.fillRect(h.x1, h.y1, 1, 1)
//                     }
//                 }
//                 h.currTime += Math.random() + 0.5
//             }
//         }
//         requestId = requestAnimationFrame(Particles.prototype._render)
//     },
//     _animate: function(a) {
//         if (startTime + a < new Date().getTime()) {
//             requestId = requestAnimationFrame(Particles.prototype._render)
//         } else {
//             setTimeout(function() {
//                 Particles.prototype._animate(a)
//             })
//         }
//     }
// };
//缓动函数
/*
 * Tween.js
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
*/
var Tween = {
    Linear: function(t, b, c, d) { return c*t/d + b; },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) {
                return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}
// cvsAnimate.skewIn = function(elem, imgurl, options) {
//         default = {
//             mode: 'lt2rb', //左上到右下，
//             width: elem.clientWidth,
//             height: elem.clientHeight,
//             duration: 1000,
//             animationInterval: 40
//         }
//         cvsAnimate.tools.extend(default, options);
//         var c = document.createElement('canvas');
//         c.width = default.width;
//         c.height = default.height;
//         var wb = Math.round(c.width / (default.duration / default.animationInterval)); //宽的步长
//         var hb = Math.round(c.height / (default.duration / default.animationInterval)); //宽的步长
//         var ctx = c.getContext("2d");
//         ctx.clearRect(0, 0, c.width, c.height);
//         var img = new Image();
//         img.onload = function() {
//             var ix = 0,
//                 iy = 0;
//             var IntervalOut = setInterval(function() {
//                 ctx.drawImage(img, ix, 0, buchang, ch, ix, 0, buchang, ch);
//                 if (ix >= cw) clearInterval(IntervalOut);
//                 else ix += buchang;
//                 if (ix > cw) ix = cw;
//             }, options.animationInterval);
//         }
//         img.src = imgurl;
//     }
// cvsAnimate.printIn = function(canvasid, imgsrc, duration) {
//     var c = document.getElementById(canvasid);
//     var cw = c.width;
//     var ch = c.height;
//     var buchang = Math.round(cw / (duration / 50));
//     var ctx = c.getContext("2d");
//     ctx.clearRect(0, 0, cw, ch);
//     var img = new Image();
//     img.onload = function() {
//         var ix = 0,
//             iy = 0;
//         var IntervalOut = setInterval(function() {
//             ctx.drawImage(img, ix, 0, buchang, ch, ix, 0, buchang, ch);
//             if (ix >= cw) clearInterval(IntervalOut);
//             else ix += buchang;
//             if (ix > cw) ix = cw;
//         }, 50);
//     }
//     img.src = imgsrc;
// }
// function DownCaRu(canvasid, imgsrc, duration) {
//     var c = document.getElementById(canvasid);
//     var cw = c.width;
//     var ch = c.height;
//     var buchang = Math.round(ch / (duration / 50));
//     var ctx = c.getContext("2d");
//     ctx.clearRect(0, 0, cw, ch);
//     var img = new Image();
//     img.onload = function() {
//         var ix = 0,
//             iy = ch;
//         var IntervalOut = setInterval(function() {
//             ctx.drawImage(img, ix, iy, cw, buchang, ix, iy, cw, buchang);
//             if (iy == 0) clearInterval(IntervalOut);
//             else iy -= buchang;
//             if (iy < 0) iy = 0;
//         }, 50);
//     }
//     img.src = imgsrc;
// }