// pages/publicDt/publicDt.js
const app = getApp();
var amapFile = require('../libs/amap-wx.js');
var host = app.globalDatas.baseUrl;
var uploadImgUrl = host + 'wxImage/uploadImg.do?authType=show';
var addDtUrl = host + 'wxInformation/insertInformation.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'informationClassId': '',
    'publishImages': '',
    'address': '点击获取定位',
    'longitude': '',
    'latitude': '',
    'content': '',
    'LocalImageList': [],
    'imageUrlList': [],
    'serviceid': '',
    'serviceimg': '',
    'servicename': '',
    'servicenum': '',
    'linkUrl':'',
    'topicsId':'',
    'topicsIdList':[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var topicsIdList = this.data.topicsIdList; 
    options.topicId ? topicsIdList.push(parseInt(options.topicId)) : [];
    this.setData({
      informationClassId: options.informationClassId,
      navH: app.globalDatas.navHeight,
      topicsIdList: topicsIdList,
      content: options.topicTitle ?'#'+ options.topicTitle+'#':'',
    })
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
    var  topicsIdList = this.data.topicsIdList;
    const topicsId = this.data.topicsId;

    if (topicsId){
      if (topicsIdList.length>0){
        for (var i = 0; i < topicsIdList.length;i++){
        if (topicsId == topicsIdList[i] ){
          return;
        }else{
          topicsIdList.push(topicsId);
        }
      }
      }else{
        topicsIdList.push(topicsId);
      }
      
    }
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
  /**
   * 获取发布动态内容
   */
  bindTextAreaBlur: function (e) {
    this.setData({
      content: e.detail.value,
    })
  },
  /**
   * 选择上传图片
   */
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
        //启动上传等待中...
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
  /**
   * 删除上传图片
   */
  deleteLocalImageList: function (e) {
    var LocalImageList = this.data.LocalImageList;
    var index = e.currentTarget.dataset.index;
    LocalImageList.splice(index, 1);
    this.setData({
      LocalImageList: LocalImageList,
      publishImages: LocalImageList,
    });
  },
  showPosition: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: "87a425ae40728e809fd1b29354d0a276"
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function (data) {
        that.setData({
          "address": data[0].regeocodeData.formatted_address,
          "longitude": longitude,
          "latitude": latitude,
        })

      },
      fail: function (info) { }
    });
  },
  /**
   * 添加动态
   */
  addDynamic: function () {
   
    var that = this;
    var LocalImageList = this.data.LocalImageList;
    wx.showToast({
      title: '正在提交...',
      icon: 'loading',
      mask: true
    });

    if (LocalImageList.length > 0) {
      this.uploadImag(LocalImageList);
    }else{
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
          });
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
  publicData: function (){
    var that = this;
    var wxUserId = app.globalDatas.userCode;
    var informationClassId = that.data.informationClassId;
    var content = that.data.content;
    const topicIdList = that.data.topicsIdList;
    wx.request({
      method: 'POST',
      url: addDtUrl,
      data: {
        informationClassId: informationClassId,
        wxUserId: wxUserId,
        releaseLocation: (that.data.longitude && that.data.latitude)? that.data.address:'',
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        content: that.data.content,
        imageUrlList: that.data.imageUrlList,
        smallServiceId: that.data.serviceid,
        topicIdList: JSON.stringify(topicIdList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        wx.hideLoading();
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
  selectService:function(){
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
  deleteServiceInfo:function(){
          this.setData({
            'serviceid': '',
            'serviceimg': '',
            'servicename': '',
            'servicenum': '',
          })
  },  
  //添加链接
  inputLink:function(e){
    var linkUrl = e.currentTarget.dataset.linkUrl;
    var url;
    if (linkUrl){
      url = '../inputLinkUrl/inputLinkUrl?text=' + linkUrl;
    }else{
      url = '../inputLinkUrl/inputLinkUrl?text=';
    }
    wx.navigateTo({
      url: url,
    })
  },
  /*打开链接*/
  showLinkUrl:function(e){
    var link = e.currentTarget.dataset.linkurl;
    wx.navigateTo({
      url: '../showLink/showLink?linkUrl=' + link,
    })
  },
  /*返回*/
  navBack: function () {
    wx.navigateBack();
  },
  /*选择话题 */
  topicsList: function () {
    var content = this.data.content;
    wx.navigateTo({
      url: '../topics/topics?content=' + content,
    })
  },
  /*获取定位 */
  getPosition:function(){
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