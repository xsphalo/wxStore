// pages/addreset/addreset.js
import areas from '../../utils/area.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {},
    customItem: '',
    screenType: '',
    isdefault: '',
    multiArray: [],
    multiIndex: [],
    hasadress: false,
    addetail: {},
    hasdetail: false
  },
  applying: function () {
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  formSubmit: function (e) {
    var that = this;
    var mobile = e.detail.value.mobile;
    var receiver = e.detail.value.receiver;
    var address = e.detail.value.address;
    var isdefault = this.data.isdefault;
    var token = wx.getStorageSync('token');
    var areaid = this.data.areaid
    var id = this.data.id
    var data = {
      'token': token,
      'mobile': mobile,
      'receiver': receiver,
      'address': address,
      'isdefault': isdefault,
      'areaid': areaid,
      'id': id
    }
    app.request('/address/post', data, this, (that, res) => {
      that.applying();
      setTimeout(() => {
        // wx.redirectTo({
        //   url: '/pages/addlist/addlist',
        // })
        wx.navigateBack({})
      }, 1000)
    })
  },
  mobile: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  name: function (e) {
    var that = this;
    that.setData({
      receiver: e.detail.value
    })
  },
  address: function (e) {
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },
  setDefaultAddress: function (e) {
    var isdefault = e.detail.value;
    this.setData({
      isdefault: isdefault
    })
  },
  getaddlist(i) {
    var multiArray = this.data.multiArray || []
    multiArray[0] = areas["0"];
    multiArray[1] = areas[multiArray[0][0].id];
    multiArray[2] = areas[multiArray[1][0].id];
    this.setData({ multiArray: multiArray });
    // console.log(multiArray)
  },
  bindMultiPickerChange: function (e) {
    // console.log('multiIndex携带值为', e.detail.value)
    var multiIndex = e.detail.value
    var multiArray = this.data.multiArray
    var areaid = multiArray[2][multiIndex[2]].id
    this.setData({
      multiIndex: e.detail.value,
      areaid: areaid
    })
    // console.log(areaid)
  },
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var hasadress = this.data.hasadress
    this.setData({
      hasadress: true
    })
    var multiIndex = this.data.multiIndex;
    var column = e.detail.column;
    var value = e.detail.value;
    var multiArray = this.data.multiArray || [];
    multiIndex[column] = value;
    if (column <= 1) {
      multiArray[column + 1] = areas[multiArray[column][value].id];
      multiIndex[column + 1] = 0;
      if (column + 2 <= 2) {
        multiArray[column + 2] = areas[multiArray[column + 1][0].id];
        multiIndex[column + 2] = 0;
      };
    }
    var areaid = multiArray[2][multiIndex[2]].id
    this.setData({ multiArray: multiArray, multiIndex: multiIndex, areaid: areaid });
    // console.log(multiArray,areaid)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      id: id
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
    this.getaddlist()
    this.getaddetail()
  },
  getaddetail: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var id = this.data.id;
    var data = {
      token: token,
      id: id
    }
    app.request('/address/detail', data, this, (that, res) => {
      var addetail = res.data.results
      // if (addetail == null || addetail == undefined || addetail==''){
      //   return false
      // }
      var isdefault = addetail.isdefault
      var areaid = addetail.areaid
      var hasdetail = that.data.hasdetail
      if (addetail == '' || addetail == undefined) return;
      var multiArray = that.data.multiArray || []
      multiArray[0] = areas[0];
      multiArray[1] = areas[addetail.area.gid];
      multiArray[2] = areas[addetail.area.pid];
      var multiIndex = [0, 0, 0];
      var l1 = multiArray[0].length;
      for (var i = 0; i < l1; i++) {
        if (multiArray[0][i].id == addetail.area.gid) {
          multiIndex[0] = i;
          break;
        }
      }
      var l2 = multiArray[1].length;
      for (var i = 0; i < l2; i++) {
        if (multiArray[1][i].id == addetail.area.pid) {
          multiIndex[1] = i;
          break;
        }
      }
      var l3 = multiArray[2].length;
      for (var i = 0; i < l3; i++) {
        if (multiArray[2][i].id == addetail.area.id) {
          multiIndex[2] = i;
          break;
        }
      }
      that.setData({
        addetail: addetail,
        isdefault: isdefault,
        areaid: areaid,
        hasdetail: true,
        hasadress: true,
        multiArray: multiArray,
        multiIndex: multiIndex
      })
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

})