var vm = new Vue({
	el: '#collect',
	data: {
		loading: true,
		searchMsg: { // 全局搜索
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				ShopId: '',
				F_SearchContent: '',
				sord: 'desc',
				sidx: '',
				page: 1,
				rows: 20,
			}
		},
		SearchHistoryMsg: {	//搜索历史记录
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
			}
		},
		sfhistory: false,
		searchItem: [],
		ins: 0,
		orderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_SearchContent: '',
				F_OrderState: [0],
				F_OrderNo: '',
				rows: 20,
				page: 1
			}
		},
		orderListData: [],			// 用来缓存所有订单数据 不用多次请求接口
		orderData: [],
		cancelOrderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: ''
			}
		},
		dialogAddressVisible: false,
		addressMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId
			}
		},
		addressData: [],
		changeAddressMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: '',
				F_UsersAdressId: ''
			}
		},
		dialogPayVisible: false, // 支付弹窗
		dialogApplyVisible: false, // 申请退款弹窗
		applyData: [],
		applyOrderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: '',
				F_GoodsAttributeId: [],
				F_RefundRemark: '',
				F_Pictures: []
			}
		},
		orderMessage: {
			f_OriginalTotalPrice: '',
			f_Fee: '',
			f_OriginalCurrency: '',
			f_PayKey: '',
			f_PayType: '',
			f_OrderNo: ''
		},
		currencySign: '$',
		total: 0,
		page: 1,
		pagerOrderVisible: false, // 订单分页
		notOrder: false, // 订单页没有数据显示
		isFirst: true,
		payId: '',
		statusNum0: 0,
		statusNum1: 0,
		statusNum2: 0,
		statusNum3: 0,
		statusNum4: 0,
		statusNum5: 0,
		statusNumver0: 0,
		statusNumver1: 0,
		statusNumver2: 0,
		statusNumver3: 0,
		statusNumver4: 0,
		statusNumver5: 0,
		sfLang: {
			// html
			search: '搜索',
			myOrder: '我的精灵',
			orderNum: '请输入商品名称',
			all: '全部',
			payment: '待付款',
			delivered: '待发货',
			received: '待收货',
			comment: '待评价',
			afterSale: '售后',
			ordnum: '订单号',
			payway: '付款方式',
			payway2: 'paypal',
			payway1: '货到付款',
			proNum: '商品数量',
			zongji: '单价',
			proSku: '商品属性',
			changeAdd: '更改地址',
			pay: '付款',
			cancel: '取消订单',
			viewLog: '查看物流',
			refund: '申请退款',
			refoudSuccess: '申请退款成功',
			refoudFail: '申请退款失败',
			confirm: '确认收货',
			pingjia: '评价',
			status5: '已拒签',
			status6: '已取消',
			status7: '审核中',
			status8: '审核失败',
			status9: '售后处理中',
			status10: '售后完成',
			status11: '订单完成',
			// status12: '已付款，系统延迟',
			// 弹窗
			// xiugaiAdd: '修改地址',
			queding: '确定',
			quxiao: '取消',
			tuikuanliyou: '退款理由',
			shanchu: '取消成功',
			liyou: '请填写申请理由',
			youwu: '订单状态有误',
			qdqx: '确认取消订单吗',
			jinggao: '警告',
			sfdel: '是否删除',
			tishi: '提示',
			include: '含手续费',
			notOrder: '暂无订单',
			sfheji: '合计',
			sfersongyi: '买二送一',
			sferbanjia: '第二件半价',
			sfErrorTip: '商品已在处理中，如需取消请联系客服',
			sfMai: '买家已付款',
			sfxia: '买家已下单',
			sfkefu: '客服',
			adrSuccess: '修改成功',
			adrError: '修改失败',
			adrDefault: '默认地址',
			sfserhis: '搜索历史',
		}
	},
	created: function() {
		// 页面翻译
		var that = this;
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
			vm.orderMsg.data.F_ShopId = res.data.f_ShopId // 收藏
			vm.currencySign = res.data.f_CurrencySign
			vm.payId = res.data.f_OnlinePayType[0].f_PayKey
			online_paypal(vm.payId)
			
			//搜索历史记录
			getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
				vm.searchItem = res.data
			})
			
			getOrders(vm.orderMsg).then(function(res) {
				if (res.info == 10) {
					vm.loading = false
					vm.pagerOrderVisible = true
					vm.notOrder = false
					vm.orderData = res.data.rows
					vm.orderListData = res.data.rows
					for (var i = 0; i < vm.orderData.length; i++) {
						vm.orderData[i].f_OrderCreateTime = format(new Date(vm.orderData[i].f_OrderCreateTime), 'yyyy/MM/dd HH:mm:ss')
						var orderDetailData = vm.orderData[i].orderDetail
						for (var k = 0; k < orderDetailData.length; k++) {
							orderDetailData[k].sku = Object.values(orderDetailData[k].attribute).join(', ')
						}
					}
					vm.total = res.data.total * 10
					
					// 各个状态的数量
					vm.statusNumver0 = vm.statusNum0 = res.data.f_OrderNums[0].f_Num
					vm.statusNumver1 = vm.statusNum1 = res.data.f_OrderNums[1].f_Num
					vm.statusNumver2 = vm.statusNum2 = res.data.f_OrderNums[2].f_Num
					vm.statusNumver3 = vm.statusNum3 = res.data.f_OrderNums[3].f_Num
					vm.statusNumver4 = vm.statusNum4 = res.data.f_OrderNums[4].f_Num
					vm.statusNumver5 = vm.statusNum5 = res.data.f_OrderNums[5].f_Num
				} else {
					vm.loading = false
					vm.pagerOrderVisible = false
					vm.notOrder = true
				}
			})
		})
	},
	methods: {
		//售后跳转客服点击事件
		toService: function(orderno) {
			window.location.href = "./service.html?no=" + orderno + '&type=2'
		},
		// 如果已支付或者货到付款 会做一个提示框
		handleTip: function(orderno) {
			this.$confirm(this.sfLang.sfErrorTip, this.sfLang.tishi, {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(function() {
				window.location.href = "./service.html?no=" + orderno + '&type=2'
			}).catch(function() {})
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		},
		// 搜索
		searchBtn: function() {
			if (this.searchMsg.data.F_SearchContent.trim() == '') {
				return
			} else {
				window.location.href = './list.html?page0_id=' + this.searchMsg.data.F_SearchContent
			}
		},
		//搜索历史
		searchLsit: function(content) {
			setTimeout(function(){
				getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
					vm.searchItem = res.data
				})
			},100)
			window.location.href = './list.html?page0_id=' + content;
		},
		sfsearch: function() {
			vm.sfhistory = true
		},
		nosfsearch: function() {
			setTimeout(function(){
				vm.sfhistory = false
			},100)
		},
		inputsfsearch: function() {
			if (this.searchContent.trim() == '') {
				vm.sfhistory = true
			}else{
				vm.sfhistory = false
			}
		},
		changePage: function(val) { // 分页
			var back = document.querySelector('.backTop')
			back.scrollTop = 0
			this.page = val
			this.getOrderData()
			vm.orderMsg.data.page = val
		},
		getOrderData: function() {
			this.notOrder = false
			this.pagerOrderVisible = false

			getOrders(vm.orderMsg).then(function(res) {
				if (res.info == 10) {
					vm.orderData = res.data.rows
					if(res.data.rows.length == 0){
						vm.pagerOrderVisible = false
						vm.notOrder = true
						return
					}
					for (var i = 0; i < vm.orderData.length; i++) {
						var orderDetailData = vm.orderData[i].orderDetail
						for (var k = 0; k < orderDetailData.length; k++) {
							orderDetailData[k].sku = Object.values(orderDetailData[k].attribute).join(', ')
						}
					}
					
					vm.total = res.data.total * 10
					vm.pagerOrderVisible = true
					vm.notOrder = false
					
					// 特殊处理
					if (vm.orderMsg.data.F_OrderState[0] == 4) {
						if (vm.statusNum4 == 0) {
							vm.orderData = []
							vm.pagerOrderVisible = false
							vm.notOrder = true
						}
					}
				} else {
					vm.orderData = []
					vm.pagerOrderVisible = false
					vm.notOrder = true
				}
			})
			// })
		},
		searchOrder: function(e) { // 订单或商品搜索
			this.orderData = []
			this.notOrder = false
			this.pagerOrderVisible = false
			if(vm.orderMsg.data.F_SearchContent.trim() == ''){
				vm.statusNum0 = vm.statusNumver0
				vm.statusNum1 = vm.statusNumver1
				vm.statusNum2 = vm.statusNumver2
				vm.statusNum3 = vm.statusNumver3
				vm.statusNum4 = vm.statusNumver4
				vm.statusNum5 = vm.statusNumver5
			}
			getOrders(vm.orderMsg).then(function(res) {
				if (res.info == 10) {
					vm.orderData = res.data.rows
					if(res.data.rows.length == 0){
						vm.pagerOrderVisible = false
						vm.notOrder = true
						// 各个状态的数量
						vm.statusNum0 = 0
						vm.statusNum1 = 0
						vm.statusNum2 = 0
						vm.statusNum3 = 0
						vm.statusNum4 = 0
						vm.statusNum5 = 0
						return
					}
					for (var i = 0; i < vm.orderData.length; i++) {
						var orderDetailData = vm.orderData[i].orderDetail
						for (var k = 0; k < orderDetailData.length; k++) {
							orderDetailData[k].sku = Object.values(orderDetailData[k].attribute).join(', ')
						}
					}
					vm.total = res.data.total * 10
					vm.pagerOrderVisible = true
					vm.notOrder = false
					// 各个状态的数量
					vm.statusNum0 = res.data.f_OrderNums[0].f_Num
					vm.statusNum1 = res.data.f_OrderNums[1].f_Num
					vm.statusNum2 = res.data.f_OrderNums[2].f_Num
					vm.statusNum3 = res.data.f_OrderNums[3].f_Num
					vm.statusNum4 = res.data.f_OrderNums[4].f_Num
					vm.statusNum5 = res.data.f_OrderNums[5].f_Num
				} else {
					vm.orderData = []
					vm.pagerOrderVisible = false
					vm.notOrder = true
				}
			})
		},
		orderTab: function(state) { // 我的订单切换
			this.orderMsg.data.F_SearchContent = ''
			if (state == this.ins) return
			this.orderData = []
			this.page = 1
			this.ins = state
			this.orderMsg.data.page = 1
			if (state != 99) {
				// 获取售后数据
				this.orderMsg.data.F_OrderState = [state]
			} else {
				this.orderMsg.data.F_OrderState = [7,8,9,10]
			}
			this.getOrderData()
			vm.statusNum0 = vm.statusNumver0
			vm.statusNum1 = vm.statusNumver1
			vm.statusNum2 = vm.statusNumver2
			vm.statusNum3 = vm.statusNumver3
			vm.statusNum4 = vm.statusNumver4
			vm.statusNum5 = vm.statusNumver5
		},
		toOrderPage: function(no) { // 跳转订单详情
			window.open('./orderInfo.html?no=' + no)
		},
		// 更改地址弹窗
		showDialogAddress: function(f_OrderNo, addrName, addrTel, addr) { 
			this.dialogAddressVisible = true
			this.changeAddressMsg.data.F_OrderNo = f_OrderNo

			getUsersAdressDetail(vm.addressMsg).then(function(res) {
				if (res.info == 10) {
					vm.addressData = res.data
					for (var i in vm.addressData) {
						if (addrName == vm.addressData[i].f_ReceiveName && addrTel == vm.addressData[i].f_ReceiveTel && addr == vm.addressData[i].f_ReceiveAddress) {
							vm.changeAddressMsg.data.F_UsersAdressId = vm.addressData[i].f_Id
						}
					}
				}
			})
		},
		changeAddress: function() { // 更改地址
		var that = this
			editOrderAdress(vm.changeAddressMsg).then(function(res) {
				if (res.info == 10) {
					that.$message.success(vm.sfLang.adrSuccess)
					vm.getOrderData()
					vm.changeAddressMsg.data.F_OrderNo = ''
					vm.changeAddressMsg.data.F_UsersAdressId = ''
					vm.dialogAddressVisible = false
				} else {
					that.$message.error(vm.sfLang.adrSuccess)
				}
			})
		},
		cancelOrder: function(orderNo) { // 取消订单
			var that = this
			that.$confirm(vm.sfLang.qdqx, vm.sfLang.jinggao, {
				confirmButtonText: vm.sfLang.queding,
				cancelButtonText: vm.sfLang.quxiao,
				type: 'warning'
			}).then(function() {
				vm.cancelOrderMsg.data.F_OrderNo = orderNo
				cancalOrder(vm.cancelOrderMsg).then(function(res) {
					if (res.info == 10) {
						vm.getOrderData()
						vm.statusNumver1 = vm.statusNum1 -= 1
						that.$message.success(vm.sfLang.shanchu)
					}
				})
			}).catch(function() {})
		},
		toPayPage: function(data) { // 支付弹窗
			this.dialogPayVisible = true

			this.orderMessage.f_OriginalTotalPrice = data.f_OriginalTotalPrice
			this.orderMessage.f_Fee = data.f_Fee
			this.orderMessage.f_OriginalCurrency = data.f_OriginalCurrency
			this.orderMessage.f_OrderNo = data.f_OrderNo
			this.orderMessage.f_PayKey = data.payTypeDetail[0].f_PayKey
			this.orderMessage.f_PayType = data.payTypeDetail[0].f_PayType
		},
		// 跳转物流页面
		toLogisticsPage: function(f_OrderNo) {
			window.open('./logistics.html?no=' + f_OrderNo)
		},
		// 跳转到评价
		toCommentPage: function(no) {
			window.open('./review.html?no=' + f_OrderNo)
		},
		// 跳转商品详情
		toDetailPage: function(id) {
			window.open('./details.html?id=' + id)
		},
		// 申请退款弹窗
		applyDialog: function(item) {
			this.dialogApplyVisible = true
			this.applyOrderMsg.data.F_OrderNo = item.f_OrderNo
			for (var i in item.orderDetail) {
				this.applyOrderMsg.data.F_GoodsAttributeId.push(item.orderDetail[i].f_GoodsAttributeId)
				this.applyOrderMsg.data.F_Pictures.push(item.orderDetail[i].f_GoodsImg)
				item.orderDetail[i].sku = (Object.values(item.orderDetail[i].attribute)).join(', ')
			}
			this.applyData = item.orderDetail
		},
		// 申请退款
		applyHandle: function() {
			var that = this
			if (this.applyOrderMsg.data.F_RefundRemark.trim() == '') {
				this.$message.warning(vm.sfLang.liyou)
				return
			}
			setOrderService(vm.applyOrderMsg).then(function(res) {
				if (res.info == 10) {
					vm.getOrderData()
					that.$message.success(vm.sfLang.refoudSuccess)
				} else if (res.info == 15) {
					that.$message.warning(vm.sfLang.youwu)
				} else {
					that.$message.success(vm.sfLang.refoudFail)
				}
				vm.dialogApplyVisible = false
			})
		},
		// 关闭弹窗
		closeDialog: function() {
			this.dialogApplyVisible = false
			this.applyData = []
		}
	},
	filters: {
		numFilter: function(value) {
			var realVal = ''
			if (value) {
				realVal = parseFloat(value).toFixed(2)
			}
			return realVal
		}
	}
})

