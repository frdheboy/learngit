/**
 * Created by XA-0301031A on 2014/7/23.
 */
$(document).ready(function () {
	var personal = new PersonalStockList();
	var _sid = 0;
	var _time = 0;
	if (isloginin) {
		_sid = JSON.parse(localStorage.getItem("userinfo_currect")).sessionid;
	}

	var nowdate = new Date();

    //判断是否Storage是否真的可用
    var test = 'test';
    try {
        localStorage.setItem(test, '1');
        localStorage.removeItem(test);
        if (localStorage.getItem("serchtime")) {
            _time = localStorage.getItem("serchtime");
            localStorage.setItem("serchtime", _time);
        } else {
            localStorage.setItem("serchtime", nowdate.getTime());
        }
    } catch (e) {
        //使用cookie替代实现
        if ($.cookie("serchtime")) {
            _time = $.cookie("serchtime");
            $.cookie("serchtime", _time);
        } else {
            $.cookie("serchtime", nowdate.getTime());
        }
    }
    var opts = {
		ak: config_other.ak_new,
		sid: _sid,
		time: _time,
		type: "01,02,03,05"
	};


	var gal = new GalHttpRequest(config_url.stocklist, opts);
	gal.requestFromNet({
		succeed: function (data) {
			var adddata = new StockBaseInfoDB();
			adddata.add(data.result);
            /*adddata.getAllNum(function(a){
                alert('1111'+a);
            });*/
			$("input[name='search']").on("keyup", function () {
				$("#liulanjilu").children("div:eq(0)").siblings("div").remove();
				$(this).attr("maxlength", "6");
				adddata.search($(this).val(), indexedDBinquire, 15);
				$("#resultbox").children("div:visible").remove();
			});

			var indexedDBinquire = function (a) {
				addPersonalInfo(a);
				if (a.length < 1) {
					$("#resultbox").append("<div>没有找到相关股票</div>");
					return false;
				}
				var clonediv = $("#resultbox").find("div:first");
				$.each(a, function (i, n) {
					clonediv.clone(true).show().appendTo("#resultbox");
					i = i + 1;
					$("#resultbox").children("div:eq(" + i + ")").find("abbr").html(n.code.slice(2, 8));
					$("#resultbox").children("div:eq(" + i + ")").find("abbr").attr("data-codeid", n.code);
					$("#resultbox").children("div:eq(" + i + ")").find("dfn").html(n.name);

					if (n.ispersonal) {
						$("#resultbox").children("div:eq(" + i + ")").find("div").hide();
						$("#resultbox").children("div:eq(" + i + ")").append("<p>已加入自选</p>");
					}
				});


			};
			$(".searchli").on("click", function () {
				var stockcode = $(this).find("abbr").attr("data-codeid");
				var stockname = $(this).find("dfn").text();
				var searchstocklist = {};
				var searchlistarrya = [];

				/**
				 * 浏览记录写入localstorage
				 */
				if (localStorage.getItem("searchlist0")) {
					for (var i = 0; i < 6; i++) {
						searchlistarrya[i] = localStorage.getItem("searchlist" + i);
						if (searchlistarrya[i] == "undefined") {
							searchstocklist.code = stockcode;
							searchstocklist.name = stockname;
							searchlistarrya[i] = searchstocklist;
							localStorage.setItem("searchlist" + i, JSON.stringify(searchlistarrya[i]));
							break;
						}
						if (i == 5 && searchlistarrya[i] != "undefined") {
							for (var k = 0; k < 6; k++) {
								localStorage.setItem("searchlist" + k, localStorage.getItem("searchlist" + String(k + 1)));
								if (k == 5) {
									searchstocklist.code = stockcode;
									searchstocklist.name = stockname;
									searchlistarrya.push(searchstocklist);
									searchlistarrya.shift();
									localStorage.setItem("searchlist" + k, JSON.stringify(searchlistarrya[i]));
								}
							}
						}
					}
				} else {
					for (var j = 0; j < 6; j++) {
						localStorage.setItem("searchlist" + j, JSON.stringify(searchlistarrya[j]));
					}
					searchstocklist.code = stockcode;
					searchstocklist.name = stockname;
					searchlistarrya[0] = searchstocklist;
					localStorage.setItem("searchlist0", JSON.stringify(searchlistarrya[0]));
				}
				window.location.href = "stockinfo.html?codeid=" + stockcode + "&codename=" + stockname.replace(/\s/g, "");
			});

			$(".searchli").find("div").on("click", function (event) {
				var that = $(this);
				event.stopPropagation();
				zixuanguluru(that);
			});

		},
		error: function (error) {
			console.log(error); //错误信息提示
		}
	});

	/**
	 * 浏览记录页面渲染
	 */
	personal.queryPersonalStock(function () {
		sousuojilu();
	});


	function sousuojilu() {
		if (localStorage.getItem("searchlist0")) {
			if ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined) {
				jiluxuran();
			}
		}
	}

	function jiluxuran() {
		$("#resultbox").children("div:eq(0)").siblings("div").remove();
		var arryxuanran = [];

		for (var i = 0; i < 6; i++) {
			if (localStorage.getItem("searchlist" + i) != "undefined") {
				arryxuanran[i] = localStorage.getItem("searchlist" + i);
			}
		}
		var clonediv = $("#liulanjilu").find("div:first");
		for (var j = 0; j < arryxuanran.length; j++) {
			clonediv.clone(true).show().appendTo("#liulanjilu");
			var k = j + 2;
			var temp = JSON.parse(arryxuanran[j]);
			addPersonal(temp);
			console.log(temp);
			$("#liulanjilu").children("div:eq(" + k + ")").find("abbr").html(temp.code.slice(2, 8));
			$("#liulanjilu").children("div:eq(" + k + ")").find("abbr").attr("data-codeid", temp.code);
			$("#liulanjilu").children("div:eq(" + k + ")").find("dfn").html(temp.name);
			if (temp.ispersonal) {
				$("#liulanjilu").children("div:eq(" + k + ")").find("div").hide();
				$("#liulanjilu").children("div:eq(" + k + ")").append("<p>已加入自选</p>");
			}
		}


	}

	/**
	 * 绑定浏览记录click事件
	 */
	$(".jilulist").on("click", function () {
		var stockcode = $(this).find("abbr").attr("data-codeid");
		var stockname = $(this).find("dfn").text();
		window.location.href = "stockinfo.html?codeid=" + stockcode + "&codename=" + stockname.replace(/\s/g, "");
	});

	/**
	 * 绑定自选股事件
	 */
	$(".jilulist").find("div").on("click", function (event) {
		var that = $(this);
		event.stopPropagation();
		zixuanguluru(that);
	});


	function zixuanguluru(opt) {
		var _this = opt;
		var stockcode = _this.parent().find("abbr").attr("data-codeid");
		var stockname = _this.parent().find("dfn").text();
		personal.addStock(stockcode);

		_this.parent().append("<p>已加入自选</p>");
		_this.hide();
	}

	/**
	 * 增加自选股标记
	 * @param {Array} stocks 股票信息列表
	 */
	function addPersonalInfo(stocks) {
		var i;
		for (i = 0; i < stocks.length; i++) {
			stocks[i].ispersonal = (personal && personal.stockList.indexOf(stocks[i].code) >= 0);
		}
	}

	function addPersonal(stock) {
		stock.ispersonal = (personal && personal.stockList.indexOf(stock.code) >= 0);
	}
});
