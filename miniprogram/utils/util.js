//获取当前日期时间，格式为年月日星期时分秒
function getNowDateAndTime() {
  var date = new Date();
  var year = '' + date.getFullYear(); //年
  var month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1); //月
  var day = (date.getDate() < 10 ? '0' : '') + date.getDate(); //日
  var hours = (date.getHours() < 10 ? '0' : '') + date.getHours(); //时
  var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(); //分
  var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(); //秒
  var week = date.getDay(); //星期几
  return year + month + day + week + hours + minutes + seconds;
}

//获取当前日期时间，格式为年月日
//addDayCount 是要推算的天数， -1是前一天，0是今天，1是后一天。
function getNowDate(addDayCount) {
  var date = new Date();
  if(addDayCount==null){
    addDayCount = 0;
  }
  date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期
  var year = '' + date.getFullYear(); //年
  var month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1); //月
  var day = (date.getDate() < 10 ? '0' : '') + date.getDate(); //日
  return year + month + day;
}

/*微信app版本比较*/
function versionCompare(ver1, ver2) {
  var version1pre = parseFloat(ver1)
  var version2pre = parseFloat(ver2)
  var version1next = parseInt(ver1.replace(version1pre + ".", ""))
  var version2next = parseInt(ver2.replace(version2pre + ".", ""))
  if (version1pre > version2pre)
    return true
  else if (version1pre < version2pre)
    return false
  else {
    if (version1next > version2next)
      return true
    else
      return false
  }
}


// 格式化省市区
function formatAddress(add, temp, isMain) {
  // isMain =1 显示省市区，2则为详情地址(不含省市区)，0显示所有
  if (add == null || add == "") return "";
  var arr = add.split("#");
  if (add.length <= 3) {
    return add.replace("#", temp);
  }
  var result = [];
  if (isMain == 1) {
    // 省市区
    arr.splice(3, arr.length - 3);
  } else if (isMain == 2 && add.length > 3) {
    // 除开省市区的明细
    arr.splice(0, 3);
  }
  for (var i = 0; i <= arr.length; i++) {
    result.push(arr[i]);
  }
  return result.join(temp);
}

// 获取当前路径
function getPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route; //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options
  return {
    url: url,
    data: options
  }
}

// 将指定的obj转成url的key&val
function objToUrl(obj) {
  let result = '';
  let arr = Object.entries(obj);
  arr.forEach((item, index) => {
    result += (result == '' ? '' : '&') + item[0] + "=" + item[1];
  });
  return result;
}

// 跳转页面
function goTo(url) {
  if (url.indexOf("backurlType=bar") > -1) {
    wx.switchTab({
      url: url,
    })
  } else {
    wx.navigateTo({
      url: url
    });
  }
}

// 日期格式化
function dateFtt(fmt, date) { //author: meizz   
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3),    
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以 arg2的精确结果
function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return (r1 / r2) * pow(10, t2 - t1);
}

module.exports = {
  getNowDate: getNowDate,
  getNowDateAndTime: getNowDateAndTime,
  versionCompare: versionCompare,
  formatAddress: formatAddress,
  getPageUrl: getPageUrl,
  objToUrl: objToUrl,
  goTo: goTo,
  dateFtt: dateFtt,
  accAdd: accAdd,
  accMul: accMul,
  accDiv: accDiv
}