// dist/notice/notice.js
const app = getApp();
var Notice = {
  notice:function(){
    var that = this;
    setInterval(function(){
      app.request('/order/notice', {}, that, (that, res) =>{
        var notice = res.data.results;
        that.setData({ animshow:true,notice:notice,hide:false});
        setTimeout(function(){
          that.setData({ notice: {}, hide: true });
        },4000);
      })
    },15000);
  }
}
module.exports = Notice;