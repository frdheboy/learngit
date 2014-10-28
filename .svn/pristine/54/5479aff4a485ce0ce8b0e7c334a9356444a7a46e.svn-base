var svgns = "http://www.w3.org/2000/svg";

function KLineSvg(id) {
	this.svg = document.getElementById(id);
	this.width = this.svg.offsetWidth;
	this.height = this.svg.offsetHeight;
	var me = this;
	this.svg.addEventListener("touchstart", function(event) {
		me.ontouchstart(event);
	}, false);
	this.svg.addEventListener("touchmove", function(event) {
		me.ontouchmove(event);
	}, false);
	this.svg.addEventListener("touchend", function(event) {
		me.ontouchend(event);
	}, false);
};

KLineSvg.prototype.setDatas = function(datas) {
	this.datas = datas;
	this.startIndex = 20;
	this.totalNum = 70;
	this.caculateavg();
	this.calculate();
	this.draw();
};

KLineSvg.prototype.calculate = function() {
	this.getextremum();
	this.per_height = this.height / (this.max - this.min);
	this.per_width = this.width / this.totalNum;
	this.translatePoints();
};

KLineSvg.prototype.translatePoints = function() {
	this.pointLists = [];
	for (var i = 0; i < Math.min(this.totalNum, this.datas.length - this.startIndex); i++) {
		var data = this.datas[this.startIndex + i];
		var point = {
			x : this.per_width * (i + 0.5),
			y_open : this.getPostionByValue(data.open),
			y_close : this.getPostionByValue(data.close),
			y_high : this.getPostionByValue(data.high),
			y_low : this.getPostionByValue(data.low),
			y_avg5 : this.getPostionByValue(data.avg_5),
			y_avg10 : this.getPostionByValue(data.avg_10),
			y_avg20 : this.getPostionByValue(data.avg_20),
		};
		this.pointLists.push(point);
	}
};

KLineSvg.prototype.getextremum = function() {
	var max, min;
	for (var i = this.startIndex; i < Math.min(this.startIndex + this.totalNum, this.datas.length); i++) {
		var data = this.datas[i];
		if (i == this.startIndex) {
			max = data.high;
			min = data.low;
		} else {
			max = Math.max(max, data.high);
			min = Math.min(min, data.low);
		}
	}
	if (Math.abs(max - min) < 0.001) {
		max = max * 1.1;
		min = min * 0.9;
	}
	this.max = max;
	this.min = min;
};

KLineSvg.prototype.getPostionByValue = function(value) {
	if (value == null) {
		return null;
	}
	return (this.max - value) * this.per_height;
};

KLineSvg.prototype.caculateavg = function() {
	//endDate,open,high,low,close,amount,money
	var temp_data = [];
	//计算均值
	var temp_total_avg_5 = 0;
	var temp_total_avg_10 = 0;
	var temp_total_avg_20 = 0;

	for (var i = 0; i < this.datas.length; i++) {
		var item = this.datas[i];
		temp_total_avg_5 += item.close;
		temp_total_avg_10 += item.close;
		temp_total_avg_20 += item.close;

		if (i > 3) {
			item.avg_5 = (temp_total_avg_5 / 5).toFixed(2);
			temp_total_avg_5 -= this.datas[i - 4].close;
		} else {
			item.avg_5 = null;
		}

		if (i > 8) {
			item.avg_10 = (temp_total_avg_10 / 10).toFixed(2);
			temp_total_avg_10 -= this.datas[i - 9].close;
		} else {
			item.avg_10 = null;
		}

		if (i > 18) {
			item.avg_20 = (temp_total_avg_20 / 20).toFixed(2);
			temp_total_avg_20 -= this.datas[i - 19].close;
		} else {
			item.avg_20 = null;
		}
		temp_data.push(item);
	}
	this.datas = temp_data;
};

