// pages/publicAlAndHd/publicAlAndHd.js
const app = getApp();
var host = app.globalDatas.baseUrl;
var uploadImgUrl = host + 'wxImage/uploadImg.do?authType=show';
var addDtUrl = host + 'wxInformation/insertInformation.do?authType=show';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informationClassId: '',
    title:'',
    textList: [{ text:'',imgUrl:''}],
    imageUrlList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      informationClassId: options.informationClassId,
      navH: app.globalDatas.navHeight
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
  //跳转到文字输入页面
  jumpInputText: function (e) {
    var dataType = e.currentTarget.dataset.type;
    var title = this.data.title;
    var textList = this.data.textList;
    var maxLength = e.currentTarget.dataset.maxlength
    if (dataType=='title'){
      wx.navigateTo({
        url: '../inputText/inputText?text=' + title + '&maxLength=' + maxLength + '&type=' + dataType
      })
    }else{
      var num = e.currentTarget.dataset.num;
      wx.navigateTo({
        url: '../inputText/inputText?num=' + num + '&text=' + textList[num].text + '&maxLength=' + maxLength + '&type=' + dataType
      })
    }
    
  },
  //从第一项开始增加内容
  addFirst:function(){
    var textList =  this.data.textList;
    textList.unshift({ text: '' });
    this.setData({ 'textList': textList});
  },
  //从最后一项开始增加内容
  addLast:function(){
    var textList = this.data.textList;
    textList.push({ text: '' });
    this.setData({ 'textList': textList });
  },
  //上传图片
  addImage:function(e){
    var that =this;
    var num = e.currentTarget.dataset.num;
    var textList = that.data.textList;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        textList[num].imgUrl = tempFilePaths;
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          'textList': textList
        })
      }
    })
  },
  //删除元素
  removeItem:function(e){
    var that = this;
    var num = e.currentTarget.dataset.num;
    var textList = that.data.textList;
    if (textList.length>1){
      textList.splice(num, 1);
      that.setData({
        'textList': textList
      })
    }else{

    }
  },
  //获取标题
  inputText: function(e){
    this.setData({
      title: e.detail.value
    })
  },
  //选择多个上传图片
  selectImage: function (e) {
    var that = this;
    var textList = that.data.textList;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        // tempFilePath可以作为img标签的src属性显示图片
        for (var i = 0; i < tempFilePaths.length; i++) {
          var text = { text: '点击输入内容', imgUrl: tempFilePaths[i] }
          textList.push(text)
        }
        that.setData({
          'textList': textList
        })
      }
    })
  },
  /**
   * 添加活动或者案例
   */
  addHdOrAl: function () {
    var that = this;
    var textList = that.data.textList;
    wx.showToast({
      title: '正在提交...',
      icon: 'loading',
      mask: true
    });
  
    if (textList[0].imgUrl != '') {
      this.uploadImag(textList);
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
      filePath: tempFilePath[i].imgUrl[0],
      name: 'file',
      formData: {
        uploadFolder: 'image/hdOrAlImg'
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        success++;
        var jsonData = JSON.parse(res.data);
        var imageUrl = {
          imgUrl: jsonData['result'][0],
          imgContent: tempFilePath[i].text
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
        title: that.data.title,
        imageUrlList: that.data.imageUrlList ? that.data.imageUrlList:[],
        topicIdList:[]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
      wx.hideToast();
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
  } ,
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
  }
})