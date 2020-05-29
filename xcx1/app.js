import QDTracker from './utils/QDTracker';//引入SDK
const saveWxUserInfo = require('config').saveWxUserInfo
const updateInformationById = require('config').updateInformationById;
const userAttention = require('config').userAttention;
const getPassUr = require('config').getPassUr;
// SDK 初始化配置
QDTracker.init({
  appid: 'wx227248a7ad80dacc',
  kfuin: '2852339863',
});
App({
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  globalDatas: {
    userCode: "",
    accessToken:"",
    isfrstLogin: true,
    
    baseUrl: 'https://www.gz12366.com.cn:20366/WeChatSys/',
    imageUrl: 'XXXXXXXX',
    serviceManagerUrl: 'http://222.85.150.179:17009//ServiceManager/..',

    // 测试地址
    // baseUrl: 'http://192.168.116.120:8080/WeChatSys/',
    // imageUrl: 'XXXXXXXX',
    // serviceManagerUrl: 'http://192.168.116.120:8080/',

    // baseUrl: 'http://192.168.116.119:8080/WeChatSys/',
    // imageUrl: 'XXXXXXXX',
    // serviceManagerUrl: 'http://192.168.116.119:8080/',

    // baseUrl: 'http://192.168.116.107:9003/WeChatSys/',
    // imageUrl: 'XXXXXXXX',
    // serviceManagerUrl: 'http://192.168.116.107:9003/',

    userInfo: null,
    navHeight: 0
  },
  getUserCode(cb) {
    this.getUserInfo()
  },
  onLaunch: function (options) {
    // this.globalDatas.userCode = options;
    // if (options.userCode) {
    //   this.globalDatas.userCode = options.userCode;
    // }
    // this.isLogin()//判断是否登录

    // ---------------
    var accessToken = wx.getStorageSync("accessToken")
    var pk = wx.getStorageSync("pk")
    this.globalDatas.userCode = pk
    this.globalDatas.accessToken = accessToken
    // ----------------
    wx.getSystemInfo({
        success: res => {
          //导航高度
          this.globalDatas.navHeight = res.statusBarHeight + 46;
          this.globalDatas.screenHeight = res.screenHeight - res.statusBarHeight - 46;
        },
        fail(err) {
          console.log(err);
        }
      }),
      this.linkUrl();
    this.updateManager()
  },

  aa:function(){
    console.log("dauin")
  },
  isLogin: function () {
    var that = this
    var accessToken = wx.getStorageSync("accessToken")
    var userPhone = wx.getStorageSync("userPhone")
    that.globalDatas.userCode = userPhone
    if (!accessToken) {
      wx.switchTab({
        url: '/pages/login/login',
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  // 版本更新问题
  updateManager: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了,但下载失败，请检查网络设置',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  // 当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function (options) {},
  //  当小程序从前台进入后台，会触发 onHide
  onHide: function () {},
  // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function (msg) {},
  //用户授权登录
  // userLogin: function (callback) {
  //   var that = this;
  //   //插入登录的用户的相关信息到数据库
  //   wx.login({
  //     success(res) {
  //       if (res.code) {
  //         that.getUserInfo(res.code, function () {
  //           callback();
  //         });
  //       } else {}
  //     }
  //   })
  // },
  userLogin: function (callback) {
    var that = this;
    if(that.globalDatas.userCode){
      callback();
    }
    return
    //插入登录的用户的相关信息到数据库
    wx.login({
      success(res) {
        if (res.code) {
          that.getUserInfo(res.code, function () {
            callback();
          });
        } else {}
      }
    })
  },
  //获取用户信息
  // getUserInfo: function (code, callback) {
  //   console.log("callback",callback)
  //   var that = this;
  //   wx.getUserInfo({
  //     success(res) {
  //       console.log("getUserInfoe ", res.data)
  //       wx.request({
  //         url: saveWxUserInfo,
  //         data: {
  //           encryptedData: res.encryptedData,
  //           iv: res.iv,
  //           code: code
  //         },
  //         success(e) {
  //           console.log("e ", e)
  //           if (e.data.errcode == '0') {
  //             that.globalDatas.userCode = e.data.msg
  //             that.globalDatas.isfrstLogin = false;
  //             wx.switchTab({
  //               url: '../index/index'
  //             });
  //             callback(res.data);

  //           } else {
  //             wx.showToast({
  //               title: e.data.msg,
  //             })
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  getUserInfo: function (code, callback) {
    console.log("callback",callback)
    var that = this;
    wx.getUserInfo({
      success(res) {
        console.log("getUserInfoe ", res.data)
        wx.request({
          url: saveWxUserInfo,
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv,
            code: code
          },
          success(e) {
            console.log("e ", e)
            if (e.data.errcode == '0') {
              that.globalDatas.userCode = e.data.msg
              // that.globalDatas.isfrstLogin = false;
              wx.switchTab({
                url: '../index/index'
              });
              callback(res.data);

            } else {
              wx.showToast({
                title: e.data.msg,
              })
            }
          }
        })
      }
    })
  },
  //更新资讯信息（点赞、关注）
  updateInfo: function (e, callBack) {
    var infoId = e.currentTarget.dataset.id;
    var infoType = e.currentTarget.dataset.type;
    var wxUserId = this.globalDatas.userCode;
    console.log("infoId", infoId)
    console.log("wxUserId", wxUserId)
    wx.request({
      method: 'POST',
      url: updateInformationById,
      data: {
        infoId: infoId,
        infoType: infoType,
        wxUserId: wxUserId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // wx.showToast({
        //   title: res.data.result.message,
        //   icon: 'succes',
        //   duration: 1000,
        //   mask: true
        // });
        callBack();
        // wx.navigateBack({});
      }
    })
  },
  //关注用户
  userAttention: function (e, callBack) {
    var coverUserId = e.currentTarget.dataset.coveruserid;
    var id = e.currentTarget.dataset.id;
    var userId = this.globalDatas.userCode;
    wx.request({
      method: 'POST',
      url: userAttention,
      data: {
        coverUserId: coverUserId,
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
        callBack();
        // wx.navigateBack({});
      }
    })
  },
  //全局变量

  //弹出加载框
  showLoad: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
  },

  hideShowLoad: function () {
    wx.hideLoading();
  },


  //显示大图
  showBigPicture: function (event) {
    var that = this;
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接 
      urls: that.changeImgArray(imgList) // 需要预览的图片http链接列表
    })
  },

  /*将图片转换成数组*/
  changeImgArray: function (imgList) {
    var imgArray = [];
    for (var i = 0; i < imgList.length; i++) {
      imgArray.push(imgList[i].Imageurl);
    }
    return imgArray;
  },
  //存储分享点赞列表
  localfunction: function (commentList, that) {

    var functionList = [];
    for (var i = 0; i < commentList.length; i++) {
      var functionText = {
        shareNumber: parseInt(commentList[i].shareNumber),
        greatNumber: parseInt(commentList[i].greatNumber),
        isPraise: commentList[i].isPraise
      }
      functionList.push(functionText);

    }
    that.setData({
      functionList: functionList,
    })
  },

  //分享点赞
  sharAndPraise: function (e, that) {
    var functionList = that.data.functionList;
    var type = e.currentTarget.dataset.type;
    var functionid = e.currentTarget.dataset.functionid;
    this.updateInfo(e, function () {
      if (type == "3") {
        var shareNumber = functionList[functionid].shareNumber;
        functionList[functionid].shareNumber = shareNumber + 1;
      } else {
        var greatNumber = functionList[functionid].greatNumber;
        functionList[functionid].isPraise = (functionList[functionid].isPraise == "true") ? "false" : "true";
        functionList[functionid].greatNumber = (functionList[functionid].isPraise == "true") ? (greatNumber + 1) : (greatNumber - 1);
      }
      that.setData({
        functionList: functionList,
      })
    });
  },
  //跳转到个人空间
  showPerson: function (e) {
    var userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../myPublish/myPublish?userid=' + userid,
    })
  },
  //时间戳转字符串
  changeDate: function (datetimes) {
    var currentTime = Date.parse(new Date());
    var d_day = Date.parse(new Date(datetimes));
    var day = Math.abs(parseInt((d_day - currentTime) / 1000 / 3600 / 24));
    //计算日期
    var hour = Math.abs(parseInt((d_day - currentTime) / 1000 / 3600));
    //计算小时
    var minutes = Math.abs(parseInt((d_day - currentTime) / 1000 / 60));
    //计算分钟
    var seconds = Math.abs(parseInt((d_day - currentTime) / 1000));
    //计算秒
    if (day >= 7) {
      return this.showTime(datetimes);
    } else if (day >= 2) {
      return (parseInt(day) + "天前").toString();
    } else if (day > 0 && day < 2) {
      return ("昨天").toString();
    } else if (hour > 0 && hour < 24) {
      return (parseInt(hour) + "小时前").toString();
    } else if (minutes > 0 && minutes < 60) {
      return (parseInt(minutes) + "分钟前").toString();
    } else if (seconds > 0 && seconds < 60) {
      return (parseInt(seconds) + "秒前").toString();
    }
  },
  //时间显示规则
  showTime: function (datetimes) {
    var date = new Date(datetimes);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() + '';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds() + 1 < 10 ? '0' + date.getSeconds() : date.getSeconds();
    //return Y + M + D + h + m + s;
    return Y + M + D;
  },
  //验证用户是否登录，未登录就跳转到用户登录界面；
  verifyLoginStatus: function () {
    var that = this
    wx.showModal({
      //title: '提示',
      content: '登录后才能继续操作，是否登录!',
      success: function (res) {
        if (res.cancel) {
          //console.log("点击了取消按钮");
        } else if (res.confirm) {
          wx.switchTab({
            url: '../login/login'
          });
        }
      }
    })
  },
  // verifyLoginStatus: function () {
  //   var that = this
  //   wx.showModal({
  //     //title: '提示',
  //     content: '登录后才能继续操作，是否登录!',
  //     success: function (res) {
  //       if (res.cancel) {
  //         //console.log("点击了取消按钮");
  //       } else if (res.confirm) {
  //         wx.switchTab({
  //           url: '../login/login'
  //         });
  //       }
  //     }
  //   })
  // },
  shouquan: function () {
    wx.getUserInfo({
      success(res) {
        var updataNickName = JSON.parse(res.rawData)
        wx.setStorageSync('updataNickName', updataNickName.nickName)
      }
    })
  },
  // lookGetSettig: function (callback) {
  //   var that = this;
  //   // 查看是否授权
  //   wx.getSetting({
  //     success: function (res) {
  //       console.log("res",res)
  //       if (res.authSetting['scope.userInfo']) {
  //         callback();
  //       } else {
  //         that.verifyLoginStatus();
  //       }
  //     }
  //   });
  // },
  // -------------------------
  lookGetSettig: function (callback) {
    var that = this;
    // 查看是否授权
    if(that.globalDatas.userCode){
      callback();
    }else{
      that.verifyLoginStatus();
    }
  },
  // ----------------------
  //验证手机号是否正确
  provingMobile: function (tel) {
    return /^(1[0 -9]\d{9})$/g.test(tel);
  },
  //验证网址是否正确
  provingUrl: function (linkUrl) {
    return /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/.test(linkUrl);
  },
  //清除空格
  clearBlank: function (value) {
    value = value.replace(/\s/ig, '');
    return value;
  },
  //显示话题
  showTopic: function (content) {
    var text = [];
    text = content.split(/\#([^\#|.]+)\#/g);
    // str.text = content.split(/#.+#/g);
    // console.log(str.text);
    return text;
  },
  /*获取设置白名单的域名 */
  getPassUrl: function () {
    wx.request({
      method: 'POST',
      url: userAttention,
      data: {
        coverUserId: coverUserId,
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
      }
    })
  },
  data: {
    zxList: ''
  },
  /*获取分享的链接信息*/
  linkUrl: function () {
    let that = this;
    wx.request({
      method: 'POST',
      url: getPassUr,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.errcode == 0)
          wx.setStorage({
            key: 'urlList',
            data: res.data.result.content
          })
        let list = res.data.result.content.map((item) => {
          item.classId = 5;
          item.addTime = that.changeDate(item.addTime);
          return item
        })
        that.data.zxList = list
      }
    })
  },
  /*根据白名单进行分类 */
  selectWhiteUrl: function (url) {
    if (!url) {
      return;
    }
    var urlList = wx.getStorageSync('urlList');
    for (var i in urlList) {
      if (url.indexOf(urlList[i].domain) == 0) {
        urlList[i].imageUrl = this.globalDatas.serviceManagerUrl + urlList[i].imageUrl;
        return urlList[i];
      }
    }
    return {
      title: "未知网址",
      imageUrl: '../../image/weizhiUrl.jpg'
    };
  }
})