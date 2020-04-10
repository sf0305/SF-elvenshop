var jq = jQuery.noConflict();
var vm = new Vue({
	el: '#itany',
	data: function() {
		return {
			homePageMsg: {
				token: requireToken(),
				loginMark: loginMark,
				data: {
					F_ShopId: ''
				}
			},
			hotMsg: {			// 热销
				token: requireToken(),
				loginMark: loginMark,
				data: {
					F_HomePageDisplayId: "",
					F_ShopId: '',
					F_CategoryId: '',
					F_SearchContent: '',
					rows: 8,
					sord: '',
					sidx: 'f_SaleNum',
					page: 1
				}
			},
			hotVisible: false,
			recommendMsg: {			// 推荐
				token: requireToken(),
				loginMark: loginMark,
				data: {
					F_HomePageDisplayId: "",
					F_ShopId: '',
					F_CategoryId: '',
					F_SearchContent: '',
					rows: 20,
					sord: '',
					sidx: '',
					page: 1
				}
			},
			countRun: 0,
			timer: null,
			t: null,
			countRunLength: 0,
			bigImg: [],
			//搜索
			SearchHistoryMsg: {
				token: requireToken(),
				loginMark: loginMark,
				data: {
					F_UserId: userId,
				}
			},
			searchItem: [],
			searchContent: '',
			getDetailData: [], // 热销
			categoryData: [], // 推荐
			currencySign: '$',
			sfLang: {
				searchContent: '请输入搜索内容',
				search: '搜索',
				theme: '主题市场',
				hot: '热销',
				sales: '销量',
				sfersongyi: '买二送一',
				sferbanjia: '第二件半价',
				recommend: '商品推荐',
				more: '查看更多',
				sfserhis: '搜索历史',
			},
			screenWidth: '',
			screenHight: '',
			recommendData: [],
			loading: true,
			hideMore: true,
			sfhistory: false,
			domainNameVisible: 0
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
		
		switch(domainName) {
			case 'www.burstingmall.com':
				this.domainNameVisible = 1
				document.title = 'BURSTINGMALL'
				break;
			default:
				this.domainNameVisible = 0
				document.title = 'ElvenShop | โฮมเพจ'
				break;
		}
	},
	mounted: function() {
		shopMsg.token = requireToken()
		getShopIdByLanguage(shopMsg).then(function(res) {
			vm.homePageMsg.data.F_ShopId = res.data.f_ShopId
			vm.hotMsg.data.F_ShopId = res.data.f_ShopId
			vm.recommendMsg.data.F_ShopId = res.data.f_ShopId
			categoryMsg.data.ShopId = res.data.f_ShopId
			categoryMsg.token = requireToken()
			vm.currencySign = res.data.f_CurrencySign

			getHomePageDisplays(vm.homePageMsg).then(function(res) {
				if (res.info == 10) {
					var arrImg = res.data
					var bigImgcountRun = 0
					var bannerDiv = document.querySelector('.banner-wheel-run')

					// f_DisplayType  1、轮播图 2、排行榜 3、分类图 4、全部商品
					for (var i = 0; i < arrImg.length; i++) {
						if (arrImg[i].f_DisplayType == "1") {
							vm.bigImg[bigImgcountRun] = arrImg[i];
							bigImgcountRun++;
						} else if (arrImg[i].f_DisplayType == "2") {
							vm.hotMsg.data.F_HomePageDisplayId = arrImg[i].f_Id
						} else if (arrImg[i].f_DisplayType == "4") {
							vm.recommendMsg.data.F_HomePageDisplayId = arrImg[i].f_Id
						}
					}

					// 轮播图
					for (var i = 0; i < vm.bigImg.length; i++) {
						var li = document.createElement('li');
						var a = document.createElement('a');
						var img = document.createElement('img');
						li.setAttribute('id', vm.bigImg[i].f_Id);
						li.setAttribute('onclick', 'openBannerComtiy(this)')
						img.setAttribute('src', vm.bigImg[i].f_CarouseWebPicUrl);
						a.appendChild(img);
						li.appendChild(a);
						bannerDiv.appendChild(li);
					}
					var li = document.createElement('li');
					var a = document.createElement('a');
					var img = document.createElement('img');
					li.setAttribute('id', vm.bigImg[0].f_Id);
					li.setAttribute('onclick', 'openBannerComtiy(this)')
					img.setAttribute('src', vm.bigImg[0].f_CarouseWebPicUrl);
					a.appendChild(img);
					li.appendChild(a);
					bannerDiv.appendChild(li);
					vm.countRunLength = vm.bigImg.length;
					bannerDiv.style.width = (vm.bigImg.length + 1) * 100 + '%';

					// 热销
					getHomePageDisplayDetail(vm.hotMsg).then(function(res) {
						if (res.info == 10) {
							vm.hotVisible = true
							vm.getDetailData = res.data.rows
							for (var i in vm.getDetailData) {
								vm.getDetailData[i].f_SalesPrice = vm.getDetailData[i].f_SalesPrice.toFixed(2)
								vm.getDetailData[i].f_OriginalPrice = vm.getDetailData[i].f_OriginalPrice.toFixed(2)
							}
						} else {
							vm.hotVisible = false
						}
					})
					
					// 推荐
					getHomePageDisplayDetail(vm.recommendMsg).then(function(res) {
						if (res.info == 10) {
							vm.loading = false
							vm.recommendData = res.data.rows
							for (var i in vm.recommendData) {
								vm.recommendData[i].f_SalesPrice = vm.recommendData[i].f_SalesPrice.toFixed(2)
								vm.recommendData[i].f_OriginalPrice = vm.recommendData[i].f_OriginalPrice.toFixed(2)
							}
						} else {
							vm.loading = false
							vm.hideMore = false
						}
					})
				}
			})

			//搜索历史记录
			getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
				if (res.info == 10) {
					vm.searchItem = res.data
				}
			})
			// 功能菜单
			getCategoryInfo(categoryMsg).then(function(res) {
				if (res.info == 10) {
					var totalData = res.data
					vm.categoryData = totalData.slice(0, 6)
					var classifyMsg = document.querySelector('.container-page') // 一级菜单
					var divList = document.querySelector('.page-hover') // 二级菜单
					
					for (var i = 0; i < totalData.length; i++) {
						// 一级菜单内容
						var f_li = document.createElement('li')
						f_li.setAttribute('onmousemove', 'moveClass(' + i + ')')
						f_li.setAttribute('onmouseout', 'outClass(' + i + ')')
						f_li.setAttribute('id', totalData[i].f_Id)
						f_li.setAttribute('onclick', 'openComtiy(this)')
						var f_a = document.createElement('a')
						var f_i = document.createElement('i')
						f_a.innerText = totalData[i].f_LanguageName
						f_i.innerHTML = '&gt;'
						f_li.appendChild(f_a)
						f_li.appendChild(f_i)
						classifyMsg.appendChild(f_li)
					
						// 二级菜单内容
						var divListAll = document.createElement('div')
						var ulListAll = document.createElement('ul')
						divListAll.setAttribute('onmousemove', 'display(' + i + ')')
						divListAll.setAttribute('onmouseout', 'displayNone(' + i + ')')
						divListAll.appendChild(ulListAll)
						divList.appendChild(divListAll)
					
						var subCategoryData = totalData[i].subCategory
						for (var j = 0; j < subCategoryData.length; j++) {
							var f_divLi = document.createElement('li')
							var f_divA = document.createElement('a')
							f_divA.innerText = subCategoryData[j].f_LanguageName
							f_divA.setAttribute('id', subCategoryData[j].f_Id)
							f_divA.setAttribute('onclick', 'openScendComtiy(this)')
							f_divLi.appendChild(f_divA)
							ulListAll.appendChild(f_divLi)
						}
					}
				}
			})
		})

		this.t = setInterval(function() {
			vm.prevImg()
		}, 4000);
	},
	methods: {
		nextImg: function() {
			this.countRun--;
			if (this.countRun == -1) {
				this.countRun = this.countRunLength - 1;
				jq('.banner-wheel-run').css({
					left: -this.countRunLength * 100 + '%'
				});
			}
			bannerRun(this.countRun);
		},
		prevImg: function() {
			this.countRun++;
			if (this.countRun == this.countRunLength + 1) {
				this.countRun = 1;
				jq('.banner-wheel-run').css({
					left: 0
				});
			}
			bannerRun(this.countRun);
		},
		imgStop: function() {
			clearInterval(this.t);
		},
		imgStart: function() {
			this.t = setInterval(function() {
				vm.prevImg()
			}, 4000);
		},
		// 搜索按钮
		searchBtn: function() {
			if (this.searchContent.trim() == '') {
				return
			} else {
				setTimeout(function(){
					getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
						vm.searchItem = res.data
					})
				},100)
				window.open('./list.html?page0_id=' + this.searchContent);
			}
		},
		searchLsit: function(content) {
			setTimeout(function(){
				getUserSearchHistory(vm.SearchHistoryMsg).then(function(res) {
					vm.searchItem = res.data
				})
			},100)
			window.open('./list.html?page0_id=' + content);
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
		// 热销跳转详情
		detailHandle: function(id) {
			window.open('./details.html?id=' + id)
		},
		toPage: function(n, id) {
			if (n == 1) {
				window.open('./list.html?page1_id=' + id)
			} else if (n == 2) {
				window.open('./list.html?page2_id=' + id)
			} else if (n == 3) {
				window.open('./list.html?page3_id=' + id)
			}
		},
		// 查看更多
		handelMore: function() {
			var isMore = true
			if (isMore) {
				isMore = false
				this.loading = true
				this.recommendMsg.data.page += 1
				getHomePageDisplayDetail(vm.recommendMsg).then(function(res) {
					if (res.info == 10) {
						isMore = true
						if (vm.recommendMsg.data.page >= res.data.total) {
							vm.hideMore = false
						}
						vm.loading = false
						var data = res.data.rows
						for (var i in data) {
							data[i].f_SalesPrice = data[i].f_SalesPrice.toFixed(2)
							data[i].f_OriginalPrice = data[i].f_OriginalPrice.toFixed(2)
							vm.recommendData.push(data[i])
						}
					}
				})
			}
		}
	}
});


