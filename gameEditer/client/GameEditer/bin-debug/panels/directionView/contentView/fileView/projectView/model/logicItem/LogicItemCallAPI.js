/**
 *
 * @author
 *
 */
var LogicItemCallAPI = (function (_super) {
    __extends(LogicItemCallAPI, _super);
    function LogicItemCallAPI(data, itemData) {
        _super.call(this, data);
        this.itemData = itemData;
        this.showBorder(LogicItemBorder.RECT_REAL);
        this.label1.content = "调用接口";
        this.label1.textColor = 0x98d4f0;
        //        this.label2.content = itemData.desc + " : " + DataConfig.typeDesc[itemData.varType.type];;
        //        this.label2.textColor = 0xeeeeee;//0x60a5cd;
        //        this.label3.content = itemData.init ? itemData.init : "无初始值";
        //        this.label3.textColor = 0xbbbbbb;
        this.addNext(data.getLogic(this.itemData.next), itemData);
    }
    var d = __define,c=LogicItemCallAPI;p=c.prototype;
    return LogicItemCallAPI;
})(LogicItemBase);
egret.registerClass(LogicItemCallAPI,"LogicItemCallAPI");
