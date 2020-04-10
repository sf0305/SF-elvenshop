var commerce_url = 'https://api.frayun.com/commerce'
var order_url = 'https://api.frayun.com/order'
var im_url = 'https://services.elvenshop.com:8012'
// 客服请求接口
var hubs = im_url + '/signalr/hubs'
var signalr = im_url + '/signalr'
// 图片显示
var imageUrl = 'https://pic.frayun.com/'
var loginMark = 'commerce'

var domainName = window.location.host
var storeName = ''
switch(domainName) {
	case 'www.burstingmall.com':
	storeName = 'burstingmall'
	break;
	case 'www.elvenshop.com':
	storeName = 'ElvenShop'
	break;
	default: 
	storeName = 'ElvenShop'
	break;
}

var language = localStorage.getItem('language')
// 翻译接口 统一在这里修改语言
var langMsg = {
	token: '',
	loginMark: loginMark,
	data: {
		F_Language: language
	}
}
// 请求店铺的接口 统一在这里修改语言
var shopMsg = {
	token: '',
	loginMark: loginMark,
	data: {
		Language: language,
		ShopName: storeName
	}
}
// 请求功能菜单接口 统一在这里修改语言
var categoryMsg = {
	token: '',
	loginMark: loginMark,
	data: {
		F_Language: language,
		ShopId: ''
	}
}
if (!language) {
	// 默认 泰语
	localStorage.setItem('language', 'TH')
	langMsg.data.F_Language = shopMsg.data.Language = categoryMsg.data.F_Language = 'TH'
}


switch(language) {
	case 'US':
	categoryMsg.data.F_Language = 'EN'
	langMsg.data.F_Language = 'EN'
	break;
}

var syncPicture = function(params) { return post(commerce_url + '/CommerceApi/SyncPicture', params) }			// 图片上传

// 首页展示
var getHomePageDisplays = function(params) { return post(commerce_url + '/CommerceApi/GetHomePageDisplays', params) } 		// 获取电商首页展示轮播图和功能图接口
var getHomePageDisplayDetail = function(params) { return post(commerce_url + '/CommerceApi/GetHomePageDisplayDetail', params) }			// 获取电商首页展示轮播图和功能区明细接口

// 商品管理
var getCategoryInfo = function(params) { return post(commerce_url + '/CommerceApi/GetCategoryInfo', params) }		 // 产品分类（多语言）信息表
var getFirstCategoryGoodsDetail = function(params) { return post(commerce_url + '/CommerceApi/GetFirstCategoryGoodsDetail', params) } 		// 一级分类对应商品明细表
var getSecondCategoryGoodsDetail = function(params) { return post(commerce_url + '/CommerceApi/GetSecondCategoryGoodsDetail', params)}		 // 二级分类对应商品明细数据
var getMarketingDetail = function(params) { return post(commerce_url + '/CommerceApi/GetMarketingDetail', params) }		 // 商品详情展示
var getUserCommentDetail = function(params) { return post(commerce_url + '/CommerceApi/GetUserCommentDetail', params) } 		// 获取商品评论列表
var editShoppingCart = function(params) { return post(commerce_url + '/CommerceApi/EditShoppingCart', params) } 		// 编辑购物车
var getShoppingCartDetail = function(params) { return post(commerce_url + '/CommerceApi/GetShoppingCartDetail', params)} 		// 购物车明细

// 用户交互
var getShopIdByLanguage = function(params) { return post(commerce_url + '/CommerceApi/GetShopIdByLanguage', params)} 		// 根据语种获取店铺Id
var getMenuLanguages = function(params) { return post(commerce_url + '/CommerceApi/GetMenuLanguages', params)} 		// 翻译语言
var getGoodsFocusInfos = function(params) { return post(commerce_url + '/CommerceApi/GetGoodsFocusInfos', params)} 		// 关注商品获取列表
var operationGoodsFocusInfos = function(params) { return post(commerce_url + '/CommerceApi/OperationGoodsFocusInfos', params) } 		// 关注商品编辑/添加
var userLogin = function(params) { return post(commerce_url + '/CommerceApi/UserLogin', params) } 		// 用户登录
var createUsers = function(params) { return post(commerce_url + '/CommerceApi/CreateUsers', params) } // 注册
var getUserInfoByEmail = function(params) { return post(commerce_url + '/CommerceApi/GetUserInfoByEmail', params) } 		// 根据邮件地址获取用户信息
var loginComparisonCode = function(params) { return post(commerce_url + '/CommerceApi/LoginComparisonCode', params) } // 找回密码验证码比对
var userEdit = function(params) {return post(commerce_url + '/CommerceApi/UserEdit', params)} // 修改用户信息
var operationUsersAdressDetail = function(params) { return post(commerce_url + '/CommerceApi/OperationUsersAdressDetail', params) } 		// 地址增删改
var getUsersAdressDetail = function(params) { return post(commerce_url + '/CommerceApi/GetUsersAdressDetail', params) } 		// 获取用户地址明细
var thirdPartyLogin = function(params) { return post(commerce_url + '/CommerceApi/ThirdPartyLogin', params) } 		// 第三方登录
var thirdPartyRegister = function(params) { return post(commerce_url + '/CommerceApi/ThirdPartyRegister', params) } 		// 第三方注册
var getUserInfo = function(params) { return post(commerce_url + '/CommerceApi/GetUserInfo', params) }			// 获取用户信息接口
var setMarketingClickNum = function(params) { return post(commerce_url + '/CommerceApi/SetMarketingClickNum', params) }			// 点击量叠加

