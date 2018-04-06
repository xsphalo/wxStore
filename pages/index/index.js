// pages/percenter/percenter.js
const app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Notice,{

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    bannerlist: [],
    imgurl: app.globalData.url2,
    categories: [],
    goodslist: [],
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    opacity: false,
    page: 1,
    hasmore:true,
    titles:'精品优选',
    screenType: '',
    hide:true,
    animshow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    app.editTabBar();
    // app.login();
    if (options.mid != undefined) {
      wx.setStorageSync('elIcode', options.mid);
    }
    var scene = options.scene;
    if(scene!=undefined){
      scene = decodeURIComponent(scene);
      var tmps = scene.split('=');
      if(tmps[1] != undefined){
        wx.setStorageSync('elIcode', tmps[1]);
      }
    }
    var elIcode = wx.getStorageSync('elIcode');
    if (elIcode != undefined && elIcode != '' && elIcode != null) {
      app.bindInviter();
    }
    this.notice()
  },
  toallshop:function(){
    wx.navigateTo({
      url: '/pages/allshop/allshop',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  bijia: function (e) {
    var index = e.currentTarget.dataset.index
    var bijiagoods = this.data.goodslist
    var bijiamsg = bijiagoods[index]
    var jdprice = bijiamsg.jdprice
    var tbprice = bijiamsg.tbprice
    var jdlink = bijiamsg.jdlink
    var tblink = bijiamsg.tblink
    var duosaleprice = bijiamsg.saleprice
    var protitle = bijiamsg.title
    this.setData({
      screenType: 1,
      jdprice: jdprice,
      tbprice: tbprice,
      jdlink: jdlink,
      tblink: tblink,
      duosaleprice: duosaleprice,
      protitle: protitle
    })
  },
  copyTB: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.tblink,
      success: function (res) {
        // self.setData({copyTip:true}),  
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  copyJD: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.jdlink,
      success: function (res) {
        // self.setData({copyTip:true}),  
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getbannerlist()
    this.getcategory()
    this.getgoodslist()
    this.getshoplist()
  },
  getshoplist: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var that = this;
    var data = {
      token: token,
    }
    app.request('/cart/list', data, this, (that, res) => {
      var rlist = res.data.results.data;
      var rlen = rlist.length;
      that.setData({ rlen: rlen })
      wx.setStorageSync('rlen', rlen)
    })
  },
  getgoodslist: function () {
    var hasmore = this.data.hasmore;
    if (!hasmore) {
      return false
    }
    var that = this
    var page = this.data.page
    var data = { page: page }
    app.request('/group/goods', data, this, (that, res) => {
      var rlist = res.data.results.glist.data
      var len = rlist.length;
      var goodslist = that.data.goodslist;
      var titles = res.data.results.title
      for (var i = 0; i < len; i++) {
        goodslist.push(rlist[i]);
      }
      if (page >= res.data.results.glist.last_page) {
        that.setData({ hasmore: false });
      }
      that.setData({ goodslist: goodslist, page: page + 1, titles: titles })
    })
  },
  getbannerlist: function () {
    var that = this
    var data = {}
    app.request('/banner/list', data, this, (that, res) => {
      var bannerlist = res.data.results
      that.setData({
        bannerlist: bannerlist
      })
    })
  },
  getcategory: function () {
    var that = this
    var data = {}
    app.request('/activity/list', data, this, (that, res) => {
      var categories = res.data.results
      that.setData({
        categories: categories
      })
    })
  },
  todetail: function (e) {
    var id = e.currentTarget.dataset.id
    // console.log(id)
    wx.navigateTo({
      url: '/pages/prodetail/prodetail?id=' + id,
    })
  },
  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 20) {//触发gotop的显示条件  
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },
  goTopFun: function (e) {
    var _top = this.data.scrollTop.scroll_top;
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });

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
    this.getgoodslist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var icode = wx.getStorageSync('icode');
    // console.lgo(icode)
    return {
      title: '哆推推',
      path: url + '?mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}))