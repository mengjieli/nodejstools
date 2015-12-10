/**
 * Created by ZhouYuLong on 2015/9/1.
 * 2015年9月1日 13:50:16
 * 把地图分成X行,X列的相同格子
 */
var Grid = cc.Class.extend({

    _startNode:null,
    _endNode:null,
    _nodes:null,
    _numCols:null,
    _numRows:null,

    /**
     * @param numCols 行
     * @param numRows 列
     */
    ctor:function(numRows,numCols)
    {
        this._numRows = numRows;
        this._numCols = numCols;
        this._nodes = new Array();

        for(var row = 0; row < this._numRows; row++)
        {
            this._nodes[row] = new Array();
            for(var column = 0; column < this._numCols; column++)
            {
                this._nodes[row][column] = new Node(row, column);
            }
        }
    },

    /**
     * 返回结束节点
     */
    endNode:function()
    {
        return this._endNode;
    },

    /**
     * 返回所有列
     */
    numCols:function()
    {
        return this._numCols;
    },

    /**
     * 返回所有行
     */
    numRows:function()
    {
        return this._numRows;
    },

    /**
     * 返回起始节点
     */
    startNode:function()
    {
        return this._startNode;
    },

    /**
     * 返回所有节点列表
     */
    getNodeArr:function()
    {
        return this._nodes;
    },

    /**
     * 根据行，列返回对应节点
     * @param row		行
     * @param column	列
     */
    getNode:function(row,column)
    {
        return this._nodes[row][column];
    },

    /**
     * 设置结束节点
     * @param row		行
     * @param column	列
     */
    setEndNode:function(row,column)
    {
        this._endNode = this._nodes[row][column];
    },

    /**
     * 设置起始节点
     * @param row		行
     * @param column	列
     */
    setStartNode:function(row,column)
    {
        this._startNode = this._nodes[row][column];
    },

    /**
     * 设置某行，某行是否可行
     * @param row		行
     * @param column	列
     * @param value	false不可行  true可行
     */
    setWalkable:function(row,column,value)
    {
        this._nodes[row][column].walkable = value;
    },

    /**
     * 设置所有Walkable属性
     */
    setAllWalkable:function(value)
    {
        for(var row = 0; row < this._numRows; row++)
         {
            for(var column = 0; column < this._numCols; column++)
            {
                this._nodes[row][column].walkable = value;
            }
         }
    },

    destroy:function()
    {
        this._nodes.length = 0;
        this._nodes = null;
        this._startNode = null;
        this._endNode = null;
    }
})
