// pages/cooperative/cooperative.js
const getUserTel = require('../../config').getUserTel;
const companyService = require('../../config').companyService;
const cooperativeApply = require('../../config').cooperativeApply;

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "region": ['', '', ''],
    "service":[],
    "index":0,
    "serviceArray":"",
    "serviceArrayId":"",
    "isshow ":false,
    "telType": "get",
    "companyName": '',
    "companyService": "",
    "companyServiceadd": "",
    "companyArea": "",
    "phoneNumber": "",
    "companyPerson": "",
    "applyType":"",
    "remarks":"",
    "phone":"",
    "titleText":"爱服务"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      applyType: options.type,
      navH: app.globalDatas.navHeight
    })
    this.getService();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, 
  bindRegionChange: function (e) {
    var region = e.detail.value;
    var that  = this;
    that.setData({
      region: region,
      companyArea: "中国" + region[0] + region[1] + region[2]
    })
  },
  bindServiceChange: function (e) {
    var that =this;
    var serviceArray = this.data.serviceArray;
    var index = e.detail.value;
    var isshow = false;
    var serviceArrayId = serviceArray[index].id;
    if (serviceArray[index].id=="000"){
      isshow=true;
    }
    that.setData({
      serviceArrayId: serviceArrayId ,
      index: index,
      isshow: isshow
    })
  },
  //调用手机号接口
  getPhoneNumber(e) {
    var that = this;
    if (e.detail.iv && e.detail.encryptedData) {
      that.getUserTel(e.detail.iv, e.detail.encryptedData);
    } else {
      that.setData({ telType: "input" })
    }
  },
  //获取手机号
  getUserTel: function (iv, encryptedData) {
    var that = this;
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
              if (result.data.errcode == 0) {
                var data = JSON.parse(result.data.msg);
                if (data.phoneNumber){
                  that.setData({
                    phoneNumber: data.phoneNumber,
                    telType: 'input',
                    issubmit: true
                  })
                }
                
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
  //输入公司名称
  inputCompanyName:function(e){
    var that = this;
    var companyName = e.detail.value;
    that.setData({
      'companyName': companyName
    })
  },
  //选择输入公司名称
  inputCompanyName: function (e) {
    var that = this;
    var companyName = e.detail.value;
    that.setData({
      'companyName': companyName
    })
  },

  //输入联系人
  inputCompanyPerson:function(e){
    var companyPerson = e.detail.value;
    var that = this;
    that.setData({
      'companyPerson': companyPerson
    })
  },
  //获取其他核心业务
  otherService: function (e) {
    var that = this;
    var remarks = e.detail.value;
    that.setData({
      'remarks': remarks
    })
  },
  //手动输入手机号码
  inputTel:function(e){
    var that = this;
    var phoneNumber = e.detail.value;
    that.setData({
      phoneNumber: phoneNumber
    })
  },
  //提交
  submit:function(){
    var that = this;
    that.cooperativeApply();

    
  },
  //获取核心业务
  getService:function(){
    var that = this;
    var serviceArray = [{
      id: "",
      name: "请选择"
    }];
    wx.request({
      url: companyService,
      success(res) {
        
        var result = res.data.result;
        if (result.length > 0 && res.data.errcode=="0"){
          for(var i =0;i<result.length;i++){
            var service={
              id: result[i].ID,
              name: result[i].INDUSTRY_NAME
            }
            serviceArray.push(service);
          }
          serviceArray.push({
            id: "000",
            name: "其他"
          })
          that.setData({
            serviceArray: serviceArray
          })
        }
      },
    })
  },
 
  //提交入住申请
  cooperativeApply:function(){
    var that = this;
    var custName = that.data.companyName;
    var addr = that.data.companyArea;
    var industryId = that.data.serviceArrayId;
    var linkName = that.data.companyPerson;
    var phoneNum = that.data.phoneNumber;
    var applyType = that.data.applyType;
    var remarks = that.data.remarks;
    console.log(remarks);
    var isSubmit = true;
    if (!custName){
      wx.showToast({
        title: '请输入公司名称',
      })
      return;
    }
    if (!addr) {
      wx.showToast({
        title: '请选择所在区域',
      })
      return;
    }
    if (!industryId) {
      wx.showToast({
        title: '请选择核心业务',
      })
      return;
    }
    if (industryId == "000" && !remarks){
      wx.showToast({
        title: '请输入其他业务',
      })
      return
    }
    if (!linkName) {
      wx.showToast({
        title: '请输入申请人',
      })
      return;
    }
    if (!phoneNum) {
      wx.showToast({
        title: '请输入手机号码',
      })
      return;
    }
    if (!app.provingMobile(phoneNum)){
      wx.showToast({
        title: '请输入正确号码',
      })
      return;
    }
    var data={
      custName: custName,
      addr: addr,
      industryId: industryId,
      linkName: linkName,
      phoneNum: phoneNum,
      applyType: applyType
    }
    wx.request({
      url: cooperativeApply,
      data: data,
      success(res) {
        if (res.data.errcode == "0" && res.data.msg =="success"){
            wx.showToast({
              title: '提交成功',
            });
          wx.navigateTo({
            url: '../Auditing/Auditing',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          });
        }
      },
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