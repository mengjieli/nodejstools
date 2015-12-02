/**
 * Created by ZhouYuLong on 2015/9/1.
 * 2015年9月1日 10:18:21
 */
var AStar = cc.Class.extend({

    _open:null,
    _closed:null,
    _openDic:null,
    _closeDic:null,
    _grid:null,
    _endNode:null,
    _startNode:null,
    _path:null,
    _straightCost:1.0,
    _diagCost:Math.SQRT2,

    ctor:function()
    {
        this._open = new Array();
        this._closed = new Array();
        this._path = new Array();
        this._openDic = new Dictionary();
        this._closeDic = new Dictionary();
    },

    /**
     * 生成的路径
     */
    path:function()
    {
        return this._path;
    },

    /**
     * 找到路径
     * @param grid Grid对象 包含起点和终点
     * @return  true找到 false没找到
     */
    findPath:function(grid)
    {
        this._open.length = 0;
        this._closed.length = 0;
        this._path.length = 0;
        this._openDic.removeAll();
        this._closeDic.removeAll();

        this._grid = grid;
        this._startNode = this._grid.startNode();
        this._endNode = this._grid.endNode();

        this._startNode.g = 0;
        this._startNode.h = 0;
        this._startNode.f = 0;
        //this._startNode.h = this.getH()this._heuristic.call(this,[this._startNode]);
        //this._startNode.f = this._startNode.g + this._startNode.h;

        return this.search();
    },

    search:function()
    {
        var list = [];
        var node = this._startNode;
        while(node != this._endNode)
        {
            list.length = 0;
            for(var a = 0; a < 8; a++)
            {
                var obj = {};
                switch(a)
                {
                    case 0://上
                        if(node.row + 2 < MapUtils.ROW)
                        {
                            obj.row = node.row + 2;
                            obj.column = node.column;
                        }
                        break;
                    case 1://左上
                        if(node.row % 2 == 0)
                        {
                            obj.row = node.row + 1;
                            obj.column = node.column - 1;
                        }
                        else
                        {
                            obj.row = node.row + 1;
                            obj.column = node.column;
                        }
                        break;
                    case 2://左
                        obj.row = node.row;
                        obj.column = node.column - 1;
                        break;
                    case 3://左下
                        if(node.row % 2 == 0)
                        {
                            obj.row = node.row - 1;
                            obj.column = node.column - 1;
                        }
                        else
                        {
                            obj.row = node.row - 1;
                            obj.column = node.column;
                        }
                        break;
                    case 4://下
                        if(node.row - 2 >= 0)
                        {
                            obj.row = node.row - 2;
                            obj.column = node.column;
                        }
                        break;
                    case 5://右下
                        if(node.row % 2 == 0)
                        {
                            obj.row = node.row - 1;
                            obj.column = node.column;
                        }
                        else
                        {
                            obj.row = node.row - 1;
                            obj.column = node.column + 1;
                        }
                        break;
                    case 6://右
                        obj.row = node.row;
                        obj.column = node.column + 1;
                        break;
                    case 7://右上
                        if(node.row % 2 == 0)
                        {
                            obj.row = node.row + 1;
                            obj.column = node.column;
                        }
                        else
                        {
                            obj.row = node.row + 1;
                            obj.column = node.column + 1;
                        }
                        break;
                }
                if(0 <= obj.row && obj.row < MapUtils.ROW && 0 <= obj.column && obj.column < MapUtils.COLUMN)
                {
                    if(this.isClosed(obj) == false)
                    {
                        list.push(obj);
                    }
                }
            }
            for(var b = 0; b < list.length; b++)
            {
                var objNode = list[b];
                var test = this._grid.getNode(objNode.row, objNode.column);
                if(test == node)
                {
                    continue;
                }
                if(test.walkable == false)
                {
                    this._closeDic.push(test.row + "," + test.column,test);
                    continue;
                }
                var nodeP = MapUtils.getPosition(node.row,node.column);
                var testP = MapUtils.getPosition(test.row,test.column);
                var tempNode;
                var tempRow;
                var tempColumn;
                //直上，直下时候左右有一块不能行走，就不可行走
                if(MapUtils.getDirection(nodeP,testP) == AvatarDirection.UP)
                {
                    //左下
                    if(test.row % 2 == 0)
                    {
                        tempRow = test.row - 1;
                        tempColumn = test.column - 1;
                    }
                    else
                    {
                        tempRow = test.row - 1;
                        tempColumn = test.column;
                    }

                    if(tempRow >= 0 && tempColumn >= 0)
                    {
                        tempNode = this._grid.getNode(tempRow,tempColumn);
                        if(tempNode.walkable == false)
                        {
                            continue;
                        }
                    }
                    //右下
                    if(test.row % 2 == 0)
                    {
                        tempRow = test.row - 1;
                        tempColumn = test.column;
                    }
                    else
                    {
                        tempRow = test.row - 1;
                        tempColumn = test.column + 1;
                    }
                    if(tempRow >= 0 && tempColumn >= 0)
                    {
                        tempNode = this._grid.getNode(tempRow,tempColumn);
                        if(tempNode.walkable == false)
                        {
                            continue;
                        }
                    }
                }
                else if(MapUtils.getDirection(nodeP,testP) == AvatarDirection.DOWN)
                {
                    if(test.row % 2 == 0)//左上
                    {
                        tempRow = test.row + 1;
                        tempColumn = test.column - 1;
                    }
                    else
                    {
                        tempRow = test.row + 1;
                        tempColumn = test.column;
                    }
                    if(tempRow < MapUtils.ROW && tempColumn >= 0)
                    {
                        tempNode = this._grid.getNode(tempRow,tempColumn);
                        if(tempNode.walkable == false)
                        {
                            continue;
                        }
                    }
                    if(test.row % 2 == 0)//右上
                    {
                        tempRow = test.row + 1;
                        tempColumn = test.column;
                    }
                    else
                    {
                        tempRow = test.row + 1;
                        tempColumn = test.column + 1;
                    }
                    if(tempRow < MapUtils.ROW && tempColumn < MapUtils.COLUMN)
                    {
                        tempNode = this._grid.getNode(tempRow,tempColumn);
                        if(tempNode.walkable == false)
                        {
                            continue;
                        }
                    }
                }
                var cost = this._straightCost;
                var g = this.getG(node,test);
                var h = this.getH(test);
                var f = g + h;
                if(this.isOpen(test) == true)
                {
                    if(test.f < f)
                    {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.push(test);
                        this._openDic.push(test.row + "," + test.column,test);
                    }
                }
                else
                {
                    test.f = f;
                    test.g = g;
                    test.h = h;
                    test.parent = node;
                    this._open.push(test);
                    this._openDic.push(test.row + "," + test.column,test);
                }
            }
            this._closed.push(node);
            this._closeDic.push(node.row + "," + node.column,node);
            if(this._open.length == 0)
            {
                cc.error("no found path");
                return false
            }
            this._open.sort(this.sortOn);
            node = this._open.shift();
            this._openDic.remove(node.row + "," + node.column);
        }
         this.buildPath();
         return true;
    },

    buildPath:function()
    {
        var node = this._endNode;
        this._path.push(node);
        while(node != this._startNode)
        {
            node = node.parent;
            this._path.unshift(node);
        }
        this._path.shift();//第一个元素就是起点，所以要删除
    },

    isOpen:function(node)
    {
        var testNode = this._openDic.getValue(node.row + "," + node.column);
        if(testNode != null)
        {
            return true;
        }
        return false;
    },

    isClosed:function(node)
    {
        var testNode = this._closeDic.getValue(node.row + "," + node.column);
        if(testNode != null)
        {
            return true;
        }
        return false;
    },

    //到下个点距离
    getG:function(node1,node2)
    {
        var p1 = MapUtils.getPosition(node1.row,node1.column);
        p1.x = p1.x + (MapUtils.TileWidth / 2);
        p1.y = p1.y + (MapUtils.TileHeight / 2);
        var p2 = MapUtils.getPosition(node2.row,node2.column);
        p2.x = p2.x + (MapUtils.TileWidth / 2);
        p2.y = p2.y + (MapUtils.TileHeight / 2);

        return MathUtils.twoPointsDistance(p1,p2);
    },

    //到终点距离
    getH:function(node)
    {
        var node1 = node;
        var node2 = this._endNode;
        if(node1.row == node2.row && node1.column == node2.column)
        {
            return 0;
        }

        var p1 = MapUtils.getPosition(node1.row,node1.column);
        p1.x = p1.x + (MapUtils.TileWidth / 2);
        p1.y = p1.y + (MapUtils.TileHeight / 2);
        var p2 = MapUtils.getPosition(node2.row,node2.column);
        p2.x = p2.x + (MapUtils.TileWidth / 2);
        p2.y = p2.y + (MapUtils.TileHeight / 2);

        return MathUtils.twoPointsDistance(p1,p2);
    },

    openList:function()
    {
        return this._open;
    },

    visited:function()
    {
        return this._closed.concat(_open);
    },

    sortOn:function(before,after)
    {
        if(before.f < after.f)
        {
            return  -1;
        }
        else if(before.f > after.f)
        {
            return 1;
        }
        return 0;
    },

    destroy:function()
    {
        this._open.length = 0;
        this._closed.length = 0;
        this._path.length = 0;
        this._openDic.removeAll();
        this._closeDic.removeAll();
        this._openDic.destroy();
        this._closeDic.destroy();
        this._path = null;
        this._closeDic = null;
        this._openDic = null;
        this._closed = null;
        this._open = null;
        this._grid = null;
        this._startNode = null;
        this._endNode = null;
     }

})
