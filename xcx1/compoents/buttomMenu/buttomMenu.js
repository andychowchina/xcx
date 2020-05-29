// compoents/buttomMenu/buttomMenu.js
var app = getApp();
var host = app.globalDatas.baseUrl;
var queryQuestion = host + 'wxMessages/queryMessageCount.do?authType=show';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSelect: {
      type: Number,
      value: 'default value',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    publishType: 'show',
    publishText: '+',
    messageDate:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*弹出各类型的框*/
    showDtBut: function (animation) {
      animation.translate(-100, -85).step();
      this.setData({
        animationDT: animation.export()
      });
    },
    showHdBut: function (animation) {
      setTimeout(function () {
        animation.translate(-50, -85).step()
        this.setData({
          animationHd: animation.export()
        })
      }.bind(this), 150)
    },
    showAlBut: function (animation) {
      setTimeout(function () {
        animation.translate(0, -85).step()
        this.setData({
          animationAl: animation.export()
        })
      }.bind(this), 300)
    },
    showWdBut: function (animation) {
      setTimeout(function () {
        animation.translate(50, -85).step()
        this.setData({
          animationWd: animation.export()
        })
      }.bind(this), 400)
    },
    showFxBut: function (animation) {
      setTimeout(function () {
        animation.translate(100, -85).step()
        this.setData({
          animationFx: animation.export()
        })
      }.bind(this), 450)
    },
    //隐藏各种框
    hideDtBut: function (animation) {
      animation.translate(0, 0).step();
      this.setData({
        animationDT: animation.export()
      });
    },
    hideHdBut: function (animation) {
      animation.translate(0, 0).step()
      this.setData({
        animationHd: animation.export()
      });
    },
    hideAlBut: function (animation) {
      animation.translate(0, 0).step()
      this.setData({
        animationAl: animation.export()
      })
    },
    hideWdBut: function (animation) {
      animation.translate(0, 0).step()
      this.setData({
        animationWd: animation.export()
      });
    },
    hideFxBut: function (animation) {
      animation.translate(0, 0).step()
      this.setData({
        animationFx: animation.export()
      });
    },
    //获取是否有新消息
    getMessageList: function (id) {
      let that = this;
      wx.request({
        method: 'GET',
        url: queryQuestion,
        header: {
          'content-type': 'application/json'
        },
        data: {
          userId: id
        },
        success: function (res) {
          console.log("resd",res)
          if (res.statusCode == 200) {
            // if (res.data.errcode != 0) {
            //   //如果数据加载失败，则提示
            //   wx.showToast({
            //     title: "您当前尚未登录",
            //     icon: 'fail',
            //     duration: 1000
            //   });
            //   return;
            // }
            that.setData({
              messageDate: res.data.result
            })
          }
        },
        fail: function (res) {
          that.alertInfo("调用接口失败");
        }
      })
    },
    //发布动态
    jumpPublicDt: function (e) {
      this.showButtonPublish("hide");
      var informationClassId = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '../publicDt/publicDt?informationClassId=' + informationClassId
      })
    },
    //发布提问
    jumpPublicTw: function (e) {
      this.showButtonPublish("hide");
      var informationClassId = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '../publicTw/publicTw?informationClassId=' + informationClassId
      })
    },
    //发布案例和活动
    publicAlAndHd: function (e) {
      this.showButtonPublish("hide");
      var informationClassId = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '../publicAlAndHd/publicAlAndHd?informationClassId=' + informationClassId
      })
    },
    //发布分享链接
    jumpPublicFx: function (e) {
      this.showButtonPublish("hide");
      var informationClassId = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '../inputLinkUrl/inputLinkUrl?informationClassId=' + informationClassId
      })
    },
    //发布
    showPublishBtn: function (res) {
      var btntype = res.currentTarget.dataset.type; //获取data-list 
      this.showButtonPublish(btntype);
    },
    //首页切换标签
    indexSwitchTab: function (event) {
      var url = event.currentTarget.dataset.url; //获取data-url
      if (url) {
        wx.reLaunch({
          url: url
        })
      }
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
        this.showFxBut(animation);
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
        this.hideFxBut(animation);
      }
    },
  }
})
