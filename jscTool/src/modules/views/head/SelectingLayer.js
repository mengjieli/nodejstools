/**
 * Created by cgMu on 2015/11/5.
 */

var SelectingLayer = cc.Node.extend({
    itemMap:null,
    selectingIconTag:null,

    ctor: function () {
        this._super();
        //读取头像配置
        var headArray = ResMgr.inst().getCSV("head");

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var root = ccs.load("res/images/ui/HeadModule/Selecting.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);

        var panel = ccui.helper.seekWidgetByName(root,"Panel_1");
        var posY = panel.getPositionY();
        posY += down/2;
        panel.setPositionY( posY );

        var closeButton = ccui.helper.seekWidgetByName(root, "Button_1");
        closeButton.addTouchEventListener(this.touchCallback,this);

        var title = ccui.helper.seekWidgetByName(root,"Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("head_10"));

        var btn1 = ccui.helper.seekWidgetByName(root, "Button_2");
        btn1.setTag(11);
        btn1.addTouchEventListener(this.btnCallback,this);
        this.setChangeBtnEnable(btn1,false);
        var la1 = btn1.getChildByName("Text_2");
        la1.ignoreContentAdaptWithSize(true);
        la1.setString(ResMgr.inst().getString("head_11"));
        this.changebtn = btn1;

        var btn2 = ccui.helper.seekWidgetByName(root, "Button_2_0");
        btn2.setTag(12);
        btn2.addTouchEventListener(this.btnCallback,this);
        var la2 = btn2.getChildByName("Text_2");
        la2.ignoreContentAdaptWithSize(true);
        la2.setString(ResMgr.inst().getString("head_12"));

        var scrollview = ccui.helper.seekWidgetByName(root, "ScrollView_1");

        var item = scrollview.getChildByName("Image_2");
        item.setVisible(false);

        var counts = 0;
        for(var key in headArray) {
            counts++;
        }
        var itemSize = item.getContentSize();
        var scrollviewSize = scrollview.getContentSize();
        var gap = 15;
        var delt = 20;

        var num = parseInt(counts/7);
        if (counts % 7 > 0) {
            num = num + 1;
        }

        var totalHeight = num * (itemSize.height+gap) + gap;
        if (totalHeight < scrollviewSize.height) {
            totalHeight = scrollviewSize.height;
        }

        this.itemMap = [];
        for (var i = 0; i < counts; i++) {
            var tag = headArray[i+1].head_id;

            var it = item.clone();
            it.setVisible(true);
            scrollview.addChild(it);
            it.setPosition(cc.p(delt + (itemSize.width+gap) * (i%7) + itemSize.width*0.5,totalHeight - gap - itemSize.height*0.5-(parseInt(i/7))*(gap+itemSize.height)));
            this.itemMap.push(it);
            it.setTouchEnabled(true);
            it.setTag(i);
            it.userInfo = tag;
            it.addTouchEventListener(this.itemTouchCallback,this);

            var icon = it.getChildByName("Image_2_0");
            icon.setScale(0.38);
            icon.ignoreContentAdaptWithSize(true);
            icon.loadTexture(ResMgr.inst().getIcoPath(tag));

            var selecting = it.getChildByName("Image_2_0_0");
            selecting.setVisible(false);


        }

        scrollview.setInnerContainerSize(cc.size(scrollviewSize.width,totalHeight));
        scrollview.jumpToTop();
    },

    touchCallback: function (sender,type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.removeFromParent(true);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    btnCallback: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var tag = sender.getTag();
            switch (tag) {
                case 11:
                    cc.log("更换 tag",this.selectingIconTag);
                    this.sendChangeHeadIconNetMessage(this.selectingIconTag);
                    this.removeFromParent(true);
                    break;
                case 12:
                    cc.log("取消");
                    this.removeFromParent(true);
                    break;
            }
        }
    },

    setChangeBtnEnable: function (button,visible) {
        if (button) {
            button.setBright(visible);
            button.setTouchEnabled(visible);
        }
    },

    itemTouchCallback: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        var tag = sender.getTag();
        cc.log("touch item index",tag);
        this.resetSelecting(tag);
        this.selectingIconTag = sender.userInfo;

        if(!this.changebtn.isTouchEnabled()) {
            this.setChangeBtnEnable(this.changebtn, true);
        }
    },

    resetSelecting: function (index) {
        for(var i = 0; i < this.itemMap.length; i++) {
            var s = this.itemMap[i].getChildByName("Image_2_0_0");
            if (index == i) {
                s.setVisible(true);
            }
            else {
                s.setVisible(false);
            }
        }
    },

    sendChangeHeadIconNetMessage: function (headicon) {
        var msg = new SocketBytes();
        msg.writeUint(201);//设置账号属性
        msg.writeUint(2);//2 头像
        msg.writeString(headicon);
        NetMgr.inst().send(msg);
    }
});