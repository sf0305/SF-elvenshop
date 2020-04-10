var vm = new Vue({
	el:'#app',
	data:{
		sfLang: {
			download:'下载',
			huanying: '欢迎来到',
			gouwupingtai: '东南亚最大的在线购物平台',
			huoqu: '立即获取应用',
			anzhuo: '安卓',
			suishi: '随时随地购物',
			yongyou: '拥有众多购物中心卖家和值得信赖的市场卖家，现在就购物，寻找最优惠的价格并节省大量资金',
			wuliu: '物流支持',
			wuliumsg: '通过最新的运输信息跟踪您从付款到交货的订单',
			kehu: '客户支持',
			kehumsg: '有问题吗？联系我们友好的客户服务团队以解决您的问题',
			tuijian: '每日发现',
			tuijianmsg: '探索适合您的每日产品推荐',
			fukuan: '安全付款方式',
			fukuanmsg: '使用您喜欢的方式进行交易，无论是银行转帐还是信用卡',
			liaotian: '聊天购物',
			liaotianmsg: '实时聊天可从卖家获得最优惠的价格',
			baozheng: '保证',
			baozhengmsg: '保证只在买家收到购买商品后才将付款发送给卖家。我们保证您的安全',
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
	}
})

if (document.getElementById("saveqrcode")) {
	var qrcode = new QRCode(document.getElementById("saveqrcode"), {
		width: 180,
		height: 180,
		colorDark: "#000", //二维码颜色
		// colorLight : "#fdad49", //背景色
		correctLevel: QRCode.CorrectLevel.Q //纠错等级
	});
	qrcode.makeCode(sessionStorage.getItem('sfqrcode'));
}
