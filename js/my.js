var vm = new Vue({
	el: '#my',
	data: {
		searchMsg: { // 全局搜索
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				ShopId: '',
				F_SearchContent: '',
				sord: 'desc',
				sidx: '',
				page: 1,
				rows: 20,
			}
		},
		SearchHistoryMsg: {	//搜索历史记录
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
			}
		},
		sfhistory: false,
		searchItem: [],
		userInfoMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId
			}
		},
		userData: {
			userName: '',
			userEmial: '',
			userPhoto: './images/touxiang.png',
			userIsEmailVerify: 0
		},
		progress: {
			level: '',
			width: ''
		},
		dialogPwdVisible: false, // 修改密码弹窗
		userMsg: { // 修改用户密码
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_OldPassWord: '',
				F_PassWord: '',
			}
		},
		confirmPwd: '', // 确认密码
		totalTime: 60,
		canClick: false,
		dialogEmailVisible: false,
		emailMsg: { // 验证邮箱
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_ShopId: '',
				F_UserEmail: ''
			}
		},
		codeMsg: { // 验证码对比
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_SendEmailCode: ''
			}
		},
		userEmailMsg: { // 验证码正确后 修改用户邮箱认证
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_IsEmailVerify: 1,
				F_UserId: userId,
				F_ShopId: '',
				F_UserEmail: ''
			}
		},
		uploadMsg: { // 上传头像
			token: requireToken(),
			loginMark: loginMark,
			data: []
		},
		isupload: true,
		userEditMsg: { // 保存对应用户的头像
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_Picture: ''
			}
		},
		// 修改昵称和邮箱
		userNameMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				F_ShopId: '',
				F_UserEmail: '',
				F_PetNameUser: '',
			}
		},
		// avatarImg: userPhoto,
		addressForm: { // 地址form信息
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				OperationType: '',
				F_ReceiveName: '',
				F_ReceiveTel: '',
				F_ReceiveCity: '',
				F_ReceiveAddress: '',
				F_ReceiveCode: '',
				F_ReceiveProvince: '',
				F_IsDefalut: 0,
				F_ReceiveComName: '',
				F_ReceiveCountry: 'Thailand',
				F_ReceiveEmail: '',
				F_Id: ''
			}
		},
		addressEditForm: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId,
				OperationType: '',
				F_ReceiveName: '',
				F_ReceiveTel: '',
				F_ReceiveCity: '',
				F_ReceiveAddress: '',
				F_ReceiveCode: '',
				F_ReceiveProvince: '',
				F_IsDefalut: '',
				F_ReceiveComName: '',
				F_ReceiveCountry: '',
				F_ReceiveEmail: '',
				F_Id: ''
			}
		},
		// 获取地址信息
		addressMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_UserId: userId
			}
		},
		// 设置默认地址
		editAddressMsg: {
			token: requireToken(),
			loginMark: loginMark,
			data: {
				F_Id: '',
				OperationType: '',
				F_UserId: userId,
				F_IsDefalut: ''
			}
		},
		addressData: [],
		thailandArea: [],
		provinceData: [],			// 省份洲
		cityData: [],			// 城市
		editDialogVisible: false,
		type: 0,			// 左侧菜单
		loading: false,
		sfLang: {
			sfserhis: '搜索历史',
			search: '搜索',
			safeSet: '安全设置',
			personMsg: '个人信息',
			addrMsg: '地址管理',
			baseMsg: '基本信息',
			accountName: '昵称',
			accountEmail: '邮箱',
			safeService: '安全服务',
			safeLevel: '安全等级',
			emailSafe: '完成邮箱认证，提升账户安全',
			middle: '中等',
			high: '高级',
			setted: '已设置',
			changePwd: '登录密码',
			setPwdTip: '建议定期更换密码且设置一个包含数字和字母并且长度超过6位以上的密码',
			emailAuth: '邮箱认证',
			emailNoneAuth: '未认证',
			emailHasAuth: '已认证',
			emailTip: '用于提升账号的安全性和信任级别, 认证后不能修改认证信息',
			edit: '修改',
			auth: '认证',
			sfmustnum: '必须为数字',
			oldPwd: '原密码',
			oldPwdTip: '请输入原密码',
			newPwd: '新密码',
			newPwdTip: '请输入新密码',
			confirmPwd: '确认密码',
			confirmPwdTip: '请输入确认密码',
			pwdTip: '密码不一致',
			pwdSuccess: '编辑成功',
			pwdFail: '编辑失败',
			pwdFail4: '原密码错误',
			msgTip: '请完善信息',
			sure: '确定',
			cancel: '取消',
			email: '邮箱',
			emailNotTip: '邮箱不能为空',
			code: '验证码',
			codeTip: '验证码不能为空',
			codeSendSuccess: '验证码发送成功',
			codeNone: '验证码错误',
			codeSendFail: '验证码发送失败',
			codeExpired: '验证码已过期',
			send: '发送',
			reload: '重新发送',
			emailSuccess: '邮箱验证成功',
			emailFail: '邮箱验证失败',
			avatar: '更改头像',
			avatarTips: '请上传头像',
			upload: '上传',
			uploadSuccess: '上传成功',
			uploadFail: '上传失败',
			save: '保存',
			avatarSuccess: '更改头像成功',
			avatarFail: '更改头像失败',
			address: '收货地址',
			setAddress: '设置为默认收货地址',
			receiveName: '收件人',
			receiveNameTip: '请输入收件人',
			receiveTel: '手机号',
			receiveTelTip: '请输入手机号',
			receiveEmail: '邮箱',
			receiveEmailTip: '请输入邮箱',
			receiveEmailtype: '邮箱格式不正确',
			receiveAddress: '详细地址',
			receiveAddressTip: '请输入详细地址',
			receiveCity: '城市',
			receiveCityTip: '请输入城市',
			receiveProvince: '省份州',
			receiveProvinceTip: '请输入省份州',
			receiveComName: '公司名称',
			receiveComNameTip: '请输入公司名称',
			receiveCode: '邮编',
			receiveCodeTip: '请输入邮编',
			receiveCountry: '国家',
			receiveCountryTip: '请选择国家',
			addrSuccess: '添加成功',
			addrFail: '添加失败',
			noneData: '暂无数据',
			operateTable: '操作',
			editTable: '编辑',
			editAddrSuccess: '编辑成功',
			editAddrFail: '编辑失败',
			delTable: '删除',
			delTableTip: '是否删除该条信息',
			delTableSuccess: '删除成功',
			delTableFail: '删除失败',
			defaultTable: '默认地址',
			defaultTableText: '设为默认地址',
			pwdError: '不能与原密码相同',
			sfyuanmima: '请输入原密码',
			sfmima: '请输入6-20位密码',
			sfadrTip:	'只能添加20个地址',
			none: '暂无数据',
			phoneThTip: '请输入以0开头的号码'
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
		
		getUserInfo(this.userInfoMsg).then(function(res) {
			if (res.info == 10) {
				vm.userNameMsg.data.F_PetNameUser = res.data.f_PetNameUser
				vm.userNameMsg.data.F_UserEmail = res.data.f_UserEmail

				vm.userData.userPhoto = res.data.f_PhotoUrl || './images/touxiang.png'
				vm.userData.userIsEmailVerify = res.data.f_IsEmailVerify
				vm.userData.userName = res.data.f_UserName
				vm.emailMsg.data.F_UserEmail = res.data.f_UserEmail
				vm.userEmailMsg.data.F_UserEmail = res.data.f_UserEmail
				
				if (res.data.f_IsEmailVerify == 0 || res.data.f_IsEmailVerify == null) {
					vm.progress.level = vm.sfLang.middle
					vm.progress.width = '50'
				} else {
					vm.progress.level = vm.sfLang.high
					vm.progress.width = '90'
				}
			}
		})
		
		
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.emailMsg.data.F_ShopId = res.data.f_ShopId // 邮箱发送
			vm.userMsg.data.F_ShopId = res.data.f_ShopId // 用户修改密码
			vm.userEmailMsg.data.F_ShopId = res.data.f_ShopId // 用户认证邮箱
			vm.userEditMsg.data.F_ShopId = res.data.f_ShopId // 用户修改头像
			vm.userNameMsg.data.F_ShopId = res.data.f_ShopId // 用户修改头像 
			
			//搜索历史记录
			getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
				vm.searchItem = res.data
			})
			
		})
		if (getRequest().type == 2) {
			this.type = getRequest().type
			this.addressList()
			if (this.addressForm.data.F_ReceiveCountry == 'Thailand') {
				for (var i in thailand) {
					this.provinceData.push(thailand[i].label)
				}
			}
		}
	},
	methods: {
		// 左侧选项卡
		handleOption: function(index) {
			if (this.type == index) {
				return
			}
			this.type = index
			if (index == 2) {
				this.addressList()
				if (this.addressForm.data.F_ReceiveCountry == 'Thailand') {
					for (var i in thailand) {
						this.provinceData.push(thailand[i].label)
					}
				}
			}
		},
		// 获取国家 目前只有泰国area
		changeCountry: function(val) {
			if (this.addressForm.data.F_ReceiveCountry == 'Thailand') {
				this.addressForm.data.F_ReceiveProvince = ''
				this.addressForm.data.F_ReceiveCity = ''
				this.provinceData = []
				for (var i in thailand) {
					this.provinceData.push(thailand[i].label)
				}
			} else {
				this.provinceData = []
				this.cityData = []
				this.addressForm.data.F_ReceiveProvince = ''
				this.addressForm.data.F_ReceiveCity = ''
			}
		},
		// 获取省份洲再去获取对应的城市
		changeProvince: function(val) {
			this.addressForm.data.F_ReceiveCity = ''
			this.cityData = []
			if (this.addressForm.data.F_ReceiveProvince != '') {
				for (var i in thailand) {
					if (val == thailand[i].label) {
						for (var k in thailand[i].children) {
							this.cityData.push(thailand[i].children[k].label)
						}
					}
				}
			}
		},
		// 编辑国家 目前只有泰国area
		editCountry: function(val) {
			if (this.addressEditForm.data.F_ReceiveCountry == 'Thailand') {
				this.addressEditForm.data.F_ReceiveProvince = ''
				this.addressEditForm.data.F_ReceiveCity = ''
				this.provinceData = []
				for (var i in thailand) {
					this.provinceData.push(thailand[i].label)
				}
			} else {
				this.provinceData = []
				this.addressEditForm.data.F_ReceiveProvince = ''
				this.addressEditForm.data.F_ReceiveCity = ''
			}
		},
		// 编辑省份洲
		editProvince: function(val) {
			this.addressEditForm.data.F_ReceiveCity = ''
			this.cityData = []
			if (this.addressEditForm.data.F_ReceiveProvince != '') {
				for (var i in thailand) {
					if (val == thailand[i].label) {
						for (var k in thailand[i].children) {
							this.cityData.push(thailand[i].children[k].label)
						}
					}
				}
			}
		},
		// 编辑城市
		editCity: function() {
			if (this.addressEditForm.data.F_ReceiveProvince != '') {
				for (var i in thailand) {
					if (this.addressEditForm.data.F_ReceiveProvince == thailand[i].label) {
						for (var k in thailand[i].children) {
							this.cityData.push(thailand[i].children[k].label)
						}
					}
				}
			}
		},
		// 地址列表
		addressList: function() {
			getUsersAdressDetail(this.addressMsg).then(function(res) {
				if (res.info == 10) {
					vm.addressData = res.data
				} else {
					vm.addressData = []
				}
			})
		},
		// 搜索
		searchBtn: function() {
			if (this.searchMsg.data.F_SearchContent.trim() == '') {
				return
			} else {
				window.location.href = './list.html?page0_id=' + this.searchMsg.data.F_SearchContent
			}
		},
		//搜索历史
		searchLsit: function(content) {
			setTimeout(function(){
				getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
					vm.searchItem = res.data
				})
			},100)
			window.location.href = './list.html?page0_id=' + content;
		},
		sfsearch: function() {
			vm.sfhistory = true
		},
		nosfsearch: function() {
			setTimeout(function(){
				vm.sfhistory = false
			},100)
		},
		inputsfsearch: function() {
			if (this.searchContent.trim() == '') {
				vm.sfhistory = true
			}else{
				vm.sfhistory = false
			}
		},
		// 修改密码
		editPassword: function() {
			var that = this
			var reg = /^[a-zA-Z0-9-_@.]{6,20}$/;
			if (this.userMsg.data.F_OldPassWord.trim() == '') {
				this.$message.warning(this.sfLang.oldPwdTip)
				return
			} else if (this.userMsg.data.F_PassWord.trim() == '') {
				this.$message.warning(this.sfLang.newPwdTip)
				return
			} else if (this.confirmPwd.trim() == '') {
				this.$message(this.sfLang.confirmPwdTip)
				return
			} else if (this.userMsg.data.F_PassWord == this.userMsg.data.F_OldPassWord) {
				this.$message.warning(this.sfLang.pwdError)
				return
			}else if (this.userMsg.data.F_PassWord != this.confirmPwd) {
				this.$message.warning(this.sfLang.pwdTip)
				return
			} else if (reg.test(that.userMsg.data.F_PassWord) == false) {
				this.$message.warning(this.sfLang.sfmima)
				return
			}
			userEdit(vm.userMsg).then(function(res) {
				if (res.info == 10) {
					that.$message.success(that.sfLang.pwdSuccess)
					setTimeout(function() {
						localStorage.removeItem('userInfo')
						window.location.href = './login.html'
					}, 3000)
				} else if (res.info == 4) {
					that.$message.error(that.sfLang.pwdFail4)
				} else {
					that.$message.error(that.sfLang.pwdFail)
				}
				vm.dialogPwdVisible = false
			})
		},
		// 邮箱发送验证码
		sendEmail: function() {
			var that = this
			var sfregEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
			if (this.emailMsg.data.F_UserEmail.trim() == '') {
				this.$message(this.sfLang.emailNotTip)
				this.emailMsg.data.F_UserEmail = ''
				return
			} else if(!sfregEmail.test(this.emailMsg.data.F_UserEmail)){
				this.$message.warning(this.sfLang.receiveEmailtype)
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
					vm.countDown()
					that.$message.success(that.sfLang.codeSendSuccess)
				} else {
					loading.close()
					that.$message.error(that.sfLang.codeSendFail)
				}
			})
		},
		// 邮箱验证码验证
		emailVerify: function() {
			var that = this
			if (that.codeMsg.data.F_SendEmailCode.trim() == '') {
				that.$message.error(that.sfLang.codeTip)
				return
			} 
			loginComparisonCode(vm.codeMsg).then(function(res) {
				if (res.info == 10) {
					userEdit(vm.userEmailMsg).then(function(res) {
						if (res.info == 10) {
							vm.progress.level = vm.sfLang.high
							vm.progress.width = '90'
							vm.userData.userIsEmailVerify = 1

							that.$message.success(that.sfLang.emailSuccess)
							that.dialogEmailVisible = false
							that.codeMsg.data.F_SendEmailCode = ''
						} else {
							that.$message.error(that.sfLang.emailFail)
						}
					})
				} else {
					that.$message.error(that.sfLang.codeNone)
				}
			})
		},
		// 上传头像
		getFile: function(file, fileList) {
			var that = this
			this.loading = true
			this.getBase64(file.raw).then(function(res) {
				vm.userData.userPhoto = res
				vm.uploadMsg.data.push({
					PictureBytes: res
				})
				syncPicture(vm.uploadMsg).then(function(res) {
					if (res.info == 10) {
						vm.loading = false
						vm.isupload = false
						that.$message.success(vm.sfLang.uploadSuccess)
						var len = res.data.pictureUrls.length - 1
						vm.userEditMsg.data.F_Picture = res.data.pictureUrls[len]
						vm.userData.userPhoto = imageUrl + res.data.pictureUrls[len]
					} else {
						that.$message.error(vm.sfLang.uploadFail)
					}
				})
			});
		},
		// 图片转码base64
		getBase64: function(file) {
			return new Promise(function (resolve, reject) {
				var reader = new FileReader();
				var imgResult = "";
				reader.readAsDataURL(file);
		
				reader.onload = function () {
					imgResult = reader.result;
				};
		
				reader.onerror = function (error) {
					reject(error);
				};
		
				reader.onloadend = function () {
					resolve(imgResult);
				};
			});
		},
		// 保存图片
		saveUserPhoto: function() {
			var that = this
			userEdit(vm.userEditMsg).then(function(res) {
				if (res.info == 10) {
					vm.isupload = true
					vm.userEditMsg.data.F_Picture = ''
					that.$message.success(that.sfLang.avatarSuccess)
				} else {
					that.$message.error(that.sfLang.avatarFail)
				}
			})
		},
		// 更改用户名和邮箱
		editInfoMsg: function() {
			var that = this

			var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			if(!reg.test(vm.userNameMsg.data.F_UserEmail)){
				that.$message.warning(that.sfLang.receiveEmailtype)
				return
			}
			if(vm.userNameMsg.data.F_PetNameUser.trim() == ''){
				vm.userNameMsg.data.F_PetNameUser = vm.userData.userName
			}
			userEdit(vm.userNameMsg).then(function(res) {
				if (res.info == 10) {
					var storage = new Storage()
					storage.setItem({
						name: 'userInfo',
						value: {
							userId: userId,
							userName: vm.userNameMsg.data.F_PetNameUser,
							userPhoto: vm.userData.userPhoto
						}
					})
					// that.$message.success(that.sfLang.editAddrSuccess)
					window.location.reload()
				} else {
					that.$message.error(that.sfLang.editAddrFail)
				}
			})
		},
		blurInfo1: function(e) {
			document.querySelector('.sfusername').style.border = '1px solid #DCDFE6'
		},
		focusInfo1: function(e) {
			document.querySelector('.sfusername').style.border = '1px solid #409EFF'
		},
		blurInfo2: function(e) {
			document.querySelector('.sfuseremail').style.border = '1px solid #DCDFE6'
		},
		focusInfo2: function(e) {
			document.querySelector('.sfuseremail').style.border = '1px solid #409EFF'
		},
		// 关闭弹窗
		closeDialog: function(index) {
			if (index == 1) {
				this.dialogPwdVisible = false
				this.userMsg.data.F_OldPassWord = ''
				this.userMsg.data.F_PassWord = ''
				this.confirmPwd = ''
			} else if (index == 2) {
				this.dialogEmailVisible = false
				// this.emailMsg.data.F_UserEmail = ''
				this.codeMsg.data.F_SendEmailCode = ''
			} else if (index == 3) {
				this.editDialogVisible = false
				this.addressEditForm.data.F_Id = ''
				this.addressEditForm.data.F_IsDefalut = 0
				this.addressEditForm.data.OperationType = ''
				this.addressEditForm.data.F_ReceiveName = ''
				this.addressEditForm.data.F_ReceiveTel = ''
				this.addressEditForm.data.F_ReceiveEmail = ''
				this.addressEditForm.data.F_ReceiveAddress = ''
				this.addressEditForm.data.F_ReceiveCity = ''
				this.addressEditForm.data.F_ReceiveProvince = ''
				this.addressEditForm.data.F_ReceiveCountry = 'Thailand'
				this.addressEditForm.data.F_ReceiveCode = ''
				this.addressEditForm.data.F_ReceiveComName = ''
			}
		},
		// 添加地址
		addAddress: function(formName) {
			var that = this
			// 如果超出20个地址 不能再添加地址 只能删除或编辑
			if (that.addressData.length == 20) {
				that.$message.warning(vm.sfLang.sfadrTip)
				return
			}
			
			that.$refs[formName].validate(function(valid) {
				if (valid) {
					vm.addressForm.data.OperationType = 1
					operationUsersAdressDetail(vm.addressForm).then(function(res) {
						if (res.info == 10) {
							vm.addressForm.data.F_ReceiveName = ''
							vm.addressForm.data.F_ReceiveTel = ''
							vm.addressForm.data.F_ReceiveEmail = ''
							vm.addressForm.data.F_ReceiveAddress = ''
							vm.addressForm.data.F_ReceiveCity = ''
							vm.addressForm.data.F_ReceiveProvince = ''
							vm.addressForm.data.F_ReceiveCountry = 'Thailand'
							vm.addressForm.data.F_ReceiveCode = ''
							vm.addressForm.data.F_IsDefalut = 0
							vm.addressForm.data.OperationType = ''
							vm.addressForm.data.F_ReceiveComName = ''
							vm.addressList()
							that.$message.success(that.sfLang.addrSuccess)
						} else {
							that.$message.error(that.sfLang.addrFail)
						}
					})
				}
			})
		},

		// 编辑地址
		editDialogAddress: function(row) {
			this.editDialogVisible = true
			if (row.f_ReceiveCountry != 'Thailand') {
				vm.provinceData = []
			} else {
				for (var i in thailand) {
					vm.provinceData.push(thailand[i].label)
				}
			}

			this.addressEditForm.data.F_Id = row.f_Id
			this.addressEditForm.data.F_IsDefalut = row.f_IsDefalut.toString()
			this.addressEditForm.data.OperationType = 2
			this.addressEditForm.data.F_ReceiveName = row.f_ReceiveName
			this.addressEditForm.data.F_ReceiveTel = row.f_ReceiveTel
			this.addressEditForm.data.F_ReceiveEmail = row.f_ReceiveEmail
			this.addressEditForm.data.F_ReceiveAddress = row.f_ReceiveAddress
			this.addressEditForm.data.F_ReceiveCity = row.f_ReceiveCity
			this.addressEditForm.data.F_ReceiveProvince = row.f_ReceiveProvince
			this.addressEditForm.data.F_ReceiveCountry = row.f_ReceiveCountry
			this.addressEditForm.data.F_ReceiveCode = row.f_ReceiveCode
			this.addressEditForm.data.F_ReceiveComName = row.f_ReceiveComName
		},
		editAddress: function(formName) {
			var that = this
			this.$refs[formName].validate(function(valid) { 
				if(valid){
					operationUsersAdressDetail(vm.addressEditForm).then(function(res) {
						if (res.info == 10) {
							vm.addressList()
							vm.closeDialog(3)
							that.$message.success(vm.sfLang.editAddrSuccess)
						} else {
							that.editDialogVisible = false
							that.$message.success(vm.sfLang.editAddrFail)
						}
					})
				}
			})
		},
		// 删除地址
		delAddress: function(row) {
			var that = this
			this.$confirm(vm.sfLang.delTableTip + '?', vm.sfLang.delTable, {
				confirmButtonText: vm.sfLang.sure,
				cancelButtonText: vm.sfLang.cancel,
				type: 'warning'
			}).then(function() {
				vm.editAddressMsg.data.OperationType = 0
				vm.editAddressMsg.data.F_Id = row.f_Id
				vm.editAddressMsg.data.F_IsDefalut = row.f_IsDefalut
				operationUsersAdressDetail(vm.editAddressMsg).then(function(res) {
					if (res.info == 10) {
						that.$message.success(vm.sfLang.delTableSuccess)
						vm.addressList()
					} else {
						that.$message.error(vm.sfLang.delTableFail)
					}
				})
			}).catch(function() {});
		},
		// 默认地址
		setAddress: function(row) {
			vm.editAddressMsg.data.OperationType = 2
			vm.editAddressMsg.data.F_Id = row.f_Id
			vm.editAddressMsg.data.F_IsDefalut = 1
			operationUsersAdressDetail(vm.editAddressMsg).then(function(res) {
				if (res.info == 10) {
					vm.addressList()
				}
			})
		},
		// 60秒倒计时
		countDown: function() {
			var that = this
			if (that.canClick) return
			that.canClick = true
			that.sfLang.send = that.totalTime + 's'
			var clock = window.setInterval(function() {
				that.totalTime--
				that.sfLang.send = that.totalTime + 's'
				if (that.totalTime <= 0) {
					window.clearInterval(clock)
					that.sfLang.send = that.sfLang.reload
					that.totalTime = 60
					that.canClick = false
				}
			}, 1000)
		},
		toIndexPage: function() {
			window.location.href = './index.html'
		},
		// 手机号码验证
		validateAddPhone: function(rule, value, callback) {

			if (vm.addressForm.data.F_ReceiveCountry == 'Thailand') {
				var phoneThReg = /^0[0-9-]{1,20}$/
				if (!phoneThReg.test(value)) {
					callback(new Error(vm.sfLang.phoneThTip))
				} else {
					callback()
				}
			}
			
		},
		validateEditPhone: function(rule, value, callback) {

			if (vm.addressEditForm.data.F_ReceiveCountry == 'Thailand') {
				var phoneThReg = /^0[0-9-]{1,20}$/
				if (!phoneThReg.test(value)) {
					callback(new Error(vm.sfLang.phoneThTip))
				} else {
					callback()
				}
			}
			
		},
	}
})

//上传头像保存按钮样式更改
var sfSave = document.querySelector('.el-upload button:nth-child(2)')
sfSave.onmouseout = function() {
	sfSave.style.color = '#606266'
	sfSave.style.background = 'white'
	sfSave.style.border = '1px solid #f1f1f1'
}
sfSave.onmouseover = function() {
	sfSave.style.color = '#606266'
	sfSave.style.background = 'rgb(247,247,247)'
	sfSave.style.border = '1px solid #f1f1f1'
}
