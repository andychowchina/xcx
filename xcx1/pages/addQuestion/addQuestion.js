// pages/publicDt/publicDt.js
const app = getApp();
var amapFile = require('../libs/amap-wx.js');
var host = app.globalDatas.baseUrl;
var uploadImgUrl = host + 'wxImage/uploadImg.do?authType=show';
var addDtUrl = host + 'wxInformation/insertInformation.do?authType=show';
var addDtUrlTwo = host + 'wxTopicClass/queryTopicClassList.do?authType=show';
const addInformationComment = require('../../config').addInformationComment;
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
    'contentTitle': '',
    'LocalImageList': [],
    'imageUrlList': [],
    'serviceid': '',
    'serviceimg': '',
    'servicename': '',
    'servicenum': '',
    'linkUrl': '',
    'themeList': [],
    'host': require('../../config').host,
    'isChecked': true,
    'num': 0,
    'titleText': '回答'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var informationId = options.informationClassId ? options.informationClassId : "";

    this.setData({
      informationClassId: informationId,
      navH: app.globalDatas.navHeight,
      content: options.topicTitle ? '#' + options.topicTitle + '#' : '',
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
  bindTitleAreaBlur: function (e) {
    this.setData({
      contentTitle: e.detail.value,
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
   * 发布问题
   */
  addDynamic: function (e) {
    var that = this;
    var LocalImageList = this.data.LocalImageList;
    wx.showToast({
      title: '正在提交...',
      icon: 'loading',
      mask: true,
      success(data) {
        setTimeout(function () {
          wx.navigateBack();
        }, 500)
      }
    }); 
  },
  /**
   * 上传图片
   */
  uploadImag(imgList, cb, idx = 0) {
    if (imgList.length <= idx) {
      //表示已经上传完毕要做得操作
      //console.log(this.data.imageUrlList)
      cb()
    } else {
      wx.uploadFile({
        url: uploadImgUrl,
        filePath: imgList[idx],
        name: 'file',
        formData: {
          uploadFolder: 'image/dtImg'
        },
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: result => {
          let res = JSON.parse(result.data),
            imgUrl = res.result[0];
          let imageUrl = [{
            imgUrl: imgUrl,
            imgContent: ''
          }];
          imgUrl = JSON.stringify(imgUrl);
          let resultList = [...this.data.imageUrlList, ...imageUrl];

          this.setData({
            'imageUrlList': resultList
          });
          idx++;
          this.uploadImag(imgList, cb, idx);
        },
        fail: err => {
          //console.log(`第${idx + 1}张图片上传失败`);
          wx.hideToast();
          wx.showModal({
            title: '错误提示',
            content: '上传图片失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      })
    }
  },
  //提交数据
  publicData: function () {
    var that = this;
    var wxUserId = app.globalDatas.userCode;
    var informationClassId = that.data.informationClassId;
    var content = that.data.content;
    var LocalImageList = that.data.LocalImageList;
    var imageUrlList = that.data.imageUrlList;
    if (!content) {
      wx.showModal({
        title: '提示',
        content: '回答内容不能为空!',
        success: function (res) { }
      })
      return false;
    }
    if (LocalImageList.length > 0) {
      this.uploadImag(LocalImageList, this.creatQuestion);
    } else {
      this.creatQuestion();
    }
  },
  creatQuestion() {
    var that = this;
    var wxUserId = app.globalDatas.userCode;
    var informationClassId = that.data.informationClassId;
    var content = that.data.content;
    var LocalImageList = that.data.LocalImageList;
    var imageUrlList = JSON.stringify(that.data.imageUrlList);
    wx.request({
      method: 'POST',
      url: addInformationComment,
      data: {
        informationId: informationClassId,
        wxUserId: app.globalDatas.userCode,
        content: that.data.content,
        imgList: imageUrlList
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.errcode == 0) {
          that.addDynamic(res);
        } else {
          wx.showModal({
            title:"提示",
            content: res.data.msg
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
  //添加链接
  inputLink: function (e) {
    var linkUrl = e.currentTarget.dataset.linkUrl;
    var url;
    if (linkUrl) {
      url = '../inputLinkUrl/inputLinkUrl?text=' + linkUrl;
    } else {
      url = '../inputLinkUrl/inputLinkUrl?text=';
    }
    wx.navigateTo({
      url: url,
    })
  },
  /*打开链接*/
  showLinkUrl: function (e) {
    var link = e.currentTarget.dataset.linkurl;
    wx.navigateTo({
      url: '../showLink/showLink?linkUrl=' + link,
    })
  },
  /*返回*/
  navBack: function () {
    wx.navigateBack();
  },
  navMainPage: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
  /*选择话题 */
  // topicsList: function () {
  //   var content = this.data.content;
  //   wx.navigateTo({
  //     url: '../topics/topics?content=' + content,
  //   })
  // }
})