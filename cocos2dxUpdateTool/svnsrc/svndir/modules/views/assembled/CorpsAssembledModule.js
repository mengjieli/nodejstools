/**
 * Created by cgMu on 2015/11/24.
 */

var CorpsAssembledModule = ModuleBase.extend({
    scrol: null,
    scrollbar: null,
    scrollbar_bg:null,
    barTotalHeight: 0,
    barPercent_total: 0,
    scrollPosY: 0,
    isOnePage: null,
    item_root: null,
    item_last:null,

    corpsMax:0,//军团上限数量
    corpsData:null,

    corpsAssembled:null,

    ctor:function() {
        this._super();

        this.corpsMax = 10;
        this.corpsData = [0,0,0,0,0,0,0,0,0];//模拟数据

        this.corpsAssembled = [];
    },

    initUI:function() {
        var root = ccs.load("res/images/ui/CorpsAssembled/Layer.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var Panel_1 = ccui.helper.seekWidgetByName(root,"Panel_1");
        this.sizeAutoLayout(Panel_1);

        var tag_label = ccui.helper.seekWidgetByName(root,"Text_1");
        tag_label.ignoreContentAdaptWithSize(true);
        tag_label.setString(this.corpsData.length+"/"+this.corpsMax+" "+ResMgr.inst().getString("assembled_1"));
        this.posAutoLayout(tag_label);

        var scrollview = ccui.helper.seekWidgetByName(root,"ScrollView_1");
        this.sizeAutoLayout(scrollview);
        scrollview.addEventListener(this.scrollCall, this);
        this.scrol = scrollview;

        var item_root = this.scrol.getChildByName("Image_3");
        item_root.setVisible(false);
        this.item_root = item_root;

        var item_last = this.scrol.getChildByName("Image_10");
        //item_last.setVisible(false);
        this.item_last = item_last;
        var add_btn = item_last.getChildByName("Image_6");
        add_btn.setTouchEnabled(true);
        add_btn.addTouchEventListener(this.addcallback,this);
        var add_title = item_last.getChildByName("Text_21");
        add_title.ignoreContentAdaptWithSize(true);
        add_title.setString(ResMgr.inst().getString("assembled_18"));

        var scrolbar_bg = ccui.helper.seekWidgetByName(root,"Image_1");
        this.sizeAutoLayout(scrolbar_bg);
        this.scrollbar_bg = scrolbar_bg;

        var scrolbar = ccui.helper.seekWidgetByName(root,"Image_2");
        this.posAutoLayout(scrolbar);
        this.scrollbar = scrolbar;
        this.scrollPosY = this.scrollbar.getPositionY();
        this.barTotalHeight = scrolbar_bg.getContentSize().height;

        //panel down
        var panel_down = ccui.helper.seekWidgetByName(root,"Image_8");
        panel_down.setVisible(true);
        var tips = panel_down.getChildByName("Text_2");
        tips.ignoreContentAdaptWithSize(true);
        tips.setString(ResMgr.inst().getString("assembled_9"));

        var one_btn = panel_down.getChildByName("Button_1");
        one_btn.addTouchEventListener(this.oneCallback,this);
        one_btn.setTitleText(ResMgr.inst().getString("assembled_10"));
    },

    show:function( value ) {
        this.refreshContent();
    },

    close:function() {

    },

    destroy:function() {

    },

    refreshContent: function () {
        for (var i in this.corpsAssembled) {
            if (this.corpsAssembled[i]) {
                this.corpsAssembled[i].removeFromParent(true);
            }
        }
        this.corpsAssembled = [];

        var item_height = 92;
        var counts = this.corpsData.length;
        var size = this.scrol.getContentSize();
        var gap = 5;
        var total_height = (gap + item_height) * counts + gap + (gap + item_height);
        if(total_height<size.height) {
            total_height = size.height;
        }

        this.scrol.setInnerContainerSize(cc.size(size.width, total_height));
        this.scrol.jumpToTop();

        var pos = this.scrol.getInnerContainer().getPosition();
        this.barPercent_total = Math.abs(pos.y);

        //重置滑块大小
        var innerContainerSize = this.scrol.getInnerContainerSize();
        if (this.barPercent_total == 0) {
            this.scrollbar.height = this.barTotalHeight
        }
        else {
            var barHeight = this.barTotalHeight * (1 - (this.barPercent_total / innerContainerSize.height));
            this.scrollbar.height = barHeight;
        }
        //重置滑块位置
        if (innerContainerSize.height < size.height) {
            this.isOnePage = true;
        }
        else {
            this.isOnePage = false;
        }
        if (this.isOnePage) {
            this.refreshScrollbarState(100);
        }
        else {
            this.refreshScrollbarState(0);
        }

        for (var i = 0; i < counts; i++) {
            var item = this.item_root.clone();
            item.setVisible(true);
            this.scrol.addChild(item);
            item.setPosition(cc.p(gap,total_height-(gap + item_height)*(i+1)));
            this.corpsAssembled.push(item);
            item.setTouchEnabled(true);
            item.addTouchEventListener(this.itemCallback,this);

            this.setItem(item);
        }

        this.item_last.setPosition(cc.p(gap,total_height-(gap + item_height)*(counts+1)));
    },

    setItem: function (item) {
        var icon = item.getChildByName("Image_4_0");
        icon.ignoreContentAdaptWithSize(true);
        //icon.loadTexture();

        var name = item.getChildByName("Text_11");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString("assembled_2"));

        var name_label = item.getChildByName("Text_11_2");
        name_label.ignoreContentAdaptWithSize(true);
        name_label.setString("");

        var state = item.getChildByName("Text_11_0");
        state.ignoreContentAdaptWithSize(true);
        state.setString(ResMgr.inst().getString("assembled_3"));

        var state_label = item.getChildByName("Text_11_2_0");
        state_label.ignoreContentAdaptWithSize(true);
        state_label.setString("");

        var counts = item.getChildByName("Text_11_0_0");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(ResMgr.inst().getString("assembled_4"));

        var counts_label = item.getChildByName("Text_11_2_0_0");
        counts_label.ignoreContentAdaptWithSize(true);
        counts_label.setString("");

        var location = item.getChildByName("Text_11_1");
        location.ignoreContentAdaptWithSize(true);
        location.setString(ResMgr.inst().getString("assembled_5"));

        var location_label = item.getChildByName("Text_11_2_1");
        location_label.ignoreContentAdaptWithSize(true);
        location_label.setString("");

        //能否补兵要根据部队位置判断？？？？
        var supplement_btn = item.getChildByName("Button_3");
        supplement_btn.setTitleText(ResMgr.inst().getString("assembled_7"));
        supplement_btn.addTouchEventListener(this.supplementCallback,this);

        var dissolve_btn = item.getChildByName("Button_3_0");
        dissolve_btn.setTitleText(ResMgr.inst().getString("assembled_8"));
        dissolve_btn.addTouchEventListener(this.dissolveCallback,this);

    },

    itemCallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;

    },

    supplementCallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        var sumpplementlayer = new SupplementLayer();
        ModuleMgr.inst().addNodeTOLayer(sumpplementlayer,ModuleLayer.LAYER_TYPE_TOP);
        //ModuleMgr.inst().openModule("BlockInfoModule",{"territoryid":1603001,"certificateid":null});//详情 territoryid：地块ID，certificateid：土地使用券ID
    },

    dissolveCallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        var dissolvelayer = new DissolveLayer();
        ModuleMgr.inst().addNodeTOLayer(dissolvelayer,ModuleLayer.LAYER_TYPE_TOP);
        //ModuleMgr.inst().openModule("BlockLevelupModule",{"territoryid":1603001,"certificateid":2100026});//升级 territoryid：地块ID，certificateid：土地使用券ID
    },

    oneCallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
    },

    addcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        var addlayer = new AddLayer();
        ModuleMgr.inst().addNodeTOLayer(addlayer,ModuleLayer.LAYER_TYPE_TOP);
    },

    //大小适配
    sizeAutoLayout:function(node,scale) {
        scale = scale ? scale:1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var size = node.getContentSize();
        size.height += down*scale;
        node.setContentSize( size );
    },

    //坐标适配
    posAutoLayout: function (node, scale) {
        scale = scale ? scale:1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var posY = node.getPositionY();
        posY += down*scale;
        node.setPositionY( posY );
    },

    //滚动框事件回调
    scrollCall: function (node, type) {
        switch (type) {
            case ccui.ScrollView.EVENT_SCROLLING:
                var pos = this.scrol.getInnerContainer().getPosition();
                var number = this.barPercent_total + pos.y;
                var per = number * 100 / this.barPercent_total;
                if (per < 0) {
                    per = 0
                }
                if (per > 100) {
                    per = 100
                }
                this.refreshScrollbarState(per);
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_TOP:
                this.refreshScrollbarState(0);
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM:
                this.refreshScrollbarState(100);
                break;
            default :
                break;
        }
    },

    //更新滑块位置
    refreshScrollbarState: function (percent) {
        if (!percent && percent != 0) {
            return;
        }
        if (!this.isOnePage) {
            this.scrollbar.y = this.scrollPosY - (this.barTotalHeight - this.scrollbar.height) * percent / 100;
        }
        else {
            this.scrollbar.y = this.scrollPosY;
        }
    },

});