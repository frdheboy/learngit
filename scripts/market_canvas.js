/**
 * 日周月K线操作类
 * @param {String} stockcode  股票代码
 * @param {String} mainId     主界面Id
 * @param {String} dateId     日期界面Id
 * @param {String} assistId   指标界面Id
 * @param {String} assistType 指标类型
 */
function KLineOperator(stockcode, mainId, dateId, assistId, assistType, klineType) {
	this.stockcode = stockcode;
	this.view_main = new MarketIndex(mainId);
	var self = this;
	this.view_main.onchange(function (s, t) {
		self.notifysize(s, t);
	}, function (x) {
		self.notifyshow(x);
	});
	this.view_date = new MarketIndex(dateId);
	this.view_date.onchange(function (s, t) {
		self.notifysize(s, t);
	}, function (x) {
		self.notifyshow(x);
	});
	this.view_assist = new MarketIndex(assistId);
	this.view_assist.onchange(function (s, t) {
		self.notifysize(s, t);
	}, function (x) {
		self.notifyshow(x);
	});
	this.assistType = assistType || 'vol'; //默认指标类型为VOL
	klineType = klineType || 'D';
	this.size = {
		startindex: 150,
		totalnum: 70
	}; //默认开始索引和展示总数
	this._init(klineType);
}


/**
 * 设置日周月K线类型
 * @param {String} klineType K线类型
 */
KLineOperator.prototype.setKLineType = function (klineType) {
	this._init(klineType);
}

/**
 * 请求网络初始化数据
 */
KLineOperator.prototype._init = function (klineType) {
	//http://ip:port/quote/kline/day/list?code={code}&xrdrtype={xrdrtype}&pageindex={pageindex}&pagesize={pagesize}
	//http://ip:port/quote/kline/moredays/list?code={code}&type={type}&xrdrtype={xrdrtype}&pageindex={pageindex}&pagesize={pagesize}
	var url = null;
	this.klineType = klineType;
	switch (klineType) {
	case 'D':
		url = config_url.kline_day;
		break;
	case 'W':
	case 'M':
		url = config_url.kline_week_month;
		break;
	default:
		throw new Error('The kline type [' + klineType + '] is not support yet!')
		break;
	}
	if (!url) {
		return;
	}
	var gal = new GalHttpRequest(url, {
		code: this.stockcode,
		xrdrtype: '0',
		pageindex: '1',
		pagesize: '220',
		type: klineType
	});

	var self = this;

	gal.requestPacketFromNet({
		succeed: function (data) {
			var maxtotal;
			if (data.kline.length < 20) {
				maxtotal = 20;
			} else if (data.kline.length > 90) {
				maxtotal = 90
			} else {
				maxtotal = data.kline.length
			}
			self.size.totalnum = Math.min(self.size.totalnum, maxtotal);
			self.size.startindex = Math.max(data.kline.length - self.size.totalnum, 0);
			self._load(data.kline);
		},
		error: function (error) {}
	});
}

/**
 * 装载数据
 * @param {Array} datas 网络请求回的数据
 */
KLineOperator.prototype._load = function (datas) {
	if (!datas || datas.length === 0) {
		return;
	}
	var klinedatas = [], //数据集合
		temp_data = {
			enddate: 0,
			open: 0,
			high: 0,
			low: 0,
			close: 0,
			amount: 0,
			money: 0
		};
	//初始化数据
	for (var i = 0; i < datas.length; i++) {
		var data = datas[i];
		for (var param in data) {
			if (param != 'enddate') {
				temp_data[param] += data[param];
			} else {
				temp_data[param] = data[param];
			}
		}
		var temp = {
			endDate: temp_data.enddate,
			open: temp_data.open / 1000,
			high: temp_data.high / 1000,
			low: temp_data.low / 1000,
			close: temp_data.close / 1000,
			amount: temp_data.amount,
			money: temp_data.money / 1000
		}; //临时存储变量
		klinedatas.push(temp); //放入变量
	}
	this._translate(klinedatas);
};

/**
 * 变化数据
 * @param {Array} klinedatas K线数据
 */
KLineOperator.prototype._translate = function (klinedatas) {
	var data_kline = new KLine(klinedatas);
	this.pointList = data_kline.getPointList();
	this.klineArray = data_kline;
	this._drawMain();
	this._drawAssist();
	this._drawDate();
};

/**
 * 绘制主界面
 */
KLineOperator.prototype._drawMain = function () {
	var datas = [];
	for (var i = this.pointList.length - 1; i >= 0; i--) {
		var point = this.pointList[i],
			drawPoint = new KLineDrawPoint(point);
		drawPoint.isfirst = (i != 0 && isfirstday(point.endDate, this.pointList[i - 1].endDate, this.klineType));
		datas.unshift(drawPoint);
	};
	this.view_main.setDatas(datas, this.size, {
		type: "relative",
		values: [0, 0.2, 0.4, 0.6, 0.8, 1]
	});
};

/**
 * 将指标修改为制定类型
 * @param {String} assistType 改变指标图表
 */
KLineOperator.prototype.assistTo = function (assistType) {
	this.assistType = assistType;
	this.view_assist.clear();
	this._drawAssist();
};

/**
 * 绘制指标
 */
KLineOperator.prototype._drawAssist = function () {
	switch (this.assistType) {
	case 'vol':
		this._drawVOL();
		break;
	case 'macd':
		this._drawMACD();
		break;
	case 'kdj':
		this._drawKDJ();
		break;
	default:
		throw new Error('The market index type [' + this.assistType + '] is not support yet!');
		break;
	}
};

/**
 * 绘制VOL指标
 */
KLineOperator.prototype._drawVOL = function () {
	var datas = [];
	for (var i = this.klineArray.datas.length - 1; i >= 0; i--) {
		var point = this.klineArray.datas[i],
			drawPoint = new VOLDrawPoint(point);
		drawPoint.isfirst = (i != 0 && isfirstday(point.endDate, this.klineArray.datas[i - 1].endDate, this.klineType));
		datas.unshift(drawPoint);
	}
	this.view_assist.setDatas(datas, this.size, {
		type: "relative",
		values: [0],
		fixed: function (num) {
			return new BigNumberFormat(num).toString() + '手';
		}
	}, "line", {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});
};

/**
 * 绘制MACD指标
 */
KLineOperator.prototype._drawMACD = function () {
	var datas = [];
	var macd = new MACD(this.klineArray.datas);
	var macdPoints = macd.getPointList();
	for (var i = macdPoints.length - 1; i >= 0; i--) {
		var point = macdPoints[i],
			drawPoint = new MACDDrawPoint(point);
		drawPoint.isfirst = (i != 0 && isfirstday(point.date, macdPoints[i - 1].date, this.klineType));
		datas.unshift(drawPoint);
	}
	this.view_assist.setDatas(datas, this.size, {
		type: "relative",
		values: [0, 0.5, 1]
	});
}

/**
 * 绘制KDJ指标
 */
