var app = getApp();
var host = app.globalDatas.baseUrl;
var addDtUrl = host + 'wxTopicClass/queryTopicClassList.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeList:[],
    host: app.globalDatas.serviceManagerUrl,
    titleText: '话题分类'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalDatas.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getWxInformation();
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
  getWxInformation: function () {
    let that = this;
    wx.request({
      url: addDtUrl,
      data: {
        yxbz: "Y",
        sort: "sx,asc"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json
      },
      success(res) {
        var result = res.data.result;
        //对象排序
        function compare(property) {
          return function (a, b) {
            return (a[property] - b[property])
          }
        }
        that.setData({
          themeList: result.sort(compare('sx'))
        });
      }
    })
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  //页面其事件处理
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  getTopic: function(e) {
    var themeid = e.currentTarget.dataset.themeid;
    wx.navigateTo({
      url: '../requestDT/requestDT?themeid=' + themeid,
    })
  }
})