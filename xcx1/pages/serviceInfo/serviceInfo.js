// pages/serviceInfo/serviceInfo.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
var API_URL = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
//获取服务
var GET_SERVICE_URL = API_URL + 'smallService/selectSmallServiceById.do?authType=show';
//预约服务
var SAVE_SERVICE_CON_URL = API_URL + 'customerBespoke/serviceConvention.do?authType=show';
//收藏服务
var SC_SERVICE = API_URL + 'wxServiceCollect/collectionService.do?authType=show';
//判断服务是否收藏
var IS_COLLECTION = API_URL + 'wxServiceCollect/isCollection.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    smallServiceId: '', //id
    smallService: '', //服务对象
    isShow: false,
    telType: 'input',
    isCollect: '', //是否收藏
    serviceManagerUrl: serviceManagerUrl,
    url: '',
    fwsId: '',
    titleText: '爱服务',
    userCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let serviceId = options.smallServiceId;
    var fwsId = options.fwsid;
    var isShare = options.isShare ? options.isShare : "";
    var url = '/pages/service/service';
    this.setData({
      smallServiceId: serviceId,
      navH: app.globalDatas.navHeight,
      url: url,
      isShare: isShare,
      fwsId: fwsId,
      userCode: app.globalDatas.userCode
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getSmallServiceById();
    this.isCollection();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    this.getSmallServiceById();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var title = res.target.dataset.title;
    res.from //转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
    res.target //如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
    return {
      title: title, //转发标题,默认当前小程序名称
      path: '/pages/dynamicInfo/dynamicInfo?articleId=' + id, //转发路径, 默认当前页面 path, 必须是以 / 开头的完整路径
      success: function(res) { // 转发成功
        res.errMsg //shareAppMessage:ok 转发成功
        res.shareTickets //shareTicket 数组，每一项是一个 shareTicket ，对应一个转发对象
      },
      fai: function(res) {
        res.errMsg //shareAppMessage:fail cancel   用户取消转发
        res.errMsg //shareAppMessage:fail (detail message) 转发失败，其中 detail message 为详细失败信息
      },
      complete: function(res) { // 转发结束
      }
    }
  },

  //根据服务ID获取服务
  getSmallServiceById: function() {
    wx.showLoading({
      title: '加载中',
    });

    let that = this;
    let serviceId = that.data.smallServiceId;
    wx.request({
      url: GET_SERVICE_URL,
      data: {
        serviceId: serviceId
      },
      success: function(res) {
        var result = res.data.result;
        if (res.data.errcode == '0') {
          var content = result.content;
          WxParse.wxParse('content', 'html', content, that, 3);
          that.setData({
            smallService: result
          })
        }
      },
      fail: function(res) {
        that.alertInfo("请求失败")
      }

    })
    setTimeout(function() {
      wx.hideLoading()
    }, 500)
    // wx.hideLoading();
  },
  //点击预约服务
  bookService: function() {
    var that = this
    var execute_function = function(){
      that.setData({
        isShow: true
      });
    };
    app.lookGetSettig(execute_function);
  },
  // 关闭预约客服
  close1:function(){
    this.setData({
      isShow: false
    });
    console.log("guanbi")
  },
  hideInput: function() {
    this.setData({
      isShow: false
    });
  },
  //预约服务
  serviceConvention: function(e) {
    let that = this;
    let data = e.detail.value;
    let name = data.contact;
    let phone = data.phone;
    if (name == '') {
      that.alertInfo("请输入联系人姓名");
      return;
    }
    if (phone == '' || phone.length != 11) {
      that.alertInfo("请输入正确的手机号码");
      return;
    }
    wx.request({
      url: SAVE_SERVICE_CON_URL,
      data: {
        userId: that.data.userCode, //用户ID需要修改
        serviceId: e.currentTarget.dataset.serviceid,
        serviceName: e.currentTarget.dataset.servicename,
        coopId: e.currentTarget.dataset.fwsid,
        contact: name,
        phone: phone,
        state: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function(res) {
        if (res.data.errcode == '0') {
          that.setData({
            isShow: false
          })
          that.alertInfo("预约成功");
          return;
        } else {
          that.alertInfo(res.data.msg);
          return;
        }
      },
      fail: function(res) {
        that.alertInfo("请求失败")
      }
    })

  },
  //弹出提示信息
  alertInfo: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 1000
    })
  },
  //店铺
  dianpu: function(e) {
    let that = this;
    let fwsid = e.currentTarget.dataset.fwsid;
    if (fwsid == '' || fwsid == undefined) {
      that.alertInfo("暂无店铺数据");
      return;
    }
    //跳转页面
    wx.navigateTo({
      url: '../shops/shops?fwsid=' + fwsid,
    })

  },
  //收藏服务
  shoucang: function(e) {
    var that = this;
    let serviceid = e.currentTarget.dataset.serviceid;
    wx.request({
      method: 'POST',
      url: SC_SERVICE,
      data: {
        userId: that.data.userCode, //用户ID需要修改
        serviceId: serviceid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function(res) {
        if (res.data.msg == "success") {
          that.alertInfo("收藏成功");
        } else {
          that.alertInfo(res.data.msg);
        }
        that.isCollection();
      }
    });
  },
  //判断用户是否收藏了该服务
  isCollection: function() {
    var that = this;
    let serviceId = this.data.smallServiceId;
    wx.request({
      method: 'POST',
      url: IS_COLLECTION,
      data: {
        userId: that.data.userCode,
        serviceId: serviceId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function(res) {
        if (res.data.errcode == '0') {
          that.setData({
            isCollect: res.data.result
          });
        } else {
          that.alertInfo(res.data.msg);
          return;
        }
      }
    })
  },
  /*导航栏返回按钮 */
  navBack: function() {

    var url = this.data.url;
    var isShare = this.data.isShare;

    if (isShare) {
      wx.reLaunch({
        url: url,
      })
    } else {
      wx.navigateBack()
    }
  },
  completemessage:function(e){
    console.log("客服e",e)
    if(e.detail.errcode=="0" || e.detail.errcode=="-3006"){
      wx.showToast({
        title: '微信服务通知查看',
        icon:"none"
      })
    }
    if(e.detail.errcode=="-3002"){
      wx.showToast({
        title: '获取插件配置信息失败',
        icon:"none"
      })
    }
    if(e.detail.errcode=="-3004"){
      wx.showToast({
        title: '用户信息授权失败',
        icon:"none"
      })
    }
    if(e.detail.errcode=="-3005"){
      wx.showToast({
        title: '客服消息发送失败',
        icon:"none"
      })
    }
    if(e.detail.errcode=="-3008"){
      wx.showToast({
        title: '当前配置没有客服人员',
        icon:"none"
      })
    }
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }

})