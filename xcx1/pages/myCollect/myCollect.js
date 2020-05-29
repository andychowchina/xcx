// pages/myCollect/myCollect.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var serviceUrl = host + 'wxServiceCollect/myCollectionServices.do?authType=show';
var curselUrl = host + 'wxInformationCollect/myCollectInfors.do?authType=show';
var commentUrl = host + 'wxInfoCommentCollect/queryListCommentCollect.do?authType=show';
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
var indexJs = require("../index/index.js");
const urlhost = require('../../config').host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceManagerUrl: serviceManagerUrl,
    zxNumber: 0,
    gzNumber: 0,
    scNumber: 0,
    crrentTabsIndex: "4",
    pageNumber: 0,
    inforClassId: "4",
    pageSize: 10,
    loading: false,  //把"上拉加载"的变量设为true，显示
    loadingComplete: false, //把“没有数据”设为false，隐藏
    dtList: [],
    functionList: [],
    fwalList: [],
    qywtList: [],
    answerList: [],
    sList: [],
    userid: '',
    titleText: '收藏',
    commentList: [1],
    swiperIndex: '0',
    data: [
      {
        name: '回答',
        id: 0
      },
      {
        name: '服务',
        id: 1
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = options.userid ? options.userid : app.globalDatas.userCode;
    that.setData({
      userid: userid,
      navH: app.globalDatas.navHeight,
    })
    //调用加载数据的方法
    that.loadRooms();
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
    var that = this;
    var inforClassId = that.data.inforClassId;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据
    that.setData({
      pageNumber: 0,
      pageSize: 10,
      inforClassId: inforClassId,
      url: '',
      dtList: [],
      sList: [],
      qywtList: [],
      loading: true,
      loadingComplete: false,
    });
    wx.showLoading({
      title: '加载中',
    });
    that.loadRooms();
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrolltolowerHandle: function () {
    //上拉分页,将页码加1，然后调用分页函数loadRoom()
    var that = this;
    var pageNumber = that.data.pageNumber;
    that.setData({
      pageNumber: ++pageNumber,
      loading: true,
      loadingComplete: false,
    });
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      that.loadRooms();
      wx.hideLoading();
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取个人信息
   */
  jumpMyBaseInfo: function () {
    wx.navigateTo({
      url: '../myBaseInfo/myBaseInfo'
    })
  },
  /**
   * 加载直播间
   */
  loadRooms: function () {
    var that = this;
    //获取分页信息
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    var swiperIndex = that.data.swiperIndex;
    var userid = that.data.userid;
    //发送请求
    wx.request({
      url: swiperIndex == "1" ? serviceUrl : commentUrl, // 仅为示例，并非真实的接口地址serviceUrl
      data: {
        "page": pageNumber,
        "size": pageSize,
        "userId": userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.errcode != 0) {
            //如果数据加载失败，则提示
            wx.showToast({
              title: "加载数据失败," + res.data.msg,
              icon: 'fail',
              duration: 1000
            });
            return;
          }

          //返回成功
          var dtList = that.data.dtList;
          var qywtList = that.data.qywtList;
          var sList = that.data.sList;
          var reqRooms = new Array();
          var wdRooms = new Array();
          var sRooms = new Array();
          // var resCount = res.data.result.info;
          // that.setData({
          //   zxNumber: resCount.INF_COUNT,
          //   gzNumber: resCount.ATTEN_COUNT,
          //   scNumber: resCount.COL_COUNT,
          //   headImage: resCount.HEAD_SCULPTURE,
          // });
          var reslList = swiperIndex == "0" ? res.data.result.content : res.data.result.list.content;
          for (var i = 0; i < reslList.length; i++) {
            var imgs = reslList[i].IMAGES == undefined ? "" : reslList[i].IMAGES.split(",");
            var imgList = new Array();
            if (imgs.length > 0) {
              for (var j = 0; j < imgs.length; j++) {
                var map = {};
                map["Imageurl"] = urlhost + imgs[j];
                imgList.push(map);
              }
            }
            if (swiperIndex == "0") {
              var wdHtml = {
                id: reslList[i].ID,
                information_id: reslList[i].INFORMATION_ID,
                qytwTitle: reslList[i].TITLE,
                userImg: reslList[i].HEAD_SCULPTURE,
                userNickName: reslList[i].NICKNAME,
                userInfotype: '回答',
                userInfoDate: app.changeDate(reslList[i].CREATE_DATE),
                collectNum: reslList[i].CLLECT_NUMBER,
                commentNum: reslList[i].COMMENT_COUNT,
                smallServiceId: reslList[i].SMALL_SERVICE_ID,
                logo: app.globalDatas.serviceManagerUrl + reslList[i].LOGO,
                sName: reslList[i].SNAME,
                reservationNum: reslList[i].WX_RESERVATION_NUM,
                content: reslList[i].CONTENT,
                isPraise: reslList[i].IS_PRAISE,
                greatNumber: reslList[i].PRAISE_COUNT
              };
              reqRooms.push(wdHtml);
            } else {
              var resHtml = {
                id: reslList[i].ID,
                sid: reslList[i].SID,
                dtText: reslList[i].INTRO,
                userImg: reslList[i].LOGO,
                userNickName: reslList[i].NAME,
                userInfotype: '服务',
                userInfoDate: app.changeDate(reslList[i].CREATE_DATE),
                smallServiceId: reslList[i].SMALL_SERVICE_ID,
                logo: app.globalDatas.serviceManagerUrl + reslList[i].LOGO,
                sName: reslList[i].CLASS_NAME,
                reservationNum: reslList[i].RES_COUNT
              };
              sRooms.push(resHtml);
            }
          }

          if (reslList.length == 0 || reslList.length < that.data.pageSize) {
            that.setData({
              loadingComplete: true, //把“没有数据”设为true，显示
            });
          } else {
            that.setData({ loadingComplete: false, });
          }
          that.setData({
            loading: false,
          });
          //如果返回数据为空，则提示
          if (reqRooms.length == 0 && sRooms.length == 0) {
            // wx.showToast({
            //   title: "没有更多的数据了...",
            //   icon: 'fail',
            //   duration: 1000
            // });

            //分页失败，分页数据减1
            if (pageNumber > 1) {
              that.setData({
                pageNumber: --pageNumber
              });
            }
            return;
          }

          app.localfunction(dtList.concat(reqRooms), that);

          //如果分页数据不为空，则将新的分页数据追加到原数据智商
          that.setData({
            dtList: dtList.concat(reqRooms),
            qywtList: qywtList.concat(wdRooms),
            sList: sList.concat(sRooms)
          });
        } else {

          //如果数据加载失败，则提示
          wx.showToast({
            title: "加载数据失败," + res.data.msg,
            icon: 'fail',
            duration: 1000
          });

          if (res.data.errcode != 0) {
            return;
          }

          //分页失败，分页数据回退
          if (pageNumber > 1) {
            that.setData({
              pageNumber: --pageNumber
            });
          }
        }
      },
      complete: function () {        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh()      //停止下拉刷新
      }
    })
  },
  
  //查看服务详情
  getServiceInfo: function (e) {
    var serviceid = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceid,
    })
  },
  /*查看大图 */
  showBigPicture: function (event) {
    app.showBigPicture(event);
  },
  //分享,收藏
  functionInfo: function (event) {
    var that = this;
    app.sharAndPraise(event, that)
  },
  //跳转
  jumpMyfunction(e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  //咨询详情
  jumpDtinfo: function (e) {
    var articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dynamicInfo/dynamicInfo?articleId=' + articleId,
    })
  },
  //跳转详情页面
  goServiceInfo: function (e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId,
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
  //点击触发切换tab
  setSwiperIndex(e) {
    const idx = e.currentTarget.dataset.index;
    if (this.data.swiperIndex == idx) {
      return false;
    } else {
      this.setData({
        swiperIndex: idx
      })
    }
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 500);
  },
  //滑动触发切换tab
  swiperChangeHandle(e) {
    let cur = e.detail.current;
    this.setData({
      swiperIndex: cur
    })
    if (cur == "0" && this.data.dtList.length <= 0) {
      this.loadRooms();
    } else if (cur == "1" && this.data.sList.length <= 0) {
      this.loadRooms();
    }
  }
})