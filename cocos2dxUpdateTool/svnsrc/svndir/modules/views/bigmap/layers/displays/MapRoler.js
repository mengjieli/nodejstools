var MapRoler = MapDisplayBase.extend({
    shaderLayer:null,
    data: null,
    id: null,
    cache: null,
    show: null,
    action: null,
    dir: null,
    path: null,
    nextPoint: null,
    moveTime: null,
    moveVX: null,
    moveVY: null,
    moveV: 100,
    selectedShow: null,
    ctor: function (shaderLayer,data) {
        this._super(MapDisplayType.Player);
        this.shaderLayer = shaderLayer;
        this.data = data;
        this.id = data.id;
        this.cache = {};
        this.setCoord(data.coordX, data.coordY);
        this.playAction(Action.Stand, Dir.RightDown);
        trace("初始化角色 id", this.mapId, this.coordX, this.coordY);
    },
    playAction: function (action, dir) {
        if (dir == null) {
            dir = this.dir;
        }
        if (action == this.action && dir == this.dir) {
            return;
        }
        if (this.show) {
            //this.show.retain();
            this.cache[this.action + "_" + this.dir] = this.show;
            this.removeChild(this.show);
            this.show = null;
        }
        this.action = action;
        this.dir = dir;
        if (false && this.cache[action + "_" + dir]) {
            this.show = this.cache[action + "_" + dir];
            this.show.release();
            this.cache[action + "_" + dir] = null;
        } else {
            this.show = RolerAnimationData.getRolerAnimation(this.id, action, dir);
        }
        this.addChild(this.show);
    },
    goDownTheRoad: function (path) {
        if (path == null) return;
        path.shift();
        if (path.length == 0) return;
        this.path = path;
        trace("沿着路走", this.path.length);
        this.scheduleUpdate();
        this.moveToNextPoin();
    },
    moveToNextPoin: function () {
        this.nextPoint = this.path.shift();
        //计算方向
        var dir = "";
        if (this.nextPoint.y == this.coordY) {
            if (this.nextPoint.x == this.coordX + 1) {
                dir = Dir.Right;
            } else {
                dir = Dir.Left;
            }
        } else {
            if (this.coordY % 2 == 0) {
                if (this.nextPoint.x == this.coordX) {
                    if (this.nextPoint.y > this.coordY) {
                        dir = Dir.RightUp;
                    } else {
                        dir = Dir.RightDown
                    }
                } else {
                    if (this.nextPoint.y > this.coordY) {
                        dir = Dir.LeftUp;
                    } else {
                        dir = Dir.LeftDown
                    }
                }
            } else {
                if (this.nextPoint.x == this.coordX) {
                    if (this.nextPoint.y > this.coordY) {
                        dir = Dir.LeftUp;
                    } else {
                        dir = Dir.LeftDown
                    }
                } else {
                    if (this.nextPoint.y > this.coordY) {
                        dir = Dir.RightUp;
                    } else {
                        dir = Dir.RightDown
                    }
                }
            }
        }
        this.playAction(Action.Run, dir);
        //计算速度
        if (dir == Dir.Left || dir == Dir.Right) {
            this.moveTime = MapUtils.width / this.moveV;
            this.moveVX = dir == Dir.Right ? this.moveV : -this.moveV;
            this.moveVY = 0;
        } else {
            this.moveTime = MapUtils.obliqueDis / this.moveV;
            this.moveVX = MapUtils.obliqueCos * this.moveV;
            this.moveVY = MapUtils.obliqueSin * this.moveV;
            if (dir == Dir.RightDown || dir == Dir.LeftDown) {
                this.moveVY = -this.moveVY;
            }
            if (dir == Dir.LeftUp || dir == Dir.LeftDown) {
                this.moveVX = -this.moveVX;
            }
        }
    },
    update: function (dt) {
        //trace("移动", dt, this.path, this.nextPoint);
        this.setPos(this.px + dt * this.moveVX, this.py + dt * this.moveVY);
        this.data.moveTo(this.coordX, this.coordY, this.px, this.py);
        this.moveTime -= dt;
        if (this.moveTime < 0) {
            this.setCoord(this.nextPoint.x, this.nextPoint.y);
            trace("我的点", this.coordX, this.coordY, this.nextPoint.x, this.nextPoint.y);
            this.nextPoint = null;
            if (this.path.length) {
                this.moveToNextPoin();
            } else {
                this.playAction(Action.Stand);
                this.unscheduleUpdate();
            }
        }
    },
    setSelected: function (flag) {
        if (flag == true) {
            if (!this.selectedShow) {
                this.selectedShow = new cc.DrawNode();
                this.addChild(this.selectedShow,-1);
                this.selectedShow.drawPoly(MapBlock.pts, cc.color(255, 0, 0, 40), 1, cc.color(0, 0, 0, 10));
            }
        }
        this.selectedShow.setVisible(flag);
    }
});