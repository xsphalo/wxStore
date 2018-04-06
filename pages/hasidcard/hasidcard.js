// pages/hasidcard/hasidcard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgs:{},
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
    this.getmsgs()
  },
  getmsgs: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var data = {
      token:token
    }
    app.request('/author/info', data, this, (that, res) => {
        var msgs = res.data.results
        that.setData({
          msgs:msgs
        })
    })
  },
  toidety:function(){
    wx.navigateTo({
      url: '/pages/idety/idety',
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