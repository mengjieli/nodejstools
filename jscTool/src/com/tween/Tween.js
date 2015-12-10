function Tween() { this.ctor.apply(this,arguments); };

Tween.prototype = 
{
	_info : null,
	_actions : null,
	_start : null,
	_time : null,
	ctor : function (display,time,parmas)
	{
		this._start = false;
		this._time = time;
		this._info = new TweenCallerInfo(display,parmas);
		var normal = {};
		if(display) display.addEventListener(Event.REMOVE,this.onRemoveFromStage,this);
		for(var key in parmas)
        {
			if(key == "x")
			{
				normal.x = {"from":display.getX(), "to":parmas[key]};
			}
			else if(key == "y")
			{
				normal.y = {"from":display.getY(), "to":parmas[key]};
			}
			else if(key == "scaleX")
			{
				normal.scaleX = {"from":display.getScaleX(), "to":parmas[key]};
			}
			else if(key == "scaleY")
			{
				normal.scaleY = {"from":display.getScaleY(), "to":parmas[key]};
			}
			else if(key == "rotation")
			{
				normal.rotation = {"from":display.getRotation(), "to":parmas[key]};
			}
			else if(key == "alpha")
			{
				normal.alpha = {"from":display.getAlpha(), "to":parmas[key]};
			}
			else if(key == "from")
			{
				if(!normal.number) normal.number = {};
				normal.number.from = parmas[key];
			}
			else if(key == "to")
			{
				if(!normal.number) normal.number = {};
				normal.number.to = parmas[key];
			}
			else if(key == "ease")
			{
				normal.ease = parmas[key];
			}
		}
		this.moveLine(normal);
		this.start();
	},
	moveLine : function (parmas)
	{
		this.addAction(new LineMove(this._info,this._time,parmas));
	},
	addAction : function (action)
	{
		if(!this._actions)
		{
			this._actions = new Array();
		}
		this._actions.push(action);
		action.addEventListener(Event.COMPLETE,this.onActionComplete,this);
	},
	onActionComplete : function (e)
	{
		e.currentTarget.removeEventListener(Event.COMPLETE,this.onActionComplete);
		for(var i = 0;i < this._actions.length;i++)
        {
			if(this._actions[i] == e.currentTarget)
			{
				this._actions.splice(i,1);
				break;
			}
		}
		if(this._actions.length == 0)
        {
            this.dispose();
        }
	},
	onRemoveFromStage : function (e)
	{
		this.dispose();
	},
	update : function (delate)
	{
		for(var i = 0;i < this._actions.length;i++)
        {
			this._actions[i].update(delate);
		}
	},
	start : function ()
	{
		if(!this._start)
		{
			EnterFrame.add(this.update,this);
		}
	},
	dispose : function ()
	{
		if(this._info != null)
		{
			EnterFrame.del(this.update,this);
			this._info = null;
		}
	}
};
Tween.to = function (display,time,parmas)
	{
		return new Tween(display,time,parmas);
	};
Tween.numberTo = function (time,parmas)
	{
		return new Tween(null,time,parmas);
	};
Tween.extend = extendClass;