KLineSvg.prototype.draw = function() {
	var starttime = new Date();
	var line_avg5 = "", line_avg10 = "", line_avg20 = "";
	for (var i = 0; i < this.pointLists.length; i++) {
		var point = this.pointLists[i];
		if (point.y_avg5 != null) {
			line_avg5 += (point.x + " " + point.y_avg5 + " ");
		}
		if (point.y_avg10 != null) {
			line_avg10 += (point.x + " " + point.y_avg10 + " ");
		}
		if (point.y_avg20 != null) {
			line_avg20 += (point.x + " " + point.y_avg20 + " ");
		}
		this.addCandle(point.x, point.y_high, point.y_low, point.y_open, point.y_close, this.getColor(i));
	};
	this.addAVGLine("avg5", line_avg5, "#00ace5");
	this.addAVGLine("avg10", line_avg10, "#cd8e06");
	this.addAVGLine("avg20", line_avg20, "#c32ec3");
	var endtime = new Date();
	console.log("绘制耗时：" + (endtime - starttime));
};

KLineSvg.prototype.clear = function() {
	var childs = this.svg.childNodes;
	for (var i = childs.length - 1; i >= 0; i--) {
		this.svg.removeChild(childs[i]);
	}
};

KLineSvg.prototype.getColor = function(i) {
	var data = this.datas[i], lastdata = this.datas[i - 1];
	var color = "#45b66e";
	if (data.close < data.open) {
		color = "#45b66e";
	} else if (data.close > data.open) {
		color = "#e43006";
	} else {
		if (!lastdata && data.open > lastdata.close) {
			color = "#e43006";
		} else {
			color = "#45b66e";
		}
	}
	return color;
};

KLineSvg.prototype.addCandle = function(x, y_high, y_low, y_open, y_close, color) {
	this.addLine(null, x, x, y_high, y_low, color);
	this.addLine(null, x, x, y_open, y_close, color, "bold");
};

KLineSvg.prototype.addLine = function(id, x1, x2, y1, y2, color, type) {
	var line = document.createElementNS(svgns, "line");
	if (id) {
		line.setAttribute("id", id);
	}
	line.setAttribute("x1", x1);
	line.setAttribute("x2", x2);
	line.setAttribute("y1", y1);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", color);
	line.setAttribute("fill", "transparent");
	if (type && type == "bold") {
		line.setAttribute("stroke-width", this.per_width * 0.75);
	} else {
		line.setAttribute("stroke-width", "1");
	}
	this.svg.appendChild(line);
	return line;
};

KLineSvg.prototype.addAVGLine = function(id, lineData, color) {
	var polyline = document.createElementNS(svgns, 'polyline');
	polyline.setAttribute("id", id);
	polyline.setAttribute("points", lineData.trim());
	polyline.setAttribute("stroke", color || "transparent");
	polyline.setAttribute("fill", "transparent");
	polyline.setAttribute("stroke-width", "1");
	this.svg.appendChild(polyline);
};

KLineSvg.prototype.move = function(x) {
	if (!this.last_x) {
		this.last_x = x;
		return;
	}
	var moveNums = Math.round((x - this.last_x) / this.per_width);
	console.log("MoveNums:" + moveNums);
	if (moveNums != 0) {
		if (this.timeoutProcess) {
			clearTimeout(this.timeoutProcess);
		}
		this.movetype = "move";
		this.startIndex = (+this.startIndex - parseInt(moveNums));
		this.startIndex = Math.max(0, this.startIndex);
		this.calculate();
		this.clear();
		this.draw();
	}
	this.last_x = x;
};

KLineSvg.prototype.show = function(x) {
	this.movetype = "show";
	var cross_x = this.svg.getElementById("cross_x");
	var cross_y = this.svg.getElementById("cross_y");
	if (!cross_x) {
		cross_x = this.addLine("cross_x", 0, 0, 0, 0, "black");
	}
	if (!cross_y) {
		cross_y = this.addLine("cross_y", 0, 0, 0, 0, "black");
	}
	var touchPointIndex = Math.round((x / this.per_width - 0.5));
	touchPointIndex = Math.min(touchPointIndex, this.pointLists.length - 1);
	var touchPoint = this.pointLists[touchPointIndex];
	var x = touchPoint.x;
	var y = touchPoint.y_open;
	cross_x.setAttribute("x1", x);
	cross_x.setAttribute("x2", x);
	cross_x.setAttribute("y2", this.height);

	cross_y.setAttribute("x2", this.width);
	cross_y.setAttribute("y1", y);
	cross_y.setAttribute("y2", y);
};

