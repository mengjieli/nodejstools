/**
 * Created by cgMu on 2015/11/4.
 */

var CityGainModule = ModuleBase.extend({
    left_itemRoot:null,
    right_itemRoot:null,

    barPercent_total:0,

    itemMap:[],
    rightItemMap:[],

    ctor:function() {
        this._super();
    },

    initUI:function() {
        var root = ccs.load("res/images/ui/HeadModule/CHBLayer.json","res/images/ui/").node;
        this.addChild(root);

        //适配
        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        var Panel_1 = ccui.helper.seekWidgetByName(root,"Panel_1");
        var size = Panel_1.getContentSize();
        size.height += down;
        Panel_1.setContentSize( size );

        var Panel_2 = ccui.helper.seekWidgetByName(root,"Panel_2");
        var size = Panel_2.getContentSize();
        size.height += down;
        Panel_2.setContentSize( size );

        var Panel_2_0 = ccui.helper.seekWidgetByName(root,"Panel_2_0");
        var size = Panel_2_0.getContentSize();
        size.height += down;
        Panel_2_0.setContentSize( size );
        //var posY = Panel_2_0.getPositionY();
        //posY -= down;
        //Panel_2_0.setPositionY( posY );

        var scrollview = ccui.helper.seekWidgetByName(root, "ScrollView_1");
        var size = scrollview.getContentSize();
        size.height += down;
        scrollview.setContentSize( size );
        scrollview.addEventListener(this.scrollCall, this );

        var barBg = ccui.helper.seekWidgetByName(root, "Image_2");
        var size = barBg.getContentSize();
        size.height += down;
        barBg.setContentSize( size );
        var posY = barBg.getPositionY();
        posY += down/2;
        barBg.setPositionY( posY );
        this.barTotalHeight = barBg.getContentSize().height;

        this.scrollbar = ccui.helper.seekWidgetByName(root, "Image_3");
        var posY = this.scrollbar.getPositionY();
        posY += down;
        this.scrollbar.setPositionY( posY );
        this.scrollPosY = this.scrollbar.getPositionY();

        var item0 = scrollview.getChildByName("Image_4");
        item0.setVisible(false);
        this.scrol = scrollview;
        this.left_itemRoot = item0;

        this.rightPanel = Panel_2_0;//root.getChildByName("Panel_2_0");

        var item1 = this.rightPanel.getChildByName("Image_9");
        item1.setVisible(false);
        this.right_itemRoot = item1;
    },

    show:function( value ) {
        this.refreshScrollview();
    },

    close:function() {

    },

    destroy:function() {

    },

    scrollCall: function (node, type) {
        switch (type) {
            case ccui.ScrollView.EVENT_SCROLLING:
                var pos = this.scrol.getInnerContainer().getPosition();
                //var size = this.scrol.getInnerContainerSize();
                var number = this.barPercent_total+pos.y;
                var per = number *100 / this.barPercent_total;
                if (per < 0) {
                    per =0
                }
                if (per > 100) {
                    per =100
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

    refreshScrollview: function () {
        for (var index in this.itemMap) {
            if (this.itemMap[index]) {
                this.itemMap[index].removeFromParent(true);
            }
        }
        this.itemMap = [];

        var size = this.scrol.getContentSize();
        var counts = 9;
        var itemH = this.left_itemRoot.getContentSize().height;
        var itemW = this.left_itemRoot.getContentSize().width;
        var h = counts * itemH;
        cc.log("itemH",itemH,itemW);

        if (h < size.height) {
            h = size.height;
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

        cc.log("h ",h,"height ",size.height);

        for (var i = 0; i < counts; i++) {
            var it = this.left_itemRoot.clone();
            this.scrol.addChild( it );
            this.itemMap.push(it);
            it.setVisible(true);
            it.setPosition( itemW*0.5,h - itemH*0.5 - itemH*i );
            it.setTag(i);
            it.setTouchEnabled(true);
            it.addTouchEventListener(this.itemTouch,this);

            if ( i % 2 == 0 ) {
                it.loadTexture("gy_01_mingdi.png", ccui.Widget.PLIST_TEXTURE);
            }

            var selecting = it.getChildByName("Image_4_0");
            selecting.setVisible(false);

            var time = it.getChildByName("Text_3");
            time.setVisible(false);
        }

        size.height = h > size.height ? h : size.height;
        this.scrol.setInnerContainerSize( size );

        var innerContainer = this.scrol.getInnerContainer();
        var innerContainerSize = this.scrol.getInnerContainerSize();
        var pos = innerContainer.getPosition();
        this.barPercent_total = Math.abs(pos.y);

        if (this.barPercent_total==0) {
            this.scrollbar.height=this.barTotalHeight
        }
        else {
            var barHeight = this.barTotalHeight*(1-(this.barPercent_total/innerContainerSize.height));
            cc.log("滑块高度 ", barHeight);
            this.scrollbar.height=barHeight;
        }

        this.scrol.jumpToTop();


        this.setItemSelecting(0);
    },

    refreshScrollbarState: function (percent) {
        if (!percent && percent != 0) {
            return;
        }
        if (!this.isOnePage) {
            this.scrollbar.y = this.scrollPosY-(this.barTotalHeight-this.scrollbar.height)*percent/100;
        }
        else {
            this.scrollbar.y = this.scrollPosY;
        }
    },

    itemTouch: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var tag = sender.getTag();
            cc.log("item touch ",tag);
            this.setItemSelecting(tag);
        }
    },

    setItemSelecting: function (index) {
        for (var i = 0; i < this.itemMap.length; i++) {
            var selected = this.itemMap[i].getChildByName("Image_4_0");
            if (index == i) {
                selected.setVisible(true);
            }
            else {
                selected.setVisible(false);
            }
        }
        this.updateRight();
    },

    updateRight: function () {
        for (var index in this.rightItemMap) {
            if (this.rightItemMap[index]) {
                this.rightItemMap[index].removeFromParent(true);
            }
        }
        this.rightItemMap = [];

        var counts = 2;
        var itemH = this.right_itemRoot.getContentSize().height;
        var itemW = this.right_itemRoot.getContentSize().width;
        var size = this.rightPanel.getContentSize();

        for (var i = 0; i < counts; i++) {
            var it = this.right_itemRoot.clone();
            this.rightPanel.addChild( it );
            this.rightItemMap.push(it);
            it.setVisible(true);
            it.setPosition( itemW*0.5+10,size.height-10 - itemH*0.5 - itemH*i );

            var btnTitle = ccui.helper.seekWidgetByName(it, "Text_8");
            btnTitle.ignoreContentAdaptWithSize(true);
            btnTitle.setString(ResMgr.inst().getString("head_9"));
        }
    }
});