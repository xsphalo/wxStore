// pages/shouhoulist/shouhoulist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    hasmore:true,
    imgurl: app.globalData.url2,
    shouhou:[]
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
    this.getshouhou()
  },
  getshouhou: function () {
    var hasmore = this.data.hasmore;
    if (!hasmore) {
      return false
    }
    var that = this
    var page  =this.data.page;
    var token = wx.getStorageSync('token')
    var data = {
      token:token,
      page:page
    }
    app.request('/order/mrefund',data,this,(that,res)=>{
      var rlist = res.data.results.data
      var len = rlist.length;
      var shouhou = that.data.shouhou;
      for (var i = 0; i < len; i++) {
        shouhou.push(rlist[i]);
      }
      if (page >= res.data.results.last_page) {
        that.setData({ hasmore: false });
      }
      that.setData({ shouhou: shouhou, page: page + 1 })
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