// pages/publicDt/publicDt.js
var amapFile = require('../libs/amap-wx.js');
const app = getApp();
var host = app.globalDatas.baseUrl;
var uploadImgUrl = host + 'wxImage/uploadImg.do?authType=show';
var addDtUrl = host + 'wxInformation/insertInformation.do?authType=show';
console.log(addDtUrl);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'informationClassId': '',
    'question': '',
    'content': '',
    'publishImages': '',
    'address': '点击获取定位..',
    'longitude': '',
    'latitude': '',
    'LocalImageList': [],
    'imageUrlList': [],
    'serviceid': '',
    'serviceimg': '',
    'servicename': '',
    'servicenum': ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      informationClassId: options.informationClassId,
      question: options.question,
      navH: app.globalDatas.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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
  //获取问题
  question: function(e){
    this.setData({
      question: e.detail.value
    })
  },
  //获取问题描述
  bindTextAreaBlur: function(e){
    this.setData({
      content: e.detail.value
    })
  },
  //选择上传图片
  selectImage: function (e) {
    var that = this;
    var LocalImageList = this.data.LocalImageList;
    var size = 9 - e.currentTarget.dataset.imageslength;
    wx.chooseImage({
      count: size,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        // tempFilePath可以作为img标签的src属性显示图片
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (LocalImageList.length >= 9) {
            that.setData({
              LocalImageList: LocalImageList
            });
            return false;
          } else {
            LocalImageList.push(tempFilePaths[i]);
          }
        }
        that.setData({
          'publishImages': LocalImageList
        })
      }
    })
  },
  //删除上传图片
  deleteLocalImageList: function (e) {
    var LocalImageList = this.data.LocalImageList;
    var index = e.currentTarget.dataset.index;
    LocalImageList.splice(index, 1);
    this.setData({
      LocalImageList: LocalImageList,
      publishImages: LocalImageList
    });
  },
  showPosition: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: "87a425ae40728e809fd1b29354d0a276" });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        that.setData({
          "address": data[0].regeocodeData.formatted_address,
          "longitude": longitude,
          "latitude": latitude
        })

      },
      fail: function (info) { }
    });
  },
  /**
   * 添加问答
   */
  addQuiz: function () {
    var that = this;
    var LocalImageList = this.data.LocalImageList;
    wx.showToast({
      title: '正在提交...',
      icon: 'loading',
      mask: true,
      duration: 10000
    });

    if (LocalImageList.length > 0) {
      this.uploadImag(LocalImageList);
    } else {
      that.publicData();
    }
  },
  /**
   * 上传图片
   */
  uploadImag: function (tempFilePath, num, successnum, failnum) {
    var flag = false;
    var imageUrlList = this.data.imageUrlList;
    var length = tempFilePath.length,
      that = this,
      i = num ? num : 0,
      success = successnum ? successnum : 0,
      fail = failnum ? failnum : 0;
    wx.uploadFile({
      url: uploadImgUrl,
      filePath: tempFilePath[i],
      name: 'file',
      formData: {
        uploadFolder: 'image/dtImg'
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        success++;
        var jsonData = JSON.parse(res.data);
        var imageUrl = {
          imgUrl: jsonData['result'][0]
        }
        imageUrlList.push(imageUrl);
      },
      fail: function (res) {
        fail++;
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      },
      complete: function (res) {
        i++;
        if (length == success) { //当图片传完时，停止调用
          that.setData({
            'imageUrlList': JSON.stringify(imageUrlList)
          })
          that.publicData();
        } else { //若图片还没有传完，则继续调用函数
          i = i;
          success = success;
          fail = fail;
          that.uploadImag(tempFilePath, i, success, fail)
        }
      }
    });

  },
  //提交数据
  publicData: function () {
    var that = this;
    var wxUserId = app.globalDatas.userCode;
    var informationClassId = that.data.informationClassId;
    wx.request({
      method: 'POST',
      url: addDtUrl,
      data: {
        informationClassId: informationClassId,
        wxUserId: wxUserId,
        releaseLocation: that.data.address,
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        title: that.data.question,
        content: that.data.content,
        imageUrlList: that.data.imageUrlList,
        smallServiceId: that.data.serviceid,
        topicIdList: []
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.errcode == 0) {
          wx.navigateBack({});
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 5000
          })
        }
      }
    })
  },
  //选择服务
  selectService: function () {
    wx.navigateTo({
      url: '../service/service?selectServeice=true',
    })
  },
  //跳转详情页面
  goServiceInfo: function (e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId,
    })
  },
  //删除详情页
  deleteServiceInfo: function () {
    this.setData({
      'serviceid': '',
      'serviceimg': '',
      'servicename': '',
      'servicenum': '',
    })
  },
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  /*获取定位 */
  getPosition: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.showPosition(longitude, latitude);
      },
      fail(res) {
        that.setData({
          "address": "定位失败，请授权"
        })
      }
    })
  }
})