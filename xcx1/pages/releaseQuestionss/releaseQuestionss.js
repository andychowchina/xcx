// pages/publicDt/publicDt.js
const app = getApp();
var amapFile = require('../libs/amap-wx.js');
var host = app.globalDatas.baseUrl;
var uploadImgUrl = host + 'wxImage/uploadImg.do?authType=show';
var addDtUrl = host + 'wxInformation/insertInformation.do?authType=show';
var addDtUrlTwo = host + 'wxTopicClass/queryTopicClassList.do?authType=show';
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
    'topicsId': '',
    'topicsIdList': [],
    'topicClassIdList': [],
    'themeList': [],
    'host': require('../../config').host,
    'isChecked': true,
    'num': 0,
    'titleText': '发布问题',
    'submitStatus': true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var topicsIdList = this.data.topicsIdList;
    var informationId = options.informationClassId ? options.informationClassId : "";
    options.topicId ? topicsIdList.push(parseInt(options.topicId)) : [];

    this.setData({
      informationClassId: informationId,
      navH: app.globalDatas.navHeight,
      topicsIdList: topicsIdList,
      content: options.topicTitle ? '#' + options.topicTitle + '#' : '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var topicsIdList = this.data.topicsIdList;
    const topicsId = this.data.topicsId;

    if (topicsId) {
      if (topicsIdList.length > 0) {
        for (var i = 0; i < topicsIdList.length; i++) {
          if (topicsId == topicsIdList[i]) {
            return;
          } else {
            topicsIdList.push(topicsId);
          }
        }
      } else {
        topicsIdList.push(topicsId);
      }

    }
    this.putThemeData();
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
  /**
   * 获取发布动态内容
   */
  bindTextAreaBlur: function(e) {
    this.setData({
      content: e.detail.value,
    })
  },
  bindTitleAreaBlur: function(e) {
    this.setData({
      contentTitle: e.detail.value,
    })
  },
  /**
   * 选择上传图片
   */
  selectImage: function(e) {
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
  deleteLocalImageList: function(e) {
    var LocalImageList = this.data.LocalImageList;
    var index = e.currentTarget.dataset.index;
    LocalImageList.splice(index, 1);
    this.setData({
      LocalImageList: LocalImageList,
      publishImages: LocalImageList,
    });
  },
  showPosition: function(longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: "87a425ae40728e809fd1b29354d0a276"
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        that.setData({
          "address": data[0].regeocodeData.formatted_address,
          "longitude": longitude,
          "latitude": latitude,
        })

      },
      fail: function(info) {}
    });
  },
  /**
   * 发布问题
   */
  addDynamic: function(e) {

    var that = this;
    var LocalImageList = this.data.LocalImageList;
    wx.showToast({
      title: '正在提交...',
      icon: 'loading',
      mask: true,
      success(data) {
        setTimeout(function() {
          wx.navigateTo({
            url: '../putQuestion/putQuestion?pk=' + e.data.result.pk
          })
        }, 500)
      }
    });
    // if (LocalImageList.length > 0) {
    //   this.uploadImag(LocalImageList);
    // } 
  },
  /**
   * 上传图片
   */
  uploadImag(imgList, cb, idx = 0) {
    wx.showToast({
      title: '图片上传中...',
      icon: 'loading',
      mask: true
    });
    if (imgList.length <= idx) {
      //表示已经上传完毕要做得操作
      console.log(this.data.imageUrlList)
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
          var that = this;
          console.log(`第${idx+1}张图片上传失败`);
          wx.hideToast();
          wx.showModal({
            title: '错误提示',
            content: '上传图片失败,请重试',
            showCancel: false,
            success: function(res) {
              that.setData({
                'submitStatus':true
              })
            }
          })
        }
      })
    }
  },
  // uploadImag: function(tempFilePath, cb, num, successnum, failnum, ) {
  //   debugger
  //   var length = tempFilePath.length,
  //     that = this,
  //     i = num ? num : 0,
  //     success = successnum ? successnum : 0,
  //     fail = failnum ? failnum : 0;
  //   wx.uploadFile({
  //     method: 'POST',
  //     url: uploadImgUrl,
  //     filePath: tempFilePath[i],
  //     name: 'file',
  //     formData: {
  //       uploadFolder: 'image/dtImg'
  //     },
  //     header: {
  //       "Content-Type": "multipart/form-data"
  //     },
  //     success: function(res) {
  //       success++;
  //       var jsonData = JSON.parse(res.data);
  //       var imageUrl = {
  //         imgUrl: jsonData['result'][0]
  //       }
  //       let imageUrlList = this.data.imageUrlList.push(imageUrl);
  //       debugger
  //       that.setData({
  //         imageUrlList
  //       })
  //       that.uploadImag(tempFilePath, cb, i, success, fail)
  //     },
  //     fail: function(res) {
  //       fail++;
  //       wx.hideToast();
  //       wx.showModal({
  //         title: '错误提示',
  //         content: '上传图片失败',
  //         showCancel: false,
  //         success: function(res) {}
  //       })
  //     }
  //     // ,
  //     // complete: function (res) {
  //     //   i++;
  //     //   if (length == success) { //当图片传完时，停止调用
  //     //     that.setData({
  //     //       'imageUrlList': JSON.stringify(imageUrlLists)
  //     //     });
  //     //     cb();
  //     //     console.log(JSON.stringify(imageUrlLists));
  //     //   } else { //若图片还没有传完，则继续调用函数
  //     //     i = i;
  //     //     success = success;
  //     //     fail = fail;
  //     //     that.uploadImag(tempFilePath, cb,i, success, fail)
  //     //   }
  //     // }
  //   });

  // },
  //请求话题分类的数据
  putThemeData: function() {
    var that = this;
    wx.request({
      method: 'POST',
      url: addDtUrlTwo,
      data: {
        yxbz: "Y",
        sort: "sx,asc"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        var result = res.data.result;
        //对象排序
        function compare(property) {
          return function(a, b) {
            return (a[property] - b[property])
          }
        }
        that.setData({
          themeList: result.sort(compare('sx')),
        });
      }
    })
  },
  //提交数据
  publicData: function() {
    var that = this;
    var execute_function = function () {
      var wxUserId = app.globalDatas.userCode;
      var informationClassId = that.data.informationClassId;
      var content = that.data.content;
      var contentTitle = that.data.contentTitle;
      const topicIdList = that.data.topicsIdList;
      const topicClassIdList = that.data.topicClassIdList;
      var LocalImageList = that.data.LocalImageList;
      var imageUrlList = that.data.imageUrlList;
      if (!contentTitle) {
        wx.showModal({
          title: '提示',
          content: '问题标题不能为空!',
          success: function (res) { }
        })
        return false;
      }
      if (!content) {
        wx.showModal({
          title: '提示',
          content: '发布内容不能为空!',
          success: function (res) { }
        })
        return false;
      }
      if (topicClassIdList == "") {
        wx.showModal({
          title: '提示',
          content: '咨询分类不能为空!',
          success: function (res) { }
        })
        return false;
      }
      if (contentTitle) {
        var titleValue = contentTitle.charAt(contentTitle.length - 1);
        if (titleValue != "?" && titleValue != "？") {
          wx.showModal({
            title: '提示',
            content: '请给您的问题加上标点符号"?"',
            success: function (res) { }
          })
          return false;
        }
      }
      if (!that.data.submitStatus) {
        wx.showModal({
          title: "提示",
          content: "你手速太快了，请稍后再试",
          success: function (res) { }
        })
        return
      } else {
        that.setData({
          submitStatus: false,
        })
        if (LocalImageList.length > 0) {
          that.uploadImag(LocalImageList, that.creatQuestion);
        } else {
          that.creatQuestion();
        }
      }
    }
    app.lookGetSettig(execute_function);
  },
  creatQuestion() {
    // debugger;
    var that = this;
    var wxUserId = app.globalDatas.userCode;
    var informationClassId = that.data.informationClassId;
    var content = that.data.content;
    var contentTitle = that.data.contentTitle;
    var topicIdList = that.data.topicsIdList;
    const topicClassIdList = that.data.topicClassIdList;
    var LocalImageList = that.data.LocalImageList;
    var imageUrlList = JSON.stringify(that.data.imageUrlList);
    wx.request({
      method: 'POST',
      url: addDtUrl,
      data: {
        informationClassId: informationClassId,
        wxUserId: wxUserId,
        releaseLocation: (that.data.longitude && that.data.latitude) ? that.data.address : '',
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        content: that.data.content,
        title: that.data.contentTitle,
        imageUrlList: imageUrlList,
        smallServiceId: that.data.serviceid,
        topicIdList: JSON.stringify(topicIdList),
        topicClassIds: JSON.stringify(topicClassIdList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          submitStatus: true,
        })
        wx.hideLoading();
        if (res.data.errcode == 0) {
          that.addDynamic(res);
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.msg,
            success: function (res) { }
          })
        }
      }
    })
  },
  //选择服务
  selectService: function() {
    wx.navigateTo({
      url: '../service/service?selectServeice=true',
    })
  },
  //跳转详情页面
  goServiceInfo: function(e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId,
    })
  },
  //删除详情页
  deleteServiceInfo: function() {
    this.setData({
      'serviceid': '',
      'serviceimg': '',
      'servicename': '',
      'servicenum': '',
    })
  },
  //添加链接
  inputLink: function(e) {
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
  showLinkUrl: function(e) {
    var link = e.currentTarget.dataset.linkurl;
    wx.navigateTo({
      url: '../showLink/showLink?linkUrl=' + link,
    })
  },
  /*返回*/
  navBack: function() {
    wx.navigateBack();
  },
  /*选择话题 */
  topicsList: function() {
    var content = this.data.content;
    wx.navigateTo({
      url: '../topics/topics?content=' + content,
    })
  },
  // 选择问题分类
  selected: function(e) {
    var topicClassIdList = this.data.topicClassIdList;
    var themeList = this.data.themeList;
    topicClassIdList = themeList;
    topicClassIdList = [];
    var index = e.target.dataset.id;
    index ? topicClassIdList.push(index) : [];
    this.setData({
      num: e.target.dataset.num,
      topicClassIdList: topicClassIdList
    })
  }
})