function Matrix() { this.ctor.apply(this,arguments); };

Matrix.prototype = 
{
	a : 1,
	b : 0,
	c : 0,
	d : 1,
	tx : 0,
	ty : 0,
	_saves : new Array,
	_last : 0,
	ctor : function ()
	{
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
		this._saves = new Array;
		this._last = 0;
	},
	save : function ()
	{
		this._saves.push([this.a,this.b,this.c,this.d,this.tx,this.ty]);
	},
	identity : function ()
	{
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
	},
	setTo : function (aa,bb,cc,dd,txx,tyy)
	{
		this.a = aa;
		this.b = bb;
		this.c = cc;
		this.d = dd;
		this.tx = txx;
		this.ty = tyy;
	},
	translate : function (x,y)
	{
		this.tx += x;
		this.ty += y;
	},
	rotate : function (angle)
	{
		Matrix.sin = Math.sin(angle);
		Matrix.cos = Math.cos(angle);
		this.setTo(this.a * Matrix.cos - this.c * Matrix.sin,this.a * Matrix.sin + this.c * Matrix.cos,this.b * Matrix.cos - this.d * Matrix.sin,this.b * Matrix.sin + this.d * Matrix.cos,this.tx * Matrix.cos - this.ty * Matrix.sin,this.tx * Matrix.sin + this.ty * Matrix.cos);
	},
	scale : function (sx,sy)
	{
		this.a = sx;
		this.d = sy;
		this.tx *= this.a;
		this.ty *= this.d;
	},
	prependTranslation : function (tx,ty)
	{
		this.tx += this.a * tx + this.c * ty;
		this.ty += this.b * tx + this.d * ty;
	},
	prependScale : function (sx,sy)
	{
		this.setTo(this.a * sx,this.b * sx,this.c * sy,this.d * sy,this.tx,this.ty);
	},
	prependRotation : function (angle)
	{
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		this.setTo(this.a * cos + this.c * sin,this.b * cos + this.d * sin,this.c * cos - this.a * sin,this.d * cos - this.b * sin,this.tx,this.ty);
	},
	prependSkew : function (skewX,skewY)
	{
		var sinX = Math.sin(skewX);
		var cosX = Math.cos(skewX);
		var sinY = Math.sin(skewY);
		var cosY = Math.cos(skewY);
		this.setTo(this.a * cosY + this.c * sinY,this.b * cosY + this.d * sinY,this.c * cosX - this.a * sinX,this.d * cosX - this.b * sinX,this.tx,this.ty);
	},
	getDeformation : function ()
	{
		if(this.a != 1 || this.b != 0 || this.c != 0 || this.d != 1) return true;
		return false;
	}
};
Matrix.sin;
Matrix.cos;
Matrix.extend = extendClass;
