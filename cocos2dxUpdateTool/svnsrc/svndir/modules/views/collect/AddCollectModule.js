

/**
 *
 *
 * Created by Administrator on 2015/11/24.
 * 添加收藏夹
 *
 *
 * 使用说明
 * ModuleMgr.inst().openModule("AddCollectModule", { id:xx, pos:cc.p } );
 * id 为空，添加收藏
 * id 不为空 修改收藏
 * pos:必须不为空
 *
 *
 */



var AddCollectModule = ModuleBase.extend({

    _ui:null,

    _title:null,
    _pos:null,
    _textInput:null,
    _tabs:null,
    _selectTab:null,

    _id:null,
    _pos:null,
    _type:null,
    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {
        this._ui = ccs.load("res/images/ui/collect/Layer1.json","res/images/ui/").node;
        this.addChild( this._ui );

        var panel       = this._ui.getChildByName("Panel_2");
        var title       = panel.getChildByName("biaoti");
        var close       = panel.getChildByName("guanbi");
        var button      = panel.getChildByName("queren");
        var buttonText  = button.getChildByName("Text_4");
        var input       = panel.getChildByName("TextField_1");
        this._textInput = input;

        title.ignoreContentAdaptWithSize( true );
        title.setString(  ResMgr.inst().getString("collect_1") );
        buttonText.setString( ResMgr.inst().getString("public_ok") );
        close.addTouchEventListener( this.closeCall, this );
        button.addTouchEventListener( this.okCall, this );
        input.addEventListener( this.inputCall, this );

        this._tabs  = [];
        var ts      = [1401001,1401002,1401003,1401004];
        for( var i=0; i<4; i++ )
        {
            var itemPanel       = this._ui.getChildByName("Panel_2").getChildByName("item"+i);
            var txtName         = this._ui.getChildByName("Panel_2").getChildByName("Text_"+i);
            var ico             = itemPanel.getChildByName("ico");
            var select          = itemPanel.getChildByName("slect");
            ico.index           = i;
            itemPanel.type      = i;
            itemPanel.typeId    = ts[i];
            itemPanel.slect     = select;
            this._tabs.push(itemPanel);
            ico.loadTexture( ResMgr.inst().getIcoPath( ts[i]) );
            select.setVisible( false );
            txtName.ignoreContentAdaptWithSize(true);
            txtName.setString( ResMgr.inst().getItemName( ts[i] ) );
            itemPanel.addTouchEventListener( this.typeCall, this );
        }

        //适配
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );

    },

    destroy:function()
    {
    },

    /**
     * 如果Data为空 { id:xx, pos:cc.p)
     * id 为空，添加收藏
     * id 不为空  修改收藏
     */
    show:function( data )
    {
        this.id     = null;
        this._pos   = null;

        if( data == null )
        {
            ModuleMgr.init().closeModule("AddCollectModule");
            cc.error( "添加收藏。数据不能为空" );
            return;
        }

        this._id    = data.id ? data.id : null;
        this._pos   = data.pos;
        //this._type  = data.type;

        this.updateUI();
    },

    close:function()
    {

    },

    updateUI:function()
    {
        var posUI   = this._ui.getChildByName("Panel_2").getChildByName("Text_15");
        posUI.ignoreContentAdaptWithSize(true);
        var posStr  = ResMgr.inst().getString("collect_3") + ": " + "X: " +　this._pos.x + " Y: " + this._pos.y;
        posUI.setString( posStr );
        var info = null;
        var str = ResMgr.inst().getString("collect_4");
        do
        {
            if( this._id == undefined ) break;
            var data = ModuleMgr.inst().getData("CollectModule");
            if( data == null ) break;
            info = data.getItemInfo( null, this._id );
            if( info == null ) break;
            str = info.name;
        }
        while(false);
        this._textInput.ignoreContentAdaptWithSize(true);
        this._textInput.setPlaceHolder( str );
        if( info != null ) this._textInput.setString( str );

        var type = 0;
        if( info != null )
        {
            var typeId = info.type;
            cc.log(typeId);
            type = this.getType( typeId );
        }
        this.setSelectTab( type );
    },

    setSelectTab:function( type )
    {
        if( this._selectTab != null )
        {
            this._selectTab.slect.setVisible( false );
        }

        this._selectTab = null;
        var item = this._tabs[type];
        if( item == null ) return;
        this._selectTab = item;
        this._selectTab.slect.setVisible(true);
    },

    getType:function( id )
    {
        var dic = {};
        dic[1401001] = 0;
        dic[1401002] = 1;
        dic[1401003] = 2;
        dic[1401004] = 3;

        return dic[id];
    },

    getId:function( type )
    {
        var ts = [1401001,1401002,1401003,1401004];

        return ts[type];
    },

    /**
     *  控件回调
     *
     */

    closeCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            ModuleMgr.inst().closeModule("AddCollectModule");
        }
    },

    okCall:function( node,type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            var data = ModuleMgr.inst().getData("CollectModule");
            if( data == null ) return;
            var name = this._textInput.getString();
            var len = StringUtils.getStringLength( name );

            if( len <= 0 )
            {
                //字符为空
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("collect_5")});
                return;
            }
            if( len > 10 )
            {
                //字符长度超过10
                var ch = ResMgr.inst().getString("collect_6") + "10";
                ModuleMgr.inst().openModule("AlertString",{str:ch});
                return;
            }

            if( this._id && this._id != 0  )
            {
                //修改
                if( this._selectTab == null )
                {
                    cc.log("没有选择类型")
                    return;
                }
                data.ncUpdate( this._id, name, this._selectTab.typeId );
            }
            else
            {
                if( data.isFull() )
                {
                    var ch = ResMgr.inst().getString("collect_7");
                    ModuleMgr.inst().openModule("AlertString",{str:ch});
                }
                else
                {
                    //添加
                    data.ncAdd( name, this._selectTab.typeId, this._pos );
                }
            }
            ModuleMgr.inst().closeModule("AddCollectModule");
        }
    },

    inputCall:function( node,type )
    {
        if( type == ccui.TextField.EVENT_ATTACH_WITH_IME )
        {
            var str = "";
            do
            {
                if( this._id == undefined ) break;
                var data = ModuleMgr.inst().getData("CollectModule");
                if( data == null ) break;
                var info = data.getItemInfo( null, this._id );
                if( info == null ) break;
                str = info.name;
            }
            while(false);
            if( str != "" )this._textInput.setString( str );
        }
    },

    typeCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.setSelectTab( node.type );
        }
    },

});