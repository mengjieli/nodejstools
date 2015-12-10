/**
 * created by ZhouYulong
 * 2015-10-15 mod by shenwei
 * 断线重连管理器
 */
var ReconnectionMgr = cc.Class.extend({

    loginState:0,//0正常流程	1断线重连(会恢复到现在状态) 2重新连接(只会把最新一条网络消息发送)
    state:null,//0登陆界面
    _waitData:null,//只保留最新一条未发送网络消息

    ctor:function()
    {
        NetMgr.inst().addEventListener(NetEvent.socket.SOCKET_CONNECT , this.socketConnectHandler, this);
        NetMgr.inst().addEventListener(NetEvent.socket.SOCKET_CLOSE , this.socketCloseHandler, this);
        NetMgr.inst().addEventListener(LoginingNetEvent.PES_LOGIN, this.transactionHandler, this);
    },

    //================对外===============
    //重新链接
    reConnection:function(data)
    {
        this.loginState = 2;
        ModuleMgr.inst().openModule("NetworkWaitModule",null,false);
        this._waitData = data;
        NetMgr.inst().connectWebSocket(GameConfig.serverAddress);
    },

    ncLoginEx:function (username, platform, token)
    {
        var msg = new SocketBytes();
        msg.writeUint(LoginingNetEvent.PEC_LOGIN);
        msg.writeUint(platform);
        msg.writeString(username);
        msg.writeString(token);
        NetMgr.inst().send(msg);
    },

    //================对内===============
    socketConnectHandler:function(cmd, data)
    {
        if(this.loginState == 1 || this.loginState == 2)
        {
            if(1 == SelfData.getInstance().platformId)
            {
            }
            else if(GameConfig.PLATFORM_DEFAULT_ID == SelfData.getInstance().platformId)
            {
                this.ncLoginEx(SelfData.getInstance().username.toString(), SelfData.getInstance().platformId, SelfData.getInstance().token.toString());
            }
        }
        else if(0 == this.loginState)
        {
            if(GameConfig.PLATFORM_DEFAULT_ID == SelfData.getInstance().platformId)
            {
            }
        }
    },

    socketCloseHandler:function(cmd, data)
    {
        cc.log("socket链接失败:");
        ModuleMgr.inst().openModule("AlertPanel",{txt:"与服务器断开链接,是否重新链接?",okFun:this.reConnctionHanlder,owner:this});
    },

    transactionHandler:function(cmd, data)
    {
        data.resetCMDData();
        switch(cmd)
        {
            case LoginingNetEvent.PES_LOGIN:// 账号登录
                if(this.loginState == 1)
                {
                    if(this.state == 3)
                    {
                        //登陆游戏后处理
                    }
                }
                else if(this.loginState == 2)
                {
                    NetMgr.inst().send(this._waitData);
                    if(this.state == 3)
                    {
                        //登陆游戏后处理
                    }
                    ModuleMgr.inst().closeModule("NetworkWaitModule");
                    this._waitData = null;
                }
                break;
            default:
                break;
        }
    },

    //断线重连
    reConnctionHanlder:function()
    {
        //之前有就清掉
        ModuleMgr.inst().closeModule("NetworkWaitModule");
        if(SelfData.getInstance().accountId != null)//帐号都没有登录，算不上断线重连，顶多算个断网
        {
            this.loginState = 1;
        }
        NetMgr.inst().connectWebSocket(GameConfig.serverAddress);
    },
})

ReconnectionMgr.instance = null;
ReconnectionMgr.getInstance = function()
{
    if(ReconnectionMgr.instance == null)
    {
        ReconnectionMgr.instance = new ReconnectionMgr();
    }

    return ReconnectionMgr.instance;
}