KLineOperator.prototype._drawKDJ = function () {
	var kdj = new KDJ(this.klineArray.datas),
		kdjPoints = kdj.getPointList(),
		datas = [];
	for (var i = kdjPoints.length - 1; i >= 0; i--) {
		var point = kdjPoints[i],
			drawPoint = new KDJDrawPoint(point);
		drawPoint.isfirst = (i != 0 && isfirstday(point.date, kdjPoints[i - 1].date, this.klineType));
		datas.unshift(drawPoint);
	}
	this.view_assist.setDatas(datas, this.size, {
		type: "absolute",
		values: [20, 50, 80]
	});
};

/**
 * 绘制日期
 */
KLineOperator.prototype._drawDate = function () {
	var datas = [];
	for (var i = this.pointList.length - 1; i >= 0; i--) {
		var point = this.pointList[i],
			drawPoint = new DateDrawPoint(point);
		drawPoint.isfirst = (i != 0 && isfirstday(point.endDate, this.pointList[i - 1].endDate, this.klineType));
		drawPoint.datetext = getdatetext(point.endDate, this.klineType);
		datas.unshift(drawPoint);
	}
	this.view_date.setDatas(datas, this.size, null, "text", {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});
};

/**
 * 通知所有界面变化
 * @param {Number} startindex 开始索引
 * @param {Number} totalnum   能展示的总数
 */
KLineOperator.prototype.notifysize = function (startindex, totalnum) {
	if (this.size.startindex == startindex && this.size.totalnum == totalnum) {
		return;
	}
	this.size.startindex = startindex;
	this.size.totalnum = totalnum;
	this.view_main.setSize(this.size);
	this.view_date.setSize(this.size);
	this.view_assist.setSize(this.size);
};

/**
 * 通知所有页面展示x
 * @param {Number} x 索引
 */
KLineOperator.prototype.notifyshow = function (x) {
	if (this._touchcallback) {
		var klinedata = x != null ? this.pointList[this.size.startindex + x] : null;
		var lastclose = x != null && this.pointList[this.size.startindex + x - 1] ? this.pointList[this.size.startindex + x - 1].close : 0;
		this._touchcallback(klinedata, lastclose, x);
	}
	this.view_main.show(x);
	this.view_date.show(x);
	this.view_assist.show(x);
};

/**
 * 设置触摸回调
 * @param {Object} callback 触摸回调
 */
KLineOperator.prototype.setTouchcallback = function (callback) {
	this._touchcallback = callback;
}

KLineOperator.prototype.setDefualtTouchback = function () {
	$('#klinedetail').hide();
	var self = this;
	this._touchcallback = function (data, lastclose, index) {
		if (!lastclose) {
			lastclose = 0;
		}
		if (data) {
			$('#klinedetail').removeClass().addClass(index > self.size.totalnum / 2 ? 'detail_left' : 'detail_right');
			$('#klinedetail').show();
			var date = (data.endDate / 1000000).toString();
			$('#enddate').text(date.substr(2, 2) + '/' + date.substr(4, 2) + '/' + date.substr(6, 2));
			$('#open').text(data.open.toFixed(2));
			$('#open').removeClass().addClass(data.open > lastclose ? 'up' : 'down')
			$('#high').text(data.high.toFixed(2));
			$('#high').removeClass().addClass(data.high > lastclose ? 'up' : 'down')
			$('#low').text(data.low.toFixed(2));
			$('#low').removeClass().addClass(data.low > lastclose ? 'up' : 'down');
			$('#close').text(data.close.toFixed(2));
			$('#close').removeClass().addClass(data.close > lastclose ? 'up' : 'down');
			if (lastclose !== 0) {
				$('#flu').text(((data.close - lastclose) * 100 / lastclose).toFixed(2) + '%');
			} else {
				$('#flu').text('0%');
			}

			$('#flu').removeClass().addClass(data.close > lastclose ? 'up' : 'down')
		} else {
			$('#klinedetail').hide();
		}
	};
}

/**
 * 是否为日期的第一天
 * @param   {Number}  enddata     结束日期
 * @param   {Number}  lastenddata 结束日期的前一天
 * @param   {String}  type        K线类型
 * @returns {Boolean} 是否为第一天
 */
function isfirstday(enddata, lastenddata, type) {
	var is = false;
	switch (type) {
	case 'D':
		is = ((Math.round(enddata / 100000000) - Math.round(lastenddata / 100000000)) > 0);
		break;
	case 'W':
		is = ((Math.round(enddata / 100000000) - Math.round(lastenddata / 100000000)) > 0);
		break;
	case 'M':
		is = ((Math.round(enddata / 10000000000) - Math.round(lastenddata / 10000000000)) > 0);
		break;
	default:
		break;
	}
	return is;

}

/**
 * 格式化日期
 * @param   {Number} enddata 日期
 * @param   {String} type    K线类型
 * @returns {String} 日期的yyyy-MM-dd格式
 */
function getdatetext(enddata, type) {
	var d = (enddata / 1000000).toFixed(0),
		format = '';
	switch (type) {
	case 'D':
		format = d.substr(0, 4) + "-" + d.substr(4, 2);
		// + "-" + d.substr(6, 2)
		break;
	case 'W':
		format = d.substr(0, 4) + "-" + d.substr(4, 2);
		// + "-" + d.substr(6, 2)
		break;
	case 'M':
		format = d.substr(0, 4) + "-" + d.substr(4, 2);
		break;
	default:
		break;
	}
	return format;
}

/**
 * 分时图
 * @param {String} id        画布ID
 * @param {String} stockcode 股票代码
 */
function Minute(id, stockcode) {
	this.canvas = document.getElementById(id);
	this.width = this.canvas.offsetWidth;
	this.canvas.width = this.width;
	this.canvas.height = this.canvas.offsetHeight;
	this.fontsize = 10;
	this.height_price = (this.canvas.height - this.fontsize * 1.5) * 2 / 3;
	this.height_amount = (this.canvas.height - this.fontsize * 1.5) / 3;

	this.context = this.canvas.getContext("2d");

	this.context.font = this.fontsize + "pt Arial";
	if (!this.context) {
		throw new Error("图层不支持绘制操作");
	}
	this.stockcode = stockcode;
	var me = this;
	this.canvas.addEventListener("touchstart", function (event) {
		me.ontouchstart(event);
	}, false);
	this.canvas.addEventListener("touchmove", function (event) {
		me.ontouchmove(event);
	}, false);
	this.canvas.addEventListener("touchend", function (event) {
		me.ontouchend(event);
	}, false);
	this._init();
};

/**
 * 根据股票代码请求网络数据初始化分时信息
 * @param {String} stockcode 股票代码
 */
Minute.prototype._init = function () {
	this._datas = [];
	this._requsetNext();
}

/**
 * 循环请求新增数据
 */
Minute.prototype._requsetNext = function () {
	if (this._datas.length > 240) {
		return;
	}
	this._requsetData();
	var self = this;
	setTimeout(function () {
		self._requsetNext();
	}, 60 * 1000);
}

/**
 * 请求网络数据
 */
