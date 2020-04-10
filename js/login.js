var vm = new Vue({
	el: '#itany',
	data: {
		userMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserName: '',
				F_PetNameUser: '',
				F_PassWord: '',
				F_ShopId: '',
				F_MachineCode: '',
				F_ThirdPartyChannels: ''
			}
		},
		thirdMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_PetNameUser: '',
				F_Email: '',
				F_PhotoUrl: '',
				F_TelPhoneNum: '',
				F_ShopId: '',
				F_ThirdPartyChannels: '',
				F_ThirdPartyUseId: '',
			}
		},
		sfyzm: 0,
		//翻译
		sfLang: {
			// 弹窗
			regWanshan: '请完善信息',
			regCase1: '登录失败',
			regCase2: '登录成功',
			regCase3: '用户不存在',
			regCase4: '密码错误',
			regCase8: '用户已锁定',
			regErr: '未知错误',
			// 提示
			tipsUser: "帐号格式不正确",
			tipsLeg: "帐号不合法",
			tipspwd: "密码格式不正确",
			tipsCode: "验证码不正确",
			// html输入框placeholder
			mailuser: "邮箱/用户名",
			password: "密码",
			//html文本内容
			huanyihuan: "换一换",
			login: "登录",
			forget: "忘记密码",
			regnew: "注册新用户",
			tips: '提示',
			emailText: '请输入邮箱',
			sure: '确定',
			cancel: '取消',
			emailError: '邮箱格式不正确',
			emailTips: '邮箱已被注册',
			registerSuccess: '注册成功',
			registerFaile: '注册失败',
			networdFail: '网络异常',
			sfcode: '验证码'
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
		var that = this
		// 第三方登录 Facebook
		window.fbAsyncInit = function() {
			FB.init({
				appId: '955602698154729',
				cookie: false,
				xfbml: true,
				version: 'v5.0'
			});
			FB.AppEvents.logPageView()
		};
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.userMsg.data.F_ShopId = res.data.f_ShopId
			vm.thirdMsg.data.F_ShopId = res.data.f_ShopId
		})
		
		// Line 第三方登录 回调回来调用数据，接收授权码code
		if (getQueryString('code')) {
			// 获取访问令牌
			var params = {
				grant_type: 'authorization_code',
				code: getQueryString('code'),
				// redirect_uri: 'http://127.0.0.1:8848/fayun/ElvenShop-web/login.html',
				redirect_uri: 'https://www.elvenshop.com/login.html',
				client_id: '1653888823',
				client_secret: 'bad121da6921bf52c555bcd4d509f6f5'
			}
			axiosPost('https://api.line.me/oauth2/v2.1/token', params).then(function(res) {
				var access_token = res.access_token
				if (access_token) {
					axios({
						url: 'https://api.line.me/v2/profile',
						method: 'get',
						headers: {
							'Authorization': 'Bearer ' + access_token
						}
					}).then(function(res) {
						vm.thirdMsg.data.F_PetNameUser = res.data.displayName
						vm.thirdMsg.data.F_ThirdPartyChannels = 2
						vm.thirdMsg.data.F_ThirdPartyUseId = res.data.userId
						vm.thirdMsg.data.F_PhotoUrl = res.data.pictureUrl
						
						thirdPartyLogin(vm.thirdMsg).then(function(res) {
							if (res.info == 2) { // 登录成功
								var userInfo = {
									userId: res.data.f_Id,
									userName: res.data.f_UserName,
									userPhoto: res.data.f_PhotoUrl
								}
								var storage = new Storage()
								storage.setItem({
									name: 'userInfo',
									value: userInfo
								})
								that.$message.success(vm.sfLang.regCase2)
								if (getQueryString('url')) {
									window.location.href = getQueryString('url')
								} else {
									window.location.href = "./index.html"
								}
							} else if (res.info == 3) { // 用户不存在
								// 第三方用户没注册 提示框填写邮箱
								vm.thirdRegister()
							} else if (res.info == 8) { // 用户已锁定
								that.$message.warning(vm.sfLang.regCase8)
								return
							} else if (res.info == 1) { // 登录失败
								that.$message.error(vm.sfLang.regCase1)
								return
							} else if (res.info == 11) { // 响应失败
								that.$message.error(vm.sfLang.networdFail)
								return
							}
						})
					})
				} else {
					that.$message.error(vm.sfLang.regCase1)
				}
			}).catch(function(error) {
				console.log(error)
			})
		}
	},
	methods: {
		// line 第三方登录
		lineLogin: function() {
			var response_type = 'code',			// LINE平台返回授权码
					client_id = 1653732673,			// 频道编号 - LINE为您的频道发布的唯一标识符
					// redirect_uri = 'http%3a%2f%2f127.0.0.1%3a8848%2ffayun%2fElvenShop-web%2flogin.html',
					redirect_uri = 'https%3a%2f%2fwww.elvenshop.com%2flogin.html',			// 回调网址
					state = '5pb8DTSdadTDmomJXSUVTaZ09yHHo7d9KBPpU6L4xf27l0vMsSQYzLsduCY/bVLo3sTsrxgA8GuZ2DdsGuoV28fa5UlQ2JJCR25XnShT7hyvp3PEB5AttYhegG6OTuTd',			// 唯一字母数字字符串, 该值应由您的应用程序随机生成。不能是URL编码的字符串
					scope = 'profile%20openid%20email',			// 用户授予的权限。您可以使用URL编码的空白字符（％20）指定多个范围
					nonce = getNum()			// 用于防止重放攻击的32位字符串
			
			// window.location.href = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1653888823&redirect_uri='+redirect_uri+'&scope=profile%20openid%20email&nonce='+nonce+'&state='+state
			window.location.href = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=profile%20openid%20email&nonce='+nonce+'&state='+state
		},
		// facebook 第三方登录
		facebookLogin: function() {
			var that = this
			sessionStorage.setItem('facebook', 1)
			FB.login(function(response) {
				if (response.status === 'connected') {
					FB.api('/me', function(response) {
						vm.thirdMsg.data.F_PetNameUser = response.name
						vm.thirdMsg.data.F_ThirdPartyChannels = 1
						vm.thirdMsg.data.F_ThirdPartyUseId = response.id
						vm.thirdMsg.data.F_PhotoUrl = FB.api(response.id + '/picture')

						thirdPartyLogin(vm.thirdMsg).then(function(res) {
							if (res.info == 2) { // 登录成功
								var userInfo = {
									userId: res.data.f_Id,
									userName: res.data.f_UserName,
									userPhoto: res.data.f_PhotoUrl
								}
								var storage = new Storage()
								storage.setItem({
									name: 'userInfo',
									value: userInfo
								})
								that.$message.success(vm.sfLang.regCase2)
								if (getQueryString('url')) {
									window.location.href = getQueryString('url')
								} else {
									window.location.href = "./index.html"
								}
							} else if (res.info == 3) { // 用户不存在
								// 第三方用户没注册 提示框填写邮箱
								vm.thirdRegister()
								// that.$prompt(vm.sfLang.emailText, vm.sfLang.tips, {
								// 	confirmButtonText: vm.sfLang.sure,
								// 	cancelButtonText: vm.sfLang.cancel,
								// 	inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
								// 	inputErrorMessage: vm.sfLang.emailError
								// }).then(function(resp) {
								// 	vm.thirdMsg.data.F_Email = resp.value
								// 	thirdPartyRegister(vm.thirdMsg).then(function(res) {
								// 		// 注册成功
								// 		if (res.info == 5) {
								// 			var userInfo = {
								// 				userId: res.data.f_Id,
								// 				userName: res.data.f_UserName,
								// 				userPhoto: res.data.f_PhotoUrl
								// 			}
								// 			var storage = new Storage()
								// 			storage.setItem({
								// 				name: 'userInfo',
								// 				value: userInfo
								// 			})
								// 			if (getQueryString('url')) {
								// 				window.location.href = getQueryString('url')
								// 			} else {
								// 				window.location.href = "./index.html"
								// 			}
								// 			that.$message.success(vm.sfLang.registerSuccess)
								// 		} else if (res.info == 6) { // 注册失败
								// 			that.$message.error(vm.sfLang.registerFaile)
								// 		} else if (res.info == 11) { // 响应失败
								// 			that.$message.error(vm.sfLang.networdFail)
								// 		} else if (res.info == 19) { // 邮箱已被注册
								// 			that.$message.error(vm.sfLang.emailTips)
								// 		}
								// 	})
								// }).catch(function() {})
							} else if (res.info == 8) { // 用户已锁定
								that.$message.warning(vm.sfLang.regCase8)
								return
							} else if (res.info == 1) { // 登录失败
								that.$message.error(vm.sfLang.regCase1)
								return
							} else if (res.info == 11) { // 响应失败
								that.$message.error(vm.sfLang.networdFail)
								return
							}
						})
						// console.log(JSON.stringify(response))
						// console.log('Good to see you, ' + response.name + '.');
					})
				} else {
					console.log('该用户没有登录')
					sessionStorage.removeItem('facebook')
				}
			}, {
				scope: 'public_profile,email'
			})
		},
		send: function() {
			var that = this
			if(vm.sfyzm >= 2) {
				if (emailVction() && pwdVction() && yzRandomNum()) {
					userLogin(vm.userMsg).then(function(res) {
						switch (Number(res.info)) {
							case 1:
								that.$message.error(vm.sfLang.regCase1)
								break
							case 2:
								var userInfo = {
									userId: res.data.f_Id,
									userName: res.data.f_UserName,
									userPhoto: res.data.f_PhotoUrl
								}
								var storage = new Storage()
								storage.setItem({
									name: 'userInfo',
									value: userInfo
								})
								if (getQueryString('url')) {
									window.location.href = getQueryString('url')
								} else {
									window.location.href = "./index.html"
								}
								that.$message.success(vm.sfLang.regCase2)
								break
							case 3:
								that.$message.warning(vm.sfLang.regCase3)
								break;
							case 4:
								vm.sfyzm +=1
								if(vm.sfyzm >= 2){
									document.querySelector('.sfblock').style.display = 'block'
								}
								that.$message.warning(vm.sfLang.regCase4)
								break;
							case 8:
								that.$message.warning(vm.sfLang.regCase8)
								break;
							case 11:
								that.$message.error(vm.sfLang.networdFail)
								break;
							default:
								that.$message.warning(vm.sfLang.regErr)
								break;
						}
					})
				} else {
					that.$message.error(vm.sfLang.regWanshan)
				}
			} else {
				if (emailVction() && pwdVction()) {
					userLogin(vm.userMsg).then(function(res) {
						switch (Number(res.info)) {
							case 1:
								that.$message.error(vm.regMsg.regCase1)
								break
							case 2:
								var userInfo = {
									userId: res.data.f_Id,
									userName: res.data.f_UserName,
									userPhoto: res.data.f_PhotoUrl
								}
								var storage = new Storage()
								storage.setItem({
									name: 'userInfo',
									value: userInfo
								})
								
								if (getQueryString('url')) {
									window.location.href = getQueryString('url')
								} else {
									window.location.href = "./index.html"
								}
								that.$message.success(vm.sfLang.regCase2)
								break
							case 3:
								that.$message.warning(vm.sfLang.regCase3)
								break;
							case 4:
								vm.sfyzm +=1
								if(vm.sfyzm >= 2){
									document.querySelector('.sfblock').style.display = 'block'
								}
								that.$message.warning(vm.sfLang.regCase4)
								break;
							case 8:
								that.$message.warning(vm.sfLang.regCase8)
								break;
							case 11:
								that.$message.error(vm.sfLang.networdFail)
								break;
							default:
								that.$message.warning(vm.sfLang.regErr)
								break;
						}
					})
				} else {
					that.$message.error(vm.sfLang.regWanshan)
				}
			}
		},
		// 第三方注册
		thirdRegister: function() {
			this.$prompt(vm.sfLang.emailText, vm.sfLang.tips, {
				confirmButtonText: vm.sfLang.sure,
				cancelButtonText: vm.sfLang.cancel,
				inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
				inputErrorMessage: vm.sfLang.emailError
			}).then(function(resp) {
				vm.thirdMsg.data.F_Email = resp.value
				thirdPartyRegister(vm.thirdMsg).then(function(res) {
					// 注册成功
					if (res.info == 5) {
						var userInfo = {
							userId: res.data.f_Id,
							userName: res.data.f_UserName,
							userPhoto: res.data.f_PhotoUrl
						}
						var storage = new Storage()
						storage.setItem({
							name: 'userInfo',
							value: userInfo
						})
						if (getQueryString('url')) {
							window.location.href = getQueryString('url')
						} else {
							window.location.href = "./index.html"
						}
						that.$message.success(vm.sfLang.registerSuccess)
					} else if (res.info == 6) { // 注册失败
						that.$message.error(vm.sfLang.registerFaile)
						that.thirdRegister()
					} else if (res.info == 11) { // 响应失败
						that.$message.error(vm.sfLang.networdFail)
						that.thirdRegister()
					} else if (res.info == 19) { // 邮箱已被注册
						that.$message.error(vm.sfLang.emailTips)
						that.thirdRegister()
					}
				})
			}).catch(function() {})
		}
	}
});

