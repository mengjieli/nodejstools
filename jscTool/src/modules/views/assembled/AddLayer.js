/**
 * Created by cgMu on 2015/11/25.
 */

var AddLayer = cc.Node.extend({
    scrol:null,
    item_root:null,

    item_selecting:null,
    selecting_tag:0,
    selecting_max:0,
    selecting_got:0,

    slider:null,
    percent:null,

    canUse:false,//标识主城内是否有部队

    ctor: function () {
       this._super();

        this.item_selecting = [];

       var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
       this.addChild(colorbg);

       var _root = ccs.load("res/images/ui/CorpsAssembled/addLayer.json","res/images/ui/").node;
       this.addChild(_root);

       var size = cc.director.getVisibleSize();
       _root.setContentSize(size);
       ccui.helper.doLayout(_root);

       var root = _root.getChildByName("Panel_1");
       this.sizeAutoLayout(root);
       this.posAutoLayout(root,0.5);

       var title = root.getChildByName("Text_1");
       title.ignoreContentAdaptWithSize(true);
       title.setString(ResMgr.inst().getString("assembled_11"));

        var closebtn = root.getChildByName("Button_1");
        closebtn.addTouchEventListener(this.closecallback,this);

        var Text_3 = root.getChildByName("Text_3");
        Text_3.setColor(cc.color(77,77,77));
        Text_3.ignoreContentAdaptWithSize(true);
        Text_3.setString(ResMgr.inst().getString("assembled_21"));

       //数量
       var counts = root.getChildByName("Text_10");
       counts.ignoreContentAdaptWithSize(true);
       //counts.setString("");
        this.percent = counts;

       var label1 = root.getChildByName("Text_9");
       label1.ignoreContentAdaptWithSize(true);
       label1.setString(ResMgr.inst().getString("assembled_12"));

       var button = root.getChildByName("Button_2");
       button.addTouchEventListener(this.btncallback,this);
       var btn_title = button.getChildByName("Text_2");
       btn_title.ignoreContentAdaptWithSize(true);
       btn_title.setString(ResMgr.inst().getString("assembled_13"));

       var slider = root.getChildByName("Slider_1");
       slider.addEventListener(this.sliderCall,this);
        this.slider = slider;

        var sub = root.getChildByName("Panel_2");
        sub.addTouchEventListener(this.subcallback,this);
        var subEx = root.getChildByName("Image_5");
        var add= root.getChildByName("Image_5_0");
        add.setTouchEnabled(true);
        add.addTouchEventListener(this.addcallback,this);

       var scrollview = root.getChildByName("ScrollView_1");
       this.scrol = scrollview;

        var item_root = scrollview.getChildByName("Image_11");
        item_root.setVisible(false);
        this.item_root = item_root;

        if(this.canUse){
            Text_3.setVisible(false);
            this.setScrollview();
        }
        else{
            Text_3.setVisible(true);
            scrollview.setVisible(false);
            slider.setVisible(false);
            sub.setVisible(false);
            add.setVisible(false);
            counts.setVisible(false);
            label1.setVisible(false);
            subEx.setVisible(false);
        }

    },

    setScrollview: function () {
        var size = this.scrol.getContentSize();
        var item_width = 68;
        var gap= 10;
        var counts = 10;
        var total_width = (gap+item_width)*counts+gap;
        if(total_width<size.width) {
            total_width = size.width;
        }
        this.scrol.setInnerContainerSize(cc.size(total_width,size.height));

        for(var i = 0;i<counts;i++) {
            var item = this.item_root.clone();
            item.setVisible(true);
            this.scrol.addChild(item);
            item.setPosition(cc.p(gap+item_width*0.5+(gap+item_width)*i,44));
            item.setTouchEnabled(true);
            item.setTag(i);
            item.addTouchEventListener(this.itemcallback,this);

            var selecting = item.getChildByName("Image_11_0_0");
            selecting.setVisible(false);
            this.item_selecting.push(selecting);
        }

        //初始化
        this.selecting_max = 100;
        this.selecting_got = this.selecting_max;

        this.resetSelectingItem(this.selecting_tag);
    },

    resetSelectingItem: function (tag) {
        for(var i in this.item_selecting) {
            if(tag == i) {
                this.item_selecting[i].setVisible(true);
            }
            else {
                this.item_selecting[i].setVisible(false);
            }
        }

        this.updateSlider();
    },

    btncallback: function (sender,type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        cc.log("添加部队数量：",this.selecting_got);
        if(this.canUse){

        }
        else{
            //没有可用部队
            this.removeFromParent(true);
        }
    },

    sliderCall: function (sender,type) {
        if( type == ccui.Slider.EVENT_PERCENT_CHANGED ) {
            var num = sender.getPercent();
            var counts = parseInt(this.selecting_max*num/100);
            this.selecting_got = counts;
            if(this.percent){
                this.percent.setString(this.selecting_got+"/"+this.selecting_max);
            }
        }
    },

    closecallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.removeFromParent(true);
    },

    itemcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        var tag = sender.getTag();
        if(tag == this.selecting_tag) return;
        this.selecting_tag=tag;
        this.selecting_max = 1000;
        this.selecting_got = this.selecting_max;
        this.resetSelectingItem(this.selecting_tag);
    },

    updateSlider: function () {
        if(this.slider && this.percent) {
            this.slider.setPercent(this.selecting_got/this.selecting_max*100);
            this.percent.setString(this.selecting_got+"/"+this.selecting_max);
        }
    },

    subcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.selecting_got--;
        if(this.selecting_got<0) this.selecting_got = 0;

        this.updateSlider();
    },

    addcallback: function (sender, type) {
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        this.selecting_got++;
        if(this.selecting_got>this.selecting_max) this.selecting_got = this.selecting_max;

        this.updateSlider();
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