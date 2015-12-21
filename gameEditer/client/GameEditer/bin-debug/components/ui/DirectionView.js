/**
 *
 * @author
 *
 */
var DirectionView = (function (_super) {
    __extends(DirectionView, _super);
    function DirectionView(renderer) {
        if (renderer === void 0) { renderer = null; }
        _super.call(this);
        renderer = renderer || DirectionViewItem;
        var exml = "<e:Skin xmlns:e=\"http://ns.egret.com/eui\">\n                <e:Image width=\"100%\" height=\"100%\" source=\"resource/images/depthBlueBg.png\"/>\n                <e:Group width=\"100%\" height=\"100%\" xmlns:e=\"http://ns.egret.com/eui\">\n                    <e:Scroller width=\"100%\" height=\"100%\">\n                        <e:Skin>\n                            <e:VScrollBar id=\"verticalScrollBar\" width=\"20\" height=\"100%\" right=\"0\">\n                                <e:Skin>\n                                    <e:Image width=\"100%\" height=\"100%\" source=\"resource/assets/ScrollBar/track.png\" scale9Grid=\"1,1,4,4\"/>\n                                    <e:Image id=\"thumb\" width=\"20\" height=\"20\" source=\"resource/assets/ScrollBar/roundthumb.png\"  scale9Grid=\"1,1,4,4\"/>\n                                </e:Skin>\n                            </e:VScrollBar>\n                        </e:Skin>\n                        <e:List id=\"list\" width=\"100%\" height=\"100%\">\n                        </e:List>\n                    </e:Scroller>\n                </e:Group>\n            </e:Skin>";
        this.skinName = exml;
        this.list.itemRenderer = renderer;
        //        this.list.dataProvider = EditerData.getInstance().workDirection.data;
    }
    var d = __define,c=DirectionView;p=c.prototype;
    d(p, "selectedItem"
        ,function () {
            return this.list.selectedItem;
        }
    );
    d(p, "dataProvider",undefined
        ,function (collection) {
            if (this.list.dataProvider != collection && collection) {
                collection.addEventListener(eui.CollectionEventKind.UPDATE, this.update, this);
            }
            this.list.dataProvider = collection;
        }
    );
    p.update = function (e) {
        var data = this.list.dataProvider;
        this.dataProvider = null;
        this.dataProvider = data;
    };
    return DirectionView;
})(eui.Component);
egret.registerClass(DirectionView,"DirectionView");
