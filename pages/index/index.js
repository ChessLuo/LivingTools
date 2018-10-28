// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: ["今天", "明天", "后天"],
    isRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.getLocation();
    that.setData({
      isRefresh:true
    });
  },
  //通过微信，获取当前经纬度
  getLocation: function () {
    var that = this;
    //显示加载动画
    app.showLoading("加载中..");
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude //纬度
        var longitude = res.longitude //经度
        console.log("纬度经度 lat:" + latitude + " lon:" + longitude)
        //调用天气查询
        that.getWeatherInfo(latitude, longitude);
      },
      fail: function (e) {
        wx.hideLoading();
        app.showModal1("获取当前位置失败");
      },
      complete:function(){
        if (that.data.isRefresh){
          that.setData({
            isRefresh:false
          });
          setTimeout(function(){
            wx.stopPullDownRefresh();
          },1000);
        }
      }
    })
  },
  //通过和风天气接口，获取天气情况
  getWeatherInfo: function (latitude, longitude) {
    var that = this;
    var keyV = '01a7798b060b468abdad006ea3de4713';//你自己的key
    //需要在微信公众号的设置-开发设置中配置服务器域名
    var url = 'https://free-api.heweather.com/s6/weather';
    wx.request({
      url: url,
      data: {
        key: keyV,
        location: longitude + ',' + latitude
      },
      success: function (res) {
        wx.hideLoading();
        console.log("最新天气========：" + JSON.stringify(res))
        //当前城市
        var currCity = res.data.HeWeather6[0].basic.parent_city;
        //当前位置
        var currLocation = res.data.HeWeather6[0].basic.location;
        //现在天气情况
        var nowTmp = res.data.HeWeather6[0].now.tmp;//温度
        var condTxt = res.data.HeWeather6[0].now.cond_txt;//天气状况
        var lifeBrf = res.data.HeWeather6[0].lifestyle[0].brf;//生活指数简介
        var lifeType = res.data.HeWeather6[0].lifestyle[0].type;//生活指数类型
        var lifeTypeTxt = "";
        if (lifeType == "comf") {//舒适度
          lifeTypeTxt = "";
        } else if (lifeType == "cw") {
          lifeTypeTxt = "洗车";
        } else if (lifeType == "drsg") {
          lifeTypeTxt = "穿衣";
        } else if (lifeType == "flu") {
          lifeTypeTxt = "感冒";
        } else if (lifeType == "sport") {
          lifeTypeTxt = "运动";
        } else if (lifeType == "trav") {
          lifeTypeTxt = "旅游";
        } else if (lifeType == "uv") {
          lifeTypeTxt = "紫外线";
        } else if (lifeType == "air") {
          lifeTypeTxt = "空气";
        }
        var nowHum = res.data.HeWeather6[0].now.hum;//相对湿度
        var nowfl = res.data.HeWeather6[0].now.fl;//体感温度
        var windDir = res.data.HeWeather6[0].now.wind_dir;//风向
        var windSc = res.data.HeWeather6[0].now.wind_sc;//风力
        var dailyForecast = res.data.HeWeather6[0].daily_forecast;
        var updateTime = res.data.HeWeather6[0].update.loc; //更新时间
        var hour = updateTime.substring(11, 13); //更新时间截取小时

        //设置数据
        that.setData({
          currCity: currCity,
          currLocation: currLocation,
          nowTmp: nowTmp,
          condTxt: condTxt,
          lifeType: "★" + lifeTypeTxt + lifeBrf,
          hum: nowHum,
          fl: nowfl,
          windDir: windDir,
          windSc: windSc,
          dailyForecast: dailyForecast,
          updateTime: hour

        })

      },
      fail: function (res) {
        wx.hideLoading();
      }

    });

    //隐藏加载动画
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },


})