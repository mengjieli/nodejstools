/**
 * Created by cgMu on 2015/11/30.
 */

var ArmyItem = cc.Node.extend({
    upLoadingbar:null,
    downLoadingbar:null,
    armyName:null,
    selectingIcon:null,
    touchIcon:null,

    ctor: function () {
        this._super();

        var root = ccs.load("res/images/ui/BattleUIModule/item.json","res/images/ui/").node;
        this.addChild(root);

        var selecting = root.getChildByName("Image_1_1");
        selecting.ignoreContentAdaptWithSize(true);
        selecting.setVisible(false);
        this.selectingIcon = selecting;

        var touch_bg = root.getChildByName("Image_1");
        touch_bg.setTouchEnabled(true);
        this.touchIcon = touch_bg;

        var icon = root.getChildByName("Image_1_0");
        icon.ignoreContentAdaptWithSize(true);

        var name = root.getChildByName("Text_2");
        name.ignoreContentAdaptWithSize(true);
        //name.setString()
        this.armyName = name;

        var loadingbar_up = root.getChildByName("LoadingBar_1");
        loadingbar_up.setPercent(100);
        this.upLoadingbar = loadingbar_up;

        var loadingbar_down = root.getChildByName("LoadingBar_1_0");
        loadingbar_down.setPercent(100);
        this.downLoadingbar = loadingbar_down;

        var number = root.getChildByName("Text_1");
        number.ignoreContentAdaptWithSize(true);
    },

    setLoadingbarUp: function (percent) {
        if(this.upLoadingbar){
            this.upLoadingbar.setPercent(percent);
        }
    },

    setLoadingbarDown: function (percent) {
        if(this.downLoadingbar){
            this.downLoadingbar.setPercent(percent);
        }
    },

    //部队选中状态
    setSelectingState: function (selecting) {
        if(!this.touchIcon.isTouchEnabled()) return;//死亡部队不处理
        if(selecting){
            this.armyName.setColor(cc.color(255,220,80));
            this.selectingIcon.setVisible(true);
        }
        else{
            this.armyName.setColor(cc.color(255,255,255));
            this.selectingIcon.setVisible(false);
        }
    },

    //部队死亡状态
    setDeadState: function () {
        this.armyName.setColor(cc.color(42,42,42));
        this.touchIcon.setTouchEnabled(false);
        this.selectingIcon.setVisible(true);
        this.selectingIcon.loadTexture("BattleUIModule/zd_buduisiwang.png",ccui.Widget.PLIST_TEXTURE);
    }
});