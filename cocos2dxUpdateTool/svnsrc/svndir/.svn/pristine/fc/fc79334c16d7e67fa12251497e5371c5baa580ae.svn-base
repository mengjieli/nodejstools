/**
 * Created by cgMu on 2015/11/16.
 */

ITEM_EVENT = {};
ITEM_EVENT.ITEM_UPDATE = "item_update"; //道具数量更新 事件


var ItemData = DataBase.extend({
    items:null,
    loadItemsTag:false,//背包更新时，区分是请求的还是自动推送的？？

    ctor:function() {
        this._super();
        //cc.log("ItemData ctor");
        NetMgr.inst().addEventListener(599, this.netUpdateItem, this);//更新道具
        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE, this.netComplete, this);//请求成功返回

        this.items = {};
    },

    init:function()
    {
        return true;
    },

    destroy:function() {
        NetMgr.inst().removeEventListener(599, this.netUpdateItem, this);//更新道具
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE, this.netComplete, this);//请求成功返回
    },

    loadItem: function () {
        this.loadItemsTag = true;
        var msg = new SocketBytes();
        msg.writeUint(500);//加载道具列表
        NetMgr.inst().send(msg);
    },

    netUpdateItem: function (cmd, data) {
        if (599 == cmd) {
            data.resetCMDData();
            var itemid = data.readUint();
            var counts = data.readUint();
            //cc.log("$%$%$%",itemid,counts);
            //自动推送时，提示新增的道具和数量
            if(!this.loadItemsTag) {
                var delt_counts = this.autoGetCounts(itemid,counts);
                if(delt_counts > 0) {
                    //cc.error(ResMgr.inst().getString(itemid+"0")+" "+delt_counts);
                    ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString(itemid+"0")+" "+delt_counts,color:null,time:null,pos:null});
                }
            }

            this.items[itemid] = counts;
            EventMgr.inst().dispatchEvent( ITEM_EVENT.ITEM_UPDATE,itemid,counts ); //抛出道具更新事件
        }
    },

    netComplete: function (event,data) {
        if(data==500) {//请求道具
            if(this.loadItemsTag){
                this.loadItemsTag = false;
            }

            var sign_item = ModuleMgr.inst().getData("ItemModule").getCountsByItemId(SignModule.SIGH_ITEM_ID);//2100020:签到数量道具ID
            if (sign_item>0) {
                ModuleMgr.inst().openModule("SignModule");
            }
        }
    },

    //道具更新时，获取新增道具和数量(自己调用)
    autoGetCounts: function (itemid,counts) {
        var exist = false;
        for(var i in this.items) {
            var cc = this.items[i];
            if(i == itemid){
                exist = true;
                if(cc < counts) {
                    return counts - cc;
                }
            }
        }
        if(!exist) {
            return counts;
        }
        return 0;
    },

    //查询itemid道具数量
    getCountsByItemId: function (itemid) {
        //cc.log("查找道具",itemid);
        var counts = 0;
        if (this.items[itemid]) {
            counts = this.items[itemid];
        }
        //cc.log("counts",counts);
        return counts;
    },
    
    //查询同类型道具，返回道具ID列表
    getTypeList: function (itemclass) {
        var list = [];
        for(var i in this.items){
            var itemdata = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",i);
            if(itemdata.class==itemclass){
                list.push(i);
            }
        }
        return list;
    }

});