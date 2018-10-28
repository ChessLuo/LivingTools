

var mobApi = {
  baseUrl: "https://apicloud.mob.com/v1/postcode/",
  myKey:"2820369744a80",
  codeToQuery : function(code){//邮编查询地址
    return this.baseUrl +"query?key="+this.myKey+"&code="+code;
  },
  getAllCity : function(){//获取全国城市数据
    return this.baseUrl +"pcd?key="+this.myKey;
  },
  queryCityCode: function (pid, cid, did){//根据城市id查邮编
    return this.baseUrl + "search?key=" + this.myKey + "&pid=" + pid + "&cid=" + cid + "&did=" + did;
  }

}

module.exports = {
  mobApi: mobApi
}