/**
 * Created by cgMu on 2015/11/27.
 */

var ItemBox = ccui.Layout.extend({
    icon:null,
    counts:null,
    selecting:null,//默认不显示

    ctor: function (itemid) {
        this._super();

        var root = ccs.load("res/images/ui/BagModule/ItemBoxLayer.json","res/images/ui/").node;
        this.addChild(root);
        this.setContentSize(root.getContentSize());//86x86

        var icon = ccui.helper.seekWidgetByName(root,"Image_5_0");
        icon.ignoreContentAdaptWithSize(true);
        icon.setScale(0.65);
        this.icon = icon;

        var counts = ccui.helper.seekWidgetByName(root,"Text_1");
        counts.ignoreContentAdaptWithSize(true);
        this.counts = counts;

        var selecting = ccui.helper.seekWidgetByName(root,"Image_5_0_0");
        selecting.setVisible(false);
        this.selecting = selecting;

        if(itemid!=null){
            this.setItemId(itemid);
        }
    },

    //itemid:道具ID，0表示空格子
    setItemId: function (itemid) {
        if(this.icon && this.counts){
            if(itemid==0){
                this.icon.setVisible(false);
                this.counts.setVisible(false);
            }
            else {
                this.icon.loadTexture(ResMgr.inst().getIcoPath(itemid));
                this.counts.setString(ModuleMgr.inst().getData("ItemModule").getCountsByItemId(itemid));
            }
        }
    },

    //显示选中背包？
    setItemSelecting: function (selecting) {
        if(this.selecting){
            this.selecting.setVisible(selecting);
        }
    }
});