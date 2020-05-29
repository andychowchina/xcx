// const openIdUnionId = require('../../config').openIdUnionId
const loginCheck = require('../../config').loginCheck
const openIdUnionId = require('../../config').openIdUnionId
const loginRegister = require('../../config').loginRegister


var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId: "", //获取的openid
    unionId: "",
    iv: "",
    encryptedData: "",
    isLogin: false, //判断是登录还是注册
  },
  onLoad: function () {
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          if (that.globalDatas.isfrstLogin) {
            app.userLogin(function () {
              wx.switchTab({
                url: '../index/index'
              });
            });

          }
        } else {
          // wx.switchTab({
          //   url: '../login/login'
          // });
        }
      }
    })
  },
  // 点击输入电话
  loginPhone() {
    wx.navigateTo({
      url: '../loginPhone/loginPhone',
    })
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.userLogin(function () {});
      app.shouquan()
    } else {
      //用户按了拒绝按钮
      // wx.showModal({
      //   title: '警告',
      //   content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
      //   showCancel: false,
      //   confirmText: '返回授权',
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击了“返回授权”')
      //     }
      //   }
      // })
      wx.switchTab({
        url: '../index/index'
      });
    }
  },
  getPhoneNumber: function (e) {
    console.log("e", e)
    var that = this
    if (e.detail.userInfo) { //允许授权
      wx.showLoading({
        title: '加载中',
      })
      var iv = e.detail.iv
      var encryptedData = e.detail.encryptedData
      wx.login({
        success: res => {
          var code = res.code
          console.log("code", code)
          wx.request({
            url: openIdUnionId,
            data: {
              code: code,
              iv: iv,
              encryptedData: encryptedData
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
            },
            success(res) {
              if (res.data.errcode == "0") {
                console.log("resjfjfjfj", res)
                that.setData({
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData,
                  openId: res.data.result.openId,
                  unionId: res.data.result.unionId,
                })
                that.loginCheck()
              } else {
                wx.showToast({
                  title: res.data.msg + "再试一次",
                  icon: "none"
                })
              }
            }
          })
        }
      });
    } else { // 拒绝授权
      wx: wx.showToast({
        title: '你拒绝了授权',
        icon: 'icon'
      })
    }
  },
  //  检测接口
  loginCheck: function () {
    var that = this
    wx.request({
      url: loginCheck,
      data: {
        OpenId: that.data.openId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        console.log("userLogin", res)
        var msg = res.data.msg
        if (msg == "0001") { //用户不存在,注册
          that.loginRegister(0)
        } else if (msg == "0002") { //需要验证绑定手机
          that.loginRegister(1)
          that.setData({
            isLogin: true
          })
        } else if (msg == "0000") { //存在用户，登录
          that.setData({
            isLogin: true
          })
          that.loginRegister(1)
        }
      },
      fail(err) {
        console.log("err", err)
      }
    })
  },
  // 登录注册
  loginRegister: function (LoginOrRegister) {
    var that = this
    wx.login({
      success(res) {
        var data = ""
        var wxLogin = {
          OpenId: that.data.openId,
          LoginOrRegister: LoginOrRegister
        }
        var wxZhuce = {
          code: res.code,
          iv: that.data.iv,
          encryptedData: that.data.encryptedData,
          LoginOrRegister: LoginOrRegister,
          UnionId: that.data.unionId,
          OpenId: that.data.openId,
          LoginOrRegister: LoginOrRegister
        }
        if (that.data.isLogin) {
          data = wxLogin
        } else {
          data = wxZhuce
        }
        wx.request({
          url: loginRegister,
          data: data,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
          },
          success(res) {
            console.log("444444444444", res)
            if (res.data.errcode == "0") {
              var accessToken = res.data.result.token
              var nickname = res.data.result.nickname
              var pk = res.data.result.pk

              wx.setStorageSync('accessToken', accessToken)
              wx.setStorageSync('updataNickName', nickname)
              wx.setStorageSync('pk', pk)
              app.globalDatas.userCode = pk
              wx.switchTab({
                url: '../index/index'
              });
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            }

          },
          fail(err) {
            console.log("err", err)
          }
        })
      }
    })

  },
  // 获取openid
  getOpenId: function () {
    var that = this
    wx.login({
      success: res => {
        var code = res.code
        var data = {
          "appid": "wx227248a7ad80dacc",
          "secret": "19f1d96d254d52457b78fa4662056ff7",
          "grant_type": "authorization_code",
          "js_code": code,
          "SERVICE_URL": "https://api.weixin.qq.com/sns/jscode2session"
        }
        wx.request({
          url: openIdUnionId,
          data: data,
          method: 'POST',
          header: {
            "accept": "*/*",
            "content-type": "application/json"
          },
          success(res) {
            console.log("resyyyyyyyyyyyy", res)
            var message = res.data.message
            var openId = JSON.parse(message)
            that.setData({
              openId: openId.openid,
              code: code
            })
            wx.redirectTo({
              url: '../loginPhone/loginPhone?phoneCode=phoneCode&phone=' + that.data.phone + "&iv=" + that.data.iv + "&encryptedData=" + that.data.encryptedData + "&openId=" + that.data.openId + "&code=" + that.data.code
            })
          },
          fail(err) {
            console.log("err", err)
          }
        })
      },
      fail: res => {
        toast.show({
          content: '微信登录失败'
        });
      }
    });

  },
})