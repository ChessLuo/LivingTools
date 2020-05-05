// miniprogram/pages/joke/joke.js
var app = getApp();
var netRequest = require("../../utils/netUtil.js");
var constant = require("../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList:null,//总列表数据

    totalCount: 0,//总个数
    totalPage:1,//总页数
    limitSize: 10,
    pageIndex: 1,//当前页数
    isPullDownRefresh: false,//是否正在刷新
    isHiddenLoadingMore: true,//是否隐藏“加载更多”
    isAppendProList: false,//是否拼接更多

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.initData();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    app.showLoading("加载中..");
    that.setData({
      isPullDownRefresh: true,
      pageIndex: 1,
      isHiddenLoadingMore: true,//是否隐藏“加载更多”
      isAppendProList: false,
    });

    that.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var pageIndex = that.data.pageIndex;
    var totalCount = that.data.totalCount;
    var limitSize = that.data.limitSize;
    if (pageIndex * limitSize > totalCount) {//没有更多了
      if (recordTotal > 10) {//需要大于10条商品才显示
        that.setData({
          isHiddenLoadingMore: false
        });
      }
      return
    }
    that.setData({
      pageIndex: pageIndex + 1,
      isAppendProList: true
    });
    that.initData();
  },

  // 停止刷新
  stopRefresh: function (text) {
    var that = this;
    if (that.data.isPullDownRefresh) {
      wx.stopPullDownRefresh({
        complete(res) {
          setTimeout(function () {
            wx.hideLoading();
            app.toastTips1(text, 1500);
          }, 1000);
          that.setData({
            isPullDownRefresh: false
          });
        }
      });
    }
  },

  ///初始化数据
  initData:function(){
    var that = this;
    let pageIndex = that.data.pageIndex;
    // let pageSize = that.data.pageSize;
    var queryJokeByPage = constant.rollApi.QueryJokeByPage(pageIndex);
    netRequest.getRequest(queryJokeByPage, "加载中..", function (res) {
      var str = JSON.stringify(res); //json对象转换成字符串
      console.log("url=" + queryJokeByPage+"\n初始化数据:" + str);
      /**
       * 
{
  "code": 1,
  "msg": "数据返回成功！现已提供app_id方式请求接口，不限速，不限流，不封IP，可在自建服务器调用api，欢迎升级使用，后续将慢慢取代直接使用接口的方式，详情请访问：https://github.com/MZCretin/RollToolsApi#%E8%A7%A3%E9%94%81%E6%96%B0%E6%96%B9%E5%BC%8F",
  "data": {
    "page": 1,
    "totalCount": 51059,
    "totalPage": 5106,
    "limit": 10,
    "list": [
      {
        "content": "孔子东游，见两小儿辩日，一个说：“太阳刚出的时候大，中午的时候小，所以中午太阳更高。”一个说：“太阳刚出的时候冷，中午的时候热，所以早晨太阳更高。”他们问孔子谁说的对，孔子微微一笑，答道：“不要问我太阳有多高，我会告诉你我有多真。”",
        "updateTime": "2020-01-15 23:59:08"
      }
    ]
  }
}
       */
      if (res.code == 1) {
        let contentList = [];
        if (that.data.isPullDownRefresh){
          that.setData({
            contentList: [],
          });
        }
        if (that.data.isAppendProList) {//是否拼接已有的列表，加载分页需要拼接
          contentList = that.data.contentList
        }
        for (var i = 0; i < res.data.list.length; i++) {
          contentList.push(res.data.list[i]);
        }

        that.setData({
          contentList: contentList,
          totalCount: res.data.totalCount,//总个数
          totalPage: res.data.totalPage,
          limitSize: res.data.limitSize 
        });
        that.stopRefresh("刷新完成");

      } else {
        app.showModal1(res.reason)
        that.stopRefresh("刷新失败");
      }

    }, null);
  },

  ///item点击事件
  itemClick:function(e){
    var that = this;
    let index = e.currentTarget.id;
    let dataset = e.currentTarget.dataset;
    let contentList = that.data.contentList;
    let contentStr = dataset.content;
    console.log(contentStr+"");

    wx.setClipboardData({
      data: contentStr,
      success: function (res) {
        app.toastTips1('复制成功',2000);
      }
    })

  },

  
})