var nameBg = document.querySelector(".name-bg");
var pwdBg = document.querySelector(".pwd-bg");
var Name = document.querySelector(".name");
var Pwd = document.querySelector(".pwd");
var Yzm = document.querySelector(".yzNum");

function emailFocus() {
	nameBg.src = "images/login/name.png";
	Name.style.borderBottom = "1px solid #ff5230";
}

function emailVction() {
	var email = document.querySelector('.name').value;
	var emailText = document.querySelector('#emailText');
	var regWorld = ['select', 'insert', 'devare', 'from', 'count', 'drop', 'table', 'update', 'truncate', 'asc', 'mid',
		'char', 'xp_cmdshell', 'exec', 'master', 'net', 'ocalgroup', 'administrators', 'net', 'user', 'or', 'and'
	];
	var reg = /^[a-zA-Z0-9-_@.]{3,100}$/;
	var loweUser = email.toLowerCase();
	if (reg.test(email)) {
		for (var i = 0; i < regWorld.length; i++) {
			if (loweUser === regWorld[i]) {
				emailText.innerHTML = "<span>!</span>" + vm.sfLang.tipsLeg;
				nameBg.src = "images/login/name_bg.png";
				Name.style.borderBottom = "1px solid #e8e8e8";
				return;
			}
		}
		emailText.innerHTML = "";
		nameBg.src = "images/login/name.png";
		return true;
	} else {
		emailText.innerHTML = "<span>!</span>" + vm.sfLang.tipsUser;
		nameBg.src = "images/login/name_bg.png";
		Name.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}

}

function pwdFocus() {
	pwdBg.src = "images/login/pwd.png";
	Pwd.style.borderBottom = "1px solid #ff5230";
}

function pwdVction() {
	var pwd = document.querySelector('.pwd').value;
	var pwdText = document.querySelector('#pwdText');
	var reg = /^[a-zA-Z0-9-_@.]{6,20}$/;
	if (reg.test(pwd) && pwd != '' && pwd != null) {
		pwdText.innerHTML = '';
		return true;
	} else {
		pwdText.innerHTML = '<span>!</span>' + vm.sfLang.tipspwd;
		pwdBg.src = "images/login/pwd_bg.png";
		Pwd.style.borderBottom = "1px solid #e8e8e8";
		return false;
	}
}

function yzmFocus() {
	Yzm.style.borderBottom = "1px solid #ff5230";
}

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

