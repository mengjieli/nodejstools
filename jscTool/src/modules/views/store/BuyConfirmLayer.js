/**
 * Created by cgMu on 2015/11/16.
 */

var BuyConfirmLayer = cc.Node.extend({
    shop_id:null,

   ctor: function (shopid,cost) {
       this._super();
       this.shop_id = shopid;

       var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
       this.addChild(colorbg);

       var root = ccs.load("res/images/ui/StoreModule/buyconfirmlayer.json","res/images/ui/").node;
       this.addChild(root);

       var size = cc.director.getVisibleSize();
       root.setContentSize(size);
       ccui.helper.doLayout(root);

       var Panel_1 = root.getChildByName("Panel_1");
       this.sizeAutoLayout(Panel_1);
       this.posAutoLayout(Panel_1,0.5);

       var closeButton = ccui.helper.seekWidgetByName(root, "Button_1");
       closeButton.addTouchEventListener(this.touchCallback,this);

       var title = ccui.helper.seekWidgetByName(root, "Text_1");
       title.ignoreContentAdaptWithSize(true);
       title.setString(ResMgr.inst().getString("store_4"));

       var label1 = ccui.helper.seekWidgetByName(root,"Text_4");
       label1.ignoreContentAdaptWithSize(true);
       label1.setString(ResMgr.inst().getString("store_5"));

       //消费道具icon
       var cost_icon = ccui.helper.seekWidgetByName(root,"Image_1");
       cost_icon.ignoreContentAdaptWithSize(true);

       var cost_label = ccui.helper.seekWidgetByName(root,"Text_5");
       cost_label.ignoreContentAdaptWithSize(true);
       cost_label.setString(cost);

       var label2 = ccui.helper.seekWidgetByName(root,"Text_6");
       label2.ignoreContentAdaptWithSize(true);
       label2.setString(ResMgr.inst().getString("store_6"));
       label2.setPositionX(cost_label.getPositionX()+cost_label.getContentSize().width+2);


       var btn1 = Panel_1.getChildByName("Button_2");
       btn1.addTouchEventListener(this.btnCallback1,this);

       var btntitle = btn1.getChildByName("Text_2");
       btntitle.ignoreContentAdaptWithSize(true);
       btntitle.setString(ResMgr.inst().getString("head_20"));

       var btn2 = Panel_1.getChildByName("Button_2_0");
       btn2.addTouchEventListener(this.btnCallback2,this);

       var btntitle2 = btn2.getChildByName("Text_2");
       btntitle2.ignoreContentAdaptWithSize(true);
       btntitle2.setString(ResMgr.inst().getString("head_12"));
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

    btnCallback1: function (sender, type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            if (this.shop_id) {
                var msg = new SocketBytes();
                msg.writeUint(502);//商店页面购买
                msg.writeUint(this.shop_id);//
                msg.writeUint(1);//默认购买一个
                NetMgr.inst().send(msg);
            }
            this.removeFromParent(true);
        }
    },

    btnCallback2: function (sender, type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            this.removeFromParent(true);
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