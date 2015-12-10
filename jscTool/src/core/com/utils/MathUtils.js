/**
 * Created by ZhouYuLong on 2015/9/2.
 * 数学工具类
 */
var MathUtils = cc.Class.extend({


})

/*
 * 两个点相减
 *
 */
MathUtils.pointSubtract = function( one, two )
{
    var p = cc.p(0,0);
    if( one && two )
    {
        p.x = one.x - two.x;
        p.y = one.y - two.y;
    }
    return p;
}

/*
 * 两个点相加
 *
 */
MathUtils.pointAdd = function( one, two )
{
    var p = cc.p(0,0);
    if( one && two )
    {
        p.x = one.x + two.x;
        p.y = one.y + two.y;
    }
    return p;
}


/**
 * 角度转换弧度
 * @param  angle      角度
 */
MathUtils.angleToRadian = function(angle)
{
    return angle*(Math.PI/180);
}

/**
 * 弧度转换角度
 * @param  radian      弧度
 */
MathUtils.radianToAngle = function(radian)
{
    return radian*(180/Math.PI);
}

/**
 * 两点间距离公式
 * @param p1           点1
 * @param p2           点2
 */
MathUtils.twoPointsDistance = function(p1,p2)
{
    var sum = Math.pow(p2.x - p1.x,2) + Math.pow(p2.y - p1.y,2);
    return Math.sqrt(sum);
}

/**
 * 求三角形面积
 * @param       p1      点1
 * @param       p2      点2
 * @param       p3      点3
 */
MathUtils.triangleArea = function(p1,p2,p3)
{
   var a = MathUtils.twoPointsDistance(p1,p2);
   var b = MathUtils.twoPointsDistance(p1,p3);
   var c = MathUtils.twoPointsDistance(p2,p3);
   var p = (a + b + c) / 2;
   var s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
   return s;
}
