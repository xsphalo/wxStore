// pages/catechild/catechild.js
// pages/allshops/allshop.js
const app = getApp();
Page({

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
    catelist: [],
    cid: 0,
    screenType: '',
    fihead:false
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
    var pid = options.id
    var cid = pid
    this.setData({
      pid: pid,
      cid: cid
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
    this.gettitles()
    this.getcatelist()
    this.getgoodslist()

  },
  hideshade: function () {
    var screenType = this.data.screenType
    this.setData({
      screenType: ''
    })
  },
  gettitles:function(){
    var that = this
    var id = this.data.pid
    var token = wx.getStorageSync('token')
    var data={
      token:token,
      id:id
    }
    app.request('/category/title',data,this,(that,res)=>{
      var paramtitle = res.data.results
      that.setData({
        paramtitle: paramtitle
      })
      wx.setNavigationBarTitle({
        title: paramtitle
      })
    })
  },
  getcatelist: function () {
    var that = this
    var pid = this.data.pid
    var data = {
      pid: pid,
    }
    app.request('/category/sub', data, this, (that, res) => {
      var catelist = res.data.results
      if (!catelist.length) {
        that.setData({
          fihead: false,
        })
      }else{
        that.setData({
          fihead: true,
        })       
      }
      var catesaml = catelist.slice(0, 4)
      that.setData({
        catelist: catelist,
        catesaml: catesaml
      })
    })
  },
  todetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/prodetail/prodetail?id=' + id,
    })
  },
  category: function (e) {
    var cid = e.currentTarget.dataset.id;
    this.setData({
      cid: cid,
      goodslist: [],
      page: 1,
      hasmore: true,
    })
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
    var cid = this.data.cid
    var data = { page: page, title: title, cid: cid }
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
  bijia: function (e) {
    var index = e.currentTarget.dataset.index
    var bijiagoods = this.data.goodslist
    var bijiamsg = bijiagoods[index]
    var jdprice = bijiamsg.jdprice
    var tbprice = bijiamsg.tbprice
    var jdlink = bijiamsg.jdlink
    var tblink = bijiamsg.tblink
    var duosaleprice = bijiamsg.saleprice
    var protitle = bijiamsg.protitle
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
    var icode = wx.getStorageSync('icode')
    var paramtitle = this.data.paramtitle
    var id  =this.data.id
    // console.lgo(icode)
    return {
      title: paramtitle,
      path: url + '?mid=' + icode+'&id='+id,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})