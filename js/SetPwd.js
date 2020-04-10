var vm = new Vue({
	el: '#app',
	data: {
		editMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: '',
				F_UserId: getRequest().userId,
				F_PassWord: ''
			}
		},
		confirmPwd: '',
		//翻译
		sfLang: {
			// 弹窗
			regWanshan: '请完善信息',
			pwdFinish: "密码重置成功",
			// 提示
			tipspwd: "密码格式不正确",
			tipsCom: "两次密码不一致",
			// html输入框placeholder
			newPwd: "请输入新密码",
			conNewpwd: "请确认密码",
			//html文本内容
			retPwd: "更改密码",
			login: "登录",
			register: "注册",
			shopCart: "购物车",
			verify: "验证邮箱地址",
			setNewpwd: "设置新密码",
			finish: "完成",
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
			vm.editMsg.data.F_ShopId = res.data.f_ShopId
		})
	},
	methods: {
		submit: function() {
			var that = this
			if (pwdVction() && pwdYz()) {
				var loading = that.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				userEdit(vm.editMsg).then(function(res) {
					if (res.info == 10) {
						loading.close()
						that.$message.success(vm.sfLang.pwdFinish)
						setTimeout(function() {
							window.location.href = './login.html'
						}, 1500)
					} else {
						loading.close()
					}
				})
			} else {
				that.$message.warning(that.sfLang.regWanshan)
			}
		}
	}
})


var pwdBg = document.querySelector(".pwd-bg");
var Pwd = document.querySelector(".pwd");
var pwdxBg = document.querySelector(".pwd1-bg");
var Pwdx = document.querySelector(".pwd-1");
// 密码框获得失去焦点事件
function pwdFocus() {
	pwdBg.src = "images/register/pwd.png";
	Pwd.style.borderBottom = "1px solid #ff5230";
}

function pwdVction() {
	var pwd = document.querySelector('.pwd').value;
	var pwdText = document.querySelector('#pwdText');
	var reg = /^[a-zA-Z0-9]{6,20}$/;
	if (reg.test(pwd) && pwd != '' && pwd != null) {
		pwdText.innerHTML = '';
		pwdBg.src = "images/register/pwd.png";
		Pwd.style.borderBottom = "1px solid #ff5230";
		return pwd;
	} else {
		pwdText.innerHTML = '<span>!</span>' + vm.sfLang.tipspwd;
		pwdBg.src = "images/register/pwd-bg.png";
		Pwd.style.borderBottom = "1px solid #e8e8e8";
		return;
	}
}

// 重复密码获得失去焦点事件
function pwd1Focus() {
	pwdxBg.src = "images/register/pwd.png";
	Pwdx.style.borderBottom = "1px solid #ff5230";
}

function pwdYz() {
	var pwd1 = document.querySelector('.pwd-1').value;
	var pwd1Text = document.querySelector('#pwd1Text');
	if (pwd1 == pwdVction() && pwd1 != null && pwd1 != '') {
		pwd1Text.innerHTML = "";
		pwdxBg.src = "images/register/pwd.png";
		Pwdx.style.borderBottom = "1px solid #ff5230";
		return true;
	} else {
		pwd1Text.innerHTML = "<span>!</span>" + vm.sfLang.tipsCom;
		pwdxBg.src = "images/register/pwd-bg.png";
		Pwdx.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}
}
