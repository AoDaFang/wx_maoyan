var api = require("../../request/api.js");
// pages/movie/movie.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showIndex: 1,
		movieOnInfoList:[],//正在热映
		mostExperted:[],//受期待
		comingList:[],//即将到来
		selectedCity:{nm:"北京"}
	},

	dealChange: function(e) {
		var tag = e.currentTarget;
		var index = tag.dataset.index;

		this.setData({
			showIndex: index
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this;
		//即将上映的信息获取
		var movieOnInfoListUrl = api.movieOnInfoListUrl;
		wx.request({
			url:movieOnInfoListUrl,
			data:{
				
			},
			header:{
				'content-type': 'application/json' // 默认值
			},
			success(res){
				var list = res.data.movieList;
				for(var item of list){
					item.img = item.img.replace("w.h","128.180");
				}
				self.setData({
					movieOnInfoList:list
				})
			}
		});
		
		//最受期待的获取
		var mostExpectedUrl = api.mostExpectedUrl;
		wx.request({
			url:mostExpectedUrl,
			header:{
				'content-type': 'application/json' // 默认值
			},
			success(res){
				var list = res.data.coming;
				for(var item of list){
					item.img = item.img.replace("w.h","128.180");
				}
				for(var item of list){
					item.comingTitle = item.comingTitle.split(" ")[0];
				}
				self.setData({
					mostExperted:list
				})
			}
		});
		
		//即将上映的获取
		var comingListUrl = api.comingListUrl;
		wx.request({
			url:comingListUrl,
			header:{
				'content-type': 'application/json' // 默认值
			},
			success(res){
				var list = res.data.coming;
				for(var item of list){
					item.img = item.img.replace("w.h","128.180");
				}
				self.setData({
					comingList:list
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		//每次页面显示都去获取一下当前选择的城市
		var now_city = wx.getStorageSync("Maoyan_selectCity");
		if(now_city){
			this.setData({
				selectedCity:now_city
			})
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
