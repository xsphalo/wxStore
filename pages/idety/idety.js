// pages/idety/idety.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgcolr: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getname: function (e) {
    var act_name = e.detail.value;
    this.setData({
      act_name: act_name
    })
    this.bgcolor()
  },
  getidcard: function (e) {
    var idcard = e.detail.value;
    this.setData({
      idcard: idcard
    })
    this.bgcolor()
  },
  bgcolor: function () {
    var bgcolr = this.data.bgcolr
    var idcard = this.data.idcard;
    var act_name = this.data.act_name
    if (idcard == undefined || idcard == '' || act_name == '' || act_name == undefined) {
      this.setData({
        bgcolr: false
      })
    } else {
      this.setData({
        bgcolr: true
      })
    }
  },
  formSubmit: function () {
    var idcard = this.data.idcard
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(idcard) === false) {
      wx.showToast({
        title: '身份证号不合法',
        duration: 1800
      })
      return false
    }
    var token = wx.getStorageSync('token')
    var act_name = this.data.act_name
    var data = {
      token: token,
      idcard: idcard,
      act_name: act_name
    }
    app.request('/member/author', data, this, (that, res) => {
      wx.showToast({
        title: '身份认证成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => { wx.reLaunch({url:'/pages/percenter/percenter'}) }, 3000)
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