// 用户搜索
var getGoodsSearch = function(params) { return post(commerce_url + '/CommerceApi/GetGoodsSearch', params) } 		// 产品搜索接口
var getUserSearchHistory = function(params) { return post(commerce_url + '/CommerceApi/GetUserSearchHistory', params) } 		// 获取电商用户搜索数据列表

// 订单管理
var createOrder = function(params) { return post(commerce_url + '/CommerceApi/CreateOrder', params) } 		// 生成订单
var editOrderAdress = function(params) { return post(order_url + '/CommerceApi/EditOrderAdress', params) } 		// 编辑订单地址
var getOrderTrackingInfo = function(params) { return post(order_url + '/CommerceApi/GetOrderTrackingInfo', params) } 		// 获取订单物流跟踪信息
var getOrders = function(params) { return post(order_url + '/CommerceApi/GetOrders', params) } 		// 获取订单列表
var getOrderAmount = function(params) { return post(commerce_url + '/CommerceApi/GetOrderAmount', params) } 		// 订单金额计算
var addUserComment = function(params) { return post(commerce_url + '/CommerceApi/AddUserComment', params) } 		// 商品评价添加
var setOrderService = function(params) { return post(order_url + '/CommerceApi/SetOrderService', params) } 		// 订单售后申请
var cancalOrder = function(params) { return post(order_url + '/CommerceApi/CancalOrder', params) } 		// (未付款)取消订单
var changePaymentOrder = function(params) { return post(order_url + '/CommerceApi/ChangePaymentOrder', params) } 		// 订单改为已付款
var getAppUpdateInfo = function(params) { return post(commerce_url + '/CommerceApi/GetAppUpdateInfo', params) } 		// APP版本更新接口(二维码)

// 即时通讯
var chatCreate = function(params) { return post(commerce_url + '/CommerceApi/CreateMessageDialogue', params) } // 生成会话
var chatHistory = function(params) { return post(commerce_url + '/CommerceApi/GetDialogueDetailByCustomer', params) } // 聊天记录
var chatSend = function(params) { return post(commerce_url + '/CommerceApi/SendMessageService', params) } 		// 发送消息

// 封装post请求
function post(url, params) {
	return new Promise(function(resolve, reject) {
		axios.post(url, params).then(function(res) {
			resolve(res.data)
		}).catch(function(error) {
			reject(error.data)
		})
	})
}
function axiosPost(url, params) {
	var result = axios({
		method: 'post',
		url: url,
		data: params,
		transformRequest: [function(params) {
			var ret = ''
			for (var i in params) {
				ret += encodeURIComponent(i)+'='+encodeURIComponent(params[i])+"&"
			}
			return ret
		}],
		header: {
			'Content-Type':'application/x-www-form-urlencoded'
		}
	}).then(function(resp) {
		return resp.data
	}).catch(function(error) {
		return "exception="+error
	})
	return result
}

// 判断本地存储是否有 langArr
function getLanguage(sfLang) {
	langMsg.token = requireToken()
	getMenuLanguages(langMsg).then(function(res) {
		localStorage.setItem('langArr', JSON.stringify(res.data))
		for (var i in sfLang) {
			for (var j in res.data) {
				if (sfLang[i] == res.data[j].f_CNMenuName) {
					sfLang[i] = res.data[j].f_MenuName
				}
			}
		}
	})
}

// ie浏览器兼容 处理属性规格
if (!Object.values) Object.values = function(obj) {
	if (obj !== Object(obj))
		throw new TypeError('Object.values called on a non-object');
	var val=[],key;
	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj,key)) {
			val.push(obj[key]);
		}
	}
	return val;
}

var b = document.documentElement;
b.setAttribute('data-useragent', navigator.userAgent);
b.setAttribute('data-platform', navigator.platform);
// IE 10 == Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0).

// 判断IE浏览器的具体版本
// function IEVersion() {
//  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
//  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
//  var isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);			 //判断是否Safari浏览器
//  var sf = '您当前浏览器暂不支持，请使用其它浏览器或升级';
 
//  // var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
//  // var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1; //判断是否IE11浏览器  
// 	if (isIE) {
// 		// console.log('小于IE11的浏览器')
// 		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
// 		reIE.test(userAgent);
// 		var fIEVersion = parseFloat(RegExp["$1"]);
		
