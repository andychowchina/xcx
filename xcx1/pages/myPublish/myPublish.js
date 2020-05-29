var app = getApp();
var host = app.globalDatas.baseUrl;
var url = host + 'wxInformation/myPublicInformations.do?authType=show';
var indexJs = require("../index/index.js");
const urlhost = require('../../config').host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImage:'',
    nickname:'',
    userInfo:'',
    userid:'',
    isAttention:'',
    attationUserId: '',
    zxNumber: 0,
    gzNumber: 0,
    scNumber: 0,
    crrentTabsIndex:"",
    pageNumber: 0,
    inforClassId:"",
    pageSize: 10,
    searchLoading: false,  //把"上拉加载"的变量设为true，显示
    searchLoadingComplete: false, //把“没有数据”设为false，隐藏
    functionList: [],
    dtList: [],
    fwalList: [],
    answerList: [],
    titleText:"个人主页"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

// ---------------------
// var execute_function = function () {
//         //如果数据加载失败，则提示
//         wx.showToast({
//           title: "您当前尚未登录",
//           icon: 'fail',
//           duration: 1000
//         });
//         return;
//       };
      // app.lookGetSettig(execute_function);


    var that = this;
    var execute_function = function () {
        var userid = options.userid ? options.userid : app.globalDatas.userCode;
        that.setData({
          userid: userid,
          attationUserId: app.globalDatas.userCode,
          navH: app.globalDatas.navHeight,
        })
        // 调用加载数据的方法
        that.loadRooms();   
    };
    app.lookGetSettig(execute_function);
