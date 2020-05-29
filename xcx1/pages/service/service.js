// pages/service/service.js
const app = getApp();
var API_URL = app.globalDatas.baseUrl;
var serviceManagerUrl = app.globalDatas.serviceManagerUrl;
//服务大类
var BIG_SERVICE = API_URL + 'smallService/selectBigService.do?authType=show';
//服务小类接口
var SMALL_SERVICE = API_URL + 'smallService/selectAllSmallService.do?authType=show';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismenuHide: false,
    publishType: 'show',
    publishText: '+',
    isShow: false,
    bigService:[],
    serviceManagerUrl:serviceManagerUrl,
    searchKeyword: '',  //需要搜索的字符
    smallService: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断smallService数组是不是空数组，默认true，空的数组
    page:0,//第几次请求
    size:10,//一次请求返回的数据量
    searchLoading: true, //"正在加载"的变量，默认true，显示
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    bigServiceId:"" ,//服务大类id
    isActive:"0",
    selectServeice:'',
    titleText:'爱服务',
    searchTitle:'',
    userCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   * options.selectServeice
   */
  onLoad: function (options) {
    var searchTitle = options.searchTitle ? options.searchTitle : "";
    this.animation = wx.createAnimation();
    this.getSmallService();
    this.getMenuList();
    this.setData({
      'selectServeice': options.selectServeice,
      navH: app.globalDatas.navHeight,
      userCode: app.globalDatas.userCode,
      searchTitle: searchTitle
     })
    if (searchTitle != "") {
      this.setData({
        searchKeyword: searchTitle
      })
      this.keywordSearch();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(_ => {
      this.popup = this.selectComponent("#buttomMenu").getMessageList(this.data.userCode); //组件的id
    }, 500);
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
    this.keywordSearch();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page: that.data.page + 1,  //每次触发上拉事件，把page+1
      isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false
      searchLoadingComplete: false, //把"已加载全部"隐藏
      searchLoading: true //"正在加载"显示
    });
    that.getSmallService();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //首页切换标签
  indexSwitchTab: function (event) {
    var url = event.currentTarget.dataset.url;//获取data-url
    wx.reLaunch({
      url: url
    })
  },
  //弹出服务查询输入
  showSelectQuery:function(e){
    this.setData({
      "isHide":false
    })
  },
  //查询左侧菜单栏
  getMenuList:function(e){
    var that = this;
    wx.request({
      url: BIG_SERVICE,
      success(res) {
        let bigService = [];
        bigService = res.data.result;
        // --------------
        // 把爱维修放在最后一项
          var temp = bigService[3];
          bigService[3] = bigService[13];
          bigService[13] = temp;
        // -------------
        bigService.unshift({
          "NAME": "全部",
          "ID": "0",
          "YXBZ": "Y",
          "JS": "1"
        })
        that.setData({
          "ismenuHide": false,
          "bigService": bigService
        })
      },
      fail: function () {
        wx.hideLoading();
        //如果数据加载失败，则提示
        wx.showToast({
          title: "请求数据失败",
          icon: 'fail',
          duration: 1000
        });
      }
    })
  },
  //点击打开左侧菜单栏
  showMenuList:function(e){
    var that = this;
      if(this.data.ismenuHide){
        //调用后台接口查询
        that.setData({
          "ismenuHide": false
        })
        
      }else{
        that.setData({
          "ismenuHide": true
        })
      }
     
  } ,
  //发布动态
  jumpPublicDt: function () {
    this.showButtonPublish("hide");
    wx.navigateTo({
      url: '../publicDt/publicDt'
    })
  },
  //发布提问
  jumpPublicTw: function () {
    this.showButtonPublish("hide");
    wx.navigateTo({
      url: '../publicTw/publicTw'
    })
  },
  //发不动态和活动
  publicAlAndHd: function () {
    this.showButtonPublish("hide");
    wx.navigateTo({
      url: '../publicAlAndHd/publicAlAndHd'
    })
  },
  //发布
  showPublishBtn: function (res) {
    var btntype = res.currentTarget.dataset.type;//获取data-list 
    this.showButtonPublish(btntype);
  },
  /*弹出按钮功能*/
  showButtonPublish: function (btntype) {
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
  showDtBut: function (animation) {
    animation.translate(-70, -85).step();
    this.setData({ animationDT: animation.export() });
  },
  showHdBut: function (animation) {
    setTimeout(function () {
      animation.translate(-20, -85).step()
      this.setData({ animationHd: animation.export() })
    }.bind(this), 150)
  },
  showAlBut: function (animation) {
    setTimeout(function () {
      animation.translate(30, -85).step()
      this.setData({ animationAl: animation.export() })
    }.bind(this), 300)
  },
  showWdBut: function (animation) {
    setTimeout(function () {
      animation.translate(80, -85).step()
      this.setData({ animationWd: animation.export() })
    }.bind(this), 450)
  },
  //隐藏各种框
  hideDtBut: function (animation) {
    animation.translate(0, 0).step();
    this.setData({ animationDT: animation.export() });
  },
  hideHdBut: function (animation) {
    animation.translate(0, 0).step()
    this.setData({ animationHd: animation.export() });
  },
  hideAlBut: function (animation) {
    animation.translate(0, 0).step()
    this.setData({ animationAl: animation.export() })
  },
  hideWdBut: function (animation) {
    animation.translate(0, 0).step()
    this.setData({ animationWd: animation.export() });
  },
  //获取输入框的值
  searchService:function(e){
     let value = e.detail.value;
     this.setData({
       searchKeyword: e.detail.value
     });
  },
  getServiceByBid:function(e){
    var that = this;
    var bigServiceName = e.currentTarget.dataset.name;
    let bigServiceId = (e.currentTarget.dataset.bigid == 0) ? '' : e.currentTarget.dataset.bigid;
    var userCode = that.data.userCode;
    //爱维修跳转到爱维修小程序
    if (bigServiceName == '爱 维修') {
      var execute_function = function () {
        wx.navigateToMiniProgram({
          appId: 'wxa61a4d999f3e18f6',
          path: 'pages/index/index',
          extraData: {
            foo: 'bar'
          },
          envVersion: 'trial',
          // 有效值 develop（开发版），trial（体验版），release（正式版）
          success(res) {
            // 打开成功
            wx.showToast({
              title: '请稍后',
              icon: 'none',
              duration: 800
            })
          },
          fail(res) {
            //console.log("选择了取消")
          }
        })
      }
      app.lookGetSettig(execute_function);
    }
    else{
      that.setData({
        page: 0,
        bigServiceId: bigServiceId,
        smallService: [], //清空数组
        isActive: e.currentTarget.dataset.bigid,
        searchLoading: true, //"正在加载"的变量，默认true，显示
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      })
      that.getSmallService();
    }
  },
  //点击搜索按钮收索服务
  keywordSearch:function(e){
    // let value = this.data.searchKeyword;//输入框输入的搜索值
    // if(value == ''){
    //   wx.showToast({
    //     title: '请输入服务名称',
    //     icon: 'none',
    //     duration: 800
    //   })
    //  return;
    // }
    this.setData({
      bigServiceId:'',
      page: 0,   //第一次加载，设置1
      smallService: [],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.getSmallService();
  },
  //获取服务小类
  getSmallService:function(){
    let that = this;
    let page = that.data.page;
    let size = that.data.size;
    let searchKeyword = that.data.searchKeyword;//输入框输入的搜索值
    let bigServiceId = that.data.bigServiceId; //大类id
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      method: 'POST',
      url: SMALL_SERVICE,
      data: {
        page: page,
        size: size,
        serviceName: searchKeyword,
        bigServiceId: bigServiceId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success(res) {
        if (res.data.errcode == 0) {
          
          let result = res.data.result.content;
          if (result.length > 0) { //如果有数据
            let searchList = [];
            let radioList=[];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = result : searchList = that.data.smallService.concat(result)
            for (var i = 0; i < searchList.length;i++){
                var radioText={
                    "checked":false
                }
              radioList.push(radioText);
            }
            that.setData({
              smallService: searchList, //获取数据数组      
              radioList: radioList,
              searchLoadingComplete: true, //把"已加载全部"设为true，显示
              searchLoading: false //"正在加载隐藏掉"
            });
            
          } else {
            that.setData({
              searchLoadingComplete: true, //把"已加载全部"设为true，显示
              searchLoading:false //"正在加载隐藏掉"
            });
          }
          
        }
      }
    })
    wx.hideLoading();//隐藏加载提示
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    let that = this;
    that.setData({
      page: that.data.page + 1,  //每次触发上拉事件，把page+1
      isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false
      searchLoadingComplete: false, //把"已加载全部"隐藏
      searchLoading: true //"正在加载"显示
    });
    that.getSmallService();
    
  },
  //跳转详情页面
  goServiceInfo:function(e){
    var execute_function = function(){
      let serviceId = e.currentTarget.dataset.serviceid;
      let fwsId = e.currentTarget.dataset.fwsid;
      wx.navigateTo({
        url: '../serviceInfo/serviceInfo?smallServiceId=' + serviceId + '&isShare=true&fwsid=' + fwsId,
      })
    }
    app.lookGetSettig(execute_function);
  },
  //点击服务商跳转
  goDianPu:function(e){
    let that = this;
    let fwsid = e.currentTarget.dataset.fwsid;
    if (fwsid == '' || fwsid == undefined) {
      that.alertInfo("暂无该服务商更多信息");
      return;
    }
    //跳转页面
    wx.navigateTo({
      url: '../shops/shops?fwsid=' + fwsid,
    })
  },
  //弹出提示信息
  alertInfo: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 1000
    })
  },
  selectServeice:function(e){
    let pages = getCurrentPages();
    let serviceid = e.currentTarget.dataset.serviceid;
    let serviceimg = e.currentTarget.dataset.serviceimg;
    let servicename = e.currentTarget.dataset.servicename;
    let servicenum = e.currentTarget.dataset.servicenum;
    var prevPage = pages[pages.length - 2];
      prevPage.setData({
        'serviceid': serviceid,
        'serviceimg': serviceimg,
        'servicename': servicename,
        'servicenum': servicenum
      });
    wx.navigateBack({});
  },
})