function openComtiy(id) {
	window.open('./list.html?page1_id=' + id.id);
}

function openScendComtiy(id) {
	window.open('./list.html?page2_id=' + id.id);
}

// 轮播图点击事件
function openBannerComtiy(id) {
	window.open('./list.html?page3_id=' + id.id);
}

function bannerRun(countRun) {
	jq('.banner-wheel-run').stop().animate({
		left: -countRun * 100 + '%'
	}, 500);
}
var div = document.querySelector('.page-hover');
// var divList = document.querySelectorAll('.page-hover div');

function moveClass(id) {

	var divList = document.querySelectorAll('.page-hover div')

	for (var i = 0; i < divList.length; i++) {
		divList[i].style.display = "none";
	}
	div.style.display = "block";
	divList[id].style.display = "block";
}

function display(id) {

	var divList = document.querySelectorAll('.page-hover div')

	divList[id].style.display = "block";
	div.style.display = "block";

}

function displayNone(id) {

	var divList = document.querySelectorAll('.page-hover div')

	divList[id].style.display = "none";
	div.style.display = "none";
}

function outClass(id) {

	var divList = document.querySelectorAll('.page-hover div')

	divList[id].style = "none";
	div.style.display = "none";
}


jq('#nextCommodity').click(function() {
	jq('.commodity-container-run').stop().animate({
		left: -1 * 100 + '%'
	}, 500);
})
jq('#prevCommodity').click(function() {
	jq('.commodity-container-run').stop().animate({
		left: 0 * 100 + '%'
	}, 500);
})

