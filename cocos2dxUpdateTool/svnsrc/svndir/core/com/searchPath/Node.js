/**
 * Created by ZhouYuLong on 2015/9/1.
 * 2015年9月1日 14:17:01
 * 节点
 */
var Node = cc.Class.extend({

    row:null,
    column:null,
    f:0,
    g:0,
    h:0,
    /**是否可以行走*/
    walkable:null,
    parent:null,
    costMultiplier:1.0,

    ctor:function(row,column)
    {
        this.row = row;
        this.column = column;
    },

})
