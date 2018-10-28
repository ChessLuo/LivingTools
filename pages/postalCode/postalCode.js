// pages/article/article.js
var app = getApp();
var netRequest = require("../../utils/netUtil.js");
var constant = require("../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabsPosition:0,                               //标签切换
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    provId: '',                                                     //省ID
    cityId: '',                                                     //市ID
    areaId: '',                                                     //区ID
    addressName:'点击-选择-城市',                        //当前地址
    showRightPopup: false,
    shareData: {
      title: '生活全能通',
      desc: '这里有天气预报、邮编查询，后续更新功能正在完善中。。。',
      path: 'pages/postalCode/postalCode'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = constant.mobApi.getAllCity();
    netRequest.getRequest(url, "加载中..", that.requestSuccess, that.requestFail);

    
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
    return this.data.shareData
  },

  onChange(event) {
    var that = this;
    var index = event.detail.index;
    that.setData({
      tabsPosition:index
    });
    console.log("切换到标签"+index);
  },
  //网络请求全国邮编城市成功
  requestSuccess: function (data) {
    var that = this;
    console.log("网络请求成功：" + data.retCode);
    if(data.retCode == 200){
        that.setData({
          allData: data,
          provArr: data.result,                                       //省数组
          cityArr: data.result[0].city,                               //市数组
          areaArr: data.result[0].city[0].district,                   //区数组

        });    

    }else{
      app.showModal1(data.msg);
    }

  },
  requestFail: function (res) {
    console.log("网络请求失败：" + res);
  },
  //三级联动触发方法
  bindChange: function (e) {
    let val = e.detail.value
    let allData = this.data.allData;
    console.log('bindChange前:', val);
    if (val[0] != this.data.value[0]) {
      val = [val[0], 0, 0]
    }
    if (val[1] != this.data.value[1]) {
      val = [val[0], val[1], 0]
    }
    let thatProvince = allData.result[val[0]];
    let thatCityArray = thatProvince.city;
    let thatAreaArray = thatProvince.city[val[1]].district;
    console.log('bindChange后:', val);
    this.setData({
      value: val,
      cityArr: thatCityArray,
      areaArr: thatAreaArray,
    })
  },

  //打开省市区三级联动
  openPickerView() {
    this.setData({ showPickerView: true });
  },
  //关闭省市区三级联动
  closePickerView() {
    this.setData({ showPickerView: false });
  },

  //省市区三级联动确定
  confirmPickerView() {
    let val = this.data.value;
    let allData = this.data.allData;
    let provName = allData.result[val[0]].province;
    let cityName = allData.result[val[0]].city[val[1]].city;
    let areaName = allData.result[val[0]].city[val[1]].district[val[2]].district;
    let addressName = provName + cityName + areaName;
    let provId = allData.result[val[0]].id;
    let cityId = allData.result[val[0]].city[val[1]].id;
    let areaId = allData.result[val[0]].city[val[1]].district[val[2]].id;
    this.setData({
      addressName: addressName,
      provId: provId,
      cityId: cityId,
      areaId: areaId,
      showPickerView: false,
    })
    console.log(provId+""+cityId+""+areaId);
  },
  //输入邮编。。。
  postNumInput:function(e){
    this.setData({
      postNumInputStr: e.detail.value
    })
  },
  //查询按钮点击事件
  queryCityClick:function(){
    let that = this;
    let provId = that.data.provId;
    let cityId = that.data.cityId;
    let areaId = that.data.areaId;
    let postNumInputStr = that.data.postNumInputStr;//邮编
    let tabsPosition = that.data.tabsPosition;
    if (tabsPosition==0){//城市查邮编
      if (app.isBlank(provId) || app.isBlank(cityId)) {
        app.showModal1("请点击选择要查询的城市地址！");
        return
      }
      //根据省市区id查询邮编
      that.setData({
        postalCodeList: ''//每次赋值 先清空数据
      });
      let url = constant.mobApi.queryCityCode(provId, cityId, areaId);
      netRequest.getRequest(url, "查询中..", that.queryCitySuccess, that.queryCityFail);

    } else if (tabsPosition==1){//邮编查城市
      if (app.isBlank(postNumInputStr)){
        app.showModal1("请输入邮编！");
        return
      }
      that.setData({
        postalCodeList: ''//每次赋值 先清空数据
      });
      let url1 = constant.mobApi.codeToQuery(postNumInputStr);
      netRequest.getRequest(url1, "查询中..", that.postNumSuccess, that.postNumFail);
    }
    

  },
  //根据省市区id查询邮编成功
  queryCitySuccess: function (data) {
    var that = this;
    console.log("网络请求成功：" + data.retCode);
    if (data.retCode == 200) {
      that.setData({
        postalCodeList: data.result
      });
      setTimeout(function(){
        that.toggleRightPopup();
      },500);

    } else {
      app.showModal1(data.msg);
    }

  },
  queryCityFail: function (res) {
    app.showModal1("网络请求失败,请重试！");
  },

  //根据邮编查城市
  postNumSuccess: function (data) {
    var that = this;
    console.log("网络请求成功：" + data.retCode);
    if (data.retCode == 200) {
      var list = 'postalCodeList[0]';
      that.setData({
        [list]: data.result,
      });

      setTimeout(function () {
        that.toggleRightPopup();
      }, 500);

    } else {
      app.showModal1(data.msg);
    }

  },
  postNumFail: function (res) {
    app.showModal1("网络请求失败,请重试！");
  },
  /**
   * 右侧弹窗
   */
  toggleRightPopup: function () {
    this.setData({
      showRightPopup: !this.data.showRightPopup
    });
  },
  
  //复制邮编
  copyPostNumClick:function(e){
    var p = e.currentTarget.dataset.post;
    wx.setClipboardData({
      data:p,
      success:function(res){
        app.toastTips("复制成功");
      }
    });
  },

})