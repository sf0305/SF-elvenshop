var vm = new Vue({
	el: '#service',
	data: {
		loading: true,
		loadingHistory: true,
		chatCreateMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_CustomerId: userId,
				F_ShopId: '',
				F_MarketingId: '',
				F_OrderNo: '',
				F_DialogueType: ''
			}
		},
		chatHistoryMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_CustomerId: userId,
				F_Role: 0,
				page: 1,
				rows: 20,
			}
		},
		chatSendMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_DialogueCode: '',
				F_Message: '',
				F_MessageRole: 0,
				F_PicUrl: ''
			}
		},
		proMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_MarketingId: '',
				F_UserId: userId
			}
		},
		proShow: false,
		orderMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_SearchContent: '',
				F_OrderState: [0],
				F_OrderNo: '',
				rows: 20,
				page: 1
			}
		},
		uploadMsg: {			// 上传图片
			token: requireToken(),
			loginMark: loginMark,
			data: []
		},
		userInfoMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId
			}
		},
		userName: '',
		currencySign: '$',
		searchFlag: true,	//历史记录缺省
		chatInfo: [],
		chatHistory: [],
		sendState: true,
		chatTotal: 1,
		chatPageVisible: true,
		userIcon: 'images/service/userIcon.png',
		timer: null,
		isSend: true,
		sfwrapon: false,
		imgViewUrl: '',
		isSendImg: true,			// 是否发送图片
		//翻译
		sfLang:{
			online:"在线客服",
			send:"发送",
			history:'聊天记录',
			ordnum: '订单号',
			heji: '合计',
			status2: '待发货',
			status4: '待评价',
			status7: '审核中',
			status8: '审核失败',
			status9: '售后处理中',
			status10: '售后完成',
			sendText: '请输入你想咨询的问题',
			uploadImgTip: '上传图片大小不能超过 2MB',
			uploadTip: '请等待'
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
	mounted: function() {
		// 判断是从哪里进入到客服
		if (getRequest().mId && getRequest().type) {
			this.chatCreateMsg.data.F_MarketingId = getRequest().mId
			this.chatCreateMsg.data.F_DialogueType = getRequest().type
			this.proMsg.data.F_MarketingId = getRequest().mId
		} else if (getRequest().no && getRequest().type) {
			this.chatCreateMsg.data.F_OrderNo = getRequest().no
			this.chatCreateMsg.data.F_DialogueType = getRequest().type
			this.orderMsg.data.F_OrderNo = getRequest().no
		} else {
			this.chatCreateMsg.data.chatCreateMsg = 3
		}
		
		getUserInfo(this.userInfoMsg).then(function(res) {
			if (res.info == 10) {
				if (res.data.f_PhotoUrl != '') {
					vm.userIcon = res.data.f_PhotoUrl
				}
				vm.userName = res.data.f_UserName
			}
		})
		
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.chatCreateMsg.data.F_ShopId = res.data.f_ShopId
			vm.orderMsg.data.F_ShopId = res.data.f_ShopId
			vm.currencySign = res.data.f_CurrencySign
			
			// 生成会话
			chatCreate(vm.chatCreateMsg).then(function(resp) {
				if (resp.info == 10) {
					// vm.searchFlag = false
					vm.chatSendMsg.data.F_DialogueCode = resp.data.f_DialogueCode
				}
			})
			
			// 加载当前聊天
			chatHistory(vm.chatHistoryMsg).then(function(resp) {
				if (resp.info == 10) {
					if(resp.data.rows != ''){
						vm.searchFlag = false
					}
					vm.chatInfo = resp.data.rows.reverse()
					vm.chatPageVisible = false
					vm.chatHistory = resp.data.rows
					vm.chatTotal = resp.data.total * 10
					
					// 加载商品数据
					if (vm.chatCreateMsg.data.F_MarketingId != '') {
						getMarketingDetail(vm.proMsg).then(function(res) {
							if (res.info == 10) {
								vm.proShow = true
								vm.chatInfo.push(res.data)
							}
						})
					}
					// 加载订单数据
					if (vm.chatCreateMsg.data.F_OrderNo != '') {
						getOrders(vm.orderMsg).then(function(res) {
							if (res.info == 10) {
								vm.proShow = false
								vm.chatInfo.push(res.data.rows[0])
							}
						})
					}
				}
				vm.loading = false
				vm.loadingHistory = false
			})
		})
	},
	methods: {
		// 输入框内容是否为空
		inputCheck: function(e) {
			if (e.target.value.trim() == '') {
				this.sendState = true
			} else {
				this.sendState = false
			}
		},
		listen: function(e) {
			if (e.ctrlKey && e.keyCode == 13) {
				this.chatSendMsg.data.F_Message += "\n"		// 换行
			} else if (e.keyCode == 13) {
				this.send()			// 发送文本
				e.preventDefault()	// 阻止浏览器默认换行操作
				// return false
			}
		},
		// 发送内容
		send: function() {
			if (this.sendState) return
			
			if (this.isSend) {
				vm.isSend = false
				chatSend(vm.chatSendMsg).then(function(resp) {
					if (resp.info == 10) {
						vm.isSend = true
						vm.searchFlag = false
						vm.chatSendMsg.data.F_DialogueCode = resp.data.f_DialogueCode
						var msg = {
							f_CreateDate: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
							f_CustomerName: vm.userName,
							f_Message: vm.chatSendMsg.data.F_Message,
							f_MessageRole: 0,
							F_PicUrl: ''
						}
						vm.chatInfo.push(msg)
					}
					vm.chatSendMsg.data.F_Message = ''
					vm.sendState = true
					document.querySelector('.chat-textarea textarea').focus()
				})
			}
		},
		// 聊天记录分页
		handlePage: function(val) {
			this.chatHistoryMsg.data.page = val
			this.chatHistory = []
			this.loadingHistory = true
			chatHistory(vm.chatHistoryMsg).then(function(resp) {
				if (resp.info == 10) {
					vm.loadingHistory = false
					vm.chatHistory = resp.data.rows
				}
			})
		},
		toDetailPage: function(id) {
			window.open('./details.html?id=' + id)
		},
		toOrderDetailPage: function(no) {
			window.open('./orderInfo.html?no=' + no)
		},
		// 上传图片
		getFile: function(file) {
			var that = this
			console.log(file)
			// 判断图片大小
			var isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				this.$message.error(this.sfLang.uploadImgTip)
				return
			}
			// 判断支不支持FileReader
			if (!file || !window.FileReader) return false
			
			return new Promise(function (resolve, reject) {
				var reader = new FileReader()
				reader.readAsDataURL(file.raw)
					
				reader.onloadend = function() {
					var result = this.result
					var img = new Image()
					img.src = result
					// console.log('********未压缩前的图片大小********')
					// console.log(result.length / 1024)
					img.onload = function() {
						var data = that.compress(img, 0.9)
						that.uploadImg(data)
					}
				}
			})
		},
		// 压缩图片
		compress: function(img, size) {
			var canvas = document.createElement('canvas')
			var ctx = canvas.getContext('2d')
			var initSize = img.src.length
			var width = img.width
			var height = img.height
			canvas.width = width
			canvas.height = height
			// 铺底色
			ctx.fillStyle = '#fff'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(img, 0, 0, width, height)
			// 进行最小压缩
			var ndata = canvas.toDataURL('image/jpeg', size)
			// console.log('*******压缩后的图片大小*******')
			// console.log(ndata)
			// console.log(ndata.length / 1024)
			return ndata
		},
		uploadImg: function(base64) {
			this.uploadMsg.data.push({
				PictureBytes: base64
			})
			syncPicture(this.uploadMsg).then(function(res) {
				if (res.info == 10) {
					var len = res.data.pictureUrls.length - 1
					vm.chatSendMsg.data.F_PicUrl = res.data.pictureUrls[len]
					
					if (vm.isSendImg) {
						vm.isSendImg = false
						chatSend(vm.chatSendMsg).then(function(resp) {
							if (resp.info == 10) {
								vm.isSendImg = true
								vm.chatSendMsg.data.F_DialogueCode = resp.data.f_DialogueCode
								var msg = {
									f_CreateDate: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
									f_CustomerName: userName,
									f_Message: vm.chatSendMsg.data.F_Message,
									f_MessageRole: 0,
									f_PicUrl: imageUrl + res.data.pictureUrls[len]
								}
								vm.chatInfo.push(msg)
							}
						})
					}
				}
			})
		},
		handleImg: function(imgUrl) {
			this.imgViewUrl = ''
			this.sfwrapon = true
			this.imgViewUrl = imgUrl + '?imageView/2/w/600/h/600'
		},
		// 图片出错加载 loading 图
		imgError: function() {
			var img = event.srcElement
			img.src = 'images/details/loading.gif'
			img.onerror = null	 //防止闪图
		}
	},
	watch: {
		chatInfo: function() {
			var firstScroll = true
			if (firstScroll) {
				firstScroll = false
				setTimeout(function() {
					var msg = document.querySelector('.chat-main')
					msg.scrollTop = msg.scrollHeight 			// 滚动高度
				}, 200)
			} else {
				this.$nextTick(function() {
					var msg = document.querySelector('.chat-main')
					msg.scrollTop = msg.scrollHeight			// 滚动高度
				})
			}
		}
	}
})

