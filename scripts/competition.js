/**
 * Created by Administrator on 2014/8/11.
 */

$(document).ready(function () {
    //标签页切换
    var tip_tt = $("#tapttbox");
    var tip_1 = $("#tap_1");
    var tip_2 = $("#tap_2");
    //比赛loading
    if ($("#tap_1")) {
        addloading("tap_1");
    }

    tip_tt.children("li:first").click(function () {
        addloading("tap_1");
        if ($(this).hasClass("currect")) {
            return false;
        }
        $(this).addClass("currect").siblings("li").removeClass("currect");
        tip_2.stop(false, true);
        tip_2.slideToggle(600);
        tip_1.slideToggle(800);
        jishu = 1;
        matchlazy(jishu);
        $("#tap_2").html("");

    });

    tip_tt.children("li:last").click(function () {
        addloading("tap_2");
        if ($(this).hasClass("currect")) {
            return false;
        }
        $(this).addClass("currect").siblings("li").removeClass("currect");
        tip_1.stop(false, true);
        tip_1.slideToggle(600);
        tip_2.slideToggle(800);
        if (window.isloginin) {
            jishu = 1;
            matchlazy(jishu,config_url.myMatch);
        } else {
            window.location.href = "loginin.html";
        }
        $("#tap_1").html("");
    });

    var matchimg = [];
    var matchname = [];
    var matchpersonnum = [];
    var matchopentime = [];
    var matchclosetime = [];
    var matchinfo = [];
    var matchid = [];
    var biaoshifu = true;


    //接口
    var jishu = 1;

    function matchlazy(pro,url) {
        var opts = {
            page: pro,
            num: 10
        };
        if(url==undefined)
        {
            url = config_url.allMatch
        }
        var gal = new GalHttpRequest(url, opts);
        gal.requestFromNet({
            succeed: function (data) {
                $("#loadinggif").remove();
                if (data.result.length < 1) {
                    $("#tap_2").append("<div id='erromess' style='margin-top: 50px;color: #d62829; font-size: 16px'><p>你没有参与比赛</p></div>'");
                    return false;
                }
                $.each(data.result, function (i, n) {
                    matchimg[i] = n.matchLogo;
                    matchname[i] = n.matchName;
                    matchpersonnum[i] = n.matchNum;
                    matchopentime[i] = n.openTime;
                    matchclosetime[i] = n.closeTime;
                    matchinfo[i] = n.matchDescp;
                    matchid[i] = n.matchId;
                    $("#tap_1").append(" <div class='competitionmainpage' id="+matchid[i]+"><img src=" + matchimg[i] + " alt='比赛LOGO图片'/><div><p><em>" + matchname[i] + "</em><span><b>" + matchpersonnum[i] + "</b>人</span></p><p><time>" + matchopentime[i] + "</time>至<time>" + matchclosetime[i] + "</time></p><p>" + matchinfo[i] + "</p></div></div>")
                });
                $(".competitionmainpage").unbind("click");
                $(".competitionmainpage").on("click",function(){
                    var canshu = $(this).attr("id");
                    window.location.href = "competitiondetail.html?id="+canshu;
                });
                if (pro != 1) {
                    biaoshifu = true;
                }
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
                alert(error.message)
            }
        });
    }

    matchlazy(jishu);
    lazyload(matchlazy, jishu);


    function lazyload(fn, opt) {
        $(window).scroll(function () {
            var ttheight = $("body").height() > $(document).height() ? $("body").height() : $(document).height();
            var scrollheight;
            var lazyloadcoe = 0.9;
            scrollheight = $(document).scrollTop() + $(window).height();
            if (parseInt(scrollheight) > parseInt(ttheight * lazyloadcoe)) {
                if (biaoshifu) {
                    biaoshifu = false;
                    jishu = jishu + 1;
                    fn(jishu);
                }
            }
        });
    }

});


