/**
 * Created by zhouyulong on 2015/5/25.
 */
var EnterFrame = cc.Class.extend({


});
EnterFrame.enterFrames;
EnterFrame.curTime;

EnterFrame.init = function ()
{
	if(EnterFrame.enterFrames == null)//可以理解为初始化
	{
		EnterFrame.enterFrames = new Dictionary();
		EnterFrame.curTime = 0;
	}
};

EnterFrame.add = function (key,call,owner)
{
	if(EnterFrame.enterFrames.hasKey(key) == false)
	{
		EnterFrame.enterFrames.push(key , {call:call,owner:owner,params:arguments});
	}
	if(EnterFrame.enterFrames.length > 0 && Boolean(cc.director.getScheduler().isTargetPaused(this)) == true)
	{
		cc.error("定时器开始:");
		cc.director.getScheduler().scheduleCallbackForTarget(this,EnterFrame.update,0,cc.REPEAT_FOREVER);
	}
};

EnterFrame.del = function (key)
{
	if(EnterFrame.enterFrames.hasKey(key) == true)
	{
		EnterFrame.enterFrames.remove(key);
	}
	if(EnterFrame.enterFrames.length <= 0)
	{
		cc.error("定时器停止:");
		cc.director.getScheduler().unscheduleCallbackForTarget(this,EnterFrame.update);
	}
};

EnterFrame.update = function (delate)
{
	if(EnterFrame.enterFrames.length <= 0)
	{
		return;
	}

	var copy = EnterFrame.enterFrames.list;

	for(var key in copy)
	{
		var obj = copy[key];
		obj.call.apply(obj.owner,[delate,obj.params]);
	}
};
