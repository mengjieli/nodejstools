/**
 * Created by Administrator on 2015/10/9.
 */

MapEvent = {};
//移动摄像机
MapEvent.ACCEPT_MOVE_CAMERA = "accept_move_camera";

MapEvent.SEND_SERVER_LIST = "send_server_list";

MapCmd = {};
MapCmd.SERVER_LIST = 1;
MapCmd.MOVE_CAMERA = 2;

var MapData = DataBase.extend({


    _myServer:null,

    //服务器列表List（之后要优化成四叉树）
    //{ id:string, pos:cc.p(x,y),rect:cc.size(x,y,width,height),isOpen:bool,list:[ {id:string,pos:cc.p(x.y), rect:cc.rect(x,y width,height)} ]  }
    _servers:null,
    _mapSizeRect:null,       //服务器矩形尺寸

    _cameraPos:null,        //摄像机坐标
    _currentMapRect:null,   //当前地图的大小

    _mapServerRanksSize:null,
    _mapBlockSize:null,

    _AStar:null,

    ctor:function()
    {
        this._mapServerRanksSize = cc.size( 270, 240 );
        this._mapBlockSize = cc.size(9,10);

        //模拟数据
        //var arr = [ cc.p(0,-1),cc.p(1,-1) ,cc.p(-1,0) ,cc.p(0,0) ,cc.p(1,0) ,cc.p(-1,1), cc.p(0,1), cc.p(1,1)];
        var arr = [cc.p(0,0)];
        this.initServers( arr );
    },

    init:function()
    {
        NetMgr.inst().addEventListener( MapCmd.SERVER_LIST, this.nsGetServerList, this );
        return true;
    },

    destroy:function()
    {
        NetMgr.inst().removeEventListener( MapCmd.SERVER_LIST, this.nsGetServerList, this );
    },


    /*
     * 指定坐标点是否可以通行
     */
    isPass:function( pos )
    {

    },
    /*
     * 设置指定点障碍状态
     */
    setObstacle:function( pos, b )
    {

    },

    getServers:function()
    {
        return this._servers;
    },

    initServers:function( arr )
    {

        var min = cc.p(0,0);
        var max = cc.p(0,0);

        var len = arr.length;

        var dic = {};
        for( var i=0; i<len; i++ )
        {
            var item = arr[i];
            min.x = Math.min( item.x, min.x );
            min.y = Math.min( item.y, min.y );

            max.x = Math.max( item.x, max.x );
            max.y = Math.max( item.y, max.y );

            var id = item.x + "_" + item.y;
            dic[id] = item;
        }

        var minRanks = cc.p(0,0);
        minRanks.x = min.x * this._mapServerRanksSize.width;
        minRanks.y = min.y * this._mapServerRanksSize.height;
        var maxRanks = cc.p( 0,0 );
        maxRanks.x = (max.x + 1) * this._mapServerRanksSize.width;
        maxRanks.y = (max.y + 1) * this._mapServerRanksSize.height;
        var star = HexagonUtils.getPixelCoord( minRanks.x, minRanks.y );
        var end = HexagonUtils.getPixelCoord( maxRanks.x, maxRanks.y );

        this._mapSizeRect = cc.rect(0,0,0,0);
        this._mapSizeRect.x = star.x;
        this._mapSizeRect.y = star.y;
        this._mapSizeRect.width = Math.abs( end.x - star.x );
        this._mapSizeRect.height = Math.abs( end.y - star.y );

        this._servers = {};

        var serSize = HexagonUtils.getPixelCoord( this._mapServerRanksSize.width, this._mapServerRanksSize.height );
        for( var i=min.x; i<= max.x; i++ )
        {
            for( var j=min.y; j<=max.y; j++ )
            {
                var id = i + "_" + j;
                var obj = {};

                var rect = cc.rect(0,0,0,0);
                var minp = cc.p( i, j );
                minp.x = minp.x * this._mapServerRanksSize.width;
                minp.y = minp.y * this._mapServerRanksSize.height;
                var pos = HexagonUtils.getPixelCoord( minp.x, minp.y );
                rect.x = pos.x;
                rect.y = pos.y;
                rect.width = serSize.x;
                rect.height = serSize.y;

                obj.id = id;
                obj.pos = cc.p( i,j );
                obj.rect = rect;
                obj.isOpen = false;
                obj.list = [];
                this._servers[ id ] = obj;
            }
        }

        var grid = cc.size(0,0);
        grid.width = this._mapServerRanksSize.width / this._mapBlockSize.width;
        grid.height = this._mapServerRanksSize.height / this._mapBlockSize.height;
        var gridSize =  HexagonUtils.getPixelCoord( grid.width, grid.height );

        for( var key in this._servers )
        {

            var item = this._servers[key];

            if( dic[key] )
            {
                item.isOpen = true;
            }

            for( var i=0; i<this._mapBlockSize.width; i++)
            {
                for (var j = 0; j <this._mapBlockSize.height; j++)
                {
                    var obj = {};

                    var id = i + "_" + j;
                    var x = i * grid.width;
                    var y = j * grid.height;
                    var starPos = HexagonUtils.getPixelCoord( x,y );
                    obj.id = id
                    obj.pos = cc.p( i,j);
                    obj.rect = cc.rect(0,0);
                    obj.rect.x = item.rect.x + starPos.x;
                    obj.rect.y = item.rect.y + starPos.y;
                    obj.rect.width = gridSize.x;
                    obj.rect.height = gridSize.y;
                    item.list.push( obj );
                }
            }
        }
    },

    /**
     * 消息
     */

    ncGetServerList:function()
    {
        if( this._servers == null ) return;
        var msg =  new SocketBytes();
        msg.writeUint( MapCmd.SERVER_LIST );
        NetMgr.inst().send( msg );
    },

    nsGetServerList:function( cmd, buff )
    {
        EventMgr.inst().dispatchEvent( MapEvent.SEND_SERVER_LIST );
    },

    ncMoveCamera:function( rect )
    {

    },


});