//app.js
var api = 'https://dtt.3dsort.com/api';
import Touches from './utils/Touches.js'
App({
  onLaunch: function () {
    this.login();
  },
  login: function () {
    var url = api;
    var that = this;
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    wx.login({
      success: function (res) {
        var jscode = res.code
        wx.setStorageSync('jscode', jscode)
        if (res.code) {
          wx.getUserInfo({
            success: function (res) {
              wx.setStorageSync('userInfo', res.userInfo);//存储userInfo  
              userInfo = res.userInfo;
              var jscode = wx.getStorageSync('jscode'),
                userinfo = userInfo
              var data = { jscode: jscode, userinfo: userinfo }
              wx.request({
                url: url + '/member/login',
                method: 'post',
                data: data,
                success: function (res) {
                  if (res.data.errorCode == 0) {
                    var token = res.data.results.token;
                    var icode=res.data.results.icode;
                    wx.setStorageSync('token', token);
                    wx.setStorageSync('icode', icode);
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: res.data.errorStr,
                    })
                  }
                }
              })
            }
          });
          var d = that.globalData;//这里存储了appid、secret、token串    
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  request: function (url, data, that, callback) {
    wx.request({
      url: api + url,
      method: 'post',
      data: data,
      success: function (res) {
        if (res.data.errorCode == 0) {
          callback(that, res);
        } else if (res.data.errorCode == 1015) {
          wx.showToast({
            title: res.data.results,
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.errorCode == 1016) {
          wx.showModal({
            title: '提示',
            content: res.data.errorStr,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/idety/idety',
                })
              } else if (res.cancel) {
              }
            }
          })
        } else {
          var text = res.data.results ? res.data.results : res.data.errorStr
          wx.showModal({
            title: '提示',
            content: text,
          })
        }
      }
    })
  },
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  bindInviter: function () {
    var elIcode = wx.getStorageSync('elIcode')
    var token = wx.getStorageSync('token')
    wx.request({
      url: api + '/member/bind',
      method: 'post',
      data: {
        icode: elIcode,
        token: token
      },
      success: function (res) {
      }
    })
  },
  globalData: {
    userInfo: null,
    url: api,
    url2: 'https://dtt.3dsort.com',
    tabbar: {
      selectedColor: "#ffa712",
      backgroundColor: "#ffffff",
      color: "#555",
      list: [
        {
          pagePath: "/pages/index/index",
          iconPath: "/images/tabbar/home_normal.png",
          selectedIconPath: "/images/tabbar/home_select.png",
          text: "首页",
          selected: true,
          ishow: false
        },
        {
          pagePath: "/pages/categories/categories",
          iconPath: "/images/tabbar/pro_normal.png",
          selectedIconPath: "/images/tabbar/pro_select.png",
          text: "分类",
          selected: false,
          ishow: false
        },
        {
          pagePath: "/pages/vips/vips",
          iconPath: "/images/tabbar/vip_normal.png",
          selectedIconPath: "/images/tabbar/vip_select.png",
          text: "会员",
          selected: false,
          ishow: false
        },
        {
          pagePath: "/pages/shoplist/shoplist",
          iconPath: "/images/tabbar/cart_normal.png",
          selectedIconPath: "/images/tabbar/cart_select.png",
          text: "购物车",
          selected: false,
          ishow: true
        },
        {
          pagePath: "/pages/percenter/percenter",
          iconPath: "/images/tabbar/me_normal.png",
          selectedIconPath: "/images/tabbar/me_select.png",
          text: "我的",
          selected: false,
          ishow: false
        }
      ],
      position: 'bottom'
    }
  },
  Touches: new Touches()
})