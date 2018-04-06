// pages/giftbag/giftbag.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore: true,
    page: 1,
    baglists: [],
    imgurl: app.globalData.url2,
    bgpic: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
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
    this.getbaglist()
    this.getbannerlevl()
  },
  getbaglist() {
    var that = this
    var id = this.data.id
    var data = { id: id }
    app.request('/goods/levels', data, this, (that, res) => {
      var baglists = res.data.results||[]
      that.setData({
        baglists: baglists
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
  getbannerlevl() {
    var that = this
    var data = {}
    app.request('/banner/level', data, this, (that, res) => {
      var bgpic = res.data.results
      that.setData({
        bgpic: bgpic
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