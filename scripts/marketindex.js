/**
 * Created by Administrator on 2014/8/19.
 */
$(document).ready(function () {
    addloading("bigbox");
    var Request = new GetQueryString();
    var pageid = Request.pageid;
    var _num = 1;
    var biaoshifu = true;

    /*根据地址栏参数获取不同接口*/
    switch (pageid) {
        case "exponent":
            markstocklist();
            break;
        case "industrylist":
            industrylist();
            break;
        case "notionlist":
            notionlist();
            break;
        case "upranklist":
            zdranklist("up");
            break;
        case "downranklist":
            zdranklist("down");
            break;
        case "hslist":
            hslist();
            break;
        case "zflist":
            zflist();
            break;
        case "newstock":
            newstock();
            break;
        default:
            markstocklist();
    }

    /*大盘指数*/
    function markstocklist() {
        var opts = {
        };
        var gal = new GalHttpRequest(config_url.markstocklist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                $(".crumbs").find("a:last").html("大盘指数");
                if ($("#hq_red")) {
                    $("#hq_red").html(("大盘指数"));
                }
                $("#title_list").append("<li>股票名称</li><li>最新价</li><li>涨跌幅</li>");
                console.log(data);
                buju_1(data.curstatus, true);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    /*热门行业列表*/
    function industrylist() {
        var opts = {
            start: _num,
            reqnum: 20,
            order: -1
        };
        var gal = new GalHttpRequest(config_url.industrylist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                if (_num == 1) {
                    $(".crumbs").find("a:last").html("热门行业");
                    if ($("#hq_red")) {
                        $("#hq_red").html(("热门行业"));
                    }
                    $("#title_list").append("<li>行业名称</li><li>涨跌幅<img src='../images/figure006.jpg'/></li><li>领涨股</li>");
                }
                console.log(data);
                buju(data.boardquote);
                if (_num != 1) {
                    biaoshifu = true;
                }
                if (data.boardquote.length < 1) {
                    removedownloading();
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                    biaoshifu = false;
                }
                lazyload1(industrylist, _num);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    /*热门概念列表*/
    function notionlist() {
        var opts = {
            start: _num,
            reqnum: 20,
            order: -1
        };
        var gal = new GalHttpRequest(config_url.notionlist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                if (_num == 1) {
                    $(".crumbs").find("a:last").html("热门概念");
                    if ($("#hq_red")) {
                        $("#hq_red").html(("热门概念"));
                    }
                    $("#title_list").append("<li>概念名称</li><li>涨跌幅<img src='../images/figure006.jpg'/></li><li>领涨股</li>");
                }
                console.log(data);
                buju(data.boardquote);
                if (_num != 1) {
                    biaoshifu = true;
                }
                if (data.boardquote.length < 1) {
                    removedownloading();
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                    biaoshifu = false;
                }
                lazyload1(notionlist, _num);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    /*涨跌幅*/
    function zdranklist(opt) {
        var _order;
        if (opt == "up") {
            _order = -1;
            $(".crumbs").find("a:last").html("涨幅榜");
            if ($("#hq_red")) {
                $("#hq_red").html(("涨幅榜"));
            }
        } else {
            _order = 1;
            $(".crumbs").find("a:last").html("跌幅榜");
            if ($("#hq_red")) {
                $("#hq_red").html(("跌幅榜"));
            }
        }

        var opts = {
            start: _num,
            reqnum: 20,
            order: _order
        };
        var gal = new GalHttpRequest(config_url.zdranklist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                if (_num == 1 && $("#zdbtn").length < 1) {
                    if(_order == -1){
                        $("#title_list").append("<li>股票名称</li><li>最新价</li><a id='zdbtn' href='javascript:void(0)'><li>涨跌幅<img src='../images/figure006.jpg'/></li></a>");
                    }else if(_order == 1){
                        $("#title_list").append("<li>股票名称</li><li>最新价</li><a id='zdbtn' href='javascript:void(0)'><li>涨跌幅<img src='../images/figure006_1.jpg'/></li></a>");
                    }
                }
                $("#zdbtn").unbind();
                $("#zdbtn").on("click", function () {
                    if (_order == -1) {
                        _num=1;
                        $("#ul_list").empty();
                        $(window).off("scroll");
                        zdranklist("down");
                        $(this).find("img").attr("src", "../images/figure006_1.jpg");
                    } else if (_order == 1) {
                        _num=1;
                        $(window).off("scroll");
                        $("#ul_list").empty();
                        zdranklist("up");
                        $(this).find("img").attr("src", "../images/figure006.jpg");
                    } else {
                        return false;
                    }
                });
                console.log(data);
                buju_1(data.stockquote);
                if (_num != 1) {
                    biaoshifu = true;
                }
                if (data.stockquote.length < 1) {
                    removedownloading();
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                    biaoshifu = false;
                }
                lazyload1(zdranklist, _num, opt);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });


    }

    /*换手榜*/
    function hslist() {
        var opts = {
            start: _num,
            reqnum: 20,
            order: -1
        };
        var gal = new GalHttpRequest(config_url.hslist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                if (_num == 1) {
                    $(".crumbs").find("a:last").html("换手榜");
                    if ($("#hq_red")) {
                        $("#hq_red").html(("换手榜"));
                    }
                    $("#title_list").append("<li>股票名称</li><li>最新价</li><li>换手率</li>");
                }
                console.log(data);
                buju_2(data.stockquote);
                if (_num != 1) {
                    biaoshifu = true;
                }
                if (data.stockquote.length < 1) {
                    removedownloading();
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                    biaoshifu = false;
                }
                lazyload1(hslist, _num);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    /*振幅榜*/
    function zflist() {
        var opts = {
            start: _num,
            reqnum: 20,
            order: -1
        };
        var gal = new GalHttpRequest(config_url.zflist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                if (_num == 1) {
                    $(".crumbs").find("a:last").html("振幅榜");
                    if ($("#hq_red")) {
                        $("#hq_red").html(("振幅榜"));
                    }
                    $("#title_list").append("<li>股票名称</li><li>最新价</li><li>振幅<img src='../images/figure006.jpg'/></li>");
                }
                console.log(data);
                buju_2(data.stockquote);
                if (_num != 1) {
                    biaoshifu = true;
                }
                if (data.stockquote.length < 1) {
                    removedownloading();
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                    biaoshifu = false;
                }
                lazyload1(zflist, _num);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    /*新股发行*/
    function newstock() {
        var opts = {
            start: _num,
            reqnum: 20,
            order: -1
        };
        var gal = new GalHttpRequest(config_url.newstock, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();
                if (_num == 1) {
                    $(".crumbs").find("a:last").html("新股发行");
                    if ($("#hq_red")) {
                        $("#hq_red").html(("新股发行"));
                    }
                    $("#title_list").append("<li>股票名称</li><li>总发行数(万股)</li><li>申购日期</li>");
                }
                console.log(data.newstock);
                buju_3(data.newstock);
                if (_num != 1) {
                    biaoshifu = true;
                }
                if (data.newstock.length < 1) {
                    removedownloading();
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                    biaoshifu = false;
                }
                lazyload1(newstock, _num);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    /*页面渲染*/
    function buju(data) {
        $.each(data, function (i, n) {
            var dataper = [];
            if (n.dataper >= 0) {
                dataper[i] = "+" + n.dataper.toFixed(2) + "%";
                $("#ul_list").append("<li><p><span class='nom'>" + n.name + "</span></p><p class='red'>" + dataper[i] + "</p><p><span data-codeid='" + n.leadername + "'>" + n.leadername + "</span><em data-codename='" + n.code + "'>" + n.leadercode.substr(2, 6) + "</em></p></li>");
            } else {
                dataper[i] = n.dataper.toFixed(2) + "%";
                $("#ul_list").append("<li><p><span class='nom'>" + n.name + "</span></p><p class='green'>" + dataper[i] + "</p><p><span data-codeid='" + n.leadername + "'>" + n.leadername + "</span><em data-codename='" + n.code + "'>" + n.leadercode.substr(2, 6) + "</em></p></li>");
            }
            $("#ul_list").find("li").on("click", function (event) {
                var _name = $(this).find(".nom").text();
                var _code = $(this).find("em[data-codename]").attr("data-codename");
                var category =$(".crumbs").find("a:eq(2)").text();
                window.location.href = "hotlist.html?codeid=" + _code + "&codename=" + _name.replace(/\s/g, "") + "&category="+category;
                event.stopPropagation();
            });
        });
        downloading("ul_list","more");
    }

    function buju_1(data, opt) {
        var dataper = [];
        var curprice = [];
        $.each(data, function (i, n) {
            curprice[i] = n.curprice.toFixed(2);
            if (n.dataper >= 0) {
                dataper[i] = "+" + n.dataper.toFixed(2) + "%";
                $("#ul_list").append("<li><p><span data-codeid='" + n.name + "'>" + n.name + "</span><em data-codename='" + n.code + "'>" + n.code.substr(2, 6) + "</em></p><p class='red'>" + curprice[i] + "</p><p class='red'>" + dataper[i] + "</p></li>");
            } else {
                dataper[i] = n.dataper.toFixed(2) + "%";
                $("#ul_list").append("<li><p><span data-codeid='" + n.name + "'>" + n.name + "</span><em data-codename='" + n.code + "'>" + n.code.substr(2, 6) + "</em></p><p class='green'>" + curprice[i] + "</p><p class='green'>" + dataper[i] + "</p></li>");
            }

        });
        $("#ul_list").find("li").on("click", function (event) {
            var _name = $(this).find("span[data-codeid]").attr("data-codeid");
            var _code = $(this).find("em[data-codename]").attr("data-codename");
            if (opt == true) {
                window.location.href = "stockinfo_tt.html?codeid=" + _code + "&codename=" + _name.replace(/\s/g, "");
            } else {
                window.location.href = "stockinfo.html?codeid=" + _code + "&codename=" + _name.replace(/\s/g, "");
            }

            event.stopPropagation();
        });
        if(opt!=true){
            downloading("ul_list","more");
        }

    }

    function buju_2(data) {
        var dataper = [];
        var curprice = [];
        $.each(data, function (i, n) {
            dataper[i] = n.dataper.toFixed(2) + "%";
            curprice[i] = n.curprice.toFixed(2);
            $("#ul_list").append("<li><p><span data-codeid='" + n.name + "'>" + n.name + "</span><em data-codename='" + n.code + "'>" + n.code.substr(2, 6) + "</em></p><p class='b'>" + curprice[i] + "</p><p class='b'>" + dataper[i] + "</p></li>");
        });
        $("#ul_list").find("li").on("click", function (event) {
            var _name = $(this).find("span[data-codeid]").attr("data-codeid");
            var _code = $(this).find("em[data-codename]").attr("data-codename");
            window.location.href = "stockinfo.html?codeid=" + _code + "&codename=" + _name.replace(/\s/g, "");
            event.stopPropagation();
        });
        downloading("ul_list","more");
    }

    function buju_3(data) {
        var issueshare = [];
        var applydate = [];
        $.each(data, function (i, n) {
            if (n.issueshare > 10000) {
                issueshare[i] = (n.issueshare / 10000).toFixed();
            }
            applydate[i] = n.applydate;
            $("#ul_list").append("<li><p><span data-codeid="+n.name+">" + n.name + "</span><em data-codename="+n.code+">" + n.code.substr(2, 6) + "</em></p><p class='b'>" + issueshare[i] + "</p><p class='b'>" + applydate[i] + "</p></li>");
        });

        $("#ul_list").find("li").on("click", function (event) {
            var _name = $(this).find("span[data-codeid]").attr("data-codeid");
            var _code = $(this).find("em[data-codename]").attr("data-codename");
            window.location.href = "newstocklist.html?codeid=" + _code + "&codename=" + _name.replace(/\s/g, "");
            event.stopPropagation();
        });
        downloading("ul_list","more");
    }

    //lazyload
    function lazyload1(fn, opt, pro) {
        $(window).scroll(function () {
            var ttheight = $("body").height() > $(document).height() ? $("body").height() : $(document).height();
            var scrollheight;
            var lazyloadcoe = 0.9;
            scrollheight = $(document).scrollTop() + $(window).height();
            if (parseInt(scrollheight) > parseInt(ttheight * lazyloadcoe)) {
                if (biaoshifu) {
                    biaoshifu = false;
                    opt = opt + 20;
                    _num = opt;
                    fn(pro);
                }
            }
        });
    }

});