var title = document.querySelectorAll('.title li');
var all = document.querySelectorAll('.all-all');

for (var i = 0; i < title.length; i++) {
	title[i].setAttribute("onclick", "changcolor(" + i + ")");
}

function changcolor(id) {
	for (var i = 0; i < 6; i++) {
		title[i].style.color = "#333333";
		title[i].style.borderBottom = "2px solid #D3D3D3";
		all[i].style.display = "none";
	}
	title[id].style.color = "#FF5230";
	title[id].style.borderBottom = "3px solid #ff5230";
	all[id].style.display = "block";
}


var changeOrder = {
	token: '',
	loginMark: loginMark,
	data: {
		F_OrderNo: '',
		F_PayType: 2,
		F_PayTransactionId: '',
		F_PayTime: '',
		F_PayerID: ''
	}
}
function online_paypal(clientId) {
	paypal.Button.render({
		env: 'production',
		client: {
			// sandbox: clientId,
			production: clientId
		},
		locale: 'en_US',
		style: {
			size: 'medium',
			color: 'white',
			shape: 'pill',
			label: 'paypal',
			tagline: false
		},
		commit: true,
		payment: function(data, actions) {
			return actions.payment.create({
				transactions: [{
					amount: {
						total: vm.$data.orderMessage.f_OriginalTotalPrice,
						currency: vm.$data.orderMessage.f_OriginalCurrency
					}
				}]
			});
		},
		onAuthorize: function(data, actions) {
			return actions.payment.execute().then(function(resp) {
				
				changeOrder.data.F_PayTransactionId = resp.id;
				changeOrder.data.F_PayerID = resp.id;
				changeOrder.data.F_PayTime = resp.create_time;
				changeOrder.data.F_OrderNo = vm.$data.orderMessage.f_OrderNo
				changePaymentOrder(changeOrder).then(function(resp) {
					if (resp.info == 10) {
						window.location.href = './successpay.html'
					} else {
						window.location.href = './fail.html?no='+changeOrder.data.F_OrderNo+'&type=2&payId='+changeOrder.data.F_PayerID+'&timer='+changeOrder.data.F_PayTime
					}
					vm.$data.dialogPayVisible = false
				})
			});
		},
		onCancel: function(data, actions) {
			vm.$data.dialogPayVisible = false
		}
	}, '#paypal-button');
}

