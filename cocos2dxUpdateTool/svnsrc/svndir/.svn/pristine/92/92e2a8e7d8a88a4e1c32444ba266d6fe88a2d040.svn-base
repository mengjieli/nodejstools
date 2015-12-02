/**
 * Created by cgMu on 2015/11/30.
 */

var BattleUIModule = ModuleBase.extend({
    root:null,

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
        for(var i in this.armyItemArray) {
            if(this.armyItemArray[i]){
                this.armyItemArray[i].removeFromParent(true);
            }
        }
        this.armyItemArray = [];

        var pos = ModuleMgr.inst().getData("BattleUIModule").armyItemPos;
        for(var i = 0; i < 5; i++) {
            var item = new ArmyItem();
            item.setPosition(pos[i]);
            item.touchIcon.setTag(i);
            item.touchIcon.addTouchEventListener(this.touchCallback,this);
            this.root.addChild(item);
            this.armyItemArray.push(item);
            if(i==0){
                item.setSelectingState(true);
            }
            if(i==4){
                item.setDeadState();
            }
        }
    },

    close:function() {

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
    }
});