// pages/article/article.js
var app = getApp();
var netRequest = require("../../utils/netUtil.js");
var constant = require("../../utils/data.js");
var aData = require("../../utils/areaData.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    tabsPosition: 0, //标签切换
    showPickerView: false, //控制省市区三级联动显隐
    value: [3, 3, 3],
    provId: '', //省ID
    cityId: '', //市ID
    areaId: '', //区ID
    provName: "",
    cityName: "",
    areaName: "",
    addressName: '点击-选择-城市', //当前地址
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
  onLoad: function(options) {
    var that = this;
    aData.init(that);
    //拿到省市区数据
    var areaData = that.data.areaData;
    // console.log("省："+JSON.stringify(areaData))
    that.setData({
      allData: areaData,
      provArr: areaData, //省数组
      cityArr: areaData[3].cityList, //市数组
      areaArr: areaData[3].cityList[3].areaList, //区数组

    });
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


  onChange(event) {
    var that = this;
    var index = event.detail.index;
    that.setData({
      tabsPosition: index
    });
    console.log("切换到标签" + index);
  },


  //三级联动触发方法
  bindChange: function(e) {
    console.log("三级联动触发方法:" + e)
    let val = e.detail.value
    let allData = this.data.allData;
    console.log('bindChange前:', val);
    if (val[0] != this.data.value[0]) {
      val = [val[0], 0, 0]
    }
    if (val[1] != this.data.value[1]) {
      val = [val[0], val[1], 0]
    }
    let thatProvince = allData[val[0]];
    let thatCityArray = thatProvince.cityList;
    let thatAreaArray = thatProvince.cityList[val[1]].areaList;
    console.log('bindChange后:', val);
    this.setData({
      value: val,
      cityArr: thatCityArray,
      areaArr: thatAreaArray,
    })
  },

  //打开省市区三级联动
  openPickerView() {
    this.setData({
      showPickerView: true
    });
  },
  //关闭省市区三级联动
  closePickerView() {
    this.setData({
      showPickerView: false
    });
  },

  //省市区三级联动确定
  confirmPickerView() {
    let val = this.data.value;
    let allData = this.data.allData;
    let provName = allData[val[0]].name;
    let cityName = allData[val[0]].cityList[val[1]].name;
    let areaName = allData[val[0]].cityList[val[1]].areaList[val[2]].name;
    let addressName = provName + cityName + areaName;
    let provId = allData[val[0]].code;
    let cityId = allData[val[0]].cityList[val[1]].code;
    let areaId = allData[val[0]].cityList[val[1]].areaList[val[2]].code;
    this.setData({
      addressName: addressName,
      provId: provId,
      cityId: cityId,
      areaId: areaId,
      provName: provName,
      cityName: cityName,
      areaName: areaName,
      showPickerView: false,
    })
    console.log(provId + "" + cityId + "" + areaId);
  },
  //输入邮编。。。
  postNumInput: function(e) {
    this.setData({
      postNumInputStr: e.detail.value
    })
  },
  /**
   * 查询按钮点击事件
   */
  queryCityClick: function() {
    let that = this;
    let provId = that.data.provId;
    let cityId = that.data.cityId;
    let areaId = that.data.areaId;
    let provName = that.data.provName;
    let cityName = that.data.cityName;
    let areaName = that.data.areaName;
    let addressName = that.data.addressName;
    let postNumInputStr = that.data.postNumInputStr; //邮编
    let tabsPosition = that.data.tabsPosition;
    ///城市查邮编
    if (tabsPosition == 0) {
      if (app.isBlank(provId) || app.isBlank(cityId)) {
        app.showModal1("请点击选择要查询的城市地址！");
        return
      }
      console.log("城市：" + addressName);
      //根据省市区id查询邮编
      that.setData({
        postalCodeList: '' //每次赋值 先清空数据
      });
      let url = constant.afdApi.QueryCityCode(addressName, 1, 20);
      netRequest.getRequest(url, "查询中..", function(res) {
        console.log("网络请求成功：" + JSON.stringify(res));
        if (res.retCode == 200) {
          that.setData({
            postalCodeList: res.result
          });
          setTimeout(function() {
            that.toggleRightPopup();
          }, 500);

        } else {
          app.showModal1(res.msg);
        }
      }, null);
    }

    ///邮编查城市
    if (tabsPosition == 1) {
      if (app.isBlank(postNumInputStr)) {
        app.showModal1("请输入邮编！");
        return
      }
      that.setData({
        postalCodeList: '' //每次赋值 先清空数据
      });
      let url1 = constant.afdApi.CodeToQuery(postNumInputStr, 1, 50);
      netRequest.getRequest(url1, "查询中..", function(res) {
        var that = this;
        console.log("网络请求成功：" + JSON.stringify(res));
        if (res.retCode == 200) {
          var list = 'postalCodeList[0]';
          that.setData({
            [list]: res.result,
          });

          setTimeout(function() {
            that.toggleRightPopup();
          }, 500);

        } else {
          app.showModal1(res.msg);
        }
      }, null);
    }


  },




  /**
   * 右侧弹窗
   */
  toggleRightPopup: function() {
    this.setData({
      showRightPopup: !this.data.showRightPopup
    });
  },

  //复制邮编
  copyPostNumClick: function(e) {
    var p = e.currentTarget.dataset.post;
    wx.setClipboardData({
      data: p,
      success: function(res) {
        app.toastTips("复制成功");
      }
    });
  },

})