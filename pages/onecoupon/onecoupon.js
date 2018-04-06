// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    nocoup:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var price = options.price;
    this.setData({
      price: price
    })
  },
  nocoupons: function () {
    wx.setStorageSync('counitem', '')
    var nocoup = this.data.nocoup
    this.setData({
      nocoup: !nocoup
    })
    wx.navigateBack({})
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
    this.useCoupon();
  },
  useCoupon: function () {
    var token = wx.getStorageSync('token')
    var price = this.data.price
    var that = this;
    var data = { token: token, price: price }
    app.request('/coupon/ables', data, this, (that, res) => {
      var coupons = res.data.results
      that.setData({ coupons: coupons })
    })
  },
  seleccards: function (e) {
    var index = e.currentTarget.dataset.index
    var nocoup = this.data.nocoup
    var coupons = this.data.coupons
    var counitem = coupons[index]
    wx.setStorageSync('counitem', counitem)
    this.setData({
      counitem: counitem,
      nocoup:false
    })
    // wx.navigateTo({
    //   url: '/pages/confirmorder/confirmorder',
    // })
    wx.navigateBack({})
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
})