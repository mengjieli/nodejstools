var LogicItemBorder = (function () {
    function LogicItemBorder() {
    }
    var d = __define,c=LogicItemBorder;p=c.prototype;
    LogicItemBorder.RECT_VIRTUAL = "rect_virtual";
    LogicItemBorder.RECT_REAL = "rect_real";
    return LogicItemBorder;
})();
egret.registerClass(LogicItemBorder,"LogicItemBorder");
/**
 *
 * @author
 *
 */
var LogicItemBase = (function (_super) {
    __extends(LogicItemBase, _super);
    function LogicItemBase(data) {
        _super.call(this);
        this.w = 150;
        this.h = 70;
        this.lineColor = 0xaaaaaa;
        this.fillColor = 0x555555;
        this.data = data;
        this.addChild(this.bg = new egret.Shape());
        this.label1 = Label.create({
            color: 0xffffff,
            size: 14,
            width: this.w,
            align: egret.HorizontalAlign.CENTER,
            height: 20,
            y: 5,
            max: 15
        });
        this.addChild(this.label1);
        this.label2 = Label.create({
            color: 0xffffff,
            size: 14,
            width: this.w,
            align: egret.HorizontalAlign.CENTER,
            height: 20,
            y: 27,
            max: 14
        });
        this.addChild(this.label2);
        this.label3 = Label.create({
            color: 0xffffff,
            size: 14,
            width: this.w,
            align: egret.HorizontalAlign.CENTER,
            height: 20,
            y: 49,
            max: 11
        });
        this.addChild(this.label3);
    }
    var d = __define,c=LogicItemBase;p=c.prototype;
    p.showBorder = function (type) {
        this.bg.graphics.clear();
        var width = this.w;
        var height = this.h;
        if (type == LogicItemBorder.RECT_VIRTUAL) {
            this.bg.graphics.beginFill(this.fillColor);
            this.bg.graphics.drawRect(0, 0, width, height);
            this.bg.graphics.endFill();
            this.bg.graphics.lineStyle(1, this.lineColor);
            Graphics.drawVirtualLine(this.bg.graphics, 0, 0, width, 0);
            Graphics.drawVirtualLine(this.bg.graphics, width, 0, width, height);
            Graphics.drawVirtualLine(this.bg.graphics, width, height, 0, height);
            Graphics.drawVirtualLine(this.bg.graphics, 0, height, 0, 0);
        }
        else if (type == LogicItemBorder.RECT_REAL) {
            this.bg.graphics.lineStyle(1, this.lineColor);
            this.bg.graphics.beginFill(this.fillColor);
            this.bg.graphics.drawRect(0, 0, width, height);
            this.bg.graphics.endFill();
        }
    };
    p.createLine = function () {
        var shape = new egret.Shape();
        shape.graphics.lineStyle(1, this.lineColor);
        return shape;
    };
    p.addNext = function (info, parentLogic) {
        if (info === void 0) { info = null; }
        if (parentLogic === void 0) { parentLogic = null; }
        if (this.next) {
            this.removeChild(this.next);
            this.removeChild(this.nextLine);
            this.next = this.nextLine = null;
        }
        var next = ModelEditer.getNetLogicItem(this.data, info, parentLogic);
        this.addChild(next);
        next.y = this.h + 50;
        this.next = next;
        this.nextLine = this.createLine();
        if (info) {
            Graphics.drawArrow(this.nextLine.graphics, this.w / 2, this.h, this.w / 2, next.y);
        }
        else {
            Graphics.drawVirtualArrow(this.nextLine.graphics, this.w / 2, this.h, this.w / 2, next.y);
        }
        this.addChild(this.nextLine);
    };
    return LogicItemBase;
})(eui.Component);
egret.registerClass(LogicItemBase,"LogicItemBase");
