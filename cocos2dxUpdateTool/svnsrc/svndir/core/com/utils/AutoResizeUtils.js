/**
 * Created by zhouyulong on 2015/5/26.
 * 自适应工具类
 *
 * 注意事项
 * 1.相对布局，绝对布局注意目标锚点
 * 2.居中对齐注意父容器高度宽度
 */
var AutoResizeUtils = cc.Class.extend({

});

//自适应相关值
AutoResizeUtils.DESIGN_WIDTH = 960;//设计尺寸宽
AutoResizeUtils.DESIGN_HEIGHT = 640;//设计尺寸高
AutoResizeUtils.frameSize//当前尺寸
AutoResizeUtils.widthScale//宽度缩放因子
AutoResizeUtils.heightScale//高度缩放因子
AutoResizeUtils.minScale//最小缩放尺寸
AutoResizeUtils.maxScale//最大缩放尺寸

//对齐方式
AutoResizeUtils.UP = "up";//上
AutoResizeUtils.DOWN = "down";//下
AutoResizeUtils.LEFT = "left";//左
AutoResizeUtils.RIGHT = "right";//右
AutoResizeUtils.LEFT_UP = "left_up";//左上
AutoResizeUtils.LEFT_DOWN = "left_down";//左下
AutoResizeUtils.RIGHT_UP = "right_up";//右上
AutoResizeUtils.RIGHT_DOWN = "right_down";//右下


AutoResizeUtils.init = function()
{
    AutoResizeUtils.frameSize = cc.view.getFrameSize();
    AutoResizeUtils.widthScale = AutoResizeUtils.frameSize.width / AutoResizeUtils.DESIGN_WIDTH;
    AutoResizeUtils.heightScale = AutoResizeUtils.frameSize.height / AutoResizeUtils.DESIGN_HEIGHT;
    AutoResizeUtils.minScale = Math.min(AutoResizeUtils.widthScale,AutoResizeUtils.heightScale);
    AutoResizeUtils.maxScale = Math.max(AutoResizeUtils.widthScale,AutoResizeUtils.heightScale);
}

//====================对外===================

/**
 * 拉伸
 * @node         显示对象
 * @stretchType 拉伸类型 1左右拉伸 2上下拉伸 3铺满全屏(默认) 4按宽度缩放 5按高度缩放
 * @isCenter    是否居中
 * @type        居中类型1上下居中  2左右居中 3默认(上，下，左，右居中) 4保持现状
 */
AutoResizeUtils.stretch = function(node,stretchType,isCenter,type)
{
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();

    //先求出缩放后大小，然后再用当然屏幕尺寸求出该缩放多少

    if(stretchType == 3 || stretchType == undefined || stretchType == null)
    {
        node.setScaleX(AutoResizeUtils.frameSize.width / (node.width * scaleX));
        node.setScaleY(AutoResizeUtils.frameSize.height / (node.height * scaleY));
    }
    else if(stretchType == 1)
    {
        node.setScaleX(AutoResizeUtils.frameSize.width / (node.width * scaleX));
    }
    else if(stretchType == 2)
    {
        node.setScaleY(AutoResizeUtils.frameSize.height / (node.height * scaleY));
    }
    else if(stretchType == 4)
    {
        node.setScale(AutoResizeUtils.frameSize.width / (node.width * scaleX));
    }
    else if(stretchType == 5)
    {
        node.setScale(AutoResizeUtils.frameSize.height / (node.height * scaleY));
    }

    if(isCenter == true)
    {
        AutoResizeUtils.setCenter(node,type);
    }
}

/**
 * 设置居中
 * @node        目标对象
 * @type        居中类型1上下居中  2左右居中 3默认(上，下，左，右居中) 4保持现状
 * @target      相对于哪个对象居中(默认或不传是窗口)
 */
