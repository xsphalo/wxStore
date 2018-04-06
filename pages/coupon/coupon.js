// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenType: '',
    status: 1,
    coupons: [],
    page: 1,
    hasmore: true,
  },
  tilingqu: function () {
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCoupon();
  },
  getCoupon: function () {
    var hasmore = this.data.hasmore
    if (!hasmore) { return false }
    var status = this.data.status;
    var token = wx.getStorageSync('token')
    var page = this.data.page
    var coupons = this.data.coupons
    var that = this;
    var data = { status: status, token: token, page: page }
    app.request('/coupon/logs', data, this, (that, res) => {
      var coupons = []
      var clist = res.data.results.data
      var clen = clist.length
      for (var i = 0; i < clen; i++) {
        coupons.push(clist[i])
      }
      if (page >= res.data.results.last_page) {
        that.setData({ hasmore: false })
      }
      that.setData({ coupons: coupons, page: page + 1 })
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
    this.getCoupon();
  },
  tap: function (e) {
    var status = e.currentTarget.dataset.status
    this.setData({ status: status, page: 1, coupons: [], hasmore: true })
    this.getCoupon();
  },
})