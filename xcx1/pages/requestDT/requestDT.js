// pages/publicTw/publicTw.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var queryInformationByTitleUrl = host + 'wxInformation/queryInformationByTitle.do?authType=show';
var addDtUrlTwo = host + 'wxTopicClass/queryTopicClassList.do?authType=show';
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
    size: 5,//一次请求返回的数据量
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    listDataCopy: [],
    resultObj: [],// 所有title的处理结果
    result: [],// 当前title的处理结果
    titleObj: [],// 所有title的集合，需处理的值
    i: 0,// 初始查询第一个title，索引值为0
    hotFiveData:[],//初次渲染最热的五条数据
    all: true,
    titleText: '搜索',
    themeList:[],
    themePkid:'',
    searchTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var searchTitle = options.searchTitle ? options.searchTitle : "";
    var themeid = options.themeid ? options.themeid :"";
    var informationClassId = options.informationClassId ? options.informationClassId :"21";
    this.setData({
      informationClassId: informationClassId,
      themePkid: themeid,
      navH: app.globalDatas.navHeight,
      searchTitle: searchTitle
    })
    if (searchTitle != ""){
      this.setData({
        question: searchTitle
      })
    }
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      that.putThemeData();
      that.getQuestionListClick();
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
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   let that = this;
  //   if (that.data.searchLoading && !that.data.searchLoadingComplete) {
  //     that.setData({
  //       page: that.data.page + 1,  //每次触发上拉事件，把page+1
  //       isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
  //     });
  //     setTimeout(function () {
  //       that.setData({
  //         searchLoading: true
  //       });
  //       that.getQuestionList();
  //     }, 1500);
  //   }
  // },
  // 点击换一换
  change: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,
        size:5,  //每次触发上拉事件，把page+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      setTimeout(function () {
        that.setData({
          searchLoading: true
        });
        that.getQuestionListClick();
      }, 100);
    }
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
    this.getQuestionListClick();
  },
  //获取问题集合
  getQuestionListClick: function (select) {
    let that = this;
    let page = that.data.page
    var size = "";
    if(select=='y'){
      size=1111
    }else{
      size=that.data.size
    }
    let question = that.data.question;
    var themePkid = that.data.themePkid;
    var dataParme = "";
    if (themePkid) {
      dataParme = {
        page: page,
        size: size,
        informationClassId: that.data.informationClassId,
        title: question,
        id:themePkid,
        topId: themePkid
      }
    } else {
      dataParme = {
        page: page,
        size: size,
        informationClassId: that.data.informationClassId,
        title: question,
        id:themePkid
      }
    }
    wx.request({
      method: 'POST',
      url: queryInformationByTitleUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: dataParme,
      success(r) {
        if (r.data.errcode == 0) {
          if(r.data.result.lastPage){
            that.setData({
              page: 0
            })
          }
          let res = r.data.result.content;
          if (res.length > 0) { //如果有数据
            let searchList = res;
            var value = that.data.question;
            var data = searchList;
            //将标题已关键字拆开成数组
            that.data.resultObj = []; that.data.result = [];
            that.data.i = 0; that.data.titleObj = [];
            that.data.all = !value;
            for (let i = 0; i < data.length; i++) {
              that.data.titleObj.push(data[i].TITLE);
            }
            that.search(value, that.data.titleObj[that.data.i], res);
            if (!!value) {
              searchList.forEach((item, index, arr) => {
                item.TITLE = that.data.resultObj[index];
              })
            }
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            searchList = res
            // that.data.isFromSearch ? searchList = res : searchList = that.data.questionList.concat(res);
            that.setData({
              questionList: searchList, //获取数据数组
              searchLoading: true
            });
            if(select=='y'&&that.data.questionList.length){
              that.setData({
                  searchLoading: false   //把"上拉加载"的变量设为false，隐藏
              });
            }
            // if (that.data.questionList.length < 5) {
            //   // that.setData({
            //   //     searchLoading: false   //把"上拉加载"的变量设为false，隐藏
            //   // });
            //  }
          } else {
            //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
            that.setData({
              questionList: r.data.result.content,
              isFromSearch: false,
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏
            });
          }
        }
      },
    })
  },
  //获取问题集合
  // getQuestionList: function () {
  //   let that = this;
  //   let page = that.data.page;
  //   let size = that.data.size;
  //   let question = that.data.question;
  //   var themePkid = that.data.themePkid;
  //   var dataParme="";
  //   if (themePkid) {
  //     dataParme = {
  //       page: page,
  //       size: size,
  //       informationClassId: that.data.informationClassId,
  //       title: question,
  //       topId: themePkid
  //     }
  //   }else{
  //     dataParme = {
  //       page: page,
  //       size: size,
  //       informationClassId: that.data.informationClassId,
  //       title: question
  //     }
  //   }
  //   wx.request({
  //     method: 'POST',
  //     url: queryInformationByTitleUrl,
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: dataParme,
  //     success(r) {
  //       if (r.data.errcode == 0) {
  //         let res = r.data.result.content;
  //         if (res.length > 0) { //如果有数据
  //           let searchList = res;
  //           var value = that.data.question;
  //           var data = searchList;
  //           //将标题已关键字拆开成数组
  //           that.data.resultObj = []; that.data.result = [];
  //           that.data.i = 0; that.data.titleObj = [];
  //           that.data.all = !value;
  //           for (let i = 0; i < data.length; i++) {
  //             that.data.titleObj.push(data[i].TITLE);
  //           }
  //           that.search(value, that.data.titleObj[that.data.i], res);
  //           if (!!value) {
  //             searchList.forEach((item, index, arr) => {
  //               item.TITLE = that.data.resultObj[index];
  //             })
  //           }
  //           //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
  //           searchList = res
  //           // that.data.isFromSearch ? searchList = res : searchList = that.data.questionList.concat(res);
  //           that.setData({
  //             questionList: searchList, //获取数据数组
  //             searchLoading: true
  //           });
  //           if (that.data.questionList.length < 5) {
  //             that.setData({
  //               searchLoading: false   //把"上拉加载"的变量设为false，隐藏
  //             });
  //           }
  //         } else {
  //           //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
  //           that.setData({
  //             isFromSearch: false,
  //             searchLoadingComplete: true, //把"没有数据"设为true，显示
  //             searchLoading: false  //把"上拉加载"的变量设为false，隐藏
  //           });
  //         }
  //       }
  //       // 展示最热的五条数据
  //       that.hotFiveData()
  //     },
  //   })
  // },
  // 初次渲染最热的五条数据函数
  hotFiveData:function(){
    var that = this
    var hotFiveData = []
    hotFiveData = that.data.questionList.sort(up);
    function up(x, y) {
      return (y.CLLECT_NUMBER + y.COMMENT_NUMBER) - (x.CLLECT_NUMBER + x.COMMENT_NUMBER)
    }
    that.setData({
      questionList: hotFiveData.slice(0, 5)
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
      size: 5,
      questionList: []
    })
    that.getQuestionListClick();
    wx.stopPullDownRefresh();
  },
  // jumpQuiz: function () {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../quiz/quiz?informationClassId=' + that.data.informationClassId + '&question=' + that.data.question
  //   })
  // },
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
    var execute_function = function(){
      var articleId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../putQuestion/putQuestion?articleId=' + articleId,
      })
    }
    app.lookGetSettig(execute_function);
  },
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //请求话题分类的数据
  putThemeData: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: addDtUrlTwo,
      data: {
        yxbz: "Y",
        sort: "sx,asc"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        var result = res.data.result;
        //对象排序
        function compare(property) {
          return function (a, b) {
            return (a[property] - b[property])
          }
        }
        that.setData({
          themeList: result.sort(compare('sx'))
        });
      }
    })
  },
  // 选择问题分类
  selected: function (e) {
    var select = e.target.dataset.click;//判断是点击标题加载问题还是默认加载的问题
    var that = this;
    var id = e.target.dataset.id;
    var themePkid = e.target.dataset.themeid;
    that.setData({
      themePkid: themePkid,
      isFromSearch: true
    })
    that.getQuestionListClick(select);
  }
})