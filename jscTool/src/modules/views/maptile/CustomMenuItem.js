/**
 * Created by cgMu on 2015/10/15.
 */

var CustomMenuItem = cc.Node.extend({
    ctor:function(normal,disable,text,callback) {
        this._super();

        var tag = parseInt(normal/10);

        //var json = ccs.load("res/images/ui/TileMenuModule/MenuItemLayer.json","res/images/ui/");
        var json = ccs.load("res/images/ui/TileMenuModule/ex_menuitemlayer.json","res/images/ui/");
        var root = json.node;
        this.addChild(root);

        var bg = ccui.helper.seekWidgetByName(root, "itemPanel");
        bg.setTag(tag);
        bg.setTouchEnabled(true);

        var contentSize = bg.getContentSize();
        this.setContentSize(contentSize);

        //var item = new cc.Sprite("#TileMenuModule/"+normal+".png");
        //var item = new cc.Sprite("res/images/ico/"+normal+".png");
        //item.setPosition(cc.p(contentSize.width*0.5,contentSize.height*0.5+9));
        //bg.addChild(item,10);
        //item.setScale(0.2);
        var item = ccui.helper.seekWidgetByName(root,"item");
        item.ignoreContentAdaptWithSize(true);
        item.loadTexture(ResMgr.inst()._icoPath+normal+".png");
        item.setPositionY(item.getPositionY()+9);

        var touchEvent = function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    //cc.log("TOUCH_BEGAN");
                    var action = new cc.ScaleTo(0.05,1.1);
                    sender.runAction(action);
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    //cc.log("TOUCH_MOVED");
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    //cc.log("TOUCH_ENDED");
                    var action = new cc.ScaleTo(0.05,1);
                    sender.runAction(action);
                    callback(sender);
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    //cc.log("TOUCH_CANCELED");
                    var action = new cc.ScaleTo(0.05,1);
                    sender.runAction(action);
                    break;
                default:
                    //cc.log("default");
                    break;
            }
        };

        var touchItem = ccui.helper.seekWidgetByName(root, "touchItem");
        //touchItem.setTag(parseInt(normal));
        //touchItem.setTouchEnabled(true);

        bg.addTouchEventListener(touchEvent,this);

        var counts = ccui.helper.seekWidgetByName(root,"Image_1");
        counts.setVisible(false);

        var name = ccui.helper.seekWidgetByName(root, "name");
        name.setTextColor(cc.color(255,165,0,255));
        name.ignoreContentAdaptWithSize(true);
        name.setString(text);
    }
});