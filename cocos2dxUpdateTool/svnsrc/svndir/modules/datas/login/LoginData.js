/*
 *　登录模块
 */
var LoginData = DataBase.extend({
	
	ctor:function()
	{
		this._super();
	},

	init:function()
	{
		//NetMgr.inst().addEventListener( ProtoclId.DZSLogin , this.transactionHandler, this);
	},

	transactionHandler:function(cmd, data)
	{
		data.resetCMDData();
		switch(cmd)
		{
			case ProtoclId.DZSLogin:// 账号登录
				this.loginSuccessCallBack(cmd, data);
				break;
		}
	},

	/*
	 * 登录成功
	 */
	loginSuccessCallBack:function( cmd, data )
	{
		SelfData.getInstance().accountId = data.readUint();

		ModuleMgr.inst().closeModule("Login",false);
		ModuleMgr.inst().getData("ChoosePlatform");
		ModuleMgr.inst().openModule("ChoosePlatform",null,false);
		EventMgr.inst().dispatchEvent( "role_login_success" );
	},

	destroy:function()
	{
		NetMgr.inst().removeEventListener( ProtoclId.DZSLogin , this.transactionHandler, this);
	},
});