/**
 * Created by Administrator on 2014/8/15.
 */
$(document).ready(function () {
    addloading("superman_big");
    var Request=new GetQueryString();
    var id = Request.id;
    function buju(opt) {
        var opts = {
            id: opt
        };
        var gal = new GalHttpRequest(config_url.articleAction, opts);
        gal.requestFromNet({
            succeed: function (data) {
                removeloading();
                console.log(data);
                $(".superman_big").append(data.result.content);
            },
            error: function (error) {
                console.log(error.message);//错误信息提示
                alert(error.message);
            }
        });
    }

    buju(id);
});

