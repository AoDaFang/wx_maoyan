var api = require("../../request/api.js");
var validate = require("../../lib/validate.js");

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
	 * 获取输入框的内容，并储存到data中(进行短信验证中手机号的正则验证)
	 */
	dealInput:function(e){
		//input框的当前值
		var value = e.detail.value
		//input的data-key中存储的信息
		var key = e.currentTarget.dataset.key;
		var dict = {};
		dict[key] = value;
		
		//如果是手机号，则进行正则判断,用于短信验证码登录的按钮样式转换
		if(key == "phone"){
			if(validate.checkMobile(value)){
				this.setData({
					isPhone:1
				})
			}else{
				this.setData({
					isPhone:0
				})
			}
		}
		//将输入框的值设置到data中
		this.setData(dict);
	},

	/**
	 * 账号密码登录的请求
	 */
	accountLogin: function() {
		
		var account = this.data.account;
		var accountPassword = this.data.accountPassword;
		
		/**
		 * 开始对输入信息进行格式校验
		 */
		//账号格式校验，此处账号以手机号为例
		if(!validate.checkMobile(account)){
			//弹出提示框
			wx.showModal({
				title:"提示",
				content:"您输入的手机号格式有误，请重新输入",
				showCancel:false,//不显示取消
				success(res){
					if(res.confirm){
						console.log("确定")
					}
				}
			})
			
			return;//直接返回，不向下继续执行
		}
		//校验密码格式
		if(!validate.checkPassword(accountPassword,6,20)){
			//弹出提示框
			wx.showModal({
				title:"提示",
				content:"您输入的密码格式有误，请重新输入",
				showCancel:false,//不显示取消
				success(res){
					if(res.confirm){
						console.log("确定")
					}
				}
			})
			
			return;//直接返回，不向下继续执行
		}
		
		
		//数据验证通过，开始发送请求
		var accountLoginUrl = api.userPasswordLoginUrl;
		wx.request({
			url: accountLoginUrl,
			method: "POST",
			data: {
				"mobile": account,
				"password": accountPassword
			},
			header: {
				// 'content-type': 'application/json' ,// 默认值
				'content-type': 'application/x-www-form-urlencoded'//需要修改
			},
			success(res) {
				console.log(res)
				if (res.data.status == 1) {//登录成功
					//弹框提示登录成功
					wx.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1000,
						mask: true
					});
					//存储必要的信息
					wx.setStorageSync("Maoyan_isLogin",1);//登录成功信息
					wx.setStorageSync("Maoyan_user",res.data.data);//用户信息
					//成功后的跳转
					wx.switchTab({
						url:"/pages/mine/mine"
					})
					
				} else {//登录失败
					wx.showModal({
						title: '提示',
						content: '用户名或密码错误,请重新登录',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								console.log('确定')
							}
						}
					})
				}
			},
			fail() {//登录失败
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
	 * 发送请求获取手机验证码的方法
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
					wx.showToast({
						title: "验证码是:"+res.data.data.code,
						icon: 'success',
						duration: 1000,
						mask: true
					})
				}else{
					console.log("手机号没有注册");
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
		var code = this.data.code;
		//对验证码的格式进行验证
		if(!validate.checkCode(code)){

			wx.showModal({
				title: '提示',
				content: '验证码必须为4位数字 ',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						console.log('确定')
					}
				}
			})

			return
		}
		
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
					});
					//存储必要的信息
					wx.setStorageSync("Maoyan_isLogin",1);//登录成功信息
					wx.setStorageSync("Maoyan_user",res.data.data);//用户信息
					//成功后的跳转
					wx.switchTab({
						url:"/pages/mine/mine"
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