Minute.prototype._requsetData = function () {
	var self = this,
		gal = new GalHttpRequest(config_url.kline_minute, {
			code: self.stockcode,
			start: self._datas.length + 1
		});
	gal.requestPacketFromNet({
		succeed: function (data) {
			if (!self._lastclose) {
				self._lastclose = data.stockinfo[0].lastclose; //昨收价
			}
			self._load(self._processOriData(data));
		},
		error: function (error) {
			//TODO Process Error
		}
	});
};

/**
 * 处理原始数据(处理过压缩的数据)
 * @param   {Array} data 原始数据
 * @returns {Array}  处理完成的数据
 */
Minute.prototype._processOriData = function (data) {
	//分时数据
	var temp = {
			time: 0,
			price: 0,
			amount: 0,
			avgprice: 0
		},
		items = data.daystatus,
		datas = [],
		i;

	for (i = 0; i < items.length; i++) {
		for (var param in temp) {
			temp[param] += items[i][param];
		}
		datas.push({
			time: temp.time,
			price: temp.price / 1000,
			amount: temp.amount,
			avgprice: temp.avgprice / 1000
		});
	}
	return datas;
};

/**
 * 加载处理完成的数据
 * @param {Array} datas 处理完成的数据
 */
Minute.prototype._load = function (datas) {
	this._datas = this._datas.concat(datas);
	this._caculate();
	this.invalidata();
};


/**
 * 更新画面
 */
Minute.prototype.invalidata = function () {
	this._draw();
};

/**
 * 计算绘制点和绘制刻度
 */
Minute.prototype._caculate = function () {
	//获取昨收价格
	this._caculateMaxScale();
	this.draw_points = [];
	//10个刻度点
	this.draw_scales = [];
	//2个交易量刻度点
	this.draw_scales_amount = [];
	//一天一共有241个点
	for (var i = 0; i < this._datas.length; i++) {
		var data_item = this._datas[i],
			x = Math.round(this.canvas.width * i / 241) + 0.5;
		var draw_point = {
			x: x,
			y: Math.round(this.height_price / 2 - (data_item.price - this._lastclose) * this.height_price / (2 * this._maxscale)) + 0.5,
			y_avg: Math.round(this.height_price / 2 - (data_item.avgprice - this._lastclose) * this.height_price / (2 * this._maxscale)) + 0.5,
			y_amount: Math.round(this.height_price + (this._maxamountscale - data_item.amount) * this.height_amount / this._maxamountscale) + 0.5,
		};
		this.draw_points.push(draw_point);
	}

	var scale_num = 5,
		scale_num_amount = 2,
		i;

	for (i = 0; i < scale_num; i++) {
		var value = this._maxscale * (1 - 2 * i / (scale_num - 1));

		var color = 'black';
		if (value > 0) {
			color = 'red';
		} else if (value < 0) {
			color = 'green';
		}

		//左侧价格刻度
		var draw_scale = {
			align: "left",
			text: (this._lastclose + value).toFixed(2),
			y: this.height_price * i / (scale_num - 1),
			color: color
		};
		this.draw_scales.push(draw_scale);

		//右侧百分比刻度
		var draw_percent_scale = {
			align: "right",
			text: (value * 100 / this._lastclose).toFixed(2) + "%",
			y: this.height_price * i / (scale_num - 1),
			color: color
		};
		this.draw_scales.push(draw_percent_scale);
	};

	for (i = 0; i < scale_num_amount; i++) {
		var draw_scale = {
			align: "left",
			text: (new BigNumberFormat(this._maxamountscale / (1 + i)).toString()) + '手',
			y: this.height_price + this.height_amount * i / scale_num_amount
		};
		this.draw_scales_amount.push(draw_scale);
	}

};

/**
 * 获取最大刻度
 * @returns {Number} 最大刻度值
 */
Minute.prototype._caculateMaxScale = function () {
	var max_price = 0,
		min_price = 0,
		max_amount = 0;
	for (var i = 0; i < this._datas.length; i++) {
		var item = this._datas[i];
		if (i == 0) {
			max_price = item.price;
			min_price = item.price;
			max_amount = item.amount;
		} else {
			max_price = Math.max(max_price, item.price);
			min_price = Math.min(min_price, item.price);
			max_amount = Math.max(max_amount, item.amount);
		}
	};
	this._maxscale = Math.max(Math.abs(max_price - this._lastclose), Math.abs(min_price - this._lastclose));
	this._maxamountscale = max_amount;
}

/**
 * 设置按下的X坐标
 * @param {Number} x x坐标
 */
Minute.prototype.settouch = function (x) {
	this.touch_x = x;
};

/**
 * 绘制分时图
 */
