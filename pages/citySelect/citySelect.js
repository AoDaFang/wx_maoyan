var api = require("../../request/api.js");
// pages/citySelect/citySelect.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
		//全部城市
		cts:[],
		
		//热门城市
		hot: [],
		
		//分组后的城市
		group:[],
		
		//最近访问的城市
		history:[],
		
		
		//页面跳转位置的id
		scrollId:"location",
		
		//定位情况数据
		/*
			0 - 没有开始丁文
			1 - 开始定位
			2 - 定位成功
			3 - 定位失败
		*/
		locationState:1,
		
		//定位获取到的城市的信息
		loacationCity:{}
		
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function (options) {
		//判断是否有Storage存留城市信息，若有则不再请求
		if(wx.getStorageSync("Maoyan_citys")){
			this.setData({
				cts:wx.getStorageSync("Maoyan_citys"),
				hot:wx.getStorageSync("Maoyan_hot")
			})
			this.dealCityGroup();
			this.startLocation();
		}else{
			this.downLoadCityData();
		}
    },
	
	/**
	 * 下载城市列表的函数
	 */
	downLoadCityData:function(){
		//开始下载城市数据
		var self = this;
		var CityUrl = api.cityListUrl;
		wx.request({
			url: CityUrl,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function(res) {
				self.setData({
					cts: res.data.cts,
					hot: res.data.hot
				});
				
				//将请求下来的数据进行存储
				wx.setStorageSync("Maoyan_citys", res.data.cts);
				wx.setStorageSync("Maoyan_hot", res.data.hot);
				
				//调用城市分组函数
				self.dealCityGroup();
				self.startLocation();
			}
		})
	},
	
	/**
	 * 城市分组函数
	 */
	dealCityGroup:function(){
		var citys = [];
		if(wx.getStorageSync("Maoyan_citys")){
			citys = wx.getStorageSync("Maoyan_citys")
		}else{
			citys = this.data.cts 
		}
		var group = [];
		
		// 首先生成大轮廓(不包括城市列表的数据)
		for(var i=0; i<26; i++){
			var b = String.fromCharCode(65+i);
			var s = String.fromCharCode(97+i);
			
			group.push({
				b:b,
				s:s,
				list:[]
			});
		}
		
		//将城市放入对应的列表中
		for(var i=0; i<citys.length; i++){
			var frist = citys[i].py.charAt(0);
			
			//根据第一个字符计算, 来确定城市属于group数组中的第几个
		    //  a 0     0=97-97
		    //  b 1     1=98-97
		    //  c 2     2=99-97
			var index = frist.charCodeAt(0) - 97;
			group[index].list.push(citys[i]);
			
		}
		this.setData({
			group:group
		});
		
	},
	
	/**
	 * 获取位置信息的函数
	 */
	startLocation:function(){
		var self = this;
		
		//调用微信获取定位的方法，得到经纬度
		wx.getLocation({
			type:"wgs84",
			success(res){
				var latitude = res.latitude;//纬度
				var longitude = res.longitude;//经度
				
				//获取完经纬度之后，用经纬度获取城市信息
				self.getCurrentCity(longitude,latitude)
			},
			fail:function(){
				self.setData({
					locationState:3
				})
			}
		})
	},
	
	/**
	 * 用百度的接口，根据经纬度，获取城市信息
	 */
	getCurrentCity:function(longitude,latitude){
		var self = this;
		var url =  "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location=" + latitude + "," + longitude + "&output=json&pois=0"
		wx.request({
			url:url,
			header:{
				'content-type': 'application/json' // 默认值
			},
			success:function(res){
				self.setData({
					locationState:2
				})
				//截取字符串
				var dataString = res.data.substring("renderReverse&&renderReverse(".length,res.data.length - 1);
				var data_data = JSON.parse(dataString);
				var result_city = data_data.result.addressComponent.city;
				
				var loacationCity_Nm = result_city.substring(0,result_city.length-1);
				//根据返回的城市名称，查找原数据中的城市信息
				var findCity = null;
				for(var i = 0;i<self.data.cts.length; i++){
					if(self.data.cts[i].nm == loacationCity_Nm){
						findCity = self.data.cts[i];
						self.setData({
							loacationCity:findCity  //将查找到的城市放入data数据中
						});
						
						break;
					}
				}
			},
			fail:function(){
				self.setData({
					locationState:3
				})
			}
		})
	},
	
	/**
	 * 定位失败调用
	 */
	dealFail:function(){
		this.setData({
			locationState:1
		})
		this.startLocation();
	},
	
	/**
	 * 处理跳转的语句
	 */
	dealNav:function(e){
		this.setData({
			scrollId : e.currentTarget.dataset.id
		})
	},
	
	/**
	 * 当点击城市的名字的时候进行的处理
	 */
	dealSelectCity:function(e){
		//因为在生成wxml的时候，已经把每个城市的信息存入了按钮中，所以调用的时候直接将信息调用出来
		var selected_city = e.currentTarget.dataset.item;
		//设置storage,把选择的城市存起来，以便其他页面使用
		wx.setStorageSync("Maoyan_selectCity", selected_city);
		
		var history_citys = this.data.history;
		
		//开始处理历史城市
		for(var i = 0; i<history_citys.length; i++){
			//如有重复则删除后面的那个数据
			if(history_citys[i].nm == selected_city.nm){
				history_citys.splice(i,1);
				break;
			}
		}
		
		history_citys.unshift(selected_city);//先将这个城市插入到列表的头部
		
		if(history_citys.length > 6){
			history_citys.pop();
		}
		
// 		//将新的列表存入页面数据
// 		this.setData({
// 			history:history_citys
// 		});
		
		//将信息存入stronge中
		wx.setStorageSync("Maoyan_historyCity",history_citys);
		//回跳一步页面
		wx.navigateBack({
		  delta: 1
		});
	},
	
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		var history_citys = wx.getStorageSync("Maoyan_historyCity");
		if(history_citys){
			this.setData({
				history:history_citys
			});
		}
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})