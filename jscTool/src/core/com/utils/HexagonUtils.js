/**
 * Created by Administrator on 2015/10/14.
 * 六边行工具，尖朝上
 */


var HexagonUtils = {

    hexagonRadius:0,
    gridSize:null,
    trilateralSize:null,

    /**
     * 初始化六边行，
     * radius ：六边行外圆半径
     */
    initHexagon:function( radius )
    {
        this.hexagonRadius = radius;

        this.trilateralSize = cc.size(0,0);   //三角两个边长

        this.trilateralSize.width = Math.floor( radius *  Math.cos( 30 * Math.PI/180 ));
        this.trilateralSize.height = radius / 2;


        this.gridSize = cc.size(0,0);
        this.gridSize.width = this.trilateralSize.width * 2;
        this.gridSize.height = this.hexagonRadius * 2;
    },

    /**
     * 获取像素坐标
     * @param  x          列
     * @param  y          行
     * @return cc.p
     */
    getPixelCoord : function( x,y )
    {
        var p = cc.p();

        if( y % 2 == 0)
        {
            p.x = this.gridSize.width * x;
            p.y = ( (this.gridSize.height >> 1 ) + this.trilateralSize.height) * y;
        }
        else
        {
            p.x = this.trilateralSize.width + (this.gridSize.width * x);
            p.y = ( ( this.gridSize.height >> 1 ) + this.trilateralSize.height) * y;
        }

        return p;
    },

    /**
     * 根据六边行中心坐标获取行列
     * @param   x
     * @param   y
     * @return cc.p ： p.x列，p.y行
     */
    getRanksByCentralPoint : function( x ,y )
    {
        var p = cc.p();
        if( y % 2 == 0)
        {
            p.x = Math.floor( x /  this.gridSize.width );
            p.y = Math.floor( y / ( (this.gridSize.height >> 1 ) + this.trilateralSize.height) );
        }
        else
        {
            p.x =  Math.floor( (x - this.trilateralSize.width) / this.gridSize.width ) ;
            p.y = Math.floor( y / ( (this.gridSize.height >> 1 ) + this.trilateralSize.height) );
        }

        return p;
    },

    /**
     * 获取行列
     * @param   x 列
     * @param   y 行
     * @return cc.p
     */
    getRanks : function( x,y )
    {
        var p = cc.p();

        //if(row % 2 == 0)
        //{
        //    p.x = 2 * MapUtils.X * column;
        //    p.y = (MapUtils.Y + MapUtils.SideLength) * row;
        //}
        //else
        //{
        //    p.x = MapUtils.X + (2 * MapUtils.X * column);
        //    p.y = (MapUtils.Y + MapUtils.SideLength) * row;
        //}

        return p;
    }
};

HexagonUtils.initHexagon( 52 );

