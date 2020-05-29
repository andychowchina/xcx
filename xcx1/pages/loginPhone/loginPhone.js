// pages/loginPhone/loginPhone.js
const dailiOpenIdUnionId = require('../../config').dailiOpenIdUnionId
const app = getApp();
const openIdUnionId = require('../../config').openIdUnionId
const loginCheck = require('../../config').loginCheck
const loginRegister = require('../../config').loginRegister
const sendCode = require('../../config').sengCode
const validateCode = require('../../config').validateCode
const updateMyInfo = require('../../config').updateMyInfo;
const saveWxUserInfo = require('../../config').saveWxUserInfo
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneCode: true, //判断是展示输入手机号码模块还是验证码模块
    count: 60, //验证码倒计时
    inputPhone: "", //获取输入的电话号码
    Length: 6, //验证码输入框个数 
    isFocus: true, //伪输入框聚焦 
    Value: "", //伪输入框输入的验证码 
    ispassword: false, //是否密文显示 true为密文， false为明文。
    phoneRight: false, //电话号码合格，立即验证是可点击状态
    phone: "", //微信登录获取的手机号
    code: "", //微信登录获取的code
    iv:"",
    openId:"",
    UnionId:"",
    encryptedData:"",
    sendCodeId: "发送验证码接口返回的id用来验证验证码时用",
    codeButton: '获取验证码',
    wxZhuce:false,// 微信登录的注册
    isRightCode:false,//是否开始验证验证码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
  //  点击验证码输入框
  inputCode() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 伪输入框输入时
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
    if (that.data.Value.length == 6 && that.data.isRightCode) {
      this.validateCode( that.data.Value)
    }
  },

  //弹出提示信息
  alertInfo: function (message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
  },
  // 清除手机号码
  clearPhone: function () {
    var inputPhone = this.data.inputPhone.substr(0, this.data.inputPhone.length - 1)
    this.setData({
      inputPhone: inputPhone
    })
  },
  // 获取输入手机的号码
  getInputPhone: function (e) {
    if (e.detail.value !== '' && e.detail.value.length == 11) {
      this.setData({
        inputPhone: e.detail.value,
        phoneRight: true
      })
    } else {
      this.setData({
        inputPhone: e.detail.value,
        phoneRight: false
      })
    }
  },
  // 点击立即验证
  submitPhone: function (e) {
    var that= this
    if(!(/^1[34578]\d{9}$/.test(that.data.inputPhone))){
      wx.showToast({
        title: '请输入正确得手机号',
        icon:"none"
      })
      return
    }else{
      // that.getOpenId()
      that.loginCheck()
    }
  },
  // 用户点击登录后调用检测接口
  loginCheck: function () {
    var that = this
    wx.request({
      url: loginCheck,
      data: {
        mobile: that.data.inputPhone
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        var msg = res.data.msg
        console.log("msg",msg)
        if (msg == "0001") { //用户不存在,注册
          that.loginRegister(0)
        } else if (msg == "0002") { //需要验证绑定手机
          that.loginRegister(1)
        } else if (msg == "0000") { //存在用户，登录
          that.loginRegister(1)
        }
      },
      fail(err) {
        console.log("err", err)
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
          url: dailiOpenIdUnionId,
          data: data,
          method: 'POST',
          header: {
            "accept": "*/*",
            "content-type": "application/json"
          },
          success(res) {
            console.log("获取openid", res)
            var message = res.data.message
            var openId = JSON.parse(message)
            that.setData({
              openId: openId.openid,
            })
            that.loginCheck()
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
  // 登录注册
  loginRegister: function (LoginOrRegister) {
    var that = this
    wx.request({
      url: loginRegister,
      data: {
        mobile: that.data.inputPhone,
        LoginOrRegister:LoginOrRegister
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        console.log("哈哈哈",res)
        if(res.data.errcode=="0"){
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
        }else{
          console.log("注册请求失败")
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }

      },
      fail(err) {
        console.log("err", err)
      }
    })
  },
  // 登录注册
   // 18798013422 杨昌礼
  // loginRegister: function (LoginOrRegister) {
  //   var that = this
  //   var data = ""
  //   var  phoneData = {
  //     LoginOrRegister: LoginOrRegister,
  //     mobile: that.data.inputPhone,
  //   }
  //   var wxData = {
  //     code:that.data.code,
  //     iv:that.data.iv,
  //     encryptedData:that.data.encryptedData,
  //     LoginOrRegister:LoginOrRegister,
  //     UnionId:"",
  //     mobile: LoginOrRegister==0 ? that.data.phone : "",
  //     // mobile: LoginOrRegister==0 ? "18798013422" : "",
  //     OpenId:that.data.openId,
  //   }
  //   if(that.data.wxZhuce){
  //     data = wxData
  //   }else{
  //     data = phoneData
  //   }
  //   wx.request({
  //     url: loginRegister,
  //     data: data,
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
  //     },
  //     success(res) {
  //       console.log("444444444444",res)
  //       if(res.data.errcode){
  //         // ------
  //         if(that.data.wxZhuce&&LoginOrRegister=="0"){
  //           that.bindPhone()
  //         }else{}
  //         // -------
  //         var accessToken = res.data.result.token
  //         var nickname = res.data.result.nickname
  //         var pk = res.data.result.pk

  //         wx.setStorageSync('accessToken', accessToken)
  //         wx.setStorageSync('updataNickName', nickname)
  //         wx.setStorageSync('pk', pk)
  //         app.globalDatas.userCode = pk
  //         // app.globalDatas.isfrstLogin = false;
  //         wx.switchTab({
  //           url: '../index/index'
  //         });
  //       }else{
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon:"none"
  //         })
  //       }

  //     },
  //     fail(err) {
  //       console.log("err", err)
  //     }
  //   })
  // },
  // 发送验证码
  sendCode: function (phone) {
    var that = this
    wx.request({
      url: sendCode,
      data: {
        mobile:that.data.phone
        // mobile: "18798013422"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        var errcode = res.data.errcode
        var sendCodeId = res.data.msg
        if (errcode == "0") {
          that.setData({
            codeButton: "验证码已发送",
            sendCodeId: sendCodeId,
            isRightCode:true
          })
        } else {
          // 验证码发送失败

        }
      },
      fail(err) {
        console.log("err", err)
      }
    })
  },
  // 验证验证码
  validateCode: function (Value) {
    var that = this
    wx.request({
      url: validateCode,
      data: {
        mobile: that.data.phone,
        // mobile:"18798013422",
        code: Value,
        id: that.data.sendCodeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        var errcode = res.data.errcode
        if (errcode == "0") {
          that.setData({
            wxZhuce:true,
          })
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
          // that.bindPhone()//把验证了的手机号更新进去
          that.loginCheck() //检测接口
        } else {
          // 验证码错误
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
          // ---------------------
          that.setData({
            codeButton:"获取验证码"
          })
          if (that.data.codeButton !== '获取验证码') {
            return
          }
          const countDown = setInterval(() => {
            if (that.data.count <= 0) {
              that.setData({
                count: 60,
                codeButton: '获取验证码'
              })
              clearInterval(countDown)
              return
            }
            that.data.count--
            that.setData({
              count: that.data.count,
              codeButton: that.data.count < 10 ? `0${that.data.count}s后可以重发` : `${that.data.count}s后可以重发`
            })
          }, 1000);
          // -------------------
        }
      },
      fail(err) {
        console.log("err", err)
      }
    })
  },
  // 绑定微信登录得电话号码
  bindPhone: function () {
    var that = this
    var data = {
      phoneNumber: that.data.phone,
      pk: that.data.phone
    }
    wx.request({
      url: updateMyInfo,
      data: data,
      success(result) {
      },
      fail({ errMsg }) {
        console.log('request fail', errMsg)
        // that.setData({
        //   loading: false
        // })
      }
    })
  },
  // 返回上一步
  backLogin:function(){
      wx.switchTab({
        url: '../login/login',
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})