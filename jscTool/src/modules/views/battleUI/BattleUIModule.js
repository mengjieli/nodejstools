/**
 * Created by cgMu on 2015/11/30.
 */

var BattleUIModule = ModuleBase.extend({
    root:null,
    armyData:null,
    armyItemArray:null,

    ctor:function() {
        this._super();

        this.armyItemArray = [];
    },

    initUI:function() {
        var _ui = ccs.load("res/images/ui/BattleUIModule/Layer.json","res/images/ui/").node;
        this.addChild( _ui );

        var root = _ui.getChildByName("Panel_1");
        ModuleMgr.inst().getData("BattleUIModule").setBattleBottomBar(root);//UI动画切换
        this.root = root;
    },

    destroy:function() {

    },

    show:function( data ) {
        this.armyData = BigMapActionData.getInstance().rolers;//获取部队数据

        for(var i in this.armyItemArray) {
            if(this.armyItemArray[i]){
                this.armyItemArray[i].removeFromParent(true);
            }
        }
        this.armyItemArray = [];

        var pos = ModuleMgr.inst().getData("BattleUIModule").armyItemPos;
        for(var i = 0; i < this.armyData.length; i++) {
            var item = new ArmyItem(this.armyData[i]);
            item.setPosition(pos[i]);
            item.touchIcon.setTag(i);
            item.touchIcon.setUserData(this.armyData[i]);
            item.touchIcon.addTouchEventListener(this.touchCallback,this);
            this.root.addChild(item);
            this.armyItemArray.push(item);
        }
    },

    close:function() {
        var data = item.getUserData();
    },

    touchCallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        var tag = sender.getTag();
        for(var i in this.armyItemArray){
            if(tag==i) {
                this.armyItemArray[i].setSelectingState(true);
            }
            else {
                this.armyItemArray[i].setSelectingState(false);
            }
        }

        var data = sender.getUserData();
        cc.log("@touch army type",data.type,"id",data.id);
        ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("castle_1"),color:null,time:null,pos:null});
    }
});