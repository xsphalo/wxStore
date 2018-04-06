// pages/allshops/allshop.js
const app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Notice, {

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],
    imgurl: app.globalData.url2,
    hasmore: true,
    page: 1,
    nums: 1,
    sorts: true,
    hide: true,
    animshow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mid != undefined) {
      wx.setStorageSync('elIcode', options.mid);
    }
    var icode = wx.getStorageSync('elIcode');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
    this.notice()
  },
  todetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/prodetail/prodetail?id=' + id,
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
    this.getgoodslist()
  },
  getgoodslist: function () {
    var hasmore = this.data.hasmore;
    if (!hasmore) {
      return false
    }
    var that = this
    var page = this.data.page
    var title = this.data.title
    var order = this.data.order
    var sort = this.data.sort
    var data = { page: page, title: title, order: order, sort: sort }
    app.request('/goods/list', data, this, (that, res) => {
      var proer = res.data.results.data;
      var len = proer.length;
      var goodslist = that.data.goodslist;
      for (var i = 0; i < len; i++) {
        goodslist.push(proer[i]);
      }
      if (page >= res.data.results.last_page) {
        that.setData({ hasmore: false });
      }
      that.setData({ goodslist: goodslist, page: page + 1 })
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  bijia: function (e) {
    var index = e.currentTarget.dataset.index
    var bijiagoods = this.data.goodslist
    var bijiamsg = bijiagoods[index]
    var jdprice = bijiamsg.jdprice
    var tbprice = bijiamsg.tbprice
    var jdlink = bijiamsg.jdlink
    var tblink = bijiamsg.tblink
    var duosaleprice = bijiamsg.saleprice
    var protitle = bijiamsg.title
    this.setData({
      screenType: 1,
      jdprice: jdprice,
      tbprice: tbprice,
      jdlink: jdlink,
      tblink: tblink,
      duosaleprice: duosaleprice,
      protitle: protitle
    })
  },
  copyTB: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.tblink,
      success: function (res) {
        // self.setData({copyTip:true}),  
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  copyJD: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.jdlink,
      success: function (res) {
        // self.setData({copyTip:true}),  
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  searchs: function (e) {
    var title = e.detail.value;
    this.setData({
      goodslist: [],
      page: 1,
      hasmore: true,
      title: title
    })
    this.getgoodslist()
  },
  zonghe: function (e) {
    var nums = e.currentTarget.dataset.num
    var isupcolor = this.data.isupcolor
    var isdcolor = this.data.isdcolor
    var order = 'comp'
    this.setData({
      goodslist: [],
      page: 1,
      hasmore: true,
      order: order,
      nums: nums,
      isupcolor: false,
      isdcolor: false
    })
    this.getgoodslist()
  },
  sales: function (e) {
    var nums = e.currentTarget.dataset.num
    var isupcolor = this.data.isupcolor
    var isdcolor = this.data.isdcolor
    var order = 'sales'
    this.setData({
      goodslist: [],
      page: 1,
      hasmore: true,
      order: order,
      nums: nums,
      isupcolor: false,
      isdcolor: false
    })
    this.getgoodslist()
  },
  prices: function (e) {
    var nums = e.currentTarget.dataset.num
    var sorts = this.data.sorts
    var order = 'price'
    var sort
    var isupcolor
    var isdcolor
    if (sorts) {
      sort = 'asc'
      this.setData({
        sorts: !sorts,
        isupcolor: true,
        isdcolor: false
      })
    } else {
      sort = 'desc'
      this.setData({
        sorts: !sorts,
        isupcolor: false,
        isdcolor: true
      })
    }
    this.setData({
      goodslist: [],
      page: 1,
      hasmore: true,
      sort: sort,
      nums: nums,
      order: order
    })
    this.getgoodslist()
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
    this.getgoodslist()
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
      title: '商品搜索',
      path: url + '?mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}))