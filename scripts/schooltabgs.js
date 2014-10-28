// JavaScript Document
$(document).ready(function(e) {	
	//搜索框	
	$(".header_input").click(function () {
		var str = window.location.href;
		var patt1 = new RegExp("search.html");
		var result = patt1.test(str);
		if (!result) {
			window.location.href = "search.html"
		}

	});	
	//点击弹出按钮
	$('.mcon_r').height($(window).height()-83);
  	$('#sortkeys li').click(function(){
		$('#keytoast').text($(this).text());
		$('#keytoast').fadeIn();//fadeIn淡出
		setTimeout(function(){//多长时间运行
			$('#keytoast').fadeOut();
		},800)
		
	});
	

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



