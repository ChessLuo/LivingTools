///mob 似乎官方已不维护接口
var mobApi = {
  baseUrl: "https://apicloud.mob.com/v1/postcode/",
  myKey: "2820369744a80",
  codeToQuery: function (code) { //邮编查询地址
    return this.baseUrl + "query?key=" + this.myKey + "&code=" + code;
  },
  getAllCity: function () { //获取全国城市数据
    return this.baseUrl + "pcd?key=" + this.myKey;
  },
  queryCityCode: function (pid, cid, did) { //根据城市id查邮编
    return this.baseUrl + "search?key=" + this.myKey + "&pid=" + pid + "&cid=" + cid + "&did=" + did;
  }
}


///聚合
var juheApi = {
  baseUrl: "https://v.juhe.cn/",
  historyTodayKey: "aa3dfdafa21aca58a1b9ebb2cba4fdf7",
  //历史上的今天列表
  queryHistoryEvent: function (date) { //date格式：date=1/1
    return this.baseUrl + "todayOnhistory/queryEvent.php?key=" + this.historyTodayKey + "&date=" + date;
  },
  //历史上的今天详情
  queryHistoryDetail: function (e_id) { //e_id
    return this.baseUrl + "todayOnhistory/queryDetail.php?key=" + this.historyTodayKey + "&e_id=" + e_id;
  }

}


///阿凡达
var afdApi = {
  baseUrl: "https://api.avatardata.cn/",
  postNumberKey: "d8432cffde064a5cb2457e2ed6d4b564",
  historyTodayKey:"d003d3fc520d45098d61099f7b187036",
  mobilePlaceKey:"bb3a4ed484d44ab8b64e8c72e4a16dc0",
  jokeKey:"359174b6cb4e463aa3415efdbe0182fa",
  //根据邮编查地址
  CodeToQuery: function (postnumber, page, rows) { 
    return this.baseUrl + "/PostNumber/QueryPostnumber?key=" + this.postNumberKey + "&&postnumber=" + postnumber + "&page=" + page + "&rows=" + rows;
  },
  //根据城市address查邮编
  QueryCityCode: function (address, page, rows) { 
    return this.baseUrl + "PostNumber/QueryAddress?key=" + this.postNumberKey + "&address=" + address + "&page=" + page + "&rows=" + rows;
  },
  //历史上的今天
  //type数据类型，1：国内国际大事件，2：民间事件包含部分国家大事件
    GetHistoryToday: function(type,yue,ri, page, rows) { 
      return this.baseUrl + "HistoryToday/LookUp?key=" + this.historyTodayKey + "&type=" + type+ "&yue=" + yue + "&ri="+ri+"&page=" + page + "&rows=" + rows;
    },
    //号码归属地
  GetMobilePlace: function (mobileNumber){
    return this.baseUrl + "MobilePlace/LookUp?key=" + this.mobilePlaceKey + "&mobileNumber=" + mobileNumber;
  },
  //笑话大全-最新笑话
  QueryJokeByTime: function (page, rows){
    return this.baseUrl + "Joke/NewstJoke?key=" + this.jokeKey + "&page=" + page + "&rows=" + rows;
  },

}


///RollApi
var rollApi = {
  baseUrl: "https://www.mxnzp.com",
  appid:"xxx",
  appsecret:"xxx",
  //笑话大全-最新笑话 https://www.mxnzp.com/api/jokes/list?page=3
  QueryJokeByPage: function (page) {
    return this.baseUrl + "/api/jokes/list?page=" + page+"&app_id="+this.appid+"&app_secret="+this.appsecret;
  },

}


var storageKey = {

}

module.exports = {
  mobApi: mobApi,
  juheApi: juheApi,
  afdApi: afdApi,
  rollApi: rollApi,
  storageKey: storageKey
}