/**
 * Created by Administrator on 2014/10/20.
 */
$(document).ready(function () {
    /*未登录返回登录页面*/
    if (!window.isloginin) {
        window.location.href = "loginin.html";
    }
    var sessionid = JSON.parse(localStorage.getItem("userinfo_currect")).sessionid;
    var userid = JSON.parse(localStorage.getItem("userinfo_currect")).userid;

    var opts = {
        ak: config_other.ak_new,
        sid: sessionid,
        uid: userid,
        startnum: 1,
        limit: 20
    };
    var gal = new GalHttpRequest(config_url.myattentionlist, opts);
    gal.requestFromNet({
        succeed: function (data) {
            console.log(data);
            buju(data.result)
        },
        error: function () {

        }});

    /*渲染页面*/
    function buju(opt) {
        //如果数据为0出提示
        if(opt.length<1){
            $("#innerbox").append("<div style='margin-top: 50px'><img style='width: 22%' src='../images/no_network.png'><p>暂无关注</p></div>");
            return false;
        }
        $.each(opt, function (i, n) {
            if ($("#innerbox").length > 0) {
                //如果没有头像，用默认头像
                if (n.headPic == "") {
                    n.headPic = "../images/headerimgdemo.jpg";
                }
                $("#innerbox").append("<a href='javascript:void(0)'><div class='imgbox'><img src=" + n.headPic + " alt='头像'/></div><div class='infobox'><p class='info_name' userid=" + n.userId + ">" + n.nickName + "</p><p class='info_num'><span>总盈利率：</span><span class='profit'>" + n.profit + "</span></p></div><div class='heartbox' attention='on'><div class='heart'></div></div></a>");

                if (parseFloat(n.profit) >= 0) {
                    $("#innerbox").find("a:last").find(".profit").addClass("red")
                } else {
                    $("#innerbox").find("a:last").find(".profit").addClass("green")
                }
            }
        });

        //点击事件，弹出下载框
        $("#innerbox").find("a").on("click", function () {
            popup();
        });

        //点击事件，添加和取消关注
        $(".heartbox").on("click", function (e) {
            e.stopPropagation();
            var opts = {
                ak: config_other.ak_new,
                sid: sessionid,
                uid: userid,
                followId: $(this).siblings("div.infobox").find("p.info_name").attr("userid")
            };

            var _state = $(this).attr("attention");
            if (_state == "on") {
                removemyattention(opts);
                $(this).attr("attention","off");
                $(this).css("background","#a9acb1");
            } else if (_state == "off") {
                addmyattention(opts);
                $(this).attr("attention","on");
                $(this).css("background","#d62829");
            } else {
                return false;
            }

        });

        function addmyattention(opt) {
            var gal = new GalHttpRequest(config_url.addmyattention, opt);
            gal.requestFromNet({
                succeed: function (data) {
                },
                error: function () {

                }});
        }

        function removemyattention(opt) {
            var gal = new GalHttpRequest(config_url.removemyattention, opt);
            gal.requestFromNet({
                succeed: function (data) {
                },
                error: function () {

                }});
        }

    }
});


