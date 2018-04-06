/**
   * 购物车
   */
var app = getApp();
var Cart = {
  selSpec: function (e) {
    var idxArr = this.data.idxArr;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var prodetail = this.data.prodetail;
    var newprice = this.data.newprice
    var prodetailop = prodetail.options
    var opleng = prodetailop.length;
    idxArr[index] = id;
    // console.log(idxArr)
    var n, specid = [];
    for (n in idxArr) {
      specid.push(idxArr[n]);
    }
    var values = '';
    var proprice = prodetail.saleprice;
    var opid = 0;
    for (var i = 0; i < opleng;i++){
      var tmp = prodetailop[i].values;
      var valArr = tmp.split('_');
      valArr.sort();
      specid.sort();
      var valStr = valArr.toString();
      var specStr = specid.toString();
      if(valStr == specStr){
        values = tmp;
        proprice = prodetailop[i].saleprice;
        opid = prodetailop[i].id;
        break;
      }
    }
    
    this.setData({ values: values, specid: specid, idxArr: idxArr, proprice: proprice, newprice:false});
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  confirms: function () {
    var froms = this.data.froms
    var values = this.data.values
    var prodetail = this.data.prodetail
    var counts = this.data.counts
    if (froms == 'goods') {
      // if (values !== undefined || values !== '') {
      var prodetail = this.data.prodetail;
      var proptions = prodetail.options
      var prolen = proptions.length
      var optmp = {}
      for (var i = 0; i < prolen; i++) {
        if (values == proptions[i].values) {
          var opid = proptions[i].id
          optmp.title = proptions[i].title
          optmp.saleprice = proptions[i].saleprice
        }
      }
      // console.log(optmp)
      if ((opid === '' || opid === undefined || opid === null) && prodetail.isspec == '1') {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格',
        })
      } else {
        var tmp = {}
        var items = []
        var goodslists = []
        var goodstmp = {}
        tmp.gid = prodetail.id
        tmp.opid = opid
        tmp.counts = counts
        goodstmp.counts = counts
        goodstmp.goods = {}
        goodstmp.option = {}
        goodstmp.goods.isspec = prodetail.isspec
        goodstmp.goods.mphoto = prodetail.mphoto
        goodstmp.goods.saleprice = prodetail.saleprice
        goodstmp.goods.title = prodetail.title
        goodstmp.option.saleprice = optmp.saleprice
        goodstmp.option.title = optmp.title
        items.push(tmp);
        goodslists.push(goodstmp)
        wx.setStorageSync('items', items)
        wx.setStorageSync('goodslists', goodslists)
        wx.navigateTo({
          url: "/pages/confirmorder/confirmorder?froms='goods'",
        })
      }
    } else if (froms == 'cart') {
      this.joincarts()
    } else {
      var prodetail = this.data.prodetail
      var proptions = prodetail.options
      var prolen = proptions.length
      var optmp = {}
      for (var i = 0; i < prolen; i++) {
        if (values == proptions[i].values) {
          var opid = proptions[i].id
          optmp.title = proptions[i].title
          optmp.saleprice = proptions[i].saleprice
          this.setData({
            optmp: optmp,
            screenType: ''
          })
        }
      }
    }
  },
  joincarts: function (event) {
    var values = this.data.values
    if (values !== undefined || values !== '') {
      var prodetail = this.data.prodetail
      var proptions = prodetail.options
      var prolen = proptions.length
      for (var i = 0; i < prolen; i++) {
        if (values == proptions[i].values) {
          var opid = proptions[i].id
        }
      }
      var token = wx.getStorageSync('token')
      var gid = prodetail.id
      var counts = this.data.counts
      var that = this
      var data = {
        token: token,
        gid: gid,
        counts: counts,
        opid: opid
      }
      app.request('/cart/add', data, this, (that, res) => {
        that.hideshade();
        wx.showToast({
          title: '添加购物车成功',
          icon: 'success',
          duration: 1200
        })
      })
    }
  },
  buynow: function () {
    var spec = this.data.spec;
    if (spec != undefined && spec.quantity > 0) {
      var goods = this.data.goods;
      var gid = goods.id;
      var gsid = spec.id;
      var count = spec.quantity;
      var tmp = {};
      tmp.gid = gid;
      tmp.gsid = gsid;
      tmp.count = count;
      var items = [];
      items.push(tmp);
      wx.setStorageSync('items', items);
      wx.navigateTo({
        url: '/pages/confirmorders/confirmorders',
      })
    }
  },
  addCount: function (e) {
    var counts = this.data.counts;
    var stock=this.data.stock;
    if(counts<stock)
    counts++
    else{
      wx.showModal({
        title: '提示',
        content: '库存不足!'
      })
     return false
    }
    this.setData({
      counts: counts
    })
    if (counts > 1) {
      this.setData({ cant: true })
    }
  },
  minusCount: function (e) {
    var counts = this.data.counts
    if (counts <= 1) {
      this.setData({ cant: false })
      return false;
    }
    counts--;
    this.setData({
      counts: counts
    })
  },
}
module.exports = Cart;
