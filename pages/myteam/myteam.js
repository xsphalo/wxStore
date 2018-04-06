// pages/myteam/myteam.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    its: 1,
    hasmore: true,
    team: [],
    page: 1,
    totalid:0,
    totals:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  cates: function (e) {
    var its = e.currentTarget.dataset.its
    var hasmore = this.data.hasmore,
      page = this.data.page,
      team = this.data.team;
    this.setData({
      its: its,
      hasmore: true,
      page: 1,
      team: []
    })
    if (its == 1) {
      this.getdteam()
    } else if (its == 2) {
      this.getidteam()
    } else {
      console.log('go out!!!')
    }
  },
  getidteam: function () {
    var hasmore = this.data.hasmore
    if (!hasmore) {
      return false
    }
    var that = this
    var token = wx.getStorageSync('token')
    var page = this.data.page
    var data = { token: token, page: page }
    var team = this.data.team
    app.request('/member/idteam', data, this, (that, res) => {
      var totalid = res.data.results.total
      var rlists = res.data.results.data
      var rlens = rlists.length
      var team = []
      for (var i = 0; i < rlens; i++) {
        team.push(rlists[i])
      }
      if (page >= res.data.results.last_page) {
        that.setData({
          hasmore: false
        })
      }
      that.setData({
        team: team,
        page: page + 1,
        totalid: totalid
      })
    })
  },
  getdteam: function () {
    var hasmore = this.data.hasmore
    if (!hasmore) {
      return false
    }
    var that = this
    var token = wx.getStorageSync('token')
    var page = this.data.page
    var data = { token: token, page: page }
    var team = this.data.team
    app.request('/member/dteam', data, this, (that, res) => {
      var totals = res.data.results.total
      var rlists = res.data.results.data
      var rlens = rlists.length
      var team = []
      for (var i = 0; i < rlens; i++) {
        team.push(rlists[i])
      }
      if (page >= res.data.results.last_page) {
        that.setData({
          hasmore: false
        })
      }
      that.setData({
        team: team,
        page: page + 1,
        totals: totals
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
    this.getdteam()
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
    var its = this.data.its
    if (its == 1) {
      this.getdteam()
    } else if (its == 2) {
      this.getidteam()
    } else {
      console.log('go out!!!')
    }
  },


})