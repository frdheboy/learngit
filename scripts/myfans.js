/**
 * Created by Administrator on 2014/10/25.
 */
$(document).ready(function () {
    /*未登录返回登录页面*/
    if (!window.isloginin) {
        window.location.href = "loginin.html";
    }
    var sessionid = JSON.parse(localStorage.getItem("userinfo_currect")).sessionid;
    var userid = JSON.parse(localStorage.getItem("userinfo_currect")).userid;
    var _num = 1;
    var biaoshifu = true;

    function _request(opt) {
        var opts = {
            ak: config_other.ak_new,
            sid: sessionid,
            uid: userid,
            start: opt,
            end: 20
        };
        var gal = new GalHttpRequest(config_url.myfanslist, opts);
        gal.requestFromNet({
            succeed: function (data) {
                console.log(data);
                buju(data.result)
            },
            error: function () {

            }});
        if (_num != 1) {
            biaoshifu = true;
        }
        lazyload1(_request,_num,opt);
    }

    /*渲染页面*/
    function buju(opt) {
        //如果数据为0出提示
        if (opt.length < 1) {
            $("#innerbox").append("<div style='margin-top: 50px'><img style='width: 22%' src='../images/no_network.png'><p>暂无粉丝</p></div>");
            return false;
        }

        $.each(opt, function (i, n) {
            if ($("#innerbox").length > 0) {
                //如果没有头像，用默认头像
                if (n.headPic == "") {
                    n.headPic = "../images/headerimgdemo.jpg";
                }
                $("#innerbox").append("<a href='javascript:void(0)'><div class='imgbox'><img src=" + n.headPic + " alt='头像'/></div><div class='infobox'><p class='info_name' userid=" + n.userId + ">" + n.nickName + "</p><p class='info_num'><span>总盈利率：</span><span class='profit'>" + n.profit + "</span></p></div></a>");

                if (parseFloat(n.profit) >= 0) {
                    $("#innerbox").find("a:last").find(".profit").addClass("red")
                } else {
                    $("#innerbox").find("a:last").find(".profit").addClass("green")
                }
            }
        });
    }
    _request(_num);

    //lazyloading
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


