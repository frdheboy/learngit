/**
 * 股票交易
 */
function StockMarketPriceTrade() {
	var userinfo = JSON.parse(localStorage.getItem("userinfo_currect"));
	this.userid = userinfo.userid;
	this.sessionid = userinfo.sessionid;
	this.token = '';
}

/**
 * 查询持仓股票列表
 * @param {Object} callback 插叙完成回调
 */
StockMarketPriceTrade.prototype.queryHoldStocks = function (callback) {
	var self = this,
		g = new GalHttpRequest('http://220.181.47.36/youguu/simtrade/showmystock/{ak}/{sid}/{userid}/{matchid}', {
			ak: config_other.ak_new,
			sid: self.sessionid,
			userid: self.userid,
			matchid: '1'
		});
	g.requestFromNet({
		succeed: function (data) {
			console.log(data);
			callback(data.result)
		},
		error: function (error) {
			console.log(error);
		}
	});
}

/**
 * 查询股票信息
 * @param {String} stockcode 股票代码
 */
StockMarketPriceTrade.prototype.queryStockInfo4sell = function (stockcode, callback) {
	this.stockcode = stockcode;
	this.token = '';
	var self = this,
		g = new GalHttpRequest('http://220.181.47.36/youguu/trade/sell/query?matchid={matchid}&stockcode={stockcode}&category={category}', {
			matchid: '1',
			stockcode: stockcode,
			category: '1'
		});
	g.requestFromNet({
		succeed: function (data) {
			if (callback) {
				callback(data.result);
			}
			self.token = data.token;
		},
		error: function (error) {
			console.log(error);
		}
	});
}

/**
 * 出售股票
 * @param {Number} amount 出售数量
 */
StockMarketPriceTrade.prototype.sell = function (amount, callback) {
	console.log(this.token);
	var self = this,
		g = new GalHttpRequest('http://220.181.47.36/youguu/trade/sell/submit_cur?matchid={matchid}&stockcode={stockcode}&amount={amount}&token={token}', {
			matchid: '1',
			stockcode: self.stockcode,
			amount: amount,
			token: self.token
		});
	g.requestFromNet({
		succeed: function (data) {
			if (callback) {
				callback(data);
			}
		},
		error: function (error) {
			console.log(error);
		}
	});
}

/**
 * 查询股票信息
 * @param {String} stockcode 股票代码
 * @param {Object} callback  查询成功数据回调
 */
StockMarketPriceTrade.prototype.queryStockInfo4buy = function (stockcode, callback) {
	this.stockcode = stockcode;
	this.token = '';
	var self = this,
		g = new GalHttpRequest('http://220.181.47.36/youguu/trade/buy/query?matchid={matchid}&stockcode={stockcode}', {
			matchid: '1',
			stockcode: stockcode
		});
	g.requestFromNet({
		succeed: function (data) {
			console.log(data.result);
			if (callback) {
				callback(data.result);
			}
			self.token = data.token;
		},
		error: function (error) {
			console.log(error);
		}
	});
}

/**
 * 购买股票
 * @param {Number} money 需要购买总价格
 */
StockMarketPriceTrade.prototype.buy = function (money, callback) {
	if (!this.token) {
		return;
	}
	var self = this,
		g = new GalHttpRequest('http://220.181.47.36/youguu/trade/buy/submit_cur?matchid={matchid}&stockcode={stockcode}&frozenfund={frozenfund}&token={token}', {
			matchid: '1',
			stockcode: self.stockcode,
			frozenfund: money,
			token: self.token
		});
	g.requestFromNet({
		succeed: function (data) {
			console.log(data);
			if (callback) {
				callback(data);
			}
		},
		error: function (error) {
			console.log(error);
		}
	});
}