AutoResizeUtils.setCenter = function(node,type,target)
{
    if(type == undefined || type == null || type == 3)
    {
        node.setPosition(AutoResizeUtils.getCenterP(node,target));
    }
    else if(type == 1)
    {
        AutoResizeUtils.verticalCenter(node);
    }
    else if(type == 2)
    {
        AutoResizeUtils.horizontalCenter(node);
    }
}

/**
 * 绝对位置
 * @node        目标对象
 * @align       对齐方式   AutoResizeUtils.UP AutoResizeUtils.DOWN.....
 * @type        居中类型1上下居中  2左右居中 3默认(上，下，左，右居中) 4保持现状
 * @distance    各种对齐保持距离
 */
AutoResizeUtils.absolutelyPosition = function(node,align,type,distance)
{
    //系统缩放因子
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();
    var offsetX;
    var offsetY;
    var lp;
    if(distance == null || distance == undefined)
    {
        distance = 0;
    }

    var size = AutoResizeUtils.getRealySize(node);
    var anchorWidth = size.width * node.anchorX;
    var anchorHeight = size.height * node.anchorY;

    switch(align)
    {
        case AutoResizeUtils.UP:
            distance = distance / scaleY;
            offsetX = AutoResizeUtils.resetNode(node).x;
            offsetY = (AutoResizeUtils.frameSize.height - (size.height - anchorHeight)) / scaleY;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX,offsetY - distance));
            node.y = lp.y;
            break;
        case AutoResizeUtils.DOWN:
            distance = distance / scaleY;
            offsetX = node.x;
            offsetY = (node.anchorY * node.height * scaleY) / scaleY;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX,offsetY + distance));
            node.y = lp.y;
            break;
        case AutoResizeUtils.LEFT:
            distance = distance / scaleX;
            offsetX = ((node.anchorX * node.width * scaleX)) / scaleX;
            offsetY = AutoResizeUtils.resetNode(node).y;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX + distance,offsetY));
            node.x = lp.x;
            break;
        case AutoResizeUtils.RIGHT:
            distance = distance / scaleX;
            offsetX = (AutoResizeUtils.frameSize.width - (size.width - anchorWidth)) / scaleX;
            offsetY = node.y;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX - distance,offsetY));
            node.x = lp.x;
            break;
        case AutoResizeUtils.LEFT_UP:
            offsetX = ((node.anchorX * node.width * scaleX)) / scaleX;
            offsetY = (AutoResizeUtils.frameSize.height - (size.height - anchorHeight)) / scaleY;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX + distance / scaleX,offsetY - distance / scaleY));
            node.x = lp.x;
            node.y = lp.y;
            break;
        case AutoResizeUtils.LEFT_DOWN:
            offsetX = ((node.anchorX * node.width * scaleX)) / scaleX;
            offsetY = (node.anchorY * node.height * scaleY) / scaleY;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX + distance / scaleX,offsetY + distance / scaleY));
            node.x = lp.x;
            node.y = lp.y;
            break;
        case AutoResizeUtils.RIGHT_UP:
            offsetX = (AutoResizeUtils.frameSize.width - (size.width - anchorWidth)) / scaleX;
            offsetY = (AutoResizeUtils.frameSize.height - (size.height - anchorHeight)) / scaleY;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX - distance / scaleX,offsetY - distance / scaleY));
            node.x = lp.x;
            node.y = lp.y;
            break;
        case AutoResizeUtils.RIGHT_DOWN:
            offsetX = (AutoResizeUtils.frameSize.width - (size.width - anchorWidth)) / scaleX;
            offsetY = (node.anchorY * node.height * scaleY) / scaleY;
            lp = node.parent.convertToNodeSpace(cc.p(offsetX - distance / scaleX,offsetY + distance / scaleY));
            node.x = lp.x;
            node.y = lp.y;
            break;
    }

    AutoResizeUtils.setCenter(node,type);
}

/**
 * 相对位置(无论如何缩放永远相对那个位置)
 * @node        目标对象
 */
