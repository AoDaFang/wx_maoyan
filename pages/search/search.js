var api = require("../../request/api.js")
// pages/search/search.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		keyword: "",
		movies: [],
		cinemas: [],
		totalMovies:0,
		totalCinemaes:0
	},
	/**
	 * 搜索框文字改变时的处理函数
	 */
	dealChange: function(e) {
		var keyword = e.detail.value;
		this.setData({
			keyword: keyword
		});
		var self = this;
		var url = api.searchUrl;

		wx.request({
			url: url,
			data: {
				kw: keyword,
				stype: -1
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function(res) {
				console.log(res);
				var movieList = res.data.movies.list;
				var cinemaList = res.data.cinemas.list;
				
				//原网页只有3个数据，切分数据
				if(movieList.length>3){
					movieList = movieList.slice(0,3)
				}
				if(cinemaList.length>3){
					cinemaList = cinemaList.slice(0,3)
				}
				
				var totalMovies = res.data.movies.total;
				var totalCinemaes = res.data.cinemas.total;
				for (var item of movieList) {
					item.img = item.img.replace("w.h", "128.180")
				}
				self.setData({
					movies:movieList,
					cinemas:cinemaList,
					totalMovies:totalMovies,
					totalCinemaes:totalCinemaes
				})
			}
		})
	},
	/**
	 * 搜索框叉号处理
	 */
	dealClose:function(){
		this.setData({
			keyword: ""
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

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