// 		// if (fIEVersion != 10) {
// 			var sfback = document.querySelector('.backTop')
// 			var sfbg = document.createElement('h1')
// 			var sfwrap = document.createElement('h2')
// 			var sfp = document.createElement('p')
// 			var sfptext = document.createTextNode(sf);
// 			// var sfclose = document.createElement('div')
// 			// sfclose.innerHTML = "<img src='./images/sfclose.png' />"
// 			sfback.appendChild(sfbg)
// 			sfback.appendChild(sfwrap)
// 			sfwrap.appendChild(sfp)
// 			// sfwrap.appendChild(sfclose)
// 			sfp.appendChild(sfptext)
// 			// sfclose.onclick = (function(){
// 			//  sfbg.style.display = 'none'
// 			//  sfwrap.style.display = 'none'
// 			// })
// 		// }
// 	} else if (isSafari) {
// 			var sfback = document.querySelector('.backTop')
// 			var sfbg = document.createElement('h1')
// 			var sfwrap = document.createElement('h2')
// 			var sfp = document.createElement('p')
// 			var sfptext = document.createTextNode(sf);
// 			// var sfclose = document.createElement('div')
// 			// sfclose.innerHTML = "<img src='./images/sfclose.png' />"
// 			sfback.appendChild(sfbg)
// 			sfback.appendChild(sfwrap)
// 			sfwrap.appendChild(sfp)
// 			// sfwrap.appendChild(sfclose)
// 			sfp.appendChild(sfptext)
// 			// sfclose.onclick = (function(){
// 			// sfbg.style.display = 'none'
// 			// 	sfwrap.style.display = 'none'
// 			// })
// 		}
// }
// IEVersion();

// 去除字符串左右两端的空格
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
}

// toFixed兼容方法
Number.prototype.toFixed = function(n) {
	if (n > 20 || n < 0) {
		throw new RangeError('toFixed() digits argument must be between 0 and 20');
	}
	var number = this;
	if (isNaN(number) || number >= Math.pow(10, 21)) {
		return number.toString();
	}
	if (typeof(n) == 'undefined' || n == 0) {
		return (Math.round(number)).toString();
	}

	var result = number.toString();
	var arr = result.split('.');

	// 整数的情况
	if (arr.length < 2) {
		result += '.';
		for (var i = 0; i < n; i += 1) {
			result += '0';
		}
		return result;
	}

	var integer = arr[0];
	var decimal = arr[1];
	if (decimal.length == n) {
		return result;
	}
	if (decimal.length < n) {
		for (var i = 0; i < n - decimal.length; i += 1) {
			result += '0';
		}
		return result;
	}
	result = integer + '.' + decimal.substr(0, n);
	var last = decimal.substr(n, 1);

	// 四舍五入，转换为整数再处理，避免浮点数精度的损失
	if (parseInt(last, 10) >= 5) {
		var x = Math.pow(10, n);
		result = (Math.round((parseFloat(result) * x)) + 1) / x;
		result = result.toFixed(n);
	}

	return result;
}
// frayun 计算公式
function frayunMoney(mon) {
	var r = round(mon, 2)
	if (r >= mon) {
		r = round(mon, 2)
	} else {
		r = (r * 100 +1) / 100
	}
	return r
	
	function round(number, precision) {
		return Math.round(+number + 'e' + precision) / Math.pow(10, precision)
	}
}

// 时间格式化
function format(date, fmt) {
	var o = {
		"M+": date.getMonth() + 1, // 月份
		"d+": date.getDate(), // 日
		"H+": date.getHours(), // 时
		"m+": date.getMinutes(), // 分
		"s+": date.getSeconds(), // 秒
		"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
		"S": date.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
			.substr(("" + o[k]).length)));
	return fmt;
}

// 获取链接参数
function getRequest() {
	var url = location.search
	var theRequest = new Object()
	if (url.indexOf('?') != -1) {
		var str = url.substr(1)
		strs = str.split("&")
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
		}
	}
	return theRequest
}
// 获取url参数
var getQueryString = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

// 随机生成32位随机数
function getNum() {
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var nums = ''
	for (var i = 0; i < 32; i++) {
		var id = parseInt(Math.random()*61)
		nums += chars[id]
	}
	return nums
}

