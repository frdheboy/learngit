$(document).ready(function(e) {
            var g = new GalHttpRequest(config_url.schoolmoudules,{
					moduleIds:'1'
				});
				g.requestFromNet({//成功获取数据
				
						succeed:function(data){
							console.log(data);
							var result=  data.result[0];//得到总数据
							bindData(result)
						},
						error:function(error){
								
						}
					});
 });
    	
function bindData(result){
	var i,j;//定义变量
	for(i=0;i<result.childModules.length;i++){
			var parentdiv=$('<div/>',{});//创建一个父元素，{}里可以写各种样式
			parentdiv.appendTo(".m_content");
			var title=$('<p/>');
			var moudle=result.childModules[i];//得到标题的值
			title.text(moudle.name);
			title.appendTo(parentdiv);
			var itemsdiv=$('<div/>',{
				class:'mz' 
			});
			 itemsdiv.appendTo(parentdiv);  
		for(j=0;moudle.childModules&&j<moudle.childModules.length;j++){//创建下一级元素
			var childmodule = moudle.childModules[j];
			var item = $('<div/>',{
				class:'z1'	
			});
			item.appendTo(itemsdiv);
			var alink=$('<a/>',{
				href:'schooltabs.html?'+childmodule.id//给添加链接
			});
			alink.appendTo(item);
			var tdiv=$('<div/>',{
				class:'a1'
			})
			tdiv.css('background','url('+childmodule.logo+')');//添加样式
			tdiv.css({"background-repeat":"no-repeat","background-size":"100% auto"});
			tdiv.appendTo(alink);
			var itemname = $('<div/>',{
				class:'z3'	
			});
			itemname.appendTo(item);
			itemname.text(childmodule.name);
		}
	}							
}