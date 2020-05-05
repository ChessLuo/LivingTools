// miniprogram/pages/historyToday/historyToday.js
var app = getApp();
var netRequest = require("../../utils/netUtil.js");
var constant = require("../../utils/data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: 2020,
    month: 1,
    day: 1,
    list: [],
    currentDate: Date.now(),
    lang: 'zh_CN',
    dataValue: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.setData({
      year,
      month,
      day
    });
    this.doGetList();
    wx.showShareMenu({
      withShareTicket: true
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

  },


  /**
   * 监听日期选择
   */
  onDataConfirm: function (e) {
    const { index, mode } = e.currentTarget.dataset
    let value = e.detail.value;//["2020","1","15"]
    let label = e.detail.label;//2020-01-15
    console.log(`监听日期选择`, value)
    const year = value[0];
    const month = parseInt(value[1])+1+"";
    const day = value[2];
    this.setData({
      year,
      month,
      day
    });
    this.doGetList();

  },


  /**
   * 监听用户分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '快来看看历史上的今天发生的事件',
      path: '/pages/todayTistory/todayTistory'
    }
  },

  /**
   * 执行数据获取
   */
  doGetList: function () {
    var that = this;
    const {
      month,
      day
    } = that.data;
    
    var queryHistoryEvent = constant.juheApi.queryHistoryEvent(month+"/"+day);
    netRequest.getRequest(queryHistoryEvent, "加载中..", function (res) {
      var str = JSON.stringify(res); //json对象转换成字符串
      console.log("url=" + queryHistoryEvent + "\n初始化数据:" + str);
      /**
       * 
{
  "reason": "success",
  "result": [
    {
      "day": "1/15",
      "date": "1971年01月15日",
      "title": "阿明通过政变当上乌干达总统",
      "e_id": "647"
    },
    {
      "day": "1/15",
      "date": "1971年01月15日",
      "title": "埃及阿斯旺水坝正式起用",
      "e_id": "648"
    }
  ],
  "error_code": 0
}
       */
      if (res.error_code == 0) {
        
        that.setData({
          list: res.result
        });

      }else{
        app.showModal1(res.reason)
      }

    }, null);
    
  }



})