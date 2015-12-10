/**
 * Created by Administrator on 2015/11/13.
 */


FriendEvent = {}
FriendEvent.SEND_LOAD_FRIEND        = "send_friend_load_Friend";
FriendEvent.SEND_ADD_FRIEND         = "send_friend_add_Friend";
FriendEvent.SEND_DELETE_FRIEND      = "send_friend_delete_Friend";
FriendEvent.SEND_UPDATE_FRIEND      = "send_friend_update_Friend";
FriendEvent.SEND_UPDATE_SIGNATURE   = "send_friend_update_signature";
FriendEvent.SEND_UPDATE_APP_LIST    = "send_friend_update_app_list";
FriendEvent.ACCEPT_APPLY            = "accept_friend_apply";


var FriendData = DataBase.extend({

    _friends:null,
    _applyFriends:null,
    _addFriends:null,

    _friendsLength:0,
    _applyFriendsLength:0,
    _addFriendsLength:0,
    ctor:function()
    {
        this._super();
    },

    init:function()
    {
        this._friends               = {};
        this._applyFriends          = {};
        this._addFriends            = {};
        this._friendsLength         = 10;
        this._applyFriendsLength    = 10;
        this._addFriendsLength      = 10;

        for( var i=0; i<10; i++ )
        {
           var obj =
           {
               id:i,
               headId:1701003,
               name:"adfa",
               level:"55",
               fighting:552255,
               isApply:false,
               signature:"adsfasfdafdasfsfdsf"
           };

            if( i == 3 ) obj.headId = 1701001;
            if( i == 2 ) obj.isApply = true;

            this._friends[i] = obj;
            this._applyFriends[i] = obj;
            this._addFriends[i] = obj;
        }

        EventMgr.inst().addEventListener( FriendEvent.ACCEPT_APPLY, ncApply );
    },

    destroy:function()
    {

    },

    getFriendInfo:function( type, id )
    {
        var list = this.getFriendList( type );
        if( list == null ) return null;
        return list[id];
    },

    getFriendList:function( type )
    {
        var list = null;
        if( type == 0 ) list = this._friends;
        if( type == 1 ) list = this._applyFriends;
        if( type == 2 ) list = this._addFriends;
        return list;
    },

    getListLenght:function( type )
    {
        var list = 0;
        if( type == 0 ) list = this._friendsLength;
        if( type == 1 ) list = this._applyFriendsLength;
        if( type == 2 ) list = this._addFriendsLength;
        return list;
    },

    addFriend:function( type, info )
    {

    },

    deleteFriend:function( type, id )
    {

    },

    updateFriend:function( type, info )
    {

    },


    /**********************************************************************************************
     * 客服端消息
     **********************************************************************************************/

    /*
     * 加载列表
     */
    ncLoadFriends:function( type )
    {

    },

    /*
     * 同意好友
     */
    ncAllConsent:function( id )
    {

    },

    /*
     * 拒绝好友
     */
    ncAllRefuse:function( id )
    {

    },

    /*
     * 同意好友
     */
    ncConsent:function( id )
    {
        //模拟数据，以后删除
        delete this._addFriends[id];
        this._addFriendsLength --;
        EventMgr.inst().dispatchEvent( FriendEvent.SEND_DELETE_FRIEND, 2, id );
    },

    /*
     * 拒绝好友
     */
    ncRefuse:function( id )
    {
        //模拟数据，以后删除
        delete this._addFriends[id];
        this._addFriendsLength --;
        EventMgr.inst().dispatchEvent( FriendEvent.SEND_DELETE_FRIEND, 2, id );
    },

    /*
     * 申请
     */
    ncAllApply:function( id )
    {

    },

    /*
     * 申请
     */
    ncApply:function( id )
    {
        var info = this._applyFriends[id];
        info.isApply = true;
        EventMgr.inst().dispatchEvent( FriendEvent.SEND_UPDATE_FRIEND, 1, id );
    },

    /*
     * 查找
     */
    ncFind:function( id )
    {

    },

    /*
     * 刷新
     */
    ncRefresh:function( id )
    {

    },

    //删除
    ncDeleteFriend:function( id )
    {
        //模拟数据，以后删除
        delete this._friends[id];
        this._friendsLength --;
        EventMgr.inst().dispatchEvent( FriendEvent.SEND_DELETE_FRIEND, 0, id );
    },


    //修改签名
    ncModificationSignature:function()
    {

    },

    /**********************************************************************************************
     * 服务端消息
     **********************************************************************************************/

    /*
     * 加载列表
     */
    nsLoadFriends:function( cmd, data )
    {

    },

    /*
     * 同意好友
     */
    nsAllConsent:function( cmd, data )
    {

    },

    /*
     * 拒绝好友
     */
    nsAllRefuse:function( cmd, data )
    {

    },

    /*
     * 同意好友
     */
    nsConsent:function( cmd, data )
    {

    },

    /*
     * 拒绝好友
     */
    nsRefuse:function( cmd, data )
    {

    },

    /*
     * 申请
     */
    nsAllApply:function( cmd, data )
    {

    },

    /*
     * 申请
     */
    nsApply:function( cmd, data )
    {

    },

    /*
     * 查找
     */
    nsFind:function( cmd, data )
    {

    },

    /*
     * 刷新
     */
    nsRefresh:function( cmd, data )
    {

    },

    //删除
    nsDeleteFriend:function( cmd, data )
    {

    },


    nsModificationSignature:function( cmd, data )
    {

    },


});