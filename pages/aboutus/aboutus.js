// pages/aboutus/aboutus.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmsg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mid != undefined) {
      wx.setStorageSync('elIcode', options.mid);
    }
    var icode = wx.getStorageSync('elIcode');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
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
    this.aboutus();
  },
  aboutus: function () {
    var that = this
    var data = {}
    app.request('/shop/aboutus', data, this, (that, res) => {
      var abouts = res.data.results
      if (abouts == '' || abouts==undefined){
        that.setData({
          hasmsg: false
        })
      }else{
        that.setData({
          hasmsg: true
        })
      }
      that.setData({
        abouts: abouts
      })
      var WxParse = require('../../wxParse/wxParse.js');
      WxParse.wxParse('content', 'html', abouts, that, 5);
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
  onShareAppMessage: function (res) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var icode = wx.getStorageSync('icode');
    return {
      title: '关于我们',
      path: url + '?mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})