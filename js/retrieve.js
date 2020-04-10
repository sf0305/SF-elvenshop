var vm = new Vue({
	el: '#app',
	data: {
		emailMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: '',
				F_UserEmail: ''
			}
		},
		totalTime: 60,
		canClick: false,
		btnload: false,
		codeMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: '',
				F_SendEmailCode: ''
			}
		},
		//翻译
		sfLang: {
			// 弹窗
			regEmail: '请输入邮箱',
			regemailno: "邮箱错误",
			regCode: "请输入验证码",
			errCode: "验证码错误",
			send: "发送成功",
			// 提示
			tipsMail: "邮箱格式不正确",
			tipsLegmail: "邮箱不合法",
			// html输入框placeholder
			emailAdd: "邮箱地址",
			emailCode: "验证码",
			//html文本内容
			retPwd: "更改密码",
			login: "登录",
			register: "注册",
			shopCart: "购物车",
			verify: "验证邮箱地址",
			setNewpwd: "设置新密码",
			sendText: "发送",
			resendText: "重新发送",
			nextText: "下一步",
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
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.emailMsg.data.F_ShopId = res.data.f_ShopId
		})
	},
	methods: {
		send: function() {
			var that = this
			if (that.emailMsg.data.F_UserEmail.trim() == '') {
				that.$message.warning(vm.sfLang.regEmail)
				return
			}
			var loading = that.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			getUserInfoByEmail(vm.emailMsg).then(function(res) {
				if (res.info == 10) {
					loading.close()
					that.btnload = true
					that.$message.success(vm.sfLang.send)
					vm.countDown()
					vm.codeMsg.data.F_UserId = res.data.f_Id

				} else {
					loading.close()
					that.$message.error(vm.sfLang.regemailno)
				}
			})
		},
		toPage: function() {
			var that = this
			if (that.emailMsg.data.F_UserEmail.trim() == '') {
				that.$message.warning(vm.sfLang.regEmail)
				return
			} else if (that.codeMsg.data.F_SendEmailCode.trim() == '') {
				this.$message.warning(vm.sfLang.regCode)
				return
			}
			loginComparisonCode(vm.codeMsg).then(function(res) {
				if (res.info == 10) {
					window.location.href = './password.html?userId=' + vm.codeMsg.data.F_UserId
				} else {
					vm.codeMsg.data.F_SendEmailCode = ''
					that.$message.error(vm.sfLang.errCode)
				}
			})
		},
		// 60秒倒计时
		countDown: function() {
			var sfsend = document.querySelector('.send')
			sfsend.style.pointerEvents = 'none'
				 
			var that = this
			if (that.canClick) return
			that.canClick = true
			that.sfLang.sendText = that.totalTime + 's'
			var clock = window.setInterval(function() {
				that.totalTime--
				that.sfLang.sendText = that.totalTime + 's'
				if (that.totalTime <= 0) {
					window.clearInterval(clock)
					that.sfLang.sendText = that.sfLang.resendText
					that.totalTime = 60
					that.canClick = false
					sfsend.style.pointerEvents = 'auto'
				}
			}, 1000)
		}
	}
})
var nameBg = document.querySelector(".name-bg");
var pwdBg = document.querySelector(".pwd-bg");
var Name = document.querySelector(".name");
var Pwd = document.querySelector(".pwd");

function emailFocus() {
	nameBg.src = "images/register/email.png";
	Name.style.borderBottom = "1px solid #ff5230";
}

function emailVction() {
	var email = document.querySelector('.name').value;
	var emailText = document.querySelector('#emailText');
	var regWorld = ['select', 'insert', 'devare', 'from', 'count', 'drop', 'table', 'update', 'truncate', 'asc', 'mid',
		'char', 'xp_cmdshell', 'exec', 'master', 'net', 'ocalgroup', 'administrators', 'net', 'user', 'or', 'and'
	];
	var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
	var loweUser = email.toLowerCase();
	if (reg.test(email)) {
		// for (var i = 0; i < regWorld.length; i++) {
		// 	if ( loweUser === regWorld[i] ){
		// 		emailText.innerHTML = "<span>!</span>"+vm.sfLang.tipsLegmail;
		// 		nameBg.src = "images/register/email-bg.png";
		// 		Name.style.borderBottom = "1px solid #e8e8e8";
		// 		return;
		// 	}
		// }
		emailText.innerHTML = "";
		nameBg.src = "images/register/email.png";
		return true;
	} else {
		emailText.innerHTML = "<span>!</span>" + vm.sfLang.tipsMail;
		nameBg.src = "images/register/email-bg.png";
		Name.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}

}

function pwdFocus() {
	pwdBg.src = "images/retrieve/pwd.png";
	Pwd.style.borderBottom = "1px solid #ff5230";
}

function pwdVction() {
	var pwd = document.querySelector('.pwd').value;
	var emailText = document.querySelector('#emailText');
	if (pwd != '') {
		pwdBg.src = "images/retrieve/pwd.png";
		Pwd.style.borderBottom = "1px solid #ff5230";
	} else {
		pwdBg.src = "images/retrieve/pwd-bg.png";
		Pwd.style.borderBottom = "1px solid #e8e8e8";
	}

}
