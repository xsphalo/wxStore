// pages/myaccount/myaccount.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members:{},
    withinfo:{},
   able:'',
    pedding:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var wallet1 = options.wallet1;
    // var wallet5 = options.wallet5;
    // this.setData({
    //   wallet1:wallet1,
    //   wallet5:wallet5
    // })
   
  },
  toyongdetail:function(){
    wx.navigateTo({
      url: '/pages/grawsdetail/grawsdetail',
    })
  },
  towidth: function () {
    var able = this.data.able
    wx.navigateTo({
      url: '/pages/widthgraws/widthgraws?wallet1=' + able,
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
    // this.getmember()
    this.getwithdrawinfo()
    this.getComDetail();
  },
 
  getwithdrawinfo:function(){
    var that = this
    var data={}
    app.request('/withdraw/info',data,this,(that,res)=>{
      var withinfo = res.data.results;
      that.setData({
        withinfo: withinfo
      })
    })
  },
  getComDetail:function() {
    var that = this;
    var token=wx.getStorageSync('token');
    var data = {token:token}
    app.request('/member/wallet', data, this, (that, res) => {
      var wallet1=res.data.results.able;
      var wallet2=res.data.results.pedding;
      var able=parseFloat(wallet1).toFixed(2);
      var pedding=parseFloat(wallet2).toFixed(2);
      that.setData({able:able,pedding:pedding});
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