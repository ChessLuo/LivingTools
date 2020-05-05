// pages/home/home.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的二维码',
    opacity: '0.6',
    width: '70',
    position: 'center',
    //
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'cloud://super-tool-zsml20151127.7375-super-tool-zsml20151127-1301061658/img/banner/banner3.png',
      detailUrl: "https://7375-super-tool-zsml20151127-1301061658.tcb.qcloud.la/img/gzh/gzh3.jpg?sign=f80679fcb551e81a9af18ceaa6a8f643&t=1578320626"
    }, {
      id: 1,
      type: 'image',
      url: 'cloud://super-tool-zsml20151127.7375-super-tool-zsml20151127-1301061658/img/banner/banner4.png',
      detailUrl: "https://7375-super-tool-zsml20151127-1301061658.tcb.qcloud.la/img/gzh/gzh1.jpg?sign=c1fdfa022f6d28afd05bdb01d7e812d9&t=1578320915"
    }, {
      id: 1,
      type: 'image',
      url: 'cloud://super-tool-zsml20151127.7375-super-tool-zsml20151127-1301061658/img/banner/banner5.png',
      detailUrl: "https://7375-super-tool-zsml20151127-1301061658.tcb.qcloud.la/img/gzh/gzh3.jpg?sign=f80679fcb551e81a9af18ceaa6a8f643&t=1578320626"
    }],


    appList: [{
        id:0,
        icon: 'light',
        color: 'cyan',
        isOpen: true,
        name: '天气预报'
      }, 
      {
        id:1,
        icon: 'mail',
        color: 'olive',
        isOpen: true,
        name: '邮编查询'
      }, 
      
      {
        id: 2,
        icon: 'phone',
        color: 'blue',
        isOpen: true,
        name: '号码归属'
      }, {
        id: 3,
        icon: 'emoji',
        color: 'purple',
        isOpen: true,
        name: '每日一笑'
      }, {
        id: 4,
        icon: 'questionfill',
        color: 'mauve',
        isOpen: true,
        name: '历史上的今天'
      },
      {
        id: 5,
        icon: 'cardboardfill',
        color: 'red',
        isOpen: true,
        name: '九宫格切图'
      }
      // {
      //   icon: 'cardboardfill',
      //   color: 'red',
      //     isOpen: false,
      //   name: '二维码扫描'
      // }, {
      //   icon: 'recordfill',
      //   color: 'orange',
      //     isOpen: false,
      //   name: '二维码生成'
      // }
    ],

    appListPlus: [
    {
        id: 0,
        icon: 'mobile',
        color: 'yellow',
        isOpen: true,
        name: '蓝牙调试'
      },
      {
        id: 1,
        icon: 'wefill',
        color: 'pink',
        isOpen: true,
        name: 'NFC读卡器'
      },
      {
        id: 2,
        icon: 'subscription',
        color: 'brown',
        isOpen: true,
        name: 'WIFI扫描'
      }
    // ,{
    //   icon: 'recordfill',
    //   color: 'orange',
    //   isOpen: false,
    //   name: '图片拼接'
    // }, {
    //   icon: 'picfill',
    //   color: 'yellow',
    //   isOpen: false,
    //   name: '图片加水印'
    // }, {
    //   icon: 'noticefill',
    //   color: 'olive',
    //   isOpen: false,
    //   name: '头像加帽子'
    // }, {
    //   icon: 'upstagefill',
    //   color: 'cyan',
    //   isOpen: false,
    //   name: '头像加V'
    // }, {
    //   icon: 'clothesfill',
    //   color: 'blue',
    //   isOpen: false,
    //   name: '头像加国旗'
    // }, {
    //   icon: 'discoverfill',
    //   color: 'purple',
    //   isOpen: false,
    //   name: '透明头像'
    // }, {
    //   icon: 'questionfill',
    //   color: 'mauve',
    //   isOpen: false,
    //   name: '透明昵称'
    // }, {
    //   icon: 'commandfill',
    //   color: 'purple',
    //   isOpen: false,
    //   name: '测测颜值'
    // }
    ],
    gridCol: 3, //宫格列数
    gridBorder: true, //显示宫格边界
    dotStyle: true, //指示器类型，true为square-dot，false为round-dot


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  //控制轮播图放大缩小
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper切换监听
  cardSwiper(e) {
    // console.log("轮播：" + e.detail.current);
    this.setData({
      cardCur: e.detail.current
    })
  },
  //swiper点击事件
  swiperItemClick: function(e) {
    let that = this;
    console.log("swiper点击事件:" + JSON.stringify(e.currentTarget.id));
    let index = e.currentTarget.id;
    console.log(that.data.swiperList[index].detailUrl);
    var url;
    that.showQrcode(that.data.swiperList[index].detailUrl);
  },


  //appList宫格应用列表点击事件
  appListClick: function(e) {
    var that = this;
    let id = e.currentTarget.id;
    console.log("id====" + id);
    if (id == 0) { //天气预报
      wx.navigateTo({
        url: '/pages/weather/index'
      });
    } else if (id == 1) { //邮编查询
      wx.navigateTo({
        url: '/pages/postalCode/postalCode'
      });
    } else if (id == 2) { //号码归属
      wx.navigateTo({
        url: '/pages/mobilePlace/mobilePlace'
      });
      
    } else if (id == 3) { //每日一笑
      wx.navigateTo({
        url: '/pages/joke/joke'
      });

    } else if (id == 4) { //历史上的今天
      wx.navigateTo({
        url: '/pages/historyToday/historyToday'
      });

    } else if (id == 5) { //九宫格切图
      wx.navigateTo({
        url: '/pages/grid-crop/grid-crop'
      });
      
    } else {
      app.showModal1("功能开发中，敬请期待！");
    }

  },

  //appListPlus宫格应用列表点击事件
  appListPlusClick: function(e) {
    var that = this;
    console.log("id====" + JSON.stringify(e));
    let id = e.currentTarget.id;
    if (id == 0) { //蓝牙调试工具
      that.navigateToBlueTool();

    } else if (id == 1) { //nfc读卡器
      wx.navigateTo({
        url: '/pages/nfc/nfc'
      });

    } else if (id == 2) { //WiFi扫描
      wx.navigateTo({
        url: '/pages/wifi/wifi'
      });

    }else {
      app.showModal1("功能开发中，敬请期待！");
    }

  },

  //跳转到蓝牙BLE调试工具
  navigateToBlueTool: function() {
    console.log("准备跳转到蓝牙BLE调试工具");
    wx.navigateToMiniProgram({
      appId: 'wx54d497a8dd210ed9',
      success(res) {
        // 打开成功
        console.log("打开成功");
      },
      fail(e) {
        console.log("打开失败" + JSON.stringify(e));
      }
    })
  },


  showQrcode(url) {
    // 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。url需要预览的图片链接列表。2.2.3 起支持云文件ID。
    wx.previewImage({
      urls: [url],
      current: url // 当前显示图片的http链接      
    })
  }



})