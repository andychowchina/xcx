//const getMyServiceReservationsl = require('../../config').getMyServiceReservationsl;
const app = getApp();
var API_URL = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
//查询我预约的服务
var getMyServiceReservationsl = API_URL + 'customerBespoke/selectMyCusBespoke.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceManagerUrl: serviceManagerUrl,
    statusVlus:'0',
    crrentTabsIndex: "0",
    yyzt:"0" ,//预约状态
    serviceInfo:[],
    page:0,
    size:10,
    searchLoadingComplete:false,
    searchLoading: true,
    titleText: '爱服务企业圈'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalDatas.navHeight,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMyServiceReservationsl();
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
    var that = this;
    that.setData({
      page:0,
      serviceInfo:[]
    });
    that.getMyServiceReservationsl();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
     var that = this;
     var page = that.data.page;
     that.setData({
        page:page + 1
     });
    that.getMyServiceReservationsl();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getMyServiceReservationsl:function (){
    var that = this;
    var yyzt = that.data.yyzt;
    var page = that.data.page;
    var size = that.data.size;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: getMyServiceReservationsl,
      data:{
        userId: app.globalDatas.userCode,
        yyzt: yyzt,
        page:page,
        size:size
      },
      success:function(res){
        if(res.data.errcode=='0'){
          let result = res.data.result;
          if (result.length > 0) { //如果有数据
            for (var i = 0; i < res.data.result.length; i++) {
              res.data.result[i].ADDDATE = app.changeDate(res.data.result[i].ADDDATE);
            }
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.serviceInfo.length === 0 ? searchList = result : searchList = that.data.serviceInfo.concat(result)
            that.setData({
              serviceInfo: searchList, //获取数据数组
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false
            });
           
          } else {
            that.setData({
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading:false
            });
          }

        }
      }
    })
    //
    wx.hideLoading();
  },
  /**
 * 点击选项卡事件
 */
  swichNav: function (event) {
    var that = this;
    if (this.data.crrentTabsIndex === event.target.dataset.index) {
      return false;
    } else {
      that.setData({
        crrentTabsIndex: event.target.dataset.index,
        yyzt: event.target.dataset.index
      })
    }
    that.onPullDownRefresh();
  },
  /**
   * 跳转详情
   */
  getServiceInfo(event){
    let serviceId = event.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId,
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