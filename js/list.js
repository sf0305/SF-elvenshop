var vm = new Vue({
	el: '#itany',
	data: function() {
		return {
			pageNum: '', // 0 全局搜索, 1 一级搜索, 2 二级搜索, 3 轮播图点击事件获取商品列表
			total: 0,
			page: 1,
			searchVisible: false,
			searchFlag: false,
			pagerVisible: true,
			categoryMsg: { // 一二级菜单
				token: requireToken(),
				loginMark: loginMark,
				data: {
					FirstCategoryId: '',
					SecondCategoryId: '',
					ShopId: '',
					F_SearchContent: '',
					sord: '',
					sidx: '',
					page: 1,
					rows: 20,
				}
			},
			bannerDetailMsg: { // 轮播图数据
				token: requireToken(),
				loginMark: loginMark,
				data: {
					F_ShopId: '',
					F_HomePageDisplayId: '',
					F_CategoryId: '',
					F_SearchContent: '',
					sord: 'desc',
					sidx: '',
					page: 1,
					rows: 20
				}
			},
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
			searchData: [],
			currencySign: '$',
			ins: 0,
			priceSort: true,
			saleSort: true,
			sfLang: {
				search: '搜索',
				all: '全部',
				sales: '销量',
				price: '价格',
				news: '新品',
				none: '暂时没有商品，敬请期待',
				sfersongyi: '买二送一',
				sferbanjia: '第二件半价',
				sfserhis: '搜索历史',
			},
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
		var test = window.location.href;
		var testlength = test.indexOf('page');
		this.pageNum = Number(test.slice(testlength + 4, testlength + 5));
		shopMsg.token = requireToken()
		
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.searchMsg.data.ShopId = res.data.f_ShopId
			vm.categoryMsg.data.ShopId = res.data.f_ShopId
			vm.bannerDetailMsg.data.F_ShopId = res.data.f_ShopId
			vm.currencySign = res.data.f_CurrencySign
			
			//搜索历史记录
			getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
				vm.searchItem = res.data
			})
			
			if (vm.pageNum == 0) {
				var uncode = test.slice(testlength + 9, test.length)
				vm.searchMsg.data.F_SearchContent = decodeURI(uncode)

				getGoodsSearch(vm.searchMsg).then(function(res) {
					if (res.info == 10) {
						vm.searchData = res.data.rows
						vm.total = res.data.total * 10
						vm.pagerVisible = false
						if (vm.searchData.length == 0) {
							vm.pagerVisible = true
							vm.searchVisible = true
						} else {
							vm.pagerVisible = false
							vm.searchVisible = false
						}
					} else {
						vm.searchFlag = true
					}
				})
			} else if (vm.pageNum == 1) {
				vm.categoryMsg.data.FirstCategoryId = test.slice(testlength + 9, test.length)

				getFirstCategoryGoodsDetail(vm.categoryMsg).then(function(res) {
					if (res.info == 10) {
						vm.searchData = res.data.rows
						vm.total = res.data.total * 10
						vm.pagerVisible = false
					} else {
						vm.searchFlag = true
					}
				})
			} else if (vm.pageNum == 2) {
				vm.categoryMsg.data.SecondCategoryId = test.slice(testlength + 9, test.length)

				getSecondCategoryGoodsDetail(vm.categoryMsg).then(function(res) {
					if (res.info == 10) {
						vm.searchData = res.data.rows
						vm.total = res.data.total * 10
						vm.pagerVisible = false
					} else {
						vm.searchFlag = true
					}
				})
			} else if (vm.pageNum == 3) {
				vm.bannerDetailMsg.data.F_HomePageDisplayId = test.slice(testlength + 9, test.length)

				getHomePageDisplayDetail(vm.bannerDetailMsg).then(function(res) {
					if (res.info == 10) {
						vm.searchData = res.data.rows
						vm.total = res.data.total * 10
						vm.pagerVisible = false
					} else {
						vm.searchFlag = true
					}
				})
			}
		})
	},
	methods: {
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
		// 分页
		changePage: function(val) {
			var back = document.querySelector('.backTop')
			back.scrollTop = 0
			if (vm.pageNum == 0) {
				
				vm.searchMsg.data.page = val
				getGoodsSearch(vm.searchMsg).then(function(res) {
					vm.searchData = res.data.rows
				})
			} else if (vm.pageNum == 1) {
				
				vm.categoryMsg.data.page = val
				getFirstCategoryGoodsDetail(vm.categoryMsg).then(function(res) {
					vm.searchData = res.data.rows
				})
			} else if (vm.pageNum == 2) {
				
				vm.categoryMsg.data.page = val
				getSecondCategoryGoodsDetail(vm.categoryMsg).then(function(res) {
					vm.searchData = res.data.rows
				})
			} else if (vm.pageNum == 3) {
				
				vm.bannerDetailMsg.data.page = val
				getHomePageDisplayDetail(vm.bannerDetailMsg).then(function(res) {
					vm.searchData = res.data.rows
				})
			}
		},
		// 跳转详情页面
		detailHandle: function(id) {
			window.location.href = './details.html?id=' + id
		},
		// 全部
		allProduct: function() {
			this.ins = 0
			this.page = 1
			this.saleSort = true
			this.priceSort = true
			this.searchMsg.data.sidx = ''
			this.searchMsg.data.page = 1
			this.bannerDetailMsg.data.sidx = ''
			this.bannerDetailMsg.data.page = 1
			this.categoryMsg.data.sidx = ''
			this.categoryMsg.data.page = 1
			this.requsetAJAX()
		},
		// 销量排序
		salesProduct: function() {
			this.ins = 1
			this.page = 1
			this.priceSort = true
			if (this.saleSort) {
				if (this.pageNum == 0) {
					this.searchMsg.data.page = 1
					this.searchMsg.data.sidx = 'F_SaleNum',
					this.searchMsg.data.sord = 'desc'
				} else if (this.pageNum == 3) {
					this.bannerDetailMsg.data.page = 1
					this.bannerDetailMsg.data.sidx = 'F_SaleNum',
					this.bannerDetailMsg.data.sord = 'desc'
				} else {
					this.categoryMsg.data.page = 1
					this.categoryMsg.data.sidx = 'F_SaleNum'
					this.categoryMsg.data.sord = "desc"
				}
			} else {
				if (this.pageNum == 0) {
					this.searchMsg.data.sidx = 'F_SaleNum',
						this.searchMsg.data.sord = 'asc'
				} else if (this.pageNum == 3) {
					this.bannerDetailMsg.data.sidx = 'F_SaleNum',
						this.bannerDetailMsg.data.sord = 'asc'
				} else {
					this.categoryMsg.data.sidx = 'F_SaleNum'
					this.categoryMsg.data.sord = "asc"
				}
			}
			this.saleSort = !this.saleSort
			this.requsetAJAX()
		},
		// 价格排序
		priceProduct: function() {
			this.ins = 2
			this.page = 1
			this.saleSort = true
			if (this.priceSort) {
				if (this.pageNum == 0) {
					this.searchMsg.data.page = 1
					this.searchMsg.data.sidx = 'F_SalesPrice',
					this.searchMsg.data.sord = 'desc'
				} else if (this.pageNum == 3) {
					this.bannerDetailMsg.data.page = 1
					this.bannerDetailMsg.data.sidx = 'F_SalesPrice',
					this.bannerDetailMsg.data.sord = 'desc'
				} else {
					this.categoryMsg.data.page = 1
					this.categoryMsg.data.sidx = 'F_SalesPrice'
					this.categoryMsg.data.sord = "desc"
				}
			} else {
				if (this.pageNum == 0) {
					this.searchMsg.data.page = 1
					this.searchMsg.data.sidx = 'F_SalesPrice',
					this.searchMsg.data.sord = 'asc'
				} else if (this.pageNum == 3) {
					this.bannerDetailMsg.data.page = 1
					this.bannerDetailMsg.data.sidx = 'F_SalesPrice',
					this.bannerDetailMsg.data.sord = 'asc'
				} else {
					this.categoryMsg.data.page = 1
					this.categoryMsg.data.sidx = 'F_SalesPrice'
					this.categoryMsg.data.sord = "asc"
				}
			}
			this.priceSort = !this.priceSort
			this.requsetAJAX()
		},
		// 新品
		newProduct: function() {
			this.ins = 3
			this.page = 1
			this.saleSort = true
			this.priceSort = true
			if (this.pageNum === 0) {
				this.searchMsg.data.page = 1
				this.searchMsg.data.sidx = 'F_PublishDate'
			} else if (this.pageNum === 3) {
				this.bannerDetailMsg.data.page = 1
				this.bannerDetailMsg.data.sidx = 'F_PublishDate'
			} else {
				this.categoryMsg.data.page = 1
				this.categoryMsg.data.sidx = 'F_PublishDate'
			}
			this.requsetAJAX();
		},
		requsetAJAX: function() {
			if (this.pageNum === 0) {
				getGoodsSearch(vm.searchMsg).then(function(res) {
					vm.searchData = res.data.rows
					vm.total = res.data.total * 10
				})
			} else if (this.pageNum === 1) {
				getFirstCategoryGoodsDetail(vm.categoryMsg).then(function(res) {
					vm.searchData = res.data.rows
					vm.total = res.data.total * 10
				})
			} else if (this.pageNum === 2) {
				getSecondCategoryGoodsDetail(vm.categoryMsg).then(function(res) {
					vm.searchData = res.data.rows
					vm.total = res.data.total * 10
				})
			} else if (this.pageNum === 3) {
				getHomePageDisplayDetail(vm.bannerDetailMsg).then(function(res) {
					vm.searchData = res.data.rows
					vm.total = res.data.total * 10
				})
			}
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		}
	}
});
