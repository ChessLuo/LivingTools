// miniprogram/pages/history-detail/history-detail.js
var app = getApp();
var netRequest = require("../../utils/netUtil.js");
var constant = require("../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    e_id:"",
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.e_id = options.e_id;
    this.doGetDetail();
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
   * 监听图片点击
   */
  onPicTap: function () {
    const pics = this.data.detail.picUrl;
    const urls = pics.map(item => item.url);
    wx.previewImage({
      urls
    })
  },

  /**
   * 执行获取详情
   */
  doGetDetail: function () {
    let that = this;
    var queryHistoryDetail = constant.juheApi.queryHistoryDetail(that.e_id);
    netRequest.getRequest(queryHistoryDetail, "加载中..", function (res) {
      var str = JSON.stringify(res); //json对象转换成字符串
      console.log("url=" + queryHistoryDetail + "\n初始化数据:" + str);
      /**
       * 
{
  "reason": "success",
  "result": [
    {
      "e_id": "608",
      "title": "汉文帝刘恒出生",
      "content": "在2221年前的今天，前203年1月15日 (农历冬月廿六)，汉文帝刘恒出生",
      "picNo": "1",
      "picUrl": [
        {
          "pic_title": "汉文帝刘恒与窦皇后、慎夫人画像",
          "id": 1,
          "url": "http://images.juheapi.com/history/608_1.jpg"
        }
      ]
    }
  ],
  "error_code": 0
}
       */
      if (res.error_code == 0) {

        that.setData({
          detail: res.result[0]
        });

      } else {
        app.showModal1(res.reason)
      }

    }, null);


  },

  /**
   * 监听用户分享
   */
  onShareAppMessage: function (res) {
    const detail = this.data.detail;
    return {
      title: `${detail.title}`,
      path: `/pages/history-detail/history-detail?id=${this.id}`
    }

  }


 

 
})