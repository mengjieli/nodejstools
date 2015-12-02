/*
 * 公用提示框
 * 2015年5月4日 11:55:58
 */
var AlertPanelModule = ModuleBase.extend({

	panel:null,
	_yesBT:null,
	_noBT:null,
	_closeBT:null,
	_txt:null,
	_data:null,
	_yesP:null,
	_noP:null,

	_txtP : null,

	ctor:function()
	{
		this._super();
	},

	initUI:function()
	{
		this.panel = NodeUtils.getUI("res/AlertPanel/MainScene.json");
		this.addChild(this.panel);

		this._yesBT = this.panel.getChildByName("Panel_2").getChildByName("Button_1");
		this._noBT = this.panel.getChildByName("Panel_2").getChildByName("Button_2");
		this._closeBT = this.panel.getChildByName("Panel_2").getChildByName("Button_3");
		this._txt = this.panel.getChildByName("Panel_2").getChildByName("Text_1");

		NodeUtils.setFontName(this._txt);
		this._txt.setVisible(true);
		this._txt.setContentSize(cc.size(325, 75));

		this._yesBT.addTouchEventListener(this.clickHandler,this);
		this._noBT.addTouchEventListener(this.clickHandler,this);
		this._closeBT.addTouchEventListener(this.clickHandler,this);

		this._closeBT.loadTextures("res/AlertPanel/up.png","res/AlertPanel/down.png","res/AlertPanel/up.png",ccui.Widget.LOCAL_TEXTURE);
		this._closeBT.ignoreContentAdaptWithSize(true);

		AutoResizeUtils.resetNode(this._yesBT);
		AutoResizeUtils.resetNode(this._noBT);
		AutoResizeUtils.resetNode(this._txt);
		this._yesP = this._yesBT.getPosition();
		this._noP = this._noBT.getPosition();
		this._txtP = this._txt.getPosition();

		AutoResizeUtils.setCenter(this.panel.getChildByName("Panel_2"));
	},

	clickHandler:function(node,type)
	{
		if(ccui.Widget.TOUCH_ENDED == type)
		{
			switch(node)
			{
				case this._yesBT:
					if(this._data.okFun != null && this._data.okFun != undefined)
					{
						this._data.okFun.apply(this._data.owner,[this._data.params]);
					}
					this.closeHandler();
					break;
				case this._noBT:
					if(this._data.noFun != null && this._data.noFun != undefined)
					{
						this._data.noFun.apply(this._data.owner,[this._data.params]);
					}
					this.closeHandler();
					break;
				case this._closeBT:
					this.closeHandler();
					break;
			}
		}
	},

	closeHandler:function()
	{
		ModuleMgr.inst().closeModule("AlertPanel");
	},

	destroy:function()
	{
		this._super();
		NodeUtils.removeBlankClose("AlertPanel面板提示");

		this.panel = null
		this._yesBT = null;
		this._noBT =  null;
		this._closeBT = null;
		this._data = null;
		this._txt = null;
		this._yesP = null;
		this._noP = null;
		this._txtP = null;
	},

	/**
	 * 显示提示框
	 * @data   data.txt 提示内容	type 1(默认 确定 取消) 2确定 data.owner传this data.okFun点击Yes回调 data.noFun点击No回调	data.params回调参数
	 */
	show:function( data,isPlay)
	{
		this._data = data;

		this._txt.setString(this._data.txt);
		this._txt.setPosition(this._txtP);
		this._txt.setVisible(true);
		if(data.type == undefined || data.type == null || data.type == 1)
		{
			this._yesBT.setPosition(this._yesP);
			this._noBT.setPosition(this._noP);
			this._noBT.visible = true;
		}
		else if(data.type == 2)
		{
			this._yesBT.x = 478;
			this._noBT.visible = false;
		}

		//此处的调用基类，传入参数与其它模块不同
		this._super(data, isPlay);
		NodeUtils.listenerBlankClose("AlertPanel面板提示",this.panel.getChildByName("Panel_2").getChildByName("Image_1"),this.closeHandler,this);
	},

	close:function()
	{
		this._super(true);
	}
});