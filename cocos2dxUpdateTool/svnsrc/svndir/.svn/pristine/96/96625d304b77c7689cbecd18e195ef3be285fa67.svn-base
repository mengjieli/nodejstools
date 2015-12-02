/**
 * 本机系统接口2015-6-16 By ShenWei.
 */
var SysCall = cc.Class.extend({

    ctor : function ()
    {
        this._super();
    }
});

SysCall.WEB_PAGE_ID = -1;
SysCall.WEB_PAGE_DEFAULT_URL = "http://mcore.iscity.com.my/mju/api_gaming/login.php?merchant=M10001&appId=1&account=MY66902163&token=";

SysCall.loadLoginPage = function ()
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        SysCall.WEB_PAGE_ID = jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebViewHelper", "createWebView", "()I");
        if(0 > SysCall.WEB_PAGE_ID)
        {
            cc.error("create WebView failed");
            return;
        }

        var random = Math.random() * 1e16;
        SysCall.WEB_PAGE_DEFAULT_URL += random.toString();
        var scrn = cc.view.getFrameSize();
        jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebViewHelper", "setWebViewRect", "(IIIII)V", SysCall.WEB_PAGE_ID, 0, 0, scrn.width, scrn.height);
        jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebViewHelper", "setScalesPageToFit", "(IZ)V", SysCall.WEB_PAGE_ID, true);
        jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebViewHelper", "loadUrl", "(ILjava/lang/String;)V", SysCall.WEB_PAGE_ID, SysCall.WEB_PAGE_DEFAULT_URL);
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        //IOS
    }
};

SysCall.closeLoginPage = function ()
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        if(0 < SysCall.WEB_PAGE_ID)
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebViewHelper", "removeWebView", "(I)V", SysCall.WEB_PAGE_ID);
        }
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        //IOS
    }
};

SysCall.isNetworkAvailable = function()
{
    if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_OSX)
    {
        return true;
    }

    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isNetworkAvailable", "()Z");
    }
    else
    {
        return true;
    }
};

//键盘切换
SysCall.setCustomIMEMode = function(mode)
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        cc.error("键盘切换:" + mode);
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setCustomIMEMode", "(I)V", mode);
    }
    else
    {
        //IOS
    }
};

SysCall.closeCustomIMEMode = function()
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        cc.error("键盘关闭:");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "closeCustomIMEMode", "()V");
    }
    else
    {
        //IOS
    }
};

//默认振动间隔
SysCall.DEFAULT_VIBRATE_STEP = 1000;

//振动一次耗费毫秒数
SysCall.vibrateOneTime = function (time)
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        var exist = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isVibratorAvail", "()Z");
        if(true == exist)
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "vibrateOneTime", "(I)V", time);
        }
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        jsb.reflection.callStaticMethod("AppController", "vibrateOneTime");
    }
};

//振动一个周期
SysCall.vibrateWithStep = function (off1, on1, off2, on2, repeat)
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        var exist = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isVibratorAvail", "()Z");
        if(true == exist)
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "vibrateWithStep", "(IIIII)V", off1, on1, off2, on2, repeat);
        }
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        //iOS限制振动次数频率
    }
};

//取消振动
SysCall.vibrateOff = function ()
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        var exist = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isVibratorAvail", "()Z");
        if(true == exist)
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "vibrateOff", "()V");
        }
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        jsb.reflection.callStaticMethod("AppController", "vibrateOff");
    }
};


SysCall.openPublicPictures = function()
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        cc.error("打开相册:");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openPublicPictures", "()V");
    }
    else
    {
        //IOS
    }
};

SysCall.getCachedPictureLoadingPath = function()
{
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        cc.error("返回相册:");
        var ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getCachedPictureLoadingPath", "()Ljava/lang/String;");
        return ret;
    }
    else
    {
        //IOS
    }
};

//缩略头像
SysCall.getCacheDir = function()
{
    var cacheDir = "";
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        cacheDir = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAppInternalCacheDir", "()Ljava/lang/String;");
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {

    }
    return cacheDir;
};

SysCall.genThumbImageEx = function(imgPath, outPath, pxW, pxH, quality)
{
    var ret = false;
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/FileExplorerUtils", "genThumbImageEx", "(Ljava/lang/String;Ljava/lang/String;III)Z", imgPath, outPath, pxW, pxH, quality);
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {

    }
    return ret;
};

SysCall.genThumbImage = function(imgPath, outPath, pxW, pxH, needsDelete)
{
    var ret = false;
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/FileExplorerUtils", "genThumbImage", "(Ljava/lang/String;Ljava/lang/String;FFZ)Z", imgPath, outPath, pxW, pxH, needsDelete);
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
    }
    return ret;
};

SysCall.getPublicPicturePath = function()
{
    var accessPath = "";
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        accessPath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/FileExplorerUtils", "getPersonalPublicPicturePath", "()Ljava/lang/String;");
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
    }
    return accessPath;
};

SysCall.openFileDialog = function(accessPath)
{
    var files = "";
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        if(accessPath && "" != accessPath)
        {
            files = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/FileExplorerUtils", "loadPathStructure", "(Ljava/lang/String;)Ljava/lang/String;", accessPath);
        }
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {

    }
    return files;
};

//初始化录音
SysCall.initRecord = function()
{
    var amrPath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
    amrPath += "AudioRecord.amr";
    var wavPath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
    wavPath += "AudioRecord.wav";

    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/MediaRecorderUtils","init","(Ljava/lang/String;)V",amrPath);
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        jsb.reflection.callStaticMethod("MediaRecorderUtils","init:AndWavPath:",amrPath,wavPath);
    }
}

//开始录音
SysCall.startRecord = function()
{
    GameConfig.StopSound = true;
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/MediaRecorderUtils","startRecorder","()V");
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        jsb.reflection.callStaticMethod("MediaRecorderUtils","startRecord");
    }
};

//停止录音
SysCall.stopRecord = function(accountId)
{
    GameConfig.StopSound = false;
    var uploadPath = "http://" + GameConfig.serverIP + ":8389/texas/voice/put?accountId=" + accountId;
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/MediaRecorderUtils","stopRecorder","(Ljava/lang/String;)V",uploadPath);
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        jsb.reflection.callStaticMethod("MediaRecorderUtils","stopRecord:",uploadPath);
    }
};

//开始播放
SysCall.startPlay = function(accountId)
{
    GameConfig.StopSound = true;
    var downloadPath = "http://" + GameConfig.serverIP + ":8389/texas/voice/get?accountId=" + accountId;
    if(cc.sys.os == cc.sys.OS_ANDROID)
    {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/MediaRecorderUtils","startPlaying","(Ljava/lang/String;)V",downloadPath);
    }
    else if(cc.sys.os == cc.sys.OS_IOS)
    {
        jsb.reflection.callStaticMethod("MediaRecorderUtils","startPlay:",downloadPath);
    }
};

//停止播放
SysCall.stopPlay = function()
{
    GameConfig.StopSound = false;
    for(var a = 0; a < RecordEffects.RecordList.length; a++)
    {
        var obj = RecordEffects.RecordList[a];
        var seatId = obj.seatId;
        var voiceUrl = obj.voiceUrl;
        var duration = obj.duration;
        var player = ModuleMgr.inst().getData("GameMainData").getPlayerByChairId(seatId);
        player.startPlay(voiceUrl,duration);
        RecordEffects.RecordList.splice(a,1);
        break;
    }
};