Minute.prototype._draw = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	// 注意问题:http://jo2.org/html5-canvas画图3：1px线条模糊问题/
	for (var i = 0; i < this.draw_scales.length; i++) {
		this.context.strokeStyle = "#D0D0D0";
		var draw_scale = this.draw_scales[i];
		this.context.beginPath();
		this.context.lineTo(0, Math.round(draw_scale.y) + 0.5);
		this.context.lineTo(this.width, Math.round(draw_scale.y) + 0.5);
		this.context.stroke();
		this.context.fillStyle = draw_scale.color;
		if (draw_scale.y == 0) {
			this.context.textBaseline = 'top';
		} else if (draw_scale.y == this.height_price) {
			this.context.textBaseline = 'bottom';
		} else {
			this.context.textBaseline = 'middle';
		}
		if (draw_scale.align == "left") {
			this.context.fillText(draw_scale.text, 0, draw_scale.y + 2);
		} else if (draw_scale.align == "right") {
			this.context.textAlign = "right";
			this.context.fillText(draw_scale.text, this.canvas.width, draw_scale.y + 2);
			//恢复默认
			this.context.textAlign = "start";
		}
	}
	for (var i = 0; i < 3; i++) {
		this.context.beginPath();
		this.context.moveTo(Math.round(this.width * (i + 1) / 4) + 0.5, 0);
		this.context.lineTo(Math.round(this.width * (i + 1) / 4) + 0.5, this.canvas.height);
		this.context.stroke();
	}

	this.context.fillStyle = 'black';
	for (var i = 0; i < this.draw_scales_amount.length; i++) {
		this.context.strokeStyle = "#D0D0D0";
		var draw_scale = this.draw_scales_amount[i];
		this.context.beginPath();
		this.context.lineTo(0, Math.round(draw_scale.y) + 0.5);
		this.context.lineTo(this.width, Math.round(draw_scale.y) + 0.5);
		this.context.stroke();
		this.context.strokeStyle = "rgb(0,0,0)";
	}

	this.context.beginPath();
	for (var i = 0; i < this.draw_points.length; i++) {
		var draw_point = this.draw_points[i];
		if (i == 0) {
			this.context.moveTo(draw_point.x, draw_point.y);
		} else {
			this.context.lineTo(draw_point.x, draw_point.y);
		}
	}
	this.context.fillStyle = "rgba(48,207,242,0.3)";
	this.context.strokeStyle = "rgb(48,207,242)";
	this.context.stroke();
	if (this.draw_points.length > 0) {
		this.context.lineTo(this.draw_points[this.draw_points.length - 1].x, this.height_price);
		this.context.lineTo(this.draw_points[0].x, this.height_price);
		this.context.fill();
		this.context.closePath();
	}

	this.context.beginPath();
	for (var i = 0; i < this.draw_points.length; i++) {
		var draw_point = this.draw_points[i];
		if (i == 0) {
			this.context.moveTo(draw_point.x, draw_point.y_avg);
		} else {
			this.context.lineTo(draw_point.x, draw_point.y_avg);
		}
	}
	this.context.strokeStyle = "#FF9912";
	this.context.stroke();

	for (var i = 0; i < this.draw_points.length; i++) {
		this.context.strokeStyle = ((this._datas[i].price - (this._datas[i - 1] ? this._datas[i - 1].price : this._lastclose)) >= 0 ? 'red' : 'green');
		var draw_point = this.draw_points[i];
		this.context.beginPath();
		this.context.moveTo(draw_point.x, draw_point.y_amount);
		this.context.lineTo(draw_point.x, this.height_amount + this.height_price);
		this.context.stroke();
	}

	this.context.fillStyle = 'black';
	this.context.strokeStyle = 'black';
	for (var i = 0; i < this.draw_scales_amount.length; i++) {
		var draw_scale = this.draw_scales_amount[i];
		if (draw_scale.y == this.height_price) {
			this.context.textBaseline = 'top';
		} else {
			this.context.textBaseline = 'middle';
		}
		this.context.fillText(draw_scale.text, 0, draw_scale.y + 2);
	}
	//绘制touch_x
	if (this.touch_x && this.touch_x != -1) {
		var touch_index = Math.round(this.touch_x / (this.canvas.width / 241));
		if (touch_index >= this.draw_points.length) {
			touch_index = this.draw_points.length - 1;
		} else if (touch_index < 0) {
			touch_index = 0;
		}
		var touch_point = this.draw_points[touch_index];
		if (this._touchcallback) {
			var data = this._datas[touch_index];
			var lastclose = this._lastclose;
			this._touchcallback(data, lastclose, touch_index);
		}
		this.context.beginPath();
		this.context.moveTo(touch_point.x, 0);
		this.context.lineTo(touch_point.x, this.height_price + this.height_amount);
		this.context.stroke();
		this.context.closePath();
		this.context.beginPath();
		this.context.moveTo(0, touch_point.y);
		this.context.lineTo(this.canvas.width, touch_point.y);
		this.context.stroke();
		this.context.closePath();
	} else {
		if (this._touchcallback) {
			this._touchcallback(null);
		}
	}

	//绘制时间
	this.context.textAlign = 'left';
	this.context.textBaseline = 'bottom';
	this.context.fillText('9:30', 0, this.canvas.height);
	this.context.textAlign = 'center';
	this.context.fillText('11:30', this.canvas.width / 2, this.canvas.height);
	this.context.textAlign = 'right';
	this.context.fillText('15:00', this.width, this.canvas.height);
	this.context.textAlign = 'left';
};

/**
 * 设置触摸回调
 * @param {Object} touchcallback 触摸回调
 */
Minute.prototype.setTouchcallback = function (touchcallback) {
	this._touchcallback = touchcallback;
};

/**
 * 设置为默认的Touch回调
 */
Minute.prototype.setDefualtTouchback = function () {
	$('#minutedetail').hide();
	this._touchcallback = function (data, lastclose, index) {
		if (!lastclose) {
			lastclose = 0;
		}
		if (!data) {
			$('#minutedetail').hide();
		} else {
			$('#minutedetail').removeClass().addClass(index > 120 ? 'detail_left' : 'detail_right')
			$('#minutedetail').show();
			var time = data.time.toString()
			if (time.length == 3) {
				time = '0' + time;
			}
			$('#time').text(time.substr(0, 2) + ':' + time.substr(2, 2));
			$('#price').text(data.price.toFixed(2));
			$('#price').removeClass().addClass(data.price > lastclose ? 'up' : 'down');
			if (lastclose === 0) {
				$('#minuteflu').text('0%');
			} else {
				$('#minuteflu').text(((data.price - lastclose) * 100 / lastclose).toFixed(2) + '%');
			}
			$('#minuteflu').removeClass().addClass(data.price > lastclose ? 'up' : 'down');
			if (this.stockcode.charAt(1) === '0') {
				$("#avgflag").hide();
				$("#avgflagbr").hide();
				$('#avg').hide();
				$('#avgbr').hide();
			} else {
				$("#avgflag").show();
				$("#avgflagbr").show();
				$('#avg').show();
				$('#avgbr').show();
			}
			$('#avg').text(data.avgprice.toFixed(2));
			$('#avg').removeClass().addClass(data.avgprice > lastclose ? 'up' : 'down');
			$('#amount').text(new BigNumberFormat(data.amount).toString() + '手');
		}
	};
}

/**
 * 触摸开始事件
 * @param {Object} event 触摸事件
 */
Minute.prototype.ontouchstart = function (event) {
	event.preventDefault();
	if (event.targetTouches.length > 0) {
		var touch = event.touches[0];
		this.settouch(touch.pageX - this.canvas.offsetLeft);
		this.invalidata();
	}
};

/**
 * 触摸移动事件
 * @param {Object} event 触摸事件
 */
Minute.prototype.ontouchmove = function (event) {
	event.preventDefault();
	if (event.targetTouches.length > 0) {
		var touch = event.touches[0];
		this.settouch(touch.pageX - this.canvas.offsetLeft);
		this.invalidata();
	}
};

/**
 * 触摸结束事件
 * @param {Object} event 触摸事件
 */
Minute.prototype.ontouchend = function (event) {
	event.preventDefault();
	this.settouch(-1);
	this.invalidata();
};

function MarketIndex(id) {
	this.canvas = document.getElementById(id);
	this.canvas.width = this.canvas.offsetWidth;
	this.canvas.height = this.canvas.offsetHeight;
	this.context = this.canvas.getContext("2d");
	this.fontsize = 10;
	this.context.font = this.fontsize + "pt Arial";
	this.legendrect = {
		top: 0,
		left: 0,
		right: this.canvas.width,
		bottom: 30
	};
	console.log('!!' + this.canvas.width);
	if (!this.context) {
		throw new Error("图层不支持绘制操作");
	}
	this._touchType = null;
	var me = this;
	this.canvas.addEventListener("touchstart", function (event) {
		me.ontouchstart(event);
	}, false);
	this.canvas.addEventListener("touchmove", function (event) {
		me.ontouchmove(event);
	}, false);
	this.canvas.addEventListener("touchend", function (event) {
		me.ontouchend(event);
	}, false);
	this.touchIndex = null;
}

/**
 *设置数据
 *  */
MarketIndex.prototype.setDatas = function (datas, size, scaledatas, timetype, rect) {
	this.drawdatas = datas;
	this.scaledatas = scaledatas;
	this.timetype = timetype || "line";
	this.legendrect = rect || {
		top: 0,
		left: 0,
		right: this.canvas.width,
		bottom: 30
	};
	this.startIndex = size.startindex || 0;
	this.totalNum = size.totalnum || 70;
	this.calculate();
};

MarketIndex.prototype.setSize = function (size) {
	this.startIndex = size.startindex;
	if (size.totalnum) {
		this.totalNum = size.totalnum;
	}
	this.calculate();
};

