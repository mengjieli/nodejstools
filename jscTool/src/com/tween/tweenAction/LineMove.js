var LineMove = TweenActionBase.extend({
	_parmas : null,
	ctor : function (info,time,parmas)
	{
		this._super(info,time);
		this._parmas = parmas;
	},
	update : function (delate)
	{
		this._time += delate;
		if(this._time > this._allTime) this._time = this._allTime;
		var change;
		var isNumber;
		var param;
		for(var key in this._parmas)
        {
			if(key == "ease") continue;
			if(this._parmas.ease)
			{
				var v;
				if(this._parmas.ease == Ease.EASE_OUT)
				{
					v = (this._parmas[key].to - this._parmas[key].from) * 2 / this._allTime;
					change = this._parmas[key].from + v * this._time - v * this._time * this._time / (2 * this._allTime);
				}
			}
			else
            {
                change = this._parmas[key].from + (this._parmas[key].to - this._parmas[key].from) * this._time / this._allTime;
            }
			if(key == "x")
			{
				this._caller._display.setX(change);
			}
			else if(key == "y")
			{
				this._caller._display.setY(change);
			}
			else if(key == "scaleX")
			{
				this._caller._display.setScaleX(change);
			}
			else if(key == "scaleY")
			{
				this._caller._display.setScaleY(change);
			}
			else if(key == "rotation")
			{
				this._caller._display.setRotation(change);
			}
			else if(key == "alpha")
			{
				this._caller._display.setAlpha(change);
			}
			else if(key == "number")
			{
				isNumber = true;
				param = [change];
			}
		}
		if(this._caller._changeBack != null)
		{
			if(isNumber)
			{
				if(this._caller._changeBackParmas)
				{
					for(var i = 0;i < this._caller._changeBackParmas.length;i++)
                    {
						param.push(this._caller._changeBackParmas[i]);
					}
				}
				this._caller._changeBack.apply(this._caller._backOwner,param);
			}
			else
            {
                this._caller._changeBack.apply(this._caller._backOwner,this._caller._changeBackParmas);
            }
		}
		if(this._time == this._allTime)
		{
            this.dispatchEvent(new Event(Event.COMPLETE));
			if(this._caller._completeBack != null)
            {
                this._caller._completeBack.apply(this._caller._backOwner,this._caller._completeParmas);
            }
			this._caller = null;
		}
	}
});
LineMove.extend = extendClass;
