function MapCamera(name) {
    MapCamera.instance = this;
    //镜头位置
    this.x = 0;
    this.y = 0;
    //六边形坐标
    this.coordX = 0;
    this.coordY = 0;
    //镜头可显示区域
    this.width = 0;
    this.height = 0;
    //可移动范围
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    //缩放
    this.screenWidth = cc.Director.getInstance().getWinSize().width;
    this.screenHeight = cc.Director.getInstance().getWinSize().height;
    this.screenScaleX = this.screenScaleY = 1;//this.screenHeight / 640;
    this.width = Math.ceil(this.screenWidth / this.screenScaleX);
    this.height = Math.ceil(this.screenHeight / this.screenScaleY);
    //是否移动过
    this.moveFlag = true;
    //锁定视角的对象
    this.display = null;
}

/**
 * 初始化
 * @param x 镜头位置
 * @param y
 * @param width 镜头宽
 * @param height
 * @param maxWidth 可视范围宽
 * @param maxHeight
 */
MapCamera.prototype.init = function (x, y, minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.updatePosition(x, y);

    var moduleData = ModuleMgr.inst().getData("BigMapModule");
    var actionData = moduleData.getActionManager();
    actionData.addListener(BigMapActionData.LOCK_DISPLAY, this.lockDisplay, this);
}


MapCamera.prototype.lockDisplay = function (display) {
    if (display == null) {
        if (this.display) {
            this.display.removeListener(MapCamera.MOVE, this.onLockMove, this);
        }
    }
    this.display = display;
    display.addListener(MapCamera.MOVE, this.onLockMove, this);
    this.onLockMove(display.x, display.y);
}

MapCamera.prototype.onLockMove = function (x, y) {
    this.moveTo(x - this.width / 2, y - this.height / 2);
}

MapCamera.prototype.lookAt = function (x, y) {
    this.moveTo(x - this.width / 2, y - this.height / 2);
}

/**
 * 移动多少距离
 * @param moveX
 * @param moveY
 */
MapCamera.prototype.move = function (moveX, moveY) {
    var x = this.x + moveX;
    var y = this.y + moveY;
    this.moveTo(x, y);
}

MapCamera.prototype.moveTo = function (x, y) {
    if (x < this.minX) {
        x = this.minX;
    }
    else if (x > this.maxX - this.width) {
        x = this.maxX - this.width;
    }
    if (y < this.minY) {
        y = this.minY;
    } else if (y > this.maxY - this.height) {
        y = this.maxY - this.height;
    }
    if (this.x != x || this.y != y) {
        this.updatePosition(x, y);
    }
}

/**
 * 更新镜头位置
 * @param x
 * @param y
 */
MapCamera.prototype.updatePosition = function (x, y) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    var p = MapUtils.transPositionToPoint(x, y);
    this.coordX = p.x;
    this.coordY = p.y;
    this.moveFlag = true;
}

/**
 * 检查是否移动过，检查完后把标志位重新设置为 false
 * @returns {boolean}
 */
MapCamera.prototype.checkMove = function () {
    var flag = this.moveFlag;
    this.moveFlag = false;
    return flag;
}

MapCamera.MOVE = "move";

MapCamera.instance = null;
MapCamera.getInstance = function () {
    return MapCamera.instance;
}