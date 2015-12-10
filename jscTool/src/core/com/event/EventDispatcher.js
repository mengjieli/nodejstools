/**
 *
 * 文件名: EventDispatcher.js
 * 创建时间: 2015/3/26- 20:54
 *
 * 功能说明:
 * 事件容器，异步处理事件
 */


 var EventDispatcher = cc.Class.extend( {

    _eventDic:null,
    _eventList:null,

    ctor:function()
    {
        this._eventDic = {};
        this._eventList = [];
        cc.director.getScheduler().scheduleUpdateForTarget( this, 0, false );

    },

    destroy : function()
    {
        cc.director.getScheduler().unscheduleUpdateForTarget( this );
    },

    addEventListener:function( eventName, eventFun, obj )
    {
        //找出事件列表，没有就创建
        var list = this._eventDic[eventName];
        if( list == null )
        {
            this._eventDic[eventName] = [];
            list = this._eventDic[eventName];
        }
        //判断有没有重复注册
        for( var i in list )
        {
            var item = list[i];
            if( item.fun == eventFun && item.obj == obj )
            {
                cc.log("重复注册" + eventName);
                return;
            }
        }
        list.push( { fun:eventFun, obj:obj } );
    },

    removeEventListener : function( eventName, eventFun, obj )
    {
        var list = this._eventDic[eventName];
        if( list == null ) return;

        for ( var i in list )
        {
            var item = list[i];
            if( item.fun == eventFun && item.obj == obj )
            {
                list.splice( i,1 );
            }
            item = null;
        }
        if( list.length <= 0 )
        {
            delete this._eventDic[eventName];
            list = null;
        }
    },

     /*
     * 重置事件列表
     */
    resetEventList : function()
    {
        this._eventDic = null;
        this._eventList = null;
        this._eventDic = {};
        this._eventList = [];
    },


    /*
     * 处理事件
     * eventName ：事件key
     * ...事件参数，不定长
     */
    dispatchEvent : function( eventName )
    {
        if( arguments.length == 0 ) return;
        this._eventList.push( arguments );
    },


    dispenseEvent : function ( event )
    {
        var eventName = event[0];

        var list = this._eventDic[eventName];

        if( list == null ) return;

        for ( var i in list )
        {
            var item = list[i];
            item.fun.apply( item.obj, event );
        }
    },

    update : function ( )
    {
        if( this._eventList.length <= 0 )
        {
            return;
        }

        var event = this._eventList.shift();
        this.dispenseEvent( event );
    }

});
