/**
 * 文件名: ModuleBase.js
 * 创建时间: 2015/3/27- 14:41
 *
 * 功能说明:
 * 模块基类，所有模块都必需继承该类
 */
var ModuleBase = cc.Layer.extend({

	ctor:function()
	{
		this._super();
	},

	initUI:function()
	{
		return true;
	},

	destroy:function()
	{

	},

	show:function( data )
	{

	},

	close:function( )
	{

	},

	//移入
	moveIn:function(v)
	{
		var duration = (null == v || undefined == v) ? 0.4 : v;
		this.runAction(cc.Sequence(
			cc.moveTo(duration,this.lastP.x,this.lastP.y),
				cc.callFunc(this.moveInComplete,this))
		);
	},

	//移出
	//v----动作时间
	//v2---传递给完成回调的参数
	//v3---"UP"向上移除
	//	---"DOWN"向下移除
	moveOut:function(v, v2, v3)
	{
		var scaleX = cc.view.getScaleX();
		var scaleY = cc.view.getScaleY();
		var duration = (null == v || undefined == v) ? 0.4 : v;
		var offsetY = 0;
		//现在宽度,现在高度(计算了缩放后的大小)
		var nowWidht = this.scaleX * this.width * scaleX;
		var nowHeight = this.scaleY * this.height * scaleY;
		var anchorWidth = nowWidht * this.anchorX;
		var anchorHeight = nowHeight * this.anchorY;
		offsetY = v3 == "DOWN" ? (-1) * (AutoResizeUtils.frameSize.height + (nowHeight - anchorHeight)) / scaleY : (AutoResizeUtils.frameSize.height + (nowHeight - anchorHeight)) / scaleY;
		//offsetY = (AutoResizeUtils.frameSize.height + (nowHeight - anchorHeight)) / scaleY;
		this.runAction(cc.Sequence(
				cc.moveTo(duration,this.x,offsetY),
				cc.callFunc(this.moveOutComplete,this,v2))
			);
	},

	//移入完成
	moveInComplete:function(v)
	{

	},

	//移出完成
	moveOutComplete:function(v)
	{

	},

});