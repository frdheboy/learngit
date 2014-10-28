/**
 * Created by Administrator on 2014/8/13.
 */
$(document).ready(function () {
    addloading("superman_big");
    var rank = [];
    var username = [];
    var exponent = [];
    var profit = [];
    var positionCount = [];
    var tradeCount = [];
    var successRate = [];
    var istockCount = [];
    var fansCount = [];
    var profitRate = [];
    var headPic = [];
    var fromid = 1;
    var biaoshifu = true;

    function buju(opt) {
        var opts = {
            fromid: opt,
            reqnum: 20
        };
        var gal = new GalHttpRequest(config_url.week_rank, opts);
        gal.requestFromNet({
            succeed: function (data) {

                removeloading();
                $.each(data.result, function (i, n) {
                    username[i] = n.nickName;
                    exponent[i] = n.exponent;
                    profit[i] = n.profit;
                    positionCount[i] = n.positionCount;
                    tradeCount[i] = n.tradeCount;
                    successRate[i] = n.successRate
                    istockCount[i] = n.istockCount;
                    fansCount[i] = n.fansCount;
                    profitRate[i] = n.profitRate;
                    headPic[i] = n.headPic;
                    rank[i] = n.rank;
                    $(".superman_big").append(" <div><div><ul><li class='rank'>" + n.rank + "</li><li class='headpic'></li><li><h1>" + n.nickName + "</h1><p><span>推荐指数：</span><strong>" + n.exponent + "</strong></p><ul><li><span>总盈利率：</span><strong class='read'>" + n.profit + "</strong></li><li><span>总盈利：</span><strong>" + n.profitRate + "</strong></li><li><span>持仓数：</span><strong>" + n.positionCount + "</strong></li><li><span>交易数：</span><strong>" + n.tradeCount + "</strong></li><li><span>成功率：</span><strong>" + n.successRate + "</strong></li><li><span>聊股数：</span><strong>" + n.istockCount + "</strong></li><li><span>粉丝数：</span><strong>" + n.fansCount + "</strong></li></ul></li></ul><a class='infobtn' href='javascript:void(0)'></a></div></div>")
                    if (n.headPic != "") {
                        $("li.headpic").eq(i).css("background-img", "url(" + n.headPic + ")");
                    }
                });

                //第1,2,3名排名加星星背景
                for (var i = 0; i < $(".rank").length; i++) {
                    if ($(".rank").eq(i).html() == "1") {
                        $(".rank").eq(i).addClass("first");
                    } else if ($(".rank").eq(i).html() == "2") {
                        $(".rank").eq(i).addClass("second");
                    } else if ($(".rank").eq(i).html() == "3") {
                        $(".rank").eq(i).addClass("third");
                    }
                }

                //点击撑开
                $(".superman_big>div").unbind("click");
                $(".superman_big>div").click(function () {
                    $(".superman_big>div").find("ul:last").stop(true, true);
                    $(".superman_big>div").find("a.infobtn").stop(true, true);
                    var biaoshifu1 = $(this).find("ul:last").is(":hidden");
                    if (biaoshifu1) {
                        $(this).find("ul:last").slideDown(300, function () {
                            biaoshifu1 = false;
                        });
                        $(this).siblings("div").find("ul:last").slideUp(300);
                        if ($(document).width() < 480) {
                            $(this).find("a.infobtn").animate({"top": "100"}, 300);
                            $(this).siblings("div").find("a.infobtn").animate({"top": "16"}, 300);
                        }
                        else {
                            $(this).find("a.infobtn").animate({"top": "160"}, 300);
                            $(this).siblings("div").find("a.infobtn").animate({"top": "30"}, 300);
                        }
                    } else {
                        $(this).find("ul:last").slideUp(300, function () {
                            biaoshifu1 = true;
                        });
                        if ($(document).width() < 480) {
                            $(this).find("a.infobtn").animate({"top": "16"}, 300);
                        }
                        else {
                            $(this).find("a.infobtn").animate({"top": "30"}, 300);
                        }
                    }
                });

                //点击按钮切换页面
                $(".superman_big>div").find("a.infobtn").click(function (event) {
                    window.location.href = "index.html";
                    event.stopPropagation();
                });

                if (opt != 1) {
                    biaoshifu = true;
                }
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
                alert(error.message)
            }
        });
    }

    buju(fromid);
    lazyload1(buju, fromid);
    //lazyload

    function lazyload1(fn, opt) {
        $(window).scroll(function () {
            var ttheight = $("body").height() > $(document).height() ? $("body").height() : $(document).height();
            var scrollheight;
            var lazyloadcoe = 0.9;
            scrollheight = $(document).scrollTop() + $(window).height();
            if (parseInt(scrollheight) > parseInt(ttheight * lazyloadcoe)) {
                if (biaoshifu) {
                    biaoshifu = false;
                    opt = opt + 20;
                    fn(opt);
                    fromid = opt;
                }
            }
        });
    }

});
