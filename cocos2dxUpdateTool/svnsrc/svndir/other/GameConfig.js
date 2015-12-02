/**
 * 2015-10-16 by shenwei
 * 游戏配置
 */
var GameConfig = cc.Class.extend({

});

//TODO:目前数据读取ip取德州的，便于测试流程，实际登陆走派克ip
//外网  内网  intranet为true就是外网,false是内网
var intranet = false;
if(intranet) {
    GameConfig.serverIP = "54.254.152.163";
    GameConfig.serverIP_2 = "54.254.152.163";
    GameConfig.testHttpPort = ":13212/empery/data/";
} else {
    GameConfig.serverIP = "192.168.1.201";
    GameConfig.serverIP_2 = "192.168.1.201";
    GameConfig.testHttpPort = "";
}

//登陆地址
GameConfig.serverAddress = "ws://" + GameConfig.serverIP_2 + ":13211/empery";

//配置表地址
GameConfig.tableAddress = "http://" + GameConfig.serverIP + ":13212/empery/data/";

GameConfig.tableAddress_DEBUG = "http://" + GameConfig.serverIP + ":8388/texas/resources/";

//登陆-注册地址
//账号是否存在 : check
//注册 : create
//登陆 : login
//刷新令牌 : renewal
//忘记密码 : regain
GameConfig.PLATFORM_DEFAULT_ID = 7800;
GameConfig.PLATFORM_AUTHENTICATE_ADDR = "http://" + GameConfig.serverIP_2 + ":13206" + "/empery_gate_westwalk/account/"

GameConfig.UPLOAD_CUSTOM_PORTRAIT = "http://" + GameConfig.serverIP_2 + ":13206" + "/empery/avatar/put";
GameConfig.DOWNLOAD_CUSTOM_PORTRAIT = "http://" + GameConfig.serverIP_2 + ":13206" + "/empery/avatar/get";

//语言版本
GameConfig.Language = "JP";//中国CN 英文EN  日文JP

//某种情况下需要停止所有声音
GameConfig.StopSound = false;

//是否播放动画
GameConfig.isAnimation = true;

//人物模型路径
GameConfig.AvatarAddress = "res/avatar/";
