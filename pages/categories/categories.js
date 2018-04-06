// pages/categories/categories.js
const app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Notice, {

  /**
   * 页面的初始数据
   */
  data: {
    screenType: '',
    categories: [],
    winHeight: 0,
    scrollTopId: '',//置顶id
    scrollTop: 0,//置顶高度
    imgurl: app.globalData.url2,
    idx:0,
    hasmore:true,
    hide: true,
    animshow: false
  },
  bijia:function(e){
    var idx = e.currentTarget.dataset.idx
    var index = e.currentTarget.dataset.index
    var bijiagoods = this.data.categories
    var bijiamsg = bijiagoods[index].goods[idx]
    var jdprice = bijiamsg.jdprice
    var tbprice = bijiamsg.tbprice
    var jdlink = bijiamsg.jdlink
    var tblink = bijiamsg.tblink
    var duosaleprice = bijiamsg.saleprice
    this.setData({
      screenType: 1,
      jdprice: jdprice,
      tbprice: tbprice,
      jdlink: jdlink,
      tblink: tblink,
      duosaleprice: duosaleprice
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    app.editTabBar();
    if (options.mid != undefined) {
      wx.setStorageSync('elIcode', options.mid);
    }
    var icode = wx.getStorageSync('elIcode');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    this.setData({
      winHeight: winHeight,
    })
    this.notice()
  },
  toallshop: function () {
    wx.navigateTo({
      url: '/pages/allshop/allshop',
    })
  },
  
  catetiers:function(e){
    var pid = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/catechild/catechild?id='+pid+'&title='+title,
    })
  },
  catechange: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.index
    var scrollTopId = e.currentTarget.dataset.id;
    this.setData({
      idx:idx,
      scrollTopId: scrollTopId,
    })
  },
  scroll:function(e){
    // console.log(e)
  },
  hideshade: function () {
    var screenType = this.data.screenType
    this.setData({
      screenType: ''
    })
  },
  getcategory: function () {
    var that = this
    var data = {}
    app.request('/goods/category', data, this, (that, res) => {
      var categories = res.data.results
      that.setData({
        categories: categories,
      })
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
    this.getcategory();
    this.getshoplist()
  },
  getshoplist: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var data = {
      token: token,
    }
    app.request('/cart/list', data, this, (that, res) => {
      var rlist = res.data.results.data;
      var rlen = rlist.length;
      that.setData({ rlen: rlen })
    })
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
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var icode = wx.getStorageSync('icode');
    // console.lgo(icode)
    return {
      title: shopname,
      path: url + '?mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}))