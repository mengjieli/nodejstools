/**
 * Created by cgMu on 2015/11/25.
 */

var SupplementLayer = cc.Node.extend({
    slider:null,
    percent:null,
    max:null,
    got:null,//默认max

    ctor: function () {
        this._super();

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var _root = ccs.load("res/images/ui/CorpsAssembled/supplementLayer.json","res/images/ui/").node;
        this.addChild(_root);

        var size = cc.director.getVisibleSize();
        _root.setContentSize(size);
        ccui.helper.doLayout(_root);

        var root = _root.getChildByName("Panel_1");
        this.sizeAutoLayout(root);
        this.posAutoLayout(root,0.5);

        var title = root.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("assembled_17"));

        var icon = root.getChildByName("gy_wupingkuang_01_5_0");
        //icon.setTexture();

        var total_counts = root.getChildByName("Text_7");
        total_counts.ignoreContentAdaptWithSize(true);
        total_counts.setString(100);
        this.max = 100;
        this.got = this.max;

        var name = root.getChildByName("Text_8");
        name.ignoreContentAdaptWithSize(true);
        //name.setString("");

        var closebtn = root.getChildByName("Button_1");
        closebtn.addTouchEventListener(this.closecallback,this);

        var confirm_btn = root.getChildByName("Button_2");
        confirm_btn.addTouchEventListener(this.confirmcallback,this);
        title = confirm_btn.getChildByName("Text_2");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("assembled_13"));

        var label1 = root.getChildByName("Text_9");
        label1.ignoreContentAdaptWithSize(true);
        label1.setString(ResMgr.inst().getString("assembled_12"));

        //数量
        var counts = root.getChildByName("Text_10");
        counts.ignoreContentAdaptWithSize(true);
        counts.setString(this.got+"/"+this.max);
        this.percent = counts;

        var slider = root.getChildByName("Slider_1");
        slider.addEventListener(this.sliderCall,this);
        slider.setPercent(100);
        this.slider = slider;

        var sub = root.getChildByName("Panel_2");
        sub.addTouchEventListener(this.subcallback,this);
        var add = root.getChildByName("Image_5_0");
        add.setTouchEnabled(true);
        add.addTouchEventListener(this.addcallback,this);
    },

    closecallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.removeFromParent(true);
    },

    confirmcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        cc.log("补充数量",this.got);
    },

    sliderCall: function (sender,type) {
        if( type == ccui.Slider.EVENT_PERCENT_CHANGED ) {
            var num = sender.getPercent();
            var counts = parseInt(this.max*num/100);
            this.got = counts;
            if(this.percent){
                this.percent.setString(this.got+"/"+this.max);
            }
        }
    },

    subcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.got--;
        if(this.got<0) this.got = 0;

        this.percent.setString(this.got+"/"+this.max);
        this.slider.setPercent(this.got / this.max * 100);
    },

    addcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.got++;
        if(this.got>this.max) this.got = this.max;

        this.percent.setString(this.got+"/"+this.max);
        this.slider.setPercent(this.got / this.max * 100);
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