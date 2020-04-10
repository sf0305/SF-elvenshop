var vm = new Vue({
	el: '#orderDetail',
	data: {
		loading: false,
		dingdan: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_BuyGroupId: '',
				F_UserId: userId,
				F_ShopId: '',
				F_Currency: '',
				F_UsersAdressId: '',
				F_OrderState: '',
				F_PayType: '',
				F_Remark: '',
				OrderDetail: [],
				F_SaleUserId: '',
				F_OrderTerminal: 'PC',
				ShoppingCartDetail: []
			}
		},
		addressMsg: { // 获取地址请求参数
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId
			}
		},
		selectedAdr: {},			// 选择地址Id
		addDialogVisible: false, // 添加地址弹窗
		changeDialogVisible: true, // 选择地址弹窗
		issfpaypal: false,	//	在线支付弹窗
		addressData: [],
		addressDefalutData: {},
		addressEditMsg: { // 地址增删改接口请求参数
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				OperationType: '',
				F_ReceiveName: '',
				F_ReceiveTel: '',
				F_ReceiveCity: '',
				F_ReceiveProvince: '',
				F_ReceiveCountry: 'Thailand',
				F_ReceiveCode: '',
				F_ReceiveEmail: '',
				F_ReceiveAddress: '',
				F_ReceiveComName: '',
				F_IsDefalut: 0,
				F_Id: ''
			}
		},
		provinceData: [],			// 省份洲
		cityData: [],			// 城市
		shoppingData: [], // 商品数据
		orderAmountMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: []
		},
		f_TotalPrice: 0, //总价
		f_Fee: '', //手续费
		discount: 0,
		totalMoney: '',
		payDialogVisible: false,
		currencySign: '$',
		isClick: '',
		discountHide: false,
		notPay: false,
		isFirst: true,
		payId: '',
		cartMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: '',
				F_UserId: userId,
				rows: 20,
				page: 1
			}
		},
		addCartMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: '',
				F_UserId: userId,
				OperationType: 1, // 0:表示删除 1:表示添加 2:表示编辑
				ShopCartDetail: []
			}
		},
		sfLang: {
			myCart: '我的购物车',
			queren: '确认订单信息',
			finish: '成功提交订单',
			choose: '选择收货地址',
			guanli: '管理收货地址',
			genggai: '更改地址',
			moren: '默认地址',
			xiugai: '修改地址',
			xinadd: '新增地址',
			manageAdr: '管理地址',
			newAdd: '使用新地址',
			proMsg: '商品信息',
			proShu: '商品属性',
			proPri: '单价',
			proNum: '数量',
			proXiao: '小计',
			liuyan: '给卖家留言',
			input: '请输入留言',
			zaixian: '含手续费',
			heji: '合计',
			orderMethod: '支付方式',
			huodao: '货到付款',
			queding: '确定',
			quxiao: '取消',
			discount: '活动优惠',
			sfadrTip:	'只能添加20个地址',
			//新增地址弹窗
			xinzeng: '新增地址',
			sfmustnum: '必须为数字',
			shoujian: '收件人',
			shouji: '手机号码',
			city: '城市',
			province: '省份州',
			receiveComName: '公司名称',
			country: '国家',
			zip: '邮编',
			email: '邮箱',
			xiangxi: '详细地址',
			defalut: '是否选择为默认地址',
			noemy: '不能为空',
			addrSuccess: '添加成功',
			addrFail: '添加失败',
			addrChoose: '请添加地址',
			receiveNameTip: '请输入收件人',
			receiveTelTip: '请输入手机号',
			receiveEmailTip: '请输入邮箱',
			receiveCountryTip: '请选择国家',
			receiveProvinceTip: '请输入省份州',
			receiveCityTip: '请输入城市',
			receiveComNameTip: '请输入公司名称',
			receiveCodeTip: '请输入邮编',
			receiveAddressTip: '请输入详细地址',
			sfersongyi: '买二送一',
			sferbanjia: '第二件半价',
			sfonline: '在线支付',
			sfonlineError: '支付异常',
			sfNetword: '网络异常',
			receiveEmailtype: '邮箱格式不正确',
			buySuccess: '下单成功',
			buyFail: '下单失败',
			none: '暂无数据',
			sfxia: '已下架',
			sfxiajia: '商品已下架',
			phoneThTip: '请输入以0开头的号码',
			// addressTips2: '请勾选默认地址'
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
		that.discount = that.discount.toFixed(2)
		that.f_TotalPrice = that.f_TotalPrice.toFixed(2)
	},
	mounted: function() {
		var that = this
		var shopData = JSON.parse(sessionStorage.getItem('cart'))
		shopMsg.token = requireToken()
		
		getShopIdByLanguage(shopMsg).then(function(res) {
			if (res.info == 10) {
				vm.dingdan.data.F_ShopId = res.data.f_ShopId
				vm.cartMsg.data.F_ShopId = res.data.f_ShopId
				vm.addCartMsg.data.F_ShopId = res.data.f_ShopId
				vm.currencySign = res.data.f_CurrencySign
				vm.payId = res.data.f_OnlinePayType[0].f_PayKey
				online_paypal(vm.payId)
				
				var sum = 0
				for (var i in shopData) {
					if (vm.dingdan.data.F_UsersAdressId == '') {
						var ShopCartDetail = {
							F_ShopCartId: shopData[i].f_Id || '',
							F_Num: shopData[i].f_Num,
							F_MarketingId: shopData[i].f_MarketingId,
							F_GoodsAttributeId: shopData[i].f_GoodsAttributeId,
							recmid: shopData[i].recmid,
							saleid: shopData[i].saleid
						}
						vm.addCartMsg.data.ShopCartDetail.push(ShopCartDetail)
					}
					
					shopData[i].totalPrice = parseFloat(shopData[i].f_Num * shopData[i].f_SalesPrice).toFixed(2)
					shopData[i].sku = Object.values(shopData[i].attribute).join(', ')
					sum += parseFloat(shopData[i].totalPrice)
					var obj = {
						F_UserId: userId,
						F_ShopId: res.data.f_ShopId,
						F_MarketingId: shopData[i].f_MarketingId,
						F_GoodsAttributeId: shopData[i].f_GoodsAttributeId,
						F_SaleNum: shopData[i].f_Num
					}
					vm.orderAmountMsg.data.push(obj)
					
					if (shopData[i].saleid != '') {
						vm.dingdan.data.F_SaleUserId = shopData[i].saleid
					}
					vm.dingdan.data.OrderDetail.push({
						recmid: shopData[i].recmid,
						F_MarketingId: shopData[i].f_MarketingId,
						F_GoodsAttributeId: shopData[i].f_GoodsAttributeId,
						F_Num: shopData[i].f_Num,
					});
				
					vm.dingdan.data.ShoppingCartDetail.push({
						ShoppingCartId: shopData[i].f_Id
					})
				}
				vm.shoppingData = shopData
				
				// 订单金额计算
				getOrderAmount(vm.orderAmountMsg).then(function(res) {
					if (res.info == 10) {
				
						vm.f_TotalPrice = res.data.f_TotalPrice
						vm.f_Fee = parseFloat(res.data.f_Fee).toFixed(2) //手续费
						vm.totalMoney = (parseFloat(vm.f_TotalPrice) + parseFloat(vm.f_Fee)).toFixed(2)	//手续费加商品价格
						vm.discount = (parseFloat(sum) - parseFloat(vm.f_TotalPrice)).toFixed(2) //	优惠价格
				
						vm.dingdan.data.F_BuyGroupId = res.data.f_BuyGroupId
						vm.dingdan.data.F_Currency = res.data.f_Currency
					} else if (res.info == 21) {
						vm.notPay = true
					} else {
						that.$message.error(vm.sfLang.none)
					}
				})
			}
		})

		getUsersAdressDetail(this.addressMsg).then(function(res) {
			if (res.info == 10) {
				vm.addressData = res.data
				for (var i in vm.addressData) {
					if (vm.addressData[i].f_IsDefalut == 1) {
						vm.addressDefalutData = vm.selectedAdr = vm.addressData[i]
						vm.dingdan.data.F_UsersAdressId = vm.addressData[i].f_Id
					}
				}
			} else {
				// 如果没有地址 则弹出一个新建地址的弹窗
				vm.addDialogVisible = true
			}
		})
		if (this.addressEditMsg.data.F_ReceiveCountry == 'Thailand') {
			for (var i in thailand) {
				this.provinceData.push(thailand[i].label)
			}
		}
	},
	methods: {
		openNewAddress: function() {
			this.addDialogVisible = true
			if (this.addressEditMsg.data.F_ReceiveCountry == 'Thailand') {
				for (var i in thailand) {
					this.provinceData.push(thailand[i].label)
				}
			}
		},
		// 选择国家
		changeCountry: function(val) {
			if (val == 'Thailand') {
				this.provinceData = []
				this.addressEditMsg.data.F_ReceiveProvince = ''
				this.addressEditMsg.data.F_ReceiveCity = ''
				for (var i in thailand) {
					this.provinceData.push(thailand[i].label)
				}
			} else {
				this.provinceData = []
				this.cityData = []
				this.addressEditMsg.data.F_ReceiveProvince = ''
				this.addressEditMsg.data.F_ReceiveCity = ''
			}
		},
		// 获取省份洲再去获取对应的城市
		changeProvince: function(val) {
			this.addressEditMsg.data.F_ReceiveCity = ''
			this.cityData = []
			if (this.addressEditMsg.data.F_ReceiveProvince != '') {
				for (var i in thailand) {
					if (val == thailand[i].label) {
						for (var k in thailand[i].children) {
							this.cityData.push(thailand[i].children[k].label)
						}
					}
				}
			}
		},
		// 添加地址
		addAddress: function(formName) {
			var that = this
			if (that.addressData.length == 20) {
				that.$message.warning(vm.sfLang.sfadrTip)
				return
			}
			that.$refs[formName].validate(function(valid) {
				if (!valid) return
				vm.addressEditMsg.data.OperationType = 1
				operationUsersAdressDetail(vm.addressEditMsg).then(function(res) {
					if (res.info == 10) {
						vm.addressEditMsg.data.F_ReceiveName = ''
						vm.addressEditMsg.data.F_ReceiveTel = ''
						vm.addressEditMsg.data.F_ReceiveEmail = ''
						vm.addressEditMsg.data.F_ReceiveAddress = ''
						vm.addressEditMsg.data.F_ReceiveCity = ''
						vm.addressEditMsg.data.F_ReceiveProvince = ''
						vm.addressEditMsg.data.F_ReceiveCountry = 'Thailand'
						vm.addressEditMsg.data.F_ReceiveCode = ''
						vm.addressEditMsg.data.F_IsDefalut = 0
						vm.addressEditMsg.data.OperationType = ''
						vm.addressEditMsg.data.F_ReceiveComName = ''

						getUsersAdressDetail(vm.addressMsg).then(function(res) {
							if (res.info == 10) {
								vm.addressDefalutData = vm.selectedAdr = res.data[0]
								vm.addressData = res.data
								vm.dingdan.data.F_UsersAdressId = res.data[0].f_Id
								vm.changeDialogVisible = true
								vm.closeDialog(1)
							}
						})
						
						that.$message.success(that.sfLang.addrSuccess)
					} else {
						// if (vm.addressData.length == 0) {
						// 	that.$message.warning(that.sfLang.addressTips2)
						// } else {
							that.$message.error(that.sfLang.addrFail)
						// }
					}
				})
			})
		},
		// 更改地址 add
		changeAdrVisibly: function() {
			this.changeDialogVisible = false
			// for (var i in vm.addressData) {
			// 	if (vm.addressDefalutData.f_Id = vm.addressData[i].f_Id) {
			// 		vm.addressDefalutData = vm.selectedAdr
			// 	}
			// }
		},
		changeAdr: function(id) {
			for (var i in vm.addressData) {
				if (id == vm.addressData[i].f_Id) {
					vm.selectedAdr = vm.addressData[i]
				}
			}
		},
		// 确认地址 add
		submitAdr: function() {
			if (this.addressData.length == 0) return
			this.addressDefalutData = this.selectedAdr
			this.dingdan.data.F_UsersAdressId = this.selectedAdr.f_Id
			this.changeDialogVisible = true
		},
		// 管理地址 add
		toMyPage: function() {
			window.location.href = './my.html?type=2'
		},
		closeDialog: function(index) { // 关闭弹窗
			// if (this.dingdan.data.F_UsersAdressId == '') {
			// 	editShoppingCart(vm.addCartMsg).then(function(res) {
			// 		if (res.info == 10) {
			// 			getShoppingCartDetail(vm.cartMsg).then(function(res) {
			// 				if (res.info == 10) {
			// 					sessionStorage.sfcartNum = res.data.records //购物车气泡数量
			// 					sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
			// 				} else {
			// 					sessionStorage.sfcartNum = 0 //购物车气泡数量
			// 					sessionStorage.setItem('sfcartNum', 0)
			// 				}
			// 			})
			// 		}
			// 	})
			// 	window.location.href = './shopping.html'
			// 	return
			// }
			if (index == 1) {
				this.provinceData = []
				this.cityData = []
				this.addDialogVisible = false
				this.addressEditMsg.data.F_Id = ''
				this.addressEditMsg.data.F_IsDefalut = 0
				this.addressEditMsg.data.OperationType = ''
				this.addressEditMsg.data.F_ReceiveName = ''
				this.addressEditMsg.data.F_ReceiveTel = ''
				this.addressEditMsg.data.F_ReceiveEmail = ''
				this.addressEditMsg.data.F_ReceiveAddress = ''
				this.addressEditMsg.data.F_ReceiveCity = 'Thailand'
				this.addressEditMsg.data.F_ReceiveProvince = ''
				// this.addressEditMsg.data.F_ReceiveCountry = ''
				this.addressEditMsg.data.F_ReceiveCode = ''
				this.addressEditMsg.data.F_ReceiveComName = ''
			}
		},
		//在线支付
		sfonline: function(){
			if (this.notPay) {
				this.$message.warning(vm.sfLang.sfxiajia)
				return
			} else if (!sessionStorage.getItem('cart')) {
				return
			} else if (this.f_TotalPrice <= 0) {
				this.$message.warning(vm.sfLang.sfNetword)
				setTimeout(function() {
					window.location.reload()
				}, 1000)
				return
			} else if (this.payId == '') {
				this.$message.error(vm.sfLang.sfonlineError)
				return
			}
			
			if (this.dingdan.data.F_UsersAdressId == '') {
				this.$message.warning(vm.sfLang.addrChoose)
			} else {
				this.issfpaypal = true
			}
		},
		sfonlineClose: function(){
			this.issfpaypal = false
		},
		// 货到付款
		offlineHandle: function() {
			var that = this
			if (this.notPay) {
				this.$message.warning(vm.sfLang.sfxiajia)
				return
			}
			if (this.dingdan.data.F_UsersAdressId == '') {
				this.$message.warning(vm.sfLang.addrChoose)
				return
			} else if (!sessionStorage.getItem('cart')) {
				return
			} else if (this.f_TotalPrice <= 0) {
				this.$message.warning(vm.sfLang.sfNetword)
				setTimeout(function() {
					window.location.reload()
				}, 1000)
				return
			}
			vm.dingdan.data.F_OrderState = 2
			vm.dingdan.data.F_PayType = 1
			vm.loading = true
			createOrder(vm.dingdan).then(function(res) {
				if (res.info == 10) {
					that.$message.success(vm.sfLang.buySuccess)
					sessionStorage.removeItem('cart')
					window.location.href = './orderList.html'
				} else if (res.info == 21) {
					that.$message.warning(vm.sfLang.sfxiajia)
					window.location.href = "./shopping.html";
				} else {
					vm.loading = false
					that.$message.error(vm.sfLang.buyFail)
				}
			})
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		},
		// 手机号码验证
		validateAddPhone: function(rule, value, callback) {
			if (vm.addressEditMsg.data.F_ReceiveCountry == 'Thailand') {
				var phoneThReg = /^0[0-9-]{1,20}$/
				if (!phoneThReg.test(value)) {
					callback(new Error(vm.sfLang.phoneThTip))
				} else {
					callback()
				}
			}
		},
	}
})

