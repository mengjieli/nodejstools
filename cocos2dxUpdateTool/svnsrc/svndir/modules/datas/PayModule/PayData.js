/**
 * Created by cgMu on 2015/11/10.
 */

var PayData = DataBase.extend({
    //scrolItemsPos:null,
    //scrolItemZOrder:null,
    //scrolItemScale:null,

    _data:null,

    ctor:function() {
        //item 坐标
        //this.scrolItemsPos = {};
        //this.scrolItemsPos[0] = cc.p(86,151);
        //this.scrolItemsPos[1] = cc.p(214,145);
        //this.scrolItemsPos[2] = cc.p(378,133);
        //this.scrolItemsPos[3] = cc.p(565,145);
        //this.scrolItemsPos[4] = cc.p(713,151);
        //
        //this.scrolItemZOrder = {};
        //this.scrolItemZOrder[-1] = 0;
        //this.scrolItemZOrder[0] = 1;
        //this.scrolItemZOrder[1] = 2;
        //this.scrolItemZOrder[2] = 3;
        //this.scrolItemZOrder[3] = 2;
        //this.scrolItemZOrder[4] = 1;
        //
        //this.scrolItemScale = {};
        //this.scrolItemScale[0] = 1;
        //this.scrolItemScale[1] = 1.1;
        //this.scrolItemScale[2] = 1.25;
        //this.scrolItemScale[3] = 1.1;
        //this.scrolItemScale[4] = 1;

        this._data = {};
        this._data[1]=[];
        this._data[2]=[];
        this._data[3]=[];
        this._data[4]=[];

        var paydata = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("Pay");//ResMgr.inst().getCSV("Pay");//
        for(var key in paydata) {
            switch (parseInt(paydata[key].price_id)) {
                case 1:
                    this._data[1].push(paydata[key]);
                    break;
                case 2:
                    this._data[2].push(paydata[key]);
                    break;
                case 3:
                    this._data[3].push(paydata[key]);
                    break;
                default :
                    this._data[4].push(paydata[key]);
                    break;
            }
        }

    },

    init:function()
    {
        return true;
    },

    destroy:function() {

    }
});