// pages/vips/vips.js
const app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Share, Zan.Notice, {

  /**
   * 页面的初始数据
   */
  data: {
    // screenType:1,
    vips: {},
    imgurl: app.globalData.url2,
    direct: '分享给好友',
    save: '生成分享卡片到相册',
    actionSheetHidden: true,
    rule:[],
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
  // hideshade:function(){
  //   this.setData({
  //     screenType:''
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  tovip: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/giftbag/giftbag?id=' + id,
    })
  },
  tequan: function () {
    wx.navigateTo({
      url: '/pages/vipexplain/vipexplain',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getshoplist()
    this.getvips()
  },
  getvips: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var data = { token: token }
    app.request('/member/upgrade', data, this, (that, res) => {
      var vips = res.data.results
      var rule = vips.rule
      that.setData({
        vips: vips,
        rule: rule
      })
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
      title: '会员',
      path: url + '?mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  save: function () {
    //生成分享卡片到相册
    wx.showLoading({
      title: '生成中...',
    });
    var data = {};
    data.token = wx.getStorageSync('token');
    app.request('/poster/member', data, this, (that, res) => {
      wx.downloadFile({
        url: that.data.imgurl + res.data.results,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              wx.showModal({
                title: '提示',
                content: '保存成功',
              });
              wx.hideLoading();
              that.setData({ actionSheetHidden: true })
            },
            fail:function(res){
              wx.showModal({
                title: '下载文件失败',
                content: JSON.stringify(res),
              })
              wx.hideLoading();
            }
          })
        }
      })
      
    })
  }
}))