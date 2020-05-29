// pages/dynamicInfo/dynamicInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fwalList: [{
      userImg: '../image/photo.jpg',
      userNickName: '测试用户',
      userInfoDate: '11:09 pm',
      userInfotype: '服务案例',
      fwalTitle: '标题',
      fwalText: '按时大大大现在出新阿萨德哇所大多哇爱仕达多群多无群奥术大师大大爱仕达多群无无多按时大大大现在出新阿萨德哇所大多哇爱仕达多群多无群奥术大师大大爱仕达多群无无多',
      fwalImage: [
        { Imageurl: 'http://222.85.150.179:17009/QueryChager/img/1.jpg' }
      ]
    }],
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
  showBigPicture: function (event) {
    // var src = event.currentTarget.dataset.src;//获取data-src
    // var imgList = event.currentTarget.dataset.list;//获取data-list
    // console.log(imgList);
    // //图片预览
    // wx.previewImage({
    //   current: src, // 当前显示图片的http链接
    //   urls: imgList // 需要预览的图片http链接列表
    // })
    var current = event.target.dataset.src; //预览图片 
    wx.previewImage({ current: current, urls: this.data.product.photoUrls, });
  }
})