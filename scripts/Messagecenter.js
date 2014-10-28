
if(window.localStorage){
	var userinfostr=localStorage.getItem('userinfo_currect');
	var userinfo=jQuery.parseJSON(userinfostr);
	var sessionid=userinfo.sessionid;
	var userid=userinfo.userid;

}else{
	throw new Error('没有localStorage值')
}
$(document).ready(function() {
    var obj={		
		fromid:0,
		reqnum:20		
	}
	
	var gl=new GalHttpRequest(config_url.noticecenter,obj);
	gl.requestFromNet({
		succeed:function(data){
			var resultlist=data.result;
			bindData(resultlist);
		},
		error:function(data){
		},
	
	})

});
function bindData(resultlist){
	var a=resultlist;
	for(var i=0;i<a.length;i++){
		var pre=$('.news1');
		var parentdiv=$('<div/>',{
			class:'news'	
		})
		parentdiv.appendTo(pre);
		var p=$('<p/>');
		p.text(a[i].title)
		p.appendTo(parentdiv);
		var tspan=$('<span/>');
		tspan.text(a[i].msg);
		tspan.appendTo(parentdiv);
		var tbin=$('<b/>');
		var alink=$('<a/>',{
			href:'',
			text:""
		})
		alink.appendTo(tbin);
		tbin.appendTo(parentdiv);	
	}	
}