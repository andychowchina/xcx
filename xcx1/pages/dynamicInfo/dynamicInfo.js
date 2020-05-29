const queryInformationLists = require('../../config').queryInformationLists;
const addInformationComment = require('../../config').addInformationComment;
const selectInformationComment = require('../../config').selectInformationComment;
const updateInformationById = require('../../config').updateInformationById;
const selectUserComment = require('../../config').selectUserComment;
const addUserComment = require('../../config').addUserComment;
const userCommentPraise = require('../../config').userCommentPraise;
const host = require('../../config').host;
const infoCommentPraise = require('../../config').infoCommentPraise;
var collectUrl = host + '/WeChatSys/wxInfoCommentCollect/inserta.do?authType=show';
var collectUrlFalse = host + '/WeChatSys/wxInfoCommentCollect/deletea.do?authType=show';
var deleteRecordMessage = host + '/WeChatSys/wxMessages/updateOne.do?authType=show';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    replyuserid: '',
    commentid: '',
    articleId: '',
    isShow: false,
    focus: false,
    disable: false,
    zxInfo: [],
    isAttention: "",
    isAttentionComment: "",
    inputText: '',
    commentList: '',
    userCommentList: '',
    page: 0,
    loadMore: false,
    useCode: '',
    isPraise: '0',
    isHeaderPraise: '0',
    totalPages: '',
    praiseList: [],
    praiseHeaderList: [],
    templateType: '',
    imageList: new Array(),
    isShare: '',
    url: '',
    totalNumber: '', //该咨询评论的总条数
    titleText: '回答详情',
    start: "最热评论",
    duplicateList: [],
    listHeight: [],
    hotCommentList: [],
    headerCommentList: [],
    rn: '',
    showMessageId: '',
    wicId: "",
    shareInfoId:"",
    shareCurrentWxUserId:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    console.log("optionsoptions",options)
    var plid = options.wicid ? options.wicid : options.commentId;
    var isShare = options.isShare ? options.isShare : "";
    var rn = options.rn ? options.rn : "";
    var useCode = app.globalDatas.userCode;
    var url = '/pages/index/index';
    this.setData({
      articleId: options.articleId,
      useCode: useCode,
      navH: app.globalDatas.navHeight,
      isShare: isShare,
      url: url,
      rn: rn,
      showMessageId: options.showMessageId,
      wicId: plid
    })
    console.log("this.data.useCode",this.data.useCode)
    this.enterWay(options)// 
  },

  enterWay:function(options){
    console.log("enterWay,",options)
    var that = this
    if(options.infoId && options.currentWxUserId){
      that.setData({
        shareInfoId : options.infoId,
        shareCurrentWxUserId : options.currentWxUserId,
      })
      that.getWxInformation(that.data.shareInfoId,that.data.shareCurrentWxUserId);
    }else{
      that.getWxInformation(that.data.articleId,that.data.useCode);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow0",this.data.articleId)
    //查看评论盒子中元素高度是否超过5行
    var that = this;
    var query = wx.createSelectorQuery();
    var listHeight = that.data.listHeight;
    setTimeout(function() {
      query.selectAll('.hfxx').boundingClientRect()
      query.exec((res) => {
        listHeight = res;
        that.setData({
          listHeight: listHeight
        })
      });
    }, 200);
    if(that.data.shareInfoId && that.data.shareCurrentWxUserId){
      that.getWxInformation(that.data.shareInfoId,that.data.shareCurrentWxUserId);
    }else{
      that.getWxInformation(that.data.articleId,that.data.useCode);
    }
    // that.getWxInformation(that.data.articleId,that.data.useCode);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    var infoId = that.data.articleId
    var currentWxUserId = that.data.useCode
    console.log("infoId111111111111",that.data.articleId)
    console.log("currentWxUserId1111111111111111",currentWxUserId)
    return {
      title: "", //转发标题,默认当前小程序名称
      path: '/pages/dynamicInfo/dynamicInfo?infoId=' + infoId + '&currentWxUserId=' + currentWxUserId,
      // imageUrl:'http://222.85.150.179:17009//ServiceManager/../ServiceManager/../ServiceManagerUpload/WxChatSys/img//f5969a0f-2155-4dfa-a66a-c1110b6aba2e.png', //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
    }
  },
  // functionInfo: function (event) {
  //   var that = this;
  //   var execute_function = function () {
  //     app.sharAndPraise(event, that);
  //   };
  //   app.lookGetSettig(execute_function);
  // },
  showBigPicture: function(event) {
    var current = event.target.dataset.src; //预览图片 
    wx.previewImage({
      current: current,
      urls: this.data.product.photoUrls,
    });
  },
  write: function(res) {
    console.log("pppp")
    var btntype = res.currentTarget.dataset.type;
    var commentid = res.currentTarget.dataset.commentid;
    var replyuserid = res.currentTarget.dataset.replyuserid;
    if (commentid) {
      this.setData({
        commentid: commentid,
        replyuserid: replyuserid
      })
      var replyuserid = this.data.replyuserid;
    }
    if (btntype == "show") {
      this.setData({
        isShow: true,
        focus: true
      })

    } else {
      this.setData({
        isShow: false,
        focus: false
      })
    }

  },
  //添加回答
  addRequest: function(e) {
    var replyUserId = e.currentTarget.dataset.replyuserid;
    wx.navigateTo({
      url: '../addQuestion/addQuestion?informationClassId=' + replyUserId
    })
  },
  //分享,收藏
  // functionInfo: function(event) {
  //   console.log("event",event)
  //   var that = this;
  //   app.sharAndPraise(event, that)
    
  // },
  getWxInformation: function(infoId,wxUserId) {
    console.log("infoId",infoId)
    console.log("wxUserId",wxUserId)
    var that = this;
    var imageList = this.data.imageList;
    app.showLoad();
    wx.request({
      url: queryInformationLists,
      data: {
        infoId: infoId,
        currentWxUserId: wxUserId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        app.hideShowLoad();
        var zxInfoList = [];

        if (res.data.errcode == 0) {
          zxInfoList.push(res.data.result);
          if (zxInfoList.length > 0) {
            if (zxInfoList[0].information[0].NAME == "动态" || zxInfoList[0].information[0].NAME == "资源") {
              zxInfoList[0].information[0].CONTENT = app.showTopic(zxInfoList[0].information[0].CONTENT);
            }
            zxInfoList[0].information[0].RELEASE_TIME = app.changeDate(zxInfoList[0].information[0].RELEASE_TIME);
            if (zxInfoList[0].infoImg) {
              for (var i = 0; i < zxInfoList[0].infoImg.length; i++) {
                var image = {
                  Imageurl: host + zxInfoList[0].infoImg[i].IMG_URL
                }
                zxInfoList[0].infoImg[i].IMG_URL = host + zxInfoList[0].infoImg[i].IMG_URL;
                imageList.push(image);
              }
            }
            var linkData = app.selectWhiteUrl(zxInfoList[0].information[0].RESOURCE_LINKS);
            zxInfoList[0].linkData = linkData;
          }
          that.setData({
            zxInfo: zxInfoList,
            imageList: imageList,
            isAttention: zxInfoList[0].isAttention,
            isAttentionComment: zxInfoList[0].isCollect
          })
          that.selectInformationComment(infoId, 0);
          that.selectTemplateType(zxInfoList[0].information[0].NAME);
          that.deleteRecord();
        } else {
          //弹窗提示
          wx.showModal({
            title: '提示',
            content: res.data.msg
          })
        }
      }
    })
  },
  //获取输入的评论
  getInputComment: function(e) {
    console.log("输入评论",e)
    this.setData({
      inputText: e.detail.value
    })
  },
  //添加评论
  addInformationComment: function() {
    wx.showLoading({
      title: '正在评论',
    });
    var that = this;
    var informationId = that.data.articleId;
    var content = that.data.inputText;
    var commentid = that.data.commentid;
    if (!commentid) {
      var url = addInformationComment;
      var data = {
        informationId: informationId,
        wxUserId: app.globalDatas.userCode,
        content: content,
        replyUserId: replyuserid
      };
    } else {
      var url = addUserComment;
      var replyuserid = that.data.replyuserid;
      var data = {
        zxplId: commentid,
        wxUserId: app.globalDatas.userCode,
        content: content,
        replyUserId: replyuserid,
        isUserComment: 1
      };
    }
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        wx.hideLoading();
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '评论成功',
          });
          that.setData({
            isShow: false,
            inputText: ''
          })
          that.selectInformationComment(informationId, 0);
          that.getWxInformation(that.data.articleId,that.data.useCode);
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.msg
          })

        }
      }
    })
  },
  //评论上面的咨询
  selectInformationComment: function(infoId, page) {
    var that = this;
    wx.request({
      url: selectInformationComment,
      data: {
        informationId: infoId,
        wicId: that.data.wicId,
        page: page,
        size: 10,
        userId: that.data.useCode,
        isUserComment:0,
        type: 2
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        var result = res.data.result.content;
        var commentList = that.data.commentList;
        console.log("result",result)
        if (res.data.errcode == 0) {
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              result[i].CREATE_DATE = app.changeDate(result[i].CREATE_DATE);
            }
          }
          commentList = result;
          var commentimageList = [];
          for (var j = 0; j < commentList.length; j++) {
            var text = commentList[j].IMAGES;
            if (text != undefined) {
              var array = text.split(",");
            }
            if (array != undefined && array.length > 0) {
              commentimageList = [];
              for (var i = 0; i < array.length; i++) {
                var image = {
                  Imageurl: host + array[i]
                }
                commentimageList.push(image);
                commentList[j].IMG_URL = commentimageList;
              }
            }
            array = [];
          }
          that.setData({
            commentList: commentList,
            loadMore: false,
            page: page,
            // totalNumber: result[0].COMMENT_COUNT,
            totalPages: res.data.result.totalPages
          })
          var fatherId = commentList[0].ID;
          that.usernameAttention(fatherId);
        } else {
          wx.showToast({
            title: res.data.msg,
          });
        }
      },
      fail: function(res) {
        console.log("失败")
      }
    })
  },
  // 顶部查看全部答案
  showUserCurselComment: function(e) {
    if(that.data.shareInfoId&&that.data.shareCurrentWxUserId){
      var commentId = that.data.shareInfoId;
      var articleId = that.data.shareCurrentWxUserId;
    }else{
      var commentId = e.currentTarget.dataset.commentid;
      var articleId = this.data.articleId;
    }
    wx.navigateTo({
      url: '../putQuestion/putQuestion?commentId=' + commentId + '&articleId=' + articleId
    })
  },
  //查看全部评论
  showUserComment: function(e) {
    var commentId = e.currentTarget.dataset.commentid;
    var articleId = this.data.articleId;
    wx.navigateTo({
      url: '../allAnswer/allAnswer?commentId=' + commentId + '&articleId=' + articleId
    })
  },
  
  //更新评论
  updateInfo: function(e) {
    var that = this;
    app.updateInfo(e, function() {
      that.getWxInformation(that.data.articleId,that.data.useCode);
    });
  },
  //给评论的评论点赞
  userCommentPraise: function(e) {
    var that = this;
    var userCommentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var dianzanid = e.currentTarget.dataset.dianzanid;
    var praiseList = this.data.praiseList;
    wx.request({
      method: 'POST',
      url: userCommentPraise,
      data: {
        userCommentId: userCommentId,
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
        var praiseNumber = praiseList[dianzanid].praiseNumber;
        praiseList[dianzanid].isPraise = (res.data.msg == "点赞成功" ? "Y" : "N");
        praiseList[dianzanid].praiseNumber = ((res.data.msg == "点赞成功" ? praiseNumber + 1 : praiseNumber - 1));
        that.setData({
          praiseList: praiseList
        })
      }
    })
  },
  /*查看大图 */
  showBigPicture: function(event) {
    app.showBigPicture(event);
  },
  //给咨询点赞
  infoCommentPraise: function(e) {
    var that = this;
    var userCommentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var dianzanid = e.currentTarget.dataset.dianzanid;
    var praiseHeaderList = that.data.praiseHeaderList;
    wx.request({
      method: 'POST',
      url: infoCommentPraise,
      data: {
        informationCommentId: userCommentId,
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
        var praiseNumber = praiseHeaderList[dianzanid].praiseNumber;
        praiseHeaderList[dianzanid].isPraise = (res.data.msg == "点赞成功") ? "Y" : "N";
        praiseHeaderList[dianzanid].praiseNumber = ((res.data.msg == "点赞成功") ? praiseNumber + 1 : praiseNumber - 1);
        that.setData({
          praiseHeaderList: praiseHeaderList
        })
      }
    })
  },
  //关注
  attention: function(e) {
    var that = this;
    var isAttention = that.data.isAttention;
    app.userAttention(e, function() {
      isAttention = (isAttention == "1") ? "0" : "1";
      that.setData({
        "isAttention": isAttention
      })
    })
  },
  clickHandle(e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    const list = that.data.commentList;
    app.userAttention(e, function() {
      list[index].IS_ATTENTION = (list[index].IS_ATTENTION === 'Y') ? 'N' : 'Y';
      that.setData({
        commentList: list
      });
    });
  },
  //收藏问题的第一个评论
  attentionComment: function(e) {
    var that = this;
    var url;
    var commentId = e.currentTarget.dataset.commentid;
    var wxUserId = app.globalDatas.userCode;
    var index = e.currentTarget.dataset.index;
    var list = that.data.headerCommentList;
    if (list[index].IS_COLLECT == "N") {
      url = collectUrl;
    } else {
      url = collectUrlFalse;
    }
    wx.request({
      method: 'POST',
      url: url,
      data: {
        commentId: commentId,
        wxUserId: wxUserId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var msg;
        if (url == collectUrl && res.data.msg == "成功") {
          msg = "收藏成功";
        } else if (url == collectUrlFalse && res.data.msg == "成功") {
          msg = "取消成功";
        } else {
          msg = res.data.msg;
        }
        wx.showToast({
          title: msg,
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        list[index].IS_COLLECT = (msg == "收藏成功") ? "Y" : "N";
        list[index].COLLECT_COUNT = (msg == "收藏成功") ? (list[index].COLLECT_COUNT) + 1 : (list[index].COLLECT_COUNT) - 1;
        that.setData({
          commentList: list
        })
      }
    })
  },
  //删除已经看过的消息信息提示-单条处理
  deleteRecord: function() {
    var that = this;
    var showMessageId = that.data.useCode;
    wx.request({
      method: 'POST',
      url: deleteRecordMessage,
      data: {
        pk: showMessageId,
        column1:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',

      },
      success(res) {}
    })
  },
  //存储评论用户点赞列表
  localpraise: function(commentList) {
    var that = this;
    if (commentList.length > 0) {
      var praiseList = [];
      var praise = []
      for (var i = 0; i < commentList.length; i++) {
        praise.push({
          isPraise: commentList[i].IS_PRAISE,
          praiseNumber: parseInt(commentList[i].PRAISE_COUNT)
        })
      }
      // var praise = {
      //   isPraise: commentList[0].IS_PRAISE,
      //   praiseNumber: parseInt(commentList[0].PRAISE_COUNT)
      // }
      praiseList = praise;
      that.setData({
        praiseList: praiseList
      })
    }
  },
  //存储咨询点赞列表
  localcounselpraise: function(headerCommentList) {
    var praiseHeaderList = [];
    var praise = {
      isPraise: headerCommentList[0].IS_PRAISE,
      praiseNumber: parseInt(headerCommentList[0].PRAISE_COUNT)
    }
    praiseHeaderList.push(praise);
    this.setData({
      praiseHeaderList: praiseHeaderList
    })
  },
  /*查看大图 */
  showBigPicture: function(event) {
    app.showBigPicture(event);
  },
  /*选择模板样式 */
  selectTemplateType: function(name) {
    var type;
    switch (name) {
      case "动态":
        type = "zxInfo";
        break;
      case "活动":
        type = "hdInfo";
        break;
      case "案例":
        type = "hdInfo";
        break;
      case "问答":
        type = "wdInfo";
        break;
      case "资源":
        type = "zyInfo";
        break;
    }
    this.setData({
      templateType: type
    })
  },
  showUserInfo: function(e) {
    app.showPerson(e);
  },
  navBack: function() {
    var url = this.data.url;
    var isShare = this.data.isShare;
    if (isShare) {
      wx.reLaunch({
        url: url,
      })
    } else {
      wx.navigateBack()
    }

  },
  navMainPage: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //查看话题
  getTopics: function(e) {
    var topicText = e._relatedInfo.anchorTargetText.replace(/#/g, "");
    wx.navigateTo({
      url: '../topicsContent/topicsContent?topicText=' + topicText,
    })
  },
  //查看评论
  usernameAttention: function(fatherId) {
    var that = this;
    var informationId = that.data.articleId;
    var userId = app.globalDatas.userCode;
    // console.log("app.globalDatas.userCode",app.globalDatas.userCode)
    var hotCommentList = that.data.hotCommentList;
    // var articleId = that.data.articleId;//用来传入下一页面
    var headerCommentList = that.data.headerCommentList;
    var random = Math.random() 
    wx.request({
      method: 'POST',
      url: selectUserComment,
      data: {
        informationId: informationId,
        zxplId: fatherId,
        userId: userId,
        // userId: 111,
        random:random,
        page: 0,
        size: 11111
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        hotCommentList = res.data.result[1].content;
        headerCommentList = res.data.result[0];
        hotCommentList.map((res, index) => {
          res.CREATE_DATE = app.changeDate(res.CREATE_DATE)
        })
        headerCommentList.map((res, index) => {
          res.CREATE_DATE = app.changeDate(res.CREATE_DATE)
        })
        that.setData({
          hotCommentList: hotCommentList,
          headerCommentList: headerCommentList,
          totalNumber: res.data.result[1].totalElements,
        })

        that.localpraise(hotCommentList);
        that.localcounselpraise(headerCommentList);
      }
    })
  },
  /*点击复制链接 */
  copyLink: function(e) {
    const linkUrl = e.currentTarget.dataset.linkurl;
    wx.setClipboardData({
      data: linkUrl,
      success(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  }
})