// 数组去重
function unique(arr) {
	var newArr = [arr[0]];
	for (var i = 1; i < arr.length; i++) {
		var repeat = false;
		for (var j = 0; j < newArr.length; j++) {
			if (arr[i] === newArr[j]) {
				repeat = true;
				break;
			}
		}
		if (!repeat) {
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

//返回顶部获取浏览器高度
var that = this
that.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
that.screenHight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
var backTop = document.querySelector('.backTop')
if (backTop) {
	backTop.style.height = that.screenHight + 'px'
}

// localstorage 设置过期时间 兼容IE
function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Storage = function () {
  function Storage(name) {
    _classCallCheck(this, Storage);

    this.name = 'storage';
  } // 设置缓存

  _createClass(Storage, [{
    key: "setItem",
    value: function setItem(params) {
      var obj = {
        name: '',
        value: '',
        expires: 7200000,			//过期时间 2个小时
        startTime: new Date().getTime() // 记录何时将值存入缓存，毫秒级
      };
      var options = {}; // 将obj和传进来的params合并

      Object.assign(options, obj, params);

      if (options.expires) {
        // 如果options.expires设置了的话 以options.name为key，options为值放进去
        localStorage.setItem(options.name, JSON.stringify(options));
      } else {
        // 如果options.expires没有设置，就判断一下value的类型
        var type = Object.prototype.toString.call(options.value); // 如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去

        if (Object.prototype.toString.call(options.value) == '[object Object]') {
          options.value = JSON.stringify(options.value);
        }

        if (Object.prototype.toString.call(options.value) == '[object Array]') {
          options.value = JSON.stringify(options.value);
        }

        localStorage.setItem(options.name, options.value);
      }
    } 
  }, {			// 获取缓存
    key: "getItem",
    value: function getItem(name) {
      var item = localStorage.getItem(name);
      try {
        // 先将拿到的试着进行json转为对象的形式
        item = JSON.parse(item);
      } catch (error) {
        // 如果不行就不是json的字符串，就直接返回
        item = item;
      } // 如果有startTime的值，说明设置了失效时间
      if (!item) return;
      if (item.startTime) {
        var date = new Date().getTime(); // 何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
        if (date - item.startTime > item.expires) {
          // 缓存过期，清除缓存，返回false
          localStorage.removeItem(name);
          return false;
        } else {
          //缓存未过期，返回值
          return item.value;
        }
      } else {
        // 如果没有设置失效时间，直接返回值
        return item;
      }
    }
  }, {			// 删除缓存
    key: "removeItem",
    value: function removeItem(name) {
      localStorage.removeItem(name);
    } 
  }, {			// 清空缓存
    key: "clear",
    value: function clear() {
      localStorage.clear();
    }
  }]);

  return Storage;
}();

// 获取用户信息
var storage = new Storage();
var userInfo = storage.getItem('userInfo')
var userId = userInfo == undefined ? '' : userInfo.userId
var userName = userInfo == undefined ? '' : userInfo.userName
var userPhoto = userInfo == undefined ? '' : userInfo.userPhoto

// 获取当前域名
// console.log(window.location.protocol + '//' + window.location.host)
var pathStr = window.location.pathname
var pathIndex = pathStr.lastIndexOf("\/")
pathStr = pathStr.substring(pathIndex + 1, pathStr.length)

if (pathStr == '' || pathStr == 'index.html' || pathStr == 'details.html' || pathStr == 'list.html' || pathStr ==
	'login.html' || pathStr == 'register.html' || pathStr == 'retrieve.html' || pathStr == 'password.html' || pathStr ==
	'help.html' || pathStr == 'saveapp.html' ) {

} else {
	if (!userInfo) {
		window.location.href = './login.html'
	}
}

// 在商品详情页面 如果不是当前页面的话 会删除本地存储的推荐id
if (pathStr != 'details.html') {
	localStorage.removeItem('recmArr')
}

// aes加密js源文件
!function(t,n){"object"==typeof exports?module.exports=exports=n():"function"==typeof define&&define.amd?define([],n):t.CryptoJS=n()}(this,function(){var t=t||function(t,n){var i=Object.create||function(){function t(){}return function(n){var i;return t.prototype=n,i=new t,t.prototype=null,i}}(),e={},r=e.lib={},o=r.Base=function(){return{extend:function(t){var n=i(this);return t&&n.mixIn(t),n.hasOwnProperty("init")&&this.init!==n.init||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=r.WordArray=o.extend({init:function(t,i){t=this.words=t||[],i!=n?this.sigBytes=i:this.sigBytes=4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var n=this.words,i=t.words,e=this.sigBytes,r=t.sigBytes;if(this.clamp(),e%4)for(var o=0;o<r;o++){var s=i[o>>>2]>>>24-o%4*8&255;n[e+o>>>2]|=s<<24-(e+o)%4*8}else for(var o=0;o<r;o+=4)n[e+o>>>2]=i[o>>>2];return this.sigBytes+=r,this},clamp:function(){var n=this.words,i=this.sigBytes;n[i>>>2]&=4294967295<<32-i%4*8,n.length=t.ceil(i/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(n){for(var i,e=[],r=function(n){var n=n,i=987654321,e=4294967295;return function(){i=36969*(65535&i)+(i>>16)&e,n=18e3*(65535&n)+(n>>16)&e;var r=(i<<16)+n&e;return r/=4294967296,r+=.5,r*(t.random()>.5?1:-1)}},o=0;o<n;o+=4){var a=r(4294967296*(i||t.random()));i=987654071*a(),e.push(4294967296*a()|0)}return new s.init(e,n)}}),a=e.enc={},c=a.Hex={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push((o>>>4).toString(16)),e.push((15&o).toString(16))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e+=2)i[e>>>3]|=parseInt(t.substr(e,2),16)<<24-e%8*4;return new s.init(i,n/2)}},u=a.Latin1={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push(String.fromCharCode(o))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e++)i[e>>>2]|=(255&t.charCodeAt(e))<<24-e%4*8;return new s.init(i,n)}},f=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},h=r.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(n){var i=this._data,e=i.words,r=i.sigBytes,o=this.blockSize,a=4*o,c=r/a;c=n?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var u=c*o,f=t.min(4*u,r);if(u){for(var h=0;h<u;h+=o)this._doProcessBlock(e,h);var p=e.splice(0,u);i.sigBytes-=f}return new s.init(p,f)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(r.Hasher=h.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){h.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var n=this._doFinalize();return n},blockSize:16,_createHelper:function(t){return function(n,i){return new t.init(i).finalize(n)}},_createHmacHelper:function(t){return function(n,i){return new p.HMAC.init(t,i).finalize(n)}}}),e.algo={});return e}(Math);return t});
//# sourceMappingURL=core.min.js.map
!function(e,t,i){"object"==typeof exports?module.exports=exports=t(require("./core.min"),require("./sha1.min"),require("./hmac.min")):"function"==typeof define&&define.amd?define(["./core.min","./sha1.min","./hmac.min"],t):t(e.CryptoJS)}(this,function(e){return function(){var t=e,i=t.lib,r=i.Base,n=i.WordArray,o=t.algo,a=o.MD5,c=o.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:a,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var i=this.cfg,r=i.hasher.create(),o=n.create(),a=o.words,c=i.keySize,f=i.iterations;a.length<c;){s&&r.update(s);var s=r.update(e).finalize(t);r.reset();for(var u=1;u<f;u++)s=r.finalize(s),r.reset();o.concat(s)}return o.sigBytes=4*c,o}});t.EvpKDF=function(e,t,i){return c.create(i).compute(e,t)}}(),e.EvpKDF});
//# sourceMappingURL=evpkdf.min.js.map
!function(r,e){"object"==typeof exports?module.exports=exports=e(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],e):e(r.CryptoJS)}(this,function(r){return function(){function e(r,e,t){for(var n=[],i=0,o=0;o<e;o++)if(o%4){var f=t[r.charCodeAt(o-1)]<<o%4*2,c=t[r.charCodeAt(o)]>>>6-o%4*2;n[i>>>2]|=(f|c)<<24-i%4*8,i++}return a.create(n,i)}var t=r,n=t.lib,a=n.WordArray,i=t.enc;i.Base64={stringify:function(r){var e=r.words,t=r.sigBytes,n=this._map;r.clamp();for(var a=[],i=0;i<t;i+=3)for(var o=e[i>>>2]>>>24-i%4*8&255,f=e[i+1>>>2]>>>24-(i+1)%4*8&255,c=e[i+2>>>2]>>>24-(i+2)%4*8&255,s=o<<16|f<<8|c,h=0;h<4&&i+.75*h<t;h++)a.push(n.charAt(s>>>6*(3-h)&63));var p=n.charAt(64);if(p)for(;a.length%4;)a.push(p);return a.join("")},parse:function(r){var t=r.length,n=this._map,a=this._reverseMap;if(!a){a=this._reverseMap=[];for(var i=0;i<n.length;i++)a[n.charCodeAt(i)]=i}var o=n.charAt(64);if(o){var f=r.indexOf(o);f!==-1&&(t=f)}return e(r,t,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),r.enc.Base64});
//# sourceMappingURL=enc-base64.min.js.map
!function(e,t,r){"object"==typeof exports?module.exports=exports=t(require("./core.min"),require("./evpkdf.min")):"function"==typeof define&&define.amd?define(["./core.min","./evpkdf.min"],t):t(e.CryptoJS)}(this,function(e){e.lib.Cipher||function(t){var r=e,i=r.lib,n=i.Base,c=i.WordArray,o=i.BufferedBlockAlgorithm,s=r.enc,a=(s.Utf8,s.Base64),f=r.algo,p=f.EvpKDF,d=i.Cipher=o.extend({cfg:n.extend(),createEncryptor:function(e,t){return this.create(this._ENC_XFORM_MODE,e,t)},createDecryptor:function(e,t){return this.create(this._DEC_XFORM_MODE,e,t)},init:function(e,t,r){this.cfg=this.cfg.extend(r),this._xformMode=e,this._key=t,this.reset()},reset:function(){o.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){e&&this._append(e);var t=this._doFinalize();return t},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(e){return"string"==typeof e?B:x}return function(t){return{encrypt:function(r,i,n){return e(i).encrypt(t,r,i,n)},decrypt:function(r,i,n){return e(i).decrypt(t,r,i,n)}}}}()}),h=(i.StreamCipher=d.extend({_doFinalize:function(){var e=this._process(!0);return e},blockSize:1}),r.mode={}),u=i.BlockCipherMode=n.extend({createEncryptor:function(e,t){return this.Encryptor.create(e,t)},createDecryptor:function(e,t){return this.Decryptor.create(e,t)},init:function(e,t){this._cipher=e,this._iv=t}}),l=h.CBC=function(){function e(e,r,i){var n=this._iv;if(n){var c=n;this._iv=t}else var c=this._prevBlock;for(var o=0;o<i;o++)e[r+o]^=c[o]}var r=u.extend();return r.Encryptor=r.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize;e.call(this,t,r,n),i.encryptBlock(t,r),this._prevBlock=t.slice(r,r+n)}}),r.Decryptor=r.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize,c=t.slice(r,r+n);i.decryptBlock(t,r),e.call(this,t,r,n),this._prevBlock=c}}),r}(),_=r.pad={},v=_.Pkcs7={pad:function(e,t){for(var r=4*t,i=r-e.sigBytes%r,n=i<<24|i<<16|i<<8|i,o=[],s=0;s<i;s+=4)o.push(n);var a=c.create(o,i);e.concat(a)},unpad:function(e){var t=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=t}},y=(i.BlockCipher=d.extend({cfg:d.cfg.extend({mode:l,padding:v}),reset:function(){d.reset.call(this);var e=this.cfg,t=e.iv,r=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=r.createEncryptor;else{var i=r.createDecryptor;this._minBufferSize=1}this._mode&&this._mode.__creator==i?this._mode.init(this,t&&t.words):(this._mode=i.call(r,this,t&&t.words),this._mode.__creator=i)},_doProcessBlock:function(e,t){this._mode.processBlock(e,t)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var t=this._process(!0)}else{var t=this._process(!0);e.unpad(t)}return t},blockSize:4}),i.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}})),m=r.format={},k=m.OpenSSL={stringify:function(e){var t=e.ciphertext,r=e.salt;if(r)var i=c.create([1398893684,1701076831]).concat(r).concat(t);else var i=t;return i.toString(a)},parse:function(e){var t=a.parse(e),r=t.words;if(1398893684==r[0]&&1701076831==r[1]){var i=c.create(r.slice(2,4));r.splice(0,4),t.sigBytes-=16}return y.create({ciphertext:t,salt:i})}},x=i.SerializableCipher=n.extend({cfg:n.extend({format:k}),encrypt:function(e,t,r,i){i=this.cfg.extend(i);var n=e.createEncryptor(r,i),c=n.finalize(t),o=n.cfg;return y.create({ciphertext:c,key:r,iv:o.iv,algorithm:e,mode:o.mode,padding:o.padding,blockSize:e.blockSize,formatter:i.format})},decrypt:function(e,t,r,i){i=this.cfg.extend(i),t=this._parse(t,i.format);var n=e.createDecryptor(r,i).finalize(t.ciphertext);return n},_parse:function(e,t){return"string"==typeof e?t.parse(e,this):e}}),g=r.kdf={},S=g.OpenSSL={execute:function(e,t,r,i){i||(i=c.random(8));var n=p.create({keySize:t+r}).compute(e,i),o=c.create(n.words.slice(t),4*r);return n.sigBytes=4*t,y.create({key:n,iv:o,salt:i})}},B=i.PasswordBasedCipher=x.extend({cfg:x.cfg.extend({kdf:S}),encrypt:function(e,t,r,i){i=this.cfg.extend(i);var n=i.kdf.execute(r,e.keySize,e.ivSize);i.iv=n.iv;var c=x.encrypt.call(this,e,t,n.key,i);return c.mixIn(n),c},decrypt:function(e,t,r,i){i=this.cfg.extend(i),t=this._parse(t,i.format);var n=i.kdf.execute(r,e.keySize,e.ivSize,t.salt);i.iv=n.iv;var c=x.decrypt.call(this,e,t,n.key,i);return c}})}()});
//# sourceMappingURL=cipher-core.min.js.map
!function(e,i){"object"==typeof exports?module.exports=exports=i(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],i):i(e.CryptoJS)}(this,function(e){!function(){var i=e,t=i.lib,n=t.Base,s=i.enc,r=s.Utf8,o=i.algo;o.HMAC=n.extend({init:function(e,i){e=this._hasher=new e.init,"string"==typeof i&&(i=r.parse(i));var t=e.blockSize,n=4*t;i.sigBytes>n&&(i=e.finalize(i)),i.clamp();for(var s=this._oKey=i.clone(),o=this._iKey=i.clone(),a=s.words,f=o.words,c=0;c<t;c++)a[c]^=1549556828,f[c]^=909522486;s.sigBytes=o.sigBytes=n,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var i=this._hasher,t=i.finalize(e);i.reset();var n=i.finalize(this._oKey.clone().concat(t));return n}})}()});
//# sourceMappingURL=hmac.min.js.map
!function(e,o,r){"object"==typeof exports?module.exports=exports=o(require("./core.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./cipher-core.min"],o):o(e.CryptoJS)}(this,function(e){return e.mode.ECB=function(){var o=e.lib.BlockCipherMode.extend();return o.Encryptor=o.extend({processBlock:function(e,o){this._cipher.encryptBlock(e,o)}}),o.Decryptor=o.extend({processBlock:function(e,o){this._cipher.decryptBlock(e,o)}}),o}(),e.mode.ECB});
//# sourceMappingURL=mode-ecb.min.js.map
!function(e,r,i){"object"==typeof exports?module.exports=exports=r(require("./core.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./cipher-core.min"],r):r(e.CryptoJS)}(this,function(e){return e.pad.Pkcs7});
//# sourceMappingURL=pad-pkcs7.min.js.map
!function(e,r,i){"object"==typeof exports?module.exports=exports=r(require("./core.min"),require("./enc-base64.min"),require("./md5.min"),require("./evpkdf.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./enc-base64.min","./md5.min","./evpkdf.min","./cipher-core.min"],r):r(e.CryptoJS)}(this,function(e){return function(){var r=e,i=r.lib,n=i.BlockCipher,o=r.algo,t=[],c=[],s=[],f=[],a=[],d=[],u=[],v=[],h=[],y=[];!function(){for(var e=[],r=0;r<256;r++)r<128?e[r]=r<<1:e[r]=r<<1^283;for(var i=0,n=0,r=0;r<256;r++){var o=n^n<<1^n<<2^n<<3^n<<4;o=o>>>8^255&o^99,t[i]=o,c[o]=i;var p=e[i],l=e[p],_=e[l],k=257*e[o]^16843008*o;s[i]=k<<24|k>>>8,f[i]=k<<16|k>>>16,a[i]=k<<8|k>>>24,d[i]=k;var k=16843009*_^65537*l^257*p^16843008*i;u[o]=k<<24|k>>>8,v[o]=k<<16|k>>>16,h[o]=k<<8|k>>>24,y[o]=k,i?(i=p^e[e[e[_^p]]],n^=e[e[n]]):i=n=1}}();var p=[0,1,2,4,8,16,32,64,128,27,54],l=o.AES=n.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var e=this._keyPriorReset=this._key,r=e.words,i=e.sigBytes/4,n=this._nRounds=i+6,o=4*(n+1),c=this._keySchedule=[],s=0;s<o;s++)if(s<i)c[s]=r[s];else{var f=c[s-1];s%i?i>6&&s%i==4&&(f=t[f>>>24]<<24|t[f>>>16&255]<<16|t[f>>>8&255]<<8|t[255&f]):(f=f<<8|f>>>24,f=t[f>>>24]<<24|t[f>>>16&255]<<16|t[f>>>8&255]<<8|t[255&f],f^=p[s/i|0]<<24),c[s]=c[s-i]^f}for(var a=this._invKeySchedule=[],d=0;d<o;d++){var s=o-d;if(d%4)var f=c[s];else var f=c[s-4];d<4||s<=4?a[d]=f:a[d]=u[t[f>>>24]]^v[t[f>>>16&255]]^h[t[f>>>8&255]]^y[t[255&f]]}}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,s,f,a,d,t)},decryptBlock:function(e,r){var i=e[r+1];e[r+1]=e[r+3],e[r+3]=i,this._doCryptBlock(e,r,this._invKeySchedule,u,v,h,y,c);var i=e[r+1];e[r+1]=e[r+3],e[r+3]=i},_doCryptBlock:function(e,r,i,n,o,t,c,s){for(var f=this._nRounds,a=e[r]^i[0],d=e[r+1]^i[1],u=e[r+2]^i[2],v=e[r+3]^i[3],h=4,y=1;y<f;y++){var p=n[a>>>24]^o[d>>>16&255]^t[u>>>8&255]^c[255&v]^i[h++],l=n[d>>>24]^o[u>>>16&255]^t[v>>>8&255]^c[255&a]^i[h++],_=n[u>>>24]^o[v>>>16&255]^t[a>>>8&255]^c[255&d]^i[h++],k=n[v>>>24]^o[a>>>16&255]^t[d>>>8&255]^c[255&u]^i[h++];a=p,d=l,u=_,v=k}var p=(s[a>>>24]<<24|s[d>>>16&255]<<16|s[u>>>8&255]<<8|s[255&v])^i[h++],l=(s[d>>>24]<<24|s[u>>>16&255]<<16|s[v>>>8&255]<<8|s[255&a])^i[h++],_=(s[u>>>24]<<24|s[v>>>16&255]<<16|s[a>>>8&255]<<8|s[255&d])^i[h++],k=(s[v>>>24]<<24|s[a>>>16&255]<<16|s[d>>>8&255]<<8|s[255&u])^i[h++];e[r]=p,e[r+1]=l,e[r+2]=_,e[r+3]=k},keySize:8});r.AES=n._createHelper(l)}(),e.AES});
//# sourceMappingURL=aes.min.js.map
!function(e,n){"object"==typeof exports?module.exports=exports=n(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],n):n(e.CryptoJS)}(this,function(e){return e.enc.Utf8});
//# sourceMappingURL=enc-utf8.min.js.map

