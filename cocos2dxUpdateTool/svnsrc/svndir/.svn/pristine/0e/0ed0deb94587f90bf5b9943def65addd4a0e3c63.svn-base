/**
 * Created by cgMu on 2015/10/31.
 */

var BuildingMenuItem = cc.Node.extend({
    ctor:function(buildingid,normal,disable,text,callback) {
        this._super();

        var open = true;

        var data = ModuleMgr.inst().getData("CastleModule");

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

        //var item = new cc.Sprite("res/images/ico/"+normal+".png");
        //item.setPosition(cc.p(contentSize.width*0.5,contentSize.height*0.5+9));
        //bg.addChild(item,10);
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
        touchItem.ignoreContentAdaptWithSize(true);

        var name = ccui.helper.seekWidgetByName(root, "name");
        name.ignoreContentAdaptWithSize(true);
        name.setString(text);

        var counts = ccui.helper.seekWidgetByName(root,"Image_1");
        var label = counts.getChildByName("Text_1");
        label.ignoreContentAdaptWithSize(true);
        if ( open ) {
            if (data._arrBuildingxyBean[buildingid]._num>1) {
                counts.setVisible(true);
                var num = 0;
                var buildingData = ModuleMgr.inst().getData("CastleModule").getNetBlock();
                for(var i in buildingData) {
                    if(buildingid==buildingData[i]._building_id) {
                        num++;
                    }
                }
                label.setString(num + "/" + data._arrBuildingxyBean[buildingid]._num);
                label.setTextColor(cc.color(255,255,255,255));
            }
            else {
                counts.setVisible(false);
            }

            name.setTextColor(cc.color(255,165,0,255));

            bg.addTouchEventListener(touchEvent,this);
        }
        else {
            counts.setVisible(true);
            counts.setPositionY(contentSize.height*0.5+9);

            //label.setString("1"+"级解锁");//5级解锁
            label.setTextColor(cc.color(255,0,0,255));

            name.setTextColor(cc.color(127,127,127,255));
            touchItem.loadTexture("gy_kuang_di_02_bukean.png",ccui.Widget.PLIST_TEXTURE);
            item.loadTexture(ResMgr.inst()._icoPath+disable+".png");
        }


    }
});