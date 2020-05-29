// pages/inputText/inputText.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'inputNumber': 0,
    'inputValue': '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({ 'options': options });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      navH: app.globalDatas.navHeight,
    })
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
  /*输入文本 */
  inputText: function (e) {
    var num = e.detail.cursor;
    var text = e.detail.value;
    this.setData({
      'inputNumber': num,
      'inputValue': text
    })
  },
  /*取消 */
  cancel: function () {
    wx.navigateBack({})
  },
  /*完成 */
  submit: function () {
    var options = this.data.options;
    var resourceLinks = app.clearBlank(this.data.inputValue);
    if (!app.provingUrl(resourceLinks)){
      wx.showToast({
        title: "必须是http/https/ftp开头的正确连接",
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../publicLink/publicLink?resourceLinks=' + resourceLinks + '&informationClassId=' + options.informationClassId,
    })
  }
})