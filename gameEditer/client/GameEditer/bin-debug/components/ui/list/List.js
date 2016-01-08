var ListLabel = (function (_super) {
    __extends(ListLabel, _super);
    function ListLabel() {
        _super.call(this);
        this.percentWidth = 100;
        this.height = 20;
        var clickBg = new eui.Image(RES.getRes("blue"));
        this.addChild(clickBg);
        clickBg.percentWidth = 100;
        clickBg.percentHeight = 100;
        clickBg.alpha = 0;
        this.addChild(this.bg = new eui.Image(RES.getRes("blue")));
        this.bg.percentWidth = 100;
        this.bg.percentHeight = 100;
        this.label = new eui.Label();
        this.label.size = 14;
        this.label.textColor = 0xffffff;
        this.label.height = 20;
        this.label.x = 2;
        this.label.y = 3;
        this.addChild(this.label);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
    }
    var d = __define,c=ListLabel;p=c.prototype;
    p.touch = function (e) {
        this.dispatchEventWith(egret.Event.CHANGE, true);
    };
    d(p, "data"
        ,function () {
            return this._data;
        }
        ,function (val) {
            this._data = val;
            if (val) {
                this.label.text = val.label;
            }
        }
    );
    d(p, "selected"
        ,function () {
            return this._selected;
        }
        ,function (val) {
            this._selected = val;
            this.bg.visible = val;
        }
    );
    p.setSelected = function (val) {
        this._selected = val;
    };
    d(p, "itemIndex"
        ,function () {
            return this._itemIndex;
        }
        ,function (val) {
            this._itemIndex = val;
        }
    );
    return ListLabel;
})(eui.Component);
egret.registerClass(ListLabel,"ListLabel",["eui.IItemRenderer","eui.UIComponent"]);
/**
 *
 * @author
 *
 */
var List = (function (_super) {
    __extends(List, _super);
    function List(horizontal) {
        if (horizontal === void 0) { horizontal = false; }
        _super.call(this);
        var exml;
        if (horizontal) {
            exml = "<e:Skin xmlns:e=\"http://ns.egret.com/eui\">\n                <e:Image width=\"100%\" height=\"100%\" source=\"resource/images/blue2.png\" scale9Grid=\"10,10,51,20\"/>\n                <e:Group id=\"group\" width=\"100%\" height=\"100%\" xmlns:e=\"http://ns.egret.com/eui\">\n                    <e:Scroller width=\"100%\" height=\"100%\">\n                        <e:Skin>\n                            <e:HScrollBar id=\"verticalScrollBar\" width=\"100%\" height=\"20\" bottom=\"0\">\n                                <e:Skin>\n                                    <e:Image width=\"100%\" height=\"100%\" source=\"resource/assets/ScrollBar/track.png\" scale9Grid=\"1,1,4,4\"/>\n                                    <e:Image id=\"thumb\" width=\"20\" height=\"20\" source=\"resource/assets/ScrollBar/roundthumb.png\"  scale9Grid=\"1,1,4,4\"/>\n                                </e:Skin>\n                            </e:HScrollBar>\n                        </e:Skin>\n                        <e:List id=\"list\" width=\"100%\" height=\"100%\">\n                            <e:layout>\n                                <e:HorizontalLayout/>\n                            </e:layout>\n                        </e:List>\n                    </e:Scroller>\n                </e:Group>\n            </e:Skin>";
        }
        else {
            exml = "<e:Skin xmlns:e=\"http://ns.egret.com/eui\">\n                <e:Image width=\"100%\" height=\"100%\" source=\"resource/images/blue2.png\" scale9Grid=\"10,10,51,20\"/>\n                <e:Group id=\"group\" width=\"100%\" height=\"100%\" xmlns:e=\"http://ns.egret.com/eui\">\n                    <e:Scroller width=\"100%\" height=\"100%\">\n                        <e:Skin>\n                            <e:VScrollBar id=\"verticalScrollBar\" width=\"20\" height=\"100%\" right=\"0\">\n                                <e:Skin>\n                                    <e:Image width=\"100%\" height=\"100%\" source=\"resource/assets/ScrollBar/track.png\" scale9Grid=\"1,1,4,4\"/>\n                                    <e:Image id=\"thumb\" width=\"20\" height=\"20\" source=\"resource/assets/ScrollBar/roundthumb.png\"  scale9Grid=\"1,1,4,4\"/>\n                                </e:Skin>\n                            </e:VScrollBar>\n                        </e:Skin>\n                        <e:List id=\"list\" width=\"100%\" height=\"100%\">\n                        </e:List>\n                    </e:Scroller>\n                </e:Group>\n            </e:Skin>";
        }
        this.skinName = exml;
        this.list.itemRenderer = ListLabel;
    }
    var d = __define,c=List;p=c.prototype;
    d(p, "itemRenderer"
        ,function () {
            return this.list.itemRenderer;
        }
        ,function (val) {
            this.list.itemRenderer = val;
        }
    );
    d(p, "dataProvider"
        ,function () {
            return this.list.dataProvider;
        }
        ,function (data) {
            this.list.dataProvider = data;
        }
    );
    d(p, "selectedItem"
        ,function () {
            return this.list.selectedItem;
        }
    );
    return List;
})(eui.Component);
egret.registerClass(List,"List");
