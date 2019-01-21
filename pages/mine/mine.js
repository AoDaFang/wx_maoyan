var api = require("../../request/api.js");

// pages/mine/mine.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showIndex: 1,
		
		// 需要从输入框获取的信息
		//账号密码登录的账号
		account: "",
		//账号密码登录的密码
		accountPassword: "",
		//短信登录的手机号
		phone: "",
		//手机号登录的时候正则校验是否成功
		isPhone: 0,
		//手机号登录的验证码，
		code:""
	},
	
	//上方选项卡的切换
	dealChange: function(e) {
		var tag = e.currentTarget;
		var index = tag.dataset.index;

		this.setData({
			showIndex: index
		});
	},
	/**
	 * 账号密码登录的账号获取
	 */
	dealAccount: function(e) {
		this.setData({
			account: e.detail.value,
		})
	},
	/**
	 * 账号密码输入的密码获取
	 */
	dealAccountPassword: function(e) {
		this.setData({
			accountPassword: e.detail.value,
		});
	},

	/**
	 * 账号密码登录的请求
	 */
	accountLogin: function() {
		var accountLoginUrl = api.userPasswordLoginUrl;
		var account = this.data.account;
		var accountPassword = this.data.accountPassword;
		wx.request({
			url: accountLoginUrl,
			method: "POST",
			data: {
				"mobile": account,
				"password": accountPassword
			},
			header: {
				// 'content-type': 'application/json' ,// 默认值
				'content-type': 'application/x-www-form-urlencoded'
			},
			success(res) {

				if (res.data.status == 1) {
					wx.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1000,
						mask: true
					})
				} else {
					wx.showToast({
						title: '登录失败',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
				// 登录成功后的跳转
				// 				wx.redirectTo({
				// 					url: 'mineDetail'
				// 				})
			},
			fail() {

				wx.showToast({
					title: '登录失败',
					icon: 'none',
					duration: 1000,
					mask: true
				})
			}
		});
	},

	/**
	 * 手机号码登录的手机号
	 */
	dealPhone: function(e) {
		//验证手机号的正则表达式
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

		if (myreg.test(e.detail.value)) {
			this.setData({
				isPhone: 1
			})
		} else {
			this.setData({
				isPhone: 0
			})
		}

		this.setData({
			phone: e.detail.value
		})
	},
	
	/**
	 * 从输入框中获取验证码
	 */
	dealCode:function(e){
		this.setData({
			code:e.detail.value
		})
	},
	
	/**
	 * 获取手机验证码的方法
	 */
	getCode: function() {
		var mobileLoginCodeUrl = api.mobileLoginCodeUrl;
		
		wx.request({
			url: mobileLoginCodeUrl,
			method: "POST",
			data: {
				"mobile": this.data.phone,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success(res) {
				if(res.data.status == 1){
					console.log("验证码是" + res.data.data.code);
				}else{
					console.log("手机号没有注册");
				}
				
				
				if (res.data.status == 1) {
					wx.showToast({
						title: '短信发送成功',
						icon: 'success',
						duration: 1000,
						mask: true
					})
				} else {
					wx.showToast({
						title: '获取验证码失败',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
			},
			fail() {

				wx.showToast({
					title: '获取验证码失败',
					icon: 'none',
					duration: 1000,
					mask: true
				})
			}
		});
	},
	
	/**
	 * 手机验证码登录
	 */
	
	PhoneLogin:function(){
		var userMobileLoginUrl = api.userMobileLoginUrl;
		
		wx.request({
			url: userMobileLoginUrl,
			method: "POST",
			data: {
				"mobile": this.data.phone,
				code:this.data.code
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success(res) {
				console.log(res)
				if (res.data.status == 1) {
					wx.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1000,
						mask: true
					})
				} else {
					wx.showToast({
						title: '登录失败',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
			},
			fail() {
		
				wx.showToast({
					title: '登录失败',
					icon: 'none',
					duration: 1000,
					mask: true
				})
			}
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
