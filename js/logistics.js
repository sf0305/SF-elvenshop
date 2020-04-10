var vm = new Vue({
	el: '#wuliu',
	data: {
		wuliuMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: getRequest().no
			}
		},
		wuliuData: [],
		orderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_SearchContent: '',
				F_OrderState: [0],
				F_OrderNo: getRequest().no,
				rows: 10,
				page: 1
			}
		},
		orderData: {},
		orderImgUrl: [],
		trackStatus: '',
		sfLog:'',
		sfLang: {
			baoguo: '包裹信息',
			chuku: '出库中',
			yunshu: '运输中',
			qianshou: '已签收',
			juqian:'已拒签',
			emwuliu:'暂无物流信息',
			orderNum:'订单号',
			addr:'收货地址'
		}
	},
	created: function() {
		// 页面翻译
		var that = this;
		var langArr = JSON.parse(localStorage.getItem('langArr'))
		if (langArr) {
			for(var i in that.sfLang){
				for(var j in langArr){
					if(that.sfLang[i] == langArr[j].f_CNMenuName){
						that.sfLang[i]=langArr[j].f_MenuName
					}
				}
			}
		} else {
			getLanguage(that.sfLang)
		}
	},
	mounted: function(){
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.orderMsg.data.F_ShopId = res.data.f_ShopId					// 物流
			getOrders(vm.orderMsg).then(function(res) {
				if (res.info == 10) {
					vm.orderData = res.data.rows[0]
					for (var i in vm.orderData.orderDetail) {
						vm.orderImgUrl.push(vm.orderData.orderDetail[i].f_GoodsImg)
					}
				}
			})
		})
		getOrderTrackingInfo(this.wuliuMsg).then(function(res) {
			if (res.info == 10) {
				vm.wuliuData = res.data
				vm.trackStatus = res.data[0].f_TrackStatusName
				vm.sfLog = res.data[0].f_TrackStatus
			}
		})
	}
})