// 如果是选择在线支付 支付成功之后 订单改为已付款
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
	
			vm.$data.dingdan.data.F_OrderState = 1
			vm.$data.dingdan.data.F_PayType = 2
			createOrder(vm.$data.dingdan).then(function(res) {
				if (res.info == 10) {
					vm.$data.issfpaypal = false
					changeOrder.data.F_OrderNo = res.data.f_OrderNo
				} else if (res.info == 21) {
					var that = this
					that.$message.warning(vm.sfLang.sfxiajia)
					window.location.href = "./shopping.html"
					return
				}
			})
	
			return actions.payment.create({
				transactions: [{
					amount: {
						total: vm.$data.totalMoney,
						currency: vm.$data.dingdan.data.F_Currency
					}
				}]
			});
		},
		onAuthorize: function(data, actions) {
			return actions.payment.execute().then(function(resp) {
	
				changeOrder.data.F_PayTransactionId = resp.id
				changeOrder.data.F_PayerID = resp.id
				changeOrder.data.F_PayTime = resp.create_time
	
				changePaymentOrder(changeOrder).then(function(res) {
					if (res.info == 10) {
						sessionStorage.removeItem('cart')
						window.location.href = './successpay.html'
					} else {
						window.location.href = './fail.html?no='+changeOrder.data.F_OrderNo+'&type=2&payId='+changeOrder.data.F_PayTransactionId+'&timer='+changeOrder.data.F_PayTime
					}
				})
			});
		},
		onCancel: function(data, actions) {
			sessionStorage.removeItem('cart')
			window.location.href = './orderList.html'
		}
	}, '#paypal-button');
}

