// pages/publicTw/publicTw.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var queryQuestion = host + 'wxInformationCollect/myCollectInfors.do?authType=show';
const updateInformationById = require('../../config').updateInformationById;
var addDtUrlTwo = host + 'wxTopicClass/queryTopicClassList.do?authType=show';
// var queryInfoList = host + 'wxInformation/queryInformationLists.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informationClassId: '', //资讯分类
    question: '', //检索问题关键字
    questionList: [], //后期请求返回数据
    isFromSearch: true,   // 用于判断smallService数组是不是空数组，默认true，空的数组
    page: 0,//第几次请求
    size: 10,//一次请求返回的数据量
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    all: true,
    titleText: '关注问题',
    userCode: '',
    attationList: [],
    myAttation:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalDatas.navHeight,
      userCode: options.userid
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
    this.getQuestionList();
  },

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
  //获取关注问题集合
  getQuestionList: function () {
    let that = this;
    let page = that.data.page;
    let size = that.data.size;
    let userId = that.data.userCode;
    var attation = that.data.myAttation;
    wx.request({
      method: 'GET',
      url: queryQuestion,
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: page,
        size: size,
        userId: userId
        // classId:4
      },
      success: function (res) {
        if (res.data.errcode == '0') {
          var result = res.data.result.content;
          if (result.length > 0) {
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = result : searchList = attation.concat(result)
            that.setData({
              myAttation: searchList, //设置数据数组
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false
            });
            // if (attation.length < size) {
            //   that.setData({
            //     searchLoadingComplete: false
            //   });
            // } 
            that.localAttation(searchList);
          } else {
            that.setData({
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
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    that.setData({
      page: page + 1,
      isFromSearch:false
    });
    that.getQuestionList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 0,
      myAttation: []
    })
    that.getQuestionList();
  },
  jumpQuiz: function () {
    var that = this;
    wx.navigateTo({
      url: '../quiz/quiz?informationClassId=' + that.data.informationClassId + '&question=' + that.data.question
    })
  },
  //关注问题
  clickHandle(e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    const list = that.data.attationList;
    app.updateInfo(e, function () {
      list[index].isAttation = (list[index].isAttation === 'Y') ? 'N' : 'Y';
      that.setData({
        attationList: list
      });
    });
  },
  //存储关注列表
  localAttation: function (commentList) {
    var attationList = [];
    for (var i = 0; i < commentList.length; i++) {
      var local = {
        isAttation: "Y"
      }
      attationList.push(local);
    }
    this.setData({
      attationList: attationList,
    })
  },
  bindToDetail: function (e) {
    var articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dynamicInfo/dynamicInfo?articleId=' + articleId,
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