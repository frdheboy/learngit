/**
 * Created by Administrator on 2014/9/29.
 */
$(document).ready(function () {
    addloading("bigbox");
    var Request = new GetQueryString();
    var pageid = Request.codeid;
    var codename = UrlDecode(Request.codename);
    var category = UrlDecode(Request.category);

    /**
     * 修改面包屑
     */

    if($(".crumbs")){
        $(".crumbs").find("a:eq(2)").text(category);
    }

    if(category == "热门行业"){
        $(".crumbs").find("a:eq(2)").attr("href","marketindex.html?pageid=industrylist");
    }else if(category == "热门概念"){
        $(".crumbs").find("a:eq(2)").attr("href","marketindex.html?pageid=notionlist");
    }

    function requestinfo(opt) {
        var opts = {
            code:pageid,
            start:opt,
            reqnum:20,
            order:-1
        };
        var gal = new GalHttpRequest(config_url.hygnlist, opts);
        gal.requestPacketFromNet({
            succeed: function (data) {
                console.log(data);
                removeloading();
                if(opt ==1){
                    $(".crumbs").find("a:last").html(codename);
                    $("#title_list").append("<li>股票名称</li><li>最新价</li><li>涨跌幅<img src='../images/figure006.jpg'/></li>");
                }
                buju(data.stockquote);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    var jishu =1;
    requestinfo(jishu);

    function buju(data, opt) {
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
        $("#ul_list").find("li").unbind("click");
        $("#ul_list").find("li").on("click", function (event) {
            var _name = $(this).find("span[data-codeid]").attr("data-codeid");
            var _code = $(this).find("em[data-codename]").attr("data-codename");
            window.location.href = "stockinfo.html?codeid=" + _code + "&codename=" + _name.replace(/\s/g, "");
            event.stopPropagation();
        });
    }
    /**
     * 滚动加载
     */
    $(window).scroll(function(){
        if (uiIsPageBottom()) {
            jishu+=20;
            requestinfo(jishu);
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
        }else{
            return false;
        }
    }

});
