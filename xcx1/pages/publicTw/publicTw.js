// pages/publicTw/publicTw.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var queryInformationByTitleUrl = host + 'wxInformation/queryInformationByTitle.do?authType=show';
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
    titleText: '搜索'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      informationClassId: options.informationClassId,
      navH: app.globalDatas.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getQuestionList();
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
    this.getQuestionList();
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
  //滚动到底部触发事件
  onReachBottom: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把page+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });

      setTimeout(function () {
        that.setData({
          searchLoading: true
        });
        that.getQuestionList();
      }, 1500);
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      page: 0,
      size: 6,
      questionList: []
    })
    that.getQuestionList();
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
  // 寻找当前title关键字的函数
  search: function (key, data, searchList) {
    if (this.data.all) {
      searchList.forEach((item, index, arr) => {
        item.TITLE = [{ red: false, text: item.TITLE }];
      })
    } else {
      var idx = data.indexOf(key);// 获取关键字在字符串中的位置
      if (idx >= 0) {// 有关键字
        if (idx === 0) {// 在第一个位置直接加进去
          this.data.result.push({ red: true, text: key });
        } else {// 不在第一个位置，要先把之前的加进去，在把自己加进去
          this.data.result.push({ red: false, text: data.slice(0, idx) });
          this.data.result.push({ red: true, text: data.substr(idx, key.length) });
        }
        if (idx + key.length === data.length) {// 在最后一个位置的时候,证明当前title的关键字找完
          this.next(key);// 当前title关键字找完了，就找下一个title的关键字
        } else {// 不在最后一个位置，要递归调用继续寻找当前title的关键字
          this.search(key, data.substr(idx + key.length));
        }
      } else {// 无关键字,证明当前title的关键字找完了
        this.data.result.push({ red: false, text: data });
        this.next(key);// 当前title关键字找完了，就找下一个title的关键字
      }
    }
  },
  // 寻找下一个title关键字
  next: function (key) {
    this.data.resultObj.push(this.data.result);// 当前title找完关键字了要把它添加到集合中
    this.data.result = [];// 并把它清空，因为可能还有下一个title要继续处理
    this.data.i++;// i值加1，找下一个
    if (this.data.i < this.data.titleObj.length) {// 不是最后一个title那么就继续找
      this.search(key, this.data.titleObj[this.data.i]);
    }
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
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }

})