MarketIndex.prototype.onchange = function (sizecallback, showcallback) {
	this.sizecallback = sizecallback;
	this.showcallback = showcallback;
};

/**
 *计算数据
 *  */
MarketIndex.prototype.calculate = function () {
	this.drawlist = [];
	for (var i = this.startIndex; i < Math.min(this.startIndex + this.totalNum, this.drawdatas.length); i++) {
		this.drawlist.push(this.drawdatas[i]);
	};
	//计算额外数据
	this.calculateextra();
	// 计算平均尺寸
	this.calculatepersize();
	//计算刻度
	this.calculatescales();
	//绘制图形
	this.draw();
};

/**
 *计算额外数据
 *  */
MarketIndex.prototype.calculateextra = function () {
	var max, min;
	for (var i = 0; i < this.drawlist.length; i++) {
		var drawdata = this.drawlist[i];
		if (i == 0) {
			max = drawdata.max;
			min = drawdata.min;
		} else {
			max = Math.max(max, drawdata.max);
			min = Math.min(min, drawdata.min);
		}
	}
	if (Math.abs(max - min) < 0.001) {
		max = 1.1 * max;
		min = 0.9 * min;
	}
	this.max = max;
	this.min = min;
};

/**
 *计算平均尺寸
 *  */
MarketIndex.prototype.calculatepersize = function () {
	this.per_height = (this.canvas.height - this.legendrect.bottom) / (this.max - this.min);
	this.per_width = this.canvas.width / this.totalNum;
};

/**
 *计算刻度
 *  */
MarketIndex.prototype.calculatescales = function () {
	this.drawscales = [];
	if (!this.scaledatas) {
		return;
	}
	if (typeof this.scaledatas.fixed === 'function') {
		this.fixed = this.scaledatas.fixed;
	} else {
		this.fixed = function (num) {
			return num.toFixed(2);
		};
	}
	var tempvalues = [];
	if (this.scaledatas.type && this.scaledatas.type == "relative") {
		for (var i = 0; i < this.scaledatas.values.length; i++) {
			var value = this.max - (this.max - this.min) * this.scaledatas.values[i];
			tempvalues.push(value);
		}
	} else {
		tempvalues = this.scaledatas.values;
	}

	var temppostion = this.translate(tempvalues);

	for (var i = 0; i < tempvalues.length; i++) {
		var value = tempvalues[i];
		if (this.max >= value && value >= this.min) {
			this.drawscales.push({
				value: value,
				postion: Math.max(Math.round(temppostion[i]) - 0.5, 0)
				// postion : temppostion[i]
			});
		}
	};
};

/**
 *数据转换为坐标
 *  */
MarketIndex.prototype.translate = function (values) {
	var postions = [];
	for (var i = 0, j = values.length; i < j; i++) {
		var value = values[i];
		if (!value && value != 0) {
			postions.push(null);
		} else {
			postions.push((this.max - value) * this.per_height + this.legendrect.bottom);
		}
	};
	return postions;
};

MarketIndex.prototype.clear = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/**
 *绘制
 *  */
MarketIndex.prototype.draw = function () {
	this.clear();
	for (var i = 0; i < this.drawlist.length; i++) {
		this.drawlist[i].postions = this.translate(this.drawlist[i].values);
		this.drawlist[i].x = this.per_width / 2 + this.per_width * i;
		this.drawlist[i].width = this.per_width;
	};

	this.drawtimeline();

	for (var i = 0; i < this.drawlist.length; i++) {
		this.drawlist[i].draw(this.context, this.drawlist[i - 1] ? this.drawlist[i - 1] : null);
	}
	if (this.touchIndex !== null) {
		this.context.strokeStyle = "black";
		var drawData = this.drawlist[this.touchIndex];
		this.context.beginPath();
		this.context.moveTo(drawData.x, drawData.getDataTopY ? drawData.getDataTopY(this.legendrect) : 0);
		this.context.lineTo(drawData.x, this.canvas.height);
		this.context.stroke();

		if (drawData.getShowY()) {
			this.context.beginPath();
			this.context.moveTo(0, drawData.getShowY());
			this.context.lineTo(this.canvas.width, drawData.getShowY());
			this.context.stroke();
		}
	}

	var legenddata = this.drawlist[this.touchIndex || this.drawlist.length - 1];
	if (legenddata && legenddata.drawlegend) {
		legenddata.drawlegend(this.context, this.legendrect, this.touchIndex, this.touchIndex && (this.touchIndex > this.totalNum / 2) ? "left" : "right");
	}
	this.drawscale();
};

/**
 *绘制时间轴
 *  */
MarketIndex.prototype.drawtimeline = function () {
	var interval = this.totalNum / 5;
	var lastIndex = null;
	for (var i = this.drawlist.length - 1; i >= 0; i--) {
		var drawpoint = this.drawlist[i];
		if (drawpoint.isfirst && (!lastIndex || lastIndex - i >= interval)) {
			var x = Math.round(drawpoint.x) + 0.5;
			this.context.strokeStyle = "#D0D0D0";
			if (this.timetype == "line") {
				this.context.lineWidth = 1;
				this.context.beginPath();
				this.context.moveTo(x, this.legendrect.bottom);
				this.context.lineTo(x, this.canvas.height);
				this.context.stroke();
				lastIndex = i;
			} else if (this.timetype == "text") {
				this.context.textBaseline = 'middle';
				this.context.textAlign = "center";
				var textlength = this.context.measureText(drawpoint.datetext).width;
				var textx = Math.max(textlength / 2, Math.min(this.canvas.width - textlength / 2, x));
				this.context.fillText(drawpoint.datetext, textx, this.canvas.height / 2);
				lastIndex = i;
			}
		}
	};
};

/**
 *绘制刻度
 *  */
MarketIndex.prototype.drawscale = function () {
	for (var index in this.drawscales) {
		var drawscale = this.drawscales[index];
		this.context.strokeStyle = "#D0D0D0";
		this.context.lineWidth = 1;
		this.context.beginPath();
		this.context.moveTo(0, drawscale.postion);
		this.context.lineTo(this.canvas.width, drawscale.postion);
		this.context.stroke();
		this.context.textBaseline = 'middle';
		var y = Math.max(this.legendrect.bottom + this.fontsize * 3 / 4, Math.min(drawscale.postion, this.canvas.height - this.fontsize * 3 / 4));
		this.context.fillStyle = "black";
		this.context.fillText(this.fixed(drawscale.value), 0, y);
	}
};

MarketIndex.prototype.ontouchstart = function (event) {
	if (!this._touchtypeSwither(event)) {
		return;
	}
	if (this._touchType === 'drag') {
		var self = this;
		self.timeoutProcess = setTimeout(function () {
			self._touchType = 'show';
			self._calculateshow(event.touches[0].pageX - self.canvas.offsetLeft);
		}, 500);
	}
};

MarketIndex.prototype.ontouchmove = function (event) {
	this._touchtypeSwither(event);
};

