/**
 * Created by Administrator on 2014/10/27.
 */
$(document).ready(function () {
    function mygoldrequest() {
        var opts = {
        };
        var gal = new GalHttpRequest(config_url.mytasklist, opts);
        gal.requestFromNet({
            succeed: function (data) {
                console.log(data);
                //总共金币数
                $(".gold_total").find("span").text(data.balanceNum);
            },
            error: function (data) {
                alert(data.message);
                console.log(data);
            }
        })
    }
    mygoldrequest();
});