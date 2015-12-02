/*
 * 登录面板
 * 2015年5月4日 11:55:58
 */
var LoginModule = ModuleBase.extend({

	_ui:null,

	ctor:function()
	{
		this._super();
	},

	initUI:function()
	{
		this._ui = NodeUtils.getUI("res/LoginPanel/MainScene.json");
		this.addChild(this._ui);

		this._ui.getChildByName("Button_1").addTouchEventListener(this.clickHandler, this);
		this._ui.getChildByName("Button_2").addTouchEventListener(this.clickHandler, this);
		this._ui.getChildByName("Button_3").addTouchEventListener(this.clickHandler, this);


		var me = this;

		if(cc.sys.os == cc.sys.OS_ANDROID)
		{
			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
				onKeyReleased: function(keyCode, event)
				{
					if (keyCode == cc.KEY.back)
					{
						var value = ResMgr.inst().getString("denglu_41");

						ModuleMgr.inst().openModule("AlertPanel",{txt:value,okFun:me.exitGameHandler,owner:me});
					}
				}}, this);
		}

		AutoResizeUtils.fullScreen(this._ui.getChildByName("Image_2"),true);
		AutoResizeUtils.setCenter(this._ui.getChildByName("Image_3"));
		AutoResizeUtils.relativelyPostion(this._ui.getChildByName("Button_1"));
		AutoResizeUtils.relativelyPostion(this._ui.getChildByName("Button_2"));
		AutoResizeUtils.relativelyPostion(this._ui.getChildByName("Button_3"));
	},

	destroy:function()
	{
		this._super();

		this._ui = null;
		NodeUtils.removeUI("res/LoginPanel/MainScene.json");
	},

	show:function( data,isPlay)
	{
		this._super(data,isPlay);
	},

	close:function(isPlay)
	{
		this._super(isPlay);
	},

	createUI:function()
	{

	},

	//注册回调
	registerChange:function( node, type )
	{
		if( ccui.Widget.TOUCH_ENDED == type )
		{
			cc.log("注册");
		}
	},

	//登录成功服务端返回消息回调
	loginSuccess:function( eventName )
	{

	},

	loginHandler:function()
	{

	},

	exitGameHandler:function()
	{
		cc.error("关闭游戏");
		cc.director.end();
	},

	clickHandler:function(target,type)
	{
		if(type == ccui.Widget.TOUCH_ENDED)
		{
			switch(target)
			{
				case this._ui.getChildByName("Button_1")://微信好友
					break;
				case this._ui.getChildByName("Button_2")://QQ好友
					break;
				case this._ui.getChildByName("Button_3")://来宾身份
				break;
			}
		}
	},
});
