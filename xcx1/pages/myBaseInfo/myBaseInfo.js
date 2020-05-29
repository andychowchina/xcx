// pages/myBaseInfo/myBaseInfo.js
const updateMyInfo = require('../../config').updateMyInfo;
const getUserTel = require('../../config').getUserTel;
const getMyInfo = require('../../config').getMyInfo;
const updateNickName = require('../../config').updateNickName;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'inputNumber': 0,
    'inputValue': '',
    "telType":'get',
      'name': '',
      'nickname': '',
      'phoneNumber': '',
      'custName': '',
      'interview': '',
      'issubmit':false,
      'titleText':"爱服务"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      navH: app.globalDatas.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo();
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

  },
  /*获取姓名*/
  inputName: function (e) {
    var name = e.detail.value;
    this.setData({
      'name': name,
      'issubmit':true
    })
  },
  // 获取昵称
  inputNickname(e){
    var nickname = e.detail.value;

    this.setData({
      'nickname': nickname,
      'issubmit': true
    })
  },
  /*获取自我介绍*/
  inputInterview: function (e) {
    var interview = e.detail.value;
    this.setData({
      'interview': interview,
      'issubmit': true,
      'inputNumber': e.detail.cursor
      
    })
  },
  /*获取电话*/
  inputTel: function (e) {
    var phoneNumber = e.detail.value;
    this.setData({
      'phoneNumber': phoneNumber,
      'issubmit': true
    })
  },
  /*获取公司名称*/
  inputCustName: function (e) {
    var custName = e.detail.value;
    this.setData({
      'custName': custName,
      'issubmit': true
    })
  },
  /*取消 */
  cancel: function () {
    wx.navigateBack({})
  },
  /*完成 */
  submit: function () {
    var that = this
    var data = {
      'name': this.data.name,
      "nickname": this.data.nickname,
      'phoneNumber': this.data.phoneNumber,
      'custName': this.data.custName,
      'interview': this.data.interview,
      'pk': app.globalDatas.userCode
    }
    this.updateMyInfo(data,that);
  },

  getPhoneNumber(e) {
    if (e.detail.iv&&e.detail.encryptedData){
      this.getUserTel(e.detail.iv, e.detail.encryptedData);
    }else{
      this.setData({ telType:"input"})
    }
  },

  //获取手机号
  getUserTel: function (iv,encryptedData){
    wx.showLoading({
      title: '正在获取',
    })
    var that= this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: getUserTel,
            data: {
              'encryptedData': encryptedData,
              'iv': iv,
              'code': res.code
            },
            success(result) {
             
              if (result.data.errcode==0){
                wx.hideLoading();
               var data = JSON.parse(result.data.msg);
               if(data.phoneNumber)
                 that.setData({
                  phoneNumber: data.phoneNumber,
                  telType:'input',
                   issubmit:true
                })
              }

            },

            fail({ errMsg }) {

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })   
  },
  //更新信息
  updateMyInfo: function (data,that){
    var that = this
    wx.showLoading('正在提交');
    wx.request({
      url: updateMyInfo,
      data: data,
      success(result) {
        if (result.data.errcode=="0"){
          wx.hideLoading();
          wx.setStorageSync('updataNickName', that.data.nickname)
          // that.updateNickName()
          wx.showToast({
            title: result.data.msg
          });
        }else{
          wx.hideLoading();
          wx.showToast({
            title: result.data.msg,
          })
        }
      },
      fail({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
  },
  //获取更改的昵称信息
  // updateNickName: function () {
  //   var that = this;
  //   wx.request({
  //     url: updateNickName,
  //     data: {
  //       'id': app.globalDatas.userCode
  //     },
  //     success(res) {
  //       wx.setStorageSync('updataNickName', res.data.result.nickname)
  //     },
  //     fail({ errMsg }) {
  //       console.log('request fail', errMsg)
  //     }
  //   })
  // },
  //获取用户信息
  getInfo:function(){
    var that  = this;
    wx.request({
      url: getMyInfo,
      data: {
        'pk': app.globalDatas.userCode,
      },
      success(res) {
        // var updataNickName = wx.getStorageSync("updataNickName")
        // if (updataNickName){
        //   wx.setStorageSync("saveNickName", updataNickName)
        // }else{
        //   wx.setStorageSync("saveNickName", res.data.result.nickname)
        // }
        that.setData({
          name: res.data.result.name?res.data.result.name:"",
          nickname: res.data.result.nickname ? res.data.result.nickname : '',
          phoneNumber: res.data.result.phoneNumber?res.data.result.phoneNumber : "",
          custName: res.data.result.custName?res.data.result.custName : "",
          interview: res.data.result.interview?res.data.result.interview : "",
          inputNumber: res.data.result.interview ? res.data.result.interview.length:""
        })
      },
      fail({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
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