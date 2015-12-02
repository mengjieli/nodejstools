/**
 * Created by cgMu on 2015/10/27.
 */

var CollegeUI = cc.Node.extend({
    _ui:null,
    _id:0,
    _index:0,
    _level:0,
    ctor:function( id,index )
    {
        this._super();
        this._id = id;
        this._index = index;
        this._level = ModuleMgr.inst().getData("CastleModule").getNetBlock()[this._index]._building_level;

        var data =  ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("City_College");//ResMgr.inst().getJSON("City_College",null,true);
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
        labe2.setString( ResMgr.inst().getString("xiangqing_12") );
        //if (this._id == 19030010) {
        //    labe2.setString( ResMgr.inst().getString("xiangqing_12") );
        //}

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
        var counts = inde;
        var itemH = item0.getContentSize().height;
        var h = counts * itemH;
        h = h > size.height ? h : size.height;

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

            var data =  ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("City_College",i);///ResMgr.inst().getJSON("City_College",i,true);

            var text1 = it.getChildByName("Text_4");
            text1.ignoreContentAdaptWithSize(true);
            text1.setString( data.college_level );
            var text2 = it.getChildByName("Text_4_0");
            text2.ignoreContentAdaptWithSize(true);
            if (i == 1) {
                text2.setString( ResMgr.inst().getString("college_2") );
            }
            else {
                text2.setString( "——" );
            }
            var text3 = it.getChildByName("Text_4_0_0");
            text3.ignoreContentAdaptWithSize(true);
            text3.setString( data.prosperity );
        }


        size.height = h > size.height ? h : size.height;
        scrollview.setInnerContainerSize( size );
        scrollview.jumpToTop();
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
        var down = this._ui.getChildByName("gy_xiala_01_4_0");
        var up = this._ui.getChildByName("gy_xiala_01_4");

        var scrollSize = scrollview.getContentSize();
        var size = scrollview.getInnerContainerSize();
        var inner = scrollview.getInnerContainer();
        var pos = inner.getPosition();

        up.setVisible(false);
        down.setVisible( false );

        if (size.height <= scrollSize.height) {
            return;
        }

        if( pos.y >= 0 && size.height <= scrollSize.height )
        {
            up.setVisible( false );
        }
        else
        {
            up.setVisible( pos.y >= 0 ? false : true );
        }

        var endY = scrollSize.height - size.height;

        down.setVisible( pos.y <= endY ? false : true );
    }
});