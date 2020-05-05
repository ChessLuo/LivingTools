/**
 * get请求
 * url
 * doSuccess 成功回调方法
 * doFail 失败回调方法
 */

function getRequest(url, message, doSuccess, doFail) {
  wx.showLoading({
    title: message,
    mask: true
  });
  wx.request({
    url: url,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'GET',
    success: function(res) {
      wx.hideLoading();
      doSuccess(res.data);
    },
    fail: function(res) {
      wx.hideLoading();
      if (typeof doFail === "function") { //是函数 
        doFail(res);
      }else{
        wx.showModal({
          title: '提示',
          content: '网络加载出错啦',
          showCancel: false,
          success: function (res) {
            //可以做一些统一的回调

          }
        });
      }
      
      
    },
  })

}

/**
 * post请求
 * url
 * params 参数，json格式
 * doSuccess 成功回调方法
 * doFail 失败回调方法
 */
function postRequest(url, message, params, doSuccess, doFail) {
  if (!isBlank(message)) {
    wx.showLoading({
      title: message,
      mask: true
    });
  }
  if (isBlank(params)) {
    wx.request({
      url: url,
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        doSuccess(res.data);
      },
      fail: function() {
        wx.hideLoading();
        if (doFail) {
          doFail()
        } else {
          wx.showModal({
            title: '提示',
            content: '网络加载出错啦',
            showCancel: false,
            success: function(res) {
              //可以做一些统一的回调

            }
          });
        }
      },
    })
  } else {
    wx.request({
      url: url,
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      data: params,
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        doSuccess(res.data);
      },
      fail: function() {
        wx.hideLoading();
        if (doFail) {
          doFail()
        } else {
          wx.showModal({
            title: '提示',
            content: '网络加载出错啦',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //可以做一些统一的回调

              }
            }
          });
        }
      },
    })
  }
}

// 未登录授权，统一提示进行认证(普通会员)
function notAuth() {
  wx.showModal({
    title: '提示',
    content: '很抱歉，用户信息失效请重新登录',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        //统一跳转到登录页面
        // wx.navigateBack({
        //   url: '../../pages/userLogin/userLogin',
        // });
      }
    }
  });
}


function isBlank(str) {
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

}

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest
}