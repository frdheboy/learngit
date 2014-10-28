/**
 * Created by Administrator on 2014/8/20.
 */
$(document).ready(function () {
    addloading("bigbox");
    var Request = new GetQueryString();
    var codeid = Request.codeid;
    var codename = UrlDecode(Request.codename);
    var _num = 1;
    var biaoshifu = true;
    function requhygnlist() {
        var opts = {
            code: codeid,
            start: _num,
            reqnum: 20,
            order: -1
        };
        var gal = new GalHttpRequest(config_url.hygnlist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                removeloading();
                $(".crumbs").find("a:last").html(codename);
                if($(".header_hq")){
                    $(".header_hq").find("span:first").text(codename);
                }
                console.log(data);
                buju_1(data.stockquote);
                if (_num != 1) {
                    biaoshifu = true;
                } else {
                    $("#title_list").append("<li>股票名称</li><li>最新价</li><li>涨跌幅<img src='../images/figure006.jpg'/></li>");
                }
                if (data.stockquote.length < 1) {
                    biaoshifu = false;
                }
                lazyload1(requhygnlist, _num);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    requhygnlist();

    function buju_1(data) {
        var dataper = [];
        var curprice = [];
        $.each(data, function (i, n) {
            curprice[i] = n.curprice.toFixed(2);
            if (n.dataper >= 0) {
                dataper[i] = "+" + n.dataper.toFixed(2) + "%";
                $("#ul_list").append("<li><p><span data-codeid="+n.name+">" + n.name + "</span><em data-codename="+n.code+">" + n.code.substr(2,6) + "</em></p><p class='red'>" + curprice[i] + "</p><p class='red'>" + dataper[i] + "</p></li>");
            } else {
                dataper[i] = n.dataper.toFixed(2) + "%";
                $("#ul_list").append("<li><p><span data-codeid="+n.name+">" + n.name + "</span><em data-codename="+n.code+">" + n.code.substr(2,6) + "</em></p><p class='green'>" + curprice[i] + "</p><p class='green'>" + dataper[i] + "</p></li>");
            }
        });
        $("#ul_list").find("li").on("click", function (event) {
            var _name = $(this).find("span[data-codeid]").attr("data-codeid");
            var _code = $(this).find("em[data-codename]").attr("data-codename");
            window.location.href="stockinfo.html?codeid="+_code+"&codename="+_name;
            event.stopPropagation();
        });
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
