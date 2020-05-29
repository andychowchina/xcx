import tool from "../../tool.js";
var app = getApp();
var host = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
const getPassUr = require('../../config').getPassUr;
Page({

  /**
var queryInformationByTitleUrl = host + 'wxInformation/queryInformationByTitle.do?authType=show';
const getPassUr = require('../../config').getPassUr;
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
    listDataCopy: [],
    resultObj: [],// 所有title的处理结果
    result: [],// 当前title的处理结果
    titleObj: [],// 所有title的集合，需处理的值
    i: 0,// 初始查询第一个title，索引值为0
    all: true,
    courselLists: [],
    titleText: '搜索',
    host: serviceManagerUrl,
    bigService: [],
    smallService: [],
    searchTitle: '',
    win_scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var searchTitle = options.searchTitle ? options.searchTitle : "";
    this.setData({
      informationClassId: options.informationClassId,
      navH: app.globalDatas.navHeight,
      searchTitle: searchTitle
    })
    if (searchTitle != "") {
      this.setData({
        question: searchTitle
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCourselList();
    var that = this;
    var inforClassId = that.data.inforClassId;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      page: 0,
      size: 10,
      dtList: [],
      searchLoading: true,
      searchLoadingComplete: false,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    //上拉分页,将页码加1，然后调用分页函数loadRoom()
    var that = this;
    var page = that.data.page;
    that.setData({
      page: ++page,
      searchLoading: false,
      searchLoadingComplete: false
    });
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      that.getCourselList();
      wx.hideLoading();
    }, 500);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  question: function (e) {
    var that = this;
    this.setData({
      question: that.trim(e.detail.value),
      page: 0,   //第一次加载，设置1
      questionList: [],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    });
    this.getCourselList();
  },
  setTitle(key,name){
    return {
      key, name
    }
  },
  //获取咨询集合
  getCourselList: function () {
    let that = this;
    var dataList;
    if (that.data.question == "") {
      dataList = {
        page: that.data.page,
        size: that.data.size
      }
    } else {
      dataList = {
        page: that.data.page,
        size: that.data.size,
        title: that.data.question
      }
    }
    wx.request({
      method: 'POST',
      url: getPassUr,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: dataList,
      success(res) {
        if (res.data.errcode == 0) {

          let result = res.data.result.content;
          let searchList = [];
          //如果searchLoading是true从data中取出数据，否则先从原来的数据继续添加
          that.data.searchLoading ? searchList = result : searchList = that.data.courselLists.concat(result);
          if (result.length > 0) { //如果有数据
  
            var value = that.data.question;
            var data = searchList;
            //将标题已关键字拆开成数组
            that.data.resultObj = []; that.data.result = [];
            that.data.i = 0; that.data.titleObj = [];
            that.data.all = !value;
            for (let i = 0; i < data.length; i++) {
              that.data.titleObj.push(data[i].title);
            }
            searchList.map((item,idx) =>{
              item.titleT = that.setTitle(that.data.question,item.title);
              item.addTime = app.changeDate(item.addTime);
            });
            if (!!value) {
              searchList.forEach((item, index, arr) => {
                item.title = that.data.resultObj[index];
              })
            }
            that.setData({
              courselLists: searchList, //获取数据数组
              searchLoading: true
            });
            if (that.data.courselLists.length < that.data.size) {
              that.setData({
                searchLoading: false,
                searchLoadingComplete: true
              });
            }
          } else {
            that.setData({
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏
            });
          }
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      page: 0,
      size: 10,
      courselLists: [],
      searchLoading: true,
      searchLoadingComplete: false,
    })
    wx.showLoading({
      title: '加载中',
    });
    that.getCourselList();
    setTimeout(function () {
      wx.hideLoading();
    }, 500);
    wx.stopPullDownRefresh();
  },
  jumpQuiz: function () {
    var that = this;
    wx.navigateTo({
      url: '../quiz/quiz?informationClassId=' + that.data.informationClassId + '&question=' + that.data.question
    })
  },
  handleEmpty: function () {
    var that = this;
    that.setData({
      question: ""
    })
  },
  // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  bindToDetail: function (e) {
    var articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dynamicInfo/dynamicInfo?articleId=' + articleId,
    })
  },
  bindTocourselDetail: function (e) {
    var articleId = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../webView/webView?url=' + url + '&articleId=' + articleId,
    })
  },
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  onPageScroll: tool.throttle(function (msg) {
    this.setData({
      win_scrollTop: msg[0].scrollTop
    });
  }),
  gotoUnlock: tool.debounce(function () {
    this.saveUserInfo();
  }),
  saveUserInfo: function () {
    //console.log("正在防抖和节流啊！");
  }
})