var app = getApp();
var host = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
var queryInformationByTitleUrl = host + 'wxInformation/queryInformationByTitle.do?authType=show';
//服务小类接口
var SMALL_SERVICE = host + 'smallService/selectAllSmallService.do?authType=show';
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
    size: 3,//一次请求返回的数据量
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    listDataCopy: [],
    resultObj: [],// 所有title的处理结果
    result: [],// 当前title的处理结果
    titleObj: [],// 所有title的集合，需处理的值
    i: 0,// 初始查询第一个title，索引值为0
    all: true,
    courselLists: [],
    titleText: '综合搜索',
    host: serviceManagerUrl,
    bigService: [],
    smallService:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      informationClassId: options.informationClassId ? options.informationClassId : "21",
      navH: app.globalDatas.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      that.getQuestionList();
      that.getCourselList();
      that.getSmallService();
      wx.hideLoading();
    }, 1000);
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
    that.getQuestionList();
    that.getCourselList();
    that.getSmallService();
  },
  //获取问题集合
  getQuestionList: function () {
    let that = this;
    let page = that.data.page;
    let size = that.data.size;
    let question = that.data.question;
    wx.request({
      method: 'POST',
      url: queryInformationByTitleUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        page: page,
        size: size,
        informationClassId: that.data.informationClassId,
        title: that.data.question
      },
      success(res) {
        if (res.data.errcode == 0) {
          let result = res.data.result.content;
          if (result.length > 0) { //如果有数据
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = result : searchList = that.data.questionList.concat(result)
            var value = that.data.question;
            var data = searchList;
            //将标题已关键字拆开成数组
            that.data.resultObj = []; that.data.result = [];
            that.data.i = 0; that.data.titleObj = [];
            that.data.all = !value;
            for (let i = 0; i < data.length; i++) {
              that.data.titleObj.push(data[i].TITLE);
            }
            that.search(value, that.data.titleObj[that.data.i], searchList);
            if (!!value) {
              searchList.forEach((item, index, arr) => {
                item.TITLE = that.data.resultObj[index];
              })
            }
            that.setData({
              questionList: searchList, //获取数据数组
              searchLoading: true
            });
            if (that.data.questionList.length < size) {
              that.setData({
                searchLoading: false   //把"上拉加载"的变量设为false，隐藏
              });
            }
          } else {
            //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
            that.setData({
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏
            });
          }
        }
      },
    })
  },
  //获取咨询集合
  getCourselList: function () {
    let that = this;
    var dataList;
    if (that.data.question==""){
      dataList = {
        page: 0,
        size: 2
      }
    }else{
      dataList = {
        page: 0,
        size: 2,
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
          if (result.length > 0) { //如果有数据
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = result : searchList = that.data.courselLists.concat(result)
            var value = that.data.question;
            var data = searchList;
            //将标题已关键字拆开成数组
            that.data.resultObj = []; that.data.result = [];
            that.data.i = 0; that.data.titleObj = [];
            that.data.all = !value;
            for (let i = 0; i < data.length; i++) {
              that.data.titleObj.push(data[i].title);
            }
            that.search(value, that.data.titleObj[that.data.i], searchList);
            if (!!value) {
              searchList.forEach((item, index, arr) => {
                item.title = that.data.resultObj[index];
              })
            }
            searchList.map((res, index) => {
              res.addTime = app.changeDate(res.addTime)
            })
            that.setData({
              courselLists: searchList, //获取数据数组
              searchLoading: true
            });
          } else{
            that.setData({
              courselLists:[]
            })
          }
        }
      }
    })
  },
  //获取服务小类
  getSmallService: function () {
    let that = this;
    let page = that.data.page;
    let size = that.data.size;
    let question = that.data.question
    wx.request({
      method: 'POST',
      url: SMALL_SERVICE,
      data: {
        page: page,
        size: size,
        serviceName: question
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success(res) {
        if (res.data.errcode == 0) {
          let result = res.data.result.content;
          if (result.length > 0) { //如果有数据
            let searchList = [];
            let radioList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = result : searchList = that.data.smallService.concat(result)
            for (var i = 0; i < searchList.length; i++) {
              var radioText = {
                "checked": false
              }
              radioList.push(radioText);
            }
            var value = that.data.question;
            var data = searchList;
            //将标题已关键字拆开成数组
            that.data.resultObj = []; that.data.result = [];
            that.data.i = 0; that.data.titleObj = [];
            that.data.all = !value;
            for (let i = 0; i < data.length; i++) {
              that.data.titleObj.push(data[i].SMALL_NAME);
            }
            that.search(value, that.data.titleObj[that.data.i], searchList);
            if (!!value) {
              searchList.forEach((item, index, arr) => {
                item.SMALL_NAME = that.data.resultObj[index];
              })
            }
            that.setData({
              smallService: searchList, //获取数据数组      
              radioList: radioList,
              searchLoadingComplete: true, //把"已加载全部"设为true，显示
              searchLoading: false //"正在加载隐藏掉"
            });
          } else {
            that.setData({
              smallService: [],
              searchLoadingComplete: true, //把"已加载全部"设为true，显示
              searchLoading: false //"正在加载隐藏掉"
            });
          }

        }
      }
    })
    wx.hideLoading();//隐藏加载提示
  },
  //滚动到底部触发事件
  onReachBottom: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      page: 0,
      size: 3,
      questionList: []
    })
    that.getQuestionList();
    wx.stopPullDownRefresh();
  },
  jumpQuiz: function () {
    var that = this;
    var execute_function = function(){
      wx.navigateTo({
        url: '../quiz/quiz?informationClassId=' + that.data.informationClassId + '&question=' + that.data.question
      })
    };
    app.lookGetSettig(execute_function);
  },
  handleEmpty: function () {
    var that = this;
    that.setData({
      question: ""
    })
  },
  // 寻找当前title关键字的函数
  search: function (key, data, searchList) {
    if (this.data.all) {
      searchList.forEach((item, index, arr) => {
        item.TITLE = [{ red: false, text: item.TITLE }];
        item.title = [{ red: false, text: item.title }];
        item.SMALL_NAME = [{ red: false, text: item.SMALL_NAME }];
      })
    } else {
      var idx = data.indexOf(key);
      if (idx >= 0) {
        if (idx === 0) {
          this.data.result.push({ red: true, text: key });
        } else {
          this.data.result.push({ red: false, text: data.slice(0, idx) });
          this.data.result.push({ red: true, text: data.substr(idx, key.length) });
        }
        if (idx + key.length === data.length) {
          this.next(key);
        } else {
          this.search(key, data.substr(idx + key.length));
        }
      } else {
        this.data.result.push({ red: false, text: data });
        this.next(key);
      }
    }
  },
  // 寻找下一个title关键字
  next: function (key) {
    this.data.resultObj.push(this.data.result);
    this.data.result = [];
    this.data.i++;
    if (this.data.i < this.data.titleObj.length) {
      this.search(key, this.data.titleObj[this.data.i]);
    }
  },
  // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  bindToDetail: function (e) {
    var articleId = e.currentTarget.dataset.id;
    var execute_function = function(){
      wx.navigateTo({
        url: '../putQuestion/putQuestion?articleId=' + articleId,
      })
    };
    app.lookGetSettig(execute_function);
  },
  //几个更多按钮
  wdMore: function (e) {
    wx.navigateTo({
      url: '../requestDT/requestDT?searchTitle=' + this.data.question 
    })
  },
  zxMore: function (e) {
    // wx.reLaunch({
    //   url: '/pages/index/index?name=' + "资讯",
    // })
    wx.navigateTo({
      url: '../courselSearch/courselSearch?searchTitle=' + this.data.question 
    })
  },
  fwMore: function (e) {
    wx.navigateTo({
      url: '../service/service?searchTitle=' + this.data.question 
    })
  },
  bindTocourselDetail: function (e) {
    var articleId = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../webView/webView?url=' + url + '&articleId=' + articleId ,
    })
  },
  goServiceInfo: function (e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    let fwsId = e.currentTarget.dataset.fwsid;
    var execute_function = function(){
      wx.navigateTo({
        url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId + '&isShare=true&fwsid=' + fwsId,
      })
    };
    app.lookGetSettig(execute_function);
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