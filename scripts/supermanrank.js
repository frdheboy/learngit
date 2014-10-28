$(document).ready(function () {
    $("#recommendlist").click(function () {
        window.location.href = "supmandetal_reco.html";
    });
    $("#feverlist").click(function () {
        window.location.href = "supmandetal_fever.html";
    });
    $("#gainttlist").click(function () {
        window.location.href = "supmandetal_gaintt.html";
    });
    $("#succlist").click(function () {
        window.location.href = "supmandetal_succ.html";
    });
    $("#monthgainlist").click(function () {
        window.location.href = "supmandetal_monthgain.html";
    });
    $("#weekgainlist").click(function () {
        window.location.href = "supmandetal_weekgain.html";
    });
    $("#supermanreports").click(function () {
        window.location.href = "supmandetal_report.html";
    });

    var opts = {
    };
    var gal = new GalHttpRequest(config_url.highest_rank, opts);
    gal.requestFromNet({
        succeed:function (data) {
            console.log(data);
            $("#gainttlist").find("strong").html(data.total);
            $("#succlist").find("strong").html(data.suc);
            $("#monthgainlist").find("strong").html(data.month);
            $("#weekgainlist").find("strong").html(data.week);
        },
        error:function (error) {
            console.log(error.message);//错误信息提示
            alert(error.message)
        }
    });


});

