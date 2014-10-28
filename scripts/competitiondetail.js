/**
 * Created by Administrator on 2014/8/18.
 */
$(document).ready(function(){
    addloading("superman_big");
    var Request=new GetQueryString();
    var id = Request.id;
    function buju(opt) {
        var opts = {
            matchid: opt
        };
        var gal = new GalHttpRequest(config_url.homeMatch, opts);
        gal.requestFromNet({
            succeed: function (data) {
                removeloading();
                $(".crumbs").find(".matchname").html(data.matchName);
                $(".focusimg").find("img").attr("src",data.background);
                $("#creator").html(data.creator);
                if(window.isloginin){
                    var stateinfo;
                    switch(data.state)
                    {
                        case "1":
                            stateinfo = "参与比赛";
                            break;
                        case "2":
                            stateinfo = "等待比赛开始";
                            break;
                        case "3":
                            stateinfo = "进入比赛";
                            break;
                        case "4":
                            stateinfo = "比赛结束";
                            break;
                        case "5":
                            stateinfo = "续费(百万，千万赛)";
                            break;
                        default:
                            stateinfo = "参与比赛";
                    }

                    $("#state").html(stateinfo);
                }else{
                    $("#state").html("参与比赛");
                }
                $("#matchDescp").html(data.matchDescp);
                $("#matchTime").html(data.matchTime);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    var _data_1;
    var _data_2;
    var _data_3;
    function paihang(opt) {
        var opts = {
            startid:1,
            mid: opt,
            reqnum:5
        };
        var gal = new GalHttpRequest(config_url.Matchtotal, opts);
        gal.requestFromNet({
            succeed: function (data) {
                _data_1 = data;
                paihangbuju(data);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
        var gal1 = new GalHttpRequest(config_url.Matchmonth, opts);
        gal1.requestFromNet({
            succeed: function (data) {
                _data_2 = data;
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
        var gal2 = new GalHttpRequest(config_url.Matchweek, opts);
        gal2.requestFromNet({
            succeed: function (data) {
                _data_3 = data;
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
            }
        });
    }

    function paihangbuju(opt){
        var name = [];
        var profitRate =[];
        var rank = [];
        $.each(opt.result, function (i, n) {
            name[i] = n.name;
            profitRate[i] = n.profitRate;
            rank[i] = n.rank;
            $(".paihang").find("li").eq(i+1).find("p").eq(0).html(rank[i]);
            $(".paihang").find("li").eq(i+1).find("p").eq(1).html(name[i]);
            $(".paihang").find("li").eq(i+1).find("p").eq(2).html(profitRate[i]);
        });
    }

    buju(id);
    paihang(id);


    var tip_tt = $(".tabtitle").find("div").eq(0);
    tip_tt.children("p:first").click(function () {
        if ($(this).hasClass("currect")) {
            return false;
        }
        $(this).addClass("currect").siblings("p").removeClass("currect");
        paihangbuju(_data_1);

    });

    tip_tt.children("p:eq(1)").click(function () {
        if ($(this).hasClass("currect")) {
            return false;
        }
        $(this).addClass("currect").siblings("p").removeClass("currect");
        paihangbuju(_data_2);

    });

    tip_tt.children("p:last").click(function () {
        if ($(this).hasClass("currect")) {
            return false;
        }
        $(this).addClass("currect").siblings("p").removeClass("currect");
        paihangbuju(_data_3);
    });
});
