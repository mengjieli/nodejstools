function TweenCallerInfo() { this.ctor.apply(this,arguments); };

TweenCallerInfo.prototype = 
{
	_display : null,
	_backOwner : null,
	_completeBack : null,
	_completeParmas : null,
	_changeBack : null,
	_changeBackParmas : null,
	ctor : function (display,parmas)
	{
		this._display = display;
		for(var key in parmas)
        {
			if(key == "onComplete")
            {
                this._completeBack = parmas[key];
            }
			if(key == "onCompleteParmas")
            {
                this._completeParmas = parmas[key];
            }
			if(key == "onUpdate")
            {
                this._changeBack = parmas[key];
            }
			if(key == "onUpdateParmas")
            {
                this._changeBackParmas = parmas[key];
            }
			if(key == "owner")
            {
                this._backOwner = parmas[key];
            }
		}
		if(this._backOwner == null)
        {
            this._backOwner = display;
        }
	}
};
TweenCallerInfo.extend = extendClass;
