// pages/myAttation/myAttation.js
const app = getApp();
var API_URL = app.globalDatas.baseUrl;
//查询关注
var GET_MY_ATTENTION = API_URL + 'wxAttention/myAttentions.do?authType=show';
//关注/取消关注
var GZ_OR_QX = API_URL + 'wxAttention/userAttention.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size:10,
    page:0,
    userid:'',
    searchLoading:true,
    searchLoadingComplete:false,
    myAttation:[], //查询出来的数据
    attationList:[] ,//本地存储点赞
    titleText: '关注'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userid = options.userid ? options.userid : app.globalDatas.userCode;
    this.setData({
      userid: userid,
      navH: app.globalDatas.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMyAttation();
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
      myAttation: []
    })
    that.getMyAttation();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    that.setData({
      page: page + 1
    });
    that.getMyAttation();

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
  //查询我的关注
  getMyAttation:function(){
    var that = this;
    var page = that.data.page;
    var size = that.data.size;
    var userId = that.data.userid;
    var attation = that.data.myAttation;
    wx.showLoading({
      title: '加载中',
    });
    wx:wx.request({
      url: GET_MY_ATTENTION,
      data: {
         page:page,
         size:size,
         userId:userId
      },
      success: function(res) {
        if(res.data.errcode=='0'){
          var result = res.data.result.content;
          if(result.length>0){
            let searchList = [];
            //如果没有数据则取出数据，有数据则添加
            attation.length === 0 ? searchList = result : searchList = attation.concat(result)
            that.setData({
              myAttation: searchList, //设置数据数组
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading: false
            });
            // if (attation.length < size) {
            //   that.setData({
            //     searchLoadingComplete: false
            //   });
            // } 
            that.localAttation(searchList);
          }else{
            that.setData({
              searchLoadingComplete: true, //把"没有数据"设为true，显示
              searchLoading:false
            });
          }

        }
      },
      fail: function(res) {
        that.alertInfo("调用接口失败");
      }
    })
    wx.hideLoading();
  },
  //关注/取消关注
  attation:function(e){
     var that = this;
     var index = e.currentTarget.dataset.index;
     var uid = e.currentTarget.dataset.uid; //关注的用户id
     var userId = app.globalDatas.userCode; //当前用户的ID
     var attationList = that.data.attationList;
     wx:wx.request({
       url: GZ_OR_QX,
       data: {
         userId:userId,
         coverUserId:uid
       },
       success: function(res) {
         if(res.data.errcode=='0'){
           attationList[index].isAttation = attationList[index].isAttation=="Y"?"N":"Y";
           that.setData({
             attationList: attationList
           })
         }
       },
       fail: function(res) {
         that.alertInfo("调用接口失败");
       }
     })
  },
  //存储关注列表
  localAttation: function (commentList) {
    var attationList = [];
    for (var i = 0; i < commentList.length; i++) {
      var local = {
        isAttation:"Y"
      }
      attationList.push(local);
    }
    this.setData({
      attationList: attationList,
    })
  },
  showUserInfo:function(e){
    app.showPerson(e);
  },
  loading:function(){
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 800);
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