KLineSvg.prototype.ontouchstart = function(event) {
	event.preventDefault();
	if (!event.touches.length)
		return;
	var touch = event.touches[0];
	var x = touch.pageX;
	this.last_x = x;
	var me = this;
	this.timeoutProcess = setTimeout(function() {
		me.show(x);
	}, 500);
};

KLineSvg.prototype.ontouchmove = function(event) {
	event.preventDefault();
	if (!event.touches.length)
		return;
	var touch = event.touches[0];
	var x = touch.pageX;
	if (this.movetype && this.movetype == "show") {
		this.show(x);
	} else {
		this.move(x);
	}
};

KLineSvg.prototype.ontouchend = function(event) {
	event.preventDefault();
	this.last_x = null;
	var cross_x = this.svg.getElementById("cross_x");
	if (cross_x) {
		cross_x.remove();
	}
	var cross_y = this.svg.getElementById("cross_y");
	if (cross_y) {
		cross_y.remove();
	}
	this.movetype = "move";
};

function MACDSvg(id) {
	this.svg = document.getElementById(id);
	this.width = this.svg.offsetWidth;
	this.height = this.svg.offsetHeight;
};

MACDSvg.prototype.setDatas = function(datas) {
	this.datas = datas;
	this.startIndex = 20;
	this.totalNum = 140;
	this.calculate();
	this.draw();
};

MACDSvg.prototype.calculate = function() {
	this.getextremum();
	this.per_height = this.height / (this.max - this.min);
	this.per_width = this.width / this.totalNum;
	this.translatePoints();
};

MACDSvg.prototype.getextremum = function() {
	var max;
	for (var i = this.startIndex; i < Math.min(this.startIndex + this.totalNum, this.datas.length); i++) {
		var data = this.datas[i];
		var temp_max = Math.max(Math.max(Math.abs(data.dif), Math.abs(data.dea)), Math.abs(data.macd));
		if (i == this.startIndex) {
			max = temp_max;
		} else {
			max = Math.max(max, temp_max);
		}
	}
	this.max = max;
	this.min = -max;
};

MACDSvg.prototype.translatePoints = function() {
	this.pointLists = [];
	for (var i = 0; i < Math.min(this.totalNum, this.datas.length - this.startIndex); i++) {
		var data = this.datas[this.startIndex + i];
		var point = {
			x : this.per_width * (i + 0.5),
			y_dif : this.getPostionByValue(data.dif),
			y_dea : this.getPostionByValue(data.dea),
			y_macd : this.getPostionByValue(data.macd),
		};
		this.pointLists.push(point);
	}
};

MACDSvg.prototype.getPostionByValue = function(value) {
	if (value == null) {
		return null;
	}
	return (this.max - value) * this.per_height;
};

MACDSvg.prototype.draw = function() {
	var line_dif = "", line_dea = "";
	for (var i = 0; i < this.pointLists.length; i++) {
		var point = this.pointLists[i];
		if (point.y_dif != null) {
			line_dif += (point.x + " " + point.y_dif + " ");
		}
		if (point.y_dea != null) {
			line_dea += (point.x + " " + point.y_dea + " ");
		}
		this.addMACDLine(point.x, point.y_macd, this.datas[this.startIndex + i].macd > 0 ? "#e43006" : "#45b66e");
	}
	this.addAVGLine("line_dif", line_dif, "#fdbc54");
	this.addAVGLine("line_dea", line_dea, "#13c0ea");
};

MACDSvg.prototype.addAVGLine = function(id, lineData, color) {
	var polyline = document.createElementNS(svgns, 'polyline');
	polyline.setAttribute("id", id);
	polyline.setAttribute("points", lineData.trim());
	polyline.setAttribute("stroke", color || "transparent");
	polyline.setAttribute("fill", "transparent");
	polyline.setAttribute("stroke-width", "1");
	this.svg.appendChild(polyline);
};

