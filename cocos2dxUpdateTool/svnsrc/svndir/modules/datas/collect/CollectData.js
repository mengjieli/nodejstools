/**
 * Created by Administrator on 2015/11/24.
 */



CollectEvent = {};
CollectEvent.SEND_NEW_ITEM = "send_collect_new_item";
CollectEvent.SEND_DELETE_ITEM = "send_collect_delete_item";
CollectEvent.SEND_UPDATE_ITEM = "send_collect_update_item";

CollectTab          = {};
CollectTab.resource = 0;
CollectTab.enemy    = 1;
CollectTab.friend   = 2;
CollectTab.other    = 3;

var CollectData = DataBase.extend({

    _itemList:null,  //item = { id:xx,type:xx,name:xx,pos:xx};
    _itemLength:null,

    _index:0,
    _maxNum:50,

    ctor:function()
    {
        this._super();

        this._itemList = [];
        this._itemLength= [];
        for( var i=0; i<4; i++ )
        {
            this._itemList[i] = {};
        }
        NetMgr.inst().addEventListener( 298, this.ncLoadInfoCall, this );
    },

    init:function()
    {

    },

    destroy:function()
    {

    },

    resetData:function()
    {
        this._itemList = null;
        if( this._itemList == null )
        {
            this._itemList = [];
            for(var i=0; i<4; i++)
            {
                this._itemList[i] = {};
            }
        }
        this.sendMsg();
    },

    getItemList:function( type )
    {
        if( this._itemList == null )
        {
            this._itemList = [];
            for(var i=0; i<4; i++)
            {
                this._itemList[i] = {};
            }
        }
        return this._itemList[type];
    },


    getListLenght:function( type )
    {
        return this._itemLength[type];
    },


    getItemInfo:function( type, id )
    {
        var info = null;
        if( type != null )
        {
            info = this._itemList[type][id];
            return info;
        }
        for (var i = 0; i < 4; i++)
        {
            var list = this._itemList[i];
            for( var key in list )
            {
                var item = list[key];
                if( item.id == id )
                {
                    info = item;
                    break;
                }
            }
        }
        return info;
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

    getTotal:function()
    {
        var n = 0;
        for (var i = 0; i < 4; i++)
        {
            var list = this._itemList[i];
            for( var key in list )
            {
                n++;
            }
        }
        return n;
    },

    isFull:function()
    {
        var n = this.getTotal();
        return n >= this._maxNum;
    },

    getIndex:function()
    {
        this._index ++;
        return this._index;
    },

    /**
     * 网络消息
     */

    ncAdd:function( name, typeId, pos )
    {
        var obj         = {};
        obj.id          = this.getIndex();
        obj.type        = typeId;
        obj.name        = name;
        obj.pos         = pos;
        var t           = this.getType( typeId );
        var list        = this.getItemList( t );
        list[obj.id]    = obj;

        this.sendMsg();
        EventMgr.inst().dispatchEvent( CollectEvent.SEND_NEW_ITEM, t, obj.id );
    },

    ncDelete:function( id )
    {
        cc.log( "删除" );
        var item = this.getItemInfo( null, id );
        if( item )
        {
            var t = this.getType( item.type );
            var list = this._itemList[t];
            delete list[id];
            this._itemLength[t] -= 1;
            EventMgr.inst().dispatchEvent( CollectEvent.SEND_DELETE_ITEM, t, id );
            this.sendMsg();
        }
    },

    ncUpdate:function( id, name, type )
    {
        //草你吗的模拟
        var item = this.getItemInfo( null, id );
        if( item )
        {
            item.name = name;
            item.type = type;
        }
        var t = this.getType( type );
        EventMgr.inst().dispatchEvent( CollectEvent.SEND_UPDATE_ITEM, t, id );
        this.sendMsg();
    },

    sendMsg:function()
    {
        var info        = {};
        info.index      = this._index;
        info.list       = this._itemList;
        var str         =  JSON.stringify(info);
        cc.log( str );
        var msg         = new SocketBytes();
        msg.writeUint(201);
        msg.writeUint(199);
        msg.writeString( str );
        NetMgr.inst().send( msg );
    },

    ncLoadInfoCall:function( cmd, msg )
    {
        msg.resetCMDData();
        var uid = msg.readString();
        var localityId = SelfData.getInstance().accountId;
        if( uid == localityId );
        {
            msg.readString();
            var len = msg.readUint();
            for( var i=0; i<len; i++ )
            {
                var key = msg.readUint();
                var str = msg.readString();
                if( key == 199 )
                {
                    var collectData = JSON.parse(str);
                    this._index = collectData.index;
                    this._itemList = collectData.list;
                }
            }
        }
    },


});