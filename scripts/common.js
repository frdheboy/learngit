/**
 * Created by XA-0301031A on 2014/7/18.
 */
$(document).ready(function () {
	//搜索框
	$(".header").load("header.html", function () {
		$(".header_input").click(function () {
			var str = window.location.href;
			var patt1 = new RegExp("search.html");
			var result = patt1.test(str);
			if (!result) {
				window.location.href = "search.html"
			}

		})
	});

	//隐藏地址栏
	if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
		bodyTag = document.getElementsByTagName('body')[0];
		bodyTag.style.height = document.documentElement.clientWidth / screen.width * screen.height + 'px';
	}
	setTimeout(function () {
		window.scrollTo(0, 1)
	}, 0);

    //暂不支持横屏
    (function(){
        var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');
        var HTMLNode = document.body.parentNode;
        var updateOrientation = function() {
            if(supportsOrientation) {
                updateOrientation = function() {
                    var orientation = window.orientation;

                    switch(orientation) {
                        case 90: case -90:
                        orientation = 'landscape';
                        break;
                        default:
                            orientation = 'portrait';
                    }
                    HTMLNode.setAttribute('class', orientation);
                    if(orientation == 'landscape'){
                        hengping();
                    }else if(orientation == 'portrait'){
                        shuping();
                    }
                }
            } else {
                updateOrientation = function() {
                    var orientation = (window.innerWidth > window.innerHeight) ? 'landscape': 'portrait';

                    HTMLNode.setAttribute('class', orientation);
                    if(orientation == 'landscape'){
                        hengping();
                    }else if(orientation == 'portrait'){
                        shuping();
                    }
                }
            }

            updateOrientation();
        };
        var init = function() {
            updateOrientation();

            if(supportsOrientation) {
                window.addEventListener('orientationchange', updateOrientation, false);
            } else {
                setInterval(updateOrientation, 50);
            }

        };
        window.addEventListener('DOMContentLoaded', init, false);
    })();


    function hengping() {
        if($("#hengping").length>0){
            return false;
        }else{
            $("body").append("<div id='hengping' style='width: 100%; color:red; position: absolute; height:5000px; z-index: 9999; line-height: 300px; background: #fff; font-size: 32px;  '>暂不支持横屏浏览</div>");

            $(window).bind("scroll.a", function () {
                $(window).scrollTop(0);
            })
        }
    }

    function shuping() {
        if($("#hengping").length>0){
            $("#hengping").remove();
        }
        $(window).unbind("scroll.a");
    }

});

//页面刷新
function m_reload() {
	window.location.reload();
}
//判断是否登录
function isloginin() {
	return getUserInfo() != null;
}
window.isloginin = isloginin();

//全局loading
function addloading(opt) {
    if($("#loadinggif").length>0){
        $("#loadinggif").show();
    }else{
        if ($("body").width() < 480) {
            $("#" + opt).append("<div id='loadinggif' style='width: 100%;position: relative; height:300px;  '><img style='position: absolute; left: 50%; margin-left: -40px; top: 100px;width: 80px; height: 80px;' src='../images/loading.gif' alt='loading图片'/></div>")
        } else {
            $("#" + opt).append("<div id='loadinggif' style='width: 100%;position: relative; height:500px; '><img style='position: absolute; left: 50%; margin-left: -80px; top: 160px;width: 160px; height: 160px;' src='../images/loading.gif' alt='loading图片'/></div>")
        }
    }
}

function removeloading() {
	if ($("#loadinggif").length>0) {
		$("#loadinggif").remove();
	}

}

//弹出层
function popup(){
    var _height = $(document).height();
    $("body").append("<div id='popup'><div class='content'><a class='closebtn' href='javascript:void(0)'></a><p>要体验更多更强大的功能请下载手机APP</p></div></div>");
    $("#popup").height(_height);
}

//下拉loading
function downloading (id,opt){
    var content;
    if(opt=="more"){
        content="正在加载";
    }else if("no"){
        content="暂无数据";
    }
    $("#"+id).append("<li id='downloading'><div><img src='../images/loading.gif' alt='loading图片'/><span>"+content+"</span></div></li>");
}

function removedownloading(){
    if($("#downloading").length>0){
        $("#downloading").remove();
    }
}


//取地址栏参数
function GetQueryString() {
	var name, value;
	var str = location.href; //取得整个地址栏
	var num = str.indexOf("?");
	str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

	var arr = str.split("&"); //各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			this[name] = value;
		}
	}
}

//截取字符串 包含中文处理,一个中文字符等于2个长度
//(串,长度,...样式)
function stringintercept(str, len, hasDot) {
	var newLength = 0;
	var newStr = "";
	var chineseRegex = /[^\x00-\xff]/g;
	var singleChar = "";
	var strLength = str.replace(chineseRegex, "**").length;
	for (var i = 0; i < strLength; i++) {
		singleChar = str.charAt(i).toString();
		if (singleChar.match(chineseRegex) != null) {
			newLength += 2;
		} else {
			newLength++;
		}
		if (newLength > len) {
			break;
		}
		newStr += singleChar;
	}

	if (hasDot && strLength > len) {
		newStr += hasDot;
	}
	return newStr;
}

//URI解码
function UrlDecode(zipStr) {
	var uzipStr = "";
	for (var i = 0; i < zipStr.length; i++) {
		var chr = zipStr.charAt(i);
		if (chr == "+") {
			uzipStr += " ";
		} else if (chr == "%") {
			var asc = zipStr.substring(i + 1, i + 3);
			if (parseInt("0x" + asc) > 0x7f) {
				uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
				i += 8;
			} else {
				uzipStr += AsciiToString(parseInt("0x" + asc));
				i += 2;
			}
		} else {
			uzipStr += chr;
		}
	}

	return uzipStr;
}

function StringToAscii(str) {
	return str.charCodeAt(0).toString(16);
}

function AsciiToString(asccode) {
	return String.fromCharCode(asccode);
}


function getUserInfo() {
	try {
		if (typeof (window.localStorage) === 'object') {
			var userinfostr = localStorage.getItem("userinfo_currect");
			if (userinfostr) {
				return JSON.parse(userinfostr);
			} else {
				return null;
			}
		}
	} catch (err) {
		return null;
	}
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

