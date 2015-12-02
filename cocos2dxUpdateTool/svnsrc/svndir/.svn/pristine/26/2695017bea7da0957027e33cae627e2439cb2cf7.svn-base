/**
 * Created by cgMu on 2015/11/27.
 */

var BlockLevelupModule = ModuleBase.extend({
    root:null,

    territoryId:null,
    certificateId:null,

    earthX:null,
    earthY:null,

    ctor: function () {
        this._super();
    },

    initUI:function() {
        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var json = ccs.load("res/images/ui/Block/BlockLevelupLayer.json","res/images/ui/");
        var root = json.node;
        this.addChild(root);
        this.root = root;

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var Panel_1 = root.getChildByName("Panel_1");
        this.sizeAutoLayout(Panel_1);
        this.posAutoLayout(Panel_1,0.5);

        var title = ccui.helper.seekWidgetByName(root,"Text_9");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("dikuai_1"));

        var closeButton = ccui.helper.seekWidgetByName(root, "Button_4");
        closeButton.addTouchEventListener(this.touchCallback,this);

        var cancelButton = ccui.helper.seekWidgetByName(root, "Button_5_0");
        cancelButton.addTouchEventListener(this.touchCallback,this);
        var cancelBtnText = ccui.helper.seekWidgetByName(root,"Text_2");
        cancelBtnText.ignoreContentAdaptWithSize(true);
        cancelBtnText.setString(ResMgr.inst().getString("dikuai_5"));

        var levelUpButton = ccui.helper.seekWidgetByName(root, "Button_5");
        levelUpButton.addTouchEventListener(this.touchCallback2,this);
        var upBtnText = ccui.helper.seekWidgetByName(root,"Text_10");
        upBtnText.ignoreContentAdaptWithSize(true);
        upBtnText.setString(ResMgr.inst().getString("college_16"));

        var label = ccui.helper.seekWidgetByName(root,"Text_5");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("denglu_73"));

        label = ccui.helper.seekWidgetByName(root,"Text_8");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("block_2"));

        label = ccui.helper.seekWidgetByName(root,"Text_8_0");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("block_3"));

    },

    destroy:function() {

    },

    show:function( data ) {
        this.territoryId = data.territoryid;//data.territoryid;1603001
        this.certificateId = data.certificateid;//data.certificateid;2100026

        this.earthX = data.x;
        this.earthY = data.y;

        var productData = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_product",this.territoryId);
        var productUpData = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_levelup",this.certificateId);

        //data
        var name = ccui.helper.seekWidgetByName(this.root,"Text_6");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString(this.territoryId+"0"));

        //土地等级
        var level_ = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",this.certificateId).type;
        var level = ccui.helper.seekWidgetByName(this.root,"Text_17");
        level.ignoreContentAdaptWithSize(true);
        level.setString(ResMgr.inst().getString("block_4")+level_+ResMgr.inst().getString("block_5"));

        var icon = ccui.helper.seekWidgetByName(this.root,"Image_1");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.territoryId));

        var detail = ccui.helper.seekWidgetByName(this.root, "Text_3");
        detail.setString(ResMgr.inst().getString(this.territoryId+"1"));

        var res = this.root.getChildByName("Panel_1").getChildByName("Sprite_19");
        res.setTexture(ResMgr.inst()._icoPath+productData.production+"0.png");

        var output = productData.output_perminute*60*productUpData.output_multiple;
        var counts = ccui.helper.seekWidgetByName(this.root,"Text_11");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString("+"+output+"/小时");

        var res_levelup = this.root.getChildByName("Panel_1").getChildByName("Sprite_19_0");
        res_levelup.setTexture(ResMgr.inst()._icoPath+productData.production+"0.png");

        var productUpData_up = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_levelup",this.certificateId+1);
        if(!productUpData_up){
            productUpData_up=productUpData;
        }
        var output = productData.output_perminute*60*productUpData_up.output_multiple;
        var counts = ccui.helper.seekWidgetByName(this.root,"Text_11_0");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString("+"+output+"/小时");

        var item1 = this.root.getChildByName("Panel_1").getChildByName("Sprite_17_0");
        item1.setScale(0.3);
        item1.setTexture(ResMgr.inst()._icoPath+2100032+"0.png");//2100032土地升级券ID
        var item2 = this.root.getChildByName("Panel_1").getChildByName("Sprite_17");
        item2.setTexture("res/images/ico/11030010.png");
        var cost1 = ccui.helper.seekWidgetByName(this.root,"Text_18");
        cost1.ignoreContentAdaptWithSize(true);
        var cost2 = ccui.helper.seekWidgetByName(this.root,"Text_4");
        cost2.ignoreContentAdaptWithSize(true);

        //设置价格
        var cost_item_counts = ModuleMgr.inst().getData("ItemModule").getCountsByItemId(2100032);
        if(cost_item_counts==0) {
            var temp = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item_trading",2804013);//快速购买土地升级卡交易ID
            var tempjson = eval("(" + temp.consumption_item + ")");
            var consumption_item = {};
            for (var i in tempjson) {
                consumption_item.itemid = i;
                consumption_item.counts = tempjson[i];
            }

            cost1.setColor(cc.color(255,0,0));
            cost1.setString(0);
            item2.setVisible(true);
            cost2.setVisible(true);
            item2.setTexture(ResMgr.inst()._icoPath+consumption_item.itemid+"0.png");
            cost2.setString(consumption_item.counts);
        }
        else {
            item2.setVisible(false);
            cost2.setVisible(false);
            cost1.setString(1);
            cost1.setColor(cc.color(255,255,255));
            item1.setPositionX(item1.getPositionX()+50);
            cost1.setPositionX(cost1.getPositionX()+50)
        }

    },

    close:function() {

    },

    touchCallback: function (sender,type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                //this.removeFromParent(true);
                ModuleMgr.inst().closeModule("BlockLevelupModule");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    touchCallback2: function (sender,type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                //ModuleMgr.inst().closeModule("BlockLevelupModule");
                //this.removeFromParent(true);
                var msg = new SocketBytes();
                msg.writeUint(305);
                msg.writeInt(this.earthX);
                msg.writeInt(this.earthY);
                NetMgr.inst().send(msg);
                ModuleMgr.inst().closeModule("BlockLevelupModule");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    //大小适配
    sizeAutoLayout: function (node, scale) {
        scale = scale ? scale : 1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1 / GameMgr.inst().scaleX);
        var size = node.getContentSize();
        size.height += down * scale;
        node.setContentSize(size);
    },
    //坐标适配
    posAutoLayout: function (node, scale) {
        scale = scale ? scale : 1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1 / GameMgr.inst().scaleX);
        var posY = node.getPositionY();
        posY += down * scale;
        node.setPositionY(posY);
    }
});