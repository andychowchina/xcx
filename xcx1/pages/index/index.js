var SearchData = require('SearchData.js')
var app = getApp();
var host = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
var updateInfoUrl = host + 'wxInformation/updateInformationById.do?authType=show';
var url = host + 'wxInformation/myPublicInformations.do?authType=show';
var requestUrl = host + 'wxInformation/queryWDListIndex.do?authType=show'
var imgUrl = host + 'wxBanner/queryBanners.do?authType=show'
const urlhost = require('../../config').host;
const infoCommentPraise = require('../../config').infoCommentPraise;
const getPassUr = require('../../config').getPassUr;
Page({
  onLoad: function (options) {
    this.setData({
      navH: app.globalDatas.navHeight,
      zxIdName: options.name,
      useCode: app.globalDatas.userCode
    })
    this.getImgUrl();
  },
  // 记录每次滚动的位置
  onPageScroll: function (e) {
    var that = this;
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
        isOnload: false
      });
    } else {
      that.setData({
        pageNumber: 0,
        pageSize: 10,
        inforClassId: inforClassId,
        // dtList: [],
        searchLoading: true,
        searchLoadingComplete: false,
      });
      this.loadRooms();
    }
  },
  onReady: function () {
    setTimeout(_ => {
      this.popup = this.selectComponent("#buttomMenu").getMessageList(this.data.useCode); //组件的id
    }, 2000);
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
              that.setData({
                useCode: app.globalDatas.userCode
              })
            });
          } else {
            that.onShow();
          }
        } else {
          // wx.switchTab({
          //   url: '../login/login'
          // });
          that.onShow();
        }
      }
    });
    /*控制内容与顶部的高度 */
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#top_banner').boundingClientRect()
    query.exec(function (res) {

      that.setData({
        realHight: res[0].height + 80
      });
    })
  },
  data: {
    scrollTop: 0,
    callbackcount: 15, //返回数据的个数
    searchNum: 1, // 设置加载的第几次，默认是第一次
    searchList: [], //放置返回数据的数组,设为空
    isFirstSearch: true, //第一次加载，设置true
    searchLoading: false, //"上拉加载"的变量,false,隐藏，true，显示
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    tabType: 0, //标签切换
    userid: "",
    // crrentTabsIndex: 5,
    crrentTabsIndex: "",
    pageNumber: 0,
    // inforClassId: 5,
    inforClassId: "",
    pageSize: 10,
    functionList: [],
    dtList: [],
    isOnload: true,
    isStick: '',
    useCode: '',
    swiperList: [],
    requestList: [],
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000,
    realHight: 0,
    isShow: false,
    focus: false,
    praiseList: [],
    titleText: "爱服务",
    zxIdName: '',
    host: serviceManagerUrl,
    scroolTopIdValue: 0,
    showSwiper: true,
    isFromSearch: true,
    hideModal: false,//是否显示弹出评论框
    animationData:"",//弹出评论框的动画
    videoUrl: "",//video视频
    // video:[{vid:"l0025mppim4",playerid:'txv1'},{vid:"e0354z3cqjp",playerid:'txv2'}],//视频
  },

  //滚动到底部触发事件/*app.json文件中，onReachBottomDistance上拉触发距离设置*/
  onReachBottom: function () {
    //上拉分页,将页码加1，然后调用分页函数loadRoom()
    var that = this;
    var pageNumber = that.data.pageNumber;
    that.setData({
      pageNumber: ++pageNumber,
      isFromSearch: false,
      searchLoading: true,
      searchLoadingComplete: false
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
    console.log("loadRooms")
    var that = this;
    //获取分页信息
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    var inforClassId = that.data.inforClassId;
    var userid = app.globalDatas.userCode;
    var requestList = that.data.requestList;
    var urlList = "";
    if (inforClassId == "4") {
      urlList = requestUrl
    } else if (inforClassId == "5") {
      urlList = getPassUr
    } else {
      urlList = url
    }
    var dataList = {
      "page": pageNumber,
      "size": pageSize,
      "userId": userid,
      "inforClassId": inforClassId,
      "isHoPage": true,
      "iUserId": userid,
    }
    //发送请求
    wx.request({
      url: urlList,
      data: dataList,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("首页加载直播间",res)
        wx.hideLoading();
        if (res.statusCode == 200) {
          if (res.data.errcode != 0) {
            var execute_function = function () {
              //如果数据加载失败，则提示
              wx.showToast({
                title: "您当前尚未登录",
                icon: 'fail',
                duration: 1000
              });
              return;
            };
            app.lookGetSettig(execute_function);
          }
          //返回成功
          var dtList = that.data.dtList;
          var reqRooms = new Array();
          var reslList = inforClassId == '' ? res.data.result.list.content: res.data.result.content;
          if (inforClassId == 5) {
            let list = reslList.map((item) => {
              item.INFORMATION_CLASS_ID = 5;
              return item
            })
          }
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
            if (reslList[i].INFORMATION_CLASS_ID == "4") {
              resHtml = {
                id: reslList[i].ID,
                wicid: reslList[i].WICID,
                content: reslList[i].HD_CONTENT,
                qytwTitle: reslList[i].TITLE,
                greatNumber: reslList[i].GREAT_NUMBER,
                userImg: reslList[i].HEAD_SCULPTURE,
                images: reslList[i].IMAGES || '',//图片
                userNickName: reslList[i].NICKNAME,
                userid: reslList[i].WX_USER_ID,
                hf_id: reslList[i].HF_ID,
                userInfotype: '提问',
                userInfoDate: app.changeDate(reslList[i].RELEASE_TIME),
                collectNum: reslList[i].CLLECT_NUMBER,
                commentNum: reslList[i].COMMENT_NUMBER,
                is_Attention: reslList[i].ATTENT_PERSON,
                isPraise: reslList[i].IS_PRAISE,
                classId: reslList[i].INFORMATION_CLASS_ID,
                smallServiceId: reslList[i].SMALL_SERVICE_ID,
                logo: app.globalDatas.serviceManagerUrl + reslList[i].LOGO,
                sName: reslList[i].SNAME,
                reservationNum: reslList[i].WX_RESERVATION_NUM,
                location: reslList[i].RELEASE_LOCATION,
                isStick: reslList[i].IS_STICK
              };
            } else if (reslList[i].INFORMATION_CLASS_ID == "5") {
              //var linkData = app.selectWhiteUrl(reslList[i].RESOURCE_LINKS);
              resHtml = {
                addTime: app.changeDate(reslList[i].addTime),
                id: reslList[i].pk,
                userImg: reslList[i].imageUrl,
                userDomain: reslList[i].domain,
                qytwTitle: reslList[i].title,
                resources: reslList[i].resources,
                classId: reslList[i].INFORMATION_CLASS_ID
              };
            } else {
              resHtml = {
                id: reslList[i].ID,
                // wicid: reslList[i].WICID,
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
            that.setData({
              searchLoadingComplete: false,
            });
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
                pageNumber: --pageNumber,
                isFromSearch: false
              });
            }
            return;
          }
          var selectList;
          that.data.isFromSearch ? selectList = reqRooms : selectList = that.data.dtList.concat(reqRooms)
          //如果分页数据不为空，则将新的分页数据追加到原数据智商
          that.setData({
            dtList: selectList
          });
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
      fail: function () {
        wx.hideLoading();
        //如果数据加载失败，则提示
        wx.showToast({
          title: "请求数据失败",
          icon: 'fail',
          duration: 1000
        });
      },
      complete: function () { // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
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
    that.onPullDownRefresh();
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
    }, 100)
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 
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
      searchLoadingComplete: false
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
  getImgUrl: function () {
    var that = this;
    wx.request({
      method: 'POST',
      url: imgUrl,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var swiperList = that.data.swiperList;
        swiperList = res.data.result;
        that.setData({
          swiperList: swiperList
        })
      }
    })
  },
  //查看动态详情
  jumpDtinfo: function (e) {
    var articleId = e.currentTarget.dataset.id;
    var wicid = e.currentTarget.dataset.wicid;
    var userid = e.currentTarget.dataset.userid;
    var execute_function = function () {
      wx.navigateTo({
        url: '../dynamicInfo/dynamicInfo?articleId=' + articleId + '&wicid=' + wicid + '&userid=' + userid,
      })
    };
    app.lookGetSettig(execute_function);
  },
  // 问答下面的话题分类tab
  themeClassify: function () {
    wx.navigateTo({
      url: '../themeClassify/themeClassify'
    })
  },
  //问答下面的提问tab
  putQuestion: function (e) {
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../releaseQuestionss/releaseQuestionss?informationClassId=' + informationClassId
    })
  },
  request_test: function (e) {
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../requestDT/requestDT?informationClassId=' + informationClassId
    })
  },
  swiperJumpUrl: function (event) {
    var url = event.currentTarget.dataset.url;
    var articleId = event.currentTarget.dataset.id;
    if (url.indexOf("../") == '0') {
      wx.reLaunch({
        url: url
      })
    } else {
      wx.navigateTo({
        url: '../webView/webView?url=' + url + '&articleId=' + articleId,
      })
    }
  },
  //查看服务案例与活动详情
  jumpfwalinfo: function () {
    wx.navigateTo({
      url: '../fwal/fwal'
    })
  },
  switchService: function () {
    wx.navigateTo({
      url: '../SynthesiSearch/SynthesiSearch',
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
  //关注人
  clickHandle(e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    const coveruserid = e.currentTarget.dataset.coveruserid;
    const list = that.data.dtList;
    app.userAttention(e, function () {
      list[index].is_Attention = (list[index].is_Attention === 'false') ? 'true' : 'false';
      that.setData({
        dtList: list
      });
    });
  },
  // onShareAppMessage: function (res) {
  //   var id = res.target.dataset.id;
  //   var title = res.target.dataset.title;
  //   res.from //转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
  //   res.target //如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
  //   return {
  //     title: title, //转发标题,默认当前小程序名称
  //     path: '/pages/dynamicInfo/dynamicInfo?articleId=' + id + '&isShare=true', //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
  //     success: function (res) { // 转发成功
  //       res.errMsg //shareAppMessage:ok 转发成功
  //       res.shareTickets //shareTicket 数组，每一项是一个 shareTicket ，对应一个转发对象
  //     },
  //     fai: function (res) {
  //       res.errMsg //shareAppMessage:fail cancel   用户取消转发
  //       res.errMsg //shareAppMessage:fail (detail message) 转发失败，其中 detail message 为详细失败信息
  //     },
  //     complete: function (res) { // 转发结束
  //     }
  //   }
  // },
  // 都不需要usercode啊
  onShareAppMessage: function (res) {
    var id = res.target.dataset.id;
    return {
      title: "", //转发标题,默认当前小程序名称
      path: '/pages/index/index?articleId=' + id + '&isShare=true'
      // imageUrl:'http://222.85.150.179:17009//ServiceManager/../ServiceManager/../ServiceManagerUpload/WxChatSys/img//f5969a0f-2155-4dfa-a66a-c1110b6aba2e.png', //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
    }
  },
  //分享,收藏
  functionInfo: function (event) {
    var that = this;
    var execute_function = function () {
      app.sharAndPraise(event, that);
    };
    app.lookGetSettig(execute_function);
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
  //资讯评论点赞
  infoCommentPraised: function (e) {
    var that = this;
    var informationCommentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var dianzanid = e.currentTarget.dataset.dianzanid;
    var praiseList = this.data.praiseList;
    wx.request({
      method: 'POST',
      url: infoCommentPraise,
      data: {
        informationCommentId: informationCommentId,
        userId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        if (res.data.errcode == "0") {
          var praiseNumber = praiseList[dianzanid].praiseNumber;
          praiseList[dianzanid].isPraise = (praiseList[dianzanid].isPraise == "Y") ? "N" : "Y";
          praiseList[dianzanid].praiseNumber = (praiseList[dianzanid].isPraise == "Y") ? (praiseNumber + 1) : (praiseNumber - 1);
          that.setData({
            praiseList: praiseList,
          })
        }

        // wx.navigateBack({});
      }
    })
  },
  /*点击复制链接 */
  copyLink: function (e) {
    const linkUrl = e.currentTarget.dataset.linkurl;
    wx.setClipboardData({
      data: linkUrl,
      success(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  //资讯跳转详情页
  bindTocourselDetail: function (e) {
    var articleId = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../webView/webView?url=' + url + '&articleId=' + articleId,
    })
  },
  // 点击视频评论
  showcommBox: function () { 
    var that=this; 
    that.setData({ 
      hideModal:true 
    }) 
    var animation = wx.createAnimation({ 
      duration: 200,
      timingFunction: 'ease',
    }) 
    that.animation = animation 
    setTimeout(function(){ 
      that.fadeIn();
    },100)
  },
  // 关闭视频评论框
  hideCommBox: function () {
    var that=this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    that.fadeDown();
    setTimeout(function(){
      that.setData({ hideModal:false })
    },400)
  },
  // 评论框弹出动画
  fadeIn:function(){
    this.animation.translateY(0).step() 
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 评论框消失动画
  fadeDown:function(){    
    this.animation.translateY(367).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
})

wx.showShareMenu({
  withShareTicket: true
})