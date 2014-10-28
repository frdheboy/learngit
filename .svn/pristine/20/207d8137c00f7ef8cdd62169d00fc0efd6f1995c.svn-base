// JavaScript Document

$(document).ready(function() {
var id = location.search.substr(1);//获取id地址.location.search(设置或获取 网页地址跟在问号后面的部分,包括问号)substr:截取字符串，这里是从索引起1开始
var requsetschooltabs=new GalHttpRequest(config_url.modulearticlelist, {
			moduleId:id
		});
	requsetschooltabs.requestFromNet({
			succeed:function(data){
				var articleList=data.result.articleList;
				$('#title').text(data.result.module);
				console.log(data)
				$.each(articleList,function(i,n){
					$("#list1").append("<li data='"+n[0]+"'><a><span class='circle'></span><p></p><i><div class='i1'></div></i></a></li>");//创建一个li的属性data，
					$("#list1").find("li:eq("+(i+0)+")").find("p:eq(0)").text(n[1]);
					//$("#list1").find("li:eq("+(i+0)+")").find("i:eq(0)").text(n[2]);
				});	
				$("#list1 li").click(function(){//给li添加click事件
					window.location='schooldetail.html?'+$(this).attr('data')//window.location 获得当前页面的地址，attr(设置返回元素属性值)
				});

			},
			error:function(error){
					console.log(error)		
			}
		});
});


