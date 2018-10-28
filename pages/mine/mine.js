// pages/mine/mine.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserLogin: false,
    userInfo: {}, //用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断小程序的API，回调，参数，组件等是否在当前版本可用。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        isUserLogin: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          isUserLogin: true
        })
      }

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            isUserLogin: true
          })
        }
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //授权登录
  toAuthorize: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      that.setData({
        userInfo: e.detail.userInfo,
        isUserLogin: true
      })

    } else {
      //用户按了拒绝按钮
      that.setData({
        isUserLogin: false
      });
    }

  },
  //关于
  aboutClick:function(){
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  //点击有奖
  prizeClick:function(){
    app.showModal1("洗洗睡吧，哈哈！");
  },

  //更多设置
  moreSettingClick:function(){
    app.showModal1("由于最近比较忙，更多功能，敬请关注！");
  },

})