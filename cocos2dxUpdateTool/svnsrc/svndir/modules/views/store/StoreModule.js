/**
 * Created by cgMu on 2015/11/16.
 */

var StoreModule = ModuleBase.extend({
    selectingTag: 1,
    tabItemArray: null,
    scrolItemArray: null,
    itemCountsLabelArray:null, //存储当前道具的数量 label

    scrol: null,
    scrollbar: null,
    barTotalHeight: 0,
    barPercent_total: 0,
    scrollPosY: 0,

    isOnePage: null,
    item_root: null,

    storeData: null,
    willBuy_itemid:null, //欲购买的道具ID

    ctor: function () {
        this._super();
        this.tabItemArray = [];
        this.scrolItemArray = [];
        this.itemCountsLabelArray = {};

        this.storeData = {};
        this.storeData[1] = [];
        this.storeData[2] = [];
        this.storeData[3] = [];

        //获取数据
        var data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("shop");
        for (var key in data) {
            switch (parseInt(data[key].tab_type)) {
                case 1:
                    this.storeData[1].push(data[key]);
                    break;
                case 2:
                    this.storeData[2].push(data[key]);
                    break;
                case 3:
                    this.storeData[3].push(data[key]);
                    break;
            }
        }

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE,this.updateItem,this);
        EventMgr.inst().addEventListener(ITEM_EVENT.ITEM_UPDATE,this.updateItemCounts,this);
    },

    initUI: function () {
        //黑色透明背景层
        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255 * 0.8));
        this.addChild(colorbg);

        var root = ccs.load("res/images/ui/StoreModule/storelayer.json", "res/images/ui/").node;
        this.addChild(root);

        //适配
        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var panel_root = root.getChildByName("Panel_1");
        this.sizeAutoLayout(panel_root);

        var left_bg = panel_root.getChildByName("Image_1");
        this.sizeAutoLayout(left_bg, 0.5);
        var right_bg = panel_root.getChildByName("Image_1_0");
        this.sizeAutoLayout(right_bg, 0.5);

        var gy_yeqian_xihuagang_5 = panel_root.getChildByName("gy_yeqian_xihuagang_5");
        this.posAutoLayout(gy_yeqian_xihuagang_5);
        gy_yeqian_xihuagang_5.setLocalZOrder(11);

        //tab1
        var tab1 = panel_root.getChildByName("Image_3");
        this.posAutoLayout(tab1);
        tab1.setTag(1);
        tab1.setTouchEnabled(true);
        tab1.ignoreContentAdaptWithSize(true);
        tab1.addTouchEventListener(this.tabCallback, this);
        this.tabItemArray.push(tab1);
        var title_tab1 = tab1.getChildByName("Text_1");
        title_tab1.ignoreContentAdaptWithSize(true);
        title_tab1.setString(ResMgr.inst().getString("store_1"));
        //tab2
        var tab2 = panel_root.getChildByName("Image_3_0");
        this.posAutoLayout(tab2);
        tab2.setTag(2);
        tab2.setTouchEnabled(true);
        tab2.ignoreContentAdaptWithSize(true);
        tab2.addTouchEventListener(this.tabCallback, this);
        this.tabItemArray.push(tab2);
        var title_tab2 = tab2.getChildByName("Text_1");
        title_tab2.ignoreContentAdaptWithSize(true);
        title_tab2.setString(ResMgr.inst().getString("store_2"));
        //tab3
        var tab3 = panel_root.getChildByName("Image_3_1");
        this.posAutoLayout(tab3);
        tab3.setTag(3);
        tab3.setTouchEnabled(true);
        tab3.ignoreContentAdaptWithSize(true);
        tab3.addTouchEventListener(this.tabCallback, this);
        this.tabItemArray.push(tab3);
        var title_tab3 = tab3.getChildByName("Text_1");
        title_tab3.ignoreContentAdaptWithSize(true);
        title_tab3.setString(ResMgr.inst().getString("store_3"));

        var scrollview = panel_root.getChildByName("ScrollView_1");
        this.sizeAutoLayout(scrollview);
        scrollview.addEventListener(this.scrollCall, this);
        this.scrol = scrollview;

        var item_root = this.scrol.getChildByName("Image_28");
        item_root.setVisible(false);
        this.item_root = item_root;

        var scrolbar_bg = panel_root.getChildByName("Image_26");
        this.sizeAutoLayout(scrolbar_bg);

        var scrolbar = panel_root.getChildByName("Image_27");
        this.posAutoLayout(scrolbar);
        this.scrollbar = scrolbar;
        this.scrollPosY = this.scrollbar.getPositionY();
        this.barTotalHeight = scrolbar_bg.getContentSize().height;

        this.refreshContent(this.selectingTag);
    },

    show: function (value) {

    },

    refreshContent: function (tag) {
        var data = this.storeData[tag];
        //清空内容
        for (var i in this.scrolItemArray) {
            if (this.scrolItemArray[i]) {
                this.scrolItemArray[i].removeFromParent(true)
            }
        }
        this.scrolItemArray = [];
        //存储道具数量的label，用于购买成功后，刷新数量
        //for (var i in this.itemCountsLabelArray) {
        //    if(this.itemCountsLabelArray[i]) {
        //        this.itemCountsLabelArray[i].removeFromParent(true);
        //    }
        //}
        this.itemCountsLabelArray = {};

        var item_height = 93;
        var size = this.scrol.getContentSize();
        var counts = data.length;
        var gap = 5;
        var gap_ex = 10;
        var totalHeight = (gap + item_height) * counts + gap_ex;
        totalHeight = totalHeight < size.height ? size.height : totalHeight;

        for (var i = 0; i < counts; i++) {
            var item = this.item_root.clone();
            item.setVisible(true);
            this.scrol.addChild(item);
            this.scrolItemArray.push(item);
            item.setPosition(cc.p(480, totalHeight - (gap_ex + item_height * 0.5) - (gap + item_height) * i));

            var itemdata = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item_trading",data[i].trading_id);

            var type = item.getChildByName("Image_32");
            type.ignoreContentAdaptWithSize(true);
            if (data[i].type == 3) {
                //热卖
                type.loadTexture("StoreModule/sc_hot.png", ccui.Widget.PLIST_TEXTURE);
            }
            else if (data[i].type == 6) {
                //特惠
                type.loadTexture("StoreModule/sc_depreciate.png", ccui.Widget.PLIST_TEXTURE);
            }
            else {
                type.setVisible(false);
            }

            //购买的道具
            var tempjson = eval("(" + itemdata.obtain_item + ")");
            var obtain_item = {};
            for (var jsonkey in tempjson) {
                obtain_item.itemid = jsonkey;
                obtain_item.counts = tempjson[jsonkey];
            }
            //消耗的道具
            tempjson = eval("(" + itemdata.consumption_item + ")");
            var consumption_item = {};
            for (var jsonkey in tempjson) {
                consumption_item.itemid = jsonkey;
                consumption_item.counts = tempjson[jsonkey];
            }

            var icon = item.getChildByName("Image_30_0");
            icon.ignoreContentAdaptWithSize(true);
            icon.setScale(0.67);
            icon.loadTexture(ResMgr.inst().getIcoPath(obtain_item.itemid));

            var num = item.getChildByName("Text_3");
            num.ignoreContentAdaptWithSize(true);
            num.setString(obtain_item.counts);

            var btn = item.getChildByName("Button_2");
            btn.setTag(data[i].shop_id);
            btn.userInfo = consumption_item.counts;
            btn.buyItemId = obtain_item.itemid;
            btn.addTouchEventListener(this.itemBuyCallback,this);

            var title_btn = btn.getChildByName("Text_2");
            title_btn.ignoreContentAdaptWithSize(true);
            title_btn.setString(ResMgr.inst().getString("head_9"));

            //消耗道具icon
            var icon_cost = btn.getChildByName("Image_29");
            icon_cost.ignoreContentAdaptWithSize(true);
            //icon_cost.loadTexture();

            var cost = btn.getChildByName("Text_20");
            cost.ignoreContentAdaptWithSize(true);
            cost.setString(consumption_item.counts);

            var name = ccui.helper.seekWidgetByName(item,"Text_21");
            name.ignoreContentAdaptWithSize(true);
            name.setString(ResMgr.inst().getString(obtain_item.itemid+"0"));

            var des1 = ccui.helper.seekWidgetByName(item,"Text_23");
            des1.ignoreContentAdaptWithSize(true);
            des1.setString(ResMgr.inst().getString("store_7"));
            des1.setPositionX(name.getPositionX()+name.getContentSize().width + 20);

            var numbers = ccui.helper.seekWidgetByName(item,"Text_23_0");
            numbers.ignoreContentAdaptWithSize(true);
            numbers.setString(ModuleMgr.inst().getData("ItemModule").getCountsByItemId(obtain_item.itemid));
            numbers.setPositionX(des1.getPositionX()+des1.getContentSize().width + 2);
            this.itemCountsLabelArray[obtain_item.itemid]=numbers;

            var des2 = ccui.helper.seekWidgetByName(item,"Text_23_1");
            des2.setString(")");
            des2.ignoreContentAdaptWithSize(true);
            des2.setPositionX(numbers.getPositionX()+numbers.getContentSize().width + 2)

            var des3 = ccui.helper.seekWidgetByName(item,"Text_22");
            des3.ignoreContentAdaptWithSize(true);
            des3.setString(ResMgr.inst().getString(obtain_item.itemid+"1"));
        }

        this.scrol.setInnerContainerSize(cc.size(size.width, totalHeight));
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
    },

    close: function () {

    },

    destroy: function () {
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE,this.updateItem,this);
        EventMgr.inst().removeEventListener(ITEM_EVENT.ITEM_UPDATE,this.updateItemCounts,this);
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

    //切换标签时，调整文字坐标，居中
    resetTabTitlePos: function (parent, title) {
        var size = parent.getContentSize();
        title.setPosition(cc.p(size.width * 0.5, size.height * 0.4048));
    },

    tabCallback: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        var tag = sender.getTag();
        if (this.selectingTag == tag) {
            return;
        }

        this.selectingTag = tag;

        for (var i in this.tabItemArray) {
            if (tag - 1 == i) {
                this.tabItemArray[i].loadTexture("gy_yeqian_anxia.png", ccui.Widget.PLIST_TEXTURE);
                var title = this.tabItemArray[i].getChildByName("Text_1");
                this.resetTabTitlePos(this.tabItemArray[i], title);
                this.tabItemArray[i].setLocalZOrder(10);
            }
            else {
                this.tabItemArray[i].loadTexture("gy_yeqian_xuanze.png", ccui.Widget.PLIST_TEXTURE);
                var title = this.tabItemArray[i].getChildByName("Text_1");
                this.resetTabTitlePos(this.tabItemArray[i], title);
                this.tabItemArray[i].setLocalZOrder(0);
            }
        }

        this.refreshContent(this.selectingTag);
    },

    itemBuyCallback: function (sender, type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        var shop_id = sender.getTag();
        var counts = sender.userInfo;
        //cc.log("shop_id", shop_id,"cost",counts);
        this.willBuy_itemid = sender.buyItemId;
        var confirmlayer = new BuyConfirmLayer(shop_id,counts);
        ModuleMgr.inst().addNodeTOLayer(confirmlayer,ModuleLayer.LAYER_TYPE_TOP);
    },

    updateItem: function (event,data) {
        if (data == 502) {
            if (this.willBuy_itemid) {
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("store_8")+ResMgr.inst().getString(this.willBuy_itemid+"0"),color:null,time:null,pos:null});
            }
        }
    },

    //更新道具数量
    updateItemCounts: function (event,itemid,counts) {
        if (itemid == this.willBuy_itemid) {
            if (this.itemCountsLabelArray[this.willBuy_itemid]) {
                this.itemCountsLabelArray[this.willBuy_itemid].setString(counts);
            }
        }
    }
});