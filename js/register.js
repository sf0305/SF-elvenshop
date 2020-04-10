var xieyi = document.querySelector('.xieyi');

var vm = new Vue({
	el: '#itany',
	data: {
		userMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserName: "",
				F_PetNameUser: '',
				F_PhotoUrl: '',
				F_PassWord: "",
				F_UserEmail: "",
				F_ShopId: '',
				F_ThirdPartyChannels: ''
			}
		},
		sfLang: {
			//弹窗
			regWanshan: '请完善信息',
			regCase5: '注册成功',
			regCase6: '注册失败',
			regCase18: '用户名已存在',
			regCase19: '邮箱已被注册',
			regErr: '未知错误',
			// 提示
			tipsUser: "用户名格式不正确",
			tipsLeg: "用户名不合法",
			tipsMail: "邮箱格式不正确",
			tipspwd: "密码格式不正确",
			tipsCom: "两次密码不一致",
			tipsCode: "验证码不正确",
			// html输入框placeholder
			username: '用户名',
			mail: "邮箱",
			password: "密码",
			comfirmpwd: "确认密码",
			//html文本内容
			huanyihuan: "换一换",
			xieyi: "我已阅读用户协议",
			yiyou: "已有账号，现在登录",
			zhuce: "注册",
			sfmima: '请输入6-20位密码' ,
			sfyonghu: '请输入用户名',
			sfyouxiang: '请输入邮箱',
			sfcode: '验证码',
			errxieyi: '未同意协议',
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
			vm.userMsg.data.F_ShopId = res.data.f_ShopId
		})
	},
	methods: {
		send: function() {
			var that = this
			var chebox = document.querySelector('.checkbox');
			
			if (yhmc() && emailVction() && pwdYz() && yzRandomNum() ) {
				if(!chebox.checked){
					that.$message.warning(vm.sfLang.errxieyi)
					return
				}
				createUsers(vm.userMsg).then(function(res) {
					switch (Number(res.info)) {
						case 5:
							setTimeout(function() {
								window.location.href = "login.html";
							}, 2000);
							that.$message.success(vm.sfLang.regCase5)
							break;
						case 6:
							that.$message.warning(vm.sfLang.regCase6)
							break
						case 18:
							that.$message.warning(vm.sfLang.regCase18)
							break;
						case 19:
							that.$message.warning(vm.sfLang.regCase19)
							break;
						default:
							that.$message.error(vm.sfLang.regErr)
							break
					}
				})
			} else {
				that.$message.error(vm.sfLang.regWanshan)
			}
		},
		sfXieyi: function() {
			window.open("./help.html?type=10")
		}
	}
});

var userBg = document.querySelector(".user-bg");
var userName = document.querySelector(".username");
var emailBg = document.querySelector(".email-bg");
var Email = document.querySelector(".name");
var pwdBg = document.querySelector(".pwd-bg");
var Pwd = document.querySelector(".pwd");
var pwdxBg = document.querySelector(".pwd1-bg");
var Pwdx = document.querySelector(".pwd-1");
var Yzm = document.querySelector(".yzNum");
// 邮箱帐号获得失去焦点事件
function emailFocus() {
	emailBg.src = "images/register/email.png";
	Email.style.borderBottom = "1px solid #ff5230";
}

function emailVction() {
	var email = document.querySelector('.name').value;
	var emailText = document.querySelector('#emailText');
	var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
	if (reg.test(email) && email != '' && email != null) {
		emailText.innerHTML = "";
		emailBg.src = "images/register/email.png";
		Email.style.borderBottom = "1px solid #ff5230";
		return true;
	} else {
		emailText.innerHTML = "<span>!</span>" + vm.sfLang.tipsMail;
		emailBg.src = "images/register/email-bg.png";
		Email.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}
}


// 密码框获得失去焦点事件
function pwdFocus() {
	pwdBg.src = "images/register/pwd.png";
	Pwd.style.borderBottom = "1px solid #ff5230";
}

function pwdVction() {
	var pwd = document.querySelector('.pwd').value;
	var pwdText = document.querySelector('#pwdText');
	var reg = /^[a-zA-Z0-9-_@.]{6,20}$/;
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

// 验证码随机函数
function randomNum() {
	var yzm = document.querySelector('.yzm');
	var numText = '';
	for (var i = 0; i < 4; i++) {
		var num = Math.floor(Math.random() * 9 + 1);
		numText += num;
	}

	yzm.innerHTML = numText;

}
randomNum();

// 验证码获得失去焦点事件
function yzmFocus() {
	Yzm.style.borderBottom = "1px solid #ff5230";
}

function yzRandomNum() {
	var yzm = document.querySelector('.yzm').innerHTML;
	var yzNum = document.querySelector('.yzNum').value;
	var yzok = document.querySelector('.yzok');
	if (yzm == yzNum) {
		yzok.innerHTML = "";
		Yzm.style.borderBottom = "1px solid #ff5230";
		return true;
	} else {
		yzok.innerHTML = "<span>!</span>" + vm.sfLang.tipsCode;
		Yzm.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}
}


// 用户名获得失去焦点事件
function userFocus() {
	userBg.src = "images/register/name.png";
	userName.style.borderBottom = "1px solid #ff5230";
}

function yhmc() {
	var username = document.querySelector('.username').value;
	var regWorld = ['select', 'insert', 'devare', 'from', 'count', 'drop', 'table', 'update', 'truncate', 'asc', 'mid',
		'char', 'xp_cmdshell', 'exec', 'master', 'net', 'ocalgroup', 'administrators', 'net', 'user', 'or', 'and'
	];
	var userText = document.getElementById('userText');
	var reg = /^[a-zA-Z0-9_-]{3,100}$/;
	var loweUser = username.toLowerCase();
	if (reg.test(username)) {
		for (var i = 0; i < regWorld.length; i++) {
			if (loweUser === regWorld[i]) {
				userText.innerHTML = "<span>!</span>" + vm.sfLang.tipsLeg;
				userBg.src = "images/register/name_bg.png";
				userName.style.borderBottom = "1px solid #e8e8e8";
				return;
			}
		}
		userText.innerHTML = "";
		userBg.src = "images/register/name.png";
		userName.style.borderBottom = "1px solid #ff5230";
		return true;
	} else {
		userText.innerHTML = "<span>!</span>" + vm.sfLang.tipsUser;
		userBg.src = "images/register/name_bg.png";
		userName.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}
}

var chebox = document.querySelector('.checkbox');
var Radio = document.querySelector(".radio");

function radioClick() {
	if (chebox.checked) {
		Radio.style.background = "url(images/register/duihao_bg.png)";
		Radio.style.backgroundSize = "100%";
	} else {
		Radio.style.background = "url(images/register/duihao.png)";
		Radio.style.backgroundSize = "100%";
	}
}
