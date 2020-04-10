var vm = new Vue({
	el: '#pingjia',
	data: {
		nosub: false,
		orderMsg: { //订单
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_SearchContent: '',
				F_OrderState: [4],
				F_OrderNo: getRequest().no,
				rows: 1,
				page: 1
			}
		},
		orderData: [],
		commentMsg: { //评论
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_OrderNo: getRequest().no,
				CommentDetail: [],
				F_ShopId: '',
				F_UserId: userId
			}
		},
		uploadMsg: {			// 上传图片
			token: requireToken(),
			loginMark: loginMark,
			data: []
		},
		content: [], 			// 获取评论内容
		stat: [], 				// 获取好评星级
		imgList: [],			// 获取图片
		fileList: [],			// 图片
		picNum: [],				// 上传图片数量
		index: '',				// 判断上传图片是对应哪一组商品
		disabled: false,
		sfLang: {
			proRev: '商品评分',
			proTips: '麻烦给个好评',
			pingjia: '评价',
			pinglun: '请输入评论内容',
			fabiao: '发表评论',
			tianxie: '请填写评论',
			tijiao: '提交失败',
			tijiaosuc: '提交成功',
			uploadImgTip: '上传图片大小不能超过 2MB'
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
	mounted: function() {
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.orderMsg.data.F_ShopId = res.data.f_ShopId // 订单
			vm.commentMsg.data.F_ShopId = res.data.f_ShopId // 评论
			getOrders(vm.orderMsg).then(function(res) {
				var index = getRequest().index
				if (res.info == 10) {
					var data = res.data.rows[0].orderDetail
					for (var i in data) {
						data[i].sku = Object.values(data[i].attribute).join(', ')
						vm.commentMsg.data.CommentDetail.push({
							F_GoodsAttributeId: data[i].f_GoodsAttributeId,
							F_CommentContent: '',
							F_CommentStart: 5,
							F_MarketingId: data[i].f_MarketingId,
							F_OrderDetailId: data[i].f_OrderDetailId,
							F_PicDetail: []
						})
						vm.stat[i] = 5
						vm.picNum[i] = 0
					}
					vm.orderData = res.data.rows[0]
				}
			})
		})
	},
	methods: {
		submit: function() {
			var that = this
			var data = this.commentMsg.data.CommentDetail
			for (var i in data) {
				data[i].F_CommentContent = this.content[i]
				data[i].F_CommentStart = this.stat[i]
				data[i].F_PicDetail = this.imgList[i]
			}

			var loading = that.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			addUserComment(vm.commentMsg).then(function(res) {
				if (res.info == 10) {
					vm.nosub = true //提交成功按钮不可点击
					that.$message.success(vm.sfLang.tijiaosuc)
					setTimeout(function() {
						loading.close()
						window.location.href = './orderList.html'
					}, 1500)
				} else {
					loading.close()
					that.$message.error(vm.sfLang.tijiao)
				}
			})
		},
		uploadImgArr: function(index) {
			this.index = index
		},
		// 上传图片
		handleChange: function(file) {
			var isImgType = true, that = this
			// 判断图片类型
			// if (file.raw.type == 'image/jpeg' || file.raw.type == 'image/png' || file.raw.type == 'image/JPG') {
			// 	isImgType = true
			// } else {
			// 	isImgType = false
			// 	this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!')
			// 	return
			// }
			// 判断图片大小
			var isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				this.$message.error(this.sfLang.uploadImgTip)
				return
			}
			// 判断支不支持FileReader
			if (!file || !window.FileReader) return false
			if (isImgType) {
				// 先存储数据 方便后期做处理
				var imgMsg = {
					uid: file.uid,
					url: file.url
				}
				if (this.fileList[this.index]) {
					this.fileList[this.index].push(imgMsg)
					vm.picNum[vm.index] = vm.fileList[vm.index].length
				} else {
					this.fileList[this.index] = []
					this.fileList[this.index].push(imgMsg)
					vm.picNum[vm.index] = vm.fileList[vm.index].length
				}
				document.querySelectorAll('.pic-num')[vm.index].innerText = vm.picNum[vm.index] + '/5'
				
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
			}
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
					if (vm.imgList[vm.index]) {
						vm.imgList[vm.index].push(res.data.pictureUrls[len])
					} else {
						vm.imgList[vm.index] = []
						vm.imgList[vm.index].push(res.data.pictureUrls[len])
					}
				}
			})
		},
		// 删除图片
		handleRemove: function(file) {
			for (var i in this.fileList) {
				for (var k in this.fileList[i]) {
					if (this.fileList[i][k].uid == file.uid) {
						this.fileList[i].splice(k, 1)
						this.imgList[i].splice(k, 1)
						vm.picNum[vm.index] = vm.fileList[vm.index].length
						document.querySelectorAll('.pic-num')[vm.index].innerText = vm.picNum[vm.index] + '/5'
						break
					}
				}
			}
		}
	}
})
