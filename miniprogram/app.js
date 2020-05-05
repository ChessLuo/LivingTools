//app.js
App({
  onLaunch: function () {
    var that = this;
    // 小程序启动之后 触发
    that.globalData.sysinfo = wx.getSystemInfoSync();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log("获取code1：" + res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          that.toastTips3('当前无网络', 2000);
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            // that.goStartIndexPage()
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });


    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        that.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          that.globalData.Custom = capsule;
          that.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          that.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })


  },

  getModel: function () { //获取手机型号
    return this.globalData.sysinfo["model"]
  },
  getWxVersion: function () { //获取微信版本号
    return this.globalData.sysinfo["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function () { //获取客户端基础库版本
    return this.globalData.sysinfo["SDKVersion"]
  },

  //toast提示
  toastTips: function (txt) {
    wx.showToast({
      title: txt,
      duration: 3000
    })
  },
  //toast提示，可以设置等待时长
  toastTips1: function (txt, time) {
    wx.showToast({
      title: txt,
      duration: time
    })
  },
  toastTips2: function (txt) {
    wx.showToast({
      title: txt,
      icon: "loading"
    })
  },
  toastTips3: function (txt, time) {
    wx.showToast({
      title: txt,
      icon: "loading",
      duration: time
    })
  },
  toastTips4: function (txt, time) {
    time = time == undefined ? 3000 : time;
    wx.showToast({
      title: txt,
      icon: "none",
      duration: time
    })
  },


  //弹窗提示
  showModal: function (txt) {
    wx.hideLoading();
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: false,
    })
  },
  //弹窗提示,有确认按钮
  showModal1: function (txt) {
    wx.hideLoading();
    wx.showModal({
      title: "提示",
      content: txt,
      showCancel: false,
      confirmText: "确定"
    })
  },
  // 弹窗提示，并执行回调
  showModal2: function (txt, call) {
    wx.hideLoading();
    wx.showModal({
      title: txt,
      showCancel: false,
      success: res => {
        call(res);
      }
    })
  },

  /**
   *  弹窗提示,可自定义标题和内容，并执行回调
   * 回调成功后，如果res.cancel=true则点击了“取消”，如果res.confirm=true则点击了“确定”
   */
  showModal3: function (title, content, call) {
    wx.hideLoading();
    wx.showModal({
      title: title,
      content: content,
      success: res => {
        call(res);
      }
    })
  },

  /**
   *  弹窗提示,可自定义标题和内容，并执行回调
   * 没有取消
   */
  showModal4: function (txt, content, call) {
    wx.hideLoading();
    wx.showModal({
      title: txt,
      content: content,
      showCancel: false,
      success: res => {
        call(res);
      }
    })
  },

  //获取当前经纬度
  getLocation: function (callSuccess, callFail) {
    var that = this
    wx.getLocation({
      success(res) {
        let longitude = res.longitude; //经度
        let latitude = res.latitude;
        callSuccess(longitude, latitude);
      },
      fail(res) {
        callFail(res);
      }

    })
  },

  //弹窗显示需要授权当前位置
  showAuthDialog: function (locationCall) {
    var that = this;
    that.showModal4(
      "请授权当前位置",
      "需要获取您的地理位置，请确认授权，否则附近商家功能将无法使用",
      function (res) {
        wx.openSetting({
          success: function (data) {
            if (data.authSetting["scope.userLocation"] == true) {
              //再次授权，调用getLocationt的API
              locationCall();
            } else {
              that.toastTips('授权失败');
            }
          }
        })
      }
    );
  },

  //loading
  showLoading: function (txt) {
    wx.hideLoading();
    wx.showLoading({
      title: txt,
      mask: true
    });
  },

  isBlank: function (str) {
    if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
      return true
    } else if (
      Object.prototype.toString.call(str) === '[object String]' ||
      Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
      return str.length == 0 ? true : false
    } else if (Object.prototype.toString.call(str) === '[object Object]') {
      return JSON.stringify(str) == '{}' ? true : false
    } else {
      return true
    }

  },
  // 模态询问
  showConfirm: function (txt, callSuccess, callCancel) {
    wx.showModal({
      title: "温馨提示",
      content: txt,
      success: function (res) {
        if (res.confirm) {
          if (callSuccess) callSuccess(res);
        } else if (res.cancel) {
          if (callCancel) callCancel(res);
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    sysinfo: null,
    newsNavID: null,//
    isConnected: true, // 网络是否连接
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  },
  // 获取用户token
  getUserToken: function () {
    var UserToken = wx.getStorageSync('UserToken');
    if (UserToken == "" || UserToken == null || UserToken == undefined) {
      //this.showModal("啊噢，请在会员中心登录！");
      return "";
    }
    return UserToken;
  },




})