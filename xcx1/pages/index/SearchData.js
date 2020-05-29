var app = getApp();
const queryRecommendInformations = require('../../config').queryRecommendInformations;
function getRecommend(pageindex, callbackcount, callback) {
  wx.request({
    url: queryRecommendInformations ,
    data: {
      userId: app.globalDatas.userCode,
      page:pageindex,
      size:callbackcount,
      isHoPage:true,
      inforClassId: ""
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
    },
    success(res) {
      //var msg = res.data.msg;
      //console.log(msg);
      if (res.data.errcode == 0) {
        callback(res.data.result);
      }else{
        //弹窗提示
        wx.showModal({
          title: '提示',
          content: res.data.msg
          //success(res) {
           // if (res.confirm) {
            //  console.log('用户点击确定')
            //} else if (res.cancel) {
            //  console.log('用户点击取消')
            //}
          //}
        })
      }
    }
  })
}

module.exports = {
  getRecommend: getRecommend
  //getDynamic: getDynamic
}