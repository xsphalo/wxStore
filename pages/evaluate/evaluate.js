// pages/evaluate/evaluate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenType: '',
    flag2: 5,
    selects: '',
    items: [
      {
        value: '匿名评价',
        name: 'evaluation',
        checked: 'true'
      }
    ],
    reportevalu: [],
    imgurl: app.globalData.url2,
    comments: [{ 'star': 0 }],
    anonymity: 1,
    photos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var orderno = options.orderno
    var index = options.index
    this.setData({ 'oid': id, orderno: orderno, index: index });
  },

  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  checkboxChange: function (e) {
    this.setData({
      anonymity: e.detail.value
    })
  },
  changeColor11: function (event) {
    var comments = this.data.comments
    var index = event.currentTarget.dataset.index;
    var comment = comments[index] || {};
    comment.star = 1;
    comments[index] = comment;
    this.setData({ comments: comments });
  },
  changeColor12: function (event) {
    var comments = this.data.comments
    var index = event.currentTarget.dataset.index;
    var comment = comments[index] || {}
    comment.star = 2;
    comments[index] = comment;
    this.setData({ comments: comments });
  },
  changeColor13: function (event) {
    var comments = this.data.comments
    var index = event.currentTarget.dataset.index;
    var comment = comments[index] || {}
    comment.star = 3;
    comments[index] = comment;
    this.setData({ comments: comments });
  },
  changeColor14: function (event) {
    var comments = this.data.comments
    var index = event.currentTarget.dataset.index;
    var comments = this.data.comments;
    var comment = comments[index] || {}
    comment.star = 4;
    comments[index] = comment;
    this.setData({ comments: comments });
  },
  changeColor15: function (event) {
    var comments = this.data.comments
    var index = event.currentTarget.dataset.index;
    var comments = this.data.comments;
    var comment = comments[index] || {}
    comment.star = 5;
    comments[index] = comment;
    this.setData({ comments: comments });
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
    this.getordermsg()
  },
  getordermsg: function () {
    var itemlist = wx.getStorageSync('itemlist')
    this.setData({ itemlist: itemlist })
    // console.log(itemlist)
  },
  formSubmit: function (e) {
    var index = this.data.index
    var itemlist = this.data.itemlist
    var comments = this.data.comments
    var itlen = itemlist.length
    var commlen = comments.length
    for (var i = 0; i < itlen; i++) {
      for (var j = 0; j < commlen; j++) {
        comments[j].gid = itemlist[i].gid
        comments[j].opid = itemlist[i].opid
      }
    }
    // console.log(comments)
    var _this = this;
    var isanon = this.data.items[0].checked
    var token = wx.getStorageSync('token')
    var orderno = this.data.orderno
    var data = {
      token: token,
      items: comments,
      isanon: isanon,
      orderno: orderno
    }
    app.request('/comment/post', data, this, (that, res) => {
      var index = that.data.index
      _this.setData({ screenType: 1 });
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];//当前页
      var prevPage = pages[pages.length - 2];  //上一个页面
      var info = prevPage.data //取上页data里的数据也可以修改
      var orderslist = info.orderslist
      orderslist[index].status = 6
      prevPage.setData({
        orderslist: orderslist
      });
      setTimeout(() => {
        wx.navigateBack({})
      }, 1200)
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

  chooseImg: function (event) {
    var index = event.target.dataset.index;
    var comments = this.data.comments;
    var comment = comments[index];
    if (comment.photos == undefined) {
      comment.photos = [];
    }
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://dtt.3dsort.com/util/file/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            console.log(res.data);
            var result = JSON.parse(res.data);
            if (result.errorCode == 0) {
              comment.photos.push(result.results);
              comments[index] = comment;
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
    var comment = e.detail.value;
    var index = e.target.dataset.index;
    var comments = this.data.comments;
    comments[index].comment = comment;
    this.setData({ comments: comments });
    console.log(comments)
  }
})