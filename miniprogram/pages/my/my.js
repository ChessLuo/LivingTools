// pages/my/my.js

var utils = require('../../utils/util.js');
var app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  
  /**
   * 页面的初始数据
   */
  data: {
    visitTotal: "--",
    sharePv: "--",
    shareUv: "--",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(utils.getNowDate(-2));
    console.log(utils.getNowDate(-1));
    console.log(utils.getNowDate());
    console.log(utils.getNowDate(1));
    //调用云函数
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getDailySummary',
        openData: {
          "beginDate": utils.getNowDate(-1),
          "endDate": utils.getNowDate(-1)
        }
      },
      complete: res => {
        console.log('callFunction test result: ', res)
        if(res.result.errCode==0){
          let visitTotal = res.result.list[0].visitTotal;
          let sharePv = res.result.list[0].sharePv;
          let shareUv = res.result.list[0].shareUv;
          //为了好看，这里将x2
          visitTotal = visitTotal*2;
          sharePv = sharePv*2;
          shareUv = shareUv*2;
          that.setData({
            visitTotal: that.coutNum(visitTotal),
            sharePv: that.coutNum(sharePv),//昨日转发次数
            shareUv: that.coutNum(shareUv)
          });
        }else{
          //
          app.showModal1('当前时间暂无法统计昨日数据，请稍后重试！');
        }
      }
    })


    // that.setData({
    //   starCount: that.coutNum(3000),
    //   forksCount: that.coutNum(484),
    //   visitTotal: that.coutNum(24000)
    // })
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

  },



  /**
   * 点击赞赏支持，显示赞赏二维码
   */
  showQrcode() {
    // 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。url需要预览的图片链接列表。2.2.3 起支持云文件ID。
    wx.previewImage({
      urls: ['cloud://super-tool-zsml20151127.7375-super-tool-zsml20151127-1301061658/img/moneyCode.jpg'],
      current: 'cloud://super-tool-zsml20151127.7375-super-tool-zsml20151127-1301061658/img/moneyCode.jpg' // 当前显示图片的http链接      
    })
  },


  /**
   * 计算数目，如果数目大于1000并且小于10000，则缩写用‘k’表示
   * 如果数目大于10000，则用‘W’表示,toFixed(1)保留一位小数
   */
  coutNum(num) {
    if (num > 1000 && num < 10000) {
      num = (num / 1000).toFixed(1) + 'K'
    }
    if (num > 10000) {
      num = (num / 10000).toFixed(1) + 'W'
    }
    return num;
  },

})