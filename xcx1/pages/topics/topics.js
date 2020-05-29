// pages/topics/topics.js
const app = getApp();
const getTopics = require('../../config').getTopics;
// const urlhost = require('../../config').host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic:'',
    topics:[],
    page: 0,
    content:'',
    showMore: true,
    finishShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var content = options.content;
    this.setData({ navH: app.globalDatas.navHeight, scrH: app.globalDatas.screenHeight, content: content})
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
    var page = this.data.page;
    this.getTopics();
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page + 1;
    this.setData({
      showMore: true,
      page: page
    })
    this.getTopics();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  selectTopics:function(e){
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    const index = parseInt(e.currentTarget.dataset.num);
    const topics = this.data.topics;
    const topicsTitle = topics[index].TITLE;
    const topicsId = topics[index].ID
    const content = this.data.content;
    prevPage.setData({ 'content': content + "#" + topicsTitle + "#", topicsId: topicsId});
    wx.navigateBack({});
  },
  //获取话题
  getTopics: function (e){
    var that = this;
    var topics = that.data.topics;
    var finishShow = false;
    var page = this.data.page;
    if (e){
      var topic = e.detail.value;
      page = 0;
    }else{
      var topic =this.data.topic;
    }
   
    wx.request({
      url: getTopics,
      data:{
        'page': page,
        'size':10,
        'title': topic
      },
      success(res) {
        var data  = res.data;
        
        if (data.errcode==0){
          if (data.result.content.length>0){
            if (e) {
              topics = data.result.content;
              page = 0;
            } else {
              topics = topics.concat(data.result.content);
            }
            for (var i = 0; i < topics.length; i++) {
              topics[i].IMG_URL = app.globalDatas.serviceManagerUrl + topics[i].IMG_URL;
              topics[i].CONTENT = topics[i].CONTENT.split("\n")[0];
            }
          }else{
            finishShow = true;
            
          }
          
          that.setData({
            finishShow: finishShow,
            showMore: false,
            topics: topics,
            topic: topic,
            page:page
          })
        }else{
          wx.showToast({
            title: data.msg,
          })
        }
      }
    })
  },
   //搜索话题
  // serchTopics:function(e){
  //   var that = this;
  //   var topics = that.data.topics;
  //   var showMore = false;
  //   var  topic = e.detail.value;
  //   wx.request({
  //     url: getTopics,
  //     data: {
  //      'page': 0,
  //      'size': 10,
  //      'title': topic
  //     },
  //     success(res) {
  //       var data = res.data;
  //       if (data.errcode == 0) {
  //         if (data.result.content.length > 0) {
  //           topics = topics.concat(data.result.content);
  //           for (var i = 0; i < topics.length; i++) {
  //             topics[i].IMG_URL = app.globalDatas.serviceManagerUrl + topics[i].IMG_URL;
  //             topics[i].CONTENT = topics[i].CONTENT.split("\n")[0];
  //           }
  //         } else {
  //           finishShow = true;

  //         }

  //         that.setData({
  //           finishShow: finishShow,
  //           showMore: false,
  //           topics: topics
  //         })
  //       } else {
  //         wx.showToast({
  //           title: data.msg,
  //         })
  //       }
  //     }
  //   })
  // }
})