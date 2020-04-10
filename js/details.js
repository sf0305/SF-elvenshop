var jq = jQuery.noConflict();
var vm = new Vue({
	el: '#detail',
	data: {
		loading: true,
		sfscreenHight: '123',
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
		proMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_MarketingId: getRequest().id,
				F_UserId: userId
			}
		},
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
		commentMsg: { // 评论接口请求信息
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_MarketingId: getRequest().id,
				F_ShopId: '',
				rows: 10,
				page: 1,
				sord: '',
				sidx: 'F_CreateDate'
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
		stat: 1,
		pagerVisible: true,
		total: 0,
		addCartMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: '',
				F_UserId: userId,
				OperationType: 1, // 0:表示删除 1:表示添加 2:表示编辑
				ShopCartDetail: [{
					F_ShopCartId: '',
					F_Num: 1, // 购物车的数量
					F_GoodsAttributeId: '',
					F_MarketingId: getRequest().id,
					recmid: getRequest().recmid || '',
					saleid: getRequest().saleid || ''
				}]
			}
		},
		// 首页热销请求接口
		homePageImgMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: ''
			}
		},
		// 首页热销明细请求接口
		detailIdMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_HomePageDisplayId: '',
				F_CategoryId: '',
				F_ShopId: '',
				rows: 9,
				sord: '',
				sidx: '',
				page: 1
			}
		},
		// 推荐商品点击量叠加
		marketClickNumMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				NewmarketingId: ''
			}
		},
		review: getRequest().review || '',			// 内部人员查看 预览商品
		saleid: getRequest().saleid || '',			// 销售人员的id
		recmid: getRequest().recmid || '',			// 推荐商品的id
		hotData: [],
		proData: {},
		rollImgs: [],
		mainImgsUrl: '', // 商品主图
		commentData: [],
		switchTab: 1, // 默认商品详情 1 商品详情 2 评价
		notContent: false,
		skuData: [],
		selectArr: [], //存放被选中的值
		shopItemInfo: {}, //存放要和选中的值进行匹配的数据
		subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
		f_SalesPrice: '', //选中规格的价格
		f_OriginalPrice: '', // 选中规格的原价
		attribute: '',
		collectIndex: '', // 判断是否收藏
		collectMsg: { // 关注商品
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				OperationType: '',
				F_MarketingId: getRequest().id,
				F_ShopId: ''
			}
		},
		currencySign: '$',
		PixelId: '',			// 像素id
		isShade: false,
		isBig: false,
		middleImgWidth: 500,
		middleImgHeight: 500,
		thumbnailHeight: 100,
		zoom: 2,
		initX: 0, // 初始clientX值
		initY: 0, // 初始clientY值
		leftX: 0, // 初始定位left
		topY: 0, // 初始定位top
		middleLeft: 0, // 当前放置小图盒子的定位left值
		reviewArr: '',				// h获取评论的第几组数据
		reviewIndex: -1,			// 评论图片index
		sfzhutu: false,			// 关闭评论轮播图
		sfrate:['#ff5230', '#ff5230', '#ff5230'],			// 星级评分颜色
		sfCommentNum:'',
		discount: '',
		sfLang: {
			search: '搜索',
			sales: '销量',
			commom: '评论',
			review: '评价',
			quantity: '数量',
			buyNow: '立即购买',
			addCart: '加入购物车',
			collect: '收藏',
			kefu: '客服',
			recommend: '推荐',
			proDetail: '商品详情',
			collectSuccess: '收藏成功',
			collectCancel: '取消收藏',
			login: '请登录',
			chooseSku: '请选择规格',
			addCartSuccess: '已添加到购物车',
			notContent: '暂无评价',
			sfersongyi: '买二送一',
			sferbanjia: '第二件半价',
			sftakeOff: '商品已下架',
			sfNotOnline: '商品未发布',
			sfsku: '商品属性',
			sfserhis: '搜索历史',
			stock: '库存不足'
		},
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
			if (res.info == 10) {
				vm.commentMsg.data.F_ShopId = res.data.f_ShopId
				vm.addCartMsg.data.F_ShopId = res.data.f_ShopId
				vm.homePageImgMsg.data.F_ShopId = res.data.f_ShopId
				vm.detailIdMsg.data.F_ShopId = res.data.f_ShopId
				vm.cartMsg.data.F_ShopId = res.data.f_ShopId
				vm.currencySign = res.data.f_CurrencySign
				vm.PixelId = res.data.f_PixelId
				
				//搜索历史记录
				getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
					vm.searchItem = res.data
				})
				
				//像素注册
				var r = getQueryString("pm");		// 推荐的广告连接
				var s = getQueryString("mid");
				if (r == null && s == null && getQueryString("o") == null) {
					if (window.fbq) {
						fbq("init", res.data.f_PixelId);
						fbq('track', 'PageView');
					}
				}
				
				getMarketingDetail(vm.proMsg).then(function(res) {
					if (res.info == 10) {
						vm.loading = false
						vm.mainImgsUrl = res.data.f_MainImageUrl
						vm.rollImgs = res.data.rollImgs.slice(0, 5)
						vm.proData = res.data
						vm.f_SalesPrice = res.data.salesPriceRange
						vm.f_OriginalPrice = res.data.originalPriceRange
						vm.discount = parseInt(((res.data.originalPriceRange - res.data.salesPriceRange) / res.data.originalPriceRange) * 100)			// 折扣率
						vm.collectIndex = res.data.f_IsGoodsFocus
						vm.collectMsg.data.F_ShopId = res.data.f_ShopId
						
						// 获取评论数量
						getUserCommentDetail(vm.commentMsg).then(function(res) {
							if (res.info == 10) {
								vm.sfCommentNum = res.data.rows.length
								vm.commentData = res.data.rows
								for (var i in res.data.rows) {
									vm.commentData[i].f_CommentStart = Number(res.data.rows[i].f_CommentStart)
									for (var k in vm.commentData[i].f_PicDetail) {
										vm.commentData[i].f_PicDetail[k] = imageUrl + vm.commentData[i].f_PicDetail[k]
									}
								}
								vm.total = res.data.total * 10
							} else {
								vm.sfCommentNum = 0
							}
						})
						
						// sku 规格
						var sku_arr = new Array()
						var skuData = new Array()
						var attr = new Array()
						var skuDetails = vm.proData.skuDetails
						
						for (var i in skuDetails) {
							skuDetails[i].attr = {}
							skuDetails[i].attr = Object.values(skuDetails[i].attribute).reverse().join(',')
							vm.shopItemInfo[skuDetails[i].attr] = skuDetails[i]
						}
						
						for (var i in skuDetails[0].attribute) {
							sku_arr.push({
								name: i,
								list: []
							})
							skuData.push({
								name: i,
								list: []
							})
						}
						for (var i in sku_arr) {
							for (var k in skuDetails) {
								for (var m in skuDetails[k].attribute) {
									if (sku_arr[i].name == m) {
										if (m == 'color') {
											sku_arr[i].list.push({
												sku: skuDetails[k].attribute[m],
												imgUrl: skuDetails[k].attributeImg,
												isShow: true
											})
										} else {
											sku_arr[i].list.push({
												sku: skuDetails[k].attribute[m],
												imgUrl: '',
												isShow: true
											})
											sku_arr[i].list.sort(function(a, b) {
												return a.sku - b.sku
											})
										}
									}
								}
							}
						}
						// 去掉重复
						var obj = new Object()
						for (var i in sku_arr) {
							for (var k in sku_arr[i].list) {
								if (!obj[sku_arr[i].list[k].sku]) {
									skuData[i].list.push(sku_arr[i].list[k])
									obj[sku_arr[i].list[k].sku] = true
								}
							}
						}
						vm.skuData = skuData.reverse()
						
						// 获取 推荐/热销 的数据
						getHomePageDisplays(vm.homePageImgMsg).then(function(resp) {
							var dataArr = resp.data
							for (var i = 0; i < dataArr.length; i++) {
								if (dataArr[i].f_DisplayType == 2) {
									vm.detailIdMsg.data.F_HomePageDisplayId = dataArr[i].f_Id
								}
							}
							vm.detailIdMsg.data.F_CategoryId = vm.proData.f_CategoryId
							getHomePageDisplayDetail(vm.detailIdMsg).then(function(resp) {
								var data = resp.data.rows
								for (var i in data) {
									data[i].f_SalesPrice = data[i].f_SalesPrice.toFixed(2)
									data[i].f_OriginalPrice = data[i].f_OriginalPrice.toFixed(2)
									if (data[i].f_MarketingId != getRequest().id) {
										vm.hotData.push(data[i])
									}
								}
							})
						})
					}
				})
			}
		})

		this.$nextTick(function() {
			var imgWidth = this.middleImgHeight + 100
			// 设置移动阴影图宽高
			jq('.middle_img .shade').css({
				width: this.middleImgWidth / this.zoom,
				height: this.middleImgHeight / this.zoom
			})
			// 设置放大后图片容器的宽高,left
			jq('.right_contanier').css({
				left: imgWidth - 70,
				width: imgWidth,
				height: imgWidth
			})
			// 设置放大图片的宽高(图片的放大倍数)
			jq('.right_contanier .big_img').css({
				width: imgWidth * this.zoom,
				height: imgWidth * this.zoom
			})
		})
	},
	methods: {
		// 产品图片鼠标移入事件,显示阴影,显示大图
		boxMouseOver: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.isShade = true
			this.isBig = true
			// 计算阴影的位置
			var x = e.offsetX - jq('.shade').width() / 2
			var y = e.offsetY - jq('.shade').height() / 2
			var maxLeft = jq('.middle_img').width() - jq('.shade').width()
			var maxTop = jq('.middle_img').height() - jq('.shade').height()
			x = x <= 0 ? 0 : x
			x = x >= maxLeft ? maxLeft : x
			y = y <= 0 ? 0 : y
			y = y >= maxTop ? maxTop : y
			jq('.shade').css({
				left: x,
				top: y
			})
		},
		// 鼠标在阴影移动
		shadeMouseMove: function(e) {
			e.preventDefault();
			e.stopPropagation();
			//用页面x - 父盒子的offsetLeft - 父盒子的左边框宽度
			var x = this.getEventPage(e).pageX - jq('.middle_img')[0].offsetParent.offsetLeft - jq('.middle_img')[0].offsetParent
				.clientLeft;
			//用页面y - 父盒子的offsetTop - 父盒子的上边框宽度
			var y = this.getEventPage(e).pageY - jq('.middle_img')[0].offsetParent.offsetTop - jq('.middle_img')[0].offsetParent
				.clientTop;

			//让阴影的坐标居中
			x -= jq('.shade').width() / 2;
			y -= jq('.shade').height() / 2;

			// 移动边界限制
			var maxLeft = jq('.middle_img').width() - jq('.shade').width()
			var maxTop = jq('.middle_img').height() - jq('.shade').height()
			x = x <= 0 ? 0 : x
			x = x >= maxLeft ? maxLeft : x
			y = y <= 0 ? 0 : y
			y = y >= maxTop ? maxTop : y
			// 重新赋值当前的定位值
			jq('.shade').css({
				left: x,
				top: y
			})
			// 计算出实时的大图的定位,首先计算出比例
			// 比例为x:大图宽度/小图宽度 y: 大图高度/小图高度,将小图的定位乘以比例就是大图的定位
			var xRate = jq('.big_img').width() / jq('.middle_img').width()
			var yRate = jq('.big_img').height() / jq('.middle_img').height()
			jq('.big_img').css({
				left: -x * xRate,
				top: -y * yRate
			})
			// console.log(e, x, y, xRate, yRate, 66677)
		},
		// 鼠标移入阴影,去除自定义事件
		shadeMouseOver: function(e) {
			e.preventDefault()
			e.stopPropagation()
		},
		// 图片移出隐藏阴影和大图
		boxMouseLeave: function() {
			this.isShade = false
			this.isBig = false
		},
		getEventPage: function(e) {
			return {
				pageX: e.clientX + this.getPageScroll().scrollLeft,
				pageY: e.clientY + this.getPageScroll().scrollTop
			}
		},
		getPageScroll: function() {
			return {
				scrollTop: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
				scrollLeft: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
			}
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
			if (vm.searchContent.trim() == '') {
				vm.sfhistory = true
			}else{
				vm.sfhistory = false
			}
		},
		// 缩略图点击显示主图
		imgClick: function(index) {
			this.mainImgsUrl = this.rollImgs[index]
		},
		// 选择规格
		selectSku: function(item, n, event, index) {
			var that = this
			if (that.selectArr[n] !== item) {
				that.selectArr[n] = item
				that.subIndex[n] = index
			} else {
				that.selectArr[n] = ''
				that.subIndex[n] = -1
			}


			// 切换到主图显示
			if (that.skuData[n].list[index].imgUrl) {
				that.mainImgsUrl = that.skuData[n].list[index].imgUrl
			}

			if (that.selectArr.length == that.skuData.length) {
				var selected = that.selectArr.join(',')
				for (var i in vm.shopItemInfo) {
					if (selected == i) {
						vm.f_SalesPrice = vm.shopItemInfo[i].f_SalesPrice
						vm.f_OriginalPrice = vm.shopItemInfo[i].f_OriginalPrice
						vm.addCartMsg.data.ShopCartDetail[0].F_GoodsAttributeId = vm.shopItemInfo[i].f_GoodsAttributeId
						vm.attribute = vm.shopItemInfo[i].attribute
						vm.discount = parseInt(((vm.f_OriginalPrice - vm.f_SalesPrice) / vm.f_OriginalPrice) * 100)			// 折扣率
					}
				}
			}
			that.checkItem()
		},
		checkItem: function() {
			var self = this;
			var option = self.skuData;
			var result = []; //定义数组储存被选中的值
			for (var i in option) {
				result[i] = self.selectArr[i] ? self.selectArr[i] : '';
			}
			for (var i in option) {
				var last = result[i]; //把选中的值存放到字符串last去
				for (var k in option[i].list) {
					result[i] = option[i].list[k].sku; //赋值，存在直接覆盖，不存在往里面添加name值
					// option[i].list[k].isShow = self.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
				}
				result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
			}
			if (this.shopItemInfo[result]) {
				this.f_SalesPrice = this.shopItemInfo[result].f_SalesPrice || ''
				this.f_OriginalPrice = this.shopItemInfo[result].f_OriginalPrice || ''
			}
			self.$forceUpdate(); //重绘
		},
		isMay: function(result) {
			for (var i in result) {
				if (result[i] == '') {
					return true; 		//如果数组里有为空的值，那直接返回true
				}
			}
			// return this.shopItemInfo[result].stock == 0 ? false : true; 	//匹配选中的数据的库存，若不为空返回true反之返回false
		},
		// 商品数量增加
		increase: function() {
			this.addCartMsg.data.ShopCartDetail[0].F_Num = ++this.addCartMsg.data.ShopCartDetail[0].F_Num
		},
		// 商品数量减少
		subtract: function() {
			if (this.addCartMsg.data.ShopCartDetail[0].F_Num > 1) {
				this.addCartMsg.data.ShopCartDetail[0].F_Num = --this.addCartMsg.data.ShopCartDetail[0].F_Num
			}
		},
		// 立刻购买
		buyNow: function() {
			var that = this
			if (!userId) {
				this.toLoginPage()
				return
			}
			if (vm.selectArr.length != vm.skuData.length) {
				that.$message.warning(that.sfLang.chooseSku)
				return
			} else {
				for (var i = 0; i < vm.selectArr.length; i++) {
					if (vm.selectArr[i] == undefined) {
						that.$message.warning(that.sfLang.chooseSku)
						return
					}
				}
			}
			// 库存不足
			if (vm.addCartMsg.data.ShopCartDetail[0].F_GoodsAttributeId == '') {
				that.$message.warning(vm.sfLang.stock)
				return
			}
			
			var cart = [{
				f_Id: '',
				f_MarketingId: getRequest().id,
				f_Title: vm.proData.f_Title,
				f_SalesPrice: vm.f_SalesPrice,
				attributeImg: vm.mainImgsUrl,
				attribute: vm.attribute,
				f_MarketingType : vm.proData.f_MarketingType,
				f_GoodsAttributeId: vm.addCartMsg.data.ShopCartDetail[0].F_GoodsAttributeId,
				f_Num: vm.addCartMsg.data.ShopCartDetail[0].F_Num,
				recmid: vm.recmid,
				saleid: vm.saleid
			}]
			
			sessionStorage.setItem('cart', JSON.stringify(cart))
			
			//facebook 购买 像素追踪
			if (getQueryString('pm') == null && getQueryString('mid') == null && getQueryString('o') == null) {
				if (window.fbq) {
					fbq('track', 'Purchase', {
						content_ids: getQueryString('id'),
						content_type: 'product',
						value: vm.f_SalesPrice,
						currency: vm.proData.f_Currency
					});
				}
			}
			
			window.location.href = './checkout.html'
		},
		// 加入购物车
		addCart: function() {
			var that = this
			if (!userId) {
				this.toLoginPage()
				return
			}
			if (vm.selectArr.length != vm.skuData.length) {
				that.$message.warning(that.sfLang.chooseSku)
				return
			} else {
				for (var i = 0; i < vm.selectArr.length; i++) {
					if (vm.selectArr[i] == undefined) {
						that.$message.warning(that.sfLang.chooseSku)
						return
					}
				}
			}
			// 库存不足
			if (vm.addCartMsg.data.ShopCartDetail[0].F_GoodsAttributeId == '') {
				that.$message.warning(vm.sfLang.stock)
				return
			}
			// facebook 加入购物车 像素追踪
			if (getQueryString('pm') == null && getQueryString('mid') == null && getQueryString('o') == null) {
				if (window.fbq) {
					fbq('track', 'AddToCart', {
							content_name: 'shopping cart',
							content_ids: getQueryString('id'),
							content_type: 'product',
							value: vm.f_SalesPrice,
							currency: vm.proData.f_Currency
					});
				}
			}
			
			editShoppingCart(vm.addCartMsg).then(function(res) {
				if (res.info == 10) {
					getShoppingCartDetail(vm.cartMsg).then(function(res) {
						if (res.info == 10) {
							sessionStorage.sfcartNum = res.data.records //购物车气泡数量
							sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
						} else {
							sessionStorage.sfcartNum = 0 //购物车气泡数量
							sessionStorage.setItem('sfcartNum', 0)
						}
					})

					that.$message.success(that.sfLang.addCartSuccess)
				}
			})
		},
		// 收藏处理
		collectHandle: function() {
			var that = this
			if (userId) {
				if (this.collectIndex == 0) {
					// 添加
					this.collectMsg.data.OperationType = 1
				} else {
					// 删除
					this.collectMsg.data.OperationType = 0
				}
				operationGoodsFocusInfos(vm.collectMsg).then(function(res) {
					if (res.info == 10) {
						if (vm.collectIndex == 0) {
							that.$message.success(vm.sfLang.collectSuccess)
							vm.collectIndex = 1
						} else {
							vm.collectIndex = 0
							that.$message.warning(vm.sfLang.collectCancel)
						}
					}
				})
			} else {
				this.toLoginPage()
			}
		},
		// 跳转客服
		toServicePage: function() {
			// window.location.href = './service.html?mId=' + getRequest().id + '&type=1'
			window.open('./service.html?mId=' + getRequest().id + '&type=1')
		},
		// 推荐商品 跳转
		toDetailPage: function(id) {
			this.marketClickNumMsg.data.NewmarketingId = id
			setMarketingClickNum(this.marketClickNumMsg).then(function(res) {})
			
			var history = JSON.parse(localStorage.getItem('recmArr'))
			if (history) {
				if (history.length > 1) {
					history.pop()
					history.unshift(id)
					localStorage.setItem('recmArr', JSON.stringify(history))
				} else {
					history.unshift(id)
					localStorage.setItem('recmArr', JSON.stringify(history))
				}
				window.location.href = './details.html?id=' + id + '&recmid=' + history[1]
			} else {
				var recmArr = []
				recmArr.push(id)
				localStorage.setItem('recmArr', JSON.stringify(recmArr))
				window.location.href = './details.html?id=' + id
			}
		},
		toLoginPage: function() {
			this.$message.error(this.sfLang.login)
			setTimeout(function() {
				window.location.href = './login.html?url='+window.location.href
			}, 1000)
		},
		// 切换 1商品详情 2评论
		switchHandel: function(num) {
			if (this.switchTab == num) return
			this.switchTab = num
			if (this.switchTab == 1) {
				this.pagerVisible = true
				vm.notContent = false
			} else {
				if(vm.sfCommentNum == 0){
					vm.pagerVisible = true
					vm.notContent = true
				}else{
					vm.pagerVisible = false
					vm.notContent = false
				}
			}
		},
		// 分页
		changePage: function(val) {
			this.commentMsg.data.page = val
			this.commentData = []

			var reviewH = document.querySelector('.backTop')
			var reviewHeight = document.querySelector('.container').scrollHeight + 211
			reviewH.scrollTop = reviewHeight

			getUserCommentDetail(vm.commentMsg).then(function(res) {
				vm.commentData = res.data.rows
				for (var i in res.data.rows) {
					vm.commentData[i].f_CommentStart = Number(res.data.rows[i].f_CommentStart)
					for (var k in vm.commentData[i].f_PicDetail) {
						vm.commentData[i].f_PicDetail[k] = imageUrl + vm.commentData[i].f_PicDetail[k]
					}
				}
				vm.total = res.data.total * 10
			})
		},
		// 检测商品数量输入框只能是正整数
		handleNum: function(e) {
			var flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value);
			if (!flag) {
				vm.addCartMsg.data.ShopCartDetail[0].F_Num = 1
			} else{
				if (parseInt(e.target.value) > 99) {
					vm.addCartMsg.data.ShopCartDetail[0].F_Num = 99
				}
			}
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		},
		// 关闭轮播图
		hidezhutu: function(){
		  vm.sfzhutu = false
			vm.reviewIndex = 5
		},
		sfchange: function(index){
		 vm.sfchangeImg(vm.reviewArr, index)
		},
		// 评论图片点击事件
		sfchangeImg: function(arrIndex, index){
			vm.sfzhutu = true
			vm.reviewArr = arrIndex			// 区分是第几组数据
			vm.reviewIndex = index			// 获取第几组数据的index
			this.setActiveItem(index)
		},
		setActiveItem : function(index){
			this.$refs.reviewCarousel[vm.reviewArr].setActiveItem(index)
		},
	}
})

// 商品详情懒加载
function lazyload() {
 setTimeout(function() {
  var images = document.querySelectorAll('.lazy');
  var len = images.length; // 获取懒加载的图片数量
  var n = 0; //存储图片加载到的位置，避免每次都从第一张图片开始遍历
  // return function() {
   var seeHeight = document.documentElement.clientHeight; //获取屏幕高度
   // console.log('clientHeight = '+seeHeight)
   // var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // 获取内容距顶部高度
   // console.log('scrollTop='+scrollTop)
   var backHeight = document.querySelector('.backTop').scrollTop // 获取滚动距顶部高度
   // console.log('scrollTop = '+backHeight)
   for (var i = n; i < len; i++) {
    if (images[i].offsetTop < seeHeight + backHeight + seeHeight ) {
     // console.log(images[i].offsetTop)
     if (images[i].getAttribute('src') === 'images/details/loading.gif') {
      images[i].src = images[i].getAttribute('data-src');
     }
     n = n + 1;
    }
   }
  // }
 }, 100)
}
lazyload() //初始化首页的页面图片
window.addEventListener('scroll', lazyload, true); //监听滚动事件执行懒加载