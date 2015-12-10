
/*
 * 事件管理器
 * 处理模块与模块之间的逻辑层的消息
 * 通过 EventMgr.inst() 来访问
 */

var EventMgr = function()
{
    var _event = null;
    function init()
    {
        _event = new EventDispatcher();
    }

    this.destroy = function()
    {
        EventMgr.instance = null;
    }

    this.addEventListener = function( eventName , eventFun , obj )
    {
        _event.addEventListener( eventName, eventFun, obj );
    }


    this.removeEventListener = function ( eventName , eventFun , obj )
    {
        _event.removeEventListener( eventName, eventFun, obj );
    }

    this.dispatchEvent = function( eventName )
    {
        _event.dispatchEvent.apply( _event, arguments );
    }

    init();
}

EventMgr.instance = null;
EventMgr.inst =  function()
{
	if( EventMgr.instance == null )
	{
		EventMgr.instance = new EventMgr();
	}
	return EventMgr.instance;
}