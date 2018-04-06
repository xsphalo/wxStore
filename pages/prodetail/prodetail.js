// pages/prodetail/prodetail.js
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Cart, Zan.Share, {
  /**
   * 页面的初始数据
   */
  data: {
    flag2: 5,
    test: "",
    showhidden: false,
    detailsh: true,
    prodetail: {},
    commits: [],
    imgurl: app.globalData.url2,
    screenType: '',
    screenTypes: '',
    page: 1,
    // morecomment: true,
    photos: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    total: '',
    nocom: false,
    counts: 1,
    cant: true,
    trigger: false,
    idxArr: {},
    optmp: { 'title': "请选择商品规格" },
    direct: '分享该商品给好友',
    save: '生成分享卡片到相册',
    actionSheetHidden: true,
    proprice:'',
    stock:''
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if(id != undefined){
      this.setData({ id: id });
    }
    
    if (options.mid != undefined && options.mid != '') {
      wx.setStorageSync('elIcode', options.mid);
    }
    
    var scene = options.scene;
    if (scene != undefined) {
      scene = decodeURIComponent(scene);
      var tmps = scene.split('&');
      if(tmps[0] != undefined){
        var gtmps = tmps[0].split('=');
        if(gtmps[1]!= undefined){
          this.setData({ id: gtmps[1] });
        }
      }
      if (tmps[1] != undefined) {
        var itmps = tmps[1].split('=');
        if (itmps[1] != undefined) {
          wx.setStorageSync('elIcode', itmps[1]);
        }
        
      }
    }
    var icode = wx.getStorageSync('elIcode');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
  },
  toeve: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userevaluate/userevaluate?id=' + id,
    })
  },
  bijia: function (e) {
    var index = e.currentTarget.dataset.index
    var prodetail = this.data.prodetail
    var jdprice = prodetail.jdprice
    var tbprice = prodetail.tbprice
    var jdlink = prodetail.jdlink
    var tblink = prodetail.tblink
    var duosaleprice = prodetail.saleprice
    this.setData({
      screenTypes: 1,
      jdprice: jdprice,
      tbprice: tbprice,
      jdlink: jdlink,
      tblink: tblink,
      duosaleprice: duosaleprice
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  trigger: function () {
    var trigger = this.data.trigger
    var token = wx.getStorageSync('token')
    var gid = this.data.id
    var data = {
      token: token,
      gid: gid
    }
    app.request('/like/trigger', data, this, (that, res) => {
      if (!trigger){
        wx.showToast({
          title: '加入收藏成功',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none',
          duration: 2000
        })
      }
      that.setData({
        trigger: !trigger
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getprodetail();
    this.getComment();
  },
  getprodetail: function () {
    var id = this.data.id;
    var that = this;
    wx.request({
      url: app.globalData.url + '/goods/detail',
      method: 'post',
      data: {
        id: id
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          var photos = res.data.results.photos
          var proprice = res.data.results.saleprice
          var descr = res.data.results.descr
          var stock = res.data.results.stock;
          var WxParse = require('../../wxParse/wxParse.js');
          WxParse.wxParse('content', 'html', descr, that, 5);
          that.setData({ prodetail: res.data.results, photos: photos, proprice: proprice ,stock:stock})
        } else {
          wx.showToast(res.data.errorStr);
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
    this.getComment();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var icode = wx.getStorageSync('icode');
    var id = this.data.id;
    return {
      title: '商品详情',
      path: url + '?id=' + id + '&mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  tocart: function () {
    wx.reLaunch({
      url: '/pages/shoplist/shoplist',
    })
  },
  addcart: function () {
    var prodetail = this.data.prodetail
    if (prodetail.isvirtual == 1) {
      wx.showModal({
        title: '提示',
        content: '虚拟物品请直接购买',
      })
      this.setData({
        screenType: '',
      })
      return false
    }
    var froms = "cart"
    this.setData({
      froms: froms,
      screenType: 1,
    })
  },
  choicespec: function () {
    var froms = 'other'
    this.setData({
      froms: froms,
      screenType: 1,
    })
  },
  hideshades: function () {
    this.setData({
      screenTypes: '',
    })
  },
  buy: function () {
    var goods = this.data.prodetail
    var froms = "goods"
    goods.specs = goods.spec;
    var spec = null;
    if (goods.spec.length <= 0) {
      spec = goods;
    }
    this.setData({
      screenType: 1,
      prodetail: goods,
      goods: goods,
      spec: spec,
      specs: goods.specs,
      froms: froms
    })
  },
  /**
   * 商品评价
   */
  getComment: function () {
    // var morecomment = this.data.morecomment;
    // if (!morecomment) {
    //   return false;
    // }
    var id = this.data.id;
    // var page = this.data.page;
    // var commits = this.data.commits;
    var that = this;
    wx.request({
      url: app.globalData.url + '/comment/glist',
      method: 'post',
      data: {
        id: id,
        // page: page
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          // var clist = res.data.results.data;
          // var clen = clist.length;
          // var total = res.data.results.total
          // for (var i = 0; i < clen; i++) {
          //   commits.push(clist[i]);
          // }
          // if (res.data.results.last_page <= page) {
          //   that.setData({ morecomment: false });
          // }
          // that.setData({ commits: commits, page: page + 1, total: total});

          var total = res.data.results.total
          var clist = res.data.results.data;
          clist.length ?
            that.setData({ nocom: false }) :
            that.setData({ nocom: true });
          var commits = clist.slice(0, 4)
          that.setData({
            total: total,
            commits: commits
          })
        }
      }
    })
  },
  save: function () {
    //生成分享卡片到相册
    wx.showLoading({
      title: '生成中...',
    });
    var data = {};
    data.id = this.data.id;
    data.token = wx.getStorageSync('token');
    app.request('/poster/goods', data, this, (that, res) => {
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
              that.setData({ actionSheetHidden: true })
              wx.hideLoading();
            },
            fail:function(res){
              wx.showModal({
                title: '保存文件失败',
                content: JSON.stringify(res),
              })
              wx.hideLoading();
            }
          })
        },
        fail:function(res){
          wx.showModal({
            title: '下载文件失败',
            content: JSON.stringify(res),
          })
          wx.hideLoading();
        }
      })
      
    })
  },
  //头图
  viewBanner:function(event){
    var photos = this.data.photos;
    var plen = photos.length;
    var current = event.currentTarget.dataset.src;
    var urls = [];
    var imgurl = this.data.imgurl;
    for(var i=0;i<plen;i++){
      urls.push(imgurl + photos[i]);
    }
    wx.previewImage({
      current:current,
      urls: urls,
    })
  },
  //评论
  viewComment:function(event){
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
}))