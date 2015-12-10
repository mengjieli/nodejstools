/**
 * Created by zhouyulong on 2015/5/22.
 * 碰撞工具类
 */
var HitTestUtils = cc.Class.extend({

})


/**
 * @target      目标区域对象
 * @current     当前区域对象
 * @targetRec   目标区域
 * @currentRec  当前区域
 * 判断一个显示对象是不是包含在另一个显示对象当中
 */
HitTestUtils.inRect = function(target,current,targetRec,currentRec)
{
    var rec;
    var rec1;
    var p;
    var p1;
    if(targetRec != null || targetRec != undefined)
    {
        p = cc.p(targetRec.x,targetRec.y);
        rec = targetRec;
    }
    else
    {
        p = target.parent.convertToWorldSpace(cc.p(target.x - (target.width * target.anchorX),target.y - (target.height * target.anchorY)));
        rec = target.getBoundingBox();
    }
    if(currentRec != null || currentRec != undefined)
    {
        p1 = cc.p(currentRec.x,currentRec.y);
        rec1 = currentRec;
    }
    else
    {
        p1 = current.parent.convertToWorldSpace(cc.p(current.x - (current.width * current.anchorX),current.y - (current.height * current.anchorY)));
        rec1 = current.getBoundingBox();
    }

    if(rec.width < rec1.width)
    {
        cc.error("目标区域似乎小于当前区域");
    }
    else
    {
        if(p1.x >= p.x && rec1.width + p1.x <= rec.width + p.x && p1.y >= p.y && rec1.height + p1.y <= rec.height + rec.y)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
};

/**
 * @target      目标区域对象
 * @current     当前区域对象
 * @targetRec   目标区域
 * @currentRec  当前区域
 * 判断一个点在不在显示对象内
 */
HitTestUtils.pointInRect = function(p,target)
{
    //系统缩放因子
    var scaleX = cc.view.getScaleX();
    var scaleY = cc.view.getScaleY();
    //现在宽度,现在高度(计算了缩放后的大小)
    var nowWidht = target.scaleX * target.width * scaleX;
    var nowHeight = target.scaleY * target.height * scaleY;
    var gp = target.parent.convertToWorldSpace(cc.p(target.x - (nowWidht * target.anchorX),target.y - (nowHeight * target.anchorY)));

    if (p.x >= gp.x && p.x <= gp.x + nowWidht && p.y >= gp.y && p.y <= gp.y + nowHeight)
    {
        return true;
    }

    return false;
}

/**
 * 判断一个点在不在三角形内
 */
HitTestUtils.pointInTriangle = function(p,pos1,pos2,pos3)
{
    var s = MathUtils.triangleArea(pos1,pos2,pos3);
    var s1 = MathUtils.triangleArea(p,pos1,pos2);
    var s2 = MathUtils.triangleArea(p,pos1,pos3);
    var s3 = MathUtils.triangleArea(p,pos2,pos3);
    var sss = Math.round(s1 + s2 + s3);
    if(s == sss)
    {
        return true
    }
    return false;
}