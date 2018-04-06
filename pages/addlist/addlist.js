// pages/addlist/addlist.js
var app = getApp();
Page({
  data: {
    delBtnWidth: 150,//删除按钮宽度单位（rpx）  
    icon: '/images/bianji.png',
    addrelist: [],
    cardTeams: { 'right': 0, "startRight": 0, },
    key: '',
    startX: '',
    startY: '',
    noaddress: true,
    hasmore: true,
    page: 1,
    items: [
      { checked: 'true' },
    ]
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  

  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    var hasmore = this.data.hasmore
    var addrelist = this.data.addrelist
    var page = this.data.page
    this.setData({
      hasmore: true,
      addrelist: [],
      page: 1
    })
    this.getshouhuo();
  },
  onHide: function () {
  },
  onUnload: function () {
    // 页面关闭  
  },
  selectdefat: function (e) {
    const index = e.currentTarget.dataset.index;
    var addrelist = this.data.addrelist;
    var token = wx.getStorageSync('token')
    var id = addrelist[index].id
    var data = {
      token: token,
      id: id
    }
    app.request('/address/setDefault', data, this, (that, res) => {
      // const isdefault = addrelist[index].isdefault;
      // addrelist[index].isdefault == '1' ? addrelist[index].isdefault = '0' : addrelist[index].isdefault = '1'
      // addrelist[index].isdefault = !isdefault;   
      for (var i in addrelist){
        addrelist[i].isdefault='0'
      }    
      addrelist[index].isdefault = '1'
      this.setData({
        addrelist: addrelist
      });
    })
  },
  drawStart: function (e) {
    var from = wx.getStorageSync('from');
    if (from != undefined && from == 'order') {
      return;
    }
    var dataId = e.currentTarget.dataset.index;
    var touch = e.touches[0];
    var startX = touch.clientX;
    var startY = touch.clientY;
    var cardTeams = this.data.cardTeams;
    var res = {};
    res.right = 150;
    if (cardTeams == undefined) {
      cardTeams = [];
    }
    cardTeams[dataId] = res;
    // var cardTeam = cardTeams[dataId];
    // cardTeam.startRight = cardTeam.right;
    this.setData({
      key: true,
      startX: startX,
      startY: startY,
      dataId: dataId,
    })
  },
  drawEnd: function (e) {
    var from = wx.getStorageSync('from');
    if (from != undefined && from == 'order') {
      return;
    }
    var dataId = this.data.dataId;
    var cardTeams = this.data.cardTeams;
    var data = cardTeams[dataId];
    if (data == undefined || data == '') {
      data = {};
      data.right = 150;
    }
    if (data.right <= 150 / 2) {
      data.right = 0;
    } else {
      data.right = 150;
    }
    cardTeams[dataId] = data;
    this.setData({
      cardTeams: cardTeams
    });
  },
  drawMove: function (e) {
    var from = wx.getStorageSync('from');
    if (from != undefined && from == 'order') {
      return;
    }
    var self = this;
    var cardTeams = this.data.cardTeams;
    var dataId = this.data.dataId;
    var key = this.data.key;
    var startX = this.data.startX;
    if (key) {
      var touch = e.touches[0];
      var endX = touch.clientX;
      var endY = touch.clientY;
      if (endX - startX == 0)
        return;
      var res = cardTeams[dataId];
      if (res == undefined) {
        return;
      }
      //从右往左  
      if ((endX - startX) < 0) {
        // if (res.id == dataId) {
        var startRight = res.right;
        var change = startX - endX;
        var maxRight = 150;
        startRight += change;
        if (startRight > maxRight)
          startRight = maxRight;
        res.right = startRight;
        // }
      } else {//从左往右  
        // var data = res;
        // if (res.id == dataId) {
        var startRight = res.right;
        var change = endX - startX;
        startRight -= change;
        if (startRight <= 0)
          startRight = 0;
        res.right = startRight;
        // }
      }
      cardTeams[dataId] = res;
      self.setData({
        cardTeams: cardTeams
      });
    }
  },

  // //点击删除按钮事件  
  // delItem: function (e) {
  //   var that = this
  //   var token = wx.getStorageSync('token')
  //   var dataId = e.target.dataset.id;
  //   var index = e.currentTarget.dataset.index;
  //   var addrelist = this.data.addrelist;
  //   var noaddress = this.data.noaddress
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定删除该地址信息？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         var data = {
  //           token: token,
  //           id: dataId
  //         }
  //         wx.request({
  //           url: app.globalData.url + '/address/delete',
  //           method: 'post',
  //           data: data,
  //           success: function (res) {
  //             if (res.data.errorCode == 0) {
  //               addrelist.splice(index, 1);
  //               if (!addrelist.length) {
  //                 that.setData({ noaddress: true });
  //               }
  //               that.setData({ addrelist: addrelist });
  //             } else {
  //               wx.showToast({
  //                 title: res.data.errorStr,
  //               })
  //             }
  //           }
  //         })
  //       } else if (res.cancel) {
  //       }
  //     }
  //   })
  // },
  getshouhuo: function () {
    var hasmore = this.data.hasmore;
    if (!hasmore) { return false }
    var page = this.data.page;
    var addrelist = this.data.addrelist;
    var that = this;
    var noaddress = this.data.noaddress
    var token = wx.getStorageSync('token')
    var data = { page: page, token: token }
    app.request('/address/list', data, this, (that, res) => {
      var alist = res.data.results.data;
      var alen = alist.length;
      if (!alist.length) {
        that.setData({ noaddress: true, hasmore: true });
      } else {
        that.setData({ noaddress: false });
      }
      for (var i = 0; i < alen; i++) {
        addrelist.push(alist[i]);
      }
      if (res.data.results.last_page <= page) {
        that.setData({ hasmore: false });
      }
      that.setData({ addrelist: addrelist, page: page + 1 })
    })
  },
  select: function (e) {
    var id = e.currentTarget.dataset.id;
    var areaid = e.currentTarget.dataset.areaid;
    wx.setStorageSync('addressid', id);
    wx.setStorageSync('areaid', areaid);
    var orders = wx.getStorageSync('from');
    if (orders == 'order') {
      wx.removeStorageSync('from');
      wx.navigateBack();
    }
  },
  importid: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/addreset/addreset?id=' + id,
    })
  },
  // ..................................................
  touchS: function (e) {  // touchstart
    let startX = app.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let addrelist = app.Touches.touchM(e, this.data.addrelist, this.data.startX)
    addrelist && this.setData({ addrelist })

  },
  touchE: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let addrelist = app.Touches.touchE(e, this.data.addrelist, this.data.startX, width)
    addrelist && this.setData({ addrelist })
  },
  itemDelete: function (e) {  // itemDelete
    var that = this
    var token = wx.getStorageSync('token')
    var dataId = e.target.dataset.id;
    var index = e.currentTarget.dataset.index;
    var addrelist = this.data.addrelist;
    var noaddress = this.data.noaddress
    var data={
      token: token,
      id: dataId
    }
    wx.showModal({
      title: '提示',
      content: '确定删除地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/address/delete',
            method: 'post',
            data: data,
            success: function (res) {
              if (res.data.errorCode == 0) {
                var addrelist = that.data.addrelist;
                addrelist.splice(index, 1);
                if (!addrelist.length) {
                  that.setData({ noaddress: true });
                }
                that.setData({ addrelist: addrelist });
                wx.showToast({
                  title: '地址删除成功',
                  icon: 'success',
                  duration: 2000
                })
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

})