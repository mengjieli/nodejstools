var MapUtils = (function () {
    function MapUtils() {
    }

    var d = __define, c = MapUtils;
    p = c.prototype;

    MapUtils.len = 52;
    MapUtils.singleWidth = 900;
    MapUtils.singleHeight = 624;
    MapUtils.col = 3; //每个大地图列有多少个小地图
    MapUtils.row = 3; //每个大地图行有多少个小地图
    MapUtils.width = MapUtils.len * Math.sqrt(3);
    MapUtils.obliqueDis = Math.sqrt(MapUtils.len * MapUtils.len * 2.25 + MapUtils.width * MapUtils.width * 0.25); //相邻斜格的距离
    MapUtils.obliqueSin = MapUtils.len * 1.5 / MapUtils.obliqueDis;
    MapUtils.obliqueCos = MapUtils.width * 0.5 / MapUtils.obliqueDis;
    MapUtils.tan = 1 / Math.sqrt(3);
    MapUtils.mapWidth = MapUtils.singleWidth * MapUtils.col;
    MapUtils.mapHeight = MapUtils.singleHeight * MapUtils.row;
    MapUtils.blockWidth = 30;
    MapUtils.blockHeight = 24;
    /**
     * 像素位置(x,y)转换成六边形坐标(x,y)
     * @param x
     * @param y
     */
    MapUtils.transPositionToPoint = function (x, y) {
        x += 0.5 * MapUtils.width;
        y += MapUtils.len;
        var tan = MapUtils.tan;
        var halfLen = MapUtils.len / 2;
        var halfWidth = MapUtils.width / 2;
        var p = cc.p(0, 0);
        var h = Math.floor(y / halfLen);
        if (h % 3 == 0) {
            var w = Math.floor(x / halfWidth);
            if (w % 2 == 0) {
                if (y - h * halfLen - tan * (x - w * halfWidth) < 0) {
                    p.y = Math.floor(h / 3) - 1;
                } else {
                    p.y = Math.floor(h / 3);
                }
            } else {
                if (y - h * halfLen + tan * (x - (w + 1) * halfWidth) < 0) {
                    p.y = Math.floor(h / 3) - 1;
                } else {
                    p.y = Math.floor(h / 3);
                }
            }
        } else {
            p.y = Math.floor(h / 3);
        }
        if (p.y % 2 == 0) {
            p.x = Math.floor(x / (2 * halfWidth));
        } else {
            p.x = Math.floor((x + halfWidth) / (2 * halfWidth)) - 1;
        }
        return p;
    }

    /**
     * 六边形坐标(x,y)转换成像素位置(x,y)
     * @param x
     * @param y
     */
    MapUtils.transPointToPosition = function (x, y) {
        var p = cc.p(0, 0);
        if (y % 2 == 0) {
            p.x = x * MapUtils.width
            p.y = (0.5 * y * 3) * MapUtils.len;
        } else {
            p.x = (x + 0.5) * MapUtils.width;
            p.y = (0.5 * (y - 1) * 3 + 1.5) * MapUtils.len;
        }
        return p;
    }

    /**
     * 计算两点距离
     * @param sx
     * @param sy
     * @param ex
     * @param ey
     * @returns {*}
     */
    MapUtils.getDistance = function (sx, sy, ex, ey) {
        var d = (ey + (sy % 2 == 0 ? (ey > sy ? 1 : (ey < sy ? -1 : 0)) : 0) - sy) / 2;
        var tx = ex + (ey > sy ? Math.floor(d) : -Math.ceil(d));
        d = (ey + (sy % 2 != 0 ? (ey > sy ? 1 : (ey < sy ? -1 : 0)) : 0) - sy) / 2;
        var tx2 = ex - (ey > sy ? Math.floor(d) : -Math.ceil(d));
        tx = Math.abs(tx - sx);
        tx2 = Math.abs(tx2 - sx);
        return tx > tx2 ? tx : tx2;
    }
    return MapUtils;
})();