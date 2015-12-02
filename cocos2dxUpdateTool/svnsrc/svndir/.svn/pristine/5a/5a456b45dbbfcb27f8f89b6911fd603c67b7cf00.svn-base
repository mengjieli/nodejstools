/**
 * Created by cgMu on 2015/11/30.
 */

var BattleUIData = DataBase.extend({
    topBar:null,
    rowBtnList:null,
    columnBtnList:null,
    bottomBar_battle:null,

    default:true,//ui初始状态
    exchangeBtn:null,

    armyItemPos:null,//军队在界面上的坐标

    ctor:function() {
        this.rowBtnList = [];
        this.columnBtnList = [];

        this.armyItemPos = [cc.p(12,10),cc.p(106,10),cc.p(202,10),cc.p(296,10),cc.p(392,10)
            ,cc.p(488,10),cc.p(580,10),cc.p(676,10),cc.p(771,10),cc.p(866,10)];

    },

    init:function() {
        return true;
    },

    destroy:function() {

    },

    setExchangeBtn: function (btn) {
        this.exchangeBtn = btn;
    },

    setTopBar: function (bar) {
        this.topBar = bar;//height==80
    },

    setBattleBottomBar: function (bar) {
        this.bottomBar_battle = bar;
    },

    pushRowList: function (btn) {
        if(this.rowBtnList){
            this.rowBtnList.push(btn);
        }
        else{
            this.rowBtnList = [];
            this.rowBtnList.push(btn);
        }
    },

    pushColumnList: function (btn) {
        if(this.columnBtnList){
            this.columnBtnList.push(btn);
        }
        else{
            this.columnBtnList = [];
            this.columnBtnList.push(btn);
        }
    },

    switchUI: function (value) {
        if(value!=null){
            cc.log("switchUI",value);
            this.default = value;
        }
        var topbar_move = cc.MoveBy(BattleUIData.ACTION_TIEM,cc.p(0,80));
        var bottombar_move = cc.MoveBy(BattleUIData.ACTION_TIEM,cc.p(0,123));

        var delaytime_row = BattleUIData.ACTION_TIEM / this.rowBtnList.length;
        var rowBtn_move = cc.MoveBy(delaytime_row,cc.p(0,-120));

        var delaytime_column = BattleUIData.ACTION_TIEM / this.columnBtnList.length;
        var columnBtn_move = cc.MoveBy(delaytime_column,cc.p(105,0));

        if(this.default){
            this.default = false;

            if(this.topBar){
                this.topBar.runAction(topbar_move);
            }

            for(var row in this.rowBtnList) {
                if(this.rowBtnList[row]){
                    this.rowBtnList[row].runAction(cc.Sequence(cc.DelayTime(delaytime_row*row),rowBtn_move));
                }
            }

            for(var column in this.columnBtnList){
                if(this.columnBtnList[column]){
                    this.columnBtnList[column].runAction(cc.Sequence(cc.DelayTime(delaytime_column*column),columnBtn_move));
                }
            }
            //
            if(this.bottomBar_battle){
                this.bottomBar_battle.runAction(bottombar_move);
            }
        }
        else{
            this.default = true;

            if(this.topBar){
                this.topBar.runAction(topbar_move.reverse());
            }

            for(var row in this.rowBtnList) {
                if(this.rowBtnList[row]){
                    this.rowBtnList[row].runAction(cc.Sequence(cc.DelayTime(delaytime_row*row),rowBtn_move.reverse()));
                }
            }

            for(var column in this.columnBtnList){
                if(this.columnBtnList[column]){
                    this.columnBtnList[column].runAction(cc.Sequence(cc.DelayTime(delaytime_column*column),columnBtn_move.reverse()));
                }
            }
            //
            if(this.bottomBar_battle){
                this.bottomBar_battle.runAction(bottombar_move.reverse());
            }
        }
    },

    updateStateExchangeBtn: function (maptype) {
        if(maptype==MapChangeModule.SHOW_MAP){
            this.exchangeBtn.setVisible(true);
        }
        else{
            this.exchangeBtn.setVisible(false);
        }
    }
});

BattleUIData.ACTION_TIEM = 0.4;