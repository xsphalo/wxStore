// pages/collection/collection.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.url2,
    page: 1,
    hasmore: true,
    likelist: [],
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
    this.getcollection()
  },
  getcollection: function () {
    var hasmore = this.data.hasmore
    if (!hasmore) {
      return false
    }
    var that = this
    var token = wx.getStorageSync('token')
    var page = this.data.page
    var data = {
      token: token,
      page: page
    }
    app.request('/like/list', data, this, (that, res) => {
      var rlists = res.data.results.data
      var rlens = rlists.length
      var likelist = []
      for (var i = 0; i < rlens; i++) {
        likelist.push(rlists[i])
      }
      if (page >= res.data.results.last_page) {
        that.setData({
          hasmore: false
        })
      }
      that.setData({
        likelist: likelist, page: page + 1
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
    this.getcollection()
  },
  touchS: function (e) {  // touchstart
    let startX = app.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let likelist = app.Touches.touchM(e, this.data.likelist, this.data.startX)
    likelist && this.setData({ likelist })

  },
  touchE: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let likelist = app.Touches.touchE(e, this.data.likelist, this.data.startX, width)
    likelist && this.setData({ likelist })
  },
  itemDelete: function (e) {  // itemDelete
    // let likelist = app.Touches.deleteItem(e, this.data.likelist)
    // likelist && this.setData({ likelist })
    var that = this
    var token = wx.getStorageSync('token')
    var gid = e.currentTarget.dataset.gid
    var index = e.currentTarget.dataset.index
    var likelist = this.data.likelist
    var data = {
      token: token,
      gid: gid
    }
    wx.showModal({
      title: '提示',
      content: '确定取消收藏吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/like/trigger',
            method: 'post',
            data: data,
            success: function (res) {
              if (res.data.errorCode == 0) {
                var likelist = that.data.likelist;
                likelist.splice(index, 1);
                that.setData({ likelist: likelist });
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'success',
                  duration: 2000
                })
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