onload = function() {

	var langArr = JSON.parse(localStorage.getItem('langArr'))
	var headerNav = document.getElementById('header')
	if (headerNav) {
		var storage = new Storage()
		var vm1 = new Vue({
			el: '#header',
			components: {
				'header-nav': {
					template: "<nav class=\"header-nav\">\n\t\t\t\t<div class=\"header-nav-left\">\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li v-if=\"isLogin == false\">\n\t\t\t\t\t\t\t<a href=\"login.html\" v-text=\"sfLang.login\"></a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li v-if=\"isLogin == false\">\n\t\t\t\t\t\t\t<a href=\"register.html\" v-text=\"sfLang.register\"></a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li v-if=\"isLogin\">\n\t\t\t\t\t\t\t<a href=\"my.html\">{{userName}}</a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li v-if=\"isLogin\" @click=\"logout\">\n\t\t\t\t\t\t\t<a v-text=\"sfLang.logout\"></a>\n\t\t\t\t\t\t</li><li v-if='domainNameVisible' class='saveapp' @click='tosaveApp'><a>{{sfLang.sfxiazai}} APP</a><nav><div id='saveqrcode'></div><!--<p><img src='./images/index/GooglePay.png' alt=''/><img src='./images/index/AppStore.png' alt=''/></p>--><img src='./images/icon/LogoQrcode.png' alt=''/></nav><li/>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"header-nav-right\">\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li class='changelang'><a>{{ yuzhong }}<span class='el-icon-arrow-down'></span></a><nav><p v-text='sfyuzhong.taiwen' @click='taiwen'></p><p v-text='sfyuzhong.yingwen' @click='yingwen'></p><p v-text='sfyuzhong.zhongwen' @click='zhongwen'></p></nav></li><li class=\"changBg4\" @click='toservice'>\n\t\t\t\t\t\t\t<div></div>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t<a v-text=\"sfLang.service\"></a>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"changBg3\" @click='tocollect'>\n\t\t\t\t\t\t\t<div></div>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t<a v-text=\"sfLang.collect\"></a>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"changBg2\" @click='toshopping'>\n\t\t\t\t\t\t\t<i><div></div>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t<a v-if=\"isLogin == true\" v-text=\"sfLang.cart+' ('+sfcartNum+') '\"></a>\n\t\t\t\t\t\t\t\t<a v-if=\"isLogin == false\" v-text=\"sfLang.cart\"></a>\n\t\t\t\t\t\t\t</span></i><p class=\"cartHover\"><ul><p v-if='sftotal.length == 0' v-text='sfLang.sfnone'></p><p v-else v-text='sfLang.sfzuijin'></p><li v-for='(item,index) in sftotal' :key='index' v-if='index < 5'><img :src='item.attributeImg' @click.stop='toDetail(item.f_MarketingId)'><h1><span class=\"ellipsis\"  @click.stop='toDetail(item.f_MarketingId)'><b v-show='item.f_IsPublish == 0'>({{sfLang.sfweifabu}})</b>{{item.f_Title}}</span><span>{{ item.attribute.color+','+item.attribute.size }}</span></h1><h2><span class='ellipsis' v-text='currencySign + item.f_SalesPrice'></span><span v-text='sfLang.sfdel' @click.stop='sfdelcart(item)'></span></h2></li></ul><a href='./cart.html' v-text='sfLang.mycart'></a></p>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li class=\"changBg1\" @click='toorderList'>\n\t\t\t\t\t\t\t<div></div>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t<a v-text=\"sfLang.order\"></a>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<a href=\"index.html\" v-text=\"sfLang.home\"></a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</nav>",
					data: function() {
						return {
							isLogin: '',
							userName: '',
							currencySign: '',
							sfeditCartMsg: {
								token: requireToken(),
								loginMark: loginMark,
								data: {
									F_UserId: userId,
									F_ShopId: '',
									OperationType: '', // 0:表示删除 1:表示添加 2:表示编辑
									ShopCartDetail: []
								}
							},
							domainNameVisible: false,
							yuzhong: 'สถานีไทย',
							sfyuzhong:{
								zhongwen: '中国站',
								yingwen: 'American Station',
								taiwen: 'สถานีไทย',
							},
							sfLang: {
								login: '登录',
								register: '注册',
								logout: '退出',
								service: '客服',
								collect: '收藏',
								cart: '购物车',
								order: '我的精灵',
								home: '首页',
								logoutTxt: '是否退出当前用户',
								tips: '提示',
								sure: '确定',
								cancal: '取消',
								sfdel: '删除',
								sfzuijin : '最近加入的商品',
								shifou : '是否确认删除',
								sfnone: '购物车暂无商品，请把你喜欢的商品加入进来吧',
								delSuccess: '删除成功',
								delErr: '删除失败',
								sfweifabu: '已下架',
								sfxiazai: '下载',
								mycart: '查看我的购物车',
							},
							sfcartNum: 0,
							sfcartMsg: {
								token: requireToken(),
								loginMark: loginMark,
								data: {
									F_ShopId: '',
									F_UserId: userId,
									rows: 20,
									page: 1
								}
							},
							sftotal: [],
						}
					},
					beforeCreate: function() {
						var that = this
						//请求购物车接口
						if (userInfo) {
							getShopIdByLanguage(shopMsg).then(function(res) {
								that.sfcartMsg.data.F_ShopId = res.data.f_ShopId	// 购物车
								that.sfeditCartMsg.data.F_ShopId = res.data.f_ShopId 	// 购物车编辑
								that.currencySign = res.data.f_CurrencySign
								getShoppingCartDetail(that.sfcartMsg).then(function(res) {
									if (res.info == 10) {
										that.sftotal = res.data.rows
										that.sfcartNum = res.data.records
										sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
									} else {
										sessionStorage.setItem('sfcartNum', 0)
									}
								})
							})
						}
						Object.defineProperty(sessionStorage, 'sfcartNum', {
							set: function(newVal) {
								that.sfcartNum = newVal;
								if (userInfo) {
									getShopIdByLanguage(shopMsg).then(function(res) {
										that.sfcartMsg.data.F_ShopId = res.data.f_ShopId	// 购物车
										that.sfeditCartMsg.data.F_ShopId = res.data.f_ShopId 	// 购物车编辑
										that.currencySign = res.data.f_CurrencySign
										getShoppingCartDetail(that.sfcartMsg).then(function(res) {
											if (res.info == 10) {
												that.sftotal = res.data.rows
												that.sfcartNum = res.data.records
												sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
											} else {
												sessionStorage.setItem('sfcartNum', 0)
											}
										})
									})
								}
								console.log('set :', newVal);
							}
						})
					},
					created: function() {
						
						switch(domainName) {
							case 'www.burstingmall.com':
								this.domainNameVisible = false
								break;
							default:
								this.domainNameVisible = true
								break;
						}
						
						var storage = new Storage()
						var userInfo = storage.getItem('userInfo')
						if (userInfo) {
							this.isLogin = true
							this.userName = userInfo.userName
						} else {
							this.isLogin = false
						}

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
						
						if (sessionStorage.getItem('facebook')) {
							// 第三方登录 Facebook 初始化
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
						}
					},
					mounted: function(){
						var that = this
						that.yuzhong = that.sfLang.taiwen
						// 购物车弹出框
						var sfCarthover = document.querySelector(".changBg2")
						var cartHover = document.querySelector(".cartHover")
						sfCarthover.onmouseover = function(){
							var pathStr = window.location.pathname
							var pathIndex = pathStr.lastIndexOf("\/")
							pathStr = pathStr.substring(pathIndex + 1, pathStr.length)
							if(pathStr != 'cart.html'){
								cartHover.style.display = "block"
							}
						}
						sfCarthover.onmouseout = function(){
							cartHover.style.display = "none"
						}
						//下载弹出框
						if (that.domainNameVisible) {
							var sfsaveapp = document.querySelector('.saveapp')
							var saveapp = document.querySelector('.saveapp nav')
							sfsaveapp.onmouseover = function(){
								saveapp.style.display = "block"
							}
							sfsaveapp.onmouseout = function(){
								saveapp.style.display = "none"
							}
						}
						
						//语种弹出框
						switch(localStorage.getItem('language')) {
							case 'TH':
								// that.yuzhong = that.sfLang.taiwen
								that.yuzhong = 'สถานีไทย'
								break;
							case 'US':
								// that.yuzhong = that.sfLang.yingwen
								that.yuzhong = 'American Station'
								break;
							case 'CN':
								that.yuzhong = that.sfyuzhong.zhongwen
								break;
							default:
								that.yuzhong = 'สถานีไทย'
						}
						
						var sfchangelang = document.querySelector('.changelang')
						var changelang = document.querySelector('.changelang nav')
						var rotespan = document.querySelector('.changelang span')
						sfchangelang.onmouseover = function(){
							changelang.style.display = "block"
							rotespan.style.transform = "rotate(180deg)"
							rotespan.style.transition = "all 0.2s ease"
						}
						sfchangelang.onmouseout = function(){
							changelang.style.display = "none"
							rotespan.style.transform = "rotate(0deg)"
						}
						// 导航条二维码
						try {
							if (document.getElementById("saveqrcode")) {
								var qrcode = new QRCode(document.getElementById("saveqrcode"), {
								  width: 150,
								  height: 150,
								  colorDark : "#000", //二维码颜色
								  // colorLight : "#fdad49", //背景色
								  correctLevel : QRCode.CorrectLevel.Q //纠错等级
								});
								qrcode.makeCode(sessionStorage.getItem('sfqrcode'));
							}
						} catch(e){
							document.querySelector('#saveqrcode canvas').style.display = 'none'
							setTimeout(function(){
								if (document.getElementById("saveqrcode")) {
									var qrcode = new QRCode(document.getElementById("saveqrcode"), {
									  width: 150,
									  height: 150,
									  colorDark : "#000", //二维码颜色
									  // colorLight : "#fdad49", //背景色
									  correctLevel : QRCode.CorrectLevel.Q //纠错等级
									});
									qrcode.makeCode(sessionStorage.getItem('sfqrcode'));
								}
							},500)
						}
					},
					methods: {
						// 退出
						logout: function() {
							var that = this
							this.$confirm(this.sfLang.logoutTxt, this.sfLang.tips, {
								confirmButtonText: this.sfLang.sure,
								cancelButtonText: this.sfLang.cancal,
								type: 'warning'
							}).then(function() {
								// sessionStorage.removeItem('userInfo')
								localStorage.removeItem('userInfo')
								sessionStorage.removeItem('cart')
								sessionStorage.removeItem('sfcartNum')
								localStorage.removeItem('saleId_url')
								
								if (pathStr == '' || pathStr == 'index.html') {
									that.isLogin = false
								} else {
									window.location.href = './index.html'
								}
								
								// 退出第三方Facebook登录
								if (sessionStorage.getItem('facebook')) {
									FB.getLoginStatus(function(response) {
										if (response && response.status === 'connected') {
											FB.logout(function(response) {
											 	console.log("用户已退出");
												sessionStorage.removeItem('facebook')
												document.location.reload();
											})
										}
									})
								}
							}).catch(function() {})
						},
						//购物车删除
						sfdelcart: function(data) {
							var that = this
							this.sfeditCartMsg.data.OperationType = 0
							this.sfeditCartMsg.data.ShopCartDetail.push({
								F_ShopCartId: data.f_Id,
								F_Num: data.f_Num,
								F_GoodsAttributeId: data.f_GoodsAttributeId,
								F_MarketingId: data.f_MarketingId
							})
							this.$confirm(this.sfLang.shifou, this.sfLang.tips, {
								confirmButtonText: this.sfLang.sure,
								cancelButtonText: this.sfLang.cancel,
								type: 'warning'
							}).then(function() {
								editShoppingCart(that.sfeditCartMsg).then(function(res) {
									if (res.info == 10) {
										for (var i in that.sftotal) {
											if (data.f_Id == that.sftotal[i].f_Id) {
												that.sftotal.splice(i, 1)
											}
										}
										getShoppingCartDetail(that.sfcartMsg).then(function(res) {
											if (res.info == 10) {
												sessionStorage.sfcartNum = res.data.records //购物车气泡数量
												sessionStorage.setItem('sfcartNum', JSON.stringify(res.data.records))
											} else {
												sessionStorage.sfcartNum = 0 //购物车气泡数量
												sessionStorage.setItem('sfcartNum', 0)
											}
										})
										// if (that.sftotal.length == 0) {
										// 	that.sfLang.sfzuijin = that.sfLang.sfnone
										// }
										that.$message.success(that.sfLang.delSuccess)
									} else {
										that.$message.error(that.sfLang.delErr)
									}
								})
							}).catch(function() {});
						},
						//语种点击事件
						zhongwen: function() {
							var changelang = document.querySelector('.changelang nav')
							changelang.style.display = "none"
							localStorage.setItem('language', 'CN')
							localStorage.removeItem('langArr')
							window.location.reload()
							// this.yuzhong = this.sfLang.zhongwen
						},
						yingwen: function() {
							var changelang = document.querySelector('.changelang nav')
							changelang.style.display = "none"
							localStorage.setItem('language', 'US')
							localStorage.removeItem('langArr')
							window.location.reload()
							// this.yuzhong = 'American Station'
						},
						taiwen: function() {
							var changelang = document.querySelector('.changelang nav')
							changelang.style.display = "none"
							localStorage.setItem('language', 'TH')
							localStorage.removeItem('langArr')
							window.location.reload()
							// this.yuzhong = this.sfLang.taiwen
						},
						
						toservice: function() {
							window.location.href = './service.html'
						},
						tocollect: function() {
							window.location.href = './collect.html'
						},
						toshopping: function() {
							window.location.href = './cart.html'
						},
						toorderList: function() {
							window.location.href = './orderList.html'
						},
						toDetail: function(id) {
							window.location.href = './details.html?id=' + id
						},
						tosaveApp: function() {
							window.open('./saveapp.html')
						}
					}
				}
			}
		});
	}

	var link = document.querySelectorAll('.header-nav-right ul li a')
	for (var i = 0; i < link.length - 1; i++) {
		
		if (!localStorage.getItem('userInfo')) {
			if (!link[0]) {
				link[i].setAttribute('href', 'login.html')
			}
		}
	}
	var footer = document.getElementById('footer');
	var footerRecord = '备案号'
	//备案号翻译
	for (var j in langArr) {
		if (footerRecord == langArr[j].f_CNMenuName) {
			footerRecord = langArr[j].f_MenuName
		}
	}

	// if (footer) {
	// 	var footerP = document.createElement('p');
	// 	var footerText = document.createTextNode(footerRecord + ' : 46516156156516516');
	// 	footerP.appendChild(footerText);
	// 	footer.appendChild(footerP);
	// }

	var dibu = document.getElementById("dibu");
	if (dibu) {
		var dibuImg = document.createElement("img");
		dibuImg.src = "images/dibu-bg.png";
		dibu.appendChild(dibuImg);
	}

	var helpDiv = document.getElementById('help')
	if (helpDiv) {
		var vm2 = new Vue({
			el: '#help',
			components: {
				'help-nav': {
					template: "<div class=\"help-body\">\n\t\t\t\t\t<div class=\"help-top\">\n\t\t\t\t\t\t<dl class=\"help-part1\">\n\t\t\t\t\t\t\t<dt v-text=\"sfLang.help\"></dt><dd><a href=\"help.html?type=1\" target='_blank' v-text=\"sfLang.help1\"></a></dd><dd><a href=\"help.html?type=2\" target='_blank' v-text=\"sfLang.help2\"></a></dd>\n\t\t\t\t\t\t\t<dd><a href=\"help.html?type=3\" target='_blank' v-text=\"sfLang.help3\"></a></dd>\n\t\t\t\t\t\t\t<dd><a href=\"help.html?type=4\" target='_blank' v-text=\"sfLang.help4\"></a></dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t\t<dl class=\"help-part2\">\n\t\t\t\t\t\t\t<dt>{{sfLang.time1}}\uFF1A</dt>\n\t\t\t\t\t\t\t<dd v-text='sfLang.time3'></dd><dd>Facebook\uFF1Ahttps://www.facebook.com/ElvenShop</dd>\n\t\t\t\t\t\t\t<dd>Line\uFF1A@EleveShop</dd>\n\t\t\t\t\t\t\t<dd>{{sfLang.time2}}\uFF1A  9\uFF1A00-18\uFF1A00</dd>\n\t\t\t\t\t\t\t<dd>{{sfLang.time4}}\uFF1A  10\uFF1A00-17\uFF1A00</dd>\n\t\t\t\t\t\t\t<dd style=\"color: #ff5230;\">** {{sfLang.time5}}12\uFF1A00-13\uFF1A00 {{sfLang.time6}}**</dd>\n\t\t\t\t\t\t\t<dd style=\"color: #ff5230;\">**{{sfLang.time7}}**</dd>\n\t\t\t\t\t\t\t<dd>{{sfLang.time8}}\uFF1Aservice@elvenshop.com</dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t\t<dl class=\"help-part3\">\n\t\t\t\t\t\t\t<dt>{{sfLang.us1}}</dt>\n\t\t\t\t\t\t\t<dd><a href=\"help.html?type=6\" target='_blank'>{{sfLang.us2}}</a></dd>\n\t\t\t\t\t\t\t<dd><a href=\"help.html?type=7\" target='_blank'>{{sfLang.time1}}</a></dd>\n\t\t\t\t\t\t\t<dd><a href=\"help.html?type=8\" target='_blank'>{{sfLang.us3}}</a></dd>\n\t\t\t\t\t\t\t<dd><a href=\"help.html?type=10\" target='_blank'>{{sfLang.us4}}</a></dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t\t<dl class=\"help-part4\">\n\t\t\t\t\t\t\t<dt>{{sfLang.us5}}</dt>\n\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t<a href=\"#\">\n\t\t\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t\t\t<img src=\"images/index/icon.png\" alt=\"\">\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t<a href=\"#\">\n\t\t\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t\t\t<img src=\"images/index/icon.png\" alt=\"\">\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t<a href=\"#\">\n\t\t\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t\t\t<img src=\"images/index/icon.png\" alt=\"\">\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t\t<dl class=\"help-part5\">\n\t\t\t\t\t\t\t<dt>{{sfLang.us6}} APP</dt>\n\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t<nav><div id=\"qrcoder1\"></div><img src='./images/icon/LogoQrcode.png' alt=''/></nav>\n\t\t\t\t\t\t\t\t<div style='display: none;'>\n\t\t\t\t\t\t\t\t\t<img src=\"images/index/AppStore.png\" alt=\"\">\n\t\t\t\t\t\t\t\t\t<img src=\"images/index/GooglePay.png\" alt=\"\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"help-bottom\"></div>\n\t\t\t\t</div>",
					data: function() {
						return {
							sfLang: {
								help: '帮助中心',
								help1: '如何注册',
								help2: '付款方式',
								help3: '送货方式',
								help4: '退货退款',
								time1: '联系我们',
								time3: 'Thai FRAYUN Co.，Ltd. 办公室（总部）',
								time2: '周一至周五',
								time4: '星期六',
								time6: '休息时间',
								time7: '服务在周日和节假日关闭',
								time8: '电子邮件',
								us1: '了解我们',
								us2: '关于本店',
								us3: '隐私政策',
								us4: '条款条件',
								us5: '跟着我们',
								us6: '下载',
								// sf1: '支付方式',
								// sf2: '送货服务',
								// sf3: '经核实',
							}
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
					mounted: function(){
						// 底部
						try {
							if (document.getElementById("qrcoder1")) {
								var qrcoder1 = new QRCode(document.getElementById("qrcoder1"), {
								  width: 90,
								  height: 90,
								  colorDark : "#ff5230", //二维码颜色
								  // colorLight : "#fdad49", //背景色
								  correctLevel : QRCode.CorrectLevel.Q //纠错等级
								});
								qrcoder1.makeCode(sessionStorage.getItem('sfqrcode'));
							}
						} catch(e) {
							document.querySelector('#qrcoder1 canvas').style.display = 'none'
							setTimeout(function(){
								if (document.getElementById("qrcoder1")) {
									var qrcoder1 = new QRCode(document.getElementById("qrcoder1"), {
									  width: 90,
									  height: 90,
									  colorDark : "#ff5230", //二维码颜色
									  // colorLight : "#fdad49", //背景色
									  correctLevel : QRCode.CorrectLevel.Q //纠错等级
									});
									qrcoder1.makeCode(sessionStorage.getItem('sfqrcode'));
								}
							},500)
						}
						
						
						// 顶部
						try {
							if (document.getElementById("qrcode")) {
								var qrcode = new QRCode(document.getElementById("qrcode"), {
								  width: 75,
								  height: 75,
								  colorDark : "#ff5230", //二维码颜色
								  // colorLight : "#fdad49", //背景色
								  correctLevel : QRCode.CorrectLevel.Q //纠错等级
								});
								qrcode.makeCode(sessionStorage.getItem('sfqrcode'));
							}
						} catch(e) {
							document.querySelector('#qrcode canvas').style.display = 'none'
							setTimeout(function(){
								if (document.getElementById("qrcode")) {
									var qrcode = new QRCode(document.getElementById("qrcode"), {
									  width: 75,
									  height: 75,
									  colorDark : "#ff5230", //二维码颜色
									  // colorLight : "#fdad49", //背景色
									  correctLevel : QRCode.CorrectLevel.Q //纠错等级
									});
									qrcode.makeCode(sessionStorage.getItem('sfqrcode'));
								}
							},500)
						}
						
					},
				}
			},

		});
	}
}
