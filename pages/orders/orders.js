// pages/orders/orders.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderslist: [],
    imgurl: app.globalData.url2,
    status: 'a',
    page: 1,
    hasmore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status = options.status
    if (status != undefined) {
      this.setData({ status: status })
    } else {
      this.setData({ status: '' })
    }
  },
  catetype: function (e) {
    var status = e.currentTarget.dataset.status
    this.setData({ status: status, hasmore: true, page: 1, orderslist: [] })
    this.orderlist()
  },
  orderlist: function () {
    var hasmore = this.data.hasmore
    if (!hasmore) {
      return false
    }
    var that = this
    var token = wx.getStorageSync('token')
    var status = this.data.status
    var orderslist = this.data.orderslist
    var page = this.data.page
    var data = { token: token, page: page, status: status }
    app.request('/order/list', data, this, (that, res) => {
      var rlist = res.data.results.data
      var rlen = rlist.length;
      var orderslist = that.data.orderslist
      for (var i = 0; i < rlen; i++) {
        orderslist.push(rlist[i]);
      }
      if (res.data.results.last_page <= page) {
        that.setData({ hasmore: false })
      }
      that.setData({ page: page + 1, orderslist: orderslist })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  tuikuan:function(e){
    var oiid = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.idx
    var index = e.currentTarget.dataset.index
    var orderslist = this.data.orderslist
    var iteas = orderslist[index].items[idx]
    wx.setStorageSync('iteas', iteas)
    wx.navigateTo({
      url: '/pages/serverlist/serverlist?id='+oiid+'&idx1='+index+'&idx2='+idx,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    app.editTabBar();
    // app.login();
    // if (options.mid != undefined) {
    //   wx.setStorageSync('icode', options.mid);
    // }
    var icode = wx.getStorageSync('icode');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
    this.orderlist();
  },
  todeatail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?id=' + id,
    })
  },
  toexpress:function(e){
    var orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/transoprt/transoprt?orderno=' + orderno,
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
    this.orderlist();
  },
  delets: function (e) {
    var orderno = e.currentTarget.dataset.orderno;
    var idx = e.currentTarget.dataset.index;
    var token = wx.getStorageSync('token');
    var orderslist = this.data.orderslist;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/order/delete',
            method: 'post',
            data: {
              orderno: orderno,
              token: token
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                var olist = that.data.orderslist;
                olist.splice(idx, 1);
                that.setData({ orderslist: olist });
              } else {
                wx.showToast({
                  title: res.data.errorStr,
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  cancel: function (e) {
    var orderno = e.currentTarget.dataset.orderno;
    var index = e.currentTarget.dataset.index;
    var token = wx.getStorageSync('token');
    var orderslist = this.data.orderslist;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/order/cancel',
            method: 'post',
            data: {
              orderno: orderno,
              token: token
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                var olist = that.data.orderslist;
                olist[index].status = 4;
                that.setData({ orderslist: olist });
              } else {
                wx.showToast({
                  title: res.data.errorStr,
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  topay: function (e) {
    var orderno = e.currentTarget.dataset.orderno;
    var orderslist = this.data.orderslist;
    var token = wx.getStorageSync('token');
    var that = this;
    var id=e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定支付该订单？',
      success: function (res) {
        wx.request({
          url: app.globalData.url + '/order/pay',
          method: 'post',
          data: {
            orderno: orderno,
            id: id,
            token:token
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
                    wx.redirectTo({
                      url: '/pages/orders/orders?status=1',
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: results.err_code_des,
                })
              }
            }else {
              wx.showToast({
                title: res.data.errorStr,
              })
            }
          }
        })
      }
    })
  },
  finish: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var orderno = e.currentTarget.dataset.orderno;
    var token = wx.getStorageSync('token')
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收货吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.url + '/order/finish',
            method: 'post',
            data: {
              orderno: orderno,
              token: token
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                var olist = that.data.orderslist;
                olist[idx].status = 3;
                that.setData({ orderslist: olist });
              } else {
                wx.showToast({
                  title: res.data.errorStr,
                })
              }
            }
          })
        } else if (sm.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  eve: function (e) {
    var oid = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var orderno = e.currentTarget.dataset.orderno;
    var orderslist = this.data.orderslist;
    wx.setStorageSync('itemlist',orderslist[index].items)
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderno=' + orderno+'&index='+index,
    })
  }
})