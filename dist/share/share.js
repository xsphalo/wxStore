// dist/share/share.js
var Share = {
  actionSheetbindchange:function(){
    var actionSheetHidden = this.data.actionSheetHidden;
    this.setData({ actionSheetHidden: !actionSheetHidden})
  },
  toshare:function(){
    this.setData({ actionSheetHidden: false })
  }
}
module.exports = Share;