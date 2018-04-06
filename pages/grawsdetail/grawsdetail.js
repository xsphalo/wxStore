// pages/grawsdetail/grawsdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  page:1,
  hasmore:true,
  mlogs:[],
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
    this.getwithdrawlogs()
  },
  getwithdrawlogs:function(){
    var hasmore = this.data.hasmore
    if(!hasmore){
      return false
    }
    var token = wx.getStorageSync('token')
    var page=  this.data.page
    var mlogs = this.data.mlogs
    var data={
      token:token,
      page:page
    }
    app.request('/member/logs',data,this,(that,res)=>{
      var rlist = res.data.results.data
      var rlens = rlist.length
      var mlogs = []
      for(var i = 0;i<rlens;i++){
        mlogs.push(rlist[i])
      }
      if(page>=res.data.results.last_page){
        that.setData({
          hasmore:false
        })
      }
      that.setData({mlogs:mlogs,page:page+1})
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
    this.getwithdrawlogs()
  },
})