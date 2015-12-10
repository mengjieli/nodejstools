/**
 * Created by cgMu on 2015/12/3.
 */

var BagDataCommand = cc.Class.extend({
    ctor: function () {
        NetMgr.inst().addEventListener(599, this.netUpdateItem, this);//更新道具
    },

    netUpdateItem: function (cmd, data) {
        if (599 == cmd) {
            data.resetCMDData();
            var itemid = data.readUint();
            var counts = data.readUint();
            //背包自动更新时，提示新增的道具和数量
            if(!ModuleMgr.inst().getData("ItemModule").loadItemsTag) {
                var delt_counts = ModuleMgr.inst().getData("ItemModule").autoGetCounts(itemid,counts);
                if(delt_counts > 0) {
                    //cc.error(ResMgr.inst().getString(itemid+"0")+" "+delt_counts);
                    ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString(itemid+"0")+" "+delt_counts,color:null,time:null,pos:null});
                }
            }

            EventMgr.inst().dispatchEvent( ITEM_EVENT.ITEM_UPDATE,itemid,counts ); //抛出道具更新事件
            var item = null;
            var list = mainData.bagDataList;
            for (var i = 0; i < list.length; i++) {
                if (list.getItemAt(i).itemid == itemid) {
                    item = list.getItemAt(i);
                    list.getItemAt(i).counts = counts;
                    break;
                }
            }
            if (item == null) {
                item = {};
                item.itemid = itemid;
                item.counts = counts;
                list.push(item);
            }
        }
    }
});
