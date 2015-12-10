function ColorTransform() { this.ctor.apply(this,arguments); };

ColorTransform.prototype = 
{
	_save : [],
	alphaMultiplier : null,
	ctor : function ()
	{
		this._save = [];
	},
	save : function ()
	{
		this._save.push(this.alphaMultiplier);
	},
	restore : function ()
	{
		this.alphaMultiplier = this._save.pop();
	}
};
ColorTransform.extend = extendClass;
