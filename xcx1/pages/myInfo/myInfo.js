// pages/myInfo/myInfo.js
const app = getApp();
const getMyPublicInformations = require('../../config').getMyPublicInformations;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publishType: 'show',
    publishText: '+',
    isShow: false,
    userid:"",
    nickName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userid = options.userid ? options.userid : app.globalDatas.userCode;
    this.setData({
      navH: app.globalDatas.navHeight,
      userid: userid
    })
    this.getMyPublicInfo(userid);
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    setTimeout(_ => {
      this.popup = this.selectComponent("#buttomMenu").getMessageList(this.data.userid); //组件的id
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyPublicInfo(this.data.userid);
    // const updataNickName = wx.getStorageSync("updataNickName")
    // this.setData({
    //   updataNickName: updataNickName
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  jumpMyBaseInfo: function() {
    var execute_function = function(){
      wx.navigateTo({
        url: '../myBaseInfo/myBaseInfo'
      })
    };
    app.lookGetSettig(execute_function);
  },
  
  //发布动态
  jumpPublicDt: function(e) {
    this.showButtonPublish("hide");
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../publicDt/publicDt?informationClassId=' + informationClassId
    })
  },
  //发布提问
  jumpPublicTw: function(e) {
    this.showButtonPublish("hide");
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../publicTw/publicTw?informationClassId=' + informationClassId
    })
  },
  //发布活动和案例
  publicAlAndHd: function(e) {
    this.showButtonPublish("hide");
    var informationClassId = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../publicAlAndHd/publicAlAndHd?informationClassId=' + informationClassId
    })
  },
  //发布
  showPublishBtn: function(res) {
    var btntype = res.currentTarget.dataset.type; //获取data-list 
    this.showButtonPublish(btntype);
  },
  /*弹出按钮功能*/
  showButtonPublish: function(btntype) {
    var animation = wx.createAnimation();
    if (btntype == "show") {
      this.setData({
        publishText: '×',
        publishType: 'hide',
        isShow: true
      })
      this.showDtBut(animation);
      this.showHdBut(animation);
      this.showAlBut(animation);
      this.showWdBut(animation);
    } else {
      this.setData({
        publishText: '+',
        publishType: 'show',
        isShow: false
      })
      this.hideDtBut(animation);
      this.hideHdBut(animation);
      this.hideAlBut(animation);
      this.hideWdBut(animation);
    }
  },

  /*弹出各类型的框*/
  showDtBut: function(animation) {
    animation.translate(-70, -85).step();
    this.setData({
      animationDT: animation.export()
    });
  },
  showHdBut: function(animation) {
    setTimeout(function() {
      animation.translate(-20, -85).step()
      this.setData({
        animationHd: animation.export()
      })
    }.bind(this), 150)
  },
  showAlBut: function(animation) {
    setTimeout(function() {
      animation.translate(30, -85).step()
      this.setData({
        animationAl: animation.export()
      })
    }.bind(this), 300)
  },
  showWdBut: function(animation) {
    setTimeout(function() {
      animation.translate(80, -85).step()
      this.setData({
        animationWd: animation.export()
      })
    }.bind(this), 450)
  },
  //隐藏各种框
  hideDtBut: function(animation) {
    animation.translate(0, 0).step();
    this.setData({
      animationDT: animation.export()
    });
  },
  hideHdBut: function(animation) {
    animation.translate(0, 0).step()
    this.setData({
      animationHd: animation.export()
    });
  },
  hideAlBut: function(animation) {
    animation.translate(0, 0).step()
    this.setData({
      animationAl: animation.export()
    })
  },
  hideWdBut: function(animation) {
    animation.translate(0, 0).step()
    this.setData({
      animationWd: animation.export()
    });
  },
  //首页切换标签
  indexSwitchTab: function(event) {
    var url = event.currentTarget.dataset.url; //获取data-url
    wx.reLaunch({
      url: url
    })
  },
  //跳转页面
  jumpMy: function(e) {
    var execute_function = function(){
      var url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
      })
    };
    app.lookGetSettig(execute_function);
  },
  //服务入住
  cooperative: function() {
    var execute_function = function(){
      wx.showActionSheet({
        itemList: ["免费入驻", "深度合作"],
        itemColor: "#0099CC",
        success(res) {
          wx.navigateTo({
            url: '../cooperative/cooperative?type=' + res.tapIndex,
          })
        }
      })
    }
    app.lookGetSettig(execute_function);
  },
  //功能建议跳到客服页面
  customerService: function (e) {
    wx.reLaunch({
      url: '../message/message'
    })
  },
  openContact(e) {
    var that = this;
    // 查看是否授权
    var execute_function = function(){
      that.setData({
        contactType: 'contact'
      });
    };
    app.lookGetSettig(execute_function);
  },
  //关注的问题
  attentionQuestion: function () {
    var that = this;
    var execute_function = function(){
      wx.navigateTo({
        url: '../isAttentionQuestion/isAttentionQuestion?userid=' + that.data.userid,
      })
    }
    app.lookGetSettig(execute_function);
  },
  //获取个人首页信息
  getMyPublicInfo: function (userid){
    var that = this;
    //发送请求
    wx.request({
      url: getMyPublicInformations, // 仅为示例，并非真实的接口地址
      data: {
        "page": 0,
        "size": 0,
        "userId": userid,
        "inforClassId":'',
        "iUserId": userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("res",res)

        if (res.statusCode == 200) {
          if (res.data.errcode != 0) {
            //如果数据加载失败，则提示
            wx.showToast({
              title: "您当前尚未登录",
              icon: 'fail',
              duration: 1000
            });
            return;
          }

          //返回成功
          var resCount = res.data.result.info;
          that.setData({
            dtNumber: resCount.INF_COUNT,
            gzNumber: resCount.ATTEN_COUNT,
            fansNumber: resCount.COL_COUNT,
            nickName: resCount.NICKNAME
          });
        } 
      },
      complete: function () {        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh()      //停止下拉刷新
      }
    })
  }
})