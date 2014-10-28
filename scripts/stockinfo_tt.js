/**
 * Created by Administrator on 2014/8/20.
 */
$(document).ready(function () {
	addloading("bigbox");
	var Request = new GetQueryString();
	var codeid = Request.codeid;
	var codename = UrlDecode(Request.codename);
	var personalStock = new PersonalStockList();
	var isPersonalStock = false;
	personalStock.queryPersonalStock(function (stockcodes) {
		isPersonalStock = stockcodes.indexOf(codeid) >= 0;
		$('#addstock a').text(isPersonalStock ? '删除自选' : '添加自选');
	});
	$('#addstock').click(function () {
		if (isPersonalStock) {
			personalStock.removeStock(codeid, function () {
				isPersonalStock = false;
				$('#addstock a').text('添加自选');
			});
		} else {
			personalStock.addStock(codeid, function () {
				isPersonalStock = true;
				$('#addstock a').text('删除自选');
			});
		}
	});

	function requhygnlist(opt) {
		var opts = {
			code: codeid
		};
		var gal = new GalHttpRequest(config_url.socketinfo, opts);
		gal.requestPacketFromNet({
			succeed: function (data) {
				removeloading();
				$(".tip_1").show();
				$(".crumbs").find("a:last").html(codename + "(" + codeid.substr(2, 8) + ")");
				var _data = data.curstatus[0];
				$("#para1").find("em").html(_data.curprice.toFixed(2));
				if (_data.change >= 0) {
					$("#para1").find("span:eq(0)").html("+" + _data.change.toFixed(2));
					$("#para1").find("span:eq(1)").html("+" + _data.changeper.toFixed(2) + "%");
				} else {
					$("#para1").find("em").css({
						"color": "#168816"
					});
					$("#para1").find("span:eq(0)").html(_data.change.toFixed(2));
					$("#para1").find("span:eq(1)").html(_data.changeper.toFixed(2) + "%");
					$("#para1").find("span:eq(0)").css({
						"color": "#168816"
					});
					$("#para1").find("span:eq(1)").css({
						"color": "#168816"
					});
				}

				$("#para2").find("em:eq(0)").html(_data.openprice.toFixed(2));
				var chengjiaoliang;
				if (_data.totalamount > 1000 * 10000 * 10000) {
					chengjiaoliang = (_data.totalamount / 100000000000).toFixed(2) + "千亿手";
				} else if (_data.totalamount > 100 * 10000 * 10000) {
					chengjiaoliang = (_data.totalamount / 100000000).toFixed(1) + "亿手";
				} else if (_data.totalamount > 10 * 10000 * 10000) {
					chengjiaoliang = (_data.totalamount / 100000000).toFixed(2) + "亿手";
				} else if (_data.totalamount > 10000 * 10000) {
					chengjiaoliang = (_data.totalamount / 100000000).toFixed(2) + "亿手";
				} else if (_data.totalamount > 10000) {
					chengjiaoliang = (_data.totalamount / 10000).toFixed(1) + "万手";
				} else {
					chengjiaoliang = _data.totalamount.toFixed(0) + "手";
				}
				$("#para2").find("em:eq(1)").html(chengjiaoliang);
				$("#para2").find("em:eq(2)").html(_data.highprice.toFixed(2));
				var chengjiaoe;
				if (_data.totalmoney > 1000 * 10000 * 10000) {
					chengjiaoe = (_data.totalmoney / 100000000000).toFixed(2) + "千亿";
				} else if (_data.totalmoney > 100 * 10000 * 10000) {
					chengjiaoe = (_data.totalmoney / 100000000).toFixed(1) + "亿";
				} else if (_data.totalmoney > 10 * 10000 * 10000) {
					chengjiaoe = (_data.totalmoney / 100000000).toFixed(2) + "亿";
				} else if (_data.totalmoney > 10000 * 10000) {
					chengjiaoe = (_data.totalmoney / 100000000).toFixed(2) + "亿";
				} else if (_data.totalmoney > 10000) {
					chengjiaoe = (_data.totalmoney / 10000).toFixed(1) + "万";
				} else {
					chengjiaoe = _data.totalmoney.toFixed(0);
				}
				$("#para2").find("em:eq(3)").html(chengjiaoe);
				$("#para2").find("em:eq(4)").html(_data.lowprice.toFixed(2));
				$("#para2").find("em:eq(5)").html(_data.closeprice.toFixed(2));



				/**
				 * 取完数据渲染完页面之后再取图表的高度，否则高度计算不准确
				 */
				chicunbj();
				if (opt == true) {
					initKline();
				}
			},
			error: function (error) {
				console.log(error); //错误信息提示
			}
		});
	}


	/**
	 * 大盘指数右侧详细数据
	 */

	function requestbgginfo() {
		var fenshitt1 = $("#fenshiinfo").find("table:eq(0)");
		var fenshitt2 = $("#fenshiinfo").find("table:eq(1)");
		var fenshitt3 = $("#fenshiinfo").find("table:eq(2)");
		var opts0 = {
			codes: codeid + ",20399001,20399006,20399005,20399300,10000010,20399106",
			ak: config_other.ak_new,
			sid: "0"
		};
		var gal0 = new GalHttpRequest(config_url.querycurstatusesbyte, opts0);
		gal0.requestFromNet({
			succeed: function (data) {
				fenshitt1.find("tr:eq(0)").find("td:eq(1)").html(parseFloat(data.result[0].amountScale).toFixed(1));
				fenshitt1.find("tr:eq(1)").find("td:eq(1)").html(data.result[0].zfPercent + "%");

				fenshitt2.find("tr:eq(0)").find("td:eq(1)").html(parseInt(data.result[0].buyPrice));
				fenshitt2.find("tr:eq(0)").find("td:eq(1)").css({
					"color": "#E74D29"
				});
				fenshitt2.find("tr:eq(1)").find("td:eq(1)").html(parseInt(data.result[0].revenue));
				fenshitt2.find("tr:eq(2)").find("td:eq(1)").html(parseInt(data.result[0].sellPrice));
				fenshitt2.find("tr:eq(2)").find("td:eq(1)").css({
					"color": "#26A15A"
				});

				fenshitt3.find("tr:eq(0)").find("td:eq(1)").html(data.result[1].curPrice);
				if (data.result[1].change >= 0) {
					fenshitt3.find("tr:eq(0)").find("td:eq(1)").css({
						"color": "#E74D29"
					});
				} else {
					fenshitt3.find("tr:eq(0)").find("td:eq(1)").css({
						"color": "#26A15A"
					});
				}

				fenshitt3.find("tr:eq(1)").find("td:eq(1)").html(data.result[2].curPrice);
				if (data.result[2].change >= 0) {
					fenshitt3.find("tr:eq(1)").find("td:eq(1)").css({
						"color": "#E74D29"
					});
				} else {
					fenshitt3.find("tr:eq(1)").find("td:eq(1)").css({
						"color": "#26A15A"
					});
				}

				fenshitt3.find("tr:eq(2)").find("td:eq(1)").html(data.result[3].curPrice);
				if (data.result[3].change >= 0) {
					fenshitt3.find("tr:eq(2)").find("td:eq(1)").css({
						"color": "#E74D29"
					});
				} else {
					fenshitt3.find("tr:eq(2)").find("td:eq(1)").css({
						"color": "#26A15A"
					});
				}

				fenshitt3.find("tr:eq(3)").find("td:eq(1)").html(data.result[4].curPrice);
				if (data.result[4].change >= 0) {
					fenshitt3.find("tr:eq(3)").find("td:eq(1)").css({
						"color": "#E74D29"
					});
				} else {
					fenshitt3.find("tr:eq(3)").find("td:eq(1)").css({
						"color": "#26A15A"
					});
				}

				fenshitt3.find("tr:eq(4)").find("td:eq(1)").html(data.result[5].curPrice);
				if (data.result[5].change >= 0) {
					fenshitt3.find("tr:eq(4)").find("td:eq(1)").css({
						"color": "#E74D29"
					});
				} else {
					fenshitt3.find("tr:eq(4)").find("td:eq(1)").css({
						"color": "#26A15A"
					});
				}

				fenshitt3.find("tr:eq(5)").find("td:eq(1)").html(data.result[6].curPrice);
				if (data.result[6].change >= 0) {
					fenshitt3.find("tr:eq(5)").find("td:eq(1)").css({
						"color": "#E74D29"
					});
				} else {
					fenshitt3.find("tr:eq(5)").find("td:eq(1)").css({
						"color": "#26A15A"
					});
				}


			},
			error: function (error) {
				console.log(error); //错误信息提示
			}
		});
	}

	requestbgginfo();

	requhygnlist(true);

	function requhygnnews(opt) {
		if (opt == 0) {
			$("#stocknewslist").html("");
		}

		var opts = {
			code: codeid,
			fromid: opt,
			limit: 20
		};
		var gal = new GalHttpRequest(config_url.stock_newslist, opts);
		gal.requestFromNet({
			succeed: function (data) {
				removeloading();
                removedownloading();
				if (opt == 0) {
					$(".tip_2").show(200);
					if (data.result.length < 1) {
						$("#stocknewslist").html("<p style='margin-top: 50px'><img src='../images/no_network.png'/></p><p style='margin-top: 5px'>暂无数据</p>");
						return false;
					}
				}

                if(data.result.length<1){
                    downloading("ul_list","no");
                    setTimeout(function () {
                        removedownloading();
                    },1000);
                }
				$.each(data.result, function (i, n) {
					var _time;
					var d = new Date();
					d.setTime(n.pubtime);
					var _year = d.getFullYear();
					var newyear = new Date();

					var _day = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
					var _hours = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
					var _min = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
					var _month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
					if (newyear.getFullYear() == _year) {
						_time = _month + "月" + _day + "日&nbsp;&nbsp;" + _hours + ":" + _min;
					} else {
						_time = _year + "年" + _month + "月" + _day + "日&nbsp;&nbsp;" + _hours + ":" + _min;
					}
					$("#stocknewslist").append("<li><a href='" + n.url + "'><p>" + stringintercept(n.title, 60, "...") + "<span>" + _time + "</span></p></a></li>");
				});

				/**
				 * 外部地址放在iframe里面
				 */
				$("#stocknewslist").find("a").on("click", function (event) {
					event.stopPropagation();
					var address = $(this).attr("href");
					window.location.href = "stockstatus.html?address=" + address;
					return false;
				});

				if (opt != 0) {
					scrollajax.isGetDate = true;
					jishu += 20;
				}

				if (data.result.length > 0) {
					lastid = data.result[data.result.length - 1].id;
				} else {
					//=1的时候到的值个数为0
					lastid = 1;
				}
			},
			error: function (error) {
				console.log(error); //错误信息提示
			}
		});
	}


	function requhygnggs(opt) {
		$("#stocknewslist").html("");
		var opts = {
			code: codeid,
			fromid: opt,
			limit: 20
		};
		var gal = new GalHttpRequest(config_url.stock_gglist, opts);
		gal.requestFromNet({
			succeed: function (data) {
				removeloading();
				$(".tip_2").show(200);
				if (data.result.length < 1) {
					$("#stocknewslist").html("<p style='margin-top: 50px'><img src='../images/no_network.png'/></p><p style='margin-top: 5px'>暂无数据</p>");
					return false;
				}
				$.each(data.result, function (i, n) {
					var _time;
					var d = new Date();
					d.setTime(n.pubtime);
					var _day = d.getDay() >= 10 ? d.getDay() : '0' + d.getDay();
					var _hours = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
					var _min = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
					_time = d.getMonth() + "月" + _day + "日";
					$("#stocknewslist").append("<li><a href='" + n.url + "'><p>" + stringintercept(n.title, 60, "...") + "<span>" + _time + "</span></p></a></li>");
				});
			},
			error: function (error) {
				console.log(error); //错误信息提示
			}
		});
	}

	function requhygnhnews(opt) {
		$("#stocknewslist").html("");
		var opts = {
			code: codeid,
			fromid: opt,
			limit: 20
		};
		var gal = new GalHttpRequest(config_url.stock_hnewslist, opts);
		gal.requestFromNet({
			succeed: function (data) {
				removeloading();
				$(".tip_2").show(200);
				if (data.result.length < 1) {
					$("#stocknewslist").html("<p style='margin-top: 50px'><img src='../images/no_network.png'/></p><p style='margin-top: 5px'>暂无数据</p>");
					return false;
				}
				$.each(data.result, function (i, n) {
					var _time;
					var d = new Date();
					d.setTime(n.pubtime);
					var _day = d.getDay() >= 10 ? d.getDay() : '0' + d.getDay();
					var _hours = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
					var _min = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
					_time = d.getMonth() + "月" + _day + "日&nbsp;&nbsp;" + _hours + ":" + _min;
					$("#stocknewslist").append("<li><a href='" + n.url + "'><p>" + stringintercept(n.title, 60, "...") + "<span>" + _time + "</span></p></a></li>");
				});
			},
			error: function (error) {
				console.log(error); //错误信息提示
			}
		});
	}

	/*标签切换*/
	var dingshishuaxin = setInterval(function () {
		requhygnlist(false);
	}, 10000);

	$("#title_list").children("li").click(function () {
		var _this = $(this);
		var _index = $(this).index() + 1;
		if (_this.hasClass("currect")) {
			return false
		}
		addloading("bigbox");
		_this.addClass("currect").siblings("li").removeClass("currect");
		$(".tip_" + _index).siblings("div").hide();
		if (_index == 1) {
			requhygnlist();
			$(".tubiaobox").show();
			$(".btnbox").show();
			dingshishuaxin = setInterval(function () {
				requhygnlist();
			}, 20000);
			jishu = 21;
		} else if (_index == 2) {
			requhygnnews(0);
			$(".tubiaobox").hide();
			$(".btnbox").hide();
			clearInterval(dingshishuaxin);
			scrollboolen = 1;
			jishu = 21;
		}
	});


	/**
	 * 滚动加载
	 */
	var scrollajax = {};
	var lastid;
	scrollajax.isGetDate = true;
	var scrollboolen;
	$(window).scroll(function () {
		if (scrollboolen == 1) {
			if (uiIsPageBottom()) {
				if (scrollajax.isGetDate) {
					scrollajax.isGetDate = false;
					requhygnnews(lastid);
                    downloading("stocknewslist","more");
				}
			}
		} else if (scrollboolen == 2) {
			if (uiIsPageBottom()) {
				if (scrollajax.isGetDate) {
					scrollajax.isGetDate = false;
					requhygnggs(lastid);
                    downloading("stocknewslist","more");
				}
			}
		} else if (scrollboolen == 3) {
			if (uiIsPageBottom()) {
				if (scrollajax.isGetDate) {
					scrollajax.isGetDate = false;
					requhygnhnews(lastid);
                    downloading("stocknewslist","more");
				}
			}
		}
	});

	// 描 述：判断是滚动到页面底部
	function uiIsPageBottom() {
		var ttheight = $("body").height() > $(document).height() ? $("body").height() : $(document).height();
		var scrollheight;
		var lazyloadcoe = 0.99;
		scrollheight = $(document).scrollTop() + $(window).height();
		if (parseInt(scrollheight) > parseInt(ttheight * lazyloadcoe)) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * cavas 尺寸计算
	 * @type {*|jQuery}
	 */
	//    setTimeout(chicunbj,800);

	function chicunbj() {
		var main_height = $(".main").height();
		var btnbox_height = $(".btnbox").height();
		var body_height = $(window).height();
		var canvasbox_height = body_height - btnbox_height - main_height;
		canvasbox_height = canvasbox_height > 302 ? canvasbox_height : 302;
		var num_height;
		num_height = (canvasbox_height - 55) / 3;
		$("#kline").css({
			"height": (num_height * 2).toFixed(0)
		});
		$("#fenshiinfo").css({
			"height": canvasbox_height.toFixed(0) - 2
		});
		$("#minute").css({
			"height": canvasbox_height.toFixed(0) - 2
		});
		$("#index").css({
			"height": num_height.toFixed(0)
		});
		$(".tubiaobox").css({
			"height": "auto"
		});
	}
});