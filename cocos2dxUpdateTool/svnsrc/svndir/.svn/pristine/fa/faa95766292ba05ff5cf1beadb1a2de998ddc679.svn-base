/**
 * Created by ZhouYuLong on 2015/6/9.
 * 显示对象工具类
 */
var NodeUtils = cc.Class.extend({

});

NodeUtils.cacheDic = {};
NodeUtils.listenDic = {};

//设置所有子节点名称
NodeUtils.getUI = function(url)
{
    var node;
    if(NodeUtils.cacheDic[url] == null)
    {
        node = ccs.load(url).node;
        node.retain();
        NodeUtils.cacheDic[url] = node;
    }

    return NodeUtils.cacheDic[url];
}

NodeUtils.removeUI = function(url)
{
    var node = NodeUtils.cacheDic[url];
    if(node != null)
    {
        node.release();
        delete NodeUtils.cacheDic[url];
        if(cc.spriteFrameCache.getSpriteFrame(url) != null)
        {
            cc.spriteFrameCache.removeSpriteFramesFromFile(url);
        }
        //cc.loader.release(url);
        //cc.loader.releaseAll()
    }

    cc.error("当前资源缓存信息:" + cc.textureCache.getCachedTextureInfo());
    cc.textureCache.removeAllTextures();
    cc.error("当前资源缓存信息:" + cc.textureCache.getCachedTextureInfo());
}

//设置所有子节点名称
NodeUtils.setChildFontName = function(node)
{
    for(var a = 0; a < node.childrenCount; a++)
    {
        NodeUtils.setFontName(node.getChildren()[a]);
    }
}

//设置字体名称
NodeUtils.setFontName = function(tf)
{
    if(tf.constructor.name == "Text" || tf.constructor.name == "TextField")
    {
        tf.setFontName(NodeUtils.getFontName());
    }
    else if(tf.constructor.name == "Button")
    {
        tf.setTitleFontName(NodeUtils.getFontName());
    }
}

//获取字体名称
NodeUtils.getFontName = function()
{
    var str = "res/fonts/EmabeFont.ttf";
    return str;
}

//设置所有子节点字体名称
NodeUtils.setAllChildFont = function(node)
{
    NodeUtils.setFontName(node);
    for(var a = 0; a < node.childrenCount; a++)
    {
        NodeUtils.setAllChildFont(node.getChildren()[a]);
    }
}

//桌外默认滑动条音效
NodeUtils.playDefaultScrollBarSoundEffect = function ()
{
    Sound.playSound(DZSoundConfig.HUA);
}

//播放按钮声音特效
NodeUtils.playButtonSoundEffect = function()
{
    Sound.playSound(SoundConfig.BUTTON);
}

/**
 * 监听点击空白关闭(记得移除)
 * @key              键值
 * @target          添加空白监听目标对象
 * @callBack        点击空白回调
 * @owner           传this
 * @params          参数
 * @unthrough       禁止穿透对象(解决cocos2d穿透的BUG)
 */
NodeUtils.listenerBlankClose = function(key,target,callBack,owner,params,unthrough)
{
    function closeHandler(node,type)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            if(unthrough != null)
            {
                if(unthrough.hitTest(node.getTouchEndPosition()) == true)
                {
                    cc.error("解决cocos2d穿透的BUG生效!");
                    return;
                }
            }
            NodeUtils.removeBlankClose(key);
            if(callBack != null)
            {
                if(Tools.isArray(params) == true)
                {
                    callBack.apply(owner,params);
                }
                else
                {
                    callBack.apply(owner,[params]);
                }
            }

            closeHandler = null;
            callBack = null;
            owner = null;
            node = null;
        }
    }

    if(NodeUtils.listenDic[key] == null)
    {
        var scaleX = cc.view.getScaleX();
        var scaleY = cc.view.getScaleY();
        var _scaleX = scaleX < 1 ? (1 / scaleX) : 1;
        var _scaleY = scaleY < 1 ? (1 / scaleY) : 1;
        var lp = target.parent.convertToNodeSpace(cc.p(0,0));

        var layout = new ccui.Layout();
        layout.setSwallowTouches(true);
        layout.setTouchEnabled(true);
        layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        layout.setBackGroundColor(cc.color(150,200,255));
        layout.setBackGroundColorOpacity(0);
        target.parent.addChild(layout,-1);
        layout.width = AutoResizeUtils.frameSize.width * _scaleX;
        layout.height = AutoResizeUtils.frameSize.height * _scaleY;
        layout.x = lp.x;
        layout.y = lp.y;
        layout.addTouchEventListener(closeHandler);

        NodeUtils.listenDic[key] = layout;
    }
    else
    {
        cc.error("重复监听");
    }
}

//移除点击空白关闭(记得移除)
NodeUtils.removeBlankClose = function(key)
{
    var node = NodeUtils.listenDic[key];
    if(node != null)
    {
        delete NodeUtils.listenDic[key];
        node.removeFromParent();
    }

    node = null;
}

