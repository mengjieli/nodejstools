/**
 *
 * @author
 *
 */
var ModelEditer = (function (_super) {
    __extends(ModelEditer, _super);
    function ModelEditer() {
        _super.call(this);
        this.startx = 100;
        this.starty = 120;
        this.varList = new VarList();
        this.addChild(this.varList);
        this.varList.height = 70;
        this.bg = new egret.Shape();
        this.addChild(this.bg);
        this.bg.y = this.varList.height;
        this.content = new egret.Sprite();
        this.content.x = this.startx;
        this.content.y = this.starty;
        this.addChild(this.content);
        this.title = new eui.Label();
        this.title.size = 14;
        this.title.textColor = 0x999999;
        this.title.x = 5;
        this.title.y = 80;
        this.addChild(this.title);
    }
    var d = __define,c=ModelEditer;p=c.prototype;
    p.validateDisplayList = function () {
        _super.prototype.validateDisplayList.call(this);
        this.bg.graphics.clear();
        this.bg.graphics.beginFill(0x222222);
        this.bg.graphics.drawRect(0, 0, this.width, this.height - 40);
        this.bg.graphics.endFill();
        this.varList.width = this.width - this.varList.x;
    };
    p.showLogic = function (logic) {
        if (logic == this.data) {
            return;
        }
        if (this.data) {
            this.data.removeEventListener(ModelLogicInfo.ADD_LOGIC, this.flush, this);
            this.data.removeEventListener(ModelLogicInfo.DEL_LOGIC, this.flush, this);
        }
        this.data = logic;
        this.data.addEventListener(ModelLogicInfo.ADD_LOGIC, this.flush, this);
        this.data.addEventListener(ModelLogicInfo.DEL_LOGIC, this.flush, this);
        this.varList.dataProvider = logic.vars;
        this.title.text = logic.desc;
        this.flush();
    };
    p.flush = function (e) {
        if (e === void 0) { e = null; }
        while (this.content.numChildren) {
            this.content.removeChildAt(0);
        }
        if (this.data.items.length) {
            var itemData = this.data.getLogic(this.data.start);
            var item = ModelEditer.getNetLogicItem(this.data, itemData);
            this.content.addChild(item);
        }
        else {
            var item = ModelEditer.getNetLogicItem(this.data);
            this.content.addChild(item);
        }
    };
    ModelEditer.getNetLogicItem = function (data, item, parentLogic) {
        if (item === void 0) { item = null; }
        if (parentLogic === void 0) { parentLogic = null; }
        if (item == null) {
            return new LogicItemNew(data, parentLogic);
        }
        if (item.type == LogicType.DEFINE) {
            return new LogicItemDefine(data, item);
        }
        else if (item.type == LogicType.CALL_API) {
            return new LogicItemCallAPI(data, item);
        }
        return null;
    };
    return ModelEditer;
})(eui.Component);
egret.registerClass(ModelEditer,"ModelEditer");
