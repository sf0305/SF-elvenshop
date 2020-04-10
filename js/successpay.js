var vm = new Vue({
	el:'#app',
	data:{
		totalTime: 5,
		sfLang: {
			zhifu:'支付成功',
			wancheng:'您的订单已完成',
			fanhui:'返回我的订单',
			num: '5s',
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
		countDown: function() {
			var that = this
			that.sfLang.num = that.totalTime + 's'
			var clock = window.setInterval(function() {
				that.totalTime--
				that.sfLang.num = that.totalTime + 's'
				if (that.totalTime <= 0) {
					window.clearInterval(clock)
					that.totalTime = 5
				}
			},1000)
		},
	}
})
vm.countDown();
setTimeout(function(){
	window.location.href='orderList.html'
},5000)