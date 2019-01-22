var api = require("../../request/api.js");
var validate = require("../../lib/validate.js");

// pages/reg/reg.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		//登录状态，用于更换显示的页面
		regState: 1,
		//手机号格式校验
		isPhone: 0,
		//手机号
		phone:"",
		//验证码
		code:"",
		//是否同意协议
		isAgree:0,
		//验证码格式校验
		isCode:0,
		//密码
		password:"",
		//重复密码
		re_password:""
		
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 处理输入框的输入事件
	 */
	dealInput: function(e) {
		var value = e.detail.value;
		var key = e.target.dataset.key;
		var dict = {};
		dict[key] = value;
		
		//校验手机号格式
		if(key == "phone"){
			if (validate.checkMobile(value) && this.data.isAgree) {
				this.setData({
					isPhone:1
				})
			}else{
				this.setData({
					isPhone:0
				})
			}
		}
		
		//校验验证码格式
		if(key == "code"){
			if (validate.checkCode(value)) {
				this.setData({
					isCode:1
				})
			}else{
				this.setData({
					isCode:0
				})
			}
		}
		
		
		this.setData(dict);
		
	},
	
	/**
	 * 复选框变化处理
	 */
	dealCheckbox:function(e){
		if(e.detail.value.length > 0){
			this.setData({
				isAgree:1
			})
		}else{
			this.setData({
				isAgree:0
			})
		}
		
		if (validate.checkMobile(this.data.phone) && this.data.isAgree) {
			this.setData({
				isPhone:1
			})
		}else{
			this.setData({
				isPhone:0
			})
		}
	},

	/**
	 * 处理获取验证码按钮的点击
	 */
	getCode: function(e) {
		var signupUrl = api.signupUrl;
		var self = this;
		wx.request({
			url: signupUrl,
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
					wx.showToast({
						title: "验证码是:"+res.data.data.code,
						icon: 'success',
						duration: 1000,
						mask: true
					});
					
					self.setData({
						regState:2
					})
				}else{
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
	 * 验证码验证的方法
	 */
	dealSendCode:function(){
		var signupCheckUrl = api.signupCheckUrl;
		var self = this;
		wx.request({
			url: signupCheckUrl,
			method: "POST",
			data: {
				"mobile": this.data.phone,
				"code":this.data.code
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success(res) {
				if(res.data.status == 1){
					wx.showToast({
						title: "验证成功",
						icon: 'success',
						duration: 1000,
						mask: true
					});
					
					self.setData({
						regState:3
					})
				}else{
					wx.showToast({
						title: '验证码错误',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
			},
			fail() {
		
				wx.showToast({
					title: '验证码错误',
					icon: 'none',
					duration: 1000,
					mask: true
				})
			}
		});
	},
	
	/**
	 * 真正的注册
	 */
	dealSingup:function(){
		if(!validate.checkPassword(this.data.password,6,20)){
			wx.showToast({
				title: "密码格式错误",
				icon: 'success',
				duration: 1000,
				mask: true
			});
			return
		}
		
		if(this.data.password != this.data.re_password){
			wx.showToast({
				title: "两次输入的密码不一致",
				icon: 'success',
				duration: 1000,
				mask: true
			});
			return
		}
		
		var signupSetPasswordUrl = api.signupSetPasswordUrl;
		wx.request({
			url: signupSetPasswordUrl,
			method: "POST",
			data: {
				"mobile": this.data.phone,
				"code":this.data.code,
				"password":this.data.password
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success(res) {
				if(res.data.status == 1){
					wx.showModal({
						title: "提示",
						content: "注册成功，是否跳转到登录界面",
						success(res) {
							if (res.confirm) {
								console.log("确定");
								wx.navigateTo({
									url: "/pages/login/login"
								});
							}
						}
					})
				}else{
					wx.showToast({
						title: '注册失败',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
			},
			fail() {
		
				wx.showToast({
					title: '注册失败',
					icon: 'none',
					duration: 1000,
					mask: true
				})
			}
		});
			
	},

	/**
	 * 页面输入的时候
	 */

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
