/*
 * 玩家账号
 * 2015-10-16 by shenwei
 */
var SelfData = cc.Class.extend({

	platformId : null, //登陆平台Id
	token : null, //登陆令牌
	accountId:"",//账号的唯一标识符
	nick:null,//自己的昵称
	sex:null,//性别
	headId : 0, //头像id
	signDays:0, //用户已签到天数

	userTmpPortraitPath : "",//头像临时文件
	isCustomPortraitCached : false,//有自定义头像

	ctor:function()
	{
		this.reset();
	},

	reset : function()
	{
		this.platformId =  1;
		this.token = "";
		this.accountId = "";
		this.nick = "";
        this.headId = 0;
		this.sex = SelfData.MAN;
		this.userTmpPortraitPath = "";
		this.isCustomPortraitCached = false;

	},

	logoff : function()
	{
		this.reset();
	}
});

SelfData.instance = null;
SelfData.getInstance = function ()
{
	if(SelfData.instance == null)
	{
		SelfData.instance = new SelfData();
	}
	return SelfData.instance;
}
//可选头像数,[0, MAX_AVAILABLE_PORTRAIT_NUM), 默认default
SelfData.MAX_AVAILABLE_PORTRAIT_NUM = 9;//注意改动
SelfData.MAN = 0;
SelfData.WOMAN = 1;
SelfData.UNKNOWN = -1;