MarketIndex.prototype.ontouchend = function (event) {
	event.preventDefault();
	if (this.timeoutProcess) {
		clearTimeout(this.timeoutProcess);
		this.timeoutProcess = null;
	}
	if (this._touchType === 'show') {
		this._calculateshow(null);
	}
	this._touchType = null;
	this._last_x1 = null;
	this._last_x2 = null;
};

MarketIndex.prototype._touchtypeSwither = function (event) {
	event.preventDefault();
	if (!event.touches || event.touches.length === 0) {
		this._touchType = null;
		return false;
	} else if (event.touches.length === 1) {
		this._touchType = this._touchType || 'drag';
	} else if (event.touches.length > 1) {
		this._touchType = 'zoom';
		if (this.timeoutProcess) {
			clearTimeout(this.timeoutProcess);
			this.timeoutProcess = null;
		}
		this._calculateshow(null);
	}
	switch (this._touchType) {
	case 'show':
		this._calculateshow(event.touches[0].pageX - this.canvas.offsetLeft);
		break;
	case 'drag':
		this._calculatedrag(event.touches[0].pageX - this.canvas.offsetLeft);
		break;
	case 'zoom':
		this._calculatezoom(event.touches[0].pageX - this.canvas.offsetLeft, event.touches[1].pageX - this.canvas.offsetLeft);
		break;
	default:
		return false;
		break;
	};
	return true;
}

MarketIndex.prototype._calculateshow = function (x) {
	var touchPointIndex = null;
	if (x === null) {} else if (x >= 0) {
		touchPointIndex = Math.round((x / this.per_width - 0.5));
		touchPointIndex = Math.min(touchPointIndex, this.drawlist.length - 1);
		touchPointIndex = Math.max(touchPointIndex, 0);
	} else {
		touchPointIndex = 0;
	}
	if (this.showcallback) {
		this.showcallback(touchPointIndex);
	}
};

MarketIndex.prototype.show = function (touchPointIndex) {
	this.touchIndex = touchPointIndex;
	this.draw();
};

MarketIndex.prototype._calculatedrag = function (x) {
	if (!this._last_x1) {
		this._last_x1 = x;
	}
	var moveNums = Math.round((x - this._last_x1) / this.per_width);

	if (moveNums != 0) {
		if (this.timeoutProcess) {
			clearTimeout(this.timeoutProcess);
			this.timeoutProcess = null;
		}
		var startIndex = (+this.startIndex - parseInt(moveNums)),
			startIndex = Math.min(this.drawdatas.length - this.totalNum, startIndex),
			startIndex = Math.max(0, startIndex);

		if (this.sizecallback) {
			var totalnum = this.totalNum;
			this.sizecallback(startIndex, totalnum);
		}
	}
	this._last_x1 = x;
};

MarketIndex.prototype._calculatezoom = function (x1, x2) {
	this._last_x1 = this._last_x1 || x1;
	this._last_x2 = this._last_x2 || x2;

	var multiple = Math.abs(this._last_x2 - this._last_x1) / Math.abs(x2 - x1),
		movenums = Math.round(((x1 + x2) / 2 - (this._last_x1 + this._last_x2) / 2) / this.per_width),
		maxtotal = 0;
	if (this.drawdatas.length < 20) {
		maxtotal = 20;
	} else if (this.drawdatas.length > 90) {
		maxtotal = 90;
	} else {
		maxtotal = this.drawdatas.length;
	}
	totalnum = Math.min(Math.max(Math.round(this.totalNum * multiple), 20), maxtotal),
	startIndex = Math.max(0, Math.min((+this.startIndex - parseInt(movenums)), this.drawdatas.length - totalnum));
	console.log(totalnum, startIndex);
	//TODO fix zoom value	this.drawdatas
	if (this.sizecallback) {
		this.sizecallback(startIndex, totalnum);
	}
};

/**
 *K线数据课绘制点
 *  */
function KLineDrawPoint(klinedata) {
	this.data = klinedata;
	this.values = [klinedata.open, klinedata.high, klinedata.low, klinedata.close, klinedata.avg_5, klinedata.avg_10, klinedata.avg_20];
	this.max = Math.max(Math.max(Math.max(klinedata.high, klinedata.avg_5), klinedata.avg_10), klinedata.avg_20);
	var min = klinedata.low;
	if (klinedata.avg_5) {
		min = Math.min(klinedata.low, klinedata.avg_5);
		console.log
	}
	if (klinedata.avg_10) {
		min = Math.min(min, klinedata.avg_10)
	}
	if (klinedata.avg_20) {
		min = Math.min(min, klinedata.avg_20);
	}
	this.min = min;
	return this;
}

KLineDrawPoint.prototype.getShowY = function () {
	return this.postions[0];
};

KLineDrawPoint.prototype.draw = function (context, last_drawpoint) {
	var positon_open = this.postions[0];
	var postion_high = this.postions[1];
	var postion_low = this.postions[2];
	var postion_close = this.postions[3];
	var postion_avg_5 = this.postions[4];
	var postion_avg_10 = this.postions[5];
	var postion_avg_20 = this.postions[6];

	var half_max_width = this.width * 3 / 8;

	//绘制最高最低价格连线
	if (this.data.close < this.data.open) {
		context.fillStyle = "#45b66e";
		context.strokeStyle = "#45b66e";
	} else if (this.data.close > this.data.open) {
		context.fillStyle = "#e43006";
		context.strokeStyle = "#e43006";
	} else {
		if (last_drawpoint && this.data.open > last_drawpoint.data.close) {
			context.fillStyle = "#e43006";
			context.strokeStyle = "#e43006";
		} else {
			context.fillStyle = "#45b66e";
			context.strokeStyle = "#45b66e";
		}
	}
	context.beginPath();
	context.moveTo(this.x, postion_high);
	context.lineTo(this.x, postion_low);
	context.stroke();

	//绘制开盘收盘区域
	context.beginPath();
	var postion_fix = 0;
	if (positon_open == postion_close) {
		postion_fix = 1;
	}
	context.rect(this.x - half_max_width, Math.min(positon_open, postion_close) - postion_fix, half_max_width * 2, Math.abs(positon_open - postion_close) + postion_fix);
	context.fill();

	//绘制5日,10日,20日均线
	var avg_color = ["#00ace5", "#cd8e06", "#c32ec3"];
	for (var i = 4; i <= 6; i++) {
		if (last_drawpoint && last_drawpoint.postions[i]) {
			context.strokeStyle = avg_color[i - 4];
			context.beginPath();
			context.moveTo(last_drawpoint.x, last_drawpoint.postions[i]);
			context.lineTo(this.x, this.postions[i]);
			context.stroke();
		}
	}
};

