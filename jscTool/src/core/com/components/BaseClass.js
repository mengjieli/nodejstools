/*
 * Created by ZhouYuLong on 2015/5/4.
 * 继承此类事件是独有不是全局分发
 * 2015年5月4日 11:55:58
 */
var BaseClass = cc.Class.extend({
	
	_eventList:null,
	
	ctor:function()
	{
		this._eventList = [];
	},
	
	addEventListener:function(eventName,callBack,owner)
	{
		var obj = {};
		obj.eventName = eventName;
		obj.callBack = callBack;
		obj.owner = owner;
		this._eventList.push(obj);
	},
	
	removeEventListener:function(eventName,callBack)
	{
		for(var a = 0; a < this._eventList.length; a++)
		{
			var obj = this._eventList[a];
			if(obj.eventName == eventName && obj.callBack == callBack)
			{
				this._eventList.splice(a,1);
				obj = null;
			}
		}
	},
	
	dispatchEvent:function(eventName)
	{
		var args = [];
		for(var b = 0; b < arguments.length; b++)
		{
			if(b >= 1)
			{
				args.push(arguments[b]);
			}
		}

		for(var a = 0; a < this._eventList.length; a++)
		{
			var obj = this._eventList[a];
			if(obj.eventName == eventName)
			{
				obj.callBack.apply(obj.owner,args);
			}
		}
	
		args = null;
	},
	
	destroy:function()
	{
		if(this._eventList != null)
		{
			this._eventList.length = 0;
		}
		this._eventList = null;
	},
	
})