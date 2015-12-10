var TweenActionBase = EventDispatcher.extend({
	_caller : null,
	_time : null,
	_allTime : null,
	ctor : function (info,time)
	{
		this._super();
		this._caller = info;
		this._time = 0;
		this._allTime = time;
	},
	update : function (delate)
	{
	}
});
TweenActionBase.extend = extendClass;
