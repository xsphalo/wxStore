// pages/shoplist/shoplist.js
var app = getApp();

var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Notice, {

  /**
   * 页面的初始数据
   */
  data: {
    selects: '/images/unselect.png',
    selectsed: '/images/unselect.png',
    jians: '/images/jians.png',
    condition: false,
    conditions: false,
    opacontent: '编辑',
    screenType: '',
    totalPrice: 0,
    totalpro: 1,
    carts: [],
    hasList: false,
    selectAllStatus: false,
    index: '',
    shopheads: true,
    cartsid: '',
    imgurl: app.globalData.url2,
    hasmore: true,
    page: 1,
    hide: true,
    animshow: false,
  },
  delets: function () {
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  selectAll: function (e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  checkboxChanges: function (e) {
    const index = e.currentTarget.dataset.index;

    // console.log(index);
    let carts = this.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;              // 改变状态
    this.setData({
      carts: carts
    });
  },
  bianji: function () {
    var that = this
    var flag = this.data.condition;
    var token = wx.getStorageSync('token')
    var carts = this.data.carts;
    var clen = carts.length;
    var itema = this.data.itema || [];
    for (var i = 0; i < clen; i++) {
      var tmp = {};
      tmp.id = carts[i].id;
      tmp.counts = carts[i].counts;
      itema.push(tmp);
    }
    var data = {
      token: token,
      items: itema
    }
    if (!flag) {
      this.setData({
        condition: true,
        conditions: true,
        opacontent: '完成',
      })
    } else {
      app.request('/cart/update', data, this, (that, res) => {
        that.setData({
          condition: false,
          conditions: false,
          opacontent: '编辑',
          itema: itema
        })
      })
    }
  },

  deleteList: function (e) {
    var token = wx.getStorageSync('token')
    var index = this.data.index;
    let carts = this.data.carts;
    var that = this;
    var ids = [];
    var idxs = [];
    var clen = carts.length;
    for (var i = 0; i < clen; i++) {
      if (carts[i].selected) {
        ids.push(carts[i].id);
        idxs.push(i);
      }
    }
    var data = {
      toekn: token,
      ids: ids
    }
    app.request('/cart/delete', data, this, (that, res) => {
      idxs = idxs.reverse();
      var ilen = idxs.length;
      for (var i = 0; i < ilen; i++) {
        carts.splice(ilen[i], 1);
      }
      var rlen = carts.length
      that.setData({
        carts: carts,
        rlen: rlen
      });
      if (!carts.length) { // 如果购物车为空
        that.setData({
          hasList: false, // 修改标识为false，显示购物车为空页面
          condition: false,
        });
      } else { // 如果不为空
        that.getTotalPrice(); // 重新计算总价格
      }
      that.hideshade();
    })
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
  selectList: function (e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    this.setData({
      index: index
    });
    let carts = this.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;              // 改变状态
    this.setData({
      carts: carts
    });
    this.getTotalPrice();                           // 重新获取总价
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
    this.getTotalPrice();
    this.getshoplist();
  },

  addCount: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let counts = carts[index].counts;
    counts = counts + 1;
    carts[index].counts = counts;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  minusCount: function (e) {
    const index = e.currentTarget.dataset.index;
    // var jians = this.data.jians
    let carts = this.data.carts;
    let counts = carts[index].counts;
    if (counts <= 1) {
      // this.setData({
      //   jians:'/images/cants.png'
      // })
      return false;
    }
    counts = counts - 1;
    carts[index].counts = counts;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  getTotalPrice: function () {
    var carts = this.data.carts;                  // 获取购物车列表
    var total = 0;
    var totalpro = 0;
    console.log(carts)
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) { 
                        // 判断选中才会计算价格
        if(carts[i].goods.isspec==1)
        total += carts[i].counts * carts[i].option.saleprice; 
        else
        total += carts[i].counts * carts[i].goods.saleprice;    // 所有价格加起来
        totalpro += carts[i].counts;
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      totalpro: totalpro
    });
  },
  getshoplist: function () {
    var hasmore = this.data.hasmore
    if (!hasmore) {
      return false
    }
    var token = wx.getStorageSync('token')
    var page = this.data.page
    var carts = this.data.carts
    var that = this;
    var data = {
      token: token,
      page: page
    }
    app.request('/cart/list', data, this, (that, res) => {
      var rlist = res.data.results.data;
      var rlen = rlist.length;
      if (rlen) {
        that.setData({
          hasList: true
        })
      } else {
        that.setData({
          hasList: false
        })
      }
      for (var i = 0; i < rlen; i++) {
        carts.push(rlist[i]);
      }
      if (page >= res.data.results.last_page) {
        that.setData({ hasmore: false });
      }
      that.setData({ carts: carts, page: page + 1, rlen: rlen })
    })
  },
  buy: function (event) {
    var carts = this.data.carts;
    var clen = carts.length;
    var items = [];
    var goodslists = []
    for (var i = 0; i < clen; i++) {
      if (carts[i].selected) {
        var tmp = {};
        tmp.gid = carts[i].gid;
        tmp.opid = carts[i].opid;
        tmp.counts = carts[i].counts;
        items.push(tmp);
        goodslists.push(carts[i])
      }
    }
    if (items.length <= 0) {
      wx.showToast({
        title: '请选择商品',
      });
      return;
    }
    wx.setStorageSync('items', items);
    wx.setStorageSync('goodslists', goodslists);
    wx.navigateTo({
      url: "/pages/confirmorder/confirmorder?froms=cart",
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
    this.getshoplist()
  },

}))