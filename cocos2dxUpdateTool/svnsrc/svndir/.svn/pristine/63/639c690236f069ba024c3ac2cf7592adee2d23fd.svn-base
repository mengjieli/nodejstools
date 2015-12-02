/**
 * Created by cgMu on 2015/11/27.
 */

var BlockInfoModule = ModuleBase.extend({
    root:null,

    territoryId:null,
    certificateId:null,

   ctor: function () {
       this._super();
   },

    initUI:function() {
        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var root = ccs.load("res/images/ui/Block/BlockInfoLayer.json","res/images/ui/").node;
        this.addChild(root);
        this.root = root;

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var Panel_1 = root.getChildByName("Panel_1");
        this.sizeAutoLayout(Panel_1);
        this.posAutoLayout(Panel_1,0.5);

        var title = ccui.helper.seekWidgetByName(root,"Text_8");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("dikuai_2"));

        var label = ccui.helper.seekWidgetByName(root, "Text_1");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("denglu_73"));

        label = ccui.helper.seekWidgetByName(root, "Text_2");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("denglu_74"));

        //战略资源
        label = ccui.helper.seekWidgetByName(root, "Text_2_0");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("denglu_75"));
        label.setVisible(false);

        label = ccui.helper.seekWidgetByName(root,"Text_14");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("block_1"));
        label.setVisible(false);

        var closeButton = ccui.helper.seekWidgetByName(root, "Button_1");
        closeButton.addTouchEventListener(this.touchCallback,this);


        var resex = root.getChildByName("Panel_1").getChildByName("Sprite_4_0");
        resex.setVisible(false);
        var countsex = ccui.helper.seekWidgetByName(root,"Text_5_0");
        countsex.setVisible(false);
        var remaincounts = ccui.helper.seekWidgetByName(root,"Text_15");
        remaincounts.setVisible(false);

    },

    destroy:function() {

    },

    show:function( data ) {
        this.territoryId = data.territoryid;
        this.certificateId = data.certificateid;//土地使用券ID

        var productData = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_product",this.territoryId);

        //data
        var name = ccui.helper.seekWidgetByName(this.root,"Text_3");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString(this.territoryId+"0"));
        //土地等级
        var level = ccui.helper.seekWidgetByName(this.root,"Text_13");

        var icon = ccui.helper.seekWidgetByName(this.root,"Image_3");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(this.territoryId));

        var detail = ccui.helper.seekWidgetByName(this.root, "Text_4");
        detail.setString(ResMgr.inst().getString(this.territoryId+"1"));

        var res = this.root.getChildByName("Panel_1").getChildByName("Sprite_4");
        res.setTexture(ResMgr.inst()._icoPath+productData.production+"0.png");

        var counts = ccui.helper.seekWidgetByName(this.root,"Text_5");
        counts.ignoreContentAdaptWithSize(true);

        var Image_2 = ccui.helper.seekWidgetByName(this.root,"Image_2");

        if(this.certificateId){
            var productUpData = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Territory_levelup",this.certificateId);

            //土地等级
            var level_ = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",this.certificateId).type;
            level.ignoreContentAdaptWithSize(true);
            level.setString(ResMgr.inst().getString("block_4")+level_+ResMgr.inst().getString("block_5"));

            var output = productData.output_perminute*60*productUpData.output_multiple;//this.getTileChanliang(territoryid,certificateid);
            counts.setString("+"+output+"/小时");
        }
        else{
            level.setVisible(false);

            var output = productData.output_perminute*60
            counts.setString("+"+output+"/小时");

            Image_2.setVisible(false);
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
                ModuleMgr.inst().closeModule("BlockInfoModule");
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
    },

    //getTileChanliang: function (territoryid,certificateid) {
    //    var productData = ResMgr.inst().getCSV("Territory_product",tileid);
    //    var productUpData = ResMgr.inst().getCSV("Territory_levelup",certificateid);
    //    var chanliang = productData.output_perminute*60*productUpData.output_multiple;
    //    return chanliang;
    //}

});