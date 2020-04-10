var vm = new Vue({
	el: '#orderDetail',
	data: {
		orderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_SearchContent: '',
				F_OrderState: [0],
				F_OrderNo: getRequest().no,
				rows: 100,
				page: 1
			}
		},
		orderDetailData: {},
		orderLogisticsMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: getRequest().no
			}
		},
		receiveTime: '',
		discount: 0,			// 活动优惠
		currencySign: '$',
		logzhuangtai: '',
		sfLang: {
			orderDetail: '订单详细信息',
			orderInfo: '订单信息',
			OrderNo: '订单号',
			OrderCreateTime: '订单时间',
			paypal: '付款方式',
			daofu: '货到付款',
			deliveryTime: '交货时间',
			zhifuTime: '支付时间',
			LogisticsMsg: '物流信息',
			zhuangtai: '物流状态',
			buyerMsg: '买家信息',
			liuyan: '买家留言',
			orderInfo: '订单信息',
			name: '姓名',
			phone: '手机号',
			address: '地址',
			proMsg: '商品信息',
			proNum: '商品数量',
			proSku: '商品属性',
			total: '小计',
			totalAll: '合计',
			chuku: '出库中',
			cancelOrder: '暂无物流信息',
			sfshouxufei: '手续费',
			sfhuodong: '活动优惠',
			sfersongyi: '买二送一',
			sferbanjia: '第二件半价',
			service: '客服'
		}
	},
	created: function() {
		// 页面翻译
		var that = this;
		this.discount = this.discount.toFixed(2)
		var langArr = JSON.parse(localStorage.getItem('langArr'))
		if (langArr) {
			for (var i in that.sfLang) {
				for (var j in langArr) {
					if (that.sfLang[i] == langArr[j].f_CNMenuName) {
						that.sfLang[i] = langArr[j].f_MenuName
					}
				}
			}
		} else {
			getLanguage(that.sfLang)
		}
	},
	mounted: function() {
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.orderMsg.data.F_ShopId = res.data.f_ShopId // 订单详情
			vm.currencySign = res.data.f_CurrencySign
			getOrders(vm.orderMsg).then(function(res) {
				if (res.info == 10) {
					var data = res.data.rows[0]
					data.f_Fee = data.f_Fee.toFixed(2)
					var sum = 0
					for (var i in data.orderDetail) {
						data.orderDetail[i].sku = Object.values(data.orderDetail[i].attribute).join(', ')
						data.orderDetail[i].f_Total = (data.orderDetail[i].f_GoodsNum * data.orderDetail[i].f_SalePrice).toFixed(2)
						sum += parseFloat(data.orderDetail[i].f_Total)
					}
					var totalSum = (parseFloat(sum) - parseFloat(data.f_OriginalTotalPrice) + parseFloat(data.f_Fee)).toFixed(2)
					if (totalSum > 0) {
						vm.discount = totalSum
					}
					vm.orderDetailData = data
					if (data.f_OrderState == 6 || data.f_OrderState == 1) {
						vm.logzhuangtai = vm.sfLang.cancelOrder
					}
				}
			})
		})
		getOrderTrackingInfo(this.orderLogisticsMsg).then(function(res) {
			if (res.info == 10) {
				vm.logzhuangtai = res.data[0].f_TrackStatusName
				if (res.data[0].f_TrackStatus == 1) {
					vm.receiveTime = res.data[0].f_TrackTime
				}
			} else {
				vm.logzhuangtai = vm.sfLang.chuku
			}
		})
	},
	methods: {
		sftodetails: function(id){
			// window.location.href = './details.html?id='+id
			window.open('./details.html?id=' + id)
		},
		toServicePage: function(no) {
			window.open("./service.html?no=" + no + '&type=2')
		}
	}
})
