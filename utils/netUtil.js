/**
 * get请求
 * url
 * doSuccess 成功回调方法
 * doFail 失败回调方法
 */
function getRequest(url,message, doSuccess, doFail){
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
    success: function (res) {
      wx.hideLoading();
      doSuccess(res.data);
    },
    fail: function (res) {
      wx.hideLoading();
      doFail(res);
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
function postRequest(url, message, params, doSuccess, doFail){
  wx.showLoading({
    title: message,
    mask: true
  });
  wx.request({
    url: url,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    data: params,
    method: 'POST',
    success: function (res) {
      wx.hideLoading();
      doSuccess(res.data);
    },
    fail: function () {
      wx.hideLoading();
      doFail();
    },
  })
}

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest
}