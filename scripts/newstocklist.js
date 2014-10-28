/**
 * Created by Administrator on 2014/9/27.
 */
$(document).ready(function () {
    var Request = new GetQueryString();
    var codeid = Request.codeid;

    $("#newstockinfo").attr("src","http://quote.youguu.com/resource/newstockhtml/"+codeid+"/newstock.html")
});
