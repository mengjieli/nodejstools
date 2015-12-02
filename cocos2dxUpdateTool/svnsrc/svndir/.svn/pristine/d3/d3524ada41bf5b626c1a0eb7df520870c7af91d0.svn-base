/**
 * Created by cgMu on 2015/10/27.
 */

//id:19030010 学院
// 19070010 城墙
// 19080010 箭塔
var TheWallUI = cc.Node.extend({
    _ui:null,
    _id:0,
    _index:0,
    _level:0,
    ctor:function( id,index )
    {
        this._super();
        this._id = id;
        this._index = index;

        //获取当前城墙的等级
        this._level =ModuleMgr.inst().getData("CastleModule").getNetBlock()[this._index]._building_level;
        //获取配置
        var data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("City_Wall");//ResMgr.inst().getJSON("City_Wall",null,true);//
        var inde = 0;
        for(var i in data) {
            inde++;
        }

        this._ui = ccs.load("res/images/ui/TheWall/Wall_Particulars_Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        var size1 = cc.director.getVisibleSize();
        this._ui.setContentSize( size1 );
        ccui.helper.doLayout( this._ui );

        //适配
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        //cc.log("&&&&&&", down);

        var gy_xiangqing_shanglan_01_2 = this._ui.getChildByName("gy_xiangqing_shanglan_01_2");
        var posY = gy_xiangqing_shanglan_01_2.getPositionY();
        posY += down;
        gy_xiangqing_shanglan_01_2.setPositionY( posY );

        var gy_xiala_01_4_0 = this._ui.getChildByName("gy_xiala_01_4_0");
        var posY = gy_xiala_01_4_0.getPositionY();
        posY += down;
        gy_xiala_01_4_0.setPositionY( posY );

        var labe1 = this._ui.getChildByName("Text_1");
        var posY = labe1.getPositionY();
        posY += down;
        labe1.setPositionY( posY );
        labe1.ignoreContentAdaptWithSize( true );
        labe1.setString( ResMgr.inst().getString("xiangqing_1") );

        var labe2 = this._ui.getChildByName("Text_1_0");
        var posY = labe2.getPositionY();
        posY += down;
        labe2.setPositionY( posY );
        labe2.ignoreContentAdaptWithSize( true );
        labe2.setString( ResMgr.inst().getString("xiangqing_11") );
        //if (this._id == 19030010) {
        //    labe2.setString( ResMgr.inst().getString("xiangqing_12") );
        //}

        var data_length = inde;//ResMgr.inst().getCSVLength("City_Wall");
        //cc.log("length ", data_length);

        var labe3 = this._ui.getChildByName("Text_1_1");
        var posY = labe3.getPositionY();
        posY += down;
        labe3.setPositionY( posY );
        labe3.ignoreContentAdaptWithSize( true );
        labe3.setString( ResMgr.inst().getString("xiangqing_10") );

        var scrollview = this._ui.getChildByName("ScrollView_1");
        var size = scrollview.getContentSize();
        size.height += down;
        scrollview.setContentSize( size );
        var item0 = scrollview.getChildByName("Panel_1");
        item0.setVisible(false);

        var size = scrollview.getContentSize();
        var counts = data_length;
        var itemH = item0.getContentSize().height;
        var h = counts * itemH;
        h = h > size.height ? h : size.height;

        var delt = size.height - h;
        var number = parseInt(size.height / itemH);
        //cc.log("视图高 ",size.height,"内容高 ",h,"视图显示item个数 ",number);

        for( var i=1; i<=counts ; i++ )
        {
            var it = item0.clone();
            scrollview.addChild( it );
            it.setVisible(true);
            it.setPosition( 0,h - i*itemH );

            if( i % 2 == 0 )
            {
                var b = it.getChildByName("Image_1");
                b.loadTexture("gy_xiangqing_xialan_di_01.png", ccui.Widget.PLIST_TEXTURE);
            }

            var select = it.getChildByName("Image_1_0");
            select.setVisible(false);
            if(i == this._level) {
                select.setVisible(true);
            }

            var data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_Wall",i); //ResMgr.inst().getJSON("City_Wall",i,true);

            var text1 = it.getChildByName("Text_4");
            text1.ignoreContentAdaptWithSize(true);
            text1.setString( data.wall_level );
            var text2 = it.getChildByName("Text_4_0");
            text2.setString( data.troops );
            text2.ignoreContentAdaptWithSize(true);
            var text3 = it.getChildByName("Text_4_0_0");
            text3.setString( data.prosperity );
            text3.ignoreContentAdaptWithSize(true);
        }

        size.height = h > size.height ? h : size.height;
        scrollview.setInnerContainerSize( size );

        //if (this._level>= data_length-number) {
        //    this.runAction(cc.Sequence(cc.DelayTime(0.001),cc.CallFunc(function () {
        //        scrollview.jumpToBottom();
        //    })));
        //}
        //else {
        //    this.runAction(cc.Sequence(cc.DelayTime(0.001),cc.CallFunc(function (sender) {
        //        var size = scrollview.getContentSize();
        //        var percent = (sender._level-1)*itemH / (h- size.height) * 100;
        //        scrollview.jumpToPercentVertical(percent)
        //    })));
        //}
        this.updateScrollviewSelecting(scrollview,data_length,itemH,this._level);

        var contain = scrollview.getInnerContainer();
        var pos = contain.getPosition();

        this.updateScroll();
        scrollview.addEventListener(this.scrollCall, this );
    },

    scrollCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING )
        {
            this.updateScroll();
        }
    },

    updateScroll:function() {
        var scrollview = this._ui.getChildByName("ScrollView_1");
        var arrow_up = this._ui.getChildByName("gy_xiala_01_4_0");//上
        var arrow_down = this._ui.getChildByName("gy_xiala_01_4");//下

        var scrollSize = scrollview.getContentSize();
        var size = scrollview.getInnerContainerSize();
        var inner = scrollview.getInnerContainer();
        var pos = inner.getPosition();

        arrow_up.setVisible(false);
        arrow_down.setVisible( false );

        if (size.height <= scrollSize.height) {
            return;
        }

        var endY = scrollSize.height - size.height;

        if(pos.y >= endY) {
            arrow_up.setVisible( true );
        }
        if(pos.y <= 0) {
            arrow_down.setVisible( true );
        }
    },

    updateScrollviewSelecting: function (scrollview, length,itemH,selecting) {
        var size = scrollview.getContentSize();
        var h = scrollview.getInnerContainerSize().height;
        var number = parseInt(size.height / itemH);
        if (selecting>= length-number) {
            this.runAction(cc.Sequence(cc.DelayTime(0.001),cc.CallFunc(function () {
                scrollview.jumpToBottom();
            })));
        }
        else {
            this.runAction(cc.Sequence(cc.DelayTime(0.001),cc.CallFunc(function (sender) {
                //var size = scrollview.getContentSize();
                var percent = (selecting-1)*itemH / (h- size.height) * 100;
                scrollview.jumpToPercentVertical(percent)
            })));
        }
    }
});