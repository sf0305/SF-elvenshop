var vm = new Vue({
	el: '#collect',
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
		collectMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				f_UserId: userId,
				f_SearchContent: '',
				F_ShopId: '',
				page: 1,
				rows: 20,
			}
		},
		editCollectMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				f_UserId: userId,
				OperationType: 0,
				f_MarketingId: ''
			}
		},
		collectData: [],
		collectIndex: 1, // 状态  1 跳转商品详情  2 批量管理
		selectAll: false, // 选择全部
		switchItem: false, // 收藏商品的切换状态
		currencySign: '$',
		total: 0,
		pagerCollectVisible: false, // 收藏分页是否显示
		notCollect: false, // 收藏页没有数据显示
		sfLang: {
			search: '搜索',
			myCollect: '我的收藏',
			all: '全部',
			baobei: '宝贝搜索',
			batchMan: '批量管理',
			cancelMan: '取消管理',
			quanxuan: '全选',
			del: '删除',
			sfdel: '是否删除',
			tishi: '提示',
			notCollect: '暂无收藏',
			queding: '确定',
			quxiao: '取消',
			shanchu: '删除成功',
			delFail: '删除失败',
			meixuan: '您还没有选择',
			off: '已下架',
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
			vm.collectMsg.data.F_ShopId = res.data.f_ShopId
			vm.currencySign = res.data.f_CurrencySign
			
			//搜索历史记录
			getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
				vm.searchItem = res.data
			})
			
			getGoodsFocusInfos(vm.collectMsg).then(function(res) {
				if (res.info == 10) {
					var data = res.data.rows
					vm.total = res.data.total * 10
					vm.pagerCollectVisible = true
					vm.notCollect = false
					for (var i in data) {
						data[i].is_Select = false
					}
					vm.collectData = data
				} else {
					vm.pagerCollectVisible = false
					vm.notCollect = true
				}
			})
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
		changePage: function(val) { // 分页
			var back = document.querySelector('.backTop')
			back.scrollTop = 0
			vm.collectMsg.data.page = val
			this.getCollectData()
		},
		getCollectData: function() { // 收藏商品列表信息
			getGoodsFocusInfos(vm.collectMsg).then(function(res) {
				if (res.info == 10) {
					var data = res.data.rows
					for (var i in data) {
						data[i].is_Select = false
					}
					vm.collectData = data
					vm.total = res.data.total * 10
					vm.pagerCollectVisible = true
					vm.notCollect = false
				} else {
					vm.collectData = []
					vm.pagerCollectVisible = false
					vm.notCollect = true
					vm.switchItem = false
					vm.editCollectMsg.data.f_MarketingId = ''
					vm.selectAll = false
					// document.querySelector('#gl-1').style.pointerEvents = 'none'
				}
			})
		},
		searchCollect: function() { // 搜索商品收藏信息
			this.collectData = []
			this.getCollectData()
		},
		switchHandle: function() { // 收藏商品的切换状态
			this.switchItem = !this.switchItem
			if (this.switchItem == true) {
				this.collectIndex = 2
			} else {
				this.collectIndex = 1
				for (var i in this.collectData) {
					this.collectData[i].is_Select = false
					this.editCollectMsg.data.f_MarketingId = ''
					this.selectAll = false
				}
			}
		},
		selectCollect: function(id, index) { // 点击商品 1 跳转商品详情  2 批量管理
			if (this.collectIndex == 1) {
				window.location.href = './details.html?id=' + id
			} else if (this.collectIndex == 2) {
				this.collectData[index].is_Select = !this.collectData[index].is_Select

				var idArr = new Array()
				for (var k = 0; k < this.collectData.length; k++) {
					if (this.collectData[k].is_Select == true) {
						idArr.push(this.collectData[k].f_MarketingId)
					}
				}
				if (idArr.length == this.collectData.length) {
					this.selectAll = true
				} else {
					this.selectAll = false
				}
				this.editCollectMsg.data.f_MarketingId = idArr.join(',')
			}
		},
		selectAllCollect: function() { // 勾选全部收藏商品
			var idArr = new Array()
			if (!this.selectAll) {
				for (var i = 0; i < this.collectData.length; i++) {
					this.collectData[i].is_Select = true
					idArr.push(this.collectData[i].f_MarketingId)
				}
				this.selectAll = true
				this.editCollectMsg.data.f_MarketingId = idArr.join(',')
			} else {
				for (var i = 0; i < this.collectData.length; i++) {
					this.editCollectMsg.data.f_MarketingId = ''
					this.collectData[i].is_Select = false
				}
				this.selectAll = false
			}
		},
		delCollect: function() { // 删除收藏商品
			if (this.editCollectMsg.data.f_MarketingId == '') {
				this.$message(vm.sfLang.meixuan)
				return
			}
			var that = this
			that.$confirm(vm.sfLang.sfdel, vm.sfLang.tishi, {
				confirmButtonText: vm.sfLang.queding,
				cancelButtonText: vm.sfLang.quxiao,
				type: 'warning'
			}).then(function() {
				operationGoodsFocusInfos(vm.editCollectMsg).then(function(res) {
					if (res.info == 10) {
						vm.getCollectData()
						vm.editCollectMsg.data.f_MarketingId = ''
						that.$message.success(vm.sfLang.shanchu)
					} else {
						that.$message.error(vm.sfLang.delFail)
					}
				})
			}).catch(function() {
				console.log('未知错误')
			})
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		}
	}
})
