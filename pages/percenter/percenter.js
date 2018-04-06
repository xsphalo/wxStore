// pages/percenter/percenter.js
const app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Notice, {

  /**
   * 页面的初始数据
   */
  data: {
    hasidmsg: false,
    imgurl: app.globalData.url2,
    wallet1:'',
    hide: true,
    animshow: false
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
    this.notice()
  },

  getpermsg: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var data = { token: token }
    app.request('/member/center', data, this, (that, res) => {
      wx.setStorageSync('levels', res.data.results)
      var username = res.data.results.nickname
      var userpic = res.data.results.avatar
      var wallet5 = res.data.results.wallet5
      var wallet1 = res.data.results.wallet1
      var icode = res.data.results.icode
      var levelogo = res.data.results.level.logo
      wx.setStorageSync('icode', icode)
      that.setData({
        username: username,
        userpic: userpic,
        wallet5: wallet5,
        wallet1: wallet1,
        levelogo: levelogo
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
    this.getpermsg();
    this.getshoplist()
    this.getmsgs()
  },
  toidcard: function () {
    var hasidmsg = this.data.hasidmsg
    if (hasidmsg) {
      wx.navigateTo({
        url: '/pages/idety/idety',
      })
    } else {
      wx.navigateTo({
        url: '/pages/hasidcard/hasidcard',
      })
    }
  },
  getmsgs: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var data = {
      token: token
    }
    app.request('/author/info', data, this, (that, res) => {
      var msgs = res.data.results
      var hasidmsg = that.data.hasidmsg
      if (msgs !== '' || msgs !== undefined) {
        that.setData({
          hasidmsg: false
        })
      }else{
        that.setData({
          hasidmsg: true
        })
      }
    })
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