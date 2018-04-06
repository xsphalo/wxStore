// pages/userevaluate/userevaluate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag2: 5,
    commits: [],
    nocom: false,
    hasmore: true,
    imgurl: app.globalData.url2,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      id:id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeColor11: function () {
    var that = this;
    that.setData({
      flag2: 1
    });
  },
  changeColor12: function () {
    var that = this;
    that.setData({
      flag2: 2
    });
  },
  changeColor13: function () {
    var that = this;
    that.setData({
      flag2: 3
    });
  },
  changeColor14: function () {
    var that = this;
    that.setData({
      flag2: 4
    });
  },
  changeColor15: function () {
    var that = this;
    that.setData({
      flag2: 5
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getComment()
  },
  getComment: function () {
    var hasmore = this.data.hasmore;
    if (!hasmore) {
      return false;
    }
    var id = this.data.id;
    var page = this.data.page;
    var commits = this.data.commits;
    var that = this;
    wx.request({
      url: app.globalData.url + '/comment/glist',
      method: 'post',
      data: {
        id: id,
        page: page
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          var clist = res.data.results.data;
          var clen = clist.length;
          clist.length ?
            that.setData({ nocom: false }) :
            that.setData({ nocom: true });
          var total = res.data.results.total
          for (var i = 0; i < clen; i++) {
            commits.push(clist[i]);
          }
          if (res.data.results.last_page <= page) {
            that.setData({ hasmore: false });
          }
          that.setData({ commits: commits, page: page + 1, total: total});
        }
      }
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
    this.getComment()
  },
  //查看评论图
  //评论
  viewComment: function (event) {
    var idx = event.currentTarget.dataset.idx;
    var imgurl = this.data.imgurl;
    var photos = this.data.commits[idx].photos;
    var plen = photos.length;
    var current = event.currentTarget.dataset.src;
    var urls = [];
    for (var i = 0; i < plen; i++) {
      urls.push(imgurl + photos[i]);
    }
    wx.previewImage({
      current: current,
      urls: urls,
    })
  }
})