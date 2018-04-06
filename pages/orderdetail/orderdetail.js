// pages/orderdetail/orderdetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    id: '',
    imgurl: app.globalData.url2,
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
  getorderdetails: function (e) {
    var id = this.data.id;
    var token = wx.getStorageSync('token')
    var that = this;
    wx.request({
      url: app.globalData.url + '/order/detail',
      method: 'post',
      data: {
        'id': id,
        'token': token
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.setData({ details: res.data.results })
        } else {
          wx.showToast(res.data.errorStr);
        }
      }
    })
  },
  evaluation: function () {
    wx.navigateTo({
      url: '/pages/evaluation/evaluation',
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

    this.getorderdetails();
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
  more: function () {
    wx.redirectTo({
      url: '/pages/productlist/productlist',
    })
  },
  loock:function(e){
    var orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/transoprt/transoprt?orderno=' + orderno,
    })
  },
  delets: function (e) {
    var orderno = e.currentTarget.dataset.orderno;
    var token = wx.getStorageSync('token')
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/order/delete',
            method: 'post',
            data: {
              orderno: orderno,
              token: token
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                wx.navigateBack({})
              } else {
                wx.showToast({
                  title: res.data.errorStr,
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
})