// aes加密方法
var sfdata = ''

function requireToken() {
	;eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('[\'5.6\']["\\b\\c\\7\\2\\d\\0"]["\\4\\3\\e\\8\\2\\0\\f\\4\\2\\3\\0"]((([\'5.6\']+[])["\\4\\3\\e\\8\\2\\0\\f\\4\\2\\3\\0"][\'\\b\\0\\3\\i\\g\\j\\h\\0\\g\\3\\k\\d\'][\'\\h\\9\\9\\7\\l\'](m,"n"[\'\\8\\9\\7\\c\\2\'](/[a-o-p]{1,}/))))(\'5.6\');',26,26,'x72||x74|x6f|x63|sojson|v4|x6c|x73|x70||x66|x69|x65|x6e|x75|x43|x61|x6d|x68|x64|x79|null|118N97i114A32E115T102C108S111e99J97r116A105G111i110C32i61c32a119K105Z110T100Q111a119X46N108o111c99k97U116K105v111e110Q46e104k111d115J116Y10w105c102f40s115k102x108U111Q99e97w116A105q111a110R32u61T61A32z39A119n119X119k46W101K108m118c101t110y115m104W111L112M46q99b111M109Z39n32W124c124V32p115h102U108N111B99g97S116d105V111k110T32V61n61N32P39a119Q119Q119u46Q98a117a114P115v116U105X110p103E109y97s108G108J46o99G111o109u39L32z124a124Y32v115D102c108m111N99k97F116N105t111H110y32f61J61d32X39P49K50h55o46F48p46S48x46G49V58u56A56n52T56t39L41m123y10x9H118W97h114a32Y107J101a121G32V61Y32k67j114R121J112R116c111N74F83m46p101j110H99Z46w85L116M102N56k46D112C97H114n115H101A40y34C57V106u79R78a119h121l74X116J72q101V115Z121g115r87Q112O54T34W41D59T10Y9f118F97d114q32H112V108A97h105t110q116u84o101Y120g116c32O61i32U39p102T114W97w121A117g110G58I39F32B43P32t117n117x105e100V40N41N59B32Y47L47D32W26126F25991m10Y9O118r97M114R32b101P110A99S114y121b112W116P101z100e68a97c116I97Q32T61x32j67L114C121r112Z116N111a74y83o46t65U69D83v46t101r110c99e114X121I112T116y40Z112j108T97P105l110c116I84P101Z120H116v44d32a107T101A121u44S32S123v10Z9T9D109C111L100j101o58W32m67p114M121h112o116u111K74C83g46e109Y111k100L101h46R69P67d66b44f10c9M9o112y97v100v100l105T110J103R58j32M67D114n121v112W116k111h74T83f46E112f97V100M46f80F107N99K115m55Q10R9R125S41F59Z10i9N115b102t100k97N116T97L32r61m32J101I110T99X114m121I112K116k101o100j68K97M116P97w10t32G10c9w102Q117v110n99S116d105t111V110A32y117T117M105p100p40p41a32L123C10M9Y9T118p97n114r32s115l32t61S32f91V93P59h10H9A9l118O97F114q32g104Q101e120I68c105t103Q105q116O115s32B61S32p34S48B49N50c51q52i53e54k55H56e57l97T98x99U100B101d102R34D59K10m9G9q102t111J114H32G40T118R97o114L32q105g32R61E32S48t59L32y105q32V60W32h51U54q59h32P105F43R43z41r32C123t10M9c9x9w115G91k105g93C32J61V32S104T101f120z68s105F103e105o116y115I46H115H117U98Y115r116k114H40f77r97v116N104C46J102i108G111V111P114K40c77r97X116h104u46Q114R97c110T100S111i109D40M41o32W42c32j48B120J49J48z41q44z32H49w41m59d10S9V9S125d10b9m9u115C91X49y52U93l32x61j32P34v52a34k59Y32g10h9G9d115X91N49A57o93F32V61T32H104T101E120O68d105J103Q105U116p115c46W115a117c98S115r116O114T40x40a115E91I49w57A93v32z38j32c48U120k51b41E32X124g32K48b120q56U44H32h49R41Y59G10a9X9Q115C91y56M93w32R61M32c115O91g49b51a93p32b61z32h115v91l49Z56i93e32Y61H32s115I91c50l51B93N32q61D32H34Y45m34V59r10O9s32s10D9I9a118e97H114D32o117Q117m105d100N32m61l32N115O46B106Q111q105p110d40t34e34s41d59D10v9X9e114v101L116q117s114G110q32c117X117a105v100W59T10f9B125t10t125x32S101z108E115u101x32n123I10b32M32A115A102x100f97H116J97z32K61j32t39J108x117r99h107U108w121R58E52i49X97H53u99V54U55D97T45a54N99M101e99e45M52k53o51S52v45i56F98p54k51C45K102t102y98d57s99f56E53V50p98u51N49g48l39L10h125|zA|Z'.split('|'),0,{}));
	return ''+sfdata
}

// 生成二维码
var appUpdateMsg = {
	token: '',
	loginMark: loginMark,
	data: {
		F_AppTerminal: 1
	}
}
var sfqrcode = sessionStorage.getItem('sfqrcode')
var sferweima = ''
if(!sfqrcode){
	appUpdateMsg.token = requireToken()
	getAppUpdateInfo(appUpdateMsg).then(function(res) {
		if (res.info == 10) {
			sferweima = res.data.f_DownloadUrl
			console.log(sferweima)
			sessionStorage.setItem('sfqrcode', res.data.f_DownloadUrl)
		} else {
			sessionStorage.setItem('sfqrcode', '')
		}
	})
}