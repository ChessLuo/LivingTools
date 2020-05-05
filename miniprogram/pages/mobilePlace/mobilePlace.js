// miniprogram/pages/mobilePlace/mobilePlace.js
var app = getApp();
var netRequest = require("../../utils/netUtil.js");
var constant = require("../../utils/data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    mobilenumber:"",
    mobilearea: "",
    mobiletype: "",
    areacode: "",
    postcode: "",
    haveData:false,//是否有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    
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


 
  queryData: function (mobileNumber) {
    var that = this;
    var getMobilePlaceUrl = constant.afdApi.GetMobilePlace(mobileNumber);
    netRequest.getRequest(getMobilePlaceUrl, "查询中..", function(res) {
      var str = JSON.stringify(res); //json对象转换成字符串
      console.log("号码归属地查询:" + str);
      /**
       * {
  "result": {
    "mobilenumber": "1316065",
    "mobilearea": "广东 珠海市",
    "mobiletype": "联通预付费卡",
    "areacode": "0756",
    "postcode": "519000"
  },
  "error_code": 0,
  "reason": "Succes"
}
       */
      if (res.error_code==0){
        // app.showModal1(res.result.mobilearea + "\n" + res.result.mobiletype)
        that.setData({
          haveData:true,
          mobilearea: res.result.mobilearea,
          mobiletype: res.result.mobiletype,
          areacode: res.result.areacode,
          postcode: res.result.postcode
        });
      }else{
        app.showModal1(res.reason)
      }

    }, null);
  },

  ///监听输入的号码
  searchNum(e) {
    let mobilenumber = e.detail.value;
    
    this.setData({
      mobilenumber: mobilenumber
    })
  },

  ///查询按钮点击事件
  queryClick: function (event){
    let that = this;
    let mobilenumber = that.data.mobilenumber;
    if (app.isBlank(mobilenumber)) {
      app.showModal1("手机号不能为空");
      return;
    }
    that.queryData(mobilenumber);

  },

  ///软键盘“完成”点击事件
  inputConfirm: function (event){
    let that = this;
    console.log(JSON.stringify(event));
    let mobilenumber = that.data.mobilenumber;
    if (app.isBlank(mobilenumber)) {
      app.showModal1("手机号不能为空");
      return;
    }
    that.queryData(mobilenumber);
  },

  ///复制
  copyClick: function (event){
    let that = this;
    let copyData = "号码归属地：" + that.data.mobilearea+"\n"
      + "号码类型：" + that.data.mobiletype+"\n"
      + "区号：" + that.data.areacode+"\n"
      + "邮编：" + that.data.postcode;
    wx.setClipboardData({
      data: copyData,
      success: function (res) {
        app.toastTips('复制成功');
      }
    })
  },



})