// 即时通讯
$(function() {
	var imChat
	var isLoaded = -1
	
	var senderName		// 发送方昵称
	var senderId			// 发送方id
	var senderTime		// 发送时间
	var senderCode		// 发送会话id
	var msgId					// 发送msgid
	var isPage				// 判断是否在当前页面
	var senderPic					// 判断是否是图片 1是返回图片
	var senderContent		// 发送内容
	var customerId = userId
	
	$.ajax({
		url: hubs,
		type: "get",
		dataType: "text",
		success: function(data) {
			eval(data);
			$.connection.hub.url = signalr;
			$.connection.hub.qs = {
				"userId": userId
			};

			imChat = $.connection.ChatsHub;

			if (imChat) {
				//接收消息
				// isPic == 1 返回图片
				imChat.client.revMsg = function(userId, msg, dateTime, isSystem, dialogueCode, msgid, isPic, markId, orderNo) {
					console.log(userId + "发送：" + msg);
					senderTime = dateTime
					senderCode = dialogueCode
					msgId = msgid
					senderPic = isPic
					senderContent = msg
					
					senderName = userId.split(',')[0]
					senderId = userId.split(',')[1]
					
					// 自己的ID，绘画ID，消息ID，是否消息页面
					imChat.server.isAlreadyRead(customerId, dialogueCode, msgid, 1);
				}
				
				// bb msgid || aa 判断 0-未读，1-已读 || cc 聊天数量
				imChat.client.alreadyReadResule = function(bb, aa, cc) {
					console.log("是否已读："+aa +'|| '+bb+"数量："+cc);	

					if (senderPic == 1) {
						var obj = {
							f_CreateDate: senderTime,
							f_ServiceName: senderName,
							f_Message: '',
							f_MessageRole: 1,
							f_PicUrl: senderContent
						}
						vm.$data.chatInfo.push(obj)
					} else {
						var obj = {
							f_CreateDate: senderTime,
							f_ServiceName: senderName,
							f_Message: senderContent,
							f_MessageRole: 1,
							f_PicUrl: ''
						}
						vm.$data.chatInfo.push(obj)
					}
				}
			}

			// 连接成功后注册服务器方法
			$.connection.hub.start().done(function() {
				isLoaded = 1;
			});
			//断开连接后
			$.connection.hub.disconnected(function() {
				isLoaded = 0;
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			isLoaded = 0;
		},
	});
})