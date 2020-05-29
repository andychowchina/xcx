
var app = getApp();
var host = app.globalDatas.baseUrl;
var getDynamicInfoOfTopicsUrl = require('../../config').getDynamicInfoOfTopics;
var selectTopicByTytleUrl = require('../../config').selectTopicByTytle;
const urlhost = require('../../config').host;
Page({
  data:{
    topicBaseInfo:'',
  },
  onLoad: function (options) {
    this.setData({
      navH: app.globalDatas.navHeight,
      topicText: options.topicText
    })
    // this.loadRooms();
    this.selectTopicByTytle();
    // that.fetchSearchList();
    //调用加载数据的方法

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onShow: function () {

    var that = this;
    var inforClassId = that.data.inforClassId;
    var isOnload = that.data.isOnload;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    if (isOnload) {
      that.setData({
        isOnload: false,
      });
    } else {
      that.setData({
        pageNumber: 0,
        pageSize: 10,
        inforClassId: inforClassId,
        dtList: [],
        searchLoading: true,
        searchLoadingComplete: false,
      });
      this.loadRooms();
    }

  },
  onReady: function () {
    wx.hideTabBar();
    var that = this;
    var inforClassId = that.data.inforClassId;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      pageNumber: 0,
      pageSize: 10,
      inforClassId: inforClassId,
      dtList: [],
      searchLoading: true,
      searchLoadingComplete: false,
    });

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalDatas.isfrstLogin) {
            wx.showLoading({
              title: '正在加载',
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            app.userLogin(function () {
              that.onShow();
            });
          } else {
            that.onShow();
          }
        } else {
          wx.switchTab({
            url: '../login/login'
          });
        }
      }
    });

  },
  data: {
    publishType: 'show',
    publishText: '+',
    isShow: false,
    callbackcount: 15, //返回数据的个数
    searchNum: 1, // 设置加载的第几次，默认是第一次
    searchList: [], //放置返回数据的数组,设为空
    isFirstSearch: true, //第一次加载，设置true
    searchLoading: false, //"上拉加载"的变量,false,隐藏，true，显示
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    tabType: 0, //标签切换
    userid: app.globalDatas.userCode,
    crrentTabsIndex: "",
    pageNumber: 0,
    inforClassId: "",
    pageSize: 10,
    functionList: [],
    dtList: [],
    isOnload: true,
    topicId:"",
    topicTitle:""
  },

  //滚动到底部触发事件/*app.json文件中，onReachBottomDistance上拉触发距离设置*/
  onReachBottom: function () {
    // let that = this;
    // if (that.data.searchLoading && !that.data.searchLoadingComplete) {
    //   that.setData({
    //     searchNum: that.data.searchNum + 1, //每次触发上拉事件，把searchPageNum+1
    //     isFirstSearch: false //触发到上拉事件，把isFirstSearch设为为false
    //   });
    //   that.fetchSearchList();
    // }
    //上拉分页,将页码加1，然后调用分页函数loadRoom()
    var that = this;
    var pageNumber = that.data.pageNumber;
    that.setData({
      pageNumber: ++pageNumber,
      searchLoading: true,
      searchLoadingComplete: false,
    });
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      // wx.showToast({
      //   title: '加载中..',
      // }),
      that.loadRooms();
      wx.hideLoading();
    }, 1000);
  },

  /**
   * 加载直播间
   */
  loadRooms: function () {
    var that = this;
    //获取分页信息
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    var topicText = that.data.topicText;
    var userid = app.globalDatas.userCode;
    //发送请求
    wx.request({
      url: getDynamicInfoOfTopicsUrl, // 仅为示例，并非真实的接口地址
      data: {
        "page": pageNumber,
        "size": pageSize,
        'title': topicText,
        'currentWxUserId':userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
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

          //返回成功
          var dtList = that.data.dtList;
          var reqRooms = new Array();
          var reslList = res.data.result.content;
          
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
            var resHtml = {};
              resHtml = {
                id: reslList[i].ID,
                userImg: reslList[i].HEAD_SCULPTURE,
                userNickName: reslList[i].NICKNAME,
                userInfoDate: app.changeDate(reslList[i].RELEASE_TIME),
                userInfotype: reslList[i].NAME,
                dtText: reslList[i].CONTENT == undefined ? [reslList[i].TITLE] : app.showTopic(reslList[i].CONTENT),
                dtImage: imgList,
                userid: reslList[i].WX_USER_ID,
                viewed: reslList[i].VIEWED,
                commentNumber: reslList[i].COMMENT_NUMBER,
                greatNumber: reslList[i].GREAT_NUMBER,
                shareNumber: reslList[i].SHARE_NUMBER,
                isPraise: reslList[i].IS_PRAISE,
                classId: reslList[i].INFORMATION_CLASS_ID,
                smallServiceId: reslList[i].SMALL_SERVICE_ID,
                logo: app.globalDatas.serviceManagerUrl + reslList[i].LOGO,
                sName: reslList[i].SNAME,
                reservationNum: reslList[i].WX_RESERVATION_NUM,
                location: reslList[i].RELEASE_LOCATION
              };
            
            reqRooms.push(resHtml);
          }
          app.localfunction(dtList.concat(reqRooms), that);
          if (reslList.length == 0 || reslList.length < that.data.pageSize) {
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示
            });
          } else {
            that.setData({ searchLoadingComplete: false, });
          }
          that.setData({
            searchLoading: false,
          });
          // console.log("切换2".concat(dtList));
          //如果返回数据为空，则提示
          if (reqRooms.length == 0) {
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

          //如果分页数据不为空，则将新的分页数据追加到原数据智商
          that.setData({
            dtList: dtList.concat(reqRooms),

          });
          // console.log("切换3".concat(dtList));
        } else {

          //如果数据加载失败，则提示
          wx.showToast({
            title: res.data.msg,
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

  /**
   * 点击选项卡事件
   */
  swichNav: function (event) {
    var that = this;
    var dtList = that.data.dtList;
    if (this.data.crrentTabsIndex === event.target.dataset.current) {
      return false;
    } else {
      that.setData({
        crrentTabsIndex: event.target.dataset.current,
        inforClassId: event.target.dataset.current,
        searchLoading: true,
        searchLoadingComplete: false,
        pageNumber: 0,
        pageSize: 10,
        dtList: []
      });
    }
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
    that.onPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    var inforClassId = that.data.inforClassId;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      pageNumber: 0,
      pageSize: 10,
      inforClassId: inforClassId,
      dtList: [],
      searchLoading: true,
      searchLoadingComplete: false,
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

  //获取输入税号
  getTax: function (e) {
    this.setData({
      cus_tax: e.detail.value
    })
  },

  //首页切换标签
  indexSwitchTab: function (event) {
    var url = event.currentTarget.dataset.url; //获取data-url
    wx.reLaunch({
      url: url
    })
  },
  //查看动态详情
  jumpDtinfo: function (e) {
    var articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dynamicInfo/dynamicInfo?articleId=' + articleId,
    })
  },

  //查看服务案例与活动详情
  jumpfwalinfo: function () {
    wx.navigateTo({
      url: '../fwal/fwal'
    })
  },
  //查看企业问答详情
  jumpQandA: function () {
    wx.navigateTo({
      url: '../QandA/QandA'
    })
  },
  //更新资讯信息（点赞、关注、分享）
  updateInfo: function (e) {
    var that = this;
    app.updateInfo(e, function () {
      that.fetchSearchList();
    })
  },
  //发布动态
  jumpPublicDt: function (e) {
    this.showButtonPublish("hide");
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../publicDt/publicDt?informationClassId=' + informationClassId
    })
  },
  //发布提问
  jumpPublicTw: function (e) {
    this.showButtonPublish("hide");
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../publicTw/publicTw?informationClassId=' + informationClassId
    })
  },
  //发布案例和活动
  publicAlAndHd: function (e) {
    this.showButtonPublish("hide");
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../publicAlAndHd/publicAlAndHd?informationClassId=' + informationClassId
    })
  },
  //发布
  showPublishBtn: function (res) {
    var btntype = res.currentTarget.dataset.type; //获取data-list 
    this.showButtonPublish(btntype);
  },
  /*弹出按钮功能*/
  showButtonPublish: function (btntype) {
    var animation = wx.createAnimation();
    if (btntype == "show") {
      this.setData({
        publishText: '×',
        publishType: 'hide',
        isShow: true
      })
      this.showDtBut(animation);
      this.showHdBut(animation);
      this.showAlBut(animation);
      this.showWdBut(animation);
    } else {
      this.setData({
        publishText: '+',
        publishType: 'show',
        isShow: false
      })
      this.hideDtBut(animation);
      this.hideHdBut(animation);
      this.hideAlBut(animation);
      this.hideWdBut(animation);
    }
  },

  /*弹出各类型的框*/
  showDtBut: function (animation) {
    animation.translate(-70, -55).step();
    this.setData({
      animationDT: animation.export()
    });
  },
  showHdBut: function (animation) {
    setTimeout(function () {
      animation.translate(-20, -55).step()
      this.setData({
        animationHd: animation.export()
      })
    }.bind(this), 150)
  },
  showAlBut: function (animation) {
    setTimeout(function () {
      animation.translate(30, -55).step()
      this.setData({
        animationAl: animation.export()
      })
    }.bind(this), 300)
  },
  showWdBut: function (animation) {
    setTimeout(function () {
      animation.translate(80, -55).step()
      this.setData({
        animationWd: animation.export()
      })
    }.bind(this), 450)
  },
  //隐藏各种框
  hideDtBut: function (animation) {
    animation.translate(0, 0).step();
    this.setData({
      animationDT: animation.export()
    });
  },
  hideHdBut: function (animation) {
    animation.translate(0, 0).step()
    this.setData({
      animationHd: animation.export()
    });
  },
  hideAlBut: function (animation) {
    animation.translate(0, 0).step()
    this.setData({
      animationAl: animation.export()
    })
  },
  hideWdBut: function (animation) {
    animation.translate(0, 0).step()
    this.setData({
      animationWd: animation.export()
    });
  },
  onShareAppMessage: function (res) {

    var id = res.target.dataset.id;
    var title = res.target.dataset.title;
    res.from //转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
    res.target //如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
    return {
      title: title, //转发标题,默认当前小程序名称
      path: '/pages/dynamicInfo/dynamicInfo?articleId=' + id + '&isShare=true', //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
      success: function (res) { // 转发成功
        res.errMsg //shareAppMessage:ok 转发成功
        res.shareTickets //shareTicket 数组，每一项是一个 shareTicket ，对应一个转发对象
      },
      fai: function (res) {
        res.errMsg //shareAppMessage:fail cancel   用户取消转发
        res.errMsg //shareAppMessage:fail (detail message) 转发失败，其中 detail message 为详细失败信息
      },
      complete: function (res) { // 转发结束
      }
    }
  },
  //分享,收藏
  functionInfo: function (event) {
    var that = this;
    app.sharAndPraise(event, that)
  },

  //查看用户
  showUserInfo: function (e) {
    app.showPerson(e);
  },
  /*查看大图 */
  showBigPicture: function (event) {
    app.showBigPicture(event);
  },
  //跳转详情页面
  goServiceInfo: function (e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId,
    })
  },
  //查看话题
  getTopics: function (e) {
    var topicText = e._relatedInfo.anchorTargetText.replace(/#/g, "");
    wx.navigateTo({
      url: '../topicsContent/topicsContent?topicText=' + topicText,
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
  selectTopicByTytle: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: selectTopicByTytleUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        title: that.data.topicText,
      },
      success(res) {
        var data = res.data;
        var topicBaseInfo = that.data.topicBaseInfo;
        if (data.errcode = "0") {
          var result = data.result;
          topicBaseInfo = result[0];
          topicBaseInfo.IMG_URL = undefined ? "" : app.globalDatas.serviceManagerUrl + topicBaseInfo.IMG_URL
          var topicId = topicBaseInfo.ID;
          var topicTitle = topicBaseInfo.TITLE;
        } else {
          wx.showToast({
            title: data.msg,
          })
        }
        that.setData({
          topicBaseInfo: topicBaseInfo,
          topicTitle: topicTitle,
          topicId: topicId
        })
      }
    })
  },
  topicAttend:function(){
    var topicTitle = this.data.topicTitle;
    var topicId = this.data.topicId;
    wx.navigateTo({
      url: '../publicDt/publicDt?topicTitle=' + topicTitle + '&topicId=' + topicId +'&informationClassId=1',
    })
  }
})

wx.showShareMenu({
  withShareTicket: true
})