KLineDrawPoint.prototype.drawlegend = function (context, rect, istouch, align) {

	context.textBaseline = 'middle';
	context.textAlign = "right";

	var legend_ma20 = "MA20:" + (this.data.avg_20 || "--");
	context.fillStyle = "#c32ec3";
	context.fillText(legend_ma20, rect.right, rect.bottom / 2);

	var legend_ma10 = "MA10:" + (this.data.avg_10 || "--");
	context.fillStyle = "#cd8e06";
	var lengend_ma10_x = rect.right - context.measureText(legend_ma20).width - rect.right * 0.01;
	context.fillText(legend_ma10, lengend_ma10_x, rect.bottom / 2);

	var legend_ma5 = "MA5:" + (this.data.avg_5 || "--");
	context.fillStyle = "#00ace5";
	var lengend_ma5_x = lengend_ma10_x - context.measureText(legend_ma10).width - rect.right * 0.01;
	context.fillText(legend_ma5, lengend_ma5_x, rect.bottom / 2);

	context.textAlign = "start";
};

KLineDrawPoint.prototype.getDataTopY = function (legendrect) {
	return legendrect.bottom;
}

/**
 *日期可绘制点
 *  */
function DateDrawPoint(datedata) {
	this.data = datedata;
	this.values = [];
	this.max = 0;
	this.min = 0;
	return this;
};

DateDrawPoint.prototype.getShowY = function () {
	return null;
};

DateDrawPoint.prototype.draw = function (context, last_drawpoint) {};

/**
 *VOL可绘制点
 *  */
function VOLDrawPoint(voldata) {
	this.data = voldata;
	this.values = [voldata.amount, 0];
	this.max = voldata.amount;
	this.min = 0;
	return this;
};

VOLDrawPoint.prototype.getShowY = function () {
	return null;
};

VOLDrawPoint.prototype.draw = function (context, last_drawpoint) {
	var postion_amont = this.postions[0];
	var postion_zero = this.postions[1];

	var half_max_width = this.width * 3 / 8;

	if (this.data.close < this.data.open) {
		context.fillStyle = "#45b66e";
	} else if (this.data.close > this.data.open) {
		context.fillStyle = "#e43006";
	} else {
		if (this.data.open > (last_drawpoint ? last_drawpoint.data.close : 0)) {
			context.fillStyle = "#e43006";
		} else {
			context.fillStyle = "#45b66e";
		}
	}

	context.beginPath();
	context.rect(this.x - half_max_width, postion_amont, half_max_width * 2, postion_zero - postion_amont);
	context.fill();
};

/**
 *KDJ数据课绘制点
 *  */
function KDJDrawPoint(kdjdata) {
	this.data = kdjdata;
	this.values = [kdjdata.k, kdjdata.d, kdjdata.j];
	this.max = Math.max(Math.max(kdjdata.k, kdjdata.d), kdjdata.j);
	this.min = Math.min(Math.min(kdjdata.k, kdjdata.d), kdjdata.j);
	return this;
}

KDJDrawPoint.prototype.getShowY = function () {
	return null;
};

KDJDrawPoint.prototype.draw = function (context, last_drawpoint) {
	var kdj_colors = ["#ceac38", "#39a9cd", "#d158cb"];
	for (var i = 0; i < this.postions.length; i++) {
		if (last_drawpoint && last_drawpoint.postions[i]) {
			context.strokeStyle = kdj_colors[i];
			context.beginPath();
			context.moveTo(last_drawpoint.x, last_drawpoint.postions[i]);
			context.lineTo(this.x, this.postions[i]);
			context.stroke();
		}
	};
};

KDJDrawPoint.prototype.drawlegend = function (context, rect, istouch, align) {
	if (!istouch) {
		context.textAlign = "left";
		context.textBaseline = "middle";
		context.fillStyle = "black";
		context.fillText("KDJ(9,3,3)", 0, rect.bottom / 2);
		return;
	}

	var legend_k = " K:" + (this.data.k ? this.data.k.toFixed(2) : "--");
	var legend_d = " D:" + (this.data.d ? this.data.d.toFixed(2) : "--");
	var legend_j = " J:" + (this.data.j ? this.data.j.toFixed(2) : "--");

	context.textAlign = align;
	if (align == "left") {
		context.fillStyle = "#ceac38";
		var legend_k_postion = 0;
		context.fillText(legend_k, legend_k_postion, rect.bottom / 2);

		context.fillStyle = "#39a9cd";
		var legend_d_postion = context.measureText(legend_k).width + rect.right * 0.01;
		context.fillText(legend_d, legend_d_postion, rect.bottom / 2);

		context.fillStyle = "#d158cb";
		var legend_j_postion = legend_d_postion + context.measureText(legend_d).width + rect.right * 0.01;
		context.fillText(legend_j, legend_j_postion, rect.bottom / 2);
	} else if (align == "right") {
		context.fillStyle = "#d158cb";
		var legend_j_postion = rect.right;
		context.fillText(legend_j, legend_j_postion, rect.bottom / 2);

		context.fillStyle = "#39a9cd";
		var legend_d_postion = rect.right - context.measureText(legend_j).width - rect.right * 0.01;
		context.fillText(legend_d, legend_d_postion, rect.bottom / 2);

		context.fillStyle = "#ceac38";
		var legend_k_postion = legend_d_postion - context.measureText(legend_d).width - rect.right * 0.01;
		context.fillText(legend_k, legend_k_postion, rect.bottom / 2);
		context.textAlign = 'left';
	}
};

/**
 *MACD数据课绘制点
 *  */
function MACDDrawPoint(macddata) {
	this.data = macddata;
	this.max = Math.max(Math.max(macddata.dif, macddata.dea), macddata.macd);
	this.min = -this.max;
	this.values = [macddata.dif, macddata.dea, macddata.macd, 0];
	return this;
}

MACDDrawPoint.prototype.getShowY = function () {
	return null;
};

MACDDrawPoint.prototype.draw = function (context, last_drawpoint) {
	var half_max_width = this.width * 3 / 8;

	var macd_colors = ["#fdbc54", "#13c0ea"];
	for (var i = 0; i < 2; i++) {
		if (last_drawpoint && last_drawpoint.postions[i]) {
			context.strokeStyle = macd_colors[i];
			context.beginPath();
			context.moveTo(last_drawpoint.x, last_drawpoint.postions[i]);
			context.lineTo(this.x, this.postions[i]);
			context.stroke();
		}
	};

	if (this.values[2] > 0) {
		context.fillStyle = "#e43006";
	} else {
		context.fillStyle = "#45b66e";
	}
	context.beginPath();
	context.rect(this.x - half_max_width, Math.min(this.postions[3], this.postions[2]), half_max_width * 2, Math.abs(this.postions[3] - this.postions[2]));
	context.fill();
};

