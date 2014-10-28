function PersonalProfitChart(id) {
	this.id = id;
	this._init();
}

PersonalProfitChart.prototype._init = function () {
	var selector = $('#' + this.id),
		canvas = selector[0],
		dpi = window.devicePixelRatio || 1;
	canvas.width = selector.width();
	canvas.height = selector.height();
	this.height = canvas.height * dpi;
	this.width = canvas.width * dpi;
	this.dpi = dpi;
	this._ctx = canvas.getContext('2d');
	this._get();
}

PersonalProfitChart.prototype._get = function () {
	var userinfo = getUserInfo(),
		g = new GalHttpRequest(config_url.profitline, {
			userid: userinfo.userid,
			matchid: 1,
			date: "",
			reqnum: 60,
			pflag: -1
		}),
		self = this;
	g.requestFromNet({
		succeed: function (data) {
			console.log(data);
			self._datas = data.result;
			self._draw();
		},
		error: function (error) {
			console.log(error);
		}
	});
}

PersonalProfitChart.prototype._calculate = function () {
	var max, min, i = 0;
	if (this._datas.length === 1) {
		this._datas.push(this._datas[0]);
	}
	for (; i < this._datas.length; i++) {
		var temp_data = this._datas[i],
			temp_max = Math.max(temp_data.avgProfit, temp_data.myProfit),
			temp_min = Math.min(temp_data.avgProfit, temp_data.myProfit);
		if (i === 0) {
			max = temp_max;
			min = temp_min;
		} else {
			max = Math.max(temp_max, max);
			min = Math.min(temp_min, min);
		}
	}
	//上下偏移5%;
	var offset = (max - min) * 0.02;
	max = max + offset;
	min = min - offset;

	var left = 0,
		bottom = 20,
		scales_y = [];
	for (i = 0; i < 6; i++) {
		var value = (min + (max - min) * i / 4),
			text = (value * 100).toFixed(2) + '%',
			y = (this.height - bottom) * (4 - i) / 4,
			left = Math.max(this._ctx.measureText(text).width, left);
		scales_y.push({
			text: text,
			y: y
		});
	}

	var scales_x = [];
	for (i = 0; i < 5; i++) {
		console.log(Math.floor(this._datas.length * i / 3));
		var date = this._datas[Math.min(Math.floor((this._datas.length - 1) * i / 3), 59)].date,
			x = (this.width - left) * i / 3 + left;
		if (i !== 0 && i !== 3) {
			date = date.substr(4);
		}
		scales_x.push({
			text: date,
			x: x
		});
	}

	var perHeight = (this.height - bottom) / (max - min);
	var perWidth = (this.width - left) / (this._datas.length - 1);
	var points = [];
	for (i = 0; i < this._datas.length; i++) {
		var temp_data = this._datas[i];
		points.push({
			x: perWidth * i + left,
			y_avg: (max - temp_data.avgProfit) * perHeight,
			y_my: (max - temp_data.myProfit) * perHeight
		});
	}
	this._left = left;
	this._bottom = bottom;
	console.log(scales_x);
	this._scales_x = scales_x;
	this._scales_y = scales_y;
	this._points = points;
	console.log(points);
}

PersonalProfitChart.prototype._draw = function () {
	this._calculate();
	this._ctx.clearRect(0, 0, this.width, this.height);
	var i = 0;

	this._ctx.lineWidth = 1;
	this._ctx.strokeStyle = '#E7E7E7';
	this._ctx.strokeRect(this._left, 0, this.width - this._left, this.height - this._bottom);
	this._ctx.beginPath();

	this._ctx.textAlign = 'right';
	for (i = 0; i < this._scales_y.length; i++) {
		var scale_y = this._scales_y[i];
		this._ctx.beginPath();
		this._ctx.moveTo(this._left, scale_y.y);
		this._ctx.lineTo(this.width, scale_y.y);
		this._ctx.stroke();
		if (i === this._scales_y.length - 2) {
			this._ctx.textBaseline = 'top';
		}
		this._ctx.fillStyle = scale_y.text.indexOf('-') === -1 ? 'red' : 'green';
		this._ctx.fillText(scale_y.text, this._left, scale_y.y);
	}

	for (i = 0; i < this._scales_x.length; i++) {
		var scale_x = this._scales_x[i];
		this._ctx.beginPath();
		this._ctx.moveTo(scale_x.x, 0);
		this._ctx.lineTo(scale_x.x, this.height - this._bottom);
		this._ctx.stroke();
		if (i === 0) {
			this._ctx.textAlign = 'left';
		} else if (i === 3) {
			this._ctx.textAlign = 'right';
		} else {
			this._ctx.textAlign = 'center';
		}
		this._ctx.fillText(scale_x.text, scale_x.x, this.height - 0.5 * this._bottom);
	}

	this._ctx.textAlign = 'left';

	for (i = 0; i < this._points.length; i++) {
		var temp_point = this._points[i];
		if (i === 0) {
			this._ctx.moveTo(temp_point.x, temp_point.y_my);
		} else {
			this._ctx.lineTo(temp_point.x, temp_point.y_my);
		}
	}
	this._ctx.lineWidth = 2 * this.dpi;
	this._ctx.strokeStyle = '#00B3FA';
	this._ctx.stroke();
	this._ctx.lineTo(this._points[this._points.length - 1].x, this.height - this._bottom);
	this._ctx.lineTo(this._points[0].x, this.height - this._bottom);
	this._ctx.closePath();
	this._ctx.fillStyle = 'RGBA(0, 179, 250, 0.3)';
	this._ctx.fill();

	this._ctx.beginPath();
	for (i = 0; i < this._points.length; i++) {
		var temp_point = this._points[i];
		if (i === 0) {
			this._ctx.moveTo(temp_point.x, temp_point.y_avg);
		} else {
			this._ctx.lineTo(temp_point.x, temp_point.y_avg);
		}
	}
	this._ctx.strokeStyle = '#F6A72F';
	this._ctx.stroke();
}