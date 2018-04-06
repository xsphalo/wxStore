// pages/withgraws/widthgraws.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wallet1: '',
    info: {},
    monnumb: '',
    members: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wallet1 = options.wallet1;
    // console.log(benifit);
    this.setData({
      wallet1: wallet1
    });
  },

  amount: function (e) {
    var amount = e.detail.value;
    this.setData({
      amount: amount
    })
  },
  // getname: function (e) {
  //   var acct_name = e.detail.value;
  //   this.setData({
  //     acct_name: acct_name
  //   })
  // },
  // getmobile: function (e) {
  //   var mobile = e.detail.value;
  //   this.setData({
  //     mobile: mobile
  //   })
  // },
  // getbankno: function (e) {
  //   var bankno = e.detail.value;
  //   this.setData({
  //     bankno: bankno
  //   })
  // },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    // this.getinfo();
    // this.gettimoney()
    this.getmember()
  },
  getmember: function () {
    var members = wx.getStorageSync('levels')
    this.setData({
      members: members
    })
  },
  // gettimoney: function () {
  //   var that = this;
  //   app.request('', data, this, (that, res) => {
  //     var monnumb = res.data.results;
  //     that.setData({
  //       monnumb: monnumb,
  //     })
  //   })
  // },
  // getinfo: function () {
  //   var that = this;
  //   app.request('', data, this, (that, res) => {
  //     var info = res.data.results;
  //     that.setData({
  //       info: info,
  //     })

  //   })
  // },
  formSubmit: function (e) {
    // var info = this.data.info;
    // // console.log(e);
    // if (info == undefined || info == null || info == {}) {
    //   var mobile = this.data.mobile;
    //   var bankno = this.data.bankno;
    //   var acct_name = this.data.acct_name;
    // } else {
    //   var mobile = e.detail.value.mobile;
    //   var bankno = e.detail.value.bankno;
    //   var acct_name = e.detail.value.acct_name;
    //   mobile == info.mobile ? info.mobile : mobile;
    //   bankno == info.bankno ? info.bankno : bankno;
    //   acct_name == info.acct_name ? info.acct_name : acct_name;
    // }
    var that = this;
    var amount = this.data.amount;
    var token = wx.getStorageSync('token')
    // if (amount == undefined || amount == '' || amount == null) {
    //   wx.showToast({
    //     title: '请输入提现金额',
    //     duration: 2000
    //   })
    // }
    var data = {
      // 'mobile': mobile,
      // 'bankno': bankno,
      // 'acct_name': acct_name,
      'amount': amount,
      'token': token
    }
    app.request('/member/withdraw', data, this, (that, res) => {
      wx.showToast({
        title: '提现成功',
        icon: 'success',
        duration: 1000
      })
      var wallet1 = that.data.wallet1
      wallet1 = wallet1 - amount;
      wallet1 = parseFloat(wallet1).toFixed(2)
      that.setData({
        wallet1: wallet1
      })
      //上一个页面实例对象
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];//当前页
      var prevPage = pages[pages.length - 2];  //上一个页面
      var info = prevPage.data //取上页data里的数据也可以修改
      prevPage.setData({
        wallet1: wallet1
      });
      setTimeout(function () {
        wx.navigateBack({})
      }, 1500);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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