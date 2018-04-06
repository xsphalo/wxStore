// pages/transoprt/transoprt.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    express: {},
    progress:'/images/yuan.png',
    unprogress:'/images/mall.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderno = options.orderno
    this.setData({
      orderno: orderno
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
    this.getexpress()
  },
  getexpress() {
    var that = this
    var token = wx.getStorageSync('token')
    var orderno = this.data.orderno
    var data = {
      token: token,
      orderno: orderno
    }
    app.request('/order/express', data, this, (that, res) => {
      var express = res.data.results
      that.setData({
        express: express
      })
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
})