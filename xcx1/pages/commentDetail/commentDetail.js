const selectUserComment = require('../../config').selectUserComment;
const addThreeComment = require('../../config').addThreeComment;
const userCommentPraise = require('../../config').userCommentPraise;
const praiseThreeComment = require('../../config').praiseThreeComment;//三级评论点赞
const infoCommentPraise = require('../../config').infoCommentPraise;
const showThreeComment = require('../../config').showThreeComment;
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
    praiseList: [],//存储咨询点赞
    thrPraiseList: [],//存储评论点赞
    inputText: '',
    userId:'',
    wxReplyUserId:'',//被回复人的用户id
    wxUserNickname:'',//被回复人的用户昵称
    commentCount:'',//总回复条数
    informationList:[],//顶部咨询内容
    objectData:[],//上一页面传过来的咨询内容
    currentId:'',
    titleText: '评论详情',
    commentimageList: new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectData = JSON.parse(options.objectData) //资讯数据
    // console.log("objectData",objectData)
    var commentId = objectData.commentId;
    var userId = objectData.userid;
    // var informationId = objectData.articleId;
    var useCode = app.globalDatas.userCode;
    var objectDataArr = [] //顶部资讯
    objectDataArr.push(objectData)
    this.setData({
      commentId: commentId,
      userId:userId,
      // informationId: informationId,
      userCode: useCode,
      navH: app.globalDatas.navHeight,
      // showMessageId: objectData.showMessageId,
      objectData: objectDataArr
    })
    this.selectUserComment(this.data.commentId,this.data.userId);
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
      // this.selectUserComment(commentId, infoId, page);
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
  selectUserComment: function (commentId,userId) {
    console.log("加载中")
    // wx.showLoading({
    //   title: '加载中，稍等...',
    // })
    var that = this;
    var commentimageList = that.data.commentimageList;
    app.showLoad();
    wx.request({
      url: showThreeComment,
      data: {
        userId:userId,
        CommentId: commentId, //上一条二级评论的id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        console.log("加载结束")
        app.hideShowLoad();
        var result = res.data.result;
        var informationList = that.data.informationList;
        var commentList = that.data.commentList;
        var commentCount = that.data.commentCount;
        if (res.data.errcode == 0) {
          if (result[1].length > 0) {
            for (var i = 0; i < result[1].length; i++) {
              result[1][i].CREATE_DATE = app.changeDate(result[1][i].CREATE_DATE);
            }
          }
          result[0][0].CREATE_DATE = app.changeDate(result[0][0].CREATE_DATE);
          // var topResultList = result[0];
          // var text = topResultList[0].IMAGES;
          // if (text != undefined) {
          //   var array = text.split(",");
          // }
          // if (array != undefined && array.length > 0) {
          //   commentimageList = [];
          //   for (var i = 0; i < array.length; i++) {
          //     var image = {
          //       Imageurl: host + array[i]
          //     }
          //     commentimageList.push(image);
          //     topResultList[0].IMG_URL = commentimageList;
          //   }
          // }
          // if (commentList) {
          //   commentList = result[1].content;
          // } else {
          //   commentList = commentList.concat(result[1].content);
          // }
          informationList = result[0]; 
          commentList = result[1];
          that.setData({
            // commentimageList: commentimageList,
            informationList:informationList,
            commentList: commentList,
           
            // userInfo: topResultList,
            // loadMore: false,
            // page: page,
            // totalPages: result[1].totalPages
          })
          that.localpraise(informationList);
          that.thrLocalpraise(commentList);
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
    // var replyuserid = res.currentTarget.dataset.replyuserid;
    // var isusercomment = res.currentTarget.dataset.isusercomment;
    var currentId = this.data.informationList[0].ID;
    
    var wxReplyUserId = res.currentTarget.dataset.wxreplyuserid;
    var wxUserNickname = res.currentTarget.dataset.wxreplyusernickname;

    // if (replyuserid) {
    //   this.setData({
    //     replyuserid: replyuserid,
    //     isUserComment: isusercomment
    //   })
    // }
    if (btntype == "show") {
      this.setData({
        isShow: true,
        focus: true,
        currentId: currentId,
        isthrcomm: isthrcomm,
        wxReplyUserId: wxReplyUserId,
        wxUserNickname: wxUserNickname
      })

    } else {
      this.setData({
        isShow: false,
        focus: false,
      })
    }
  },
  // 添加评论
  addInformationComment: function () {
    var that = this;
    // var informationId = this.data.informationId;
    var content = this.data.inputText;
    // var commentid = this.data.commentId;
    // var isUserComment = this.data.isUserComment;
    var saveNickName = wx.getStorageSync("updataNickName");
    var currentId = this.data.currentId;
    var isthrcomm = this.data.isthrcomm;
    // var replyuserid = this.data.replyuserid;
    var wxReplyUserId = this.data.wxReplyUserId;
    var wxUserNickname = this.data.wxUserNickname;
    wx.showLoading({
      title: '正在发送',
    });
    var data = {}
    var url = addThreeComment
    var dataTwo = {
      wxUserId: app.globalDatas.userCode,
      content: content,
      wxForuserId: currentId,
      wxUserNickname: saveNickName,
      wxReplyUserId: wxReplyUserId,
      wxReplyUserNickname: wxUserNickname
    };
    var dataThree = {
      wxUserId: app.globalDatas.userCode,
      content: content,
      wxForuserId: currentId,
      wxUserNickname: saveNickName
    };
    if (isthrcomm == 'y') {
      data = dataThree
    } else {
      data = dataTwo
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
          that.selectUserComment(that.data.commentId, that.data.userId);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg
          })
        }

      }
    })
  },
  //获取输入的评论
  getInputComment: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  //返回
  back: function () {
    wx.navigateBack({})
  },

  //资讯评论点赞
  // infoCommentPraise: function (e) {
  //   var that = this;
  //   var informationCommentId = e.currentTarget.dataset.commentid;
  //   var userId = app.globalDatas.userCode;
  //   var informationId = that.data.informationId;
  //   wx.request({
  //     method: 'POST',
  //     url: infoCommentPraise,
  //     data: {
  //       informationCommentId: informationCommentId,
  //       userId: userId
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success(res) {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'succes',
  //         duration: 1000,
  //         mask: true
  //       });
  //       if (res.data.errcode == "0") {
  //         that.selectUserComment(this.data.commentId,this.data.userId);
  //       }

  //       // wx.navigateBack({});
  //     }
  //   })
  // },
  infoCommentPraise: function (e) {
    var that = this;
    var userCommentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var infoId = this.data.informationId;
    var commentId = this.data.commentId;
    var dianzanid = e.currentTarget.dataset.dianzanid;
    var praiseList = this.data.praiseList;
    // console.log("praiseList",praiseList)
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
  //三级评论点赞
  userCommentPraise: function (e) {
    var that = this;
    var commentId = e.currentTarget.dataset.commentid;
    var userId = app.globalDatas.userCode;
    var dianzanid = e.currentTarget.dataset.dianzanid;
    var thrPraiseList = that.data.thrPraiseList;
    wx.request({
      method: 'POST',
      url: praiseThreeComment,
      data: {
        CommentId: commentId,
        userId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log("res",res)
        wx.showToast({
          title: res.data.msg,
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        if (res.data.errcode == "0") {
          var praiseNumber = thrPraiseList[dianzanid].praiseNumber;
          thrPraiseList[dianzanid].isPraise = (thrPraiseList[dianzanid].isPraise == "Y") ? "N" : "Y";
          thrPraiseList[dianzanid].praiseNumber = (thrPraiseList[dianzanid].isPraise == "Y") ? (praiseNumber + 1) : (praiseNumber - 1);
          that.setData({
            thrPraiseList: thrPraiseList,
          })
        }

        // wx.navigateBack({});
      }
    })
  },
  //存储咨询点赞列表
  localpraise: function (commentList) {
    // console.log("commentList",commentList)
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
    // console.log("praiseList",this.data.praiseList)
  },
  //存储评论点赞列表
  thrLocalpraise: function (commentList) {
    var praiseList = [];
    for (var i = 0; i < commentList.length; i++) {
      var praise = {
        isPraise: commentList[i].IS_PRAISE,
        praiseNumber: parseInt(commentList[i].PRAISE_COUNT)
      }
      praiseList.push(praise);

    }
    this.setData({
      thrPraiseList: praiseList,
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