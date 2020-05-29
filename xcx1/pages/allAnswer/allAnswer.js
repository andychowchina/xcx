const selectUserComment = require('../../config').selectUserComment;
const addUserComment = require('../../config').addUserComment;
const addThreeComment = require('../../config').addThreeComment;
const userCommentPraise = require('../../config').userCommentPraise;
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
    noData:false,//判断是不是最后一页
    totalNumber: '',//上一页面传过来的总页数
    articleId: '',//上一页面传来的 用于传入下一页面
    hotCommentList: [],
    titleText: '全部评论页',
    currentId:'',//该条二级评论的id,用来提交三级评论
    commentimageList: new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var commentId = options.commentId;
    var informationId = options.articleId;
    var useCode = app.globalDatas.userCode;
    this.setData({
      commentId: commentId,
      informationId: informationId,
      userCode: useCode,
      navH: app.globalDatas.navHeight,
      showMessageId: options.showMessageId,
      articleId: options.articleId
    })
    // this.selectUserComment(this.data.commentId, this.data.informationId, 0);//评论列表
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
    this.selectUserComment(this.data.commentId, this.data.informationId, 0);//评论列表
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
    var showMessageId = that.data.userCode;
    wx.request({
      method: 'POST',
      url: deleteRecordMessage,
      data: {
        pk: showMessageId,
        column1:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) { }
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
    var random = Math.random() 
    app.showLoad();
    wx.request({
      url: selectUserComment,
      data: {
        zxplId: commentId,
        informationId: informationId,
        page: page,
        size: 5,
        userId: that.data.userCode,
        random:random,
        // userId: 111
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
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
          // console.log("result[1].content.lastPage",result[1].lastPage)
          that.setData({
            commentimageList: commentimageList,
            commentList: commentList,
            noData:result[1].lastPage,
            userInfo: topResultList,
            loadMore: false,
            page: page,
            totalPages: result[1].totalPages,
            totalNumber: result[1].totalElements
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
    var isthrcomm = res.currentTarget.dataset.isthrcomm;//用来判断是二级评论还是三级评论
    var btntype = res.currentTarget.dataset.type;
    var replyuserid = res.currentTarget.dataset.replyuserid;
    // var isUserComment = res.currentTarget.dataset.isusercomment;
    var currentId = res.currentTarget.dataset.id;
    // if (replyuserid) {
    //   this.setData({
    //     replyuserid: replyuserid,
    //     isUserComment: isUserComment
    //   })
    // }
    if (btntype == "show") {
      this.setData({
        isShow: true,
        focus: true,
        currentId: currentId,
        replyuserid: replyuserid,
        isthrcomm: isthrcomm
      })

    } else {
      this.setData({
        isShow: false,
        focus: false,
      })
    }
  },
  //获取输入的评论
  getInputComment: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  // 添加评论
  addInformationComment: function () {
    var that = this;
    var content = this.data.inputText;
    var commentid = this.data.commentId;
    var informationId = this.data.informationId;
    // var isUserComment = this.data.isUserComment;
    var saveNickName = wx.getStorageSync("updataNickName");
    var currentId = this.data.currentId;
    var isthrcomm = this.data.isthrcomm;
    var replyuserid = this.data.replyuserid;
    wx.showLoading({
      title: '正在发送',
    });
    var data = {}
    var url = ""
    var urlTwo = addUserComment
    var urlThree = addThreeComment
    var dataTwo = {
      zxplId: commentid,
      wxUserId: app.globalDatas.userCode,
      content: content,
      replyUserId: replyuserid,
      isUserComment: 1
    };
    var dataThree = {
      wxUserId: app.globalDatas.userCode,
      content: content,
      wxForuserId: currentId,
      wxUserNickname: saveNickName
    };
    if (isthrcomm == 'y') {
      data = dataThree
      url = urlThree
    } else {
      data = dataTwo
      url = urlTwo
    }
    // if (isUserComment) {
    //   data.isUserComment = isUserComment;
    // }
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
  // 点击查看回复
  bindAnswer: function (e) {
    var userid = e.currentTarget.dataset.userid
    var commentId = e.currentTarget.dataset.commentid;
    var objectData = {//把该条评论的信息传到下一页面
      userid:userid,
      commentId: commentId,
    }
    wx.navigateTo({
      url: '../commentDetail/commentDetail?objectData=' + JSON.stringify(objectData)
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
        // that.selectUserComment(commentId, infoId, 0);
        // wx.navigateBack({});
      }
    })
  },
  //存储点赞列表
  localpraise: function (commentList) {
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