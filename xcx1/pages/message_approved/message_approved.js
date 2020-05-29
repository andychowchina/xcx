// pages/publicTw/publicTw.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var requestList = host + 'wxMessages/queryMessagePageByAnswer.do?authType=show';
var commentList = host + 'wxMessages/queryMessagePageByComment.do?authType=show';
var praiseList = host + 'wxMessages/queryMessagePageByPraise.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleText: '消息',
    navH: "",
    userCode: "",
    message: "",
    page: 0,
    size: 111111,
    myMessageList: [],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    url: "",
    isFromSearch: true,
    linkUrl: "",
    options:'' //调用load时用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options: options
    })
    if (options.type == "0") {
      that.setData({
        message: "赞同",
        url: praiseList,
        linkUrl: '../userComment/userComment'
      })
    } else if (options.type == "1") {
      that.setData({
        message: "回答",
        url: requestList,
        linkUrl: '../dynamicInfo/dynamicInfo'
      })
    } else {
      that.setData({
        message: "评论",
        url: commentList,
        linkUrl: '../userComment/userComment'
      })
    }
    var userCode = options.userCode ? options.userCode : app.globalDatas.userCode;
    that.setData({
      navH: app.globalDatas.navHeight,
      userCode: userCode
    })
  },

  /**
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.getMessageList();
    that.onLoad(that.data.options);
  },
  // getMessagesList: function () {
  //   let that = this;
  //   let userId = that.data.userCode;
  //   wx.request({
  //     method: 'GET',
  //     url: queryQuestion,
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     data: {
  //       userId: userId
  //     },
  //     success: function (res) {
  //       console.log("res",res)
  //       if (res.statusCode == 200) {
  //         if (res.data.errcode != 0) {
  //           //如果数据加载失败，则提示
  //           setTimeout(function(){
  //             if (!!userId) {
  //               wx.showToast({
  //                 title: res.data.msg,
  //                 icon: 'fail',
  //                 duration: 1000
  //               });
  //               return;
  //             } else {
  //               wx.showToast({
  //                 title: "您当前尚未登录",
  //                 icon: 'fail',
  //                 duration: 1000
  //               });
  //               return;
  //             }
  //           },3000)
  //         }
  //         var result = res.data.result;
  //         for (var i = 0; i < result.length; i++){
  //           if (result[i].MESSAGE_TYPE == "1") {
  //             that.setData({
  //               approvalList: result[i].M_COUNT
  //             })
  //           } else if (result[i].MESSAGE_TYPE == "2") {
  //             that.setData({
  //               requestList: result[i].M_COUNT
  //             })
  //           } else {
  //             that.setData({
  //               commentList: result[i].M_COUNT
  //             })
  //           }
  //         }
  //       }
  //     },
  //     fail: function (res) {
  //       that.alertInfo("调用接口失败");
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

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
  //获取消息集合
  getMessageList: function () {
    let that = this;
    let userId = that.data.userCode;
    var page = that.data.page;
    var size = that.data.size;
    var url = that.data.url;
    var myMessageList = that.data.myMessageList;
    var random = Math.random()
    wx.request({
      method: 'GET',
      url: url,
      data: {
        page: page,
        size: size,
        userId: userId,
        random:random
      },
      success: function (res) {
        console.log("res",res)
        if (res.statusCode == 200) {
          if (res.data.errcode != 0) {
            //如果数据加载失败，则提示
            wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              duration: 1000
            });
            return;
          }
          var result = res.data.result.content;
          if (result.length > 0) {
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = result : searchList = myMessageList.concat(result);
            searchList.map((num, index, result) => {
              result[index].CREATE_TIME = app.changeDate(result[index].CREATE_TIME);
              if (result[index].TYPE == "pl") {
                result[index].TYPE = "评论";
                that.setData({
                  linkUrl:'../userComment/userComment'
                })
              } else if (result[index].TYPE == "hd") {
                result[index].TYPE = "回答";
                that.setData({
                  linkUrl: '../dynamicInfo/dynamicInfo'
                })
              } else {
                result[index].TYPE = "回复";
                that.setData({
                  linkUrl: '../userComment/userComment'
                })
              }
            })
            that.setData({
              myMessageList: searchList, //设置数据数组
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false
            });
          } else {
            that.setData({
              //myMessageList:[],
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false
            });
          }
        }
      },
      fail: function (res) {
        that.alertInfo("调用接口失败");
      }
    })
  },
  //滚动到底部触发事件
  // onReachBottom: function () {
  //   var that = this;
  //   var page = that.data.page;
  //   that.setData({
  //     page: page + 1,
  //     isFromSearch: false
  //   });
  //   that.getMessageList();
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   var that = this;
  //   that.setData({
  //     page: 0,
  //     myMessageList: []
  //   })
  //   that.getMessageList();
  // },
  bindToDetail: function (e) {
    var articleId = e.currentTarget.dataset.infoid;
    var showMessageId = e.currentTarget.dataset.showmessageid;
    var plid = e.currentTarget.dataset.plid;
    var linkUrl = this.data.linkUrl;
    wx.navigateTo({
      url: linkUrl + '?commentId=' + plid + '&showMessageId=' + showMessageId + '&articleId=' + articleId,
    })
  },
  // bindToDetail: function (e) {
  //   var articleId = e.currentTarget.dataset.infoid;
  //   // var articleId = e.currentTarget.dataset.plid;
  //   var commentId = e.currentTarget.dataset.showmessageid;
  //   var linkUrl = this.data.linkUrl;
  //   console.log("articleId",articleId)
  //   console.log("commentId",commentId)
  //   // return
  //   wx.navigateTo({
  //     url: '../allAnswer/allAnswer?commentId=' + commentId + '&articleId=' + articleId
  //   })
  // },
  navBack: function () {
    // wx.navigateBack();
    wx.reLaunch({
      url: '../message/message',
    })
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})