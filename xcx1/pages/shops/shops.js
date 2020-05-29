// pages/shops/shops.js
const app = getApp();
var API_URL = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
//获取店铺信息
var COOP_AND_SERVICE_URL = API_URL + 'smallService/selectCooperativeAndService.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopsImage: '../image/2.jpg',
    shopsName: '测试',
    shopsTel: '13322223333',
    shopsAddress: '测试',
    serviceImage: '../image/5.jpg',
    serviceTitle: '测试',
    serviceIntro: '测试',
    fwsId:'',
    titleText: '爱服务企业圈', //自定义导航栏标题
    dianpuInfo:[] ,// 店铺信息
    serviceManagerUrl: serviceManagerUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fwsid = options.fwsid;
    this.setData({ fwsId: fwsid, navH: app.globalDatas.navHeight})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDianPu();
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
  //弹出提示信息
  alertInfo: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 1000
    })
  },
  //获取店铺信息
  getDianPu:function(){
     var that = this;
     var fwsId = that.data.fwsId;
     wx.request({
       url: COOP_AND_SERVICE_URL,
       data:{
         coopId: fwsId
       },
       success:function(res){
          if(res.data.errcode=='0'){
            that.setData({
              dianpuInfo: res.data.result
            })
          }         
       }

     })
  },
  //点击服务进入服务详情
  serviceInfo:function(e){
    let smallServiceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + smallServiceId,
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