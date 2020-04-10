var vm = new Vue({
	el:'#app',
	data: {
		sfLang: {
			fail : '网络异常',
			rejia : '重新加载',
			zaishi : '服务器开小差了，再试一次吧'
		},
		changeOrderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: getQueryString('no'),
				F_PayType: getQueryString('type'),
				F_PayTransactionId: getQueryString('payId'),
				F_PayTime: getQueryString('timer'),
				F_PayerID: getQueryString('payId')
			}
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
	methods:{
		toOrderPage: function() {
			changePaymentOrder(this.changeOrderMsg).then(function(res) {
				if (res.info == 10) {
					window.location.href = './orderList.html'
				}
			})
		}
	}
})