MACDSvg.prototype.addMACDLine = function(x, y_macd, color) {
	var line_macd = document.createElementNS(svgns, "line");
	line_macd.setAttribute("x1", x);
	line_macd.setAttribute("x2", x);
	line_macd.setAttribute("y1", this.height / 2);
	line_macd.setAttribute("y2", y_macd);
	line_macd.setAttribute("stroke", color);
	line_macd.setAttribute("fill", "transparent");
	line_macd.setAttribute("stroke-width", this.per_width * 0.75);
	this.svg.appendChild(line_macd);
};

function KDJSvg(id) {
	this.svg = document.getElementById(id);
	this.width = this.svg.offsetWidth;
	this.height = this.svg.offsetHeight;
}

KDJSvg.prototype.setDatas = function(datas) {
	this.datas = datas;
	this.startIndex = 20;
	this.totalNum = 140;
	this.calculate();
	this.draw();
};

KDJSvg.prototype.calculate = function() {
	this.getextremum();
	this.per_height = this.height / (this.max - this.min);
	this.per_width = this.width / this.totalNum;
	this.translatePoints();
};

KDJSvg.prototype.getextremum = function() {
	var max, min;
	for (var i = this.startIndex; i < Math.min(this.startIndex + this.totalNum, this.datas.length); i++) {
		var data = this.datas[i];
		console.log(data);
		var temp_max = Math.max(Math.max(data.k, data.d), data.j);
		var temp_min = Math.min(Math.min(data.k, data.d), data.j);
		if (i == this.startIndex) {
			max = temp_max;
			min = temp_min;
		} else {
			max = Math.max(max, temp_max);
			min = Math.min(min, temp_min);
		}
	}
	this.max = max;
	this.min = min;
};

KDJSvg.prototype.translatePoints = function() {
	this.pointLists = [];
	for (var i = 0; i < Math.min(this.totalNum, this.datas.length - this.startIndex); i++) {
		var data = this.datas[this.startIndex + i];
		var point = {
			x : this.per_width * (i + 0.5),
			y_k : this.getPostionByValue(data.k),
			y_d : this.getPostionByValue(data.d),
			y_j : this.getPostionByValue(data.j),
		};
		this.pointLists.push(point);
	}
};

KDJSvg.prototype.getPostionByValue = function(value) {
	if (value == null) {
		return null;
	}
	return (this.max - value) * this.per_height;
};

KDJSvg.prototype.draw = function() {
	var line_k = "", line_d = "", line_j = "";
	for (var i = 0; i < this.pointLists.length; i++) {
		var point = this.pointLists[i];
		if (point.y_k != null) {
			line_k += (point.x + " " + point.y_k + " ");
		}
		if (point.y_d != null) {
			line_d += (point.x + " " + point.y_d + " ");
		}
		if (point.y_j != null) {
			line_j += (point.x + " " + point.y_j + " ");
		}
	}
	this.addAVGLine("line_k", line_k, "#00ace5");
	this.addAVGLine("line_d", line_d, "#cd8e06");
	this.addAVGLine("line_j", line_j, "#c32ec3");
};

KDJSvg.prototype.addAVGLine = function(id, lineData, color) {
	var polyline = document.createElementNS(svgns, 'polyline');
	polyline.setAttribute("id", id);
	polyline.setAttribute("points", lineData.trim());
	polyline.setAttribute("stroke", color || "transparent");
	polyline.setAttribute("fill", "transparent");
	polyline.setAttribute("stroke-width", "1");
	this.svg.appendChild(polyline);
};

function VOLSvg(id) {
	this.svg = document.getElementById(id);
	this.width = this.svg.offsetWidth;
	this.height = this.svg.offsetHeight;
}

VOLSvg.prototype.setDatas = function(datas) {
	this.datas = datas;
	this.startIndex = 20;
	this.totalNum = 140;
	this.calculate();
	this.draw();
};

VOLSvg.prototype.calculate = function() {
	this.getextremum();
	this.per_height = this.height / (this.max - this.min);
	this.per_width = this.width / this.totalNum;
	this.translatePoints();
};

VOLSvg.prototype.getextremum = function() {

};

VOLSvg.prototype.translatePoints = function() {

};

VOLSvg.prototype.draw = function() {

};

