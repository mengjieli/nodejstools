/**
 * Created by Administrator on 2015/10/8.
 */

PlayerEvent = {};
PlayerEvent.SEND_ADD_PLAYER = "send_add_player";
PlayerEvent.SEND_REMOVE_PLAYER = "send_remove_player";
PlayerEvent.SEND_ADD_OBJECT = "send_add_object";
PlayerEvent.SEND_REMOVE_OBJECT = "send_remove_object";

var PlayerData = DataBase.extend({

    _clientId:0,
    _players:null,                //玩家列表
    _playerTimes:null,            //玩家请求数据时间列表
    _objects:null,                //场景对象列表
    _objectTimes:null,            //场景对象请求数据时间表
    _clientObjects:null,          //客户端实例对象列表

    _towers:null,                  //城堡
    _immigrants:null,              //移民
    _troops:null,                  //部队

    ctor:function()
    {

    },

    init:function()
    {

    },

    /*
     * 客服端实例ID计数器
     */
    getClientID:function()
    {
        return this._clientId ++;
    },

    getFirstTower:function()
    {
        var obj = null;
        for( var key in this._towers )
        {
            obj = this._towers[key];
            break;
        }
        return obj;
    },

    getTower:function( id )
    {
        return this._towers[id];
    },

    getFirstImmigrant:function()
    {
        var obj = null;
        for( var key in this._immigrants )
        {
            obj = this._immigrants[key];
            break;
        }
        return obj;
    },

    getImmigrant:function( id )
    {
        return this._immigrants[id];
    },

    getTroop:function( id )
    {
        return this._troops[id];
    },


    /*
     * 获取对象
     */
    getPlayer:function( id )
    {
        if( id == undefined || id >= 0 || id == "" ) return null;

        var obj = this._players[id];

        if( obj )
        {
            var t = (new Date()).getTime();
            var time = this._playerTimes[id];
            if( t - time > 300000 )
            {
                this.ncGetObject( id );
            }
        }
        else
        {
            this.ncGetObject( id );
        }

        return obj;
    },

    /*
     * 获取对象
     */
    getObject:function( id )
    {
        if( id == undefined || id >= 0 || id == "" ) return null;

        var obj = this._objects[id];
        if( obj )
        {
            var t = (new Date()).getTime();
            var time = this._objectTimes[id];
            if( t - time > 300000 )
            {
                this.ncGetObject( id );
            }
        }
        else
        {
            this.ncGetObject( id );
        }

        return obj;
    },

    getClientObject:function( id )
    {
        var obj = null;

        if( this._clientObjects ) obj = this._clientObjects[id];

        return obj;
    },

    removeObject:function( id )
    {

    },

    removeClientObject:function( id )
    {

    },


    /*
     * 摄像机移动。跟新镜头
     * rect:视口大小
     */
    updateView:function( rect )
    {

    },


    /***************************************************************************
     * 网络消息
     ****************************************************************************/

    /*
     * 获取玩家信息
     */
    ncGetPlayer:function( id )
    {
        this._playerTimes[id] = (new Date()).getTime();
    },

    /*
     * 获取玩家信息
     */
    nsGetPlayer:function( cmd, msg )
    {
        var playerId = 0;
        EventMgr.inst().dispatchEvent( PlayerEvent.ACCEPT_ADD_PLAYER, playerId );
    },


    /*
     * 获取对象信息
     */
    ncGetObject:function( id )
    {
        this._objectTimes[id] = (new Date()).getTime();
    },

    /*
     * 获取对象信息
     */
    nsGetObject:function( cmd, id )
    {
        var objectId = 0;
        EventMgr.inst().dispatchEvent( PlayerEvent.ACCEPT_ADD_OBJECT, objectId );
    },

    nsAddObjects:function( cmd, msg )
    {

    },

    nsRemoveObjects:function( cmd, msg )
    {

    }

});