// --------------------
    // wx.hideTabBar();
    // var that = this;
    // // 查看是否授权

    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       if (app.globalDatas.isfrstLogin) {
    //         app.userLogin();
    //       }
    //     } else {
    //       wx.switchTab({
    //         url: '../login/login'
    //       });
    //     }
    //   }
    // });
    // var userid = options.userid ? options.userid : app.globalDatas.userCode;
    // that.setData({
    //   userid: userid,
    //   attationUserId: app.globalDatas.userCode,
    //   navH: app.globalDatas.navHeight,
    // })
    //调用加载数据的方法
    // that.loadRooms();
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    res.from //转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
    res.target //如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
    if (res.from === 'button') {
      var title = res.target.dataset.title;
      var infoid = res.target.dataset.id;
      var path = '../dynamicInfo/dynamicInfo?articleId=' + infoid;
    }
    else {
      var title = '';
      var path ='';
    }
    return {
      title: title, //转发标题,默认当前小程序名称
      path: path, //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
    }
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
    var inforClassId = that.data.inforClassId;
    var userid = that.data.userid;
    var attationUserId = that.data.attationUserId;
    //发送请求
    wx.request({
      url: url, // 仅为示例，并非真实的接口地址
      data: {
        "page": pageNumber,
        "size": pageSize,
        "userId": attationUserId,
        "inforClassId": inforClassId,
        "iUserId": userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == 200) {
          if(res.data.errcode != 0){
            //如果数据加载失败，则提示
            wx.showToast({
              title: "加载数据失败",
              icon: 'fail',
              duration: 1000
            });
            return;
          }
          
          //返回成功
          var dtList = that.data.dtList;
          var reqRooms = new Array();
          var resCount = res.data.result.info;
          that.setData({
            zxNumber: resCount.INF_COUNT,
            gzNumber: resCount.ATTEN_COUNT,
            scNumber: resCount.COL_COUNT,
            nickname: resCount.NICKNAME,
            headImage: resCount.HEAD_SCULPTURE,
            isAttention: resCount.IS_ATTENTION
          });
          var reslList = res.data.result.list.content;
          for(var i = 0;i < reslList.length; i++){
            var imgs = reslList[i].IMAGES == undefined ? "" : reslList[i].IMAGES.split(",");
            var imgList = new Array();
            if(imgs.length > 0){
              for(var j = 0;j < imgs.length; j++){
                var map = {}; 
                map["Imageurl"] = urlhost +  imgs[j];
                imgList.push(map);
              }
            }
            var resHtml = {};
            if (reslList[i].INFORMATION_CLASS_ID == "4") {
              resHtml = {
                id: reslList[i].ID,
                wicid: reslList[i].WICID,
                qytwTitle: reslList[i].TITLE,
                userImg: reslList[i].HEAD_SCULPTURE,
                userNickName: reslList[i].NICKNAME,
                userid: reslList[i].WX_USER_ID,
                userInfotype: '提问',
                userInfoDate: app.changeDate(reslList[i].RELEASE_TIME),
                collectNum: reslList[i].CLLECT_NUMBER, 
                content: reslList[i].HD_CONTENT,
                commentNum: reslList[i].COMMENT_NUMBER,
                classId: reslList[i].INFORMATION_CLASS_ID,
                smallServiceId: reslList[i].SMALL_SERVICE_ID,
                logo: app.globalDatas.serviceManagerUrl + reslList[i].LOGO,
                sName: reslList[i].SNAME,
                reservationNum: reslList[i].WX_RESERVATION_NUM,
                location: reslList[i].RELEASE_LOCATION,
                isStick: reslList[i].IS_STICK,
                isPraise: reslList[i].IS_PRAISE,
                greatNumber: reslList[i].GREAT_NUMBER
              };
            } else if (reslList[i].INFORMATION_CLASS_ID == "5") {
              var linkData = app.selectWhiteUrl(reslList[i].RESOURCE_LINKS);
              resHtml = {
                id: reslList[i].ID,
                wicid: reslList[i].WICID,
                userImg: reslList[i].HEAD_SCULPTURE,
                userNickName: reslList[i].NICKNAME,
                userInfoDate: app.changeDate(reslList[i].RELEASE_TIME),
                userInfotype: reslList[i].NAME,
                dtText: reslList[i].CONTENT == undefined ? [reslList[i].TITLE] : app.showTopic(reslList[i].CONTENT),
                dtImageContent: reslList[i].IMG_CONTENT,
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
                location: reslList[i].RELEASE_LOCATION,
                isStick: reslList[i].IS_STICK,
                linkData: linkData,
                qytwTitle: reslList[i].TITLE,
                linkUrl: reslList[i].RESOURCE_LINKS
              };
            } else {
              resHtml = {
                id: reslList[i].ID,
                wicid: reslList[i].WICID,
                userImg: reslList[i].HEAD_SCULPTURE,
                userNickName: reslList[i].NICKNAME,
                userInfoDate: app.changeDate(reslList[i].RELEASE_TIME),
                userInfotype: reslList[i].NAME,
                dtText: reslList[i].CONTENT == undefined ? [reslList[i].TITLE] : app.showTopic(reslList[i].CONTENT),
                dtImageContent: reslList[i].IMG_CONTENT,
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
                location: reslList[i].RELEASE_LOCATION,
                isStick: reslList[i].IS_STICK
              };
            }
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
            dtList: dtList.concat(reqRooms)
          });
        } else {

          //如果数据加载失败，则提示
          wx.showToast({
            title: "加载数据失败" + res.data.msg,
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
  swichNav:function(event){
    var that = this;
    var dtList = that.data.dtList;
    if (this.data.crrentTabsIndex === event.target.dataset.current) {
      return false;
    } else {
      that.setData({
        crrentTabsIndex: event.target.dataset.current,
        inforClassId: event.target.dataset.current,
        pageNumber: 0,
        pageSize: 10,
        dtList: [],
        searchLoading: true,
        searchLoadingComplete: false,
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
  //关注
  attention: function (e) {
    var that  = this;
    var isAttention = that.data.isAttention;
    app.userAttention(e, function () {
      isAttention = (isAttention=="true")?"false":"true";
      that.setData({
        "isAttention": isAttention
      })
    })
  },
  /**
   * 点赞、关注、转发
   */
  //查看动态详情
  jumpDtinfo: function (e) {
    var articleId = e.currentTarget.dataset.id;
    var wicid = e.currentTarget.dataset.wicid;
    wx.navigateTo({
      url: '../dynamicInfo/dynamicInfo?articleId=' + articleId + '&wicid=' + wicid,
    })
  },
  /*查看大图 */
  showBigPicture: function (event){
    app.showBigPicture(event);
  },
  //分享,收藏
  functionInfo: function (event){
    var that = this;
    app.sharAndPraise(event,that)
  },
  //跳转
  jumpMyfunction(e){
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  //获取输入税号
  getTax: function (e) {
    this.setData({
      cus_tax: e.detail.value
    })
  },
  //查看动态详情
  // jumpDtinfo: function (e) {
  //   var articleId = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../dynamicInfo/dynamicInfo?articleId=' + articleId,
  //   })
  // },
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
    res.from //转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
    res.target //如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
    return {
      title: '自定义转发标题', //转发标题,默认当前小程序名称
      path: '', //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
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
  //跳转详情页面
  goServiceInfo: function (e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId,
    })
  },
  navBack:function(){
    wx.navigateBack();
  },
  navMainPage:function(){
      wx.switchTab({
        url: '../index/index'
      })
  }

});

wx.showShareMenu({
  withShareTicket: true
})
// //修改标题
// wx.setNavigationBarTitle({
//   title: '爱服务企业圈'
// })
