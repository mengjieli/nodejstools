/**
 * Created by Administrator on 2015/11/3.
 */



var MailModule = ModuleBase.extend({

    _ui: null,

    _mailScroll:null,       //邮件列表层
    _msgScroll:null,        //消息滚动层
    _itemScroll:null,       //物品滚动层
    _msgText:null,
    _select:null,           //选择控件
    _receiveBut:null,       //收取按钮

    _sliderBack:null,       //滚动条背景
    _slider:null,           //滚动条

    _allDelete:null,
    _allReceive:null,

    _mailItems:null,        //邮件列表
    _msgText:null,          //邮件内容
    _items:null,            //物品列表

    _readId:-1,             //当前正在看的邮件Id
    _selectIndex:-1,         //当前正在看的邮件控件索引

    _scrollAdapter:null,

    _emptyUI:null,
    ctor: function ()
    {
        this._super();
    },

    initUI: function ()
    {

        EventMgr.inst().addEventListener( MailEvent.SEND_ADD_MAIL, this.updateMailEvent, this );
        EventMgr.inst().addEventListener( MailEvent.SEND_READE_MAIL, this.updateMailEvent, this );
        EventMgr.inst().addEventListener( MailEvent.SEND_DELETE_MAIL, this.updateMailEvent, this );
        EventMgr.inst().addEventListener( MailEvent.SEND_RECEIVE_MAIL, this.updateMailEvent, this );
        EventMgr.inst().addEventListener( MailEvent.SEND_UPDATE_MAIL, this.updateMailEvent, this );

        this._itemUIs = [];

        this._ui = ccs.load("res/images/ui/mail/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        this._emptyUI = this._ui.getChildByName("controls").getChildByName("kong");
        this._emptyUI.setString( ResMgr.inst().getString("mail_9") );
        this._emptyUI.setVisible( false );
        this._mailScroll = this._ui.getChildByName("controls").getChildByName("ScrollView_1");
        //this._select = this._ui.getChildByName("controls").getChildByName("select");
        this._msgScroll = this._ui.getChildByName("controls").getChildByName("Panel_ordinary").getChildByName("ScrollView_2");
        this._itemScroll = this._ui.getChildByName("controls").getChildByName("Panel_ordinary").getChildByName("ScrollView_3");
        this._msgText = new MailTextControl("微软雅黑",cc.color(255,255,255),20, 496);
        this._msgScroll.addChild( this._msgText );
        this._receiveBut = this._ui.getChildByName("controls").getChildByName("Panel_ordinary").getChildByName("shouqu");
        this._receiveBut.addTouchEventListener( this.receiveCall, this );
        this._receiveBut.setTitleText( ResMgr.inst().getString("mail_7") );
        this._sliderBack = this._ui.getChildByName("controls").getChildByName("Panel_7");
        this._slider = this._ui.getChildByName("controls").getChildByName("Panel_7").getChildByName("Slider_2");

        this._allDelete = this._ui.getChildByName("controls").getChildByName("shanchu");
        this._allDelete.setTitleText( ResMgr.inst().getString("mail_4") );
        this._allReceive = this._ui.getChildByName("controls").getChildByName("shouqu");
        this._allReceive.setTitleText( ResMgr.inst().getString("mail_5") );
        this._allDelete.addTouchEventListener( this.allDeleteCall, this );
        this._allReceive.addTouchEventListener( this.allReceiveCall, this );

        var itemUI = this._ui.getChildByName("controls").getChildByName("item");
        var itemButText = itemUI.getChildByName("but").getChildByName("txt");
        itemButText.ignoreContentAdaptWithSize(true);
        itemButText.setString(ResMgr.inst().getString("mail_2"));

        var receiveText = this._ui.getChildByName("controls").getChildByName("Panel_ordinary").getChildByName("shoujianren0");
        receiveText.ignoreContentAdaptWithSize(true);
        receiveText.setString(ResMgr.inst().getString("mail_3"));

        var mailTitle = this._ui.getChildByName("controls").getChildByName("Panel_ordinary").getChildByName("zhuti0");
        mailTitle.ignoreContentAdaptWithSize(true);
        mailTitle.setString(ResMgr.inst().getString("mail_1"));

        var itemsUiTitle = this._ui.getChildByName("controls").getChildByName("Panel_ordinary").getChildByName("fujian");
        itemsUiTitle.ignoreContentAdaptWithSize(true);
        itemsUiTitle.setString(ResMgr.inst().getString("mail_6"));


        //适配
        var sc = 1/GameMgr.inst().scaleX;
        var minSc = GameMgr.inst().minScale;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * sc;

        var mailPanel = this._ui.getChildByName("controls");
        var size = mailPanel.getContentSize();
        size.height += down;
        mailPanel.setContentSize(size);

        var ui = mailPanel.getChildByName("ScrollView_1");
        var size = ui.getContentSize();
        size.height += down;
        ui.setContentSize(size);

        var ui = mailPanel.getChildByName("Panel_7");
        var size = ui.getContentSize();
        size.height += down;
        ui.setContentSize(size);

        var ui = mailPanel.getChildByName("Panel_7").getChildByName("Slider_2");
        var size = ui.getContentSize();
        size.width += down;
        ui.setContentSize(size);

        var ui = mailPanel.getChildByName("Image_1");
        var size = ui.getContentSize();
        size.height += down;
        ui.setContentSize(size);

        var ui = mailPanel.getChildByName("Image_2");
        var posY = ui.getPositionY();
        posY += down;
        ui.setPositionY(posY);

        var ui = mailPanel.getChildByName("Image_2_0");
        var posY = ui.getPositionY();
        posY += down;
        ui.setPositionY(posY);

        var ui = mailPanel.getChildByName("Panel_ordinary").getChildByName("shoujianren0");
        var posY = ui.getPositionY();
        posY += down;
        ui.setPositionY(posY);

        var ui = mailPanel.getChildByName("Panel_ordinary").getChildByName("shoujianren1");
        var posY = ui.getPositionY();
        posY += down;
        ui.setPositionY(posY);


        var ui = mailPanel.getChildByName("Panel_ordinary").getChildByName("zhuti0");
        var posY = ui.getPositionY();
        posY += down;
        ui.setPositionY(posY);

        var ui = mailPanel.getChildByName("Panel_ordinary").getChildByName("zhuti1");
        var posY = ui.getPositionY();
        posY += down;
        ui.setPositionY(posY);

        this._scrollAdapter = {};
        this._scrollAdapter["0"] =
        {
            back:cc.rect(414.06,215.99,510.00,274.00),
            scroll:cc.rect(420.35,224.38,496,258)
        }
        this._scrollAdapter["1"] =
        {
            back:cc.rect(414.06,84.99,510.00,405.00),
            scroll:cc.rect(420.35,96.38,496,387 )
        }

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

        this._mailScroll.addTouchEventListener( this.mailScrollTouchCall, this );
        this._mailScroll.addEventListener( this.mailScrollEventCall, this );

        this.createMailList();
        this.updateMailMsg( -1 );
    },

    destroy:function()
    {
        EventMgr.inst().removeEventListener( MailEvent.SEND_ADD_MAIL, this.updateMailEvent, this );
        EventMgr.inst().removeEventListener( MailEvent.SEND_READE_MAIL, this.updateMailEvent, this );
        EventMgr.inst().removeEventListener( MailEvent.SEND_DELETE_MAIL, this.updateMailEvent, this );
        EventMgr.inst().removeEventListener( MailEvent.SEND_RECEIVE_MAIL, this.updateMailEvent, this );
    },

    show:function( data )
    {

    },

    close:function()
    {

    },

    createMailList:function()
    {
        var itemUI = this._ui.getChildByName("controls").getChildByName("item");
        itemUI.setVisible( false );
        itemUI.setPropagateTouchEvents( true );
        this._mailScroll.removeAllChildren();

        var data = ModuleMgr.inst().getData("MailModule");
        if( data == null ) return;
        var dataList = data.getMails();
        this._mailItems = [];

        for( var key in dataList )
        {
            this.addMailItem( dataList[key] );
        }
        itemUI.setVisible( false );

        this._emptyUI.setVisible( this._mailItems.length <= 0 );
        this._allDelete.setTouchEnabled( this._mailItems.length > 0 );
        this._allDelete.setBright( this._mailItems.length > 0 );
        this._allReceive.setTouchEnabled( this._mailItems.length > 0 );
        this._allReceive.setBright( this._mailItems.length > 0 );

        this.updateMailScrollItemPos();
    },

    addMailItem:function( info )
    {
        var itemUI = this._ui.getChildByName("controls").getChildByName("item");
        itemUI.setVisible( false );

        var len = this._itemUIs.length;
        var itemH = itemUI.getContentSize().height;
        var h = len * itemH;
        var size = this._mailScroll.getContentSize();
        size.height = h > size.height ? h : size.height;

        var item = itemUI.clone();
        item.setPropagateTouchEvents( true );
        item.id = info.id;
        item.setVisible( true );
        this._mailItems.push( item );
        this._mailScroll.addChild( item );
        var select = item.getChildByName("select");
        select.setVisible( false );
        this.updateMailItemData( item, info );
        var ui = item.getChildByName("but");
        ui.id = info.id;
        //添加删除按钮事件
        ui.addTouchEventListener( this.itemButCall, this );
        //添加Item触摸事件
        item.addTouchEventListener( this.itemTouchCall, this );

    },

    updateMailItemData:function( item, info )
    {
        var data = info
        var ui = item.getChildByName("time");
        var t = (new Date()).getTime();
        var num = t - data.time;
        ui.ignoreContentAdaptWithSize(true);
        ui.setString( ResMgr.inst().getString("mail_0") + ":" + this.getTimeString(num) );
        ui = item.getChildByName("dian");
        ui.setVisible( !info.isRead );
        ui = item.getChildByName("zhuti");
        ui.setString( ResMgr.inst().getString("mail_1") + ":" + info.title );
        ui = item.getChildByName("fj");
        ui.setVisible( !info.isReceive );
    },

    resetSelect:function()
    {
        this._selectIndex = -1;
        this._readId = -1;
        this.updateMailMsg( this._readId, this._selectIndex  );
    },

    updateMailMsg:function( id, index )
    {

        if( this._selectIndex != undefined && this._selectIndex != -1 )
        {
            //还原位置
            var current = this._mailItems[this._selectIndex];
            this.reductionItemPos();
            var select = current.getChildByName("select");
            select.setVisible( false );
        }
        this._selectIndex = index;
        this._readId = id;
        var panel = this._ui.getChildByName("controls").getChildByName("Panel_ordinary");
        panel.setVisible( false );
        var itemUI = panel.getChildByName("item");
        itemUI.setVisible( false );

        var select = itemUI.getChildByName("select");

        var ui0 = this._ui.getChildByName("controls").getChildByName("Image_2");
        ui0.setVisible( false );
        var ui1 = this._ui.getChildByName("controls").getChildByName("Image_2_0");
        ui1.setVisible( false );
        var ui2 = this._ui.getChildByName("controls").getChildByName("Image_4");
        ui2.setVisible( false );

        if( id == -1 ) return;

        var msgRole = panel.getChildByName("shoujianren1");
        var msgTitle = panel.getChildByName("zhuti1");
        var itemsUiTitle = panel.getChildByName("fujian");
        var shouqu = panel.getChildByName("shouqu");

        var data = ModuleMgr.inst().getData("MailModule");
        if( data == null ) return;
        var dataInfo = data.getMail( id );
        if( dataInfo == null ) return;
        panel.setVisible( true );
        ui0.setVisible( true );
        ui1.setVisible( true );
        ui2.setVisible( true );

        msgRole.setString( dataInfo.roleName );
        msgTitle.setString( dataInfo.title );
        itemsUiTitle.setVisible( !dataInfo.isReceive );
        //var str = ResMgr.inst().getString( dataInfo.items.length > 0 ? "mail_7" : "mail_2");
        shouqu.setVisible( !dataInfo.isReceive );
        this._itemScroll.setVisible( !dataInfo.isReceive );
        this._itemScroll.removeAllChildren();
        var items = dataInfo.items;

        var len = items.length;
        var itemW = itemUI.getContentSize().width;
        itemW += 30;
        var h = len * itemW;
        var size = this._itemScroll.getContentSize();
        size.width = h > size.width ? h : size.width;
        for( var i=0; i<len; i++ )
        {
            var itemInfo = items[i];
            var ui = itemUI.clone();
            ui.setVisible(true);
            var con = ui.getChildByName("pj");          //品级
            con = ui.getChildByName("ico");             //ico
            con.loadTexture( ResMgr.inst().getIcoPath( itemInfo.id ) );
            con = ui.getChildByName("Text_8");          //数量
            con.ignoreContentAdaptWithSize(true);
            con.setString( itemInfo.num );
            con = ui.getChildByName("Text_9");          //名字、或是说明
            con.ignoreContentAdaptWithSize(true);
            con.setString( ResMgr.inst().getString( itemInfo.id + "0") );
            ui.setPosition( 50 + i * itemW, 50 );
            this._itemScroll.addChild( ui );
        }

        //this._itemScroll.setVisible( true );
        this._itemScroll.setInnerContainerSize( size );
        this._itemScroll.jumpToTopLeft();

        var mailItmeUI = this._mailItems[index];
        var select = mailItmeUI.getChildByName("select");
        select.setVisible( true );

        //适配
        var adapterType = !dataInfo.isReceive ? "0" : "1";
        var adapterData = this._scrollAdapter[adapterType];

        var sc = 1/GameMgr.inst().scaleX;
        var minSc = GameMgr.inst().minScale;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * sc;
        this._msgScroll.setPosition( adapterData.scroll.x, adapterData.scroll.y );
        this._msgScroll.setContentSize( adapterData.scroll.width, adapterData.scroll.height + down );
        var scrollBack = this._ui.getChildByName("controls").getChildByName("Image_4");
        scrollBack.setPosition( adapterData.back.x, adapterData.back.y );
        scrollBack.setContentSize( adapterData.back.width, adapterData.back.height + down );

        //设置邮件内容
        this._msgText.setText(dataInfo.msg);
        this._msgText.setPosition(0,0);
        var msgH = this._msgText.getHeight();
        var size = this._msgScroll.getContentSize();
        size.height = msgH > size.height ? msgH : size.height;
        this._msgScroll.setInnerContainerSize( size );
        this._msgText.setPosition( 0, size.height);

        //是否读过
        var isR = dataInfo.isRead;
        if( !isR )
        {
            data.ncReadMail( this._readId );
        }
    },

    reductionItemPos:function()
    {
        if( this._selectIndex != undefined && this._selectIndex != -1 )
        {
            //还原位置
            var current = this._mailItems[this._selectIndex];
            var pos = current.getPosition();
            if( pos.x != 0 )
            {
                current.stopAllActions();
                pos.x = 0;
                var ac = cc.moveTo(0.1, pos );
                current.runAction( ac );
            }
        }
    },

    getTimeString:function( ms )
    {
        ms = Math.round( ms/1000 );

        if( ms < 60 ) return "1" + ResMgr.inst().getString("public_minute") + ResMgr.inst().getString("mail_8");

        var d = 24*60*60;
        var h = 60*60;
        var f = 60;

        var timeStr = "";
        var timeType = "";
        if( ms > d )
        {
            timeStr = Math.floor(ms/d);
            timeType = ResMgr.inst().getString("public_day");
            ms = ms%d;
        }
        else if( ms > h )
        {
            timeStr = Math.floor( ms/h );
            timeType = ResMgr.inst().getString("public_time");

            ms =  ms%h;
        }
        else if( ms > f )
        {
            timeStr = Math.floor( ms/f );
            timeType = ResMgr.inst().getString("public_minute");
            ms =  ms%f;
        }
        var str = timeStr + timeType + ResMgr.inst().getString("mail_8");

        return str;
    },

    updateMailScrollItemPos:function()
    {

        var item0 = this._ui.getChildByName("controls").getChildByName("item");
        var scroll = this._mailScroll;
        var list = this._mailItems;

        var len  = list.length;
        var itemH = item0.getContentSize().height;
        itemH += 2;
        var h = len * itemH;
        var size = scroll.getContentSize();
        size.height = h > size.height ? h : size.height;
        for( var i =0; i<len; i++ )
        {
            var it = list[i];
            //如果it是当前选择的对象,
            if( it.index != undefined && it.index == this._selectIndex )
            {
                this._selectIndex = i;
            }
            it.index = i;
            it.setPosition( 0, (size.height - itemH) - i*itemH );
        }
        scroll.setInnerContainerSize( size );
        scroll.jumpToTop();
        //this.updateScroll(n);
    },

    updateSlider:function()
    {
        if( this._mailScroll == null || this._slider == null ) return;

        var panelH = this._mailScroll.getContentSize().height;
        var textH = this._mailScroll.getInnerContainerSize().height ;
        var pos = this._mailScroll.getInnerContainer().getPosition();

        if( textH<= panelH )
        {
            this._sliderBack.setVisible( false );
            this._sliderBack.setOpacity(0);
            return;
        }
        else
        {
            this._sliderBack.setVisible( true );
        }

        if( pos.y > 0 ) pos.y = 0;
        if( pos.y < (panelH - textH) ) pos.y = panelH - textH;
        var posY = Math.abs( pos.y );
        var p = 0;
        p = posY / ( textH - panelH );
        p = Math.round(p * 100);
        if (p < 0) p = 0;
        if (p > 100) p = 100;
        p = (100 - p);
        if( isNaN(p) ) p = 0;

        this._slider.setPercent( p );
    },

    updateMailEvent:function( event, id )
    {
        if( event == MailEvent.SEND_ADD_MAIL )
        {
            var data = ModuleMgr.inst().getData("MailModule");
            if( data == null ) return;
            var mail = data.getMail( id );
            if( mail == null ) return;
            this.addMailItem( mail );
        }
        else if( event == MailEvent.SEND_DELETE_MAIL )
        {
            for( var i in this._mailItems )
            {
                var item = this._mailItems[i];
                if( item.id == id )
                {
                    item.removeFromParent();
                    this._mailItems.splice( i, 1 );
                    break;
                }
            }
            //如果删除是当前看的ID。就重置
            if( id == this._readId )
            {
                this.resetSelect();
            }
        }
        else if( event == MailEvent.SEND_READE_MAIL || event == MailEvent.SEND_RECEIVE_MAIL || event == MailEvent.SEND_UPDATE_MAIL )
        {
            for( var i in this._mailItems )
            {
                var item = this._mailItems[i];
                if( item.id == id )
                {
                    var data = ModuleMgr.inst().getData("MailModule");
                    if( data == null ) return;
                    var mail = data.getMail( id );
                    if( mail == null ) return;
                    this.updateMailItemData( item, mail );
                    break;
                }
            }

            if( event == MailEvent.SEND_RECEIVE_MAIL || event == MailEvent.SEND_UPDATE_MAIL )
            {
                this.updateMailMsg( this._readId, this._selectIndex );
            }
        }

        this.updateMailScrollItemPos();
        this._emptyUI.setVisible( this._mailItems.length <= 0 );
        this._allDelete.setTouchEnabled( this._mailItems.length > 0 );
        this._allDelete.setBright( this._mailItems.length > 0 );
        this._allReceive.setTouchEnabled( this._mailItems.length > 0 );
        this._allReceive.setBright( this._mailItems.length > 0 );
    },

    _touchMovePos:null,
    itemTouchCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_BEGAN )
        {
            this.reductionItemPos();

            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }
        if( type == ccui.Widget.TOUCH_MOVED )
        {
            if( node.index != this._selectIndex ) return;
            var data = ModuleMgr.inst().getData("MailModule");
            var info = data.getMail( node.id );
            if( !info.isReceive ) return;
            var strPos = node.getTouchBeganPosition();
            var endPos = node.getTouchMovePosition();
            if( this._touchMovePos != null && ( Math.abs( strPos.x - endPos.x ) > 30 ))
            {
                var speedX = this._touchMovePos.x - endPos.x;
                var nodeX = node.getPositionX();
                nodeX -= speedX;
                if( nodeX < -87 ) nodeX = -87;
                if( nodeX > 0 ) nodeX = 0;
                node.setPositionX( nodeX );
            }
            this._touchMovePos = node.getTouchMovePosition();
        }

        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var starPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( Math.abs( starPos.x - endPos.x ) < 30 || Math.abs( starPos.y - endPos.y ) < 30 )
            {
                this.updateMailMsg( node.id, node.index );
            }
        }

        if( type == ccui.Widget.TOUCH_ENDED || type ==  ccui.Widget.TOUCH_CANCELED )
        {

            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,0);
            this._sliderBack.runAction( sc );

            var strPos = node.getTouchBeganPosition();
            var endPos = node.getTouchEndPosition();
            if( ( Math.abs( strPos.x - endPos.x ) < 30 ))
            {
                return;
            }
            var nodeX = node.getPositionX();
            if( nodeX == 0 ) return;
            if( nodeX < -30 )
            {
                node.stopAllActions();
                var pos = node.getPosition();
                pos.x = -87;
                var ac = cc.moveTo(0.1, pos );
                node.runAction( ac );
            }
            else
            {
                node.stopAllActions();
                var pos = node.getPosition();
                pos.x = 0;
                var ac = cc.moveTo(0.1, pos );
                node.runAction( ac );
            }

        }
    },

    itemButCall:function( node, type )
    {
        if( ccui.Widget.TOUCH_ENDED == type )
        {
            var data = ModuleMgr.inst().getData("MailModule");
            if( data == null ) return;
            data.ncDeleteMail( node.id );
        }
    },

    receiveCall:function( node, type )
    {
        if( ccui.Widget.TOUCH_ENDED == type )
        {
            var data = ModuleMgr.inst().getData("MailModule");
            if( data == null ) return;
            data.ncReceiveMail( this._readId );
        }
    },

    mailScrollTouchCall:function( node ,type )
    {
        if( ccui.Widget.TOUCH_BEGAN == type )
        {
            this.reductionItemPos();
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,255);
            this._sliderBack.runAction( sc );
        }
        if( type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED )
        {
            this._sliderBack.stopAllActions();
            var sc = cc.fadeTo(0.2,0);
            this._sliderBack.runAction( sc );
        }
    },

    mailScrollEventCall:function( node, type )
    {
        if( type ==  ccui.ScrollView.EVENT_SCROLLING || type == ccui.ScrollView.EVENT_BOUNCE_TOP || type == ccui.ScrollView.EVENT_BOUNCE_BOTTOM )
        {
            this.updateSlider();
        }
    },

    allDeleteCall:function( node ,type )
    {
        if( ccui.Widget.TOUCH_ENDED == type )
        {
            var value = ResMgr.inst().getString("mail_10");
            ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "okFun":this.deleteAllBackCall, "owner":this});
        }
    },

    deleteAllBackCall:function()
    {
        var data = ModuleMgr.inst().getData("MailModule");
        if( data == null ) return;
        data.ncDeleteMails();
    },

    allReceiveCall:function( node ,type )
    {
        if( ccui.Widget.TOUCH_ENDED == type )
        {
            var b = ModuleMgr.inst().getData("MailModule").isHaveAccessory();
            if( !b )
            {
                var value = ResMgr.inst().getString("mail_11");
                ModuleMgr.inst().openModule("AlertPanel", {"txt":value, type:"2", "okFun":this.receiveAllBackCall, "owner":this});
            }
            else
            {
                this.receiveAllBackCall();
            }
        }
    },

    receiveAllBackCall:function()
    {
        var data = ModuleMgr.inst().getData("MailModule");
        if( data == null ) return;
        data.ncReceiveMails();
    },

});