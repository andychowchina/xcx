const queryInformationLists = require('../../config').queryInformationLists;
const addInformationComment = require('../../config').addInformationComment;
const selectInformationComment = require('../../config').selectInformationComment;
const updateInformationById = require('../../config').updateInformationById;
const addUserComment = require('../../config').addUserComment;
const host = require('../../config').host;
const infoCommentPraise = require('../../config').infoCommentPraise;
const queryCollectUser = host + '/WeChatSys/wxInformationCollect/queryCollectUsers.do?authType=show'



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
    isAttentionComment: false,
    inputText: '',
    commentList: '',
    page: 0,
    loadMore: false,
    useCode: '',
    isPraise: '0',
    totalPages: '',
    praiseList: [],
    templateType: '',
    imageList: new Array(),
    commentimageList: new Array(),
    isShare: '',
    url: '',
    titleText: '问题详情',
    start: "热门回答",
    slist: [{
        id: 1,
        name: "热门回答"
      },
      {
        id: 2,
        name: "最新回答"
      }
    ],
    isstart: false,
    duplicateList: [],
    listHeight: [],
    colletList: [],
    isAttentionCommentPerson: '',
    isFolded: true,
    ellipsis: true,
    listQuestionHeight: '',
    shareInfoId:"",
    shareCurrentWxUserId:"",
    scene:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var isShare = options.isShare ? options.isShare : "";
    var useCode = app.globalDatas.userCode;
    var url = '/pages/index/index';
    var articleId = options.articleId ? options.articleId : options.pk
    this.setData({
      articleId: articleId,
      useCode: useCode,
      navH: app.globalDatas.navHeight,
      isShare: isShare,
      //url: url
    })
    this.enterWay(options)// 小程序进入方式
  },
  enterWay:function(options){
    // var useCode = app.globalDatas.userCode
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
    this.setHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(this.data.shareInfoId && this.data.shareCurrentWxUserId){
    }else{
      this.getWxInformation(this.data.articleId,this.data.useCode);
      this.getCollectUsers(this.data.articleId);
      //this.selectInformationComment(this.data.articleId, this.data.page, 2)
      this.lookDetail();
    }
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
  onReachBottom: function() {
    var page = this.data.page;
    var infoId = this.data.articleId;
    var totalPages = this.data.totalPages;

    if (page < totalPages) {
      page++;
      this.selectInformationComment(infoId, page);
      this.lookDetail();
      this.setData({
        loadMore: true,
        page: page
      })
    }
    //this.lookDetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("this.data.articleId",this.data.articleId)
    var infoId = this.data.articleId
    var currentWxUserId = app.globalDatas.userCode
    console.log("infoId",infoId)
    console.log("currentWxUserId",currentWxUserId)
    return {
      title: "", //转发标题,默认当前小程序名称
      path: '/pages/putQuestion/putQuestion?infoId=' + infoId + '&currentWxUserId=' + currentWxUserId,
      // imageUrl:'http://222.85.150.179:17009//ServiceManager/../ServiceManager/../ServiceManagerUpload/WxChatSys/img//f5969a0f-2155-4dfa-a66a-c1110b6aba2e.png', //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
    }
  },
  //问题详情过多时展开和隐藏
  ellipsis: function() {
    var value = !this.data.ellipsis;
    var isFolded = this.data.isFolded;
    this.setData({
      ellipsis: value,
      isFolded: !isFolded
    })
  },
  //查看评论盒子中元素高度是否超过5行
  lookDetail: function() {
    var that = this;
    var query = wx.createSelectorQuery();
    var listHeight;
    setTimeout(function() {
      query.selectAll('.hfxx').boundingClientRect()
      query.exec((res) => {
        listHeight = res;
        that.setData({
          listHeight: listHeight
        })
      });
    }, 200);
  },
  // showBigPicture: function (event) {
  //     var current = event.target.dataset.src; //预览图片 
  //     wx.previewImage({
  //         current: current,
  //         urls: this.data.product.photoUrls,
  //     });
  // },
  write: function(res) {
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
  getWxInformation: function(infoId,wxUserId) {
    var that = this;
    var imageList = that.data.imageList;
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
            isAttention: zxInfoList[0].isAttention
          })
          that.selectInformationComment(infoId, 0, 2);
          that.lookDetail();
          that.selectTemplateType(zxInfoList[0].information[0].NAME);
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
  // //分享,收藏
  // functionInfo: function (event) {
  //   var that = this;
  //   var execute_function = function () {
  //     app.sharAndPraise(event, that);
  //   };
  //   app.lookGetSettig(execute_function);
  // },
  //获取输入的评论
  getInputComment: function(e) {
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
    var informationId = this.data.articleId;
    var content = this.data.inputText;
    var commentid = this.data.commentid;
    if (!commentid) {
      var url = addInformationComment;
      var data = {
        informationId: informationId,
        wxUserId: app.globalDatas.userCode,
        content: content,
      };
    } else {
      var url = addUserComment;
      var replyuserid = this.data.replyuserid;
      var data = {
        zxplId: commentid,
        wxUserId: app.globalDatas.userCode,
        content: content,
        replyUserId: replyuserid,
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
          that.selectInformationComment(informationId, 0, 2);
          that.lookDetail();
          that.getWxInformation(that.data.articleId,that.data.useCode);
        } else {
          wx.showToast({
            title: res.data.msg,
          });
        }

      }
    })
  },
  //查看评论
  selectInformationComment: function(infoId, page, type) {
    var that = this;
    var type = type ? type : 2;
    var commentimageList = that.data.commentimageList;
    wx.request({
      url: selectInformationComment,
      data: {
        informationId: infoId,
        page: page,
        size: 10,
        userId: that.data.useCode,
        type: type
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        var result = res.data.result.content;
        var commentList = that.data.commentList;
        if (res.data.errcode == 0) {
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              result[i].CREATE_DATE = app.changeDate(result[i].CREATE_DATE);
            }
          }
          if (!commentList || page == 0) {
            commentList = result;
          } else {
            commentList = commentList.concat(result);
          }
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
                if (commentList[j].IMG_URL.length>1){
                  commentList[j].IMG_URL = commentList[j].IMG_URL.splice(0,1)
                }
              }
            }
            array = [];
          }
          //duplicateList去重
          for (var i = 0; i < commentList.length; i++) {
            that.data.duplicateList.push({
              "name": commentList[i].NICKNAME,
              "img": commentList[i].HEAD_SCULPTURE
            });
          }

          function removeRepeat(arr, key) {
            for (let i = 0; i < arr.length; i++) {
              for (let j = i + 1; j < arr.length; j++) {
                if (arr[i][key] === arr[j][key]) {
                  arr.splice(j, 1);
                  j = j - 1;
                }
              }
            }
          }
          removeRepeat(that.data.duplicateList, 'name');
          that.setData({
            duplicateList: that.data.duplicateList,
            commentList: commentList,
            loadMore: false,
            page: page,
            totalPages: res.data.result.totalPages
          })
          let list = [];
          commentList.map(item => {
            let obj = Object.assign(item, {
              selectd: false
            });
            list.push(obj);
          });
          that.setData({
            commentList: list
          })
          that.localpraise(commentList);
        } else {
          wx.showToast({
            title: res.data.msg,
          });
        }
      }
    })
  },
  //查看评论详细
  showUserComment: function(e) {
    var commentId = e.currentTarget.dataset.commentid;
    var articleId = this.data.articleId;
    wx.navigateTo({
      url: '../userComment/userComment?commentId=' + commentId + '&articleId=' + articleId
    })
  },
  //更新评论
  updateInfo: function(e) {
    var that = this;
    app.updateInfo(e, function() {
      that.getWxInformation(that.data.articleId,that.data.useCode);
    });
  },
  //资讯评论点赞
  infoCommentPraise: function(e) {
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
    that.getWxInformation(that.data.articleId,that.data.useCode);
  },
  //关注问题
  attentionComment: function(e) {
    var that = this;
    let bol = that.data.isAttentionComment;
    app.updateInfo(e, function() {
      bol = bol ? false : true;
      that.setData({
        isAttentionComment: bol
      });
      that.getCollectUsers(that.data.articleId);
    })
  },
  //存储点赞列表
  localpraise: function(commentList) {
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
  setHeight: function() {
    var that = this;
    var query = wx.createSelectorQuery();
    var listHeight;
    setTimeout(function() {
      query.selectAll('.questionTopBox').boundingClientRect()
      query.exec((res) => {
        console.log("res111",res)
        listHeight = res;
        console.log("listHeight[0]",listHeight[0])
        if(listHeight[0].length>0){
          that.setData({
            listQuestionHeight: listHeight[0][0].height
          })
        }
      });
    }, 200);
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
        url: '../index/index',
      })
    } else {
      //wx.navigateBack();
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },
  navMainPage: function () {
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
  },
  //获取关注的人
  getCollectUsers: function(infoId) {
    var that = this;
    var colletList = that.data.colletList;
    wx.request({
      url: queryCollectUser,
      data: {
        infoId: infoId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        let bol = that.data.isAttentionComment;
        colletList = res.data.result;
        colletList.forEach((item) => {
          if (item.ID == that.data.useCode) {
            bol = true;
          }
        });
        that.setData({
          colletList: colletList,
          isAttentionComment: bol
        })
      }
    })
  },
  opens: function(e) {
    if (e.currentTarget.dataset.item == '1') {
      this.setData({
        isstart: !this.data.isstart,
      });
    }
  },
  onclicks1: function(e) {
    var index = e.currentTarget.dataset.index;
    let name = this.data.slist[index].name;
    if (name == '热门回答') {
      this.selectInformationComment(this.data.articleId, this.data.page, 2);
      this.setData({
        listHeight: [],
        commentList:[]
      })
      this.lookDetail();
    } else {
      this.selectInformationComment(this.data.articleId, this.data.page, 1);
      this.setData({
        listHeight: [],
        commentList:[]
      })
      this.lookDetail();
    }
    this.setData({
      isstart: false,
      isfinish: false,
      isdates: false,
      start: this.data.slist[index].name,
      finish: "目的地"
    })
  }
})