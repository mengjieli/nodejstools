/**
 *
 * @author 
 *
 */
class LogicItemCallAPI extends LogicItemBase {

    private itemData: ModelLogicCallAPI;

    public constructor(data: ModelLogicInfo,itemData: ModelLogicCallAPI) {
        super(data);
        this.itemData = itemData;
        this.showBorder(LogicItemBorder.RECT_REAL);
        this.label1.content = "调用接口";
        this.label1.textColor = 0x98d4f0;
//        this.label2.content = itemData.desc + " : " + DataConfig.typeDesc[itemData.varType.type];;
//        this.label2.textColor = 0xeeeeee;//0x60a5cd;
//        this.label3.content = itemData.init ? itemData.init : "无初始值";
//        this.label3.textColor = 0xbbbbbb;
        this.addNext(data.getLogic(this.itemData.next),itemData);
    }
}