AutoResizeUtils.relativelyPostion = function(node)
{
    //系统缩放因子
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();
    var _x;
    var _y;

    _x = AutoResizeUtils.resetNode(node).x;
    _y = AutoResizeUtils.resetNode(node).y;

    var offsetX = _x * (AutoResizeUtils.widthScale / scaleX - 1);
    var offsetY = _y * (AutoResizeUtils.heightScale / scaleY - 1);

    node.x = Math.abs(offsetX) + _x;
    node.y = Math.abs(offsetY) + _y;
}

/**
 * 把某个显示对象缩放到全屏(即将废弃,请使用AutoResizeUtils.stretch)
 * @node         显示对象
 * @isCenter    是否居中
 * @type        居中类型1上下居中  2左右居中 3默认(上，下，左，右居中) 4保持现状
 */
AutoResizeUtils.fullScreen = function(node,isCenter,type)
{
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();

    //先求出缩放后大小，然后再用当然屏幕尺寸求出该缩放多少

    node.setScaleX(AutoResizeUtils.frameSize.width / (node.width * scaleX));
    node.setScaleY(AutoResizeUtils.frameSize.height / (node.height * scaleY));

    if(isCenter == true)
    {
        AutoResizeUtils.setCenter(node,type);
    }
}

//获得真实尺寸(高度，宽度)
AutoResizeUtils.getRealySize = function(node)
{
    //系统缩放因子
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();
    //现在宽度,现在高度(计算了缩放后的大小)
    var nowWidht = node.scaleX * node.width * scaleX;
    var nowHeight = node.scaleY * node.height * scaleY;

    return cc.size(nowWidht,nowHeight);
}

//====================对内====================

/**
 * 水平,横向居中(可以理解为左右居中)
 * @node        目标对象
 */
AutoResizeUtils.horizontalCenter = function(node)
{
    var p = AutoResizeUtils.getCenterP(node);
    node.setPositionX(p.x);
}


/**
 * 垂直,纵向居中(可以理解为上下居中)
 * @node        目标对象
 */
AutoResizeUtils.verticalCenter = function(node)
{
    var p = AutoResizeUtils.getCenterP(node);
    node.setPositionY(p.y);
}

/**
 * 获得居中位置
 * @node        目标对象
 * @target      相对于哪个对象居中(默认或不传是窗口)
 */
AutoResizeUtils.getCenterP = function(node,target)
{
    //系统缩放因子
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();
    var size = AutoResizeUtils.getRealySize(node);
    var targetSize;
    var x;
    var y;
    if(target == null || target == undefined)
    {
        x = (((AutoResizeUtils.frameSize.width - size.width) / 2) + node.anchorX * size.width) * (1 / scaleX);
        y = (((AutoResizeUtils.frameSize.height - size.height) / 2) + node.anchorY * size.height) * (1 / scaleY);
    }
    else
    {
        targetSize = NodeUtils.getRealySize(node);
        x = (((targetSize.width - size.width) / 2) + node.anchorX * size.width) * (1 / scaleX);
        y = (((targetSize.height - size.height) / 2) + node.anchorY * size.height) * (1 / scaleY);
    }

    size = null;
    targetSize = null;
    return node.parent.convertToNodeSpace(cc.p(x,y));
}

/**
 * 重置坐标(防止ui缓存界面重复开关导致坐标越来越偏移)
 */
AutoResizeUtils.resetNode = function(node)
{
    var obj;
    if(node.userData == undefined)//资源缓存导致位置变化
    {
        obj = {};
        obj.x = node.x;
        obj.y = node.y;
        obj.scaleX = node.scaleX;
        obj.scaleY = node.scaleY;
        obj.opacity = node.getOpacity();
        node.userData = obj;
    }
    else
    {
        node.x = node.userData.x;
        node.y = node.userData.y;
        node.setScaleX(node.userData.scaleX);
        node.setScaleY(node.userData.scaleY);
        node.setOpacity(node.userData.opacity);
    }

    return node;
}