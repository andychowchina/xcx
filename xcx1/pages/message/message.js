// pages/publicTw/publicTw.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var queryQuestion = host + 'wxMessages/queryMessageCountByType.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleText: '消息',
    navH: "",
    userCode: "",
    page: 0,
    size: 10,
    approvalList: 0,
    requestList: 0,
    commentList: 0,
    qdt: {title: '首页'},//客服的标题

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalDatas.navHeight,
      userCode: app.globalDatas.userCode
    })
  },

  /**
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#buttomMenu").getMessageList(this.data.userCode); //组件的id
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMessagesList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //弹出提示信息
  alertInfo: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 1000
    })
  },
  // 点击客服
  onOpenContact: function () {
    console.log("点击客服",app.QDTracker.click)
    app.QDTracker.click();
  },
  //跳转到消息详情
  bindToDetail: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.number;
    var userCode = that.data.userCode;
    // 查看是否授权
    var execute_function = function () {
      wx.navigateTo({
        url: '../message_approved/message_approved?userid=' + userCode + '&type=' + type,
      })
    };
    app.lookGetSettig(execute_function);
  },
  //获取是否有新消息
  getMessagesList: function () {
    let that = this;
    let userId = that.data.userCode;
    wx.request({
      method: 'GET',
      url: queryQuestion,
      header: {
        'content-type': 'application/json'
      },
      data: {
        userId: userId
      },
      success: function (res) {
        console.log("res", res)
        if (res.statusCode == 200) {
          if (res.data.errcode != 0) {
            //如果数据加载失败，则提示
            setTimeout(function () {
              if (!!userId) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'fail',
                  duration: 1000
                });
                return;
              } else {
                wx.showToast({
                  title: "您当前尚未登录",
                  icon: 'fail',
                  duration: 1000
                });
                return;
              }
            }, 3000)
          }
          var result = res.data.result;
          console.log("result", result)
          for (var i = 0; i < result.length; i++) {
            if (result[i].MESSAGE_TYPE == "1") {
              that.setData({
                approvalList: result[i].M_COUNT
              })
            } else if (result[i].MESSAGE_TYPE == "2") {
              that.setData({
                requestList: result[i].M_COUNT
              })
            } else {
              that.setData({
                commentList: result[i].M_COUNT
              })
            }
          }
        }
      },
      fail: function (res) {
        that.alertInfo("调用接口失败");
      }
    })
  },
  openContact() {
    var that = this;
    // 查看是否授权
    var execute_function = function () {
      that.setData({
        contactType: 'contact'
      });
    };
    app.lookGetSettig(execute_function);
  },
  //滚动到底部触发事件
  onReachBottom: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  jumpQuiz: function () {
    var that = this;
    wx.navigateTo({
      url: '../quiz/quiz?informationClassId=' + that.data.informationClassId + '&question=' + that.data.question
    })
  },
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})