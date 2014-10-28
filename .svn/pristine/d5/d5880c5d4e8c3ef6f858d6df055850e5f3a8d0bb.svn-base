function initKline() {
	var Request = new GetQueryString();
	var codeid = Request.codeid;
	var minute = new Minute('minute', codeid);
	minute.setDefualtTouchback();
	var operator;

	$(".tubiaotipbox").find("li").on("click", function () {
		var _index = $(this).index();
		if ($(this).hasClass("currect")) {
			return false
		} else {
			$(this).addClass("currect").siblings("li").removeClass("currect");
		}

		if (_index == "1") {
			$("#fenshitu").hide();
			$("#kxiantu").show();
			$("#fenshiinfo").hide();
			$(".tubiaotipbox ul").css({
				"background": "#78b7e2"
			});
			console.log(operator);
			if (operator) {
				operator.setKLineType('D');
			} else {
				operator = new KLineOperator(codeid, 'kline', 'date', 'index', null, 'D');
				operator.setDefualtTouchback();
			}
		} else if (_index == "2") {
			$("#fenshitu").hide();
			$("#kxiantu").show();
			$("#fenshiinfo").hide();
			$(".tubiaotipbox ul").css({
				"background": "#78b7e2"
			});
			if (operator) {
				operator.setKLineType('W');
			} else {
				operator = new KLineOperator(codeid, 'kline', 'date', 'index', null, 'W');
				operator.setDefualtTouchback();
			}
		} else if (_index == "3") {
			$("#fenshitu").hide();
			$("#kxiantu").show();
			$("#fenshiinfo").hide();
			if (operator) {
				operator.setKLineType('M');
			} else {
				operator = new KLineOperator(codeid, 'kline', 'date', 'index', null, 'M');
				operator.setDefualtTouchback();
			}
			$(".tubiaotipbox ul").css({
				"background": "#4d8cbb"
			});
		} else if (_index == "0") {
			$("#fenshitu").show();
			$("#kxiantu").hide();
			$("#fenshiinfo").show();
			$(".tubiaotipbox ul").css({
				"background": "#78b7e2"
			});
		}
	});
	$('#tab').find('li').on('click', function () {
		if ($(this).hasClass('setion')) {
			return;
		}
		$(this).addClass('setion').siblings("li").removeClass('setion');
		operator.assistTo($(this).attr('id'));
	});
}
