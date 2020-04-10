var vm = new Vue({
	el: '#cart',
	data: {
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
		searchFlag: false, //购物车缺省
		emshopnone: false,
		editCartMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				OperationType: '', // 0:表示删除 1:表示添加 2:表示编辑
				ShopCartDetail: []
			}
		},
		getCartData: [],
		requiredCartData: [],
		selectData: [],
		total: 0,
		pagerVisible: true,
		currencySign: '$',
		cartNum: 0,
		cartShelvesData: [],			// 购物车数据 区分不同商品 20200312
		totalMoney: 0,			// 计算总金额	20200312
		checkAllFlag: false,			// 选中全部 20200312
		sfLang: {
			search: '搜索',
			Operating: '操作',
			Quantity: '数量',
			Amount: '单价',
			totalPrice: '小计',
			quanxuan: '全选',
			settlement: '结算',
			total: '总价',
			shifou: '是否确认删除',
			queren: '确认',
			quxiao: '取消',
			tishi: '提示',
			remove: '删除',
			delSuccess: '删除成功',
			none: '购物车暂无商品，请把你喜欢的商品加入进来吧',
			choosePro: '请选择商品',
			delErr: '删除失败',
			editError: '编辑失败',
			off: '已下架',
			product: '商品信息',
			sfersongyi: '买二送一',
			sferbanjia: '第二件半价',
			sfserhis: '搜索历史',
		}
	},
	created: function() {
		// 页面翻译
		var that = this
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
		var that = this
		this.totalMoney = this.totalMoney.toFixed(2)
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.cartMsg.data.F_ShopId = res.data.f_ShopId // 购物车
			vm.editCartMsg.data.F_ShopId = res.data.f_ShopId // 购物车编辑
			vm.currencySign = res.data.f_CurrencySign
			
			//搜索历史记录
			getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
				vm.searchItem = res.data
			})
			
			getShoppingCartDetail(vm.cartMsg).then(function(res) {
				if (res.info == 10) {
					vm.pagerVisible = false
					vm.searchFlag = false
					vm.emshopnone = true
					var data = vm.getCartData = res.data.rows
					vm.total = res.data.total * 10
					
					var tempArr = []
					for (var i = 0; i < data.length; i++) {
						data[i].sku = Object.values(data[i].attribute).join(',')
						data[i].f_TotalPrice = (parseFloat(data[i].f_Num) * parseFloat(data[i].f_SalesPrice)).toFixed(2)
						
						if (data[i].f_IsPublish == 1) {
							data[i].select = false
							if (tempArr.indexOf(data[i].f_MarketingId) === -1) {
								vm.cartShelvesData.push({
									markId: data[i].f_MarketingId,
									arr: [data[i]]
								})
								tempArr.push(data[i].f_MarketingId)
							} else {
								for (var j = 0; j < vm.cartShelvesData.length; j++) {
									if (vm.cartShelvesData[j].markId == data[i].f_MarketingId) {
										vm.cartShelvesData[j].arr.push(data[i])
										break
									}
								}
							}
						} else {
							data[i].f_Num = 0
							vm.requiredCartData.push(data[i])
						}
					}
				} else {
					vm.searchFlag = true
				}
			})
		})

		// 监听页面刷新和离开
		// window.addEventListener('beforeunload', function(e) { return that.beforeunloadFn(e) })
	},
	methods: {
		// 页面离开或刷新 调用购物车编辑接口 edit 20200312
		// beforeunloadFn: function(e) {
		// 	var cartData = this.cartShelvesData
		// 	this.editCartMsg.data.OperationType = 2
		// 	var cartArr = []
		// 	for (var i = 0; i < cartData.length; i++) {
		// 		for (var j = 0; j < cartData[i].arr.length; j++) {
		// 			cartArr.push({
		// 				F_ShopCartId: cartData[i].arr[j].f_Id,
		// 				F_MarketingId: cartData[i].arr[j].f_MarketingId,
		// 				F_GoodsAttributeId: cartData[i].arr[j].f_GoodsAttributeId,
		// 				F_Num: cartData[i].arr[j].f_Num,
		// 				recmid: cartData[i].arr[j].recmid,
		// 				saleid: cartData[i].arr[j].saleid
		// 			})
		// 		}
		// 	}
		// 	this.editCartMsg.data.ShopCartDetail = cartArr
		// 	editShoppingCart(this.editCartMsg).then(function(res) {})
		// },
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
		//选中商品 edit 20200312
		selectedProduct: function(item, index, index2) {
			var data = vm.cartShelvesData[index].arr[index2]
			
			if (data.select == false) {
				data.select = true
				this.selectData.push(item)
				this.selectData = unique(this.selectData)
			} else {
				data.select = false
				for (var i in this.selectData) {
					if (data.f_GoodsAttributeId == this.selectData[i].f_GoodsAttributeId) {
						this.selectData.splice(i, 1)
					}
				}
			}
			if (this.getCartData.length == this.selectData.length) {
				this.checkAllFlag = true
			} else {
				this.checkAllFlag = false
			}
			this.calcTotalPrice()			//全选时调用计算总金额函数
		},
		// 全选商品 edit 20200312
		checkAll: function(flag) {
			this.checkAllFlag = !flag
			if (this.checkAllFlag) {
				for (var i in this.cartShelvesData) {
					for (var k in this.cartShelvesData[i].arr) {
						this.cartShelvesData[i].arr[k].select = true
						this.selectData.push(this.cartShelvesData[i].arr[k])
					}
				}
			} else {
				for (var i in this.cartShelvesData) {
					for (var k in this.cartShelvesData[i].arr) {
						this.cartShelvesData[i].arr[k].select = false
					}
				}
				this.selectData = []
			}
			this.calcTotalPrice()			//全选时调用计算总金额函数
		},
		// 计算总金额函数 20200312
		calcTotalPrice: function() {
			var sum = 0
			this.selectData.forEach(function(item, index) {
				if (item.select) {
					sum = parseFloat(item.f_Num * item.f_SalesPrice) + parseFloat(sum)
				}
			})
			this.totalMoney = sum.toFixed(2)
		},
		// 商品数量加1 edit 20200312
		plus: function(data, index, index2) {
			var item = vm.cartShelvesData[index].arr[index2]
			item.f_Num = ++item.f_Num
			item.f_TotalPrice = (item.f_Num * item.f_SalesPrice).toFixed(2)
			
			this.editCartHandle(data, item.f_Num)
			this.calcTotalPrice()			//全选时调用计算总金额函数
		},
		// 商品数量减1 edit 20200312
		minus: function(data, index, index2) {
			var item = vm.cartShelvesData[index].arr[index2]
			if (item.f_Num <= 1) return
			item.f_Num = --item.f_Num
			item.f_TotalPrice = (item.f_Num * item.f_SalesPrice).toFixed(2)
			
			this.editCartHandle(data)
			this.calcTotalPrice()			//全选时调用计算总金额函数
		},
		editCartHandle: function(data) {
			var that = this
			var cartArr = {
				F_ShopCartId: data.f_Id,
				F_MarketingId: data.f_MarketingId,
				F_GoodsAttributeId: data.f_GoodsAttributeId,
				F_Num: data.f_Num,
				recmid: data.recmid,
				saleid: data.saleid
			}
			this.editCartMsg.data.OperationType = 2
			this.editCartMsg.data.ShopCartDetail.push(cartArr)
			
			editShoppingCart(this.editCartMsg).then(function(res) {
				if (res.info != 10) {
					that.$message.error(vm.sfLang.editError)
				} else {
					that.editCartMsg.data.ShopCartDetail = []
				}
			})
			
		},
		// 检测商品数量输入框只能是正整数 edit 20200312
		handleNum: function(e, index, index2) {
			var flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value)
			var item = this.cartShelvesData[index].arr[index2]
			if (!flag) {
				item.f_Num = 1
				item.f_TotalPrice = (item.f_Num * item.f_SalesPrice).toFixed(2)
			} else {
				if (parseInt(e.target.value) > 99) {
					item.f_Num = 99
				}
				item.f_TotalPrice = (item.f_Num * item.f_SalesPrice).toFixed(2)
			}
			
			this.calcTotalPrice()			//全选时调用计算总金额函数
		},
		// 删除商品 edit 20200312
		delHandle: function(data) {
			var that = this
			this.editCartMsg.data.OperationType = 0
			this.editCartMsg.data.ShopCartDetail.push({
				F_ShopCartId: data.f_Id
			})

			this.$confirm(vm.sfLang.shifou, vm.sfLang.tishi, {
				confirmButtonText: vm.sfLang.queding,
				cancelButtonText: vm.sfLang.quxiao,
				type: 'warning'
			}).then(function() {
				editShoppingCart(vm.editCartMsg).then(function(res) {
					if (res.info == 10) {
						
						// 未选中商品 删除
						for (var i in vm.cartShelvesData) {
							for (var k in vm.cartShelvesData[i].arr) {
								if (vm.cartShelvesData[i].arr[k].f_Id == data.f_Id) {
									// 同个markId 删除不同的skuId
									vm.cartShelvesData[i].arr.splice(k, 1)
									if (vm.cartShelvesData[i].arr.length == 0) {
										// 不同markId 删除对应的数组
										vm.cartShelvesData.splice(i, 1)
										if (vm.cartShelvesData.length == 0 && vm.requiredCartData.length == 0) {
											// 数组为空 隐藏对应的信息
											vm.pagerVisible = true
											vm.searchFlag = true
											vm.emshopnone = false
										}
									}
								}
							}
						}
						
						// 选中商品后 删除
						if (vm.selectData.length > 0) {
							for (var j in vm.selectData) {
								if (vm.selectData[j].f_Id == data.f_Id) {
									vm.selectData.splice(j, 1)
									vm.getCartData.splice(j, 1)
								}
							}
						}
						
						vm.calcTotalPrice()			//全选时调用计算总金额函数
						
						getShoppingCartDetail(vm.cartMsg).then(function(res) {
							if (res.info == 10) {
								vm.total = res.data.total * 10
								sessionStorage.sfcartNum = res.data.records //购物车气泡数量
								sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
							} else {
								sessionStorage.sfcartNum = 0 //购物车气泡数量
								sessionStorage.setItem('sfcartNum', 0)
							}
						})

						that.$message.success(vm.sfLang.delSuccess)
					} else {
						that.$message.error(vm.sfLang.delErr)
					}
				})
			}).catch(function() {})
		},
		// 删除所有
		remove: function() {
			var that = this
			if (this.selectData.length == 0) {
				this.$message.warning(vm.sfLang.choosePro)
				return
			}
			
			this.editCartMsg.data.ShopCartDetail = []
			this.editCartMsg.data.OperationType = 0
			for (var i in this.selectData) {
				this.editCartMsg.data.ShopCartDetail.push({
					F_ShopCartId: this.selectData[i].f_Id
				})
			}
			
			this.$confirm(vm.sfLang.shifou, vm.sfLang.tishi, {
				confirmButtonText: vm.sfLang.queding,
				cancelButtonText: vm.sfLang.quxiao,
				type: 'warning'
			}).then(function() {
				editShoppingCart(vm.editCartMsg).then(function(res) {
					if (res.info == 10) {
						
						for (var i in vm.cartShelvesData) {
							for (var k in vm.cartShelvesData[i].arr) {
								for (var j in vm.selectData) {
									if (vm.selectData[j].f_Id == vm.cartShelvesData[i].arr[k].f_Id) {
										vm.cartShelvesData[i].arr.splice(k, 1)
										if (vm.cartShelvesData[i].arr.length == 0) {
											// 不同markId 删除对应的数组
											vm.cartShelvesData.splice(i, 1)
											if (vm.cartShelvesData.length == 0 && vm.requiredCartData.length == 0) {
												// 数组为空 隐藏对应的信息
												vm.pagerVisible = true
												vm.searchFlag = true
												vm.emshopnone = false
											}
										}
									}
								}
							}
						}
						vm.selectData = []
						
						vm.calcTotalPrice()			//全选时调用计算总金额函数
						
						getShoppingCartDetail(vm.cartMsg).then(function(res) {
							if (res.info == 10) {
								vm.total = res.data.total * 10
								vm.getCartData = res.data.rows
								sessionStorage.sfcartNum = res.data.records //购物车气泡数量
								sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
							} else {
								vm.getCartData = []
								sessionStorage.sfcartNum = 0 //购物车气泡数量
								sessionStorage.setItem('sfcartNum', 0)
							}
						})
			
						that.$message.success(vm.sfLang.delSuccess)
					} else {
						that.$message.error(vm.sfLang.delErr)
					}
				})
			}).catch(function() {})
		},
		// 分页
		changePage: function(val) {
			var that = this
			var back = document.querySelector('.backTop')
			back.scrollTop = 0
			vm.cartMsg.data.page = val
			this.cartShelvesData = []
			this.requiredCartData = []

			getShoppingCartDetail(vm.cartMsg).then(function(res) {
				if (res.info == 10) {
					vm.pagerVisible = false
					vm.searchFlag = false
					vm.emshopnone = true
					var data = vm.getCartData = res.data.rows
					vm.total = res.data.total * 10
					var tempArr = []
					
					for (var i = 0; i < data.length; i++) {
						data[i].sku = Object.values(data[i].attribute).join(',')
						data[i].f_TotalPrice = (parseFloat(data[i].f_Num) * parseFloat(data[i].f_SalesPrice)).toFixed(2)
						
						if (data[i].f_IsPublish == 1) {
							data[i].select = false
							if (tempArr.indexOf(data[i].f_MarketingId) === -1) {
								vm.cartShelvesData.push({
									markId: data[i].f_MarketingId,
									arr: [data[i]]
								})
								tempArr.push(data[i].f_MarketingId)
							} else {
								for (var j = 0; j < vm.cartShelvesData.length; j++) {
									if (vm.cartShelvesData[j].markId == data[i].f_MarketingId) {
										vm.cartShelvesData[j].arr.push(data[i])
										break
									}
								}
							}
						} else {
							data[i].f_Num = 0
							vm.requiredCartData.push(data[i])
						}
					}
				} else {
					vm.searchFlag = true
				}
			})
		},
		toPage: function() {
			if (this.selectData.length == 0) {
				this.$message.warning(vm.sfLang.choosePro)
				return
			}
			sessionStorage.setItem('cart', JSON.stringify(this.selectData))
			window.location.href = './checkout.html'
		},
		toDetail: function(id) {
			window.location.href = './details.html?id=' + id
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		}
	},
	// destroyed: function() {
	// 	var that = this
	// 	window.removeEventListener('beforeunload', function(e) { return that.beforeunloadFn(e) })
	// }
})
