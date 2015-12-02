/**
 * Created by cgMu on 2015/11/9.
 */

var PayModule = ModuleBase.extend({
    scrolItemArray:null,
    tabItemArray:null,
    //itemContainer:null,
    //centerItemIndex:2, //中间item的索引标识
    //startPoint:null, //触摸开始点

    scrol:null,
    selectingTag:0,

    label_counts:null,
    buy_id:null,

    ctor:function() {
        this._super();

        this.scrolItemArray = [];
        this.tabItemArray = [];

        //NetMgr.inst().addEventListener(599, this.netUpdateItem, this);//更新道具
        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE,this.updateItem,this);
        EventMgr.inst().addEventListener(ITEM_EVENT.ITEM_UPDATE,this.updateItemCounts,this);
    },

    initUI:function() {
        var root = ccs.load("res/images/ui/PayModule/PayLayer.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var panel_root = root.getChildByName("Panel_1");
        this.sizeAutoLayout(panel_root);

        var cz_baoshikuang_di_2 = root.getChildByName("cz_baoshikuang_di_2");
        this.posAutoLayout(cz_baoshikuang_di_2);

        this.label_counts = cz_baoshikuang_di_2.getChildByName("Text_5");
        this.label_counts.ignoreContentAdaptWithSize(true);
        this.label_counts.setString(ModuleMgr.inst().getData("ItemModule").getCountsByItemId(1103003));

        var touchpanel = panel_root.getChildByName("Panel_2");
        this.posAutoLayout(touchpanel,0.5);
        this.sizeAutoLayout(touchpanel,0.5);
        //touchpanel.addTouchEventListener(this.touchcallback,this);
        //this.itemContainer = touchpanel;

        var scrollview = touchpanel.getChildByName("ScrollView_1");
        this.scrol = scrollview;

        var gy_yeqian_xihuagang_2 = panel_root.getChildByName("gy_yeqian_xihuagang_2");
        gy_yeqian_xihuagang_2.setLocalZOrder(11);
        this.posAutoLayout(gy_yeqian_xihuagang_2);

        var tab1 = panel_root.getChildByName("Image_1_1");
        tab1.ignoreContentAdaptWithSize(true);
        tab1.setTag(0);
        tab1.setTouchEnabled(true);
        tab1.addTouchEventListener(this.refreshTabState,this);
        this.posAutoLayout(tab1);
        this.tabItemArray.push(tab1);
        var title1 = tab1.getChildByName("Text_1");
        title1.ignoreContentAdaptWithSize(true);
        title1.setString(ResMgr.inst().getString("pay_1"));

        var tab2 = panel_root.getChildByName("Image_1_0");
        tab2.ignoreContentAdaptWithSize(true);
        tab2.setTag(1);
        tab2.setTouchEnabled(true);
        tab2.addTouchEventListener(this.refreshTabState,this);
        this.posAutoLayout(tab2);
        this.tabItemArray.push(tab2);
        var title2 = tab2.getChildByName("Text_1");
        title2.ignoreContentAdaptWithSize(true);
        title2.setString(ResMgr.inst().getString("pay_2"));

        var tab3 = panel_root.getChildByName("Image_1");
        tab3.ignoreContentAdaptWithSize(true);
        tab3.setTag(2);
        tab3.setTouchEnabled(true);
        tab3.addTouchEventListener(this.refreshTabState,this);
        this.posAutoLayout(tab3);
        this.tabItemArray.push(tab3);
        var title3 = tab3.getChildByName("Text_1");
        title3.ignoreContentAdaptWithSize(true);
        title3.setString(ResMgr.inst().getString("pay_3"));

        this.refreshContent_ex(this.selectingTag);
    },

    show:function( value ) {

    },

    close:function() {

    },

    destroy:function() {
        //NetMgr.inst().removeEventListener(599, this.netUpdateItem, this);
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE,this.updateItem,this);
        EventMgr.inst().removeEventListener(ITEM_EVENT.ITEM_UPDATE,this.updateItemCounts,this);
    },

    //refreshContent: function (tag) {
    //
    //    var data = ModuleMgr.inst().getData("PayModule");
    //
    //    for (var i = 0; i < 8; i++) {
    //        var item = new ScrolItem();
    //        this.itemContainer.addChild(item);
    //        item._touchPanel.setTag(i);
    //        var index = i;
    //        if( i - this.centerItemIndex < -2 ) { //左边不显示
    //            index = 0;
    //            item.setLocalZOrder(data.scrolItemZOrder[-1]);
    //        }
    //        else if( i - this.centerItemIndex > 2 ) { //右边不显示
    //            index = 4;
    //            item.setLocalZOrder(data.scrolItemZOrder[-1]);
    //        }
    //        else {
    //            index = i % 5;
    //            item.setLocalZOrder(data.scrolItemZOrder[index]);
    //        }
    //        item.setScale(data.scrolItemScale[index]);
    //        item.setPosition(data.scrolItemsPos[index]);
    //        //item.setLocalZOrder(data.scrolItemZOrder[index]);
    //        item._touchPanel.addTouchEventListener(this.itemTouchCallback,this);
    //    }
    //
    //},

    //tab:标签tag
    refreshContent_ex: function (tab) {
        var data = ModuleMgr.inst().getData("PayModule")._data[tab+1];

        for (var i in this.scrolItemArray) {
            if (this.scrolItemArray[i]) {
                this.scrolItemArray[i].removeFromParent(true)
            }
        }
        this.scrolItemArray = [];

        var item_width = 199;
        var item_height = 244;
        var size = this.scrol.getContentSize();
        var counts = data.length;
        var totalWidth = item_width*counts;
        totalWidth = totalWidth<size.width ? size.width:totalWidth;

        var item0 = this.scrol.getChildByName("Panel_1_0");
        item0.setVisible(false);

        for (var i = 0; i < counts; i++) {
            var item = item0.clone();
            item.setVisible(true);
            this.scrol.addChild(item);
            this.scrolItemArray.push(item);
            item.setPosition(cc.p(i*item_width+15.5,(size.height-item_height)*0.5));

            item.setTag(data[i].recharge_id);
            item.setTouchEnabled(true);
            item.addTouchEventListener(this.itemTouchCallback,this);

            this.setItemContent(item,data[i]);
        }

        this.scrol.setInnerContainerSize( cc.size(totalWidth,size.height) );
        this.scrol.jumpToLeft();

    },

    //touchcallback: function (sender, type) {
    //    switch (type) {
    //        case ccui.Widget.TOUCH_BEGAN:
    //            this.startPoint = sender.getTouchBeganPosition();
    //            cc.log("x",this.startPoint.x,"y",this.startPoint.y);
    //            break;
    //        case ccui.Widget.TOUCH_MOVED:
    //            break;
    //        case ccui.Widget.TOUCH_ENDED:
    //            cc.log("ccui.Widget.TOUCH_ENDED");
    //            break;
    //        case ccui.Widget.TOUCH_CANCELED:
    //            break;
    //    }
    //},

    itemTouchCallback: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                var tag = sender.getTag();
                cc.log("***",tag);
                this.buy_id = null;
                if (tag > 6) { //过滤掉人民币充值
                    this.buy(tag,1);
                    this.buy_id = tag;
                }
                else {
                    ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("college_18"),color:null,time:null,pos:null});
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
        }
    },

    refreshTabState: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        var tag = sender.getTag();
        if (this.selectingTag == tag) {cc.error("touch again"); return;}

        this.selectingTag = tag;
        cc.log("ccui.Widget.TOUCH_ENDED",tag,this.tabItemArray.length);
        for (var i in this.tabItemArray) {
            //cc.log(i);
            if (tag == i) {
                this.tabItemArray[i].loadTexture("gy_yeqian_anxia.png",ccui.Widget.PLIST_TEXTURE);
                var title = this.tabItemArray[i].getChildByName("Text_1");
                this.resetTabTitlePos(this.tabItemArray[i],title);
                this.tabItemArray[i].setLocalZOrder(10);
            }
            else {
                this.tabItemArray[i].loadTexture("gy_yeqian_xuanze.png",ccui.Widget.PLIST_TEXTURE);
                var title = this.tabItemArray[i].getChildByName("Text_1");
                this.resetTabTitlePos(this.tabItemArray[i],title);
                this.tabItemArray[i].setLocalZOrder(0);
            }
        }

        this.refreshContent_ex(this.selectingTag);
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
    //切换标签时，调整文字坐标，居中
    resetTabTitlePos: function (parent, title) {
        var size = parent.getContentSize();
        title.setPosition(cc.p(size.width*0.5,size.height*0.4048));
    },
    //设置item样式
    setItemContent: function (item,data) {
        var title_bg = item.getChildByName("Image_1");
        title_bg.ignoreContentAdaptWithSize(true);

        var title = item.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);

        var name = item.getChildByName("Text_2");
        name.ignoreContentAdaptWithSize(true);

        var counts_label = item.getChildByName("Text_3");
        counts_label.ignoreContentAdaptWithSize(true);

        var icon = item.getChildByName("Image_2");
        icon.ignoreContentAdaptWithSize(true);

        var cost_icon = ccui.helper.seekWidgetByName(item,"Image_3"); //item.getChildByName("Image_3");
        cost_icon.ignoreContentAdaptWithSize(true);

        var cost = item.getChildByName("Text_4");
        cost.ignoreContentAdaptWithSize(true);

        var itemdata = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item_trading",data.trading_id);
        var temp = itemdata.obtain_item;
        //cc.log("*****",temp);
        var tempjson = eval("(" + temp + ")");
        var obtain_item = {};
        for (var i in tempjson) {
            obtain_item.itemid = i;
            obtain_item.counts = tempjson[i];
        }
        tempjson = eval("(" + itemdata.consumption_item + ")");
        var consumption_item = {};
        for (var i in tempjson) {
            consumption_item.itemid = i;
            consumption_item.counts = tempjson[i];
        }

        title_bg.loadTexture(this.getTitleBgStringByType(data.type),ccui.Widget.PLIST_TEXTURE);
        if(data.price_id == 1 && data.type==4){
            title.setString(ResMgr.inst().getString("pay_11"));
        }
        else {
            title.setString(this.getTitleByType(data.type));
        }
        name.setString(ResMgr.inst().getString(data.icon+"0"));
        counts_label.setString(obtain_item.counts);
        icon.loadTexture(ResMgr.inst()._icoPath+data.icon+"4.png");
        //根据item类型，相应处理
        if(data.price_id==1)//人民币支付
        {
            cost_icon.setVisible(false);
            cost.setString("￥"+6);
        }
        else if (data.price_id == 3) { //金币支付
            cost_icon.loadTexture(ResMgr.inst()._icoPath+consumption_item.itemid+"0.png")
            cost.setString(consumption_item.counts);
        }
        else
        {
            cost_icon.setVisible(true);
            cost.setString(consumption_item.counts);
        }
    },

    //1:首次翻倍 2:每日限购 3:热卖 4:无标签 5:仅限一次 6:活动特惠
    getTitleBgStringByType: function (type) {
        var string = null;
        switch (parseInt(type)) {
            case 1:
                string = "cz_di_qizhi_06";
                break;
            case 2:
                string = "cz_di_qizhi_02";
                break;
            case 3:
                string = "cz_di_qizhi_01";
                break;
            case 4:
                string = "cz_di_qizhi_04";
                break;
            case 5:
                string = "cz_di_qizhi_03";
                break;
            default :
                string = "cz_di_qizhi_05";
                break;
        }
        return "PayModule/"+string+".png";
    },

    getTitleByType: function (type) {
        var string = null;
        switch (parseInt(type)) {
            case 1:
                string = ResMgr.inst().getString("pay_6");
                break;
            case 2:
                string = ResMgr.inst().getString("pay_5");
                break;
            case 3:
                string = ResMgr.inst().getString("pay_4");
                break;
            case 6:
                string = ResMgr.inst().getString("pay_8");
                break;
            case 5:
                string = ResMgr.inst().getString("pay_7");
                break;
            default :
                string = ResMgr.inst().getString("pay_9");
                break
        }
        return string;
    },

    buy: function (rechargeid, repeatcount) {
        var msg = new SocketBytes();
        msg.writeUint(501);//充值页面购买
        msg.writeUint(rechargeid);//
        msg.writeUint(repeatcount);
        NetMgr.inst().send(msg);
    },

    //更新钻石数量
    updateLabel: function (value) {
        if (this.label_counts) {
            this.label_counts.setString(value);
        }
    },

    //TODO: 测试用
    //getItem: function () {
    //    var msg = new SocketBytes();
    //    msg.writeUint(500);//加载道具列表
    //    NetMgr.inst().send(msg);
    //},

    //netUpdateItem: function (cmd,data) {
    //    if (599 == cmd) {
    //        data.resetCMDData();
    //        var itemid = data.readUint();
    //        var counts = data.readUint();
    //        //cc.log("update item",itemid,counts);
    //        if (itemid==1103001) {
    //            cc.log("黄金",counts);
    //        }
    //        if (itemid==1103003) {
    //            cc.log("钻石",counts);
    //            this.updateLabel(counts);
    //        }
    //        if (itemid>2100001) {
    //            cc.log("礼包ID",itemid,counts);
    //        }
    //    }
    //},
    updateItemCounts: function (event, itemid, counts) {
        if(itemid == 1103003) {
            this.updateLabel(counts);
        }
    },

    updateItem: function (type,data) {
        if (data == 501) {
            if (this.buy_id) {
                var d = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("Pay",this.buy_id);
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("pay_10")+ResMgr.inst().getString(d.icon+"0"),color:null,time:null,pos:null});
            }
        }
    }

});