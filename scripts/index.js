/**
 * Created by Administrator on 2014/8/8.
 */
$(document).ready(function () {
    //首先判断用户是否登录
    if(window.isloginin){
        $("#indexinfo").show();
    }else{
        $("#logininenterimg").show();
    }
    //注册入口点击事件
    $("#logininenterimg").click(function(){
        window.location.href="loginin.html";
    });

   /* $.ajax({
        url:"http://220.181.47.36/quote/stocklist/home2?toString=1",
        success:function(data){
            console.log(data);
            var _data =  new Object(data);
            console.log(_data)
        }
    })*/
});