MACDDrawPoint.prototype.drawlegend = function (context, rect, istouch, align) {
	if (!istouch) {
		context.textAlign = "left";
		context.textBaseline = "middle";
		context.fillStyle = "black";
		context.fillText("MACD(12,26,9)", 0, rect.bottom / 2);
		return;
	}

	var legend_dif = "DIF:" + this.data.dif || "--";
	var legend_dea = "DEA:" + this.data.dea || "--";
	var legend_macd = "MACD:" + this.data.macd || "--";

	context.textAlign = align;

	if (align == "left") {
		context.fillStyle = "#ceac38";
		var legend_dif_postion = 0;
		context.fillText(legend_dif, legend_dif_postion, rect.bottom / 2);

		context.fillStyle = "#39a9cd";
		var legend_dea_postion = context.measureText(legend_dif).width + rect.right * 0.01;
		context.fillText(legend_dea, legend_dea_postion, rect.bottom / 2);

		context.fillStyle = "#d158cb";
		var legend_macd_postion = legend_dea_postion + context.measureText(legend_dea).width + rect.right * 0.01;
		context.fillText(legend_macd, legend_macd_postion, rect.bottom / 2);

	} else if (align == "right") {
		context.fillStyle = "#d158cb";
		var legend_macd_postion = rect.right;
		context.fillText(legend_macd, legend_macd_postion, rect.bottom / 2);

		context.fillStyle = "#39a9cd";
		var legend_dea_postion = rect.right - context.measureText(legend_macd).width - rect.right * 0.01;
		context.fillText(legend_dea, legend_dea_postion, rect.bottom / 2);

		context.fillStyle = "#ceac38";
		var legend_dif_postion = legend_dea_postion - context.measureText(legend_dea).width - rect.right * 0.01;
		context.fillText(legend_dif, legend_dif_postion, rect.bottom / 2);
		context.textAlign = 'left';
	}
};


/**
 * KDJ的数据
 * @param {Array}  datas  K线数据
 * @param {Number} k_days K周期
 * @param {Number} d_days D周期
 * @param {Number} j_days J周期
 */
function KDJ(datas, k_days, d_days, j_days) {
	this.datas = datas;
	this.k_days = k_days || 9;
	this.d_days = d_days || 3;
	this.j_days = j_days || 3;
	this._calculate();
}

/**
 * 计算KDJ
 */
KDJ.prototype._calculate = function () {
	this.pointlist = [];
	if (!this.datas || this.datas.length == 0) {
		return;
	}
	var k = this._getRSV(this.datas.slice(0, 1));
	var d = k;
	for (var i = 0; i < this.datas.length; i++) {
		var rsv = this._getRSV(this.datas.slice(0, i + 1));
		k = 2 * k / 3 + rsv / 3;
		d = 2 * d / 3 + k / 3;
		var j = 3 * k - 2 * d;
		var date = this.datas[i].enddate;
		var kdjpoint = {
			k: k,
			d: d,
			j: j,
			date: date
		};
		this.pointlist.push(kdjpoint);
	};
};

/**
 * 计算RSV
 * @param   {Object} subLine 数据
 * @returns {Number} rsv
 */
KDJ.prototype._getRSV = function (subLine) {
	var len = subLine.length;
	var kline = subLine[len - 1];
	var close = kline.close;
	var high = kline.high;
	var low = kline.low;

	var step = 0;

	if (length > this.k_days) {
		step = length - this.kDays;
	}
	for (; step < length; step++) {
		kline = subLine[step];

		if (kline.high > high) {
			high = kline.high;
		}
		if (kline.low < low) {
			low = kline.low;
		}
	}
	if (high == low) {
		return 0;
	} else {
		return (close - low) * 100 / (high - low);
	}
};

/**
 * 获取完成的数据点
 * @returns {Array} 计算完成的数据点
 */
KDJ.prototype.getPointList = function () {
	return this.pointlist;
};


/**
 * MACD的数据
 * @param {Array}  datas        K线数据
 * @param {Number} short_period 短周期
 * @param {Number} long_period  长周期
 * @param {Number} mid_period   dea周期
 */
function MACD(datas, short_period, long_period, mid_period) {
	//K线数据
	this.datas = datas;
	//短周期
	this.short_period = short_period || 12;
	//长周期
	this.long_period = long_period || 26;
	//dea周期
	this.mid_period = mid_period || 9;
	this._calculate();
};


/**
 * MACD计算
 */
MACD.prototype._calculate = function () {
	this.pointlist = [];
	if (!this.datas || this.datas.length == 0) {
		return;
	}
	var short_period_list = this._getEXPMAFromKline(this.datas, this.short_period);
	var long_period_list = this._getEXPMAFromKline(this.datas, this.long_period);
	var diff_list = [];
	for (var i = 0; i < this.datas.length; i++) {
		diff_list.push(short_period_list[i] - long_period_list[i]);
	};
	var dea_list = this._getEXPMA(diff_list, this.mid_period);
	for (var i = 0; i < this.datas.length; i++) {
		var dif = diff_list[i];
		var dea = dea_list[i];
		var date = this.datas[i].enddate;
		var macd_point = {
			dif: dif.toFixed(3),
			dea: dea.toFixed(3),
			macd: ((dif - dea) * 2).toFixed(3),
			date: date
		};
		this.pointlist.push(macd_point);
	};

};

/**
 * 通过Kline计算EXPMA
 * @param   {Array}  datas 原始数据
 * @param   {Number} days 计算天数
 * @returns {Array}  改变后的数据
 */
MACD.prototype._getEXPMAFromKline = function (datas, days) {
	var explist = [];
	// 计算出系数
	var k = 2 / (days + 1);
	//第一天ema等于当天收盘价
	var ema = datas[0].close;
	explist.push(ema);
	for (var i = 1; i < datas.length; i++) {
		ema = datas[i].close * k + ema * (1 - k);
		explist.push(ema);
	};
	return explist;
};


/**
 * 指数平均数指标
 * @param   {Array}  list 原始数据
 * @param   {Number} days 计算天数
 * @returns {Array}  改变后的数据
 */
MACD.prototype._getEXPMA = function (list, days) {
	var explist = [];
	// 计算出系数
	var k = 2 / (days + 1);
	//第一天ema等于当天收盘价
	var ema = list[0];
	explist.push(ema);
	for (var i = 1; i < list.length; i++) {
		ema = list[i] * k + ema * (1 - k);
		explist.push(ema);
	};
	return explist;
};

/**
 * 获取计算完成的数据点
 * @returns {Array} 计算完成的数据点
 */
MACD.prototype.getPointList = function () {
	return this.pointlist;
};

/**
 * K线
 * @param {Array} datas 原始数据
 */
function KLine(datas) {
	this.datas = datas;
	this._calculate();
};

/**
 * 计算K线点
 */
KLine.prototype._calculate = function () {
	//endDate,open,high,low,close,amount,money
	var temp_datas = [];
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
		temp_datas.push(item);
	}
	this.pointlist = temp_datas;
};

/**
 * 获取计算完成的K线点Array
 * @returns {Array} K线点
 */
KLine.prototype.getPointList = function () {
	return this.pointlist;
};


/**
 * 格式化代码
 * @param {Number} num 大数据
 */
function BigNumberFormat(num) {
	this.num = num.toFixed(2);
	this.unit = '';
	var absnum = Math.abs(num);
	if (absnum < 10000) {
		this.num = num.toFixed(0);
	} else if (absnum >= 10000 && absnum < 100000000) {
		this.num = (num / 10000).toFixed(1);
		this.unit = '万';
	} else if (absnum >= 100000000 && absnum < 100000000000) {
		this.num = (num / 100000000).toFixed(2);
		this.unit = '亿';
	} else {
		this.num = (num / 100000000000).toFixed(2);
		this.unit = '千亿';
	}
}

BigNumberFormat.prototype.toString = function () {
	return this.num + this.unit;
}
