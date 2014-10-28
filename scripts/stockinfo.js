/**
 * Created by Administrator on 2014/8/20.
 */
$(document).ready(function () {
    addloading("bigbox");
    var Request = new GetQueryString();
    var codeid = Request.codeid;
    var codename = UrlDecode(Request.codename);
    var personalStock = new PersonalStockList();
    var isPersonalStock = false;
    personalStock.queryPersonalStock(function (stockcodes) {
        isPersonalStock = stockcodes.indexOf(codeid) >= 0;
        $('#addstock a').text(isPersonalStock ? '删除自选' : '添加自选');
    });
    $('#addstock').click(function () {
        if (isPersonalStock) {
            personalStock.removeStock(codeid, function () {
                isPersonalStock = false;
                $('#addstock a').text('添加自选');
            });
        } else {
            personalStock.addStock(codeid, function () {
                isPersonalStock = true;
                $('#addstock a').text('删除自选');
            });
        }
    });

    function requhygnlist(opt) {
        var opts = {
            code: codeid
        };
        var gal = new GalHttpRequest(config_url.socketinfo, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                console.log(data);
                removeloading();
                $(".tip_1").show();
                $(".crumbs").find("a:last").html(codename + "(" + codeid.substr(2, 8) + ")");
                var _data = data.curstatus[0];
                $("#para1").find("em").html(_data.curprice.toFixed(2));
                if (_data.change >= 0) {
                    $("#para1").find("span:eq(0)").html("+" + _data.change.toFixed(2));
                    $("#para1").find("span:eq(1)").html("+" + _data.changeper.toFixed(2) + "%");
                } else {
                    $("#para1").find("em").css({
                        "color": "#168816"
                    });
                    $("#para1").find("span:eq(0)").html(_data.change.toFixed(2));
                    $("#para1").find("span:eq(1)").html(_data.changeper.toFixed(2) + "%");
                    $("#para1").find("span:eq(0)").css({
                        "color": "#168816"
                    });
                    $("#para1").find("span:eq(1)").css({
                        "color": "#168816"
                    });
                }

                $("#para2").find("em:eq(0)").html(_data.openprice.toFixed(2));
                var chengjiaoliang;
                if (_data.totalamount > 1000 * 10000 * 10000) {
                    chengjiaoliang = (_data.totalamount / 100000000000).toFixed(2) + "千亿手";
                } else if (_data.totalamount > 100 * 10000 * 10000) {
                    chengjiaoliang = (_data.totalamount / 100000000).toFixed(1) + "亿手";
                } else if (_data.totalamount > 10 * 10000 * 10000) {
                    chengjiaoliang = (_data.totalamount / 100000000).toFixed(2) + "亿手";
                } else if (_data.totalamount > 10000 * 10000) {
                    chengjiaoliang = (_data.totalamount / 100000000).toFixed(3) + "亿手";
                } else if (_data.totalamount > 10000) {
                    chengjiaoliang = (_data.totalamount / 10000).toFixed(1) + "万手";
                } else {
                    chengjiaoliang = _data.totalamount.toFixed(0) + "手";
                }
                $("#para2").find("em:eq(1)").html(chengjiaoliang);
                $("#para2").find("em:eq(2)").html(_data.closeprice.toFixed(2));
                $("#para2").find("em:eq(3)").html(_data.hsper.toFixed(2) + "%");

                $("#para3").find("em:eq(0)").html(_data.highprice.toFixed(2));
                $("#para3").find("em:eq(1)").html((_data.zfper.toFixed(2)) + "%");
                var chengjiaoe;
                if (_data.totalmoney > 1000 * 10000 * 10000) {
                    chengjiaoe = (_data.totalmoney / 100000000000).toFixed(2) + "千亿";
                } else if (_data.totalmoney > 100 * 10000 * 10000) {
                    chengjiaoe = (_data.totalmoney / 100000000).toFixed(1) + "亿";
                } else if (_data.totalmoney > 10 * 10000 * 10000) {
                    chengjiaoe = (_data.totalmoney / 100000000).toFixed(2) + "亿";
                } else if (_data.totalmoney > 10000 * 10000) {
                    chengjiaoe = (_data.totalmoney / 100000000).toFixed(2) + "亿";
                } else if (_data.totalmoney > 10000) {
                    chengjiaoe = (_data.totalmoney / 10000).toFixed(1) + "万";
                } else {
                    chengjiaoe = _data.totalmoney.toFixed(0);
                }
                $("#para3").find("em:eq(2)").html(chengjiaoe);
                $("#para3").find("em:eq(3)").html(_data.lowprice.toFixed(2));
                $("#para3").find("em:eq(4)").html(_data.revenue.toFixed(2));
                var shizhi;
                if (_data.outshare > 100 * 10000 * 10000) {
                    shizhi = (_data.outshare / 100000000).toFixed(1) + "亿";
                } else if (_data.outshare > 10 * 10000 * 10000) {
                    shizhi = (_data.outshare / 100000000).toFixed(2) + "亿";
                } else if (_data.outshare > 10000 * 10000) {
                    shizhi = (_data.outshare / 100000000).toFixed(2) + "亿";
                } else if (_data.outshare > 10000) {
                    shizhi = (_data.outshare / 10000).toFixed(1) + "万";
                } else {
                    shizhi = _data.outshare.toFixed(0);
                }
                $("#para3").find("em:eq(5)").html(shizhi);

                /**
                 * 渲染分时图表右侧买卖5档价格
                 */
                var selltop5 = $("#fenshiinfo").find("table:first");
                var buytop5 = $("#fenshiinfo").find("table:last");


                if (data.top5quotation[0].sellamount5.toFixed(0) == 0 && data.top5quotation[0].sellamount4.toFixed(0) == 0 && data.top5quotation[0].sellamount3.toFixed(0) == 0 && data.top5quotation[0].sellamount2.toFixed(0) == 0 && data.top5quotation[0].sellamount1.toFixed(0) == 0) {

                } else {
                    if (_data.closeprice.toFixed(2) <= data.top5quotation[0].sellprice1.toFixed(2)) {
                        selltop5.find("tr:eq(4)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        selltop5.find("tr:eq(3)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        selltop5.find("tr:eq(2)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        selltop5.find("tr:eq(1)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        selltop5.find("tr:eq(0)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                    } else {
                        selltop5.find("tr:eq(4)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        selltop5.find("tr:eq(3)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        selltop5.find("tr:eq(2)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        selltop5.find("tr:eq(1)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        selltop5.find("tr:eq(0)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                    }
                }

                selltop5.find("tr:eq(0)").find("td:eq(1)").html(data.top5quotation[0].sellprice5.toFixed(2));
                selltop5.find("tr:eq(0)").find("td:last").html(data.top5quotation[0].sellamount5.toFixed(0));
                selltop5.find("tr:eq(1)").find("td:eq(1)").html(data.top5quotation[0].sellprice4.toFixed(2));
                selltop5.find("tr:eq(1)").find("td:last").html(data.top5quotation[0].sellamount4.toFixed(0));
                selltop5.find("tr:eq(2)").find("td:eq(1)").html(data.top5quotation[0].sellprice3.toFixed(2));
                selltop5.find("tr:eq(2)").find("td:last").html(data.top5quotation[0].sellamount3.toFixed(0));
                selltop5.find("tr:eq(3)").find("td:eq(1)").html(data.top5quotation[0].sellprice2.toFixed(2));
                selltop5.find("tr:eq(3)").find("td:last").html(data.top5quotation[0].sellamount2.toFixed(0));
                selltop5.find("tr:eq(4)").find("td:eq(1)").html(data.top5quotation[0].sellprice1.toFixed(2));
                selltop5.find("tr:eq(4)").find("td:last").html(data.top5quotation[0].sellamount1.toFixed(0));

                if (data.top5quotation[0].buyamount5.toFixed(0) == 0 && data.top5quotation[0].buyamount4.toFixed(0) == 0 && data.top5quotation[0].buyamount3.toFixed(0) == 0 && data.top5quotation[0].buyamount2.toFixed(0) == 0 && data.top5quotation[0].buyamount1.toFixed(0) == 0) {

                } else {
                    if (_data.closeprice.toFixed(2) <= data.top5quotation[0].buyprice5.toFixed(2)) {
                        buytop5.find("tr:eq(4)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        buytop5.find("tr:eq(3)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        buytop5.find("tr:eq(2)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        buytop5.find("tr:eq(1)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                        buytop5.find("tr:eq(0)").find("td:eq(1)").css({
                            "color": "#d62829"
                        });
                    } else {
                        buytop5.find("tr:eq(4)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        buytop5.find("tr:eq(3)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        buytop5.find("tr:eq(2)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        buytop5.find("tr:eq(1)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                        buytop5.find("tr:eq(0)").find("td:eq(1)").css({
                            "color": "#168816"
                        });
                    }
                }


                buytop5.find("tr:eq(4)").find("td:eq(1)").html(data.top5quotation[0].buyprice5.toFixed(2));
                buytop5.find("tr:eq(4)").find("td:last").html(data.top5quotation[0].buyamount5.toFixed(0));
                buytop5.find("tr:eq(3)").find("td:eq(1)").html(data.top5quotation[0].buyprice4.toFixed(2));
                buytop5.find("tr:eq(3)").find("td:last").html(data.top5quotation[0].buyamount4.toFixed(0));
                buytop5.find("tr:eq(2)").find("td:eq(1)").html(data.top5quotation[0].buyprice3.toFixed(2));
                buytop5.find("tr:eq(2)").find("td:last").html(data.top5quotation[0].buyamount3.toFixed(0));
                buytop5.find("tr:eq(1)").find("td:eq(1)").html(data.top5quotation[0].buyprice2.toFixed(2));
                buytop5.find("tr:eq(1)").find("td:last").html(data.top5quotation[0].buyamount2.toFixed(0));
                buytop5.find("tr:eq(0)").find("td:eq(1)").html(data.top5quotation[0].buyprice1.toFixed(2));
                buytop5.find("tr:eq(0)").find("td:last").html(data.top5quotation[0].buyamount1.toFixed(0));


                /**
                 * 取完数据渲染完页面之后再取图表的高度，否则高度计算不准确
                 */
                chicunbj();
                if (opt == true) {
                    initKline();
                }
            },
            error: function (error) {
                console.log(error); //错误信息提示
            }
        });
    }

    requhygnlist(true);
    /**
     *定时刷新信息
     * @param opt
     */
    var dingshishuaxin = setInterval(function () {
        requhygnlist(false);
    }, 10000);

    var lastid;

    function requhygnnews(opt) {
        if (opt == 0) {
            $("#stocknewslist").html("");
        }
        var opts = {
            code: codeid,
            fromid: opt,
            limit: 20
        };
        var gal = new GalHttpRequest(config_url.stock_newslist, opts);
        gal.requestFromNet({
            succeed: function (data) {
                removedownloading();
                if (opt == 0) {
                    removeloading();
                    $(".tip_2").show(200);
                    if (data.result.length < 1) {
                        $("#stocknewslist").html("<p style='margin-top: 50px'><img src='../images/no_network.png'/></p><p style='margin-top: 5px'>暂无数据</p>");
                        return false;
                    }
                }

                $.each(data.result, function (i, n) {
                    var _time;
                    var d = new Date();
                    d.setTime(n.pubtime);
                    var _year = d.getFullYear();
                    var newyear = new Date();

                    var _day = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
                    var _hours = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
                    var _min = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
                    var _month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
                    if (newyear.getFullYear() == _year) {
                        _time = _month + "月" + _day + "日&nbsp;&nbsp;" + _hours + ":" + _min;
                    } else {
                        _time = _year + "年" + _month + "月" + _day + "日&nbsp;&nbsp;" + _hours + ":" + _min;
                    }

                    $("#stocknewslist").append("<li><a href='" + n.url + "'><p>" + stringintercept(n.title, 60, "...") + "<span>" + _time + "</span></p></a></li>");
                });

                if (data.result.length > 0) {
                    lastid = data.result[data.result.length - 1].id;
                } else {
                    //=1的时候到的值个数为0
                    lastid = 1;
                }


                if (opt != 0) {
                    scrollajax.isGetDate = true;
                    jishu += 20;
                }


                /**
                 * 外部地址放在iframe里面
                 */
                $("#stocknewslist").find("a").on("click", function (event) {
                    event.stopPropagation();
                    var address = $(this).attr("href");
                    window.location.href = "stockstatus.html?address=" + address;
                    return false;
                });

                if (data.result.length < 1) {
                    downloading("stocknewslist", "no");
                    setTimeout(function () {
                        removedownloading();
                    }, 1000);
                }
            },
            error: function (error) {
                console.log(error); //错误信息提示
            }
        });
    }


    function requhygnggs(opt) {
        if (opt == 0) {
            $("#stocknewslist").html("");
        }

        var opts = {
            code: codeid,
            fromid: opt,
            limit: 20
        };
        var gal = new GalHttpRequest(config_url.stock_gglist, opts);
        gal.requestFromNet({
            succeed: function (data) {
                removedownloading();
                removeloading();
                if (opt == 0) {
                    $(".tip_2").show(200);
                    if (data.result.length < 1) {
                        $("#stocknewslist").html("<p style='margin-top: 50px'><img src='../images/no_network.png'/></p><p style='margin-top: 5px'>暂无数据</p>");
                        return false;
                    }
                }

                $.each(data.result, function (i, n) {
                    var _time;
                    var d = new Date();
                    var _year = d.getFullYear();
                    var newyear = new Date();
                    d.setTime(n.pubtime);
                    var _day = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
                    var _month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
                    if (newyear.getFullYear() == _year) {
                        _time = _month + "月" + _day + "日";
                    } else {
                        _time = _year + "年" + _month + "月" + _day + "日";
                    }
                    $("#stocknewslist").append("<li><a href='" + n.url + "'><p>" + stringintercept(n.title, 60, "...") + "<span>" + _time + "</span></p></a></li>");
                });

                /**
                 * 外部地址放在iframe里面
                 */
                $("#stocknewslist").find("a").on("click", function (event) {
                    event.stopPropagation();
                    var address = $(this).attr("href");
                    window.location.href = "stockstatus.html?address=" + address;
                    return false;
                });
                if (data.result.length > 0) {
                    lastid = data.result[data.result.length - 1].id;
                } else {
                    //=1的时候到的值个数为0
                    lastid = 1;
                }


                if (opt != 0) {
                    scrollajax.isGetDate = true;
                    jishu += 20;
                }

                if (data.result.length < 1) {
                    downloading("stocknewslist", "no");
                    setTimeout(function () {
                        removedownloading();
                    }, 1000);
                }
            },
            error: function (error) {
                console.log(error); //错误信息提示
            }
        });
    }

    function requhygnhnews(opt) {
        if (opt == 0) {
            $("#stocknewslist").html("");
        }

        var opts = {
            code: codeid,
            fromid: opt,
            limit: 20
        };
        var gal = new GalHttpRequest(config_url.stock_hnewslist, opts);
        gal.requestFromNet({
            succeed: function (data) {
                removeloading();
                removedownloading();

                if (opt == 0) {
                    $(".tip_2").show(200);
                    if (data.result.length < 1) {
                        $("#stocknewslist").html("<p style='margin-top: 50px'><img src='../images/no_network.png'/></p><p style='margin-top: 5px'>暂无数据</p>");
                        return false;
                    }
                }

                $.each(data.result, function (i, n) {
                    var _time;
                    var d = new Date();
                    var _year = d.getFullYear();
                    var newyear = new Date();
                    d.setTime(n.pubtime);
                    var _day = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
                    var _month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
                    if (d.getFullYear() == _year) {
                        _time = _month + "月" + _day + "日";
                    } else {
                        _time = d.getFullYear() + "年" + _month + "月" + _day + "日";
                    }
                    $("#stocknewslist").append("<li><a href='" + n.url + "'><p>" + stringintercept(n.title, 60, "...") + "<span>" + _time + "</span></p></a></li>");
                });
                if (opt != 0) {
                    scrollajax.isGetDate = true;
                    jishu += 20;
                }
                if (data.result.length > 0) {
                    lastid = data.result[data.result.length - 1].id;
                } else {
                    //=1的时候到的值个数为0
                    lastid = 1;
                }

                /**
                 * 外部地址放在iframe里面
                 */
                $("#stocknewslist").find("a").on("click", function (event) {
                    event.stopPropagation();
                    var address = $(this).attr("href");
                    window.location.href = "stockstatus.html?address=" + address;
                    return false;
                });

                if (data.result.length < 1) {
                    downloading("stocknewslist", "no");
                    setTimeout(function () {
                        removedownloading();
                    }, 1000);
                }
            },
            error: function (error) {
                console.log(error); //错误信息提示
            }
        });
    }

    /**
     * 滚动加载
     */
    var scrollajax = {};
    scrollajax.isGetDate = true;
    var scrollboolen;
    $(window).scroll(function () {
        if (scrollboolen == 1) {
            if (uiIsPageBottom()) {
                if (scrollajax.isGetDate) {
                    scrollajax.isGetDate = false;
                    downloading("stocknewslist", "more");
                    requhygnnews(lastid);

                }
            }
        } else if (scrollboolen == 2) {
            if (uiIsPageBottom()) {
                if (scrollajax.isGetDate) {
                    scrollajax.isGetDate = false;
                    downloading("stocknewslist", "more");
                    requhygnggs(lastid);

                }
            }
        } else if (scrollboolen == 3) {
            if (uiIsPageBottom()) {
                if (scrollajax.isGetDate) {
                    scrollajax.isGetDate = false;
                    downloading("stocknewslist", "more");
                    requhygnhnews(lastid);

                }
            }
        }
    });

    // 描 述：判断是滚动到页面底部
    function uiIsPageBottom() {
        var ttheight = $("body").height() > $(document).height() ? $("body").height() : $(document).height();
        var scrollheight;
        var lazyloadcoe = 0.99;
        scrollheight = $(document).scrollTop() + $(window).height();
        if (parseInt(scrollheight) > parseInt(ttheight * lazyloadcoe)) {
            return true;
        } else {
            return false;
        }
    }


    /*标签切换*/
    $("#title_list").children("li").click(function () {
        var _this = $(this);
        var _index = $(this).index() + 1;
        if (_this.hasClass("currect")) {
            return false
        }
        addloading("bigbox");
        _this.addClass("currect").siblings("li").removeClass("currect");
        $(".tip_" + _index).siblings("div").hide();
        if (_index == 1) {
            requhygnlist();
            $(".tubiaobox").show();
            $(".btnbox").show();
            dingshishuaxin = setInterval(function () {
                requhygnlist();
            }, 20000);
            scrollajax.isGetDate = true;
            jishu = 21;
        } else if (_index == 2) {
            requhygnnews(0);
            $(".tubiaobox").hide();
            $(".btnbox").hide();
            clearInterval(dingshishuaxin);
            scrollboolen = 1;
            scrollajax.isGetDate = true;
            jishu = 21;
        } else if (_index == 3) {
            $(".tubiaobox").hide();
            $(".btnbox").hide();
            $(".tip_3").show(300);
            $("#f10list").find("iframe").attr("src", "http://192.168.1.22:7073/resource/f10html/" + codeid + "/CompanyProfiles.html");
            clearInterval(dingshishuaxin);
            scrollajax.isGetDate = true;
            jishu = 21;
            $.ajax({url: "http://192.168.1.22:7073/resource/f10json/11601579/CompanyProfiles.json",
                type:"post",
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback:"f10back",
                success: function (data) {
                    console.log(data);
                },
                error:function(data){
                    console.log(data);
                }
            })

        }

    });

    /*资讯二级标签切换*/
    $("#title_list_2").children("li").click(function () {
        var _index = $(this).index() + 1;
        var _this = $(this);
        if (_this.hasClass("currect")) {
            return false
        }
        addloading("bigbox");
        _this.addClass("currect").siblings("li").removeClass("currect");
        if (_index == 1) {
            requhygnnews(0);
            scrollboolen = 1;
            scrollajax.isGetDate = true;
            jishu = 21;
        } else if (_index == 2) {
            requhygnggs(0);
            scrollboolen = 2;
            scrollajax.isGetDate = true;
            jishu = 21;
        } else if (_index == 3) {
            requhygnhnews(0);
            scrollboolen = 3;
            scrollajax.isGetDate = true;
            jishu = 21;
        }
    });

    /*F10资料二级标签切换*/
    $("#title_list_3").children("li").click(function () {
        var _index = $(this).index() + 1;
        var _this = $(this);
        if (_this.hasClass("currect")) {
            return false
        }
        _this.addClass("currect").siblings("li").removeClass("currect");

        if (_index == 1) {
            $("#f10list").find("iframe").attr("src", "http://192.168.1.22:7073/resource/f10html/" + codeid + "/CompanyProfiles.html");
        } else if (_index == 2) {
            $("#f10list").find("iframe").attr("src", "http://192.168.1.22:7073/resource/f10html/" + codeid + "/CompanyFinancials.html");
        } else if (_index == 3) {
            $("#f10list").find("iframe").attr("src", "http://192.168.1.22:7073/resource/f10html/" + codeid + "/CompanyStockHolders.html");
        }

    });
    /**
     * cavas 尺寸计算
     * @type {*|jQuery}
     */
    function chicunbj() {
        var main_height = $(".main").height();
        var btnbox_height = $(".btnbox").height();
        var body_height = $(window).height();
        var canvasbox_height = body_height - btnbox_height - main_height;
        canvasbox_height = canvasbox_height > 302 ? canvasbox_height : 302;
        var num_height;
        num_height = (canvasbox_height - 55) / 3;
        $("#kline").css({
            "height": (num_height * 2).toFixed(0)
        });
        $("#fenshiinfo").css({
            "height": canvasbox_height.toFixed(0) - 2
        });
        $("#minute").css({
            "height": canvasbox_height.toFixed(0) - 2
        });
        $("#index").css({
            "height": num_height.toFixed(0)
        });
        $(".tubiaobox").css({
            "height": "auto"
        });
    }
});
