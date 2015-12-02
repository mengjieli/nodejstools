/**
 * Created by cgMu on 2015/11/21.
 */

var BagModule = ModuleBase.extend({
    scrol: null,
    scrollbar: null,
    barTotalHeight: 0,
    barPercent_total: 0,
    scrollPosY: 0,

    isOnePage: null,
    item_root: null,

    panel_up:null,
    panel_down:null,
    countsMax:null,//记录当前道具的使用最大数量

    itemData:null,
    scrolItemArray:null,
    selectingGridIndex:0,//默认选中第一个

    ctor:function() {
        this._super();

        this.itemData = [];
        this.scrolItemArray = [];

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE,this.updateBag,this);
    },

    initUI:function() {
        var root = ccs.load("res/images/ui/BagModule/Layer.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var Panel_1 = ccui.helper.seekWidgetByName(root,"Panel_1");
        this.sizeAutoLayout(Panel_1);

        var left_bg = ccui.helper.seekWidgetByName(root,"Image_1");
        this.sizeAutoLayout(left_bg);

        var scrollview = left_bg.getChildByName("ScrollView_1");
        this.sizeAutoLayout(scrollview);
        scrollview.addEventListener(this.scrollCall, this);
        this.scrol = scrollview;

        var item_root = this.scrol.getChildByName("Image_5");
        item_root.setVisible(false);
        this.item_root = item_root;

        var scrolbar_bg = left_bg.getChildByName("Image_3");
        this.sizeAutoLayout(scrolbar_bg);

        var scrolbar = left_bg.getChildByName("Image_4");
        this.posAutoLayout(scrolbar);
        this.scrollbar = scrolbar;
        this.scrollPosY = this.scrollbar.getPositionY();
        this.barTotalHeight = scrolbar_bg.getContentSize().height;

        var right_bg = ccui.helper.seekWidgetByName(root,"Image_1_0");
        this.sizeAutoLayout(right_bg);
        var bg1 = right_bg.getChildByName("Image_8");
        this.sizeAutoLayout(bg1);
        var bg2 = right_bg.getChildByName("Image_8_0");
        this.sizeAutoLayout(bg2);

        var right_up = ccui.helper.seekWidgetByName(root,"Panel_2");
        this.posAutoLayout(right_up);
        this.panel_up = right_up;

        var right_down = ccui.helper.seekWidgetByName(root,"Panel_3");
        this.panel_down = right_down;

    },

    show:function( value ) {
        this.getBagData();
        this.refreshContent();
        this.setSelectingGrid(this.selectingGridIndex);
    },

    close:function() {

    },

    destroy:function() {
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE,this.updateBag,this);
    },

    getBagData: function () {
        this.itemData = [];
        var data = ModuleMgr.inst().getData("ItemModule").items;
        for (var i in data) {
            //var map = {};
            //map.itemid = i;
            //map.counts = data[i];
            //cc.error(i);
            var cansee = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",i).cansee;
            if(parseInt(cansee)>0){
                this.itemData.push(i);
            }
        }
        this.sortData();
    },

    refreshContent: function () {
        for (var i in this.scrolItemArray) {
            if (this.scrolItemArray[i]) {
                this.scrolItemArray[i].removeFromParent(true)
            }
        }
        this.scrolItemArray = [];

        var y = 4;//4列
        var add = 0;//记录需要额外添加的空背包格子数量
        var ex = this.itemData.length % y;
        if(ex > 0) {
            add = y - ex
        }

        var item_width = 86;
        var item_height = 86;
        var size = this.scrol.getContentSize();
        var counts = this.itemData.length + add;
        var gap_width = 20;
        var gap_height = 10;
        var x = parseInt(counts / y);
        if(counts%y > 0) {
            x = x+1;
        }
        var total_height = x *(gap_height+item_height) + gap_height;
        if(total_height < size.height) {
            total_height = size.height;
        }

        for(var i = 0; i < counts; i++) {
            var item = this.item_root.clone();
            item.setVisible(true);
            this.scrol.addChild(item);
            item.setPosition(cc.p(gap_width+4 +item_width*0.5 + (gap_width + item_width)*(i%y),total_height-gap_height-item_height*0.5-parseInt(i/y)*(gap_height+item_height)));
            this.scrolItemArray.push(item);
            item.setTouchEnabled(true);
            item.addTouchEventListener(this.itemCallback,this);

            item.setTag(i);//格子索引
            if(i+add>=counts) {
                //该索引的为空格子
                item.setUserData(0);
            }
            else {
                var itemid = this.itemData[i];
                item.setUserData(itemid);//道具ID,空格子置0
            }

            this.setItem(item);
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
    },

    itemCallback: function (sender, type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        var index = sender.getTag();
        var itemid = sender.getUserData();
        if(itemid == 0) return;//空格子不响应触摸
        if(this.selectingGridIndex == index) return;//重复触摸处理
        this.selectingGridIndex = index;
        cc.log("itemCallback",this.selectingGridIndex);
        this.setSelectingGrid(this.selectingGridIndex);
    },

    setItem: function (item) {
        var itemid = item.getUserData();

        var selecting = item.getChildByName("Image_5_0_0");
        selecting.setVisible(false);
        var icon = item.getChildByName("Image_5_0");
        icon.ignoreContentAdaptWithSize(true);
        var counts = item.getChildByName("Text_1");
        counts.ignoreContentAdaptWithSize(true);

        if(itemid==0) {
            //空格子
            icon.setVisible(false);
            counts.setVisible(false);
        }
        else {
            icon.loadTexture(ResMgr.inst().getIcoPath(itemid));
            icon.setScale(0.65);
            counts.setString(ModuleMgr.inst().getData("ItemModule").getCountsByItemId(itemid));
        }

    },

    refreshRightContent: function (selectedindex) {
        if(!this.scrolItemArray[selectedindex]) {
            this.panel_up.setVisible(false);
            this.panel_down.setVisible(false);
            return;
        }
        this.panel_up.setVisible(true);
        var item = this.scrolItemArray[selectedindex];
        var itemid = item.getUserData();
        var itemcounts = ModuleMgr.inst().getData("ItemModule").getCountsByItemId(itemid);

        var icon = this.panel_up.getChildByName("Image_10_0");
        icon.ignoreContentAdaptWithSize(true);
        icon.loadTexture(ResMgr.inst().getIcoPath(itemid));
        icon.setScale(0.65);

        var name = this.panel_up.getChildByName("Text_2");
        name.ignoreContentAdaptWithSize(true);
        name.setString(ResMgr.inst().getString(itemid+"0"));

        var des1 = this.panel_up.getChildByName("Text_3");
        des1.ignoreContentAdaptWithSize(true);
        des1.setString(ResMgr.inst().getString("bag_1"));
        var des2 = this.panel_up.getChildByName("Text_3_0");
        des2.ignoreContentAdaptWithSize(true);
        des2.setString(itemcounts);
        var des3 = this.panel_up.getChildByName("Text_3_1");
        des3.ignoreContentAdaptWithSize(true);
        des3.setString(ResMgr.inst().getString("bag_2"));
        //postionx自适应
        des2.setPositionX(des1.getPositionX()+des1.getContentSize().width+2);
        des3.setPositionX(des2.getPositionX()+des2.getContentSize().width+2);

        var detail = this.panel_up.getChildByName("Text_4");
        detail.ignoreContentAdaptWithSize(true);
        detail.setString(ResMgr.inst().getString(itemid+"1"));

        //down
        var canuse = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",itemid).canuse;
        if(canuse == 0) {
            this.panel_down.setVisible(false);
            return;
        }
        this.panel_down.setVisible(true);
        var label1 = this.panel_down.getChildByName("Text_5");
        label1.ignoreContentAdaptWithSize(true);
        label1.setString(ResMgr.inst().getString("bag_3"));

        var textField = this.panel_down.getChildByName("TextField_1");
        textField.setPlaceHolder(ResMgr.inst().getString("bag_4"));
        textField.setString(itemcounts);//itemcounts
        textField.addEventListener(this.textFieldCallback,this);
        this.countsMax = itemcounts;

        var sub = this.panel_down.getChildByName("Panel_4");
        sub.setTouchEnabled(true);
        sub.addTouchEventListener(this.subcallback,this);
        var add = this.panel_down.getChildByName("Image_15_0");
        add.setTouchEnabled(true);
        add.addTouchEventListener(this.addcallback,this);

        var slider = this.panel_down.getChildByName("Slider_1");
        slider.addEventListener(this.sliderCall,this);
        slider.setPercent(100);

        var button = this.panel_down.getChildByName("Button_1");
        button.addTouchEventListener(this.usingItem,this);
        var btn_title = button.getChildByName("Text_6");
        btn_title.ignoreContentAdaptWithSize(true);
        btn_title.setString(ResMgr.inst().getString("bag_5"));
    },

    usingItem: function (sender, type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        if(this.panel_down.isVisible()) {
            if(!this.scrolItemArray[this.selectingGridIndex]) return;
            var item = this.scrolItemArray[this.selectingGridIndex];
            var itemid = item.getUserData();

            var countsInput = this.panel_down.getChildByName("TextField_1");
            var text = countsInput.getString();
            var use_counts = parseInt(text);

            cc.log("usingItem",itemid,use_counts);
            if(use_counts>0){
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("castle_1"),color:null,time:null,pos:null});
            }
            else {
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("bag_6"),color:null,time:null,pos:null});
                this.setUseCounts(1);
            }
        }

    },

    sliderCall: function (sender, type) {
        if( type == ccui.Slider.EVENT_PERCENT_CHANGED ) {
            var num = sender.getPercent();
            var use_counts = num*this.countsMax / 100;
            this.setTextFieldString(parseInt(use_counts));
            //cc.log("percent",num,use_counts,parseInt(use_counts));
        }
    },

    setSliderPercent: function (value) {
        if(this.panel_down.isVisible()) {
            var slider = this.panel_down.getChildByName("Slider_1");
            if(value<0) {
                value = 0;
            }
            if(value>100) {
                value=100;
            }
            slider.setPercent(value);
        }
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

    setSelectingGrid: function (index) {
        for(var i in this.scrolItemArray) {
            var selecting = this.scrolItemArray[i].getChildByName("Image_5_0_0");
            if(index == i) {
                selecting.setVisible(true);
            }
            else {
                selecting.setVisible(false);
            }
        }

        this.refreshRightContent(index);
    },

    textFieldCallback: function (sender, type) {
        if(type == ccui.TextField.EVENT_INSERT_TEXT || type == ccui.TextField.EVENT_DELETE_BACKWARD) {
            //cc.log("textfield",sender.getString());
            var text = sender.getString();
            var use_counts = parseInt(text);
            //纯数字
            var reg = new RegExp("^[0-9]*$");
            if(!reg.test(text)){
                this.setTextFieldString(use_counts);
            }
            if(text=="") {
                this.setSliderPercent(0);
                return;
            }
            if(use_counts>this.countsMax){
                use_counts = this.countsMax;
                this.setTextFieldString(use_counts);
            }
            if(use_counts<1){
                use_counts = 1;
                this.setTextFieldString(use_counts);
            }
            //cc.log("use_counts",use_counts);
            if(!use_counts){
                use_counts = this.countsMax;
                this.setTextFieldString(use_counts);
            }
            var per = use_counts * 100 / this.countsMax;
            //cc.log("use_counts",use_counts,per);
            this.setSliderPercent(per);
        }
        //if(type == ccui.TextField.EVENT_DETACH_WITH_IME) {
        //    cc.log("EVENT_DETACH_WITH_IME");
        //}
    },

    setTextFieldString: function (value) {
        if(this.panel_down.isVisible()) {
            var countsInput = this.panel_down.getChildByName("TextField_1");
            countsInput.setString(value);
        }
    },

    subcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        if(this.panel_down.isVisible()) {
            var countsInput = this.panel_down.getChildByName("TextField_1");
            var text = countsInput.getString();
            var use_counts = parseInt(text);
            if(text=="") {
                use_counts = 0;
            }
            use_counts--;
            this.setUseCounts(use_counts);
        }
    },

    addcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        if(this.panel_down.isVisible()) {
            var countsInput = this.panel_down.getChildByName("TextField_1");
            var text = countsInput.getString();
            var use_counts = parseInt(text);
            if(text=="") {
                use_counts = 0;
            }
            use_counts++;
            this.setUseCounts(use_counts);
        }
    },

    setUseCounts: function (use_counts) {
        if(use_counts<0) use_counts = 0;
        if(use_counts>this.countsMax) use_counts = this.countsMax;

        this.setTextFieldString(use_counts);

        var per = use_counts * 100 / this.countsMax;
        this.setSliderPercent(per);
    },

    updateBag: function (event,data) {
        if(data==500) {//请求道具
            ModuleMgr.inst().openModule("BagModule");
        }
    },

    sortData: function () {
        for(var i = 0; i < this.itemData.length; i++ ) {
            //cc.log("item_i",this.itemData[i]);

            for(var j = i+1; j < this.itemData.length; j++) {
                var item_i = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",this.itemData[i]);
                //cc.log("item_j",this.itemData[j]);
                var item_j = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("item",this.itemData[j]);

                //cc.log("item_i",this.itemData[i],item_i.class,item_i.itemid,"item_j",this.itemData[j],item_j.class,item_j.class);

                if(item_i.class > item_j.class) {
                    var temp = this.itemData[i];
                    this.itemData[i] = this.itemData[j];
                    this.itemData[j] = temp;
                }
                else if (item_i.class == item_j.class) {
                    if(parseInt(item_i.itemid) > parseInt(item_j.itemid)) {
                        var temp = this.itemData[i];
                        this.itemData[i] = this.itemData[j];
                        this.itemData[j] = temp;
                    }
                }
            }
        }
    }
});