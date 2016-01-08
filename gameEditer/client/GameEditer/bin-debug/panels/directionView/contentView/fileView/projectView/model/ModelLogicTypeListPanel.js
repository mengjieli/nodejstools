/**
 *
 * @author
 *
 */
var ModelLogicTypeListPanel = (function (_super) {
    __extends(ModelLogicTypeListPanel, _super);
    function ModelLogicTypeListPanel(x, y, info, parentLogic) {
        if (parentLogic === void 0) { parentLogic = null; }
        _super.call(this);
        this.data = info;
        this.parentLogic = parentLogic;
        this.x = x + 20;
        this.y = y;
        var list = new List();
        this.list = list;
        list.width = 150;
        list.height = 80;
        var data = new eui.ArrayCollection();
        data.addItem({ "label": "定义变量", "type": "define" });
        data.addItem({ "label": "条件判断", "type": "if" });
        data.addItem({ "label": "调用 model API", "type": "callAPI" });
        data.addItem({ "label": "返回值", "type": "return" });
        list.dataProvider = data;
        list.addEventListener(egret.Event.CHANGE, this.onListChange, this);
        this.addChild(list);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
    var d = __define,c=ModelLogicTypeListPanel;p=c.prototype;
    p.addToStage = function (e) {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    };
    p.onTouch = function (e) {
        var target = e.target;
        var self = false;
        while (target) {
            if (target == this) {
                self = true;
                break;
            }
            target = target.parent;
        }
        if (!self) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
            this.parent.removeChild(this);
        }
    };
    p.onListChange = function (e) {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.list.removeEventListener(egret.Event.CHANGE, this.onListChange, this);
        var _this = this;
        var item = this.list.selectedItem;
        setTimeout(function () {
            _this.parent.removeChild(_this);
            new ModelLogicAddItemPanel(item.type, item.label, _this.data, _this.parentLogic);
        }, 150);
    };
    return ModelLogicTypeListPanel;
})(eui.Component);
egret.registerClass(ModelLogicTypeListPanel,"ModelLogicTypeListPanel");
