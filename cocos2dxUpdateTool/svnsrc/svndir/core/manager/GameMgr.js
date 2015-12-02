/**
 * Created by Administrator on 2015/10/8.
 */


var GameMgr = function()
{
    var _event = null;
    //登录服务器地址
    this.serverIP = "172.16.5.26";
    //是否停止声音
    this.stopSound = false;

    //设计尺寸
    this.designResolutionSize = null;
    //缩放后设计尺寸
    this.scaleViewSize = null;
    //窗口尺寸
    this.frameSize = null;
    //显示尺寸
    this.viewSize = null;

    //缩放因子
    this.scaleX = 1;
    this.scaleY = 1;

    this.maxScale = 1.0;
    this.minScale = 1.0;


    this.init = function()
    {
        this.serverIP = "172.16.5.26";
        //是否停止声音
        this.stopSound = false;

        //缩放因子
        this.scaleX = cc.view.getScaleX();
        this.scaleY = cc.view.getScaleY();
        //设计尺寸
        this.designResolutionSize = cc.size(960,640);
        //缩放后设计尺寸
        this.scaleViewSize = cc.size( Math.round(this.scaleX * this.designResolutionSize.width), Math.round(this.scaleY * this.designResolutionSize.height ));
        //窗口尺寸
        this.frameSize = cc.view.getFrameSize();
        //显示尺寸
        this.viewSize = cc.view.getVisibleSize();

        this.maxScale = this.getMaxAndMinScale( true );
        this.minScale = this.getMaxAndMinScale();
    }

    this.getMaxAndMinScale = function( isMax )
    {
        var scX = this.frameSize.width / this.designResolutionSize.width;
        var scY = this.frameSize.height / this.designResolutionSize.height;
        var v = 1.0;
        if( isMax )
        {
            v = Math.max( scX, scY );
        }
        else
        {
            v = Math.min( scX, scY );
        }
        return v;
    }

    var startGameEvent = function( event,auto )
    {
        var num = cc.textureCache.getCachedTextureInfo();
        //cc.log( "图片缓存：" + num);
        //cc.error("********",auto);
        new Game(auto);
    }

    var gameOverEvent = function( event )
    {
        ModuleMgr.inst().destroy();
        EventMgr.inst().destroy();
        NetMgr.inst().destroy();
        ResMgr.inst().destroy();
    }

    _event = new EventDispatcher();
    _event.addEventListener("startGame", startGameEvent, this );
    _event.addEventListener("gameOver", gameOverEvent, this );

    this.startGame = function(auto)
    {
        _event.dispatchEvent("startGame",auto);
    }

    this.gameOver = function()
    {
        _event.dispatchEvent("gameOver");
    }

    this.init();
}

GameMgr.instance = null;
GameMgr.inst = function ()
{
    if ( GameMgr.instance == null )
    {
        GameMgr.instance = new GameMgr ();
    }
    return GameMgr.instance;
}