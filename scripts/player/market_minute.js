var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";
function Market(id) {
	var svg = document.getElementById(id);
	this.svg = svg;
	this.width = svg.offsetWidth;
	this.height = svg.offsetHeight;
	var me = this;
	this.svg.addEventListener("touchmove", function(event) {
		me.ontouchmove(event);
	}, false);
}

Market.prototype.setDatas = function(datas) {
	for (var i = 0; i < datas.length; i++) {
		var data = datas[i];
		this.drawData(data);
	};

};

Market.prototype.drawData = function(data) {
	switch(data.type) {
		case "polyline":
			this.drawPolyline(data);
			break;
		case "path":
			this.drawPath(data);
			break;
		default:
			break;
	}
};

Market.prototype.drawPolyline = function(data) {
	var polyline = document.createElementNS(svgns, 'polyline');
	var points = "";
	for (var i = 0; i < data.points.length; i++) {
		var point = data.points[i];
		points += (point.x + " " + point.y + " ");
	};

	polyline.setAttribute("points", points.trim());
	polyline.setAttribute("stroke", data.strokecolor || "transparent");
	polyline.setAttribute("fill", data.fillcolor || "transparent");
	polyline.setAttribute("stroke-width", "1");
	this.svg.appendChild(polyline);
};

Market.prototype.drawPath = function(data) {
	var path = document.createElementNS(svgns, 'path');
	var pathline = "";
	for (var i = 0; i < data.points.length; i++) {
		var point = data.points[i];
		if (i == 0) {
			pathline += ("M" + point.x + "," + point.y + " ");
		} else {
			pathline += ("L" + point.x + "," + point.y + " ");
		}
	};
	path.setAttribute("d", pathline);
	path.setAttribute("fill", data.fillcolor || "transparent");
	this.svg.appendChild(path);
};

Market.prototype.ontouchmove = function(event) {
	event.preventDefault();
	var x = 0;
	if (event.targetTouches.length > 0) {
		var touch = event.touches[0];
		x = touch.pageX;
	}

	var line_x = this.svg.getElementById("cross_x");
	var line_y = this.svg.getElementById("cross_y");
	if (!line_x || !line_y) {
		line_x = document.createElementNS(svgns, 'line');
		line_x.setAttribute("id", "cross_x");
		line_x.setAttribute("stroke", "orange");
		line_x.setAttribute("fill", "transparent");
		this.svg.appendChild(line_x);
		line_y = document.createElementNS(svgns, 'line');
		line_y.setAttribute("id", "cross_y");
		line_y.setAttribute("stroke", "orange");
		line_y.setAttribute("fill", "transparent");
		this.svg.appendChild(line_y);
	}
	// var x = event.x;
	line_x.setAttribute("x1", x);
	line_x.setAttribute("x2", x);
	line_x.setAttribute("y1", 0);
	line_x.setAttribute("y2", this.height);
};

function Minute(id) {
	this.marketsvg = new Market(id);
	this.height = this.marketsvg.height;
	this.width = this.marketsvg.width;
}

/**
 *设置分时数据
 *  */
Minute.prototype.setDatas = function(data) {
	this.data = data;
	this.caculate();
	this.draw();
};

/**
 *计算绘制点和绘制刻度
 *  */
Minute.prototype.caculate = function() {
	//获取昨收价格
	var last_close_price = this.data.stockinfo.lastclose;
	var items = this.data.daystatus;
	this.max_scale = getmaxscale(items, last_close_price) * 1.05;
	this.draw_points = [];
	//10个刻度点
	this.draw_scales = [];
	//一天一共有241个点
	for (var i = 0; i < this.data.daystatus.length; i++) {
		var data_item = this.data.daystatus[i];
		var draw_point = {
			x : Math.round(this.width * i / 241) + 0.5,
			y : Math.round(this.height / 2 - (data_item.price - last_close_price) * this.height / (2 * this.max_scale)) + 0.5
		};
		this.draw_points.push(draw_point);
	}

	var scale_num = 5;

	for (var i = 0; i < scale_num; i++) {
		var value = (this.max_scale * (1 - 2 * i / (scale_num - 1))).toFixed(2);

		//左侧价格刻度
		var draw_scale = {
			align : "left",
			text : value,
			y : this.height * i / (scale_num - 1)
		};
		this.draw_scales.push(draw_scale);

		//右侧百分比刻度
		var draw_percent_scale = {
			align : "right",
			text : (value * 100 / this.max_scale).toFixed(2) + "%",
			y : this.height * i / (scale_num - 1)
		};
		this.draw_scales.push(draw_percent_scale);
	};
};

Minute.prototype.draw = function() {
	var startPoint = {
		x : 0,
		y : this.height
	};

	var endPoint = {
		x : this.draw_points[this.draw_points.length - 1].x,
		y : this.height
	};

	var linePoints = this.draw_points;
	linePoints.unshift(startPoint);
	linePoints.push(endPoint);
	var priceLine = {
		type : "polyline",
		points : linePoints,
		strokecolor : "rgb(48,207,242)",
		fillcolor : "rgba(48,207,242,0.3)"
	};
	this.marketsvg.setDatas([priceLine]);
};

/**
 *获取最大刻度
 *  */
function getmaxscale(items, last_close_price) {
	var max_price, min_price;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (i == 0) {
			max_price = item.price;
			min_price = item.price;
		} else {
			max_price = Math.max(max_price, item.price);
			min_price = Math.min(min_price, item.price);
		}
	};
	return Math.max(Math.abs(max_price - last_close_price), Math.abs(min_price - last_close_price));
};

// function makeShape(evt) {
// if (window.svgDocument == null)
// svgDocument = evt.target.ownerDocument;
// var svgRoot = svgDocument.documentElement;
// var defs = svgDocument.createElementNS(svgns, "defs");
// var rect = svgDocument.createElementNS(svgns, "rect");
// rect.setAttributeNS(null, "id", "rect");
// rect.setAttributeNS(null, "width", 15);
// rect.setAttributeNS(null, "height", 15);
// rect.setAttributeNS(null, "style", "fill: green");
// defs.appendChild(rect);
// var use1 = svgDocument.createElementNS(svgns, "use");
// use1.setAttributeNS(null, "x", 5);
// use1.setAttributeNS(null, "y", 5);
// use1.setAttributeNS(xlinkns, "xlink:href", "#rect");
// use2 = svgDocument.createElementNS(svgns, "use");
// use2.setAttributeNS(null, "x", 30);
// use2.setAttributeNS(null, "y", 30);
// use2.setAttributeNS(xlinkns, "xlink:href", "#rect");
// svgRoot.appendChild(defs);
// svgRoot.appendChild(use1);
// svgRoot.appendChild(use2);
// }
