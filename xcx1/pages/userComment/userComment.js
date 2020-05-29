const selectUserComment = require('../../config').selectUserComment;
const addUserComment = require('../../config').addUserComment;
const userCommentPraise = require('../../config').userCommentPraise;
const infoCommentPraise = require('../../config').infoCommentPraise;
const host = require('../../config').host;
var deleteRecordMessage = host + '/WeChatSys/wxMessages/updateOne.do?authType=show';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    loadMore: false,
    commentId: '',
    commentList: '',
    informationId: '',
    isUserComment: '',
    userInfo: '',
    page: 0,
    userCode: '',
    totalPages: '',
    praiseList: [],
    inputText: '',
    titleText: '评论详情',
    commentimageList: new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var commentId = options.commentId;
    var informationId = options.articleId;
    var useCode = app.globalDatas.userCode;
    console.log("useCode", useCode)
    this.setData({
      commentId: commentId,
      informationId: informationId,
      userCode: useCode,
      navH: app.globalDatas.navHeight,
      showMessageId: options.showMessageId
    })
    this.selectUserComment(commentId, informationId, 0);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page;
    var infoId = this.data.informationId;
    var totalPages = this.data.totalPages;
    var commentId = this.data.commentId;
    if (page < totalPages) {
      page++;
      this.selectUserComment(commentId, infoId, page);
      this.setData({
        loadMore: true,
        page: page
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //删除已经看过的消息信息提示-单条处理
  deleteRecord: function () {
    var that = this;
    var showMessageId = that.data.showMessageId;
    wx.request({
      method: 'POST',
      url: deleteRecordMessage,
      data: {
        pk: showMessageId,
        column1: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log("res测试删除",res)
       }
    })
  },
  /*查看大图 */
  showBigPicture: function (event) {
    app.showBigPicture(event);
  },
  //查看用户评论
  selectUserComment: function (commentId, informationId, page) {
    var that = this;
    var commentimageList = that.data.commentimageList;
    app.showLoad();
    wx.request({
      url: selectUserComment,
      data: {
        zxplId: commentId,
        informationId: informationId,
        page: page,
        size: 5,
        userId: that.data.userCode,
        // userId: 111,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        console.log("res",res)
        app.hideShowLoad();
        var result = res.data.result;
        var commentList = that.data.commentList;
        if (res.data.errcode == 0) {
          if (result[1].content.length > 0) {
            for (var i = 0; i < result[1].content.length; i++) {
              result[1].content[i].CREATE_DATE = app.changeDate(result[1].content[i].CREATE_DATE);
            }

          }
          result[0][0].CREATE_DATE = app.changeDate(result[0][0].CREATE_DATE);
          var topResultList = result[0];
          var text = topResultList[0].IMAGES;
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
              topResultList[0].IMG_URL = commentimageList;
            }
          }
          if (!commentList || page == 0) {
            commentList = result[1].content;
          } else {
            commentList = commentList.concat(result[1].content);
          }
          that.setData({
            commentimageList: commentimageList,
            commentList: commentList,
            userInfo: topResultList,
            loadMore: false,
            page: page,
            totalPages: result[1].totalPages
          })
          that.localpraise(commentList);
          that.deleteRecord();
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
  },
  write: function (res) {
    var btntype = res.currentTarget.dataset.type;
    var replyuserid = res.currentTarget.dataset.replyuserid;
    var isUserComment = res.currentTarget.dataset.isusercomment;
    if (replyuserid) {
      this.setData({
        replyuserid: replyuserid,
        isUserComment: isUserComment
      })
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
  //获取输入的评论
  getInputComment: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  //添加评论
  addInformationComment: function () {
    var that = this;
    var informationId = this.data.informationId;
    var content = this.data.inputText;
    var commentid = this.data.commentId;
    var isUserComment = this.data.isUserComment;
    wx.showLoading({
      title: '正在发送',
    });
    var url = addUserComment;
    var replyuserid = this.data.replyuserid;
    var data = {
      zxplId: commentid,
      wxUserId: app.globalDatas.userCode,
      content: content,
      replyUserId: replyuserid,
    };
    if (isUserComment) {
      data.isUserComment = isUserComment;
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
            isShow: false
          })
          that.selectUserComment(commentid, informationId, 0);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg
          })
        }

      }
    })
  },
  //返回
  back: function () {
    wx.navigateBack({})
  },

  //资讯评论点赞
  infoCommentPraise: function (e) {
    var that = this;
    var informationCommentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var informationId = that.data.informationId;
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
        if (res.data.errcode == "0") {
          that.selectUserComment(informationCommentId, informationId, 0);
          wx.showToast({
            title: res.data.msg,
            icon: 'succes',
            duration: 1000,
            mask: true
          });
        }

        // wx.navigateBack({});
      }
    })
  },
  //给评论的评论点赞
  userCommentPraise: function (e) {
    var that = this;
    var userCommentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var infoId = this.data.informationId;
    var commentId = this.data.commentId;
    var dianzanid = e.currentTarget.dataset.dianzanid;
    var praiseList = this.data.praiseList;
    wx.request({
      method: 'POST',
      url: userCommentPraise,
      data: {
        userCommentId: userCommentId,
        userId: userId
        // userId: 111
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
  //存储点赞列表
  localpraise: function (commentList) {
    console.log("commentList",commentList)
    var praiseList = [];
    for (var i = 0; i < commentList.length; i++) {
      var praise = {
        isPraise: commentList[i].IS_PRAISE,
        praiseNumber: parseInt(commentList[i].PRAISE_COUNT)
      }
      praiseList.push(praise);

    }
    this.setData({
      praiseList: praiseList,
    })
  },
  showUserInfo: function (e) {
    app.showPerson(e);
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