/**
 * Created by cgMu on 2015/11/25.
 */

var DissolveLayer = cc.Node.extend({
    ctor: function () {
        this._super();

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var _root = ccs.load("res/images/ui/CorpsAssembled/dissolveLayer.json","res/images/ui/").node;
        this.addChild(_root);

        var size = cc.director.getVisibleSize();
        _root.setContentSize(size);
        ccui.helper.doLayout(_root);

        var root = _root.getChildByName("Panel_1");
        this.sizeAutoLayout(root);
        this.posAutoLayout(root,0.5);

        var title = root.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("assembled_14"));

        var closebtn = root.getChildByName("Button_1");
        closebtn.addTouchEventListener(this.closecallback,this);

        var detail = root.getChildByName("Text_10");
        detail.setString(ResMgr.inst().getString("assembled_15"));

        var confirm_btn = root.getChildByName("Button_2");
        confirm_btn.addTouchEventListener(this.confirmcallback,this);
        var title = confirm_btn.getChildByName("Text_2");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("assembled_13"));

        var cancel_btn = root.getChildByName("Button_2_0");
        cancel_btn.addTouchEventListener(this.cancelcallback,this);
        title = cancel_btn.getChildByName("Text_2");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("assembled_16"));
    },

    closecallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.removeFromParent(true);
    },

    confirmcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("castle_1"),color:null,time:null,pos:null});
    },

    cancelcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.removeFromParent(true);
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
    }
});