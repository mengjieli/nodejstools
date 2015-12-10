/**
 * Created by cgMu on 2015/10/14.
 */

var TileMenuModule = ModuleBase.extend({
    ctor:function() {
        this._super();
    },

    initUI:function() {

    },

    touchEvent:function (sender) {
        var tag = sender.getTag();
        var menuData =  ModuleMgr.inst().getData("TileMenuModule");
        var callbackdata = menuData.callback;
        if(callbackdata[tag]) {
            callbackdata[tag].back(tag);
        }
    },

    destroy:function() {

    },

    show:function( data ) {
        var menuData = ModuleMgr.inst().getData("TileMenuModule");

        //null,关闭弹框
        if (data == null) {
            if (menuData.moduleInit) {
                var movePos = cc.p((303-63)*0.5,(303-73)*0.5);
                var delayTime = 0.05;
                var time = 0.1;
                var move = new cc.MoveTo(time, movePos);
                //var action = new cc.EaseElasticOut(move);
                var action = new cc.EaseExponentialOut(move);

                var index = menuData.tileItemArray.length;
                for(var i = 0; i < menuData.tileItemArray.length; i++) {
                    index--;
                    menuData.tileItemArray[index].runAction(cc.Sequence(cc.DelayTime(i*delayTime), action,cc.Hide()));
                }

                menuData.tileMenuBg.runAction(cc.Sequence(cc.DelayTime(menuData.tileItemArray.length*delayTime),cc.ScaleTo(0.1,0),cc.CallFunc(function(){
                    ModuleMgr.inst().closeModule("TileMenuModule");
                    menuData.destroy();
                })));
            }
            return;
        }

        menuData.setNewTileData(data);

        if (menuData.tileUI.length == 0) {
            cc.log("没有弹出UI，直接跳转界面",buildingData.buildingObjectId);
            return;
        }

        if (!menuData.moduleInit) {
            //加载UI
            var json = ccs.load("res/images/ui/TileMenuModule/MenuLayer.json","res/images/ui/");
            var root = json.node;
            this.addChild(root);
            this.root=root;
            menuData.buildingUI=root;

            this.bgPanel = ccui.helper.seekWidgetByName(root, "menuPanel");
            var size = this.bgPanel.getContentSize();
            //背景圆圈
            var scaleBg = new ccui.ImageView();
            scaleBg.loadTexture("gy_yuankuang_di.png",ccui.Widget.PLIST_TEXTURE);
            scaleBg.setPosition(cc.p(menuData._menuWidth*0.5,menuData._menuHeight*0.5));
            scaleBg.setTouchEnabled(true);
            scaleBg.addTouchEventListener(this.touchcallback,this);
            this.bgPanel.addChild(scaleBg);
            menuData.tileMenuBg=scaleBg;

            var posLabel = ccui.helper.seekWidgetByName(root,"posLabel");
            posLabel.setVisible(false);
        }

        var pos = menuData.tilePosition;
        menuData.moduleInit = true;
        this.root.setPosition(cc.p(pos.x-151.5,pos.y-151.5));
        //更新按钮
        this.refreshMenuItem();
    },

    close:function( ) {

    },

    refreshMenuItem: function () {
        var menuData =  ModuleMgr.inst().getData("TileMenuModule");
        var length = menuData.tileItemArray.length;

        for (var i = 0; i < length; i++) {
            if (menuData.tileItemArray[i]) {
                menuData.tileItemArray[i].removeFromParent(true);
                menuData.tileItemArray[i] = null;
            }
        }

        menuData.tileItemArray=[];

        var counts = menuData.tileUI.length;
        var posArray = menuData.tilePositionArray[counts-1];

        for (var i = 0;i < counts;i++) {
            var titleName = ResMgr.inst().getString(menuData.tileUI[i]+"0");

            var cell = new CustomMenuItem(menuData.tileUI[i]+"3",
                menuData.tileUI[i]+"1",
                titleName,this.touchEvent);
            cell.setPosition(cc.p((303-63)*0.5,(303-73)*0.5));
            cell.setVisible(false);
            this.bgPanel.addChild(cell);

            //打开动画
            var delayTime = 0.1;
            var time = 0.5;
            var move = new cc.MoveTo(time, posArray[i]);
            //var action = new cc.EaseElasticOut(move,0.5);
            var action = new cc.EaseExponentialOut(move);
            cell.runAction(cc.sequence(cc.DelayTime(i*delayTime), cc.Spawn(cc.Show(),action)));

            menuData.tileItemArray.push(cell);
        }
    },

    //背景圆圈触摸响应
    touchcallback: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                cc.log("TOUCH_BEGAN");
                break;
            case ccui.Widget.TOUCH_MOVED:
                //cc.log("TOUCH_MOVED");
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("TOUCH_ENDED");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                //cc.log("TOUCH_CANCELED");
                break;
            default:
                //cc.log("default");
                break;
        }
    }
});