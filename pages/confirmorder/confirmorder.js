// pages/confirmorder/confirmorder.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shohid1: true,
    shohid: false,
    shohid2: false,
    shows: [],
    imgurl: app.globalData.url2,
    address: { address: '暂无地址信息' },
    mreduce: 0,
    reduce: 0,
    discount: 0,
    mtext: '',
    noremark: true,
    remarks: '',
    expressprice: 0,
    goodslists: [],
    text: '请选择优惠券',
    froms: '',
    ifadress: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var froms = options.froms
    this.setData({
      froms: froms
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
    this.setData({ orderno: 0 });
    this.getDefaultAddress();
    this.goodslist();
    this.showDiscount();
    var remarks = wx.getStorageSync('remarks');
    if (remarks.replace(/(^s*)|(s*$)/g, "").length !== 0) {
      this.setData({
        noremark: false,
        remarks: remarks
      })
    } else {
      this.setData({
        noremark: true,
      })
    }
  },
  /**
   * 商品列表
   */
  goodslist: function () {
    var items = wx.getStorageSync('items');
    var goodslists = wx.getStorageSync('goodslists');
    // console.log(goodslists)
    this.setData({
      goodslists: goodslists
    })
    var addressid = wx.getStorageSync('addressid');
    this.goodsprice();
    this.getExpress();
  },
  /**
     * 获取默认地址
     */
  getDefaultAddress: function () {
    var addressid = wx.getStorageSync('addressid');
    var token = wx.getStorageSync('token')
    var that = this;
    var data = {
      token: token,
      id: addressid
    }
    if (addressid != undefined && addressid != '') {
      app.request('/address/detail', data, this, (that, res) => {
        var ifadress = that.data.ifadress
        if (res.data.results == undefined || res.data.results == '' || res.data.results == null) {
          that.setData({
            ifadress: false
          })
          return false
        } else {
          that.setData({
            ifadress: true
          })
        }
        that.setData({ address: res.data.results })
        wx.setStorageSync('areaid', res.data.results.areaid);
        that.getExpress();
      })
    } else {
      app.request('/address/getDefault', data, this, (that, res) => {
        that.setData({ address: res.data.results });
        var ifadress = that.data.ifadress
        if (res.data.results == undefined || res.data.results == '' || res.data.results == null) {
          that.setData({
            ifadress: false
          })
          return false
        } else {
          that.setData({
            ifadress: true
          })
        }
        wx.setStorageSync('addressid', res.data.results.id);
        wx.setStorageSync('areaid', res.data.results.areaid);
        that.getExpress();
      })
    }
  },

  /**
   * 订单总额
   */
  orderprice: function () {
    var gtotal = this.data.gtotal;
    var expressprice = this.data.expressprice;
    var ototal = gtotal + parseFloat(expressprice);
    this.setData({ ototal: ototal, gtotal: gtotal });
  },
  //商品金额
  goodsprice: function () {
    var goodslists = this.data.goodslists;
    var len = goodslists.length;
    var gtotal = 0;
    for (var i = 0; i < len; i++) {
      if(goodslists[i].goods.isspec==1)
      gtotal += goodslists[i].option.saleprice * goodslists[i].counts;
      else
        gtotal += goodslists[i].goods.saleprice * goodslists[i].counts;
    }
    this.setData({ gtotal: gtotal });
  },
  //快递费用
  getExpress: function () {
    var areaid = wx.getStorageSync('areaid');
    var items = wx.getStorageSync('items')
    if (areaid == '' || areaid==undefined){
      this.orderprice();
      return false
    }
    var price = this.data.gtotal;
    var that = this;
    var data = {
      areaid: areaid,
      price: price,
      items:items
    }
    app.request('/express', data, this, (that, res) => {
      that.setData({ expressprice: res.data.results });
      that.orderprice();
    })
  },
  create: function () {
    var orderno = this.data.orderno
    var items = wx.getStorageSync('items')
    var token = wx.getStorageSync('token')
    var remarks = wx.getStorageSync('remarks')
    var addressid = wx.getStorageSync('addressid')
    var address = this.data.address
    var froms = this.data.froms
    var that = this;
    var data = {
      items: items,
      token: token,
      remarks: remarks,
      addressid: addressid,
      'from': froms
    }
    if ((this.data.address == undefined || this.data.address == null)) {
      wx.showModal({
        title: '提示',
        content: '请选择地址',
      });
      return;
    }
    if ((addressid == undefined || addressid == 0)) {
      wx.showModal({
        title: '提示',
        content: '请选择地址',
      });
      return;
    }
    var orderno = this.data.orderno;
    if(orderno != undefined && orderno != 0 && orderno != ''){
      this.pay();
      return;
    }
    app.request('/order/create', data, this, (that, res) => {
      var orderno = res.data.results;
      that.setData({ orderno: orderno });
      that.pay();
    })
  },
  /**
   * 支付
   */
  pay: function () {
    var orderno = this.data.orderno;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.url + '/order/pay',
      method: 'post',
      data: {
        orderno: orderno,
        token: token
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          var results = res.data.results;
          if (results.return_code == 'SUCCESS' && results.result_code == 'SUCCESS') {
            wx.requestPayment({
              timeStamp: results.timeStamp,
              nonceStr: results.nonceStr,
              package: results.package,
              signType: results.signType,
              paySign: results.paySign,
              success: function (res) {
                var remarks = wx.getStorageSync('remarks');
                wx.removeStorageSync('remarks');
                wx.redirectTo({
                  url: '/pages/orders/orders?status=1',
                })
              }
            })
          } else {
            wx.showToast({
              title: results.return_msg,
            })
          }
        } else if (res.data.errorCode == 0) {
          wx.redirectTo({
            url: '/pages/orders/orders?status=1',
          })
        } else {
          wx.showToast({
            title: res.data.errorStr,
          })
        }
      }
    })
  },

  //打开卡券列表
  cardList: function () {
    var ototal = this.data.ototal
    // console.log(ototal)
    wx.navigateTo({
      url: '/pages/onecoupon/onecoupon?price=' + ototal,
    })
  },
  //显示优惠
  showDiscount: function () {
    var card = wx.getStorageSync('counitem')
    // var pages = getCurrentPages();
    //获取上一个页面的所有的方法和data中的数据
    // var prevPage = pages[pages.length -2]
    // var card = prevPage.data.counitem
    if (card == undefined || card == null || card == '') {
      var reduce = 0
      this.setData({
        text: '请选择优惠券',
        reduce: reduce
      })
      return false
    }
    // console.log(prevPage.data)
    var gtotal = parseFloat(this.data.gtotal)
    var text = '-' + card.coupon.reduce
    var reduce = parseFloat(card.coupon.reduce).toFixed(2)
    this.setData({ text: text, reduce: reduce })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('counitem')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var remarks = wx.getStorageSync('remarks')
    wx.removeStorageSync('remarks')
    wx.removeStorageSync('counitem')
    wx.removeStorageSync('areaid')
    
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
  toaddress: function () {
    wx.setStorageSync('from', 'order')
    wx.navigateTo({
      url: '/pages/addlist/addlist',
    })
  },
})