// pages/serverlist/serverlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.url2,
    comments: [],
    photos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var oiid = options.id;
    var idx1 = options.idx1;
    var idx2 = options.idx2;
    this.setData({
      oiid: oiid,
      idx1:idx1,
      idx2:idx2
    })
  },
  formSubmit: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var oiid = this.data.oiid;
    var idx1 = this.data.idx1;
    var idx2 = this.data.idx2;
    var types = this.data.types
    var remarks = this.data.comment
    var photos = this.data.comments
    var data = {
      token: token,
      oiid: oiid,
      types: types,
      remarks: remarks,
      photos: photos
    }
    app.request('/order/refund', data, this, (that, res) => {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];//当前页
      var prevPage = pages[pages.length - 2];  //上一个页面
      var info = prevPage.data //取上页data里的数据也可以修改
      var orderlist = info.orderslist;
      var refund = { status_text:'受理中'};
      orderlist[idx1].items[idx2].refund = refund;
      prevPage.setData({
        orderslist: orderlist
      });
      setTimeout(()=>{
        wx.navigateBack({})
      },2000)
    })
  },
  cateslec: function (e) {
    var types = e.currentTarget.dataset.types
    this.setData({
      types: types
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
    this.getsordermsg()
  },
  getsordermsg: function () {
    var iteas = wx.getStorageSync('iteas')
    this.setData({
      iteas: iteas
    })
  },
  chooseImg: function (event) {
    var comments = this.data.comments;
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'http://dtt.3dsort.com/util/file/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            console.log(res.data);
            var result = JSON.parse(res.data);
            if (result.errorCode == 0) {
              comments.push(result.results);
              that.setData({ comments: comments });
              // console.log(comments);
            }
          }, fail: function (res) {
            console.log(res);
          }
        })
      }, fail: function (res) {
        console.log(res);
      }
    })
  },
  comments: function (e) {
    var comment = e.detail.value
    this